import { Router } from 'express';
import { body } from 'express-validator';
import { handleSendWhatsApp } from '../controllers/whatsapp.controller.js';

const router = Router();

router.post(
  '/send',
  [
    body('to')
      .notEmpty().withMessage('Recipient phone number is required')
      .matches(/^\+[1-9]\d{6,14}$/).withMessage('Phone number must be in E.164 format (e.g. +919876543210)'),
    
    // Message is required ONLY IF templateName is NOT provided
    body('message').custom((value, { req }) => {
        if (!req.body.templateName && !value && !req.body.mediaUrl) {
            throw new Error('Message body is required when not sending a template or media');
        }
        return true;
    }),

    body('templateName').optional().isString(),
    body('templateVariables').optional().isObject(),
    body('languageCode').optional().isString(),
    body('mediaUrl').optional(),
  ],
  handleSendWhatsApp
);

export default router;
