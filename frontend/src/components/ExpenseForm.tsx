/**
 * ExpenseForm Component
 * Critical: Handles idempotency key generation and form submission
 * Prevents duplicate submissions from retries, refreshes, and double-clicks
 */

import { useState, FormEvent } from 'react';
import { useCreateExpense } from '../hooks/useExpenses';
import { generateIdempotencyKey } from '../utils/idempotency.util';
import { getTodayDate, validateAmountFormat } from '../utils/formatters.util';
import { CreateExpenseDTO } from '../types/expense.types';

export function ExpenseForm() {
  // Generate idempotency key once on mount
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey());
  
  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayDate());
  
  // Client-side validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Mutation hook with retry logic
  const createMutation = useCreateExpense();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Client-side validation
    const validationErrors: Record<string, string> = {};
    
    if (!amount || !validateAmountFormat(amount)) {
      validationErrors.amount = 'Amount must be a positive number with max 2 decimals';
    }
    
    if (!category.trim()) {
      validationErrors.category = 'Category is required';
    }
    
    if (!description.trim()) {
      validationErrors.description = 'Description is required';
    }
    
    if (!date) {
      validationErrors.date = 'Date is required';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Prepare data
    const data: CreateExpenseDTO = {
      amount: amount.trim(),
      category: category.trim(),
      description: description.trim(),
      date,
    };
    
    // Submit with idempotency key
    // React Query will use the same key for retries
    createMutation.mutate(
      { data, idempotencyKey },
      {
        onSuccess: () => {
          // Success - generate NEW idempotency key for next submission
          setIdempotencyKey(generateIdempotencyKey());
          
          // Reset form
          setAmount('');
          setCategory('');
          setDescription('');
          setDate(getTodayDate());
          setErrors({});
        },
        onError: (error) => {
          // Error - keep same idempotency key for retry
          console.error('Failed to create expense:', error);
        },
      }
    );
  };

  const isLoading = createMutation.isPending;
  const error = createMutation.error;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Expense</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="label">
            Amount (₹) *
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            placeholder="123.45"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
            className={`input ${errors.amount ? 'border-red-500' : ''}`}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="label">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
            className={`input ${errors.category ? 'border-red-500' : ''}`}
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="label">
            Description *
          </label>
          <input
            type="text"
            id="description"
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            maxLength={500}
            className={`input ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="label">
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={date}
            max={getTodayDate()}
            onChange={(e) => setDate(e.target.value)}
            disabled={isLoading}
            className={`input ${errors.date ? 'border-red-500' : ''}`}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        {/* Server Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        {/* Success Message */}
        {createMutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Success!</p>
            <p className="text-sm">Expense added successfully</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {createMutation.failureCount > 0
                ? `Retrying... (${createMutation.failureCount}/3)`
                : 'Adding...'}
            </>
          ) : (
            'Add Expense'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          * Required fields
        </p>
      </form>
    </div>
  );
}
