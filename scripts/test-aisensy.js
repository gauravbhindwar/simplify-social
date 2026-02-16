const { sendAiSensyWhatsApp } = require('../src/services/aisensy.service');
require('dotenv').config();

const targetNumber = process.argv[2];
const campaignName = process.argv[3]; // Optional: Pass campaign name as 2nd arg

if (!targetNumber) {
  console.log('Usage: node scripts/test-aisensy.js <phoneNumber> [campaignName]');
  process.exit(1);
}

console.log('Testing AiSensy Configuration...');

(async () => {
    try {
        console.log(`Sending AiSensy WhatsApp to ${targetNumber}...`);
        
        // Example params - adjust based on your actual template
        // If your template has {{1}}, pass one param.
        const params = {
            userName: 'Test User',
            templateParams: ['1234'] // Example OTP or var
        };

        const response = await sendAiSensyWhatsApp(targetNumber, campaignName, params);
        console.log('AiSensy Success:', response);
    } catch (error) {
        console.error('AiSensy Failed:', error.message);
        if (error.response) {
            // Use console.log for object inspection instead of stringify to avoid circular error
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
})();
