# ✅ Frontend Deployment Checklist

## Before You Start

- [ ] Backend is deployed on Render and working
- [ ] You have your Render backend URL (e.g., `https://expense-tracker-api.onrender.com`)
- [ ] You can access the backend health endpoint: `https://your-backend.onrender.com/health`

---

## Vercel Deployment Steps

### 1. Sign In to Vercel
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign in with GitHub

### 2. Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Select repository: `aabhisheek/aiproject`
- [ ] Click "Import"

### 3. Configure Settings
- [ ] **Root Directory:** Set to `frontend` ⚠️ CRITICAL
- [ ] **Framework Preset:** Vite (auto-detected)
- [ ] **Build Command:** `npm run build` (auto-detected)
- [ ] **Output Directory:** `dist` (auto-detected)

### 4. Add Environment Variable
- [ ] Add: `VITE_API_URL`
- [ ] Value: `https://your-backend.onrender.com` (your actual Render URL)
- [ ] Set for: Production, Preview, Development

### 5. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete (1-3 minutes)
- [ ] Copy your frontend URL (e.g., `https://expense-tracker-fenmo.vercel.app`)

### 6. Update Backend CORS
- [ ] Go to Render Dashboard
- [ ] Backend service → Environment tab
- [ ] Update `CORS_ORIGIN` to your Vercel URL
- [ ] Save (auto-redeploys)

---

## Testing

- [ ] Frontend loads without errors
- [ ] Can see expense form
- [ ] Can see list of expenses
- [ ] Can add new expense
- [ ] New expense appears in list
- [ ] Summary updates correctly
- [ ] Filters work (category, sort)
- [ ] No CORS errors in browser console

---

## Your URLs (Fill These In)

```
Frontend (Vercel):
https://____________________.vercel.app

Backend (Render):
https://____________________.onrender.com

Backend Health Check:
https://____________________.onrender.com/health
```

---

## Quick Commands

**Test backend locally:**
```bash
cd backend
npm run dev
# Should start on http://localhost:3000
```

**Test frontend locally:**
```bash
cd frontend
npm run dev
# Should start on http://localhost:5173
```

**Build frontend:**
```bash
cd frontend
npm run build
# Creates dist/ folder
```

---

## Common Issues

### ❌ "Cannot find module" during build
**Fix:** Make sure Root Directory is `frontend`

### ❌ CORS error in browser
**Fix:** 
1. Check `VITE_API_URL` in Vercel
2. Check `CORS_ORIGIN` in Render
3. Both should be HTTPS URLs

### ❌ Blank page after deploy
**Fix:** Check `vercel.json` has `rewrites` section (already configured ✅)

---

**Ready?** Follow [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed steps!
