const { sendWhatsApp } = require('../src/services/whatsapp.service');
require('dotenv').config();

const targetNumber = '+919006045930';
const customMessage = 'Hello! This is a custom test message from Simplify Social via Twilio Sandbox.';

console.log('Testing Twilio Custom Message...');

(async () => {
    try {
        console.log(`Sending to ${targetNumber}: "${customMessage}"`);
        
        const response = await sendWhatsApp(targetNumber, customMessage);
        
        console.log('Twilio Success:', response);
    } catch (error) {
        console.error('Twilio Failed:', error.message);
        if (error.code) {
             console.error('Error Code:', error.code);
             console.error('More Info:', error.moreInfo);
        }
    }
})();
