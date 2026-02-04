/**
 * Expense Service
 * Business logic for expense operations
 * Handles data transformation and Prisma interactions
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { CreateExpenseDTO, ExpenseResponse, QueryParams } from '../types/expense.types';

const prisma = new PrismaClient();

export class ExpenseService {
  /**
   * Creates a new expense
   * Converts amount string to Prisma Decimal for database storage
   */
  async createExpense(data: CreateExpenseDTO): Promise<ExpenseResponse> {
    const expense = await prisma.expense.create({
      data: {
        amount: new Prisma.Decimal(data.amount), // Convert string to Decimal
        category: data.category.trim(),
        description: data.description.trim(),
        date: new Date(data.date),
      },
    });

    return this.formatExpenseResponse(expense);
  }

  /**
   * Gets expenses with optional filtering and sorting
   * Supports:
   * - Filter by category
   * - Sort by date (newest first)
   */
  async getExpenses(params: QueryParams): Promise<ExpenseResponse[]> {
    const { category, sort } = params;

    const where: any = {};
    
    // Apply category filter if provided
    if (category) {
      where.category = category;
    }

    // Build orderBy clause
    const orderBy: any = [];
    if (sort === 'date_desc') {
      orderBy.push({ date: 'desc' });
    }
    // Default: also order by createdAt for consistent ordering
    orderBy.push({ createdAt: 'desc' });

    const expenses = await prisma.expense.findMany({
      where,
      orderBy,
    });

    return expenses.map(this.formatExpenseResponse);
  }

  /**
   * Formats expense from database to API response
   * Critical: Converts Decimal to string to prevent floating-point issues in JSON
   */
  private formatExpenseResponse(expense: any): ExpenseResponse {
    return {
      id: expense.id,
      amount: expense.amount.toString(), // Decimal to string - CRITICAL for money precision
      category: expense.category,
      description: expense.description,
      date: expense.date.toISOString().split('T')[0], // YYYY-MM-DD format
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    };
  }

  /**
   * Get unique categories for filtering
   * Useful for frontend dropdown
   */
  async getCategories(): Promise<string[]> {
    const result = await prisma.expense.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return result.map((r) => r.category);
  }

  /**
   * Get expense summary grouped by category
   * Shows total amount per category - useful for insights
   */
  async getExpenseSummary(): Promise<Array<{ category: string; total: string; count: number }>> {
    const expenses = await prisma.expense.findMany({
      select: {
        category: true,
        amount: true,
      },
    });

    // Group by category and calculate totals
    const summaryMap = new Map<string, { total: number; count: number }>();

    for (const expense of expenses) {
      const category = expense.category;
      const amount = parseFloat(expense.amount.toString());

      if (!summaryMap.has(category)) {
        summaryMap.set(category, { total: 0, count: 0 });
      }

      const current = summaryMap.get(category)!;
      current.total += amount;
      current.count += 1;
    }

    // Convert to array and format
    const summary = Array.from(summaryMap.entries())
      .map(([category, data]) => ({
        category,
        total: data.total.toFixed(2), // Convert to string for precision
        count: data.count,
      }))
      .sort((a, b) => parseFloat(b.total) - parseFloat(a.total)); // Sort by total descending

    return summary;
  }
}
