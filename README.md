# TrackForce - Comprehensive Management Platform

TrackForce is a full-stack, role-based management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

The project is organized into two primary directories:

- [**`frontend/`**](./frontend): Vite-powered React application with Tailwind CSS and Lucide icons.
- [**`backend/`**](./backend): Node.js/Express server with Mongoose for MongoDB data modeling.

## Prerequisites

- **Node.js**: v16+ recommended
- **MongoDB**: A running local instance of MongoDB (listening on `localhost:27017`)
- **MongoDB Compass**: (Optional) For visual data exploration

## Getting Started

### 1. Database Setup
Ensure your MongoDB service is running:
```bash
brew services start mongodb-community@7.0
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*The server will run on `http://localhost:5001`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The application will run on `http://localhost:5173`.*

---

## Authentication & Roles

The system uses JWT (JSON Web Tokens) for secure, role-based access.

### Default Seeded Accounts
You can seed the initial database with these test accounts by running `npm run seed` in the `backend` folder.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@trackforce.com` | `admin123` |
| **Tenant Admin** | `tenant@company.com` | `tenant123` |
| **Team Manager** | `manager@company.com` | `manager123` |
| **Field Executive** | `employee@company.com` | `employee123` |

---

## Technical Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Security**: JWT, BcryptJS
