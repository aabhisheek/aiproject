/**
 * Money validation and handling utilities
 * Critical for preventing floating-point errors and ensuring data correctness
 */

/**
 * Validates that amount is a valid monetary value
 * - Must be positive
 * - Maximum 2 decimal places
 * - No scientific notation
 */
export function validateAmount(amount: string): { valid: boolean; error?: string } {
  // Check if empty
  if (!amount || amount.trim() === '') {
    return { valid: false, error: 'Amount is required' };
  }

  // Check format: positive number with optional decimals (max 2 places)
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  if (!amountRegex.test(amount)) {
    return {
      valid: false,
      error: 'Amount must be a positive number with maximum 2 decimal places (e.g., 123.45)',
    };
  }

  // Parse and check if positive
  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  // Check reasonable limits (max 10 digits before decimal)
  if (parsed > 9999999999.99) {
    return { valid: false, error: 'Amount is too large' };
  }

  return { valid: true };
}

/**
 * Safely parses amount string to ensure it's valid
 * Returns null if invalid
 */
export function parseAmount(amount: string): number | null {
  const validation = validateAmount(amount);
  if (!validation.valid) {
    return null;
  }
  return parseFloat(amount);
}

/**
 * Formats amount for display with currency symbol
 */
export function formatAmount(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₹${num.toFixed(2)}`;
}
