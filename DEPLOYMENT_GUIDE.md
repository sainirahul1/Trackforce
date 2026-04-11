# 🚀 Complete Deployment Guide: TrackForce Multi-Portal SaaS

This guide provides a detailed, step-by-step walkthrough of how to deploy your backend to **Render** and your four frontend portals to **Vercel**.

## 🏗️ Architecture Overview
- **Backend**: One single Node.js/Express app on Render.
- **Frontends**: Four independent Vite/React projects on Vercel.

---

## 1️⃣ Phase 1: Backend Deployment (Render)

1.  **Connect Repo**: Create a new **Web Service** on Render and connect your GitHub repository.
2.  **Root Directory**: Set this to `backend`.
3.  **Environment Variables**: Navigate to the **Environment** tab in your Render dashboard and add the following:

| Key | Value | Description |
| :--- | :--- | :--- |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your_random_secret` | A secure string for authentication |
| `ALLOWED_ORIGINS` | `https://p1.vercel.app, https://p2.vercel.app...` | **Crucial**: Comma-separated list of all 4 Vercel URLs |
| `NODE_ENV` | `production` | Set to production |

> [!IMPORTANT]
> **Dynamic Port**: Do NOT set a `PORT` variable. Render will automatically assign one, and the code is now configured to detect it.

---

## 2️⃣ Phase 2: Frontend Deployment (Vercel)

You need to create **four (4) separate projects** on Vercel, one for each folder in `frontend/`.

### Steps for each portal (`employee`, `manager`, `tenant`, `superadmin`):
1.  **New Project**: Import your repository.
2.  **Root Directory**: Select the specific folder (e.g., `frontend/manager`).
3.  **Build Settings**:
    *   Framework Preset: `Vite`
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
4.  **Environment Variables**: Go to **Settings** -> **Environment Variables** for each project:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-backend.onrender.com` | The URL of your Render backend |
| `VITE_EMPLOYEE_URL` | `https://employee-portal.vercel.app` | The final URL of the employee portal |
| `VITE_MANAGER_URL` | `https://manager-portal.vercel.app` | The final URL of the manager portal |
| `VITE_TENANT_URL` | `https://tenant-portal.vercel.app` | The final URL of the tenant portal |
| `VITE_SUPERADMIN_URL` | `https://admin-portal.vercel.app` | The final URL of the superadmin portal |

---

## 3️⃣ Phase 3: Cross-Portal Redirection

The code is now refactored to handle "portal jumping." 

- If you are on the **Manager Portal** and try to log in as an **Employee**, the app will look at your `VITE_EMPLOYEE_URL` and redirect you to the correct domain automatically.
- This ensures a seamless "One App" experience even though they are separate deployments.

---

## 📦 Asset Storage (Important Note)

> [!WARNING]
> **Data Loss Risk**: Render's Free/Starter tiers use "Ephemeral Storage." This means any profile images uploaded to the `/uploads` folder will be deleted every time the server restarts (at least once a day).

**Solution**: For a real production app, you should migrate the file upload logic to **AWS S3** or **Cloudinary**. I have kept the local uploads working for now, but be aware of this behavior on Render.

---

## ✅ Deployment Checklist
- [ ] Backend status on Render is "Live".
- [ ] `ALLOWED_ORIGINS` on Render contains all 4 Vercel URLs.
- [ ] `VITE_API_URL` on Vercel points to the Render HTTPS URL.
- [ ] Each Vercel project has its own `vercel.json` for SPA routing (already added by me).
