# Deployment Guide

This guide explains how to deploy the Inventory Management System using **Netlify** (frontend) and **Render** (backend + PostgreSQL).

## Architecture

```
Browser → Netlify (static) → Render (API) → Render PostgreSQL
```

---

## Part 1: Render (Backend + Database)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create PostgreSQL Database
1. Click **New +** → **PostgreSQL**
2. Configure:
   - **Name**: `inventory-db`
   - **Region**: Choose closest to you
   - **Instance Type**: Free
3. Click **Create Database**
4. **Copy the Internal Database URL** (you'll need this)

### Step 3: Create Web Service (Backend)
1. Click **New +** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `inventory-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:

   ```
   PORT=3000
   DATABASE_URL=<your-postgres-internal-url>
   JWT_SECRET=<generate-a-random-string>
   ALLOWED_ORIGINS=https://your-app.netlify.app
   NODE_ENV=production
   ```

5. Click **Create Web Service**

### Step 4: Get Backend URL
After deployment, your backend URL will be: `https://inventory-api.onrender.com`

---

## Part 2: Netlify (Frontend)

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

### Step 2: Deploy Frontend
**Option A: Direct Upload**
1. In frontend folder, run: `npm run build`
2. Go to Netlify → **Sites** → **Deploy manually**
3. Drag the `dist` folder

**Option B: GitHub Integration**
1. Click **Add new site** → **Import an existing project**
2. Connect your GitHub repo
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy**

### Step 3: Add Environment Variable
1. Go to **Site settings** → **Environment variables**
2. Add:
   ```
   VITE_API_URL=https://inventory-api.onrender.com/api
   ```

### Step 4: Update Backend CORS
1. Go to Render → your backend service
2. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://your-app.netlify.app,http://localhost:5173
   ```
3. Click **Save Changes** (auto-deploys)

### Step 5: Custom Domain (Optional)
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow DNS configuration steps

---

## Part 3: Database Setup

After deploying, you need to initialize the database:

### Option A: Run migrations manually
1. Connect to your Render PostgreSQL via any PostgreSQL client
2. Run the SQL from `backend/src/database/init.sql`

### Option B: Create initial data via API
After backend is running, use the register endpoint to create your admin user.

---

## Part 4: Update URLs

Once you have your actual URLs:

| Variable | Where | Example |
|----------|-------|---------|
| `VITE_API_URL` | Netlify | `https://inventory-api.onrender.com/api` |
| `ALLOWED_ORIGINS` | Render | `https://your-app.netlify.app` |

---

## Troubleshooting

### CORS Errors
- Make sure `ALLOWED_ORIGINS` includes your Netlify URL
- Remove trailing slashes

### Database Connection Failed
- Check `DATABASE_URL` is correct
- Make sure PostgreSQL is awake (free tier sleeps after 15 min)

### Build Failed (Frontend)
- Check `npm run build` works locally
- Verify Node version matches (check `package.json` engines)

### API Returns 404
- Make sure base URL ends with `/api`
- Check backend routes are prefixed correctly

---

## Free Tier Limits

| Service | Limit |
|---------|-------|
| Render PostgreSQL | 90 days, sleeps after 90 min |
| Render Web Service | Sleeps after 15 min |
| Netlify | 100GB bandwidth/month |

For production, consider upgrading to paid tiers.
