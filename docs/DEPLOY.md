# Deployment Instructions

## Step 1: Install Dependencies

```powershell
cd "frontend"
npm install
```

## Step 2: Build Production Bundle

```powershell
npm run build
```

This creates a `dist/` folder with optimized production files.

## Step 3: Test Production Build Locally (Optional)

```powershell
npm run preview
```

## Step 4: Commit to Git

```powershell
git add .
git commit -m "Production-ready zVote"
git push origin main
```

## Step 5: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub: `zVote`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** frontend
   - **Build Command:** npm run build
   - **Output Directory:** dist
5. Click "Deploy"

## Step 6: Deploy to Netlify (Alternative)

1. Go to https://netlify.com
2. Drag & drop the `frontend/dist` folder
3. Done!

---

Your zVote app is now deployed and live! 🚀
