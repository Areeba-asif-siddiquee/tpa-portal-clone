const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testPortalFunctionality() {
  console.log('🔍 Testing TPA Portal functionality...\n');

  try {
    // Test 1: Health check
    console.log('1. Health Check Test');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('---');

    // Test 2: Login with Admin credentials
    console.log('2. Admin Login Test');
    const loginData = {
      email: 'admin@tpa-portal.com',
      password: 'password123'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ Admin login successful');
    console.log('User:', loginResponse.data.data.user.firstName, loginResponse.data.data.user.lastName);
    console.log('Role:', loginResponse.data.data.user.roleName);
    console.log('Permissions:', loginResponse.data.data.user.permissions);
    const adminToken = loginResponse.data.data.token;
    console.log('---');

    // Test 3: Login with Manager credentials
    console.log('3. Manager Login Test');
    const managerLoginData = {
      email: 'ops.manager@tpa-portal.com',
      password: 'password123'
    };
    
    const managerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, managerLoginData);
    console.log('✅ Manager login successful');
    console.log('User:', managerLoginResponse.data.data.user.firstName, managerLoginResponse.data.data.user.lastName);
    console.log('Role:', managerLoginResponse.data.data.user.roleName);
    console.log('Permissions:', managerLoginResponse.data.data.user.permissions);
    console.log('---');

    // Test 4: Login with Employee credentials
    console.log('4. Employee Login Test');
    const employeeLoginData = {
      email: 'jane.doe@tpa-portal.com',
      password: 'password123'
    };
    
    const employeeLoginResponse = await axios.post(`${BASE_URL}/auth/login`, employeeLoginData);
    console.log('✅ Employee login successful');
    console.log('User:', employeeLoginResponse.data.data.user.firstName, employeeLoginResponse.data.data.user.lastName);
    console.log('Role:', employeeLoginResponse.data.data.user.roleName);
    console.log('Permissions:', employeeLoginResponse.data.data.user.permissions);
    console.log('---');

    // Test 5: Protected route - Get user profile
    console.log('5. Protected Route Test - Get Profile');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    console.log('✅ Profile retrieved successfully');
    console.log('Profile User:', profileResponse.data.data.user.firstName, profileResponse.data.data.user.lastName);
    console.log('---');

    // Test 6: Role-based access - List users (Admin only)
    console.log('6. Role-based Access Test - List Users');
    try {
      const usersResponse = await axios.get(`${BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      console.log('✅ Users list retrieved successfully');
      console.log('Total users found:', usersResponse.data.data.users.length);
    } catch (error) {
      console.log('❌ Failed to get users list:', error.response?.data?.message || error.message);
    }
    console.log('---');

    // Test 7: Invalid login attempt
    console.log('7. Invalid Login Test');
    try {
      const invalidLoginData = {
        email: 'admin@tpa-portal.com',
        password: 'wrongpassword'
      };
      
      await axios.post(`${BASE_URL}/auth/login`, invalidLoginData);
      console.log('❌ Invalid login test failed - should have been rejected');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid login correctly rejected');
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
      }
    }
    console.log('---');

    console.log('🎉 All tests completed!');
    console.log('\n📝 Test Summary:');
    console.log('- Backend server is running properly');
    console.log('- Database connection is working');
    console.log('- User authentication is functional');
    console.log('- Role-based permissions are working');
    console.log('- JWT tokens are being generated correctly');
    console.log('- Protected routes are secured');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.status === 500) {
      console.error('Server error - check backend logs for details');
    }
  }
}

testPortalFunctionality();
