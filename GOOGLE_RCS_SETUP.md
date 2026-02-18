# Google RCS (Rich Communication Services) Integration

This project now includes support for Google RCS messaging via the Google Business Messages API. RCS enables richer, more interactive messaging experiences with features like media, suggested replies, and more.

## Setup

### 1. Prerequisites

- A Google Cloud Project with the Business Messages API enabled
- Service account credentials (for OAuth) or an API key (for simpler testing)
- Business Messages agent ID

### 2. Environment Variables

Add these to your `.env` file:

```bash
# Google RCS Configuration
# Method 1: Using API Key (Simple approach for testing)
GOOGLE_RCS_USE_API_KEY=true
GOOGLE_RCS_API_KEY=your_api_key_here

# Method 2: Using Service Account (OAuth - Recommended for production)
GOOGLE_RCS_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"your-project","private_key":"...","client_email":"...","client_id":"..."}'

# Other Google RCS settings
GOOGLE_RCS_PROJECT_ID=your-project-id
GOOGLE_RCS_AGENT_ID=your-agent-id
GOOGLE_RCS_CONVERSATION_STARTERS=false
```

### 3. Getting Started with Google Business Messages

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project

2. **Enable the Business Messages API**:
   - In Cloud Console, enable the "Business Messages API"

3. **Create a Service Account**:
   - Go to Service Accounts page
   - Create a new service account
   - Generate a JSON key
   - Download and copy the JSON content to `GOOGLE_RCS_SERVICE_ACCOUNT_JSON` in `.env`

4. **Create an RCS Agent**:
   - Follow Google's Business Messages [documentation](https://developers.google.com/business-communications/business-messages/guides)
   - Get your Agent ID

## API Endpoints

All RCS endpoints require the `x-api-key` header for authentication.

### Send Text Message

```http
POST /api/v1/rcs/send-text
Content-Type: application/json
x-api-key: your_api_key

{
  "to": "+919876543210",
  "message": "Hello from Simplify!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv123",
    "messageId": "msg456",
    "to": "+919876543210",
    "status": "sent",
    "timestamp": "2026-02-18T10:30:00.000Z"
  }
}
```

### Send Message with Media

```http
POST /api/v1/rcs/send-media
Content-Type: application/json
x-api-key: your_api_key

{
  "to": "+919876543210",
  "message": "Check out this image!",
  "mediaUrl": "https://example.com/image.jpg"
}
```

### Send Message with Suggested Replies

```http
POST /api/v1/rcs/send-with-replies
Content-Type: application/json
x-api-key: your_api_key

{
  "to": "+919876543210",
  "message": "Do you like this?",
  "suggestedReplies": ["Yes", "No", "Maybe"]
}
```

### Auto-Detect Send

Automatically detects the content type based on provided fields:

```http
POST /api/v1/rcs/send
Content-Type: application/json
x-api-key: your_api_key

{
  "to": "+919876543210",
  "message": "Hello!",
  "mediaUrl": "https://example.com/image.jpg",
  "suggestedReplies": ["OK", "Thanks"]
}
```

## Features

### Text Messages
- Send plain text RCS messages
- Support for up to 1600 characters

### Rich Media
- Send images and videos
- Automatic rich card formatting
- Media alternative text support

### Suggested Replies
- Up to 5 suggested reply options
- Interactive user engagement
- Character limit per reply: 100 characters

### Error Handling
- Comprehensive error logging
- Validation of phone numbers (E.164 format)
- Integration with your existing error handling middleware

## File Structure

```
src/
├── services/
│   └── google-rcs.service.js      # Core RCS API integration
├── controllers/
│   └── google-rcs.controller.js    # Request handlers
├── routes/
│   └── google-rcs.routes.js        # Route definitions
└── config/
    └── index.js                    # Configuration management
```

## Testing

```bash
# Test text message
curl -X POST http://localhost:3000/api/v1/rcs/send-text \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "to": "+919876543210",
    "message": "Hello from Simplify!"
  }'

# Test with media
curl -X POST http://localhost:3000/api/v1/rcs/send-media \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "to": "+919876543210",
    "message": "Check this out!",
    "mediaUrl": "https://example.com/image.jpg"
  }'

# Test with suggested replies
curl -X POST http://localhost:3000/api/v1/rcs/send-with-replies \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "to": "+919876543210",
    "message": "Choose an option",
    "suggestedReplies": ["Option 1", "Option 2", "Option 3"]
  }'
```

## Documentation

Full API documentation is available at `/api-docs` with interactive Swagger UI.

## Architecture

The RCS implementation follows the same pattern as other messaging services (SMS, WhatsApp):

1. **Routes** - Define endpoints and validation
2. **Controllers** - Handle HTTP requests and responses
3. **Services** - Implement business logic and API integration
4. **Config** - Centralize environment and configuration settings

This consistent architecture makes it easy to add new messaging channels or modify existing ones.

## Production Considerations

1. **Security**:
   - Always use OAuth (service account) in production, not API keys
   - Store credentials securely in environment variables
   - Implement rate limiting (already enabled)
   - Use HTTPS only

2. **Scalability**:
   - Consider implementing message queuing for bulk sends
   - Add connection pooling for the Google API client
   - Implement retry logic with exponential backoff

3. **Monitoring**:
   - Log all message sends and failures
   - Monitor API rate limits
   - Track message delivery status
   - Set up alerts for failures

4. **Webhooks**:
   - Implement webhook handlers for delivery receipts
   - Track message status (sent, delivered, read)
   - Handle user replies through webhooks

## References

- [Google Business Messages API Docs](https://developers.google.com/business-communications/business-messages/reference/rest)
- [Business Messages Guides](https://developers.google.com/business-communications/business-messages/guides)
- [RCS Overview](https://developers.google.com/business-communications/business-messages/learn)
