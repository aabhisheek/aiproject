/**
 * ExpenseSummary Component
 * Shows total expenses grouped by category
 * Provides insights into spending patterns
 */

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatMoney } from '../utils/formatters.util';

interface CategorySummary {
  category: string;
  total: string;
  count: number;
}

// Get API base URL - ensure it includes /api
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

async function fetchSummary(): Promise<CategorySummary[]> {
  const response = await axios.get<CategorySummary[]>(`${API_BASE_URL}/summary`);
  return response.data;
}

export function ExpenseSummary() {
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['expense-summary'],
    queryFn: fetchSummary,
    staleTime: 10000, // Summary updates less frequently
  });

  if (isLoading) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Summary by Category</h2>
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Summary by Category</h2>
        <p className="text-sm text-red-600">Failed to load summary</p>
      </div>
    );
  }

  if (!summary || summary.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Summary by Category</h2>
        <p className="text-sm text-gray-500">No expenses yet</p>
      </div>
    );
  }

  const grandTotal = summary.reduce((sum, item) => sum + parseFloat(item.total), 0);

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Summary by Category</h2>
      
      <div className="space-y-3">
        {summary.map((item) => {
          const percentage = (parseFloat(item.total) / grandTotal) * 100;
          
          return (
            <div key={item.category} className="border-b border-gray-200 pb-3 last:border-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700">{item.category}</span>
                <span className="font-bold text-gray-900">{formatMoney(item.total)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                <span>{item.count} {item.count === 1 ? 'expense' : 'expenses'}</span>
                <span>{percentage.toFixed(1)}% of total</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
