import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Simple API-key authentication middleware.
 * Expects the key in the `x-api-key` header.
 * If API_KEY env var is empty, auth is disabled (dev convenience).
 */
function apiKeyAuth(req, res, next) {
  // Skip auth if disabled via env or if no key is configured
  if (!config.authEnabled || !config.apiKey) {
    return next();
  }

  const provided = req.headers['x-api-key'];

  if (!provided) {
    logger.warn(`Unauthorized request — missing x-api-key header from ${req.ip}`);
    return res.status(401).json({
      success: false,
      error: 'Missing x-api-key header',
    });
  }

  if (provided !== config.apiKey) {
    logger.warn(`Unauthorized request — invalid API key from ${req.ip}`);
    return res.status(403).json({
      success: false,
      error: 'Invalid API key',
    });
  }

  next();
}

export default apiKeyAuth;
