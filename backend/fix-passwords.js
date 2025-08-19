const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixPasswords() {
  let connection;
  
  try {
    console.log('🔧 Fixing user passwords...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tpa_portal'
    });

    console.log('✅ Connected to database');

    // Generate correct hash for password123
    const password = 'password123';
    const saltRounds = 12;
    const correctHash = await bcrypt.hash(password, saltRounds);
    
    console.log('🔑 Generated correct password hash');

    // Update all users with the correct hash
    const [result] = await connection.execute(
      'UPDATE users SET password_hash = ? WHERE password_hash IS NOT NULL',
      [correctHash]
    );

    console.log(`✅ Updated ${result.affectedRows} user passwords`);

    // Test the fix
    const [testUser] = await connection.execute(
      "SELECT * FROM users WHERE email = 'admin@tpa-portal.com'"
    );

    if (testUser.length > 0) {
      const user = testUser[0];
      const isValid = await bcrypt.compare('password123', user.password_hash);
      console.log('🔑 Password validation test:', isValid ? '✅ Valid' : '❌ Invalid');
      
      if (isValid) {
        console.log('🎉 All passwords fixed successfully!');
        console.log('\n📝 Updated login credentials:');
        console.log('   All users now use password: password123');
        console.log('   - Admin: admin@tpa-portal.com');
        console.log('   - Manager: ops.manager@tpa-portal.com');
        console.log('   - Employee: jane.doe@tpa-portal.com');
      }
    }

  } catch (error) {
    console.error('❌ Failed to fix passwords:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixPasswords();
