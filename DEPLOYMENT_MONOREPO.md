# Monorepo Deployment Guide

Your project has both frontend and backend in one repository. This is called a **monorepo** and is fully supported by deployment platforms!

## 📁 Your Repository Structure

```
fenmoai/ (GitHub repo: aabhisheek/aiproject)
├── backend/          ← Backend code here
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/         ← Frontend code here
│   ├── src/
│   ├── package.json
│   └── ...
├── render.yaml       ← Optional: Makes Render deployment easier
└── README.md
```

---

## 🚀 Step-by-Step Deployment

### 1️⃣ Deploy Backend to Render (5 minutes)

#### Option A: Using render.yaml (Easier)

We've created `render.yaml` in your root directory. Simply:

1. Go to https://render.com
2. Sign in with GitHub
3. Click **"New"** → **"Blueprint"**
4. Select your repo: `aabhisheek/aiproject`
5. Render will detect `render.yaml` automatically
6. Add environment variables:
   ```
   DATABASE_URL=postgresql://postgres:Abhi6591anshu@db.lgpvsabdtbysxwxnwtff.supabase.co:6543/postgres?pgbouncer=true
   DIRECT_URL=postgresql://postgres:Abhi6591anshu@db.lgpvsabdtbysxwxnwtff.supabase.co:5432/postgres
   ```
7. Click **"Apply"**
8. Done! ✅

#### Option B: Manual Setup

1. Go to https://render.com
2. New **"Web Service"**
3. Connect repo: `aabhisheek/aiproject`
4. **⭐ CRITICAL:** Set **Root Directory** to `backend`
5. Configure:
   - Build: `npm install && npm run build && npx prisma generate --schema=./src/prisma/schema.prisma`
   - Start: `npx prisma migrate deploy --schema=./src/prisma/schema.prisma && npm start`
6. Add environment variables (see Option A)
7. Deploy ✅

**📝 Copy Backend URL:** e.g., `https://expense-tracker-api.onrender.com`

---

### 2️⃣ Deploy Frontend to Vercel (3 minutes)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import repo: `aabhisheek/aiproject`
5. **⭐ CRITICAL:** Configure these settings:

**Framework Preset:** Vite

**Root Directory:** 
- Click **"Edit"**
- Enter: `frontend`
- Click folder icon ✅

**Build Settings** (auto-detected):
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

6. **Environment Variables:**
   ```
   VITE_API_URL=https://expense-tracker-api.onrender.com
   ```
   (Use your backend URL from step 1)

7. Click **"Deploy"** ✅

**📝 Copy Frontend URL:** e.g., `https://expense-tracker-fenmo.vercel.app`

---

### 3️⃣ Update CORS (1 minute)

Go back to Render:
1. Your backend service → **Environment** tab
2. Update `CORS_ORIGIN`:
   ```
   https://expense-tracker-fenmo.vercel.app
   ```
   (Use your frontend URL from step 2)
3. Save → Auto-redeploys

---

## ✅ Verification

### Backend Health Check
```
https://expense-tracker-api.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-01-31...",
  "service": "expense-tracker-api"
}
```

### Frontend
```
https://expense-tracker-fenmo.vercel.app
```

Should show:
- ✅ Expense form
- ✅ 17 sample expenses
- ✅ Summary by category
- ✅ Filters working

### Full Test
1. Add new expense in frontend
2. Should appear in list
3. Summary should update
4. Check Render logs → Should see POST request

---

## 🔄 How Auto-Deploy Works with Monorepo

```
You: git push origin main
         ↓
    GitHub receives push
         ↓
   Webhooks triggered
    ┌─────┴─────┐
    ↓           ↓
Vercel      Render
    │           │
Clones      Clones
entire      entire
repo        repo
    │           │
cd frontend cd backend
    │           │
npm build   npm build
    │           │
Deploy      Deploy
frontend    backend
```

**Both work independently but from same repository!** ✅

---

## 📋 Common Issues & Solutions

### Issue: Render build fails with "prisma not found"

**Solution:** Make sure build command includes full path:
```bash
npx prisma generate --schema=./src/prisma/schema.prisma
```

### Issue: Vercel builds wrong folder

**Solution:** Check Root Directory is set to `frontend` (not empty)

### Issue: Frontend can't reach backend

**Solutions:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Check CORS_ORIGIN in Render matches Vercel URL exactly
3. Make sure both are HTTPS (not http)

### Issue: Database migrations fail

**Solution:** Make sure DIRECT_URL is set (not just DATABASE_URL)

---

## 🎯 Future Updates

When you push to `main` branch:

```bash
git add .
git commit -m "Add new feature"
git push origin main
```

Both Vercel and Render will:
1. Detect the push
2. Build their respective folders
3. Deploy automatically
4. Live in 1-5 minutes ✅

**No special configuration needed after initial setup!**

---

## 💡 Benefits of Monorepo

✅ **Single source of truth** - All code in one place
✅ **Shared configuration** - One .gitignore, one README
✅ **Easy to share types** - Both use same TypeScript types
✅ **Atomic commits** - Frontend + backend changes together
✅ **Easier to navigate** - cd between folders locally

---

## 📊 Your Deployment URLs

After deployment, save these:

```
GitHub Repo:
https://github.com/aabhisheek/aiproject

Frontend (Vercel):
https://expense-tracker-fenmo.vercel.app

Backend (Render):
https://expense-tracker-api.onrender.com

Database (Supabase):
db.lgpvsabdtbysxwxnwtff.supabase.co
(Access via Supabase Studio)
```

---

## 🚦 Ready to Deploy?

Follow the 3 steps above in order:
1. Backend to Render (5 min)
2. Frontend to Vercel (3 min)
3. Update CORS (1 min)

**Total time: ~10 minutes**

Then test everything and share the URLs in your assignment submission! 🎉

---

**Need help?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for more details or troubleshooting.
