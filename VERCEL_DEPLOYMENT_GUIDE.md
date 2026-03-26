# BiTracky Vercel Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git repository setup
- Vercel account (https://vercel.com)
- PostgreSQL database (e.g., from Neon or Railway)

## Step 1: Prepare Your Local Environment

### 1.1 Setup Local .env File
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 1.2 Fill in Local Environment Variables
Edit `.env.local` with your local PostgreSQL database:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bitracky"
JWT_SECRET="generate-with: openssl rand -base64 32"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PRISMA_FIELD_ENCRYPTION_KEY="your-encryption-key"
```

### 1.3 Setup Database Locally
```bash
# Install dependencies
npm install

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 1.4 Test Locally
```bash
npm run build
npm run start
```
Visit http://localhost:3000 and test register/login

## Step 2: Setup PostgreSQL for Vercel

### Option A: Use Neon (Recommended)
1. Go to https://neon.tech
2. Create account and new project
3. Copy connection string (looks like: `postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname`)
4. Keep this for Vercel setup

### Option B: Use Railway
1. Go to https://railway.app
2. Create new project → PostgreSQL
3. Copy connection URI
4. Keep this for Vercel setup

### Option C: Use Render
1. Go to https://render.com
2. Create PostgreSQL instance
3. Copy connection string
4. Keep this for Vercel setup

## Step 3: Setup on Vercel

### 3.1 Connect Your Repository
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select "Next.js" as framework (auto-detected)
5. Click "Deploy"

### 3.2 Add Environment Variables
**IMPORTANT:** Go to Project Settings → Environment Variables

Add these variables for **Production**:

```
DATABASE_URL = postgresql://user:password@host:port/dbname
DATABASE_POSTGRES_URL = postgresql://user:password@host:port/dbname
DATABASE_PRISMA_DATABASE_URL = postgresql://user:password@host:port/dbname
JWT_SECRET = (generate with: openssl rand -base64 32)
NODE_ENV = production
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
PRISMA_FIELD_ENCRYPTION_KEY = your-encryption-key
```

**CRITICAL STEPS:**
1. All three DATABASE URLs must point to same PostgreSQL database
2. JWT_SECRET must be strong and same as production
3. Check "Production" checkbox for each variable
4. Click "Save"

### 3.3 Deploy
1. Back to Deployments tab
2. Click "Redeploy" to deploy with new environment variables
3. Wait for build to complete
4. Check Logs if there are errors

## Step 4: Verify Deployment

### 4.1 Check Deployment
- Open your Vercel project URL
- Should NOT show "Internal Server Error"
- Landing page should load

### 4.2 Test Authentication
1. Go to /register
2. Create account with: test@example.com / password123
3. Should say "register successfully"
4. Go to /login
5. Login with same credentials
6. Should say "Login successful"

### 4.3 Check Logs (if error)
In Vercel Dashboard:
1. Go to your project
2. Click "Deployments" tab
3. Find the deployment and click it
4. Click "Runtime Logs"
5. Look for error messages

## Troubleshooting

### Error: "Server configuration error"
**Cause:** JWT_SECRET not set in Vercel
**Fix:** Go to Settings → Environment Variables → Add JWT_SECRET

### Error: HTTP 500 on /api/auth/login
**Cause:** Database connection issue
**Fix:** 
1. Verify DATABASE_URL is correct (can connect from your laptop)
2. Make sure all 3 DATABASE_* variables are set
3. Redeploy after changing variables

### Error: "Cannot find your email or password"
**Cause:** User doesn't exist or password wrong
**Fix:** Register first, then login with same credentials

### Error: "Server error during registration"
**Cause:** Email already exists or database error
**Fix:** Use different email or check database connection

## After Successful Deployment

1. Update `NEXT_PUBLIC_APP_URL` to your Vercel domain
2. Setup custom domain (optional)
3. Enable Vercel Analytics (optional)
4. Setup GitHub Branch Protection (optional)

## Common Commands

```bash
# Build locally
npm run build

# Start production server locally
npm run start

# Generate Prisma types
npx prisma generate

# View Prisma schema
npx prisma studio

# Check environment
echo $DATABASE_URL
echo $JWT_SECRET
```

## Security Checklist

- [ ] JWT_SECRET is strong (40+ characters)
- [ ] DATABASE_URL uses SSL/TLS connection
- [ ] .env.local is in .gitignore
- [ ] .env.example doesn't contain real secrets
- [ ] All database variables are set on Vercel
- [ ] NODE_ENV is "production" on Vercel
- [ ] Vercel env vars are marked as "Production"

## FAQ

**Q: How do I change JWT_SECRET?**
A: Change it in Vercel Settings → Environment Variables. All sessions will be invalidated.

**Q: Can I use SQLite instead of PostgreSQL?**
A: No, SQLite doesn't work on Vercel (stateless environment). Use PostgreSQL.

**Q: How do I reset the database?**
A: Delete all data from your database provider, then redeploy to run migrations.

**Q: How do I see logs from Vercel deployment?**
A: Go to Deployments → click deployment → Runtime Logs tab.

**Q: My login keeps failing, what do I do?**
A: 1) Check db connection 2) Register new account 3) Try logging in 4) Check Vercel logs

