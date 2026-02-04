/**
 * Server Entry Point
 * SYNCHRONOUS STARTUP for Render deployment
 * Starts server immediately, connects DB in background
 */

// VERY EARLY LOG - runs before any imports
console.log('🔥🔥🔥 SERVER.JS FILE EXECUTED 🔥🔥🔥');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());
console.log('PORT from env:', process.env.PORT);

import { createApp } from './app';
import { PrismaClient } from '@prisma/client';
import { logger } from './utils/logger.util';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
console.log('✅ dotenv loaded');

const prisma = new PrismaClient();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

console.log(`PORT: ${PORT}`);

// START SERVER SYNCHRONOUSLY - NO ASYNC, NO WAITING
console.log('🚀 Starting server NOW (synchronous)...');

try {
  console.log('🔧 Creating Express app...');
  const app = createApp();
  console.log('✅ Express app created');

  console.log(`🔧 Starting server on 0.0.0.0:${PORT}...`);
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅✅✅ SERVER LISTENING ON PORT ${PORT} ✅✅✅`);
    logger.info(`Server started`, { port: PORT });
  });

  server.on('listening', () => {
    const addr = server.address();
    console.log(`✅✅✅ LISTENING EVENT: ${JSON.stringify(addr)} ✅✅✅`);
  });

  server.on('error', (err: Error) => {
    console.error('❌ SERVER ERROR:', err);
  });

  // Connect DB in background (non-blocking)
  prisma.$connect()
    .then(() => console.log('✅ Database connected'))
    .catch((err) => console.error('❌ DB error (non-fatal):', err));

  // Graceful shutdown
  const shutdown = () => {
    console.log('Shutting down...');
    server.close(() => {
      prisma.$disconnect().then(() => process.exit(0));
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  console.log('✅ Server startup complete - process staying alive');

} catch (error) {
  console.error('❌❌❌ FATAL ERROR ❌❌❌');
  console.error(error);
  // Don't exit - let Render see the error
}
