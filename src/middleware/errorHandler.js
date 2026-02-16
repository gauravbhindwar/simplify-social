const logger = require('../utils/logger');

/**
 * Global error handler middleware.
 * Catches all unhandled errors thrown by controllers/services.
 */
function errorHandler(err, _req, res, _next) {
  logger.error(err.message, { stack: err.stack });

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
