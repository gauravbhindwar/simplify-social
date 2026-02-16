const { validationResult } = require('express-validator');
const { sendWhatsApp } = require('../services/whatsapp.service');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/v1/whatsapp/send:
 *   post:
 *     summary: Send a WhatsApp message
 *     tags: [WhatsApp]
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
 *                 description: Recipient phone number in E.164 format
 *                 example: "+919876543210"
 *               message:
 *                 type: string
 *                 description: Message body
 *                 example: "Hello from Simplify on WhatsApp!"
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

    const { to, message } = req.body;
    const result = await sendWhatsApp(to, message);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('WhatsApp send failed', { error: error.message });
    next(error);
  }
}

module.exports = { handleSendWhatsApp };
