import app from './app';
import { config, validateConfig } from './config/environment';
import { connectDatabase } from './config/database';
import { logger } from './shared/utils/logger';

// Validate configuration
try {
  validateConfig();
} catch (error: any) {
  logger.error('Configuration validation failed:', error.message);
  process.exit(1);
}

// Connect to database
connectDatabase();

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`);
  logger.info(`📡 API endpoint: http://localhost:${PORT}/api/${config.apiVersion}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

export default server;
