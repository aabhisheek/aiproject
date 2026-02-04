/**
 * Expense Routes
 * Defines API endpoints and middleware chain
 */

import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { idempotencyMiddleware } from '../middleware/idempotency.middleware';
import { validateCreateExpense, validateGetExpenses } from '../middleware/validation.middleware';

const router = Router();
const controller = new ExpenseController();

/**
 * POST /api/expenses
 * Middleware chain:
 * 1. Idempotency check (prevents duplicates)
 * 2. Validation (ensures data correctness)
 * 3. Controller (business logic)
 */
router.post(
  '/expenses',
  idempotencyMiddleware,
  validateCreateExpense,
  controller.createExpense.bind(controller)
);

/**
 * GET /api/expenses
 * Query params: category (optional), sort (optional)
 * With query validation
 */
router.get(
  '/expenses',
  validateGetExpenses,
  controller.getExpenses.bind(controller)
);

/**
 * GET /api/categories
 * Returns unique categories for filtering
 */
router.get('/categories', controller.getCategories.bind(controller));

/**
 * GET /api/summary
 * Returns expense summary grouped by category with totals
 */
router.get('/summary', controller.getExpenseSummary.bind(controller));

export default router;
