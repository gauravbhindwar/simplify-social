import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import apiKeyAuth from './middleware/apiKeyAuth.js';
import errorHandler from './middleware/errorHandler.js';

import healthRoutes from './routes/health.routes.js';
import smsRoutes from './routes/sms.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';
import whatsappCloudRoutes from './routes/whatsapp-cloud.routes.js';

import config from './config/index.js';

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
      { url: '/', description: 'Current Server (Relative)' },
      { url: `http://localhost:${config.port}`, description: 'Localhost' },
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

export default app;
