# Expense Tracker Frontend

React + TypeScript frontend with idempotency and automatic retry logic.

## Features

- **Idempotent Form Submission** - UUID keys prevent duplicates
- **Automatic Retries** - TanStack Query retries failed requests
- **Real-time Feedback** - Loading spinners, error messages, success states
- **Responsive Design** - Mobile-first, works on all devices
- **Client Validation** - Prevents invalid data before API call

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- TanStack Query for server state
- Tailwind CSS for styling
- Axios for HTTP requests

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

For production (Vercel), set in dashboard:
```env
VITE_API_URL=https://your-backend.onrender.com
```

## Project Structure

```
src/
├── components/        # React components
│   ├── ExpenseForm.tsx       # Form with idempotency
│   ├── ExpenseList.tsx       # List/table display
│   ├── ExpenseFilters.tsx    # Category/sort controls
│   └── ExpenseTotal.tsx      # Total calculation
├── api/              # API client
│   └── expenses.api.ts       # Axios with idempotency
├── hooks/            # Custom React hooks
│   └── useExpenses.ts        # TanStack Query hooks
├── types/            # TypeScript types
│   └── expense.types.ts
├── utils/            # Utility functions
│   ├── idempotency.util.ts   # UUID generation
│   └── formatters.util.ts    # Money/date formatting
├── App.tsx           # Main component
├── main.tsx          # Entry point
└── index.css         # Tailwind + custom styles
```

## Key Components

### ExpenseForm
- Generates idempotency key on mount
- Validates input client-side
- Keeps same key for retries
- Generates new key after success

### ExpenseList
- Displays expenses in table (desktop) or cards (mobile)
- Shows loading spinner during fetch
- Displays errors with retry option
- Empty state for no data

### ExpenseFilters
- Category dropdown (fetches unique categories)
- Sort toggle (newest first)
- Updates query params for API

### ExpenseTotal
- Calculates total from filtered expenses
- Proper decimal addition (no floating point errors)
- Displays count of expenses

## Deployment

See [../DEPLOYMENT.md](../DEPLOYMENT.md) for deployment to Vercel.

Quick deploy:
1. Push to GitHub
2. Import to Vercel
3. Set `VITE_API_URL` environment variable
4. Deploy

## Design Decisions

### Why TanStack Query?
- Automatic retries with exponential backoff
- Caching and deduplication
- Loading/error state management
- Industry standard for React

### Why UUID for Idempotency?
- Globally unique, no coordination needed
- Client-generated (no extra API call)
- Prevents duplicates from retries/double-clicks

### Why String for Money?
- JavaScript `0.1 + 0.2 = 0.30000000000000004`
- Keep as string until display
- Backend uses NUMERIC type for precision

### Why Tailwind?
- Faster development than custom CSS
- Consistent design system
- Small bundle size (purged unused classes)
