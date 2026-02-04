/**
 * Type definitions for expense tracker frontend
 * Mirrors backend types for consistency
 */

export interface CreateExpenseDTO {
  amount: string; // String to avoid floating-point issues
  category: string;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD)
}

export interface Expense {
  id: string;
  amount: string; // String representation from backend
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryParams {
  category?: string;
  sort?: 'date_desc';
}

export interface ApiError {
  error: string;
  message: string;
  details?: string[];
}
