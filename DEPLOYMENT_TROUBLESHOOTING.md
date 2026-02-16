# Render & Vercel Deployment - Troubleshooting Guide

## Issue #1: Render - Database Connection Error (ECONNREFUSED)

### Problem
```
ERROR [TypeOrmModule] Unable to connect to the database.
Error: connect ECONNREFUSED ::1:5432
```

This error occurs when the backend cannot connect to PostgreSQL. The application is trying to connect to `localhost:5432` instead of the Render-hosted database.

### Root Cause
Missing or incorrect environment variables in Render dashboard:
- `DATABASE_HOST` not configured
- Application falls back to `localhost` (hardcoded default)
- Render's internal network cannot access localhost

### Solution: Configure Render Environment Variables

**Step 1: Create PostgreSQL Database on Render**
1. Go to https://render.com/dashboard
2. Click "New +" → "PostgreSQL"
3. Choose a name (e.g., `zonesport-db`)
4. Select region (same as backend!)
5. Choose plan and click "Create Database"
6. **Wait for database to be ready** ✋

**Step 2: Get Database Connection Info**
1. Once database is ready, click on it
2. Copy these values from "Connections":
   - **Host** (Internal Server)
   - **Database**
   - **User**
   - **Password**

**Step 3: Add Environment Variables to Backend Service**
1. Go to your Backend Service on Render
2. Go to "Environment" tab
3. Add these variables:

```
DATABASE_HOST=<copy from PostgreSQL connections->Host>
DATABASE_PORT=5432
DATABASE_USER=<copy from PostgreSQL connections->User>
DATABASE_PASSWORD=<copy from PostgreSQL connections->Password>
DATABASE_NAME=<copy from PostgreSQL connections->Database>
NODE_ENV=production
PORT=3001
JWT_SECRET=<generate: openssl rand -base64 32>
JWT_RESET_SECRET=<generate: openssl rand -base64 32>
FRONTEND_URL=https://your-vercel-app.vercel.app
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
SENDER_NAME=ZoneSport
PASSWORD_RESET_URL=https://your-vercel-app.vercel.app/reset-password
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE_TIMEOUT=30000
```

**Step 4: Deploy**
1. Click "Deploy" or push to GitHub to trigger redeploy
2. Monitor logs: Render Dashboard → Your Service → Logs
3. Should see: `[Nest] Starting Nest application...`

### Verification
Once deployed, check logs for:
```
✓ [Nest] NestFactory] Starting Nest application...
✓ [InstanceLoader] TypeOrmModule dependencies initialized
✓ [EMAIL] Resend API configured and ready
✓ Server running on port 3001
```

**Not** seeing database connection errors like before ✓

---

## Issue #2: Vercel - Invalid Configuration Schema

### Problem
```
The `vercel.json` schema validation failed with the following message: 
should NOT have additional property `testCommand`
```

### Root Cause
The `vercel.json` file contained an invalid property `testCommand` that is not supported by Vercel's schema.

### Solution: Fixed ✓

**What was removed:**
```json
"testCommand": "cd client && npm run lint"
```

**Current valid `vercel.json`:**
```json
{
    "buildCommand": "cd client && npm run build",
    "installCommand": "cd client && npm install",
    "outputDirectory": "client/.next",
    "env": {
        "NEXT_PUBLIC_API_URL": {
            "required": true
        }
    }
}
```

**Verification:**
- ✓ File has been corrected
- ✓ Commit and push your changes
- ✓ Redeploy on Vercel

---

## Complete Deployment Checklist

### Backend (Render)
- [ ] PostgreSQL database created on Render
- [ ] Database connection info copied
- [ ] Backend service created on Render
- [ ] All 18 environment variables added:
  - [ ] Database (5): HOST, PORT, USER, PASSWORD, NAME
  - [ ] Auth (2): JWT_SECRET, JWT_RESET_SECRET
  - [ ] API (1): PORT, NODE_ENV
  - [ ] Frontend (1): FRONTEND_URL
  - [ ] Email (3): RESEND_API_KEY, RESEND_FROM_EMAIL, SENDER_NAME
  - [ ] Password Reset (1): PASSWORD_RESET_URL
  - [ ] Connection Pool (3): DB_POOL_MIN, DB_POOL_MAX, DB_POOL_IDLE_TIMEOUT
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm run start:prod`
- [ ] Region matches PostgreSQL region
- [ ] Redeploy and verify logs

### Frontend (Vercel)
- [ ] Project connected to GitHub
- [ ] `vercel.json` validated (testCommand removed)
- [ ] Environment variable set:
  - [ ] NEXT_PUBLIC_API_URL = `https://your-render-backend.onrender.com`
