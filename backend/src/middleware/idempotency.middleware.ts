

/**
 * Idempotency Middleware
 * Critical: Handles duplicate requests from network retries, page refreshes, and double-clicks
 * 
 * Flow:
 * 1. Extract Idempotency-Key from header
 * 2. Check if key exists in database
 * 3. If exists: return cached response (prevents duplicate operations)
 * 4. If new: proceed and cache response after success
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request to store idempotency data
export interface RequestWithIdempotency extends Request {
  idempotencyKey?: string;
}

/**
 * Idempotency middleware for POST requests
 * Ensures that retrying the same request doesn't create duplicates
 */
export async function idempotencyMiddleware(
  req: RequestWithIdempotency,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Only apply to POST requests (idempotent operations)
  if (req.method !== 'POST') {
    next();
    return;
  }

  const idempotencyKey = req.headers['idempotency-key'] as string;

  // Require idempotency key for all POST requests
  if (!idempotencyKey) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Idempotency-Key header is required for POST requests',
    });
    return;
  }

  // Validate key format (should be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(idempotencyKey)) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Idempotency-Key must be a valid UUID',
    });
    return;
  }

  try {
    // Check if we've seen this idempotency key before
    const existingRecord = await prisma.idempotencyStore.findUnique({
      where: { key: idempotencyKey },
    });

    if (existingRecord) {
      // Check if record is expired
      if (new Date() > existingRecord.expiresAt) {
        // Expired - delete and process as new
        await prisma.idempotencyStore.delete({
          where: { key: idempotencyKey },
        });
      } else {
        // Valid cached response exists - return it
        // Logging handled by main request logger
        
        // Return the cached response with 200 OK (not 201, since it's already created)
        const cachedResponse = existingRecord.response as any;
        res.status(200).json(cachedResponse);
        return;
      }
    }

    // Store key for later use
    req.idempotencyKey = idempotencyKey;

    // Intercept the response to cache it
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      // Only cache successful responses (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Store response asynchronously (don't block the response)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24-hour TTL

        prisma.idempotencyStore
          .create({
            data: {
              key: idempotencyKey,
              response: body,
              expiresAt,
            },
          })
          .catch(() => {
            // If duplicate key (race condition), that's fine - another request won
            // Silently ignore - not critical
          });
      }

      return originalJson(body);
    };

    next();
  } catch (error) {
    // Error logged by global error handler
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process idempotency check',
    });
  }
}

/**
 * Cleanup function to remove expired idempotency records
 * Should be called periodically (e.g., daily cron job)
 */
export async function cleanupExpiredIdempotencyRecords(): Promise<number> {
  const result = await prisma.idempotencyStore.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  
  return result.count;
}
