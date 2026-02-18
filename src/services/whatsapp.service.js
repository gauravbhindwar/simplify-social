import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Send a WhatsApp message via Meta Cloud API
 * @param {string} to - Recipient phone number in E.164 format (e.g. +919876543210)
 * @param {string} body - Message body
 * @param {string|string[]} [mediaUrl] - Optional URL(s) of media to send
 * @returns {Promise<object>} Meta API response
 */
async function sendWhatsApp(to, body, mediaUrl) {
  logger.info(`Sending WhatsApp message to ${to}`);

  if (!config.meta.phoneNumberId || !config.meta.userToken) {
    throw new Error('Meta credentials (META_PHONE_NUMBER_ID, META_USER_TOKEN) are missing in .env');
  }

  // Remove '+' if present, Meta usually expects digits
  const recipient = to.replace(/^\+/, '');

  try {
    const url = `${config.meta.apiUrl}/${config.meta.phoneNumberId}/messages`;

    let payload;

    if (mediaUrl) {
      // Send media message
      const mediaArray = Array.isArray(mediaUrl) ? mediaUrl : [mediaUrl];
      payload = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'image', // Can be image, document, audio, video, etc.
        image: { link: mediaArray[0] }, // Use first URL
      };
    } else {
      // Send text message
      payload = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: { body },
      };
    }

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${config.meta.userToken}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info(`WhatsApp message sent successfully to ${to}`);
    return {
      success: true,
      to,
      provider: 'meta-cloud',
      messageId: response.data?.messages?.[0]?.id,
      data: response.data,
    };
  } catch (error) {
    logger.error('Error sending WhatsApp message', {
      error: error.message,
      response: error.response?.data,
    });
    throw error;
  }
}

/**
 * Send a WhatsApp template message via Meta Cloud API
 * @param {string} to - Recipient phone number in E.164 format
 * @param {string} templateName - The template name (e.g. "hello_world")
 * @param {object} [templateVariables] - Parameters for template placeholders (e.g. {"1":"value1", "2":"value2"})
 * @param {string} [languageCode] - Language code (default: en_US)
 * @returns {Promise<object>} Meta API response
 */
async function sendTemplateMessage(to, templateName, templateVariables, languageCode = 'en_US') {
  logger.info(`Sending WhatsApp template "${templateName}" to ${to}`);

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
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
      },
    };

    // Add template parameters if provided
    if (templateVariables && Object.keys(templateVariables).length > 0) {
      payload.template.parameters = {
        body: {
          parameters: Object.values(templateVariables).map((val) => ({ type: 'text', text: val })),
        },
      };
    }

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${config.meta.userToken}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info(`WhatsApp template message sent successfully to ${to}`);
    return {
      success: true,
      to,
      provider: 'meta-cloud',
      messageId: response.data?.messages?.[0]?.id,
      data: response.data,
    };
  } catch (error) {
    logger.error('Error sending WhatsApp template message', {
      error: error.message,
      response: error.response?.data,
    });
    throw error;
  }
}

export { sendWhatsApp, sendTemplateMessage };
