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
    body('message')
      .notEmpty().withMessage('Message body is required')
      .isLength({ max: 1600 }).withMessage('Message must be 1600 characters or fewer'),
  ],
  handleSendWhatsApp
);

module.exports = router;
