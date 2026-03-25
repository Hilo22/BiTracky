# 🚀 Vercel Deployment Guide - BiTracky MVP

## Quick Start

### Step 1: Login to Vercel (via CLI)
```bash
vercel login
```
Follow the prompts to authenticate with your Vercel account. You'll be redirected to verify in your browser.

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

### Step 3: Set Environment Variables on Vercel
Go to your Vercel project settings and add these environment variables:

**Required environment variables:**
- `DATABASE_URL` - PostgreSQL connection string (e.g., from Vercel Postgres or external provider)
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `NODE_ENV` - Set to `production`
- `PRISMA_FIELD_ENCRYPTION_KEY` - Generate with: `openssl rand -base64 32`

**Optional:**
- `NEXT_PUBLIC_APP_URL` - Your deployed app URL (e.g., `https://bitracky.vercel.app`)

---

## Detailed Setup

### For PostgreSQL Database:
**Option A: Use Vercel Postgres (Recommended)**
1. In Vercel Dashboard → Storage → Create Postgres Database
2. Copy the connection string to `DATABASE_URL`

**Option B: External PostgreSQL**
- Get your connection string from your PostgreSQL provider
- Use format: `postgresql://user:password@host:port/database?sslmode=require`

### For JWT Secret & Encryption Key:
Generate secure keys locally:
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate PRISMA_FIELD_ENCRYPTION_KEY
openssl rand -base64 32
```
Add these to Vercel project settings.

---

## Deployment Methods

### Method 1: CLI Deployment (Fastest)
```bash
vercel --prod
```

### Method 2: GitHub Integration (Recommended for CI/CD)
1. Go to Vercel Dashboard
2. Connect your GitHub repository
3. Set environment variables in Project Settings
4. Vercel will auto-deploy on every push to `main`

### Method 3: Manual Upload
1. Visit [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose your GitHub repo
4. Configure project
5. Add environment variables
6. Click Deploy

---

## Post-Deployment

### 1. Initialize Database
```bash
npx prisma migrate deploy
npx prisma db seed
```

### 2. Test Deployment
Visit your deployed URL:
- Homepage: `https://your-app.vercel.app/`
- Login: `https://your-app.vercel.app/login`
- Dashboard: `https://your-app.vercel.app/dashboard`

### 3. Verify API Endpoints
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- GET `/api/links` - List user's links
- POST `/api/links` - Create new link
- GET `/api/links/[slug]` - Get link details

---

## Troubleshooting

**Build errors with Prisma?**
- Make sure `DATABASE_URL` is set ✓
- Run: `npx prisma generate` before building

**Database connection issues?**
- Check `DATABASE_URL` format
- Ensure PostgreSQL is accessible from Vercel
- Test with: `psql $DATABASE_URL`

**Cookie/Session issues in production?**
- Set `NEXT_PUBLIC_APP_URL` to your deployed domain
- Clear browser cookies after deployment

**TypeScript errors during build?**
- Run locally: `npm run build` to check for issues
- All .tsx files must have proper "use client" declarations

---

## Current Project Status

| Environment | Status | URL |
|------------|--------|-----|
| Local Dev | ✅ Running | http://localhost:3000 |
| GitHub | ✅ Pushed | main branch updated |
| Vercel | 🚀 Ready | Deploy now! |

---

## Key Features Deployed

✅ User Authentication (Register/Login/Logout)  
✅ Link Management (Create/Read/Update/Delete)  
✅ Link Redirect Service (`/r/[slug]`)  
✅ Analytics Dashboard  
✅ Responsive UI with Shadcn Components  
✅ JWT-based Session Management  
✅ PostgreSQL Database Integration  

---

## Support

For issues, check:
1. Vercel Dashboard → Logs
2. Network tab in browser DevTools
3. Console for error messages
4. Environment variables are set correctly

Last updated: 2026-03-26
