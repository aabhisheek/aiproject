# Deployment Guide - Expense Tracker

Complete guide to deploy the Expense Tracker to production for **free** using Supabase + Render + Vercel.

**Total Time:** ~10-15 minutes  
**Total Cost:** $0/month

## Architecture Overview

```
Users → Vercel (Frontend) → Render (Backend API) → Supabase (PostgreSQL)
        CDN, Static         Docker Container        Managed Database
        FREE               FREE (750 hrs/month)    FREE (500MB)
```

## Prerequisites

- GitHub account (for Vercel and Render)
- Supabase account
- Your code pushed to GitHub repository

---

## Step 1: Deploy Database (Supabase) - 2 minutes

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click **"Start your project"** → Sign in with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name:** `expense-tracker` (or your choice)
   - **Database Password:** Generate a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier (already selected)
5. Click **"Create new project"**
6. Wait ~2 minutes for provisioning

### 1.2 Get Connection Strings

1. In Supabase dashboard, go to **Settings** (left sidebar)
2. Click **Database**
3. Scroll to **"Connection string"** section
4. You'll need TWO connection strings:

**a) Transaction pooler (for application):**
- Mode: **Transaction**
- Copy the URI (looks like: `postgresql://postgres.xxx:6543/postgres?pgbouncer=true`)
- This is your `DATABASE_URL`

**b) Session pooler (for migrations):**
- Mode: **Session**  
- Copy the URI (looks like: `postgresql://postgres.xxx:5432/postgres`)
- This is your `DIRECT_URL`

5. Replace `[YOUR-PASSWORD]` in both URLs with your database password

**Save these URLs - you'll need them for Render deployment!**

---

## Step 2: Deploy Backend (Render) - 5 minutes

### 2.1 Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (authorizes repository access)

### 2.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the repository: `your-username/fenmoai`
4. Configure:

**Basic Info:**
- **Name:** `expense-tracker-api` (or your choice)
- **Region:** Same as Supabase if possible
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build && npx prisma generate`
- **Start Command:** `npm run migrate && npm start`

**Instance Type:**
- Select **"Free"** ($0/month, 750 hours)

### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | *Paste Transaction pooler URL from Supabase* |
| `DIRECT_URL` | *Paste Session pooler URL from Supabase* |
| `CORS_ORIGIN` | `*` (we'll update this after frontend deploy) |

**Important:** Replace `[YOUR-PASSWORD]` in URLs with your actual database password.

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for build and deploy (~3-5 minutes)
3. Watch the logs - should see:
   ```
   [Server] Database connected successfully
   [Server] Running on port 3000
   ```
4. Copy your backend URL (looks like: `https://expense-tracker-api.onrender.com`)

### 2.5 Test Backend

Open in browser: `https://expense-tracker-api.onrender.com/health`

Should see:
```json
{
  "status": "ok",
  "timestamp": "2026-01-31T...",
  "service": "expense-tracker-api"
}
```

✅ **Backend deployed!**

---

## Step 3: Deploy Frontend (Vercel) - 3 minutes

### 3.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Select your repository: `your-username/fenmoai`
3. Configure:

**Project Settings:**
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3.3 Add Environment Variables

Click **"Environment Variables"**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | *Your Render backend URL from Step 2.4* |

Example: `VITE_API_URL=https://expense-tracker-api.onrender.com`

**Important:** No trailing slash!

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build (~1-2 minutes)
3. You'll get a URL like: `https://expense-tracker-fenmo.vercel.app`

✅ **Frontend deployed!**

---

## Step 4: Update CORS (2 minutes)

Now that we have the frontend URL, update backend to allow requests from it.

### 4.1 Update Render Environment Variable

1. Go back to Render dashboard
2. Select your backend service
3. Click **"Environment"** (left sidebar)
4. Find `CORS_ORIGIN` variable
5. Change value from `*` to your Vercel URL:
   ```
   https://expense-tracker-fenmo.vercel.app
   ```
   (Replace with your actual Vercel URL)
6. Click **"Save Changes"**
7. Render will automatically redeploy (~30 seconds)

✅ **CORS configured!**

---

## Step 5: Test Production Deployment

### 5.1 Open Your App

Visit your Vercel URL: `https://expense-tracker-fenmo.vercel.app`

### 5.2 Test Features

1. **Add Expense:**
   - Fill form: Amount `100.50`, Category `Food`, Description `Test`, Date `today`
   - Click "Add Expense"
   - Should see success message
   - Expense appears in list below

2. **Test Idempotency:**
   - Open browser DevTools → Network tab
   - Submit same expense twice rapidly
   - Should see only ONE expense in list
   - Backend returned cached response for second request

3. **Test Filtering:**
   - Add expenses in different categories
   - Use category filter dropdown
   - List updates to show only selected category

