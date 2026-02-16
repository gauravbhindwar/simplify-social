const { sendSMS } = require('../src/services/sms.service');
const { sendWhatsApp } = require('../src/services/whatsapp.service');
require('dotenv').config();

const targetNumber = process.argv[2];

if (!targetNumber) {
  console.error('Please provide a target phone number in E.164 format (e.g., +1234567890)');
  process.exit(1);
}

async function testTwilio() {
  console.log('Testing Twilio Configuration...');
  
  try {
    console.log(`\nSending SMS to ${targetNumber}...`);
    const smsResult = await sendSMS(targetNumber, 'Hello from Simplify Social! This is a test SMS.');
    console.log('SMS Result:', smsResult);
  } catch (error) {
    console.error('SMS Failed:', error.message);
  }

  try {
    console.log(`\nSending WhatsApp to ${targetNumber}...`);
    const whatsappResult = await sendWhatsApp(targetNumber, 'Hello from Simplify Social! This is a test WhatsApp message.');
    console.log('WhatsApp Result:', whatsappResult);
  } catch (error) {
    console.error('WhatsApp Failed:', error.message);
  }
}

testTwilio();
