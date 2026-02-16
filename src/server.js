const config = require('./config');
const app = require('./app');
const logger = require('./utils/logger');

app.listen(config.port, () => {
  logger.info(`🚀 Simplify Social API running on port ${config.port}`);
  logger.info(`📄 Swagger docs: http://localhost:${config.port}/api-docs`);
  logger.info(`🔒 API key auth: ${config.authEnabled ? 'ENABLED' : 'DISABLED'}`);
  logger.info(`📡 Environment: ${config.nodeEnv}`);
});
