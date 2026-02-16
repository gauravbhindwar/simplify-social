const { Router } = require('express');
const { body } = require('express-validator');
const { handleSendWhatsApp } = require('../controllers/whatsapp.controller');

const router = Router();

router.post(
  '/send',
  [
    body('to')
      .notEmpty().withMessage('Recipient phone number is required')
      .matches(/^\+[1-9]\d{6,14}$/).withMessage('Phone number must be in E.164 format (e.g. +919876543210)'),
    
    // Message is required ONLY IF contentSid is NOT provided
    body('message').custom((value, { req }) => {
        if (!req.body.contentSid && !value && !req.body.mediaUrl) {
            throw new Error('Message body is required when not sending a template or media');
        }
        return true;
    }),

    body('contentSid').optional().isString(),
    body('contentVariables').optional().isObject(),
    body('mediaUrl').optional(),
  ],
  handleSendWhatsApp
);

module.exports = router;
