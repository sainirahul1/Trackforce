# TrackForce

TrackForce is a modern, role-based Field Executive Tracking Application built with React, Vite, and Tailwind CSS. It is designed to empower field operatives, managers, and system administrators with a comprehensive suite of tools for task management, live tracking, order processing, and operational analytics.

## 🚀 Features

### Role-Based Portals
- **Employee (Field Executive):** 
  - Real-time Assignment Hub (Tasks grouped by Today, Yesterday, This Week, This Month).
  - Geolocation & Distance Tracking for tasks.
  - Performance & Earnings Dashboard.
  - Interactive Orders management (Create, Edit, View).
  - Professional Digital ID & Profile portfolio.
- **Tenant/Manager:** 
  - Executive Overview with Visit Velocity and Live Activity Feeds.
  - Team Performance Monitoring (Revenue, Field Mastery, Performance goals).
- **Superadmin:** System-wide controls and analytics.

### Modern UI/UX
- **Sleek Aesthetics:** Built with a glassmorphism-inspired design system, soft gradients, and high-contrast dark mode support.
- **Responsive Layouts:** Mobile-first design that scales perfectly to desktop dashboards.
- **Interactive Elements:** Smooth animations, collapsible accordions, drag-and-drop interfaces, and contextual tooltips.
- **Dynamic Icons:** Powered by `lucide-react` for a consistent and professional visual language.

## 🛠️ Technology Stack

- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS (Modern aesthetics, utility-first)
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Charts:** Chart.js & react-chartjs-2
- **State Management:** React Context API & Local State 

## 📁 Project Structure

```
track-force/
├── src/
│   ├── components/      # Reusable UI elements (Navbar, Sidebar, Cards)
│   ├── layouts/         # Role-specific layout wrappers
│   ├── pages/           # Application views organized by role
│   │   ├── auth/        # Login/Signup/Reset
│   │   ├── employee/    # Dashboard, Tasks, Orders, Profile
│   │   ├── tenant/      # Tenant-specific dashboards
│   │   ├── manager/     # Management tools
│   │   └── superadmin/  # Platform administration
│   ├── router/          # Application routing configuration
│   ├── context/         # React Context providers (Notifications, Theme, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and external service integrations
│   └── utils/           # Helper functions and constants
├── public/              # Static assets
└── package.json         # Project dependencies and scripts
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd track-force
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🎨 Design System

TrackForce utilizes a deeply customized Tailwind configuration to achieve its premium look. Key elements include:
- **Colors:** Deep indigos, emerald success states, and rich slate dark modes.
- **Radii:** Extreme border radii (`rounded-[3rem]`, `rounded-[2rem]`) for friendly, modern card interfaces.
- **Shadows:** Layered, tinted shadows (`shadow-indigo-500/10`) to create depth and hierarchy.
- **Backdrops:** Heavy use of `backdrop-blur` for contextual overlays and sticky headers.

## 🤝 Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change. Ensure your code adheres to the existing styling conventions and passes all linting rules.

## 📄 License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited.
