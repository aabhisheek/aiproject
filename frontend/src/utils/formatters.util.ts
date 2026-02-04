/**
 * Formatting utilities
 * Money and date display helpers
 */

/**
 * Formats amount as currency with proper decimal places
 * @param amount - String or number amount
 * @returns Formatted string like "₹123.45"
 */
export function formatMoney(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) {
    return '₹0.00';
  }
  
  // Format with 2 decimal places and thousands separator
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Formats ISO date string to readable format
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date like "31 Jan 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Gets today's date in YYYY-MM-DD format
 * Useful for date input default value
 */
export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Validates amount format on client side
 * @param amount - String amount to validate
 * @returns true if valid
 */
export function validateAmountFormat(amount: string): boolean {
  // Positive number with max 2 decimal places
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(amount) && parseFloat(amount) > 0;
}



