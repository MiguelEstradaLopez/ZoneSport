# 🚀 Deployment Configuration Guide

## Vercel (Frontend)

### 1. Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL = https://your-backend-render.onrender.com
```

**Important**: This must start with `NEXT_PUBLIC_` to be accessible in the browser.

### 2. Deploy

Push to GitHub → Vercel auto-deploys from `main` branch

---

## Render (Backend)

### 1. Create PostgreSQL Database

1. Go to **render.com**
2. Click **New +** → **PostgreSQL**
3. Set:
   - Name: `zonesport-db`
   - Database: `zonesport`
   - User: `zonesport_user`
   - Password: Generate secure password (copy this)
   - Region: Same as backend (e.g., Ohio)

4. **Save connection details**:
   - External Database URL
   - Internal Database URL (for connections within Render)
   - Hostname
   - Port
   - User
   - Password
   - Database name

### 2. Create Web Service (Backend)

1. Click **New +** → **Web Service**
2. Connect GitHub repository
3. Set:
   - Name: `zonesport-backend`
   - Environment: Node
   - Build Command: `npm install && npm run build:server`
   - Start Command: `npm run start:prod --workspace=server`
   - Region: Ohio (same as DB)
   - Plan: Free

### 3. Configure Environment Variables

In **Environment** tab, add these variables:

**From Render PostgreSQL Dashboard** (copy from your DB service):

```
DATABASE_HOST = [Internal Database URL hostname, NOT the full URL]
DATABASE_PORT = 5432
DATABASE_USER = zonesport_user
DATABASE_PASSWORD = [Your secure password from DB setup]
DATABASE_NAME = zonesport
DATABASE_URL = postgresql://[user]:[password]@[host]:[port]/[database]
```

**JWT & Security** (generate these):

```
JWT_SECRET = [Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
JWT_RESET_SECRET = [Generate new one]
```

**Frontend & Email**:

```
FRONTEND_URL = https://your-vercel-frontend.vercel.app
RESEND_API_KEY = [From https://resend.com]
RESEND_FROM_EMAIL = noreply@yourdomain.com
PASSWORD_RESET_URL = https://your-vercel-frontend.vercel.app/reset-password
SENDER_NAME = ZoneSport
```

**Database Connection Pool**:

```
DB_POOL_MIN = 2
DB_POOL_MAX = 10
DB_POOL_IDLE_TIMEOUT = 30000
```

### 4. Verify Backend Deployment

After first deploy:

1. Check logs for: `Database Host: [IP]` (should NOT say "NOT SET")
2. Should see: `TypeOrmModule dependencies initialized`
3. Both retries should NOT appear repeatedly

---

## ⚠️ Common Issues & Solutions

### Backend Shows "Database Host: NOT SET (using localhost)"

**Problem**: Environment variables not set in Render dashboard
**Solution**:

1. Check Render web service → Environment tab
2. Add all `DATABASE_*` variables with actual values (NOT `${...}` syntax)
3. Click **Save** and redeploy service

### Vercel Build Fails with `env.NEXT_PUBLIC_API_URL should be string`

**Problem**: Invalid vercel.json schema
**Solution**: ✅ Already fixed - set NEXT_PUBLIC_API_URL in Vercel dashboard instead

### Database Connection Refused (ECONNREFUSED)

**Problem**: Backend can't reach PostgreSQL
**Causes**:

- DATABASE_HOST is localhost (should be Render DB hostname)
- DATABASE_PORT is wrong (should be 5432)
- DATABASE credentials don't match
- Render PostgreSQL service not running

**Solution**:

1. Verify Render DB service is running (green status)
2. Copy Database Host from Render DB dashboard (Internal URL)
3. Update Render web service environment variables
4. Redeploy

### All Requests Return 500 Error

**Problem**: Backend configuration issue
**Solution**:

1. Check Render logs for specific error
2. Verify all environment variables are set
3. Check DATABASE_URL format: `postgresql://user:pass@host:port/db`
4. Ensure JWT secrets are set and match across environments

---

## Quick Checklist

- [ ] Render PostgreSQL created and running
- [ ] PostgreSQL hostname, user, password copied
- [ ] Render web service created
- [ ] All 19 environment variables set in Render dashboard
- [ ] Backend deployed and showing correct DATABASE_HOST in logs
- [ ] Vercel frontend deployed
- [ ] NEXT_PUBLIC_API_URL set to backend URL in Vercel
- [ ] Test API calls from frontend

---

## Testing Connectivity

### From Frontend

```javascript
// Should return 200
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

### From Render Logs

```bash
# Should show database connected and app running
[NestFactory] Starting Nest application...
[TypeOrmModule] TypeORM dependencies initialized
```

---

## Production Tips

1. **Use strong passwords**: Generate with `openssl rand -base64 32`
2. **Rotate JWT secrets regularly**: Both JWT_SECRET and JWT_RESET_SECRET
3. **Monitor Render logs**: Set up alerts for errors
4. **Database backups**: Enable automatic backups in Render PostgreSQL
5. **CORS settings**: Verify FRONTEND_URL matches your Vercel domain
6. **Email testing**: Send test email through Resend before going live
