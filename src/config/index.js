import dotenv from 'dotenv';

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
};

export default config;
