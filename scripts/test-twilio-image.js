const { sendWhatsApp } = require('../src/services/whatsapp.service');
require('dotenv').config();

const targetNumber = '+919006045930';
const messageBody = 'Here is an image sent via Twilio!';
// Using Twilio's official demo image to ensure compatibility
const imageUrl = 'https://demo.twilio.com/owl.png'; 

console.log('Testing Twilio Image Message...');

(async () => {
    try {
        console.log(`Sending to ${targetNumber} with image...`);
        
        const response = await sendWhatsApp(targetNumber, messageBody, imageUrl);
        
        console.log('Twilio Success:', response);
    } catch (error) {
        console.error('Twilio Failed:', error.message);
        if (error.code) {
             console.error('Error Code:', error.code);
             console.error('More Info:', error.moreInfo);
        }
    }
})();
