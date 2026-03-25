# BiTracky - Complete Installation Guide

Detailed step-by-step instructions for setting up and running BiTracky locally or in production environments.

## Prerequisites

### Required Software
- **Node.js**: 18 LTS or higher ([Download](https://nodejs.org/))
- **PostgreSQL**: 14+ ([Download](https://www.postgresql.org/download/))
- **Git**: Version control system ([Download](https://git-scm.com/))
- **npm**: Comes with Node.js (or yarn 4+)

### Development Tools (Optional)
- VS Code, IntelliJ IDEA, or preferred editor
- Postman or Insomnia for API testing
- pgAdmin or DBeaver for database management
- Git client (CLI or GUI)

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 2GB | 4GB+ |
| Disk Space | 500MB | 1GB+ |
| Network | Broadband | Broadband |
| OS | Windows/macOS/Linux | Windows 10+, macOS 11+, Ubuntu 20.04+ |

## Step-by-Step Installation

### Step 1: Clone Repository

```bash
git clone <your-repository-url>
cd bitracky
```

Replace `<your-repository-url>` with the actual repository URL.

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages from `package.json`. Installation typically takes 2-3 minutes.

### Step 3: Set Up PostgreSQL Database

#### Option A: Local PostgreSQL Installation

1. **Create a new database:**
```bash
psql -U postgres
```

2. **At the PostgreSQL prompt, execute:**
```sql
CREATE DATABASE bitracky;
\c bitracky
\q
```

#### Option B: Cloud Database (Supabase/Railway)

1. Sign up for [Supabase](https://supabase.com) or [Railway](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string (connection URL)
4. You'll use this in the next step

### Step 4: Configure Environment Variables

1. **Copy the environment template:**
```bash
cp .env.example .env.local
```

2. **Edit `.env.local` file with your settings:**
```env
# PostgreSQL Database URL
# Format: postgresql://username:password@host:port/database_name
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/bitracky"

# JWT Secret for authentication (generate a secure random string)
# Generate with: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-change-in-production"

# Application public URL (used for redirects)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node environment
NODE_ENV="development"
```

**Environment Variable Explanations:**

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/bitracky` |
| `JWT_SECRET` | Secret key for signing JWTs | Random 32+ character string |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL | `http://localhost:3000` |
| `NODE_ENV` | Execution environment | `development` or `production` |

### Step 5: Initialize Database Schema

```bash
# Run Prisma migrations
npx prisma migrate dev --name init
```

This command will:
- Create database tables according to schema.prisma
- Generate the Prisma client
- Create migration files for version control

**Optional: Reset database (⚠️ destructive operation):**
```bash
npx prisma migrate reset
```

### Step 6: Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

You should see console output:
```
▲ Next.js 16.1.6
- Local:        http://localhost:3000
```

## Testing the Installation

### Complete User Workflow Test

#### 1. Visit Homepage
- Navigate to http://localhost:3000
- Verify landing page displays features and CTA buttons
- Check responsive design (resize window)

#### 2. User Registration
- Click "Sign Up" button
- Enter: Email (any valid format) and Password (min 6 characters)
- Click "Create Account"
- Verify success message and automatic redirect to dashboard

#### 3. User Authentication
- Click "Log Out" (or wait for token expiration)
- Click "Sign In"
- Enter registered email and password
- Verify dashboard loads with user info

#### 4. Link Creation
- Click "Create New Link" button
- Enter Original URL: `https://www.example.com`
- Enter Title (optional): `Example Link`
- Enter Custom Slug (optional): `example` or leave blank for auto-generation
- Click "Create"
- Verify link appears in the dashboard list

#### 5. Link Management
- **Copy**: Click copy icon, verify short URL in clipboard
- **Share**: Share short URL (format: http://localhost:3000/r/[slug])
- **Update**: Click edit icon to modify title/slug
- **Delete**: Click delete icon to remove link

#### 6. Redirect Testing
- Visit http://localhost:3000/r/[your-slug]
- Verify redirect to original URL
- Check dashboard shows incremented click count

## Database Management

### Prisma Studio (Visual Database UI)

```bash
npx prisma studio
```

Opens interactive database GUI at http://localhost:5555

**Features:**
- View all records in Users and Links tables
- Create new records
- Edit existing records
- Delete records
- Filter and sort data

### Command-Line Database Access

```bash
# Connect to database
psql -U postgres -d bitracky

# List all tables
\dt

# View all users
SELECT id, email, "createdAt" FROM "User";

# View all links
SELECT id, "originalUrl", slug, clicks FROM "Link";

# Count records
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Link";

# Exit psql
\q
```

## Pre-Deployment Verification

### Installation Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL 14+ installed and running
- [ ] Repository cloned successfully
- [ ] Dependencies installed (`npm list` shows packages)
- [ ] `.env.local` file created with valid values
- [ ] Database URL connectivity verified
- [ ] Prisma migrations executed (`npx prisma migrate status`)
- [ ] Development server starts without errors
- [ ] Can access http://localhost:3000 in browser
- [ ] Can complete full user workflow (register → create link → redirect)
- [ ] No console errors in terminal or browser DevTools

## Troubleshooting

### Database Connection Error: `DATABASE_URL is invalid`

**Symptom:** Error mentions invalid DATABASE_URL or connection string

**Solutions:**
```bash
# 1. Verify format: postgresql://username:password@host:port/dbname
# ✗ Wrong: postgresql://localhost:5432/bitracky (missing user/pass)
# ✓ Right: postgresql://postgres:mypass@localhost:5432/bitracky

# 2. Test connection with psql
psql "postgresql://postgres:your_password@localhost:5432/bitracky"

# 3. If connection fails, check:
# - PostgreSQL is running
# - Username and password are correct
# - Database exists
```

### Error: `connect ECONNREFUSED 127.0.0.1:5432`

**Symptom:** Cannot connect to PostgreSQL on port 5432

**Solutions:**
```bash
# Windows
psql --version  # Verify PostgreSQL is installed
psql: error: Connection refused  # Check service is running
# Start PostgreSQL service in Services GUI or:
net start postgresql-x64-14

# macOS
brew services list  # Check if PostgreSQL service exists
brew services start postgresql  # Start the service

# Linux (Ubuntu/Debian)
sudo systemctl status postgresql  # Check service status
sudo systemctl start postgresql   # Start the service
```

### Error: `Cannot find module '@prisma/client'`

**Symptom:** Prisma client import fails

**Solutions:**
```bash
# 1. Regenerate Prisma client
npx prisma generate

# 2. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 3. Clear Next.js cache
rm -rf .next
npm run dev
```

### Error: `Port 3000 already in use`

**Symptom:** Next.js can't start due to port conflict

**Solutions:**
```bash
# Option 1: Use different port
npm run dev -- -p 3001

# Option 2: Kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_number> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID_number>
```

### Error: `Prisma migration failed`

**Symptom:** `npx prisma migrate dev` command fails

**Solutions:**
```bash
# View migration status
npx prisma migrate status

# Reset database and start fresh (⚠️ destructive)
npx prisma migrate reset

# Or manually reset in PostgreSQL
psql -U postgres -d bitracky -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npx prisma migrate dev --name init
```

### Application loads but no data in dashboard

**Possible causes:**
- Not logged in (verify auth token in cookies)
- Database has no links yet (create a new link)
- Wrong user context (different browser session)

**Debugging:**
```bash
# Check browser DevTools > Application > Cookies
# Verify token exists (usually named similar to 'auth')

# Check Prisma Studio for Links
npx prisma studio
# Filter by your userId
```

## Important Project Files

| File/Directory | Purpose | Key Contents |
|---|---|---|
| `.env.local` | Environment configuration (not version controlled) | DATABASE_URL, JWT_SECRET |
| `prisma/schema.prisma` | Database schema definition | User and Link models |
| `src/app/api/` | REST API route handlers | Auth and link endpoints |
| `src/app/(dashboard)/` | Protected dashboard routes | Dashboard UI and layout |
| `src/components/ui/` | Reusable UI components | Button, Card, Input components |
| `src/app/globals.css` | Design system and global styles | Color tokens, utility classes |
| `src/middleware.ts` | Request middleware | Authentication checks |
| `package.json` | Project dependencies | Scripts and installed packages |

## Security Best Practices

### 1. Generate Strong JWT Secret

```bash
# Using OpenSSL (Unix/macOS/Windows Git Bash)
openssl rand -base64 32

# Using Node.js (cross-platform)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using online generator
# https://github.com/db-password-generator/core (or similar)
```

Example output: `qL+b8K/x1mP9dR2sT4uV6wX7yZ8aB3cD4eF5gH6iJ7kL8m`

### 2. Environment Variable Security

```bash
# ✓ Examples of proper practice
- Never commit .env.local to version control
- Add .env.local to .gitignore (should already be there)
- Use different JWT_SECRET for each environment
- Rotate JWT_SECRET periodically in production
- Use strong, random passwords for database
```

### 3. Database Security

```bash
# Change default PostgreSQL password
psql -U postgres
ALTER USER postgres WITH PASSWORD 'strong_random_password';
\q

# Use non-admin user for application
psql -U postgres
CREATE USER bitracky_user WITH PASSWORD 'app_password';
ALTER DATABASE bitracky OWNER TO bitracky_user;
\q

# Update CONNECTION_URL in .env.local
DATABASE_URL="postgresql://bitracky_user:app_password@localhost:5432/bitracky"
```

## Deployment Preparation

### Pre-Deployment Steps

```bash
# 1. Run production build
npm run build

# 2. Test production build locally
npm start

# 3. Run linter for code quality
npm run lint

# 4. Check for type errors
npx tsc --noEmit
```

### Recommended Deployment Platforms

| Platform | Hosting | Database | Cost | Ease |
|----------|---------|----------|------|------|
| **Vercel** | Free/Paid | Vercel Postgres or external | $0-20/mo | Very Easy |
| **Railway** | Paid | Included | $5-15/mo | Easy |
| **Render** | Free/Paid | PostgreSQL add-on | $0-15/mo | Easy |
| **Docker + Cloud Run** | GCP | Cloud SQL | $5-20/mo | Moderate |
| **AWS App Runner** | AWS | RDS PostgreSQL | $10-30/mo | Moderate |

See [README.md](./README.md) for deployment architecture details.

## Next Steps

1. **Explore codebase**: Review `src/` directory structure
2. **Test APIs**: Use Postman with provided routes
3. **Customize**: Update colors in `src/app/globals.css`
4. **Deploy**: Follow platform-specific deployment guides
5. **Monitor**: Set up logging and error tracking

## Support & Resources

### Documentation
- [README.md](./README.md) - Project overview and architecture
- [QUICKSTART.md](./QUICKSTART.md) - 5-minute quick start
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Community & Help
- GitHub Issues - Report bugs and request features
- Stack Overflow - Search for common issues
- Next.js Discord - Community support
- Prisma Community - ORM-specific questions

---

**Successfully set up? Great! Now explore the [README](./README.md) for architecture details or jump to [QUICKSTART](./QUICKSTART.md) if you just want to start building.**
