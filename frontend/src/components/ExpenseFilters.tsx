/**
 * ExpenseFilters Component
 * Provides category filtering and date sorting controls
 */

import { useCategories } from '../hooks/useExpenses';

interface ExpenseFiltersProps {
  selectedCategory: string;
  sortByDate: boolean;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: boolean) => void;
}

export function ExpenseFilters({
  selectedCategory,
  sortByDate,
  onCategoryChange,
  onSortChange,
}: ExpenseFiltersProps) {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label htmlFor="filter-category" className="label">
            Filter by Category
          </label>
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isLoading}
            className="input"
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Toggle */}
        <div className="flex-1">
          <label htmlFor="sort-date" className="label">
            Sort by Date
          </label>
          <div className="flex items-center h-[42px]">
            <button
              type="button"
              onClick={() => onSortChange(!sortByDate)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                sortByDate
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  sortByDate ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
              {sortByDate ? 'Newest First' : 'Default Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
