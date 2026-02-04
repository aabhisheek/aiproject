# Quick Start Guide - 5 Minutes

Get the Expense Tracker running locally in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free, 2 min signup)

## Step 1: Clone & Install (1 min)

```bash
# Clone repository
git clone <your-repo-url>
cd fenmoai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

## Step 2: Setup Supabase Database (2 min)

1. Go to https://supabase.com and sign up
2. Create new project (wait 2 min for provisioning)
3. Go to **Settings → Database**
4. Copy **Connection string** → **Transaction pooler** (port 6543)
5. Copy **Connection string** → **Session pooler** (port 5432)

## Step 3: Configure Backend (1 min)

```bash
cd backend

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
EOF

# Replace [PASSWORD] and [PROJECT-REF] with your values
```

## Step 4: Run Migrations (30 sec)

```bash
cd backend
npm run migrate:dev
```

Should see:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
```

## Step 5: Start Servers (30 sec)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Should see:
```
[Server] Database connected successfully
[Server] Running on port 3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Should see:
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```

## Step 6: Open Browser

Visit: http://localhost:5173

You should see the Expense Tracker app! 🎉

## Test It Out

1. **Add an expense:**
   - Amount: `100.50`
   - Category: `Food`
   - Description: `Lunch`
   - Date: Today
   - Click "Add Expense"

2. **See it in the list** below

3. **Test idempotency:**
   - Open DevTools → Network tab
   - Submit form twice quickly
   - Only ONE expense created (second returns cached response)

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL and DIRECT_URL in backend/.env
- Ensure [PASSWORD] is replaced with actual password
- Ensure [PROJECT-REF] is replaced (format: `abcdefghijklmnop`)

### "Cannot find module"
- Run `npm install` in both backend and frontend folders

### "Port already in use"
- Kill process on port 3000 (backend) or 5173 (frontend)
- Or change PORT in backend/.env

### "Migration failed"
- Use DIRECT_URL (Session pooler, port 5432) for migrations
- Use DATABASE_URL (Transaction pooler, port 6543) for app

## Next Steps

- Read [README.md](README.md) for design decisions
- Read [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production
- Explore the code in `backend/src/` and `frontend/src/`

## Key Files to Understand

**Backend:**
- `backend/src/middleware/idempotency.middleware.ts` - How duplicates are prevented
- `backend/src/utils/money.util.ts` - Money validation logic
- `backend/src/prisma/schema.prisma` - Database schema with NUMERIC type

**Frontend:**
- `frontend/src/components/ExpenseForm.tsx` - Form with idempotency key
- `frontend/src/hooks/useExpenses.ts` - React Query with retry logic
- `frontend/src/api/expenses.api.ts` - Axios client with headers

---

**Happy coding! 🚀**
