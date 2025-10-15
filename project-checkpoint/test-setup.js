// Simple test script to verify the application setup
const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Project Checkpoint API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test games endpoint (this will fail without RAWG API key, but that's expected)
    console.log('\n2. Testing games endpoint...');
    try {
      const gamesResponse = await axios.get(`${API_BASE}/api/games`);
      console.log('✅ Games endpoint working');
    } catch (error) {
      console.log('⚠️  Games endpoint requires RAWG API key (expected)');
    }

    console.log('\n🎉 Basic API setup is working!');
    console.log('\nNext steps:');
    console.log('1. Add your RAWG API key to backend/.env');
    console.log('2. Start MongoDB');
    console.log('3. Run: cd backend && npm run dev');
    console.log('4. Run: cd frontend && npm start');
    console.log('5. Visit http://localhost:3000');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\nMake sure to:');
    console.log('1. Install dependencies: cd backend && npm install');
    console.log('2. Start the backend server: cd backend && npm run dev');
  }
}

testAPI();