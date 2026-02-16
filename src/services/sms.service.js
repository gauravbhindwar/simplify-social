const twilio = require('twilio');
const config = require('../config');
const logger = require('../utils/logger');

let client = null;

function getClient() {
  if (!client) {
    if (!config.twilio.accountSid || !config.twilio.authToken) {
      throw new Error('Twilio credentials are not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env');
    }
    client = twilio(config.twilio.accountSid, config.twilio.authToken);
  }
  return client;
}

/**
 * Send an SMS message via Twilio
 * @param {string} to - Recipient phone number in E.164 format
 * @param {string} body - Message body
 * @returns {Promise<object>} Twilio message response
 */
async function sendSMS(to, body) {
  logger.info(`Sending SMS to ${to}`);
  const twilioClient = getClient();
  
  try {
    const message = await twilioClient.messages.create({
      body,
      from: config.twilio.phoneNumber, // Use the configured Twilio phone number
      to,
    });

    logger.info(`SMS sent successfully — SID: ${message.sid}`);
    return {
      success: true,
      sid: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
      dateCreated: message.dateCreated,
    };
  } catch (error) {
    logger.error(`Error sending SMS to ${to}: ${error.message}`);
    throw error;
  }
}

module.exports = { sendSMS };
