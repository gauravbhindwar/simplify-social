import { validationResult } from 'express-validator';
import { sendWhatsApp, sendTemplateMessage } from '../services/whatsapp.service.js';
import logger from '../utils/logger.js';

/**
 * @swagger
 * /api/v1/whatsapp/send:
 *   post:
 *     summary: Send a WhatsApp message (Text, Media, or Template)
 *     tags: [WhatsApp]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient phone number in E.164 format
 *                 example: "+919876543210"
 *               message:
 *                 type: string
 *                 description: Message body (for text messages)
 *                 example: "Hello from Simplify on WhatsApp!"
 *               mediaUrl:
 *                 type: string
 *                 description: URL of media to send (optional)
 *                 example: "https://demo.twilio.com/owl.png"
 *               contentSid:
 *                 type: string
 *                 description: Twilio Content Template SID (optional)
 *                 example: "HXb5b62575e6e4ff6129ad7c8efe1f983e"
 *               contentVariables:
 *                 type: object
 *                 description: Variables for the template (optional)
 *                 example: {"1":"12/1", "2":"3pm"}
 *     responses:
 *       200:
 *         description: WhatsApp message sent successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to send WhatsApp message
 */
async function handleSendWhatsApp(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { to, message, mediaUrl, contentSid, contentVariables } = req.body;
    let result;

    if (contentSid) {
        // Send Template Message
        result = await sendTemplateMessage(to, contentSid, contentVariables);
    } else {
        // Send Freeform Message (Text/Media)
        result = await sendWhatsApp(to, message, mediaUrl);
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('WhatsApp send failed', { error: error.message });
    next(error);
  }
}

export { handleSendWhatsApp };
