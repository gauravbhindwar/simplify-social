# Simplify Social API

Company-wide REST API for sending **SMS** (via Edumarc) and **WhatsApp** messages (via Twilio).

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
| `GET` | `/api-docs` | Swagger UI | ❌ |

## Authentication

Protected endpoints require the `x-api-key` header:

```bash
curl -X POST http://localhost:3000/api/v1/sms/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"to": "+919876543210", "message": "Hello!"}'
```

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
| `TWILIO_ACCOUNT_SID` | Twilio Account SID (for WhatsApp) |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token (for WhatsApp) |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp sender number |
| `EDUMARC_API_KEY` | Edumarc API Key (for SMS) |
