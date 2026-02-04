/**
 * Expense Controller
 * Handles HTTP requests and responses
 * Thin layer that delegates to service
 */

import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseDTO, QueryParams } from '../types/expense.types';

const expenseService = new ExpenseService();

export class ExpenseController {
  /**
   * POST /api/expenses
   * Creates a new expense with idempotency protection
   */
  async createExpense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: CreateExpenseDTO = req.body;
      
      const expense = await expenseService.createExpense(data);
      
      // Return 201 Created for new resources
      res.status(201).json(expense);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/expenses?category=Food&sort=date_desc
   * Gets expenses with optional filtering and sorting
   */
  async getExpenses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params: QueryParams = {
        category: req.query.category as string | undefined,
        sort: req.query.sort as 'date_desc' | undefined,
      };

      const expenses = await expenseService.getExpenses(params);
      
      res.status(200).json(expenses);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/categories
   * Gets unique categories for filtering
   */
  async getCategories(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await expenseService.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/summary
   * Gets expense summary grouped by category
   */
  async getExpenseSummary(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const summary = await expenseService.getExpenseSummary();
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /health
   * Health check endpoint for monitoring
   */
  async healthCheck(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'expense-tracker-api',
    });
  }
}