- [ ] Build settings correct:
  - [ ] Build Command: `cd client && npm run build`
  - [ ] Install Command: `cd client && npm install`
  - [ ] Output Directory: `client/.next`
- [ ] Deploy and test

### Database (Render PostgreSQL)
- [ ] Database created
- [ ] User created
- [ ] Password set
- [ ] Connection strings copied
- [ ] Backend can connect (check logs)

### Post-Deployment Testing
- [ ] Backend health check: `curl https://your-api.onrender.com/api`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Login page accessible
- [ ] Can attempt to register (even if fails, shows API connection worked)

---

## Debugging Steps

### 1. Check Render Backend Logs
```
Render Dashboard 
→ Your Backend Service 
→ Logs 
→ Look for these success indicators:
  ✓ [Nest] Starting Nest application
  ✓ TypeOrmModule dependencies initialized
  ✓ Server listening on port 3001
```

### 2. Check for Database Connection Issues
Look for in logs:
```
ERROR [TypeOrmModule] Unable to connect to the database
```

**If you see this**: Database variables are wrong or database is not ready

**Fix:**
1. Verify PostgreSQL is "Available" (not "Creating")
2. Copy HOST value from "Internal Server" (not External)
3. Check DATABASE_HOST doesn't have `postgres://`
4. Make sure DATABASE_NAME matches the database name, not service name

### 3. Test Database Connectivity from Backend
Add a health check endpoint that tests DB connection:
```typescript
// In your health controller
@Get('health/db')
async checkDatabase() {
  const connection = this.dataSource.isInitialized;
  return { database: connection ? 'connected' : 'disconnected' };
}
```

### 4. Frontend Not Connecting to Backend
Check Vercel logs for:
- CORS errors
- 502 Bad Gateway (backend not responding)
- Network errors in browser DevTools → Console

**Fix:**
1. Verify NEXT_PUBLIC_API_URL is set in Vercel
2. Check it points to correct backend URL
3. Ensure backend is running (check Render logs)
4. Test CORS by accessing backend directly in browser

---

## Common Environment Variable Mistakes

| Variable | Wrong | Correct |
|----------|-------|---------|
| DATABASE_HOST | `postgres://server.onrender.com` | `server.onrender.com` |
| DATABASE_HOST | Public Server host | **Internal Server** host |
| DATABASE_PORT | `5432:5432` | `5432` |
| FRONTEND_URL | `localhost:3000` | `https://your-app.vercel.app` |
| NEXT_PUBLIC_API_URL | Missing | `https://your-api.onrender.com` |
| Node Version | Not specified | `18` or `20` |

---

## Where to Find Each Value

### Render PostgreSQL Connection Info Location
```
Render Dashboard
→ PostgreSQL Service
→ Connections Section

Internal Server: <DATABASE_HOST>
Database: <DATABASE_NAME>
User: <DATABASE_USER>
Password: <DATABASE_PASSWORD>
Port: 5432
```

### Render Backend Service URL
```
Render Dashboard
→ Backend Service
→ Properties

Web Service URL: https://your-service.onrender.com
```

### Vercel Frontend URL
```
Vercel Dashboard
→ Your Project
→ Deployments (latest)

Production URL: https://your-app.vercel.app
```

---

## Quick Links

- 🔗 [Render Database Docs](https://render.com/docs/databases)
- 🔗 [Render Environment Variables](https://render.com/docs/environment-variables)
- 🔗 [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- 🔗 [Vercel Config Reference](https://vercel.com/docs/project-configuration)
- 🔗 [NestJS Production Deployment](https://docs.nestjs.com/deployment)

---

## Support

If errors persist:
1. Check logs in both platforms
2. Verify all environment variables are set
3. Ensure PostgreSQL is in "Available" state
4. Try redeploying from Render dashboard
5. Check GitHub for latest code

**Last Updated:** February 16, 2026
