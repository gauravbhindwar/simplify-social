const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Send SMS via Fast2SMS
 * @param {string} to - Recipient phone number (without country code if strict, but usually India requires it, checking docs: "numbers" parameter)
 * @param {string} message - Message text
 * @returns {Promise<object>} API response
 */
async function sendFast2SMS(to, message) {
  logger.info(`Sending Fast2SMS message to ${to}`);

  if (!config.fast2sms.apiKey) {
    throw new Error('Fast2SMS API Key (FAST2SMS_API_KEY) is missing in .env');
  }

  try {
    // Fast2SMS expects numbers as comma separated values
    // Removing '+' if present as most Indian SMS gateways expect 10 digits or 12 digits without +
    const numbers = to.replace(/^\+/, ''); 

    const response = await axios.get(config.fast2sms.apiUrl, {
      params: {
        authorization: config.fast2sms.apiKey,
        route: config.fast2sms.route,
        sender_id: config.fast2sms.senderId,
        message: message,
        variables_values: '',
        flash: 0,
        numbers: numbers,
      }
    });

    logger.info(`Fast2SMS message sent successfully to ${to}`);
    return {
      success: true,
      to,
      provider: 'fast2sms',
      data: response.data,
    };

  } catch (error) {
    logger.error('Error sending Fast2SMS message', {
      error: error.message,
      response: error.response?.data
    });
    throw error;
  }
}

module.exports = { sendFast2SMS };
