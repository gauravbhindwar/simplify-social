import { Router } from 'express';
import { body } from 'express-validator';
import { handleSendWhatsAppCloud } from '../controllers/whatsapp-cloud.controller.js';

const router = Router();

router.post(
  '/send',
  [
    body('to')
      .notEmpty().withMessage('Recipient phone number is required')
      .matches(/^[1-9]\d{6,14}$/).withMessage('Phone number must be digits only (e.g. 919876543210)'),
    body('message')
      .notEmpty().withMessage('Message body is required')
      .isLength({ max: 4096 }).withMessage('Message too long (max 4096 chars)'),
  ],
  handleSendWhatsAppCloud
);

export default router;
