import { validationResult } from 'express-validator';
import { sendWhatsAppCloud } from '../services/whatsapp-cloud.service.js';
import logger from '../utils/logger.js';

/**
 * @swagger
 * /api/v1/whatsapp-cloud/send:
 *   post:
 *     summary: Send a WhatsApp message via Meta Cloud API
 *     tags: [WhatsApp Cloud]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [to, message]
 *             properties:
 *               to:
 *                 type: string
 *                 description: Recipient phone number (e.g. 919876543210)
 *                 example: "919876543210"
 *               message:
 *                 type: string
 *                 description: Message body
 *                 example: "Hello from Meta Cloud API!"
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to send message
 */
async function handleSendWhatsAppCloud(req, res, next) {
  try {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { to, message } = req.body;
    const result = await sendWhatsAppCloud(to, message);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('WhatsApp Cloud send failed', { error: error.message });
    next(error);
  }
}

export { handleSendWhatsAppCloud };
