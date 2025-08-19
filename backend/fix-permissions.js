const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixPermissions() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'tpa_portal'
  });

  console.log('🔧 Checking current permissions format...');
  const [roles] = await connection.execute('SELECT id, role_name, permissions FROM user_roles');
  
  for (const role of roles) {
    console.log(`Role: ${role.role_name}, Permissions: ${role.permissions}`);
  }

  console.log('\n🔧 Checking column type...');
  const [columns] = await connection.execute(`SHOW COLUMNS FROM user_roles WHERE Field = 'permissions'`);
  console.log('Permissions column:', columns[0]);

  console.log('\n🔧 Fixing permissions format with proper JSON...');
  
  // Fix permissions to be valid JSON arrays - use direct string values
  const updates = [
    { 
      id: 1, 
      permissions: '["view_courses","enroll_courses","take_surveys","view_own_reports"]'
    },
    { 
      id: 2, 
      permissions: '["view_courses","enroll_courses","take_surveys","view_own_reports","manage_team","approve_training","view_team_reports"]'
    },
    { 
      id: 3, 
      permissions: '["all_courses","manage_courses","create_surveys","view_all_reports","manage_users","system_settings"]'
    },
    { 
      id: 4, 
      permissions: '["all_permissions"]'
    }
  ];

  for (const update of updates) {
    await connection.execute(
      'UPDATE user_roles SET permissions = ? WHERE id = ?',
      [update.permissions, update.id]
    );
    console.log(`✅ Updated role ${update.id} permissions`);
  }

  console.log('\n🔍 Verifying updated permissions...');
  const [updatedRoles] = await connection.execute('SELECT id, role_name, permissions FROM user_roles');
  
  for (const role of updatedRoles) {
    console.log(`Role: ${role.role_name}`);
    console.log(`Permissions: ${role.permissions}`);
    try {
      const parsed = JSON.parse(role.permissions);
      console.log(`✅ Valid JSON, contains: ${parsed.join(', ')}`);
    } catch (e) {
      console.log(`❌ Invalid JSON: ${e.message}`);
    }
    console.log('---');
  }

  await connection.end();
  console.log('\n🎉 Permissions format fixed!');
}

fixPermissions().catch(console.error);
