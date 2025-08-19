const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🚀 Starting database initialization...');
    
    // First connect without specifying a database to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Read the complete setup SQL file
    const setupSqlPath = path.join(__dirname, '..', 'database', 'complete_setup.sql');
    
    if (!fs.existsSync(setupSqlPath)) {
      console.error('❌ Setup SQL file not found at:', setupSqlPath);
      return;
    }

    const setupSQL = fs.readFileSync(setupSqlPath, 'utf8');
    console.log('📖 Read database setup script');

    // Execute the complete setup script
    console.log('⚙️  Executing database setup...');
    await connection.query(setupSQL);
    
    console.log('✅ Database setup completed successfully!');

    // Now test the connection to the new database
    await connection.end();
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tpa_portal'
    });

    console.log('✅ Connected to tpa_portal database');

    // Verify the setup by checking tables and users
    console.log('🔍 Verifying database setup...');
    
    const [tables] = await connection.execute("SHOW TABLES");
    console.log(`📋 Created ${tables.length} tables`);

    const [roles] = await connection.execute("SELECT * FROM user_roles");
    console.log(`👥 Created ${roles.length} user roles`);

    const [users] = await connection.execute("SELECT COUNT(*) as count FROM users");
    console.log(`👤 Created ${users[0].count} users`);

    const [testUser] = await connection.execute(
      "SELECT id, email, first_name, role_id FROM users WHERE email = 'admin@tpa-portal.com'"
    );

    if (testUser.length > 0) {
      console.log('✅ Test admin user found:', testUser[0]);
    } else {
      console.log('❌ Test admin user not found');
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@tpa-portal.com / password123');
    console.log('   Manager: ops.manager@tpa-portal.com / password123');
    console.log('   Employee: jane.doe@tpa-portal.com / password123');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    if (error.sql) {
      console.error('SQL Error:', error.sql.substring(0, 200) + '...');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the initialization
initializeDatabase();
