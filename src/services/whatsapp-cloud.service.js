import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Send a WhatsApp message via Meta Cloud API
 * @param {string} to - Recipient phone number in E.164 format (no +)
 * @param {string} body - Message body
 * @returns {Promise<object>} API response
 */
async function sendWhatsAppCloud(to, body) {
  logger.info(`Sending WhatsApp Cloud message to ${to}`);

  if (!config.meta.phoneNumberId || !config.meta.userToken) {
    throw new Error('Meta credentials (META_PHONE_NUMBER_ID, META_USER_TOKEN) are missing in .env');
  }
  
  // Remove '+' if present, Meta usually expects digits
  const recipient = to.replace(/^\+/, '');

  try {
    const url = `${config.meta.apiUrl}/${config.meta.phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'text',
      text: { body: body },
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${config.meta.userToken}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info(`WhatsApp Cloud message sent successfully to ${to}`);
    return {
      success: true,
      to,
      provider: 'meta-cloud',
      data: response.data,
    };

  } catch (error) {
    logger.error('Error sending WhatsApp Cloud message', { 
      error: error.message,
      response: error.response?.data 
    });
    throw error;
  }
}

export { sendWhatsAppCloud };
