/**
 * API Client for expense operations
 * Handles HTTP communication with backend
 * Critical: Includes idempotency key headers
 */

import axios, { AxiosError } from 'axios';
import { CreateExpenseDTO, Expense, QueryParams, ApiError } from '../types/expense.types';

// API base URL - uses proxy in development, env var in production
// Ensure it always ends with /api
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return '/api'; // Development proxy
  }
  // If full URL provided, ensure it ends with /api
  if (envUrl.startsWith('http')) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  return envUrl; // Relative path
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Creates a new expense with idempotency protection
 * @param data - Expense data
 * @param idempotencyKey - UUID for request deduplication
 * @returns Created expense
 */
export async function createExpense(
  data: CreateExpenseDTO,
  idempotencyKey: string
): Promise<Expense> {
  try {
    const response = await apiClient.post<Expense>('/expenses', data, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Gets expenses with optional filtering and sorting
 * @param params - Query parameters (category, sort)
 * @returns Array of expenses
 */
export async function getExpenses(params?: QueryParams): Promise<Expense[]> {
  try {
    const response = await apiClient.get<Expense[]>('/expenses', {
      params,
    });
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Gets unique categories for filtering
 * @returns Array of category names
 */
export async function getCategories(): Promise<string[]> {
  try {
    const response = await apiClient.get<string[]>('/categories');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Handles API errors and formats them consistently
 */
function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    // Network error (no response)
    if (!axiosError.response) {
      return new Error('Network error. Please check your connection and try again.');
    }
    
    // Server returned error response
    const apiError = axiosError.response.data;
    const message = apiError?.message || 'An error occurred';
    const details = apiError?.details?.join(', ') || '';
    
    return new Error(details ? `${message}: ${details}` : message);
  }
  
  // Unknown error
  return new Error('An unexpected error occurred');
}
