/**
 * Main App Component
 * Assembles all components and manages filter state
 */

import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './hooks/useExpenses';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseTotal } from './components/ExpenseTotal';
import { ExpenseSummary } from './components/ExpenseSummary';

// Create QueryClient instance
const queryClient = createQueryClient();

function ExpenseTracker() {
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortByDate, setSortByDate] = useState(false);

  // Build query params from filter state
  const queryParams = {
    ...(selectedCategory && { category: selectedCategory }),
    ...(sortByDate && { sort: 'date_desc' as const }),
  };

  // Fetch expenses with filters
  const { data: expenses, isLoading, error } = useExpenses(queryParams);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="mt-2 text-gray-600">
            Track your expenses with idempotency-protected submissions
          </p>
        </header>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form and Summary */}
          <div className="lg:col-span-1 space-y-6">
            <ExpenseForm />
            <ExpenseSummary />
          </div>

          {/* Right column - List and filters */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total */}
            <ExpenseTotal expenses={expenses || []} />

            {/* Filters */}
            <ExpenseFilters
              selectedCategory={selectedCategory}
              sortByDate={sortByDate}
              onCategoryChange={setSelectedCategory}
              onSortChange={setSortByDate}
            />

            {/* List */}
            <ExpenseList
              expenses={expenses || []}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Built with React, TypeScript, TanStack Query, and Tailwind CSS
          </p>
          <p className="mt-1">
            Features: Idempotency protection, automatic retries, precise money handling
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ExpenseTracker />
    </QueryClientProvider>
  );
}
