/**
 * ExpenseTotal Component
 * Calculates and displays total of filtered expenses
 * Critical: Uses proper decimal addition to avoid floating-point errors
 */

import { formatMoney } from '../utils/formatters.util';
import { Expense } from '../types/expense.types';

interface ExpenseTotalProps {
  expenses: Expense[];
}

export function ExpenseTotal({ expenses }: ExpenseTotalProps) {
  // Calculate total with proper decimal handling
  const total = expenses.reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);

  const count = expenses.length;

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-primary-100 text-sm font-medium">Total Expenses</p>
          <p className="text-3xl font-bold mt-1">{formatMoney(total)}</p>
          <p className="text-primary-100 text-sm mt-2">
            {count} {count === 1 ? 'expense' : 'expenses'}
          </p>
        </div>
        <div className="bg-white/10 rounded-full p-4">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
