# Simplify Social API

Company-wide REST API for sending **SMS**, **WhatsApp**, **Google RCS**, and more messaging services.

## Quick Start

```bash
# 1. Copy env template and fill in your values
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Start dev server (auto-restarts on file changes)
npm run dev

# 4. Open Swagger docs
open http://localhost:3000/api-docs
```

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `GET` | `/api/v1/health` | Health check | ❌ |
| `POST` | `/api/v1/sms/send` | Send SMS | ✅ |
| `POST` | `/api/v1/whatsapp/send` | Send WhatsApp | ✅ |
| `POST` | `/api/v1/whatsapp-cloud/send` | Send WhatsApp (Meta Cloud) | ✅ |
| `POST` | `/api/v1/rcs/send` | Send RCS message | ✅ |
| `POST` | `/api/v1/rcs/send-text` | Send RCS text | ✅ |
| `POST` | `/api/v1/rcs/send-media` | Send RCS with media | ✅ |
| `POST` | `/api/v1/rcs/send-with-replies` | Send RCS with suggested replies | ✅ |
| `GET` | `/api-docs` | Swagger UI | ❌ |

## Authentication

Protected endpoints require the `x-api-key` header:

```bash
curl -X POST http://localhost:3000/api/v1/sms/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"to": "+919876543210", "message": "Hello!"}'
```

## Services

### SMS
Send SMS messages via Twilio or Fast2SMS

### WhatsApp
Send WhatsApp messages via Twilio or Meta Cloud API

### Google RCS
Send rich communication services messages with text, media, and interactive replies

For detailed Google RCS setup, see [GOOGLE_RCS_SETUP.md](./GOOGLE_RCS_SETUP.md)

## Deploy with Docker

```bash
docker-compose up -d
```

## Configuration

All config is via environment variables — see `.env.example` for the full list.

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 3000) |
| `API_KEY` | API key for auth (empty = auth disabled) |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `META_USER_TOKEN` | Meta/WhatsApp Cloud API token |
| `GOOGLE_RCS_SERVICE_ACCOUNT_JSON` | Google RCS service account JSON |
| `GOOGLE_RCS_PROJECT_ID` | Google Cloud Project ID |

See `.env.example` for all available options.
