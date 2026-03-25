# BiTracky - Quick Start Guide

Get BiTracky running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed (or use Supabase/Railway)
- Git installed

## Step 1: Clone & Install (2 minutes)

```bash
git clone <repository-url>
cd bitracky
npm install
```

## Step 2: Configure Database (2 minutes)

### Option A: Local PostgreSQL

```bash
# Create database
psql -U postgres -c "CREATE DATABASE bitracky;"

# Copy environment template
cp .env.example .env.local

# Edit .env.local and set DATABASE_URL:
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/bitracky"

# Run migrations
npx prisma migrate dev --name init
```

### Option B: Cloud Database (Supabase/Railway)

```bash
# Copy env template
cp .env.example .env.local

# In .env.local, paste DATABASE_URL from Supabase/Railway:
# DATABASE_URL="postgresql://user:pass@host.supabase.co:5432/postgres"

# Run migrations
npx prisma migrate dev --name init
```

## Step 3: Start Development Server (1 minute)

```bash
npm run dev
```

Open your browser: **http://localhost:3000**

## Quick Test Walkthrough

1. **Register**: Click "Sign Up" → Enter email/password → Create account
2. **Create Link**: Click "Create New Link" → Enter URL → Submit
3. **Copy**: Click copy icon to copy short link
4. **Share**: Share the generated short URL
5. **Track**: Check dashboard for click counts

## Common Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Run production build
npm run lint             # Check code quality

npx prisma studio       # Open database UI (http://localhost:5555)
npx prisma migrate dev  # Run new migrations
```

## What You Get

✅ **Full-Stack**: Next.js 16 + React 19 + TypeScript  
✅ **Database**: PostgreSQL with Prisma ORM  
✅ **Security**: JWT authentication + password hashing  
✅ **UI**: Tailwind CSS + Shadcn components  
✅ **APIs**: REST endpoints for all operations  
✅ **Responsive**: Mobile-friendly design  
✅ **Analytics**: Click tracking per link  

## File Structure

```
src/
├── app/                    # Next.js pages & API routes
├── components/             # React components
├── middleware.ts           # Authentication middleware
prisma/
└── schema.prisma           # Database schema
```

## Troubleshooting

**Database connection error?**
```bash
# Verify PostgreSQL is running
psql --version

# Check DATABASE_URL format
# postgresql://user:password@localhost:5432/bitracky
```

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Prisma errors?**
```bash
rm -rf node_modules
npm install
npx prisma generate
```

## Next Steps

- 📖 Read [README.md](./README.md) for full architecture
- 🔧 Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
- 🚀 Deploy using [Vercel](https://vercel.com), [Railway](https://railway.app), or your preferred platform
- 🎨 Customize colors in `src/app/globals.css`

---

**Ready to build? Start coding!** 🚀
