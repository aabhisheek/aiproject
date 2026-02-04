# Render Deployment - Database Connection Fix

## ✅ Working Connection Strings (Tested Locally)

Both ports work:
- Port 6543: ✅ Works
- Port 5432: ✅ Works

## 🔧 Render Environment Variables

Use these EXACT strings in Render:

### Option 1: Port 6543 (Transaction Pooler - Recommended)

**DATABASE_URL:**
```
postgresql://postgres:Abhi6591anshu@db.lgpvsabdtbysxwxnwtff.supabase.co:6543/postgres?sslmode=require
```

**DIRECT_URL:**
```
postgresql://postgres:Abhi6591anshu@db.lgpvsabdtbysxwxnwtff.supabase.co:5432/postgres?sslmode=require
```

### Option 2: Port 5432 for Both (Simpler)

**DATABASE_URL:**
```
postgresql://postgres:Abhi6591anshu@db.lgpvsabdtbysxwxnwtff.supabase.co:5432/postgres?sslmode=require
```

**DIRECT_URL:**
```
postgresql://postgres:Abhi6591anshu@db.lgpvsabdtbysxwxnwtff.supabase.co:5432/postgres?sslmode=require
```

## 📋 Step-by-Step Fix

1. **Go to Render Dashboard** → Your Service → **Settings** → **Environment**

2. **Delete existing DATABASE_URL and DIRECT_URL** (if they exist)

3. **Add new variables:**

   Click "Add Environment Variable" for each:

   **Variable 1:**
   - Key: `DATABASE_URL`
   - Value: `postgresql://postgres:Abhi6591anshu@db.lgpvsabdtbysxwxnwtff.supabase.co:6543/postgres?sslmode=require`
   - Environment: Production

   **Variable 2:**
   - Key: `DIRECT_URL`
   - Value: `postgresql://postgres:Abhi6591anshu@db.lgpvsabdtbysxwxnwtff.supabase.co:5432/postgres?sslmode=require`
   - Environment: Production

4. **Click "Save Changes"** at the bottom

5. **IMPORTANT: Manual Redeploy**
   - Go to **"Events"** tab
   - Click **"Manual Deploy"** → **"Deploy latest commit"**
   - This forces Render to reload environment variables

## ⚠️ Why Manual Redeploy is Critical

Render sometimes caches environment variables. Manual redeploy ensures:
- New variables are loaded
- Old cached values are cleared
- Fresh connection attempt

## 🔍 Verify It Worked

After redeploy, check logs. You should see:
```
✓ Database connected successfully
✓ Running migrations...
✓ Server started on port 3000
```

If you still see connection errors, check:
1. Variables are saved (refresh page and verify)
2. No extra spaces in connection strings
3. Password is correct: `Abhi6591anshu`
4. Manual redeploy was triggered
