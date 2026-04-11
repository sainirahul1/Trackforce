# TrackForce SaaS — Deployment Guide

## Architecture Overview

```
┌──────────────────┐     HTTPS      ┌──────────────────────┐     MongoDB Atlas
│   Frontend        │ ──────────────►│   Backend API         │ ──────────────────►
│   (Vercel)        │   /reatchall/* │   (Render/Railway)    │   (Cloud Database)
│                   │◄──────────────│                       │◄──────────────────
│   React + Vite    │    JSON        │   Node.js + Express   │    Mongoose
└──────────────────┘                └──────────────────────┘
```

---

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free cluster
2. Create a database user with read/write access
3. Whitelist IP `0.0.0.0/0` (allow from anywhere) for Render/Railway access
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/trackforce?retryWrites=true&w=majority
   ```

---

## Step 2: Backend Deployment (Render)

### Using Render Dashboard

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repository
3. Set the following:
   - **Name:** `trackforce-api`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free (or Starter for production)

4. Set Environment Variables:
   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5001` |
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Generate a strong secret: `openssl rand -hex 64` |
   | `FRONTEND_URL` | `https://your-app.vercel.app` (set after Vercel deploy) |
   | `RATE_LIMIT_MAX` | `200` |
   | `AUTH_RATE_LIMIT_MAX` | `10` |

5. Click **Deploy**

### Using render.yaml (Blueprint)

The `backend/render.yaml` file is pre-configured. Use Render's Blueprint feature:
1. Go to Render → New → Blueprint
2. Connect your repo
3. Render will auto-detect `render.yaml` and create the service
4. Set the `sync: false` variables manually in the dashboard

### Alternative: Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set root directory to `backend`
3. Add the same environment variables as above
4. Railway auto-detects Node.js and runs `npm start`

---

## Step 3: Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) → Add New → Project
2. Import your GitHub repository
3. Set the following:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Set Environment Variables:
   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://trackforce-api.onrender.com` (your Render URL, NO `/api` suffix) |
   | `VITE_SOCKET_URL` | `https://trackforce-api.onrender.com` |
   | `VITE_GOOGLE_MAPS_API_KEY` | Your Google Maps API key |

5. Click **Deploy**

### Post-Deploy: Update Backend CORS

After getting your Vercel URL, go back to Render and update:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## Step 4: Verify Deployment

### API Health Check
```bash
curl https://trackforce-api.onrender.com/
# Expected: "TrackForce API is running..."
```

### Portal Isolation Test
```bash
# Login as employee
TOKEN=$(curl -s -X POST https://trackforce-api.onrender.com/reatchall/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@test.com","password":"test123","portal":"EMPLOYEE"}' \
  | jq -r '.token')

# Try accessing manager API (should be 403)
curl -s https://trackforce-api.onrender.com/reatchall/manager/team \
  -H "Authorization: Bearer $TOKEN"
# Expected: {"message":"Access denied...","code":"ROLE_UNAUTHORIZED"}
```

### JWT Verification
1. Copy a JWT token from login response
2. Go to [jwt.io](https://jwt.io)
3. Paste the token
4. Verify the payload contains: `id`, `role`, `tenant`, `portal`

---

## Step 5: Custom Domain (Optional)

### Vercel Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `app.trackforce.com`)
3. Configure DNS: CNAME → `cname.vercel-dns.com`

### Render Custom Domain
1. Render Dashboard → Service → Settings → Custom Domain
2. Add your API domain (e.g., `api.trackforce.com`)
3. Configure DNS as instructed

### Subdomain Portals (Phase 2)
For subdomain-based portal isolation:
```
employee.trackforce.com  → /employee/*
manager.trackforce.com   → /manager/*
tenant.trackforce.com    → /tenant/*
admin.trackforce.com     → /superadmin/*
```
This requires a Vercel rewrite configuration and DNS wildcard setup.

---

## Security Checklist

- [x] JWT tokens include `portal` claim
- [x] Backend validates `role` AND `portal` on every request
- [x] Rate limiting on auth endpoints (10 attempts / 15 min)
- [x] Rate limiting on API endpoints (200 requests / 15 min)
- [x] Helmet security headers enabled
- [x] CORS restricted to frontend domain
- [x] Frontend routing guards validate role + portal
- [x] Cross-tenant data isolation via tenantMiddleware
- [x] 401 auto-logout in Axios interceptor
- [ ] HTTPS enforced (Render/Vercel handle this automatically)
- [ ] MongoDB connection with TLS (Atlas handles this)
- [ ] Regular JWT secret rotation

---

## Environment Variables Reference

### Backend (.env)
```env
PORT=5001
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=<64-char-hex-string>
FRONTEND_URL=https://your-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=10
```

### Frontend (.env)
```env
VITE_API_URL=https://your-api.onrender.com
VITE_SOCKET_URL=https://your-api.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

---

## API Route Reference

| Portal | Prefix | Middleware Stack |
|--------|--------|-----------------|
| Public | `/reatchall/public/*` | rate-limit only |
| Auth | `/reatchall/auth/*` | auth rate-limit |
| Employee | `/reatchall/employee/*` | protect → validateRole(employee) → validatePortal(employee) → tenant |
| Manager | `/reatchall/manager/*` | protect → validateRole(manager) → validatePortal(manager) → tenant |
| Tenant | `/reatchall/tenant/*` | protect → validateRole(tenant) → validatePortal(tenant) → tenant |
| SuperAdmin | `/reatchall/superadmin/*` | protect → validateRole(superadmin) → validatePortal(superadmin) |
| Admin | `/reatchall/admin/*` | (alias for superadmin) |
| Issues | `/reatchall/issues/*` | protect → tenant |
