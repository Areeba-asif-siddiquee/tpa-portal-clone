const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'tpa_portal'
    });

    console.log('✅ Database connection successful');

    // Check if tables exist
    const [tables] = await connection.execute("SHOW TABLES");
    console.log('📋 Tables in database:', tables.map(t => Object.values(t)[0]));

    // Check user_roles table
    console.log('\n👥 Checking user_roles...');
    try {
      const [roles] = await connection.execute("SELECT * FROM user_roles");
      console.log('Roles found:', roles);
    } catch (error) {
      console.log('❌ Error with user_roles:', error.message);
    }

    // Check users table
    console.log('\n👤 Checking users...');
    try {
      const [users] = await connection.execute("SELECT id, email, first_name, last_name, role_id FROM users LIMIT 5");
      console.log('Users found:', users);
    } catch (error) {
      console.log('❌ Error with users:', error.message);
    }

    // Test specific login credential
    console.log('\n🔐 Testing login credential: admin@tpa-portal.com');
    try {
      const [loginTest] = await connection.execute(
        "SELECT * FROM users WHERE email = ?", 
        ['admin@tpa-portal.com']
      );
      
      if (loginTest.length > 0) {
        console.log('✅ Admin user found');
        const user = loginTest[0];
        
        // Test password verification
        const testPassword = 'password123';
        const isValid = await bcrypt.compare(testPassword, user.password_hash);
        console.log('🔑 Password test result:', isValid ? '✅ Valid' : '❌ Invalid');
        console.log('📝 User data:', {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          role_id: user.role_id
        });
      } else {
        console.log('❌ Admin user not found');
      }
    } catch (error) {
      console.log('❌ Error testing login:', error.message);
    }

    await connection.end();
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  }
}

testDatabase();
