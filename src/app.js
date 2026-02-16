const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const apiKeyAuth = require('./middleware/apiKeyAuth');
const errorHandler = require('./middleware/errorHandler');

const healthRoutes = require('./routes/health.routes');
const smsRoutes = require('./routes/sms.routes');
const whatsappRoutes = require('./routes/whatsapp.routes');
const whatsappCloudRoutes = require('./routes/whatsapp-cloud.routes');

const config = require('./config');

// ── Swagger config ──────────────────────────
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simplify Social API',
      version: '1.0.0',
      description: 'Company-wide API for sending SMS, WhatsApp messages and more social media integrations.',
      contact: { name: 'Simplify Team' },
    },
    servers: [
      { url: `http://localhost:${config.port}`, description: 'Local dev' },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
    },
    security: [{ ApiKeyAuth: [] }],
  },
  apis: [
    './src/controllers/*.js',
    './src/routes/*.js',
  ],
});

// ── Express app ─────────────────────────────
const app = express();

// Trust proxy (needed for correct protocol detection behind Coolify/Traefik)
app.set('trust proxy', 1);

// Security headers
// Disable upgrade-insecure-requests to allow HTTP access to Swagger docs
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'upgrade-insecure-requests': null,
      },
    },
  })
);

// CORS — allow all origins (tighten in production)
app.use(cors());

// Rate limiting — 100 requests per 15 min per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests, please try again later.' },
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morgan('short'));

// ── Swagger docs (no auth required) ─────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Simplify Social API Docs',
}));

// ── Public routes ───────────────────────────
app.use('/api/v1/health', healthRoutes);

// ── Protected routes ────────────────────────
app.use('/api/v1/sms', apiKeyAuth, smsRoutes);
app.use('/api/v1/whatsapp', apiKeyAuth, whatsappRoutes);
app.use('/api/v1/whatsapp-cloud', apiKeyAuth, whatsappCloudRoutes);

// ── Root ─────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    service: 'Simplify Social API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/v1/health',
  });
});

// ── 404 ──────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Global error handler ─────────────────────
app.use(errorHandler);

module.exports = app;
