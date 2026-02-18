import config from './config/index.js';
import app from './app.js';
import logger from './utils/logger.js';

app.listen(config.port, () => {
  logger.info(`🚀 Simplify Social API running on port ${config.port}`);
  logger.info(`📄 Swagger docs: http://localhost:${config.port}/api-docs`);
  logger.info(`🔒 API key auth: ${config.authEnabled ? 'ENABLED' : 'DISABLED'}`);
  logger.info(`📡 Environment: ${config.nodeEnv}`);
});