4. **Test Sorting:**
   - Click "Sort by Date" button
   - List reorders to newest first

5. **Test Total:**
   - Total at top updates with filtered results

✅ **All features working!**

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain to Vercel

1. In Vercel project, go to **Settings** → **Domains**
2. Add your domain: `expensetracker.yourdomain.com`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### 6.2 Update CORS

Update `CORS_ORIGIN` in Render to your custom domain.

---

## Troubleshooting

### Backend Issues

#### "Database connection failed"
- Check `DATABASE_URL` and `DIRECT_URL` in Render env vars
- Ensure password is correct (no special chars that need escaping)
- Test connection string with `psql` or Prisma Studio locally

#### "Migration failed"
- Check `DIRECT_URL` is the Session pooler (port 5432), not Transaction (6543)
- Migrations need direct connection, not pooled

#### "Server not responding"
- Render free tier sleeps after 15min inactivity
- First request after sleep takes ~30s (cold start)
- Subsequent requests are fast

### Frontend Issues

#### "Network Error" when submitting
- Check `VITE_API_URL` in Vercel env vars
- Ensure no trailing slash
- Check CORS_ORIGIN on backend matches frontend URL

#### Build fails
- Check all dependencies in `frontend/package.json`
- Ensure TypeScript has no errors
- Check build locally first: `npm run build`

### CORS Issues

#### "CORS policy blocked"
- Verify `CORS_ORIGIN` in Render matches your Vercel URL exactly
- Check for `http://` vs `https://` mismatch
- Check for trailing slash differences

---

## Monitoring & Maintenance

### Render Dashboard
- View logs: Click your service → **Logs** tab
- Monitor uptime and requests
- Free tier: 750 hours/month (enough for 24/7 with sleep)

### Vercel Dashboard
- View deployments and analytics
- Monitor bandwidth usage
- Free tier: 100GB bandwidth/month

### Supabase Dashboard
- View database tables: **Table Editor**
- Run SQL queries: **SQL Editor**
- Monitor storage: **Settings** → **Usage**
- Free tier: 500MB database, 2GB bandwidth/month

### Database Cleanup (Optional)

Clean up expired idempotency records (run monthly):

```sql
DELETE FROM idempotency_store 
WHERE expires_at < NOW();
```

Or add a cron job (Render Cron Jobs) to run cleanup script.

---

## Cost Breakdown

| Service | Free Tier | Expected Usage | Cost |
|---------|-----------|----------------|------|
| **Vercel** | 100GB bandwidth | ~1-5GB | $0 |
| **Render** | 750 hours/month | ~720 hours (with sleep) | $0 |
| **Supabase** | 500MB + 2GB transfer | ~10MB + 500MB | $0 |
| **Total** | - | - | **$0/month** |

### When You'd Need to Upgrade

- **Vercel:** >100GB bandwidth (high traffic blog/portfolio gets ~20GB)
- **Render:** Need no-sleep uptime (paid plan $7/month)
- **Supabase:** >500MB database (thousands of expense records)

For this assignment/personal use: Free tier is MORE than enough.

---

## Scaling Considerations

### If Traffic Grows

1. **Frontend:** Vercel scales automatically (serverless)
2. **Backend:** Upgrade Render to paid ($7/mo for always-on)
3. **Database:** Supabase scales to paid plans ($25/mo for 8GB)

### If Data Grows

1. **Add pagination:** Limit expenses per page
2. **Archive old data:** Move expenses older than 1 year to separate table
3. **Add indexes:** Already done in Prisma schema

---

## Security Checklist

✅ Database password is strong and secret  
✅ Environment variables not committed to Git  
✅ CORS restricted to your frontend domain  
✅ HTTPS enabled (automatic on Vercel/Render)  
✅ SQL injection prevented (Prisma ORM)  
✅ Input validation on client and server  

---

## Next Steps

1. **Share your links** in assignment submission
2. **Add custom domain** (optional, for portfolio)
3. **Monitor usage** in first week
4. **Add authentication** if extending project

---

## Quick Reference

### Your Deployment URLs

```
Frontend:  https://expense-tracker-fenmo.vercel.app
Backend:   https://expense-tracker-api.onrender.com
Database:  db.xxx.supabase.co (access via Supabase Studio)
```

### Important Commands

```bash
# Redeploy backend (after code changes)
git push origin main  # Render auto-deploys

# Redeploy frontend (after code changes)
git push origin main  # Vercel auto-deploys

# View backend logs
# Go to Render dashboard → Service → Logs

# Access database
# Go to Supabase dashboard → Table Editor
```

---

**Deployment Complete! 🚀**

Your expense tracker is now live and accessible worldwide on a free, production-ready infrastructure.
