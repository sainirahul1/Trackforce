# TrackForce Multi-Portal SaaS

TrackForce is a comprehensive multi-portal SaaS solution designed to manage and monitor field executives, operations, and organizational hierarchies. It provides real-time tracking, assignment management, and multi-tenant capabilities. 

## 🏗 System Architecture

The application is built on a **Single Backend, Multi-Frontend** architecture to support various user roles autonomously.

- **Backend:** A unified Node.js / Express.js application handling the core business logic, API requests, database interactions, and real-time Socket.io connections.
- **Frontends:** Four distinct React.js (Vite) Single Page Applications (SPAs), each tailored for a specific organizational role.

### Frontend Portals 
1. **Employee Portal** (`frontend/employee`): Designed for Field Executives to manage missions, submit orders, check-in for visits, and stream live GPS tracking.
2. **Manager Portal** (`frontend/manager`): Provides a Command Center for managers to monitor their teams in real-time on maps, view analytics, assign tasks, and track inventory.
3. **Tenant Portal** (`frontend/tenant`): Meant for specific organizational clients or tenants to view their overarching organizational metrics and notifications.
4. **Super Admin Portal** (`frontend/superadmin`): Central administrative hub for the SaaS owner to manage companies, subscriptions, analytics, and global user roles.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + Autoprefixer
- **State/Real-time:** Socket.io-client
- **Maps:** Google Maps API (`@react-google-maps/api`)
- **Data Visualization:** Recharts, Chart.js

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Database:** MongoDB (via Mongoose 9.x)
- **Real-time:** Socket.io
- **Security:** Helmet, Express Rate Limit, bcryptjs, cors
- **Authentication:** JSON Web Tokens (JWT)
- **File Uploads:** Multer (Local Storage - `/uploads`)

---

## 📁 Directory Structure

```
trackforce_frontend/
├── backend/                  # Monolithic Backend Service
│   ├── controllers/          # API route handlers organized by portal
│   ├── middleware/           # Security, Auth, Multi-Tenancy validations
│   ├── models/               # Mongoose Data Schemas (MongoDB)
│   ├── routes/               # Express routing logic
│   ├── services/             # Core business logic and maintenance rules
│   ├── utils/                # Utility helpers (Activity loggers, etc.)
│   ├── socket.js             # Socket.io connection and real-time handlers
│   └── server.js             # Main Express entry point
├── frontend/                 # Frontend Portals
│   ├── employee/             # Employee/Field Executive app
│   ├── manager/              # Manager Dashboard app
│   ├── superadmin/           # Super Admin Portal app
│   └── tenant/               # Tenant Portal app (if configured)
└── DEPLOYMENT_GUIDE.md        # Deployment instructions & Environment configuration
```

---

## 🔒 Security & Middleware

The API endpoints are heavily protected by a robust middleware pipeline established in `backend/server.js`:
- **Auth Guard (`protect`)**: Verifies JWT tokens.
- **Role Guard (`validateRole`)**: Ensures the user has the correct overarching role (e.g., manager, employee).
- **Portal Guard (`validatePortal`)**: Secures portals from cross-login vulnerabilities and guarantees portal isolation.
- **Tenant Scope (`tenantMiddleware`)**: Enforces multi-tenancy rules ensuring managers and employees can only access data relevant to their tenant ID.
- **Rate Limiters**: Defends against brute force via `authLimiter` and `apiLimiter`.

---

## 🔌 API Endpoints (Core Routes)

The project leverages unified routing paths under `/reatchall/`:

- **Public**: `/reatchall/public/*`
- **Auth**: `/reatchall/auth/*`
- **Employee**: `/reatchall/employee/*` (Visits, Orders, Tracking, Tasks)
- **Manager**: `/reatchall/manager/*` (Team Performance, Inventory, Target Tracking)
- **Tenant**: `/reatchall/tenant/*` (Notifications, Billing info)
- **Superadmin**: `/reatchall/superadmin/*` (Companies, Subscriptions, System-wide Analytics)

*(Note: Legacy `/api/*` endpoints exist for backward compatibility but route to the same core logic).*

---

## 🚀 Deployment Architecture

The application is structured to be deployed natively on cloud platforms:

- **Backend:** Designed for deployment on **Render** (as a Web Service with MongoDB Atlas).
- **Frontends:** Designed for deployment on **Vercel** as 4 independent applications.
- **Environment Parity**: The backend maps multiple Vercel URLs via the `ALLOWED_ORIGINS` environment variable to support safe CORS handling across the network. 

For full environment deployment variables and setups, refer to the `DEPLOYMENT_GUIDE.md` located in the root of the project.

---

> [!WARNING] 
> **File Upload Handling**
> Currently, files (like profile photos/evidence) are handled with `Multer` and stored locally in the backend's `/uploads` folder. For ephemeral server setups (like Render free-tier), these files may be lost upon instance restart. Consider migrating this to an S3 or Cloudinary storage bucket in production.
