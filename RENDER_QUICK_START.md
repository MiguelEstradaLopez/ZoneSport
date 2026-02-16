# RENDER DEPLOYMENT QUICK START

## 🚀 5-Minute Setup Guide

### Step 1: Create PostgreSQL Database
1. Go to `https://render.com/dashboard`
2. New → PostgreSQL
3. Name: `zonesport-db`
4. Choose your region
5. Create Database
6. **⏰ Wait ~2 minutes for creation**

### Step 2: Copy Database Credentials
From the PostgreSQL dashboard, find "Connections" section:
- **Internal Server** = DATABASE_HOST (use this!)
- **Database** = zonesport (or what you named it)
- **User** = (usually `postgres` or custom name)
- **Password** = (your chosen password)

### Step 3: Deploy Backend
1. Connect your GitHub repo to Render
2. Create new Web Service → Node
3. Build Command: `npm install && npm run build --workspace=server`
4. Start Command: `npm run start:prod --workspace=server`
5. Add these 18 Environment Variables:

```
DATABASE_HOST=internal-server-dns.onrender.com
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here
DATABASE_NAME=zonesport
NODE_ENV=production
PORT=3001
JWT_SECRET=<run: openssl rand -base64 32>
JWT_RESET_SECRET=<run: openssl rand -base64 32>
FRONTEND_URL=https://your-app.vercel.app
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
SENDER_NAME=ZoneSport
PASSWORD_RESET_URL=https://your-app.vercel.app/reset-password
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE_TIMEOUT=30000
```

### Step 4: Deploy Frontend
1. Create Vercel project (auto-detects Next.js)
2. Set Environment: `NEXT_PUBLIC_API_URL=https://your-api.onrender.com`
3. Deploy

### Step 5: Test
- Visit frontend: `https://your-app.vercel.app`
- Should load without errors
- Try logging in (will show any API connection issues)

---

## ⚠️ Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using PUBLIC server host for DATABASE_HOST | Use **INTERNAL** server address only |
| `DATABASE_HOST=postgres://...` | Remove `postgres://` prefix - just hostname |
| Port `5432:5432` | Use just `5432` |
| Frontend URL without https | Use `https://...` not `http://` |
| Forgetting NEXT_PUBLIC_API_URL | Add to Vercel environment |
| Not waiting for DB creation | Wait until status = "Available" |

---

## 🔍 Verify Deployment

Check Render logs:
```
[Nest] Starting Nest application ✓
TypeOrmModule dependencies initialized ✓
App listening on port 3001 ✓
```

If you see database errors → Check env vars (most common cause)

---

See `DEPLOYMENT_TROUBLESHOOTING.md` for detailed troubleshooting.
