/**
 * React Query hooks for expense operations
 * Critical: Handles retries, caching, and loading states automatically
 */

import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { createExpense, getExpenses, getCategories } from '../api/expenses.api';
import { CreateExpenseDTO, QueryParams } from '../types/expense.types';

// Query keys for cache management
export const QUERY_KEYS = {
  expenses: (params?: QueryParams) => ['expenses', params] as const,
  categories: ['categories'] as const,
};

/**
 * Hook to fetch expenses with optional filtering
 */
export function useExpenses(params?: QueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.expenses(params),
    queryFn: () => getExpenses(params),
    staleTime: 5000, // Consider data fresh for 5 seconds
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * Hook to create a new expense
 * Includes retry logic and cache invalidation
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, idempotencyKey }: { data: CreateExpenseDTO; idempotencyKey: string }) =>
      createExpense(data, idempotencyKey),
    retry: 3, // Retry failed requests (with same idempotency key)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    onSuccess: () => {
      // Invalidate and refetch expense queries
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
}

/**
 * Hook to fetch unique categories
 */
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: getCategories,
    staleTime: 60000, // Categories change less frequently - 1 minute
    retry: 3,
  });
}

/**
 * Creates QueryClient with default configuration
 * Exported for use in main.tsx
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: true,
        staleTime: 5000,
      },
      mutations: {
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
}
