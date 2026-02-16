const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Send WhatsApp message via AiSensy
 * @param {string} to - The recipient's phone number (with country code)
 * @param {string} campaignName - The AiSensy Campaign Name
 * @param {object} params - Additional parameters (userName, templateParams, etc.)
 * @returns {Promise<object>} - The API response
 */
const sendAiSensyWhatsApp = async (to, campaignName, params = {}) => {
  try {
    const { userName = 'User', templateParams = [] } = params;
    const finalCampaignName = campaignName || config.aisensy.campaignName;

    if (!config.aisensy.apiKey) {
      throw new Error('AiSensy API Key is not configured');
    }

    if (!finalCampaignName) {
        throw new Error('AiSensy Campaign Name is not configured');
    }

    logger.info(`Sending AiSensy WhatsApp to ${to} using campaign ${finalCampaignName}`);

    const payload = {
      apiKey: config.aisensy.apiKey,
      campaignName: finalCampaignName,
      destination: to,
      userName: userName,
      templateParams: templateParams,
      // media: {} // Generic support for media can be added here
    };



    const response = await axios.post(config.aisensy.apiUrl, payload);

    logger.info('AiSensy message sent successfully');
    return response.data;
  } catch (error) {
    logger.error(`Error sending AiSensy message: ${error.message}`);
    if (error.response) {
        // Log detailed error from AiSensy
        logger.error(`AiSensy Error Status: ${error.response.status}`);
        logger.error('AiSensy Error Data:', error.response.data);
    }
    throw error;
  }
};

module.exports = {
  sendAiSensyWhatsApp,
};
