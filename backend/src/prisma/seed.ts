/**
 * Database Seed Script
 * Populates database with sample expense data across various categories
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Sample expenses with various categories
  const sampleExpenses = [
    // Food expenses
    {
      amount: '250.50',
      category: 'Food',
      description: 'Grocery shopping at supermarket',
      date: new Date('2026-01-28'),
    },
    {
      amount: '180.00',
      category: 'Food',
      description: 'Dinner at restaurant',
      date: new Date('2026-01-29'),
    },
    {
      amount: '45.00',
      category: 'Food',
      description: 'Coffee and snacks',
      date: new Date('2026-01-30'),
    },

    // Transport expenses
    {
      amount: '500.00',
      category: 'Transport',
      description: 'Monthly metro pass',
      date: new Date('2026-01-25'),
    },
    {
      amount: '150.00',
      category: 'Transport',
      description: 'Uber rides',
      date: new Date('2026-01-27'),
    },
    {
      amount: '2000.00',
      category: 'Transport',
      description: 'Fuel for car',
      date: new Date('2026-01-26'),
    },

    // Entertainment expenses
    {
      amount: '350.00',
      category: 'Entertainment',
      description: 'Movie tickets and popcorn',
      date: new Date('2026-01-30'),
    },
    {
      amount: '499.00',
      category: 'Entertainment',
      description: 'Netflix subscription',
      date: new Date('2026-01-01'),
    },

    // Utilities expenses
    {
      amount: '1200.00',
      category: 'Utilities',
      description: 'Electricity bill',
      date: new Date('2026-01-20'),
    },
    {
      amount: '599.00',
      category: 'Utilities',
      description: 'Internet bill',
      date: new Date('2026-01-22'),
    },
    {
      amount: '800.00',
      category: 'Utilities',
      description: 'Water bill',
      date: new Date('2026-01-21'),
    },

    // Healthcare expenses
    {
      amount: '450.00',
      category: 'Healthcare',
      description: 'Doctor consultation',
      date: new Date('2026-01-24'),
    },
    {
      amount: '320.00',
      category: 'Healthcare',
      description: 'Pharmacy - medicines',
      date: new Date('2026-01-25'),
    },

    // Shopping expenses
    {
      amount: '1500.00',
      category: 'Shopping',
      description: 'New shoes',
      date: new Date('2026-01-28'),
    },
    {
      amount: '850.00',
      category: 'Shopping',
      description: 'Books from bookstore',
      date: new Date('2026-01-29'),
    },

    // Other expenses
    {
      amount: '200.00',
      category: 'Other',
      description: 'Haircut and grooming',
      date: new Date('2026-01-23'),
    },
    {
      amount: '100.00',
      category: 'Other',
      description: 'Mobile recharge',
      date: new Date('2026-01-26'),
    },
  ];

  // Insert sample expenses
  for (const expense of sampleExpenses) {
    await prisma.expense.create({
      data: {
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
      },
    });
    console.log(`✅ Created: ${expense.category} - ${expense.description}`);
  }

  console.log('');
  console.log('🎉 Seeding completed!');
  console.log(`📊 Created ${sampleExpenses.length} sample expenses`);
  console.log('');
  console.log('📋 Categories populated:');
  console.log('   - Food (3 expenses)');
  console.log('   - Transport (3 expenses)');
  console.log('   - Entertainment (2 expenses)');
  console.log('   - Utilities (3 expenses)');
  console.log('   - Healthcare (2 expenses)');
  console.log('   - Shopping (2 expenses)');
  console.log('   - Other (2 expenses)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
