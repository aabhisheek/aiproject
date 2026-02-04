/**
 * Idempotency utility
 * Generates unique keys for request deduplication
 */

/**
 * Generates a UUID v4 for idempotency keys
 * Each form submission gets a unique key
 * The same key is used for all retries
 */
export function generateIdempotencyKey(): string {
  // Generate UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
