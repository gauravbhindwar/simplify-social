#!/usr/bin/env node

/**
 * Test script for Google RCS messaging
 * Usage: node scripts/test-google-rcs.js
 */

const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_KEY = process.env.API_KEY || 'test-api-key';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testSendTextRCS() {
  try {
    log(colors.cyan, '\n━━━ Testing: Send Text RCS Message ━━━');
    const response = await client.post('/api/v1/rcs/send-text', {
      to: '+919876543210',
      message: 'Hello from Simplify! This is a test RCS message.',
    });
    log(colors.green, '✓ Text RCS sent successfully');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    log(colors.red, '✗ Text RCS failed');
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

async function testSendRCSWithMedia() {
  try {
    log(colors.cyan, '\n━━━ Testing: Send RCS with Media ━━━');
    const response = await client.post('/api/v1/rcs/send-media', {
      to: '+919876543210',
      message: 'Check out this image!',
      mediaUrl: 'https://via.placeholder.com/400x300?text=RCS+Test',
    });
    log(colors.green, '✓ Media RCS sent successfully');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    log(colors.red, '✗ Media RCS failed');
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

async function testSendRCSWithSuggestedReplies() {
  try {
    log(colors.cyan, '\n━━━ Testing: Send RCS with Suggested Replies ━━━');
    const response = await client.post('/api/v1/rcs/send-with-replies', {
      to: '+919876543210',
      message: 'Which option do you prefer?',
      suggestedReplies: ['Option A', 'Option B', 'Option C'],
    });
    log(colors.green, '✓ RCS with suggested replies sent successfully');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    log(colors.red, '✗ RCS with suggested replies failed');
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

async function testAutoDetectSend() {
  try {
    log(colors.cyan, '\n━━━ Testing: Auto-Detect Send ━━━');
    const response = await client.post('/api/v1/rcs/send', {
      to: '+919876543210',
      message: 'This will auto-detect the content type',
      suggestedReplies: ['Got it', 'Thanks'],
    });
    log(colors.green, '✓ Auto-detect send successful');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    log(colors.red, '✗ Auto-detect send failed');
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

async function testValidationError() {
  try {
    log(colors.cyan, '\n━━━ Testing: Validation Error (Invalid Phone Number) ━━━');
    const response = await client.post('/api/v1/rcs/send-text', {
      to: 'invalid-number',
      message: 'This should fail',
    });
    log(colors.red, '✗ Should have failed validation');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response?.status === 400) {
      log(colors.green, '✓ Validation error caught correctly');
      console.log('Error response:', JSON.stringify(error.response.data, null, 2));
    } else {
      log(colors.red, '✗ Unexpected error');
      console.error('Error:', error.message);
    }
  }
}

async function testHealthCheck() {
  try {
    log(colors.cyan, '\n━━━ Testing: Health Check ━━━');
    const response = await axios.get(`${BASE_URL}/api/v1/health`);
    log(colors.green, '✓ Health check passed');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    log(colors.red, '✗ Health check failed');
    console.error('Error:', error.message);
    return null;
  }
}

async function runAllTests() {
  log(colors.cyan, '\n╔════════════════════════════════════════╗');
  log(colors.cyan, '║   Google RCS Messaging Test Suite      ║');
  log(colors.cyan, '╚════════════════════════════════════════╝');

  log(colors.yellow, `\nBase URL: ${BASE_URL}`);
  log(colors.yellow, `API Key: ${API_KEY ? '✓ Set' : '✗ Not set'}`);

  // Run tests
  await testHealthCheck();
  await testValidationError();
  await testSendTextRCS();
  await testSendRCSWithMedia();
  await testSendRCSWithSuggestedReplies();
  await testAutoDetectSend();

  log(colors.cyan, '\n╔════════════════════════════════════════╗');
  log(colors.cyan, '║        Test Suite Complete             ║');
  log(colors.cyan, '╚════════════════════════════════════════╝\n');
}

// Run tests
runAllTests().catch((error) => {
  log(colors.red, `Fatal error: ${error.message}`);
  process.exit(1);
});
