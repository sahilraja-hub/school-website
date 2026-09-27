import { createApp } from './app';
import { config } from './config';
import { connectDB } from './config/db';
import { autoSeedIfEmpty } from './utils/seed';

const startServer = async () => {
  const app = createApp();

  // Connect to Database
  const db = await connectDB();
  if (db) {
    await autoSeedIfEmpty();
  }

  const server = app.listen(config.port, () => {
    console.log(`\n🏫 ===============================================`);
    console.log(`🚀 Oakridge Academy API Server is running!`);
    console.log(`📡 URL: http://localhost:${config.port}`);
    console.log(`🌐 Health Check: http://localhost:${config.port}/api/health`);
    console.log(`🔒 Mode: ${config.nodeEnv}`);
    console.log(`===============================================\n`);
  });

  const shutdown = async () => {
    console.log('\nGracefully shutting down...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
