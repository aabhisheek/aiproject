# 🚀 Frontend Deployment to Vercel - Step by Step

## Prerequisites

✅ Backend deployed on Render (you should have a URL like `https://expense-tracker-api.onrender.com`)  
✅ GitHub repository connected  
✅ Frontend code ready in `frontend/` folder

---

## Step 1: Get Your Backend URL

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service (e.g., `expense-tracker-api`)
3. Copy the **Service URL** (e.g., `https://expense-tracker-api.onrender.com`)
4. **Save this URL** - you'll need it in Step 4

---

## Step 2: Sign Up / Sign In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account

---

## Step 3: Import Your Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find and click on **`aabhisheek/aiproject`**
4. Click **"Import"**

---

## Step 4: Configure Project Settings

### ⚠️ CRITICAL: Set Root Directory

1. Look for **"Root Directory"** section
2. Click **"Edit"** or **"Configure"**
3. Click the folder icon 📁
4. Select **`frontend`** folder
5. Click **"Continue"** or **"Save"**

**Why?** Your repo has both `frontend/` and `backend/` folders. Vercel needs to know which one to build.

### Framework Preset

- Should auto-detect: **Vite**
- If not, select **"Vite"** from dropdown

### Build Settings (Auto-detected - verify these)

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

These should be correct automatically. ✅

---

## Step 5: Add Environment Variable

**This is the most important step!**

1. Scroll down to **"Environment Variables"** section
2. Click **"Add"** or **"Add New"**
3. Add this variable:

   **Key:** `VITE_API_URL`  
   **Value:** `https://your-backend-url.onrender.com`  
   (Replace with your actual Render backend URL from Step 1)

4. Make sure it's set for:
   - ✅ **Production**
   - ✅ **Preview** (optional but recommended)
   - ✅ **Development** (optional)

5. Click **"Save"** or **"Add"**

**Example:**
```
VITE_API_URL=https://expense-tracker-api.onrender.com
```

---

## Step 6: Deploy!

1. Scroll to bottom of page
2. Click **"Deploy"** button
3. Wait 1-3 minutes for build to complete
4. ✅ **Success!** You'll see a green checkmark

---

## Step 7: Get Your Frontend URL

After deployment completes:

1. You'll see a **"Visit"** button or a URL like:
   ```
   https://expense-tracker-fenmo.vercel.app
   ```
2. **Copy this URL** - this is your live frontend!

---

## Step 8: Update Backend CORS

Now tell your backend to accept requests from your frontend:

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Go to **"Environment"** tab
4. Find `CORS_ORIGIN` variable
5. Update it to your Vercel URL:
   ```
   https://expense-tracker-fenmo.vercel.app
   ```
   (Use your actual Vercel URL from Step 7)

6. Click **"Save Changes"**
7. Render will auto-redeploy (takes 1-2 minutes)

---

## ✅ Verification Checklist

### 1. Backend Health Check
Open in browser:
```
https://your-backend.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "expense-tracker-api"
}
```

### 2. Frontend Loads
Open your Vercel URL:
```
https://your-frontend.vercel.app
```

Should see:
- ✅ Expense form
- ✅ List of expenses (17 sample expenses)
- ✅ Summary by category
- ✅ Filters working

### 3. Full Integration Test
1. Fill out the expense form
2. Click "Add Expense"
3. Should see:
   - ✅ Loading spinner
   - ✅ Success message
   - ✅ New expense appears in list
   - ✅ Summary updates

### 4. Check Browser Console
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Should see **no errors**
4. Go to **Network** tab
5. Submit an expense
6. Should see successful POST to `/api/expenses`

---

## 🔄 Auto-Deployment

After initial setup, every time you push to `main`:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel will:
1. ✅ Detect the push automatically
2. ✅ Build the frontend
3. ✅ Deploy in 1-3 minutes
4. ✅ Update your live site

**No manual steps needed!** 🎉

---

## 🐛 Troubleshooting

### Issue: "Build failed" on Vercel

**Check:**
1. Root Directory is set to `frontend` (not empty)
2. Build command is `npm run build`
3. Output directory is `dist`

**Solution:** Go to Project Settings → General → Root Directory → Set to `frontend`

---

### Issue: Frontend can't reach backend (CORS error)

**Symptoms:**
- Browser console shows: `CORS policy: No 'Access-Control-Allow-Origin'`
- Network tab shows failed requests

**Solution:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Check `CORS_ORIGIN` in Render environment variables
3. Make sure both URLs match exactly (including `https://`)
4. Both should be HTTPS (not `http://`)

---

### Issue: "Cannot GET /" or blank page

**Solution:**
1. Check `vercel.json` exists in `frontend/` folder
2. Should have `rewrites` section (already configured ✅)
3. Redeploy on Vercel

---

### Issue: Environment variable not working

**Symptoms:**
- Frontend still uses `/api` instead of your backend URL

**Solution:**
1. Go to Vercel → Project → Settings → Environment Variables
2. Verify `VITE_API_URL` is set correctly
3. **Important:** Variable name must start with `VITE_` (Vite requirement)
4. Redeploy (environment variables require redeploy)

---

## 📋 Quick Reference

### Your URLs (save these)

```
Frontend (Vercel):
https://your-frontend.vercel.app

Backend (Render):
https://your-backend.onrender.com

GitHub:
https://github.com/aabhisheek/aiproject
```

### Environment Variables

**Vercel:**
```
VITE_API_URL=https://your-backend.onrender.com
```

**Render:**
```
CORS_ORIGIN=https://your-frontend.vercel.app
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

---

## 🎯 Next Steps

1. ✅ Deploy frontend to Vercel (this guide)
2. ✅ Update backend CORS
3. ✅ Test everything
4. ✅ Share URLs in assignment submission

**You're done!** 🎉

---

## 💡 Pro Tips

1. **Use Preview Deployments:** Vercel creates preview URLs for every PR - test before merging!
2. **Check Logs:** Vercel → Deployments → Click deployment → View logs
3. **Environment Variables:** Can be different for Production/Preview/Development
4. **Custom Domain:** Can add your own domain later in Project Settings

---

**Need help?** Check the [main README](../README.md) or [DEPLOYMENT_MONOREPO.md](../DEPLOYMENT_MONOREPO.md)
