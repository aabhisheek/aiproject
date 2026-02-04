/**
 * Type definitions for expense tracker
 * Ensures type safety across the application
 */

export interface CreateExpenseDTO {
  amount: string; // String to avoid JavaScript floating-point issues
  category: string;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD)
}

export interface ExpenseResponse {
  id: string;
  amount: string; // String representation of decimal
  category: string;
  description: string;
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface QueryParams {
  category?: string;
  sort?: 'date_desc';
}

export interface IdempotencyRecord {
  id: string;
  key: string;
  response: any;
  createdAt: Date;
  expiresAt: Date;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}
