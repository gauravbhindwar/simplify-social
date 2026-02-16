const { sendTemplateMessage } = require('../src/services/whatsapp.service');
require('dotenv').config();

// User provided values
const targetNumber = '+919006045930';
const contentSid = 'HXb5b62575e6e4ff6129ad7c8efe1f983e';
const contentVariables = {
    "1": "12/1",
    "2": "3pm"
};

console.log('Testing Twilio Content Template...');

(async () => {
    try {
        console.log(`Sending Template ${contentSid} to ${targetNumber}...`);
        
        const response = await sendTemplateMessage(
            targetNumber, 
            contentSid, 
            contentVariables
        );
        
        console.log('Twilio Success:', response);
    } catch (error) {
        console.error('Twilio Failed:', error.message);
        if (error.code) {
             console.error('Error Code:', error.code);
             console.error('More Info:', error.moreInfo);
        }
    }
})();
