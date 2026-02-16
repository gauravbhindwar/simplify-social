const dotenv = require('dotenv');

// Load env vars early
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  authEnabled: process.env.AUTH_ENABLED === 'true',
  apiKey: process.env.API_KEY || '',

  meta: {
    userToken: process.env.META_USER_TOKEN || '',
    phoneNumberId: process.env.META_PHONE_NUMBER_ID || '',
    wabaId: process.env.META_WABA_ID || '', 
    phoneNumber: process.env.META_PHONE_NUMBER || '',
    apiUrl: 'https://graph.facebook.com/v17.0',
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },

  fast2sms: {
    apiKey: process.env.FAST2SMS_API_KEY || '',
    route: process.env.FAST2SMS_ROUTE || 'dlt',
    senderId: process.env.FAST2SMS_SENDER_ID || '',
    apiUrl: 'https://www.fast2sms.com/dev/bulkV2',
  },

  aisensy: {
    apiKey: process.env.AISENSY_API_KEY || '',
    projectId: process.env.AISENSY_PROJECT_ID || '',
    campaignName: process.env.AISENSY_CAMPAIGN_NAME || '',
    apiUrl: 'https://backend.aisensy.com/campaign/t1/api/v2', // Default endpoint, will verify
  },
};

module.exports = config;
