import twilio from 'twilio';
import config from '../config/index.js';
import logger from '../utils/logger.js';

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
 * Send a WhatsApp message via Twilio
 * @param {string} to - Recipient phone number in E.164 format (e.g. +919876543210)
 * @param {string} body - Message body
 * @param {string|string[]} [mediaUrl] - Optional URL(s) of media to send
 * @returns {Promise<object>} Twilio message response
 */
async function sendWhatsApp(to, body, mediaUrl) {
  logger.info(`Sending WhatsApp message to ${to}`);
  const twilioClient = getClient();

  const messageOptions = {
    body,
    from: `whatsapp:${config.twilio.whatsappNumber}`,
    to: `whatsapp:${to}`,
  };

  if (mediaUrl) {
      messageOptions.mediaUrl = Array.isArray(mediaUrl) ? mediaUrl : [mediaUrl];
  }

  // Twilio WhatsApp requires whatsapp: prefix
  const message = await twilioClient.messages.create(messageOptions);

  logger.info(`WhatsApp message sent successfully — SID: ${message.sid}`);
  return {
    sid: message.sid,
    status: message.status,
    to: message.to,
    from: message.from,
    dateCreated: message.dateCreated,
  };
}

/**
 * Send a WhatsApp Content Template message via Twilio
 * @param {string} to - Recipient phone number in E.164 format
 * @param {string} contentSid - The Twilio Content Template SID (e.g. HX...)
 * @param {object} contentVariables - Key-value pairs for template variables (e.g. {"1":"12/1"})
 * @returns {Promise<object>} Twilio message response
 */
async function sendTemplateMessage(to, contentSid, contentVariables) {
    logger.info(`Sending WhatsApp template ${contentSid} to ${to}`);
    const twilioClient = getClient();
  
    // Ensure contentVariables is a string if passed as object
    const variablesStr = typeof contentVariables === 'string' 
        ? contentVariables 
        : JSON.stringify(contentVariables);
  
    const message = await twilioClient.messages.create({
      from: `whatsapp:${config.twilio.whatsappNumber}`,
      to: `whatsapp:${to}`,
      contentSid: contentSid,
      contentVariables: variablesStr,
      // body is not required/allowed when using contentSid
    });
  
    logger.info(`WhatsApp template message sent successfully — SID: ${message.sid}`);
    return {
      sid: message.sid,
      status: message.status,
      to: message.to,
      from: message.from,
      dateCreated: message.dateCreated,
    };
  }

export { sendWhatsApp, sendTemplateMessage };
