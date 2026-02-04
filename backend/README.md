# Expense Tracker Backend API

Production-ready REST API with idempotency and precise money handling.

## Tech Stack

- **Node.js** + **TypeScript** - Type-safe backend
- **Express** - Web framework
- **Prisma** - Type-safe ORM with PostgreSQL
- **PostgreSQL** (Supabase) - Database with NUMERIC type for money

## Key Features

### 1. Idempotency Protection
- Every POST request requires an `Idempotency-Key` header (UUID)
- Duplicate requests return cached response (prevents double-submission)
- 24-hour TTL for idempotency records

### 2. Precise Money Handling
- PostgreSQL `NUMERIC(12, 2)` type for exact decimal storage
- API returns amounts as strings to avoid JavaScript floating-point errors
- Strict validation: positive numbers with max 2 decimal places

### 3. Layered Architecture
```
Request → Middleware → Controller → Service → Prisma → Database
           ↓
      [Idempotency]
      [Validation]
      [Error Handler]
```

## API Endpoints

### POST /api/expenses
Creates a new expense with idempotency protection.

**Headers:**
```
Content-Type: application/json
Idempotency-Key: <uuid>
```

**Request Body:**
```json
{
  "amount": "123.45",
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2026-01-31"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "amount": "123.45",
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2026-01-31",
  "createdAt": "2026-01-31T10:00:00.000Z",
  "updatedAt": "2026-01-31T10:00:00.000Z"
}
```

**Idempotent Response (200 OK):**
If same idempotency key is used again, returns cached response with 200 status.

**Error Responses:**
- `400` - Validation error
- `409` - Idempotency key conflict (different payload)
- `500` - Server error

### GET /api/expenses
Get expenses with optional filtering and sorting.

**Query Parameters:**
- `category` (optional) - Filter by category
- `sort` (optional) - `date_desc` for newest first

**Examples:**
```
GET /api/expenses
GET /api/expenses?category=Food
GET /api/expenses?sort=date_desc
GET /api/expenses?category=Food&sort=date_desc
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "amount": "123.45",
    "category": "Food",
    "description": "Lunch at restaurant",
    "date": "2026-01-31",
    "createdAt": "2026-01-31T10:00:00.000Z",
    "updatedAt": "2026-01-31T10:00:00.000Z"
  }
]
```

### GET /api/categories
Get unique categories for filtering.

**Response (200 OK):**
```json
["Food", "Transport", "Entertainment", "Utilities"]
```

### GET /health
Health check endpoint for monitoring.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-01-31T10:00:00.000Z",
  "service": "expense-tracker-api"
}
```

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)

### Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your Supabase credentials
# Get from: Supabase Dashboard > Settings > Database
```

3. **Run database migrations:**
```bash
npm run migrate:dev
```

4. **Start development server:**
```bash
npm run dev
```

Server runs on http://localhost:3000

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate:dev` - Run migrations (development)
- `npm run migrate` - Run migrations (production)
- `npm run studio` - Open Prisma Studio (database GUI)
- `npm run generate` - Generate Prisma Client

## Database Schema

### Expense Table
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY,
  amount NUMERIC(12, 2) NOT NULL,
  category VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date DESC);
```

### Idempotency Store Table
```sql
CREATE TABLE idempotency_store (
  id UUID PRIMARY KEY,
  key VARCHAR UNIQUE NOT NULL,
  response JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_idempotency_expires ON idempotency_store(expires_at);
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions to Render.

## Testing Idempotency

```bash
# Generate a UUID for testing
IDEMPOTENCY_KEY=$(uuidgen)

# First request - creates expense
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "amount": "99.99",
    "category": "Test",
    "description": "Testing idempotency",
    "date": "2026-01-31"
  }'

# Second request - returns cached response
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "amount": "99.99",
    "category": "Test",
    "description": "Testing idempotency",
    "date": "2026-01-31"
  }'
```

## Error Handling

All errors return consistent JSON format:
```json
{
  "error": "Error Type",
  "message": "Human-readable message",
  "details": ["Optional array of details"]
}
```

## Design Decisions

1. **Idempotency via Database**: More reliable than in-memory (Redis), works with free tier
2. **String API for Money**: Avoids JavaScript floating-point precision issues
3. **PostgreSQL NUMERIC**: Exact decimal representation for financial data
4. **Layered Architecture**: Separation of concerns for maintainability and testing
