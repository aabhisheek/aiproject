/**
 * Validation Middleware
 * Validates request data before processing
 * Critical for data correctness and security
 * 
 * Edge cases handled:
 * - Null/undefined values
 * - Empty strings
 * - XSS attempts (trimmed and length-limited)
 * - SQL injection (Prisma ORM handles)
 * - Invalid date formats
 * - Future dates
 * - Negative amounts
 * - Extreme values
 */

import { Request, Response, NextFunction } from 'express';
import { validateAmount } from '../utils/money.util';
import { CreateExpenseDTO } from '../types/expense.types';

// Allowed categories (whitelist for security)
const ALLOWED_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Other',
];

/**
 * Validates expense creation request with comprehensive edge case handling
 */
export function validateCreateExpense(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Check if body exists
  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Request body is required',
    });
    return;
  }

  const { amount, category, description, date } = req.body as CreateExpenseDTO;
  const errors: string[] = [];

  // Validate amount (critical for money handling)
  if (amount === null || amount === undefined) {
    errors.push('Amount is required');
  } else if (typeof amount !== 'string') {
    errors.push('Amount must be a string for precision');
  } else {
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      errors.push(amountValidation.error!);
    } else {
      // Additional edge case: check for extremely large values
      const numAmount = parseFloat(amount);
      if (numAmount > 10000000) {
        errors.push('Amount cannot exceed ₹10,000,000');
      }
    }
  }

  // Validate category
  if (!category) {
    errors.push('Category is required');
  } else if (typeof category !== 'string') {
    errors.push('Category must be a string');
  } else {
    const trimmedCategory = category.trim();
    if (trimmedCategory === '') {
      errors.push('Category cannot be empty');
    } else if (!ALLOWED_CATEGORIES.includes(trimmedCategory)) {
      errors.push(`Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
    }
  }

  // Validate description
  if (!description) {
    errors.push('Description is required');
  } else if (typeof description !== 'string') {
    errors.push('Description must be a string');
  } else {
    const trimmedDesc = description.trim();
    if (trimmedDesc === '') {
      errors.push('Description cannot be empty');
    } else if (trimmedDesc.length < 3) {
      errors.push('Description must be at least 3 characters');
    } else if (trimmedDesc.length > 500) {
      errors.push('Description must be 500 characters or less');
    }
    // XSS prevention: check for suspicious patterns
    const suspiciousPatterns = /<script|javascript:|onerror=|onclick=/i;
    if (suspiciousPatterns.test(trimmedDesc)) {
      errors.push('Description contains invalid characters');
    }
  }

  // Validate date
  if (!date) {
    errors.push('Date is required');
  } else if (typeof date !== 'string') {
    errors.push('Date must be a string in YYYY-MM-DD format');
  } else {
    // Check format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      errors.push('Date must be in YYYY-MM-DD format');
    } else {
      const parsedDate = new Date(date + 'T00:00:00Z'); // Parse as UTC midnight
      
      // Check if valid date
      if (isNaN(parsedDate.getTime())) {
        errors.push('Date is invalid (e.g., 2026-02-30 does not exist)');
      } else {
        // Prevent future dates (allow today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (parsedDate >= tomorrow) {
          errors.push('Date cannot be in the future');
        }
        
        // Prevent dates too far in the past (sanity check)
        const minDate = new Date('2000-01-01');
        if (parsedDate < minDate) {
          errors.push('Date cannot be before year 2000');
        }
      }
    }
  }

  // Check for extra fields (security: prevent parameter pollution)
  const allowedFields = ['amount', 'category', 'description', 'date'];
  const extraFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key)
  );
  if (extraFields.length > 0) {
    errors.push(`Unexpected fields: ${extraFields.join(', ')}`);
  }

  // If there are validation errors, return 400
  if (errors.length > 0) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: errors,
    });
    return;
  }

  next();
}

/**
 * Validates query parameters for GET /expenses
 */
export function validateGetExpenses(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { category, sort } = req.query;
  const errors: string[] = [];

  // Validate category filter (optional)
  if (category !== undefined) {
    if (typeof category !== 'string') {
      errors.push('Category must be a string');
    } else if (!ALLOWED_CATEGORIES.includes(category)) {
      errors.push(`Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
    }
  }

  // Validate sort parameter (optional)
  if (sort !== undefined) {
    if (sort !== 'date_desc') {
      errors.push('Sort must be "date_desc" or omitted');
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid query parameters',
      details: errors,
    });
    return;
  }

  next();
}
