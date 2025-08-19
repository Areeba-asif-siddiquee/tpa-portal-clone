const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'password123';
  const saltRounds = 12;
  
  console.log('Generating hash for password:', password);
  
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Generated hash:', hash);
  
  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash validation test:', isValid ? '✅ Valid' : '❌ Invalid');
  
  // Test against current hash
  const currentHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewiTcZDUqxb0xvIu';
  const currentValid = await bcrypt.compare(password, currentHash);
  console.log('Current hash validation test:', currentValid ? '✅ Valid' : '❌ Invalid');
}

generateHash();
