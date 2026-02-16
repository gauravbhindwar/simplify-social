console.log('1. Start Debug');
try {
  const config = require('../src/config');
  console.log('2. Config Loaded:', config);
  const logger = require('../src/utils/logger');
  console.log('3. Logger Loaded');
  logger.info('4. Logger Test Info');
  const service = require('../src/services/whatsapp-cloud.service');
  console.log('5. Service Loaded');
  const { sendWhatsAppCloud } = service;
  
  (async () => {
    try {
      console.log('6. Sending message...');
      // Using hardcoded number for test
      const target = '919006045930'; 
      const res = await sendWhatsAppCloud(target, 'Test from debug-logger');
      console.log('7. Result:', res);
    } catch (e) {
       console.error('API Call ERROR:', e.message);
       if (e.response) console.error('Response:', e.response.data);
    }
    console.log('8. End Debug');
  })();

} catch (e) {
  console.error('Top Level ERROR:', e);
}
