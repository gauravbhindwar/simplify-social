console.log('Starting test-meta.js...');
const { sendWhatsAppCloud } = require('../src/services/whatsapp-cloud.service');
console.log('Service loaded.');
require('dotenv').config();

const targetNumber = process.argv[2];

if (!targetNumber) {
  console.error('Please provide a target phone number in E.164 format (e.g., 919876543210)');
  process.exit(1);
}

async function testMeta() {
  console.log('Testing Meta WhatsApp Cloud Configuration...');
  console.log(`Phone Number ID: ${process.env.META_PHONE_NUMBER_ID}`);
  console.log(`WABA ID: ${process.env.META_WABA_ID}`);
  
  try {
    console.log(`\nSending WhatsApp Cloud message to ${targetNumber}...`);
    const result = await sendWhatsAppCloud(targetNumber, 'Hello from Simplify Social! This is a test message via Meta Cloud API.');
    console.log('Meta Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Meta Failed:', error.message);
    if (error.response) {
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testMeta();
