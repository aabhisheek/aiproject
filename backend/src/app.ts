/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import expenseRoutes from './routes/expense.routes';
import { errorHandler } from './middleware/error.middleware';
import { ExpenseController } from './controllers/expense.controller';
import { logger } from './utils/logger.util';

const controller = new ExpenseController();

export function createApp(): Application {
  const app = express();

  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Idempotency-Key'],
  };
  app.use(cors(corsOptions));

  // Body parser with size limits (security)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging middleware with timing
  app.use((req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    // Log request start (debug level)
    logger.debug(`→ ${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    // Capture response
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.request(req.method, req.path, res.statusCode, duration);
    });

    next();
  });

  // Health check endpoint
  app.get('/health', controller.healthCheck.bind(controller));

  // API routes
  app.use('/api', expenseRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    logger.warn(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`,
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
