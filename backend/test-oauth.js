const axios = require('axios');

async function testOauth() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/oauth-callback', {
      code: 'mock_google_code',
      provider: 'google'
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

testOauth();
