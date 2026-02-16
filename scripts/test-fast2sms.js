const { sendFast2SMS } = require('../src/services/fast2sms.service');
require('dotenv').config();

const targetNumber = process.argv[2];

if (!targetNumber) {
  console.error('Please provide a target phone number (e.g., 9999999999)');
  process.exit(1);
}

(async () => {
  console.log('Testing Fast2SMS Configuration...');
  try {
    console.log(`\nSending Fast2SMS to ${targetNumber}...`);
    const result = await sendFast2SMS(targetNumber, 'Test message from Simplify Social via Fast2SMS.');
    console.log('Fast2SMS Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Fast2SMS Failed:', error.message);
    if (error.response) {
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
})();
