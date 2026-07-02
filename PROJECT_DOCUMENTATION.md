# UNICROSS Online Campus Waste Management System (OCWMS)

## Project Documentation & User Manual

---

## 1. Project Overview

**OCWMS** is a full-stack web application built for the **University of Cross River State (UNICROSS)** to digitize and streamline campus waste management operations. It connects three key user groups — students, sanitation staff, and system administrators — into one real-time platform.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Maps | MapLibre GL JS (OpenStreetMap tiles) |
| Icons | Lucide React |
| Backend | Node.js + Express (TypeScript) |
| AI Classification | Google Gemini API (with heuristic fallback) |
| Storage | LocalStorage (client-side persistence) |

### Key Features

- **Role‑based dashboards** — each user type sees relevant tools and data
- **Waste reporting** — students submit reports with photo, location, category, and urgency
- **AI waste classification** — camera capture or image upload automatically categorizes waste
- **Live fleet map** — track bin fill‑levels and collection vehicles on an interactive campus map
- **Analytics** — charts, KPIs, and exportable reports for administrators
- **Real‑time notifications** — status updates, dispatch alerts, and activity logs

---

## 2. Architecture

### Frontend (React SPA)

The single‑page application has three top‑level views controlled by `viewState` in `App.tsx`:

```
┌─ Landing ──────────────┐
│  Public marketing page │
│  Hero carousel         │
│  Features / How It Works│
│  Dashboard preview     │
│  Testimonials          │
│  Demo Quick-Access     │
│  Contact / Footer      │
└────────────────────────┘
         │ login/register
         ▼
┌─ Auth ─────────────────┐
│  Login / Register forms│
│  Role selection (login)│
└────────────────────────┘
         │ authenticated
         ▼
┌─ Portal ───────────────┐
│  Sidebar navigation    │
│  ┌─ Student Dashboard  │
│  ├─ Staff Dashboard    │
│  ├─ Admin Dashboard    │
│  ├─ Report Waste       │
│  ├─ History & Archives │
│  ├─ Live Fleet Map     │
│  ├─ Notifications      │
│  ├─ User Directory     │
│  └─ Settings           │
└────────────────────────┘
```

### Backend (Express API)

A single `server.ts` file runs both the API server and serves the frontend:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/classify` | POST | AI waste classification (image + description) |
| `/api/health` | GET | Health check / status |
| `/*` | GET | Serves the React SPA (prod) / Vite dev server (dev) |

### Data Flow

All data is stored in the browser's `localStorage` under these keys:

| Key | Content |
|-----|---------|
| `unicross_ocwms_users` | All registered users |
| `unicross_ocwms_reports` | All waste reports |
| `unicross_ocwms_notifications` | System notifications |
| `unicross_ocwms_logs` | Activity audit logs |
| `unicross_ocwms_active_user` | Currently logged-in user |

Data is loaded from `localStorage` on page load and synced back on every mutation. This means **all data persists across browser sessions** without a real database.

---

## 3. Landing Page Walkthrough

### 3.1 Hero Carousel

The first thing visitors see is a full‑screen image carousel with 6 waste‑management themed slides. It features:

- **Fade transitions** between slides (1s duration)
- **Auto‑advance** every 3 seconds
- **Left/right arrow buttons** for manual navigation
- **Pagination dots** at the bottom
- **Dark gradient overlays** for text readability
- **Call‑to‑action buttons**: "Report Waste" and "Learn More"
- **Trust indicators**: GPS Tracking, AI Classification, 24/7 Monitoring

### 3.2 Navbar

A fixed top navigation bar contains:

- **UNICROSS shield logo** (SVG component)
- **UNICROSS + "Campus Waste Management System"** branding
- **Navigation links**: Features, How It Works, Gallery, Testimonials, Contact
- **Sign In** and **Get Started** buttons
- **Mobile hamburger menu** with slide‑out drawer

### 3.3 Features Section

Four feature cards displayed in a responsive grid:

1. **Garbage Collection Fleet** — Modern compactor trucks and front loaders
2. **Smart Waste Bins** — IoT‑enabled bins with fill‑level sensors
3. **Recycling Stations** — Dedicated sorting stations for different materials
4. **Trained Personnel** — Professional workers with mobile dispatch

Each card has a background image, icon, title, and description.

### 3.4 How It Works Section

Four‑step workflow showing the waste management process:

1. **Report Waste** — Students submit reports with photo and location
2. **Assign Collection** — Administrators dispatch the nearest crew
3. **Waste Collection** — Operators collect using compactor trucks
4. **Track Progress** — Real‑time analytics and route tracking

### 3.5 Operations Dashboard Preview

A dark‑themed section showcasing the analytics dashboard with:

- **Dashboard screenshot** with window chrome
- **Three capability badges**: Fleet Tracking, Bin Monitoring, Waste Analytics

### 3.6 Statistics Counter Section

Four animated counters that start when scrolled into view:

- **28,450+** Tons of Waste Collected
- **12,600+** Collection Routes Completed
- **1,580+** Smart Bins Installed
- **99%** Collection Efficiency

### 3.7 Gallery Section

Six image cards in a 2×3 grid showing:

- Compactor Trucks
- Modern Facilities
- Campus Infrastructure
- Community Engagement
- Operations Center
- Analytics & Tracking

Each image reveals a title overlay on hover.

### 3.8 Testimonials Section

Three testimonial cards from fictional stakeholders:

- **Bright Okon** — Student Representative
- **Dr. Sarah Adebayo** — Environment Committee
- **Emeka Obi** — Sanitation Lead

Each card shows a 5‑star rating, quote, portrait photo, name, and role.

### 3.9 Demo Quick-Access Panel (Evaluator Sandbox)

A green‑gradient section with three role bypass cards:

- **Student Resident** — Report waste, track collections, earn green points
- **Sanitation Field Staff** — Receive dispatch alerts, navigate routes, upload photos
- **System Administrator** — Oversee fleet, assign crews, generate reports

Each card has a "Quick Access" badge and feature list. Clicking any card instantly logs in as that role without credentials — designed for project evaluators to test all modules.

### 3.10 Contact Section

A two‑column section with contact information and a demo request form:

- **Contact details**: Email, phone, location
- **Contact form**: Name, email, institution, message

### 3.11 Footer

Four‑column footer with:

- **UNICROSS branding** and description
- **Operations links**: Collection Routes, Bin Monitoring, Fleet Tracking, Recycling
- **Company links**: About Us, Careers, Blog, Press
- **Support links**: Help Center, Documentation, API Status, Contact

---

## 4. Authentication System

### 4.1 Login

Users can log in with any email and select their role from three tabs: **Student**, **Staff**, or **Admin**.

- If the email matches an existing user, they are logged in
- If the email is new, a mock profile is automatically created with the selected role
- Suspended users are blocked with a warning message

### 4.2 Registration

New students can register by filling in:

- Full Name
- Matriculation Number
- Email Address
- Phone Number
- Faculty (dropdown)
- Department
- Hostel
- Password / Confirm Password

On successful registration, the user is automatically logged in as a student and redirected to the portal. A welcome notification is created.

### 4.3 Role Bypass Swapper (Sandbox)

Inside the portal sidebar, there's a **Test Profile Swapper** widget that lets evaluators instantly switch between Student, Staff, and Admin roles without logging out. This demonstrates all three dashboards during a presentation.

---

## 5. Portal & Role‑Based Dashboards

### 5.1 Student Dashboard

Shown when a student logs in. Includes:

- **KPI cards**: Total reports, active reports, completed, pending
- **Category breakdown** (bar chart)
- **Status distribution** (pie chart)
- **Recent activity table**: ID, category, location, priority, status, actions
- **Report status indicators**: color‑coded badges (Emergency=red, High=amber, etc.)

### 5.2 Staff Dashboard

Shown when sanitation staff logs in. Includes:

- **KPI cards**: Assigned tasks, in progress, completed today, pending
- **Task table**: Reports assigned to the staff member with status and priority
- **Status update buttons**: Staff can mark reports as "In Progress" or "Completed"
- **Completion photo upload**: Staff can attach a resolution image

### 5.3 Admin Dashboard

Shown when an administrator logs in. Three internal sub‑tabs:

**Sanitation Analytics** — Charts showing:
- Report trends (area chart)
- Category breakdown (bar chart)
- Status distribution (pie chart)
- KPI cards: Total reports, active users, completion rate, pending tasks

**User Directory** — Manage all users:
- Search/filter users by name, email, or matric number
- Filter by role (all, student, staff, admin)
- View user details: ID, name, email, role, status
- **Admin actions**: Suspend/activate users, change roles, delete users
- Status badges (Active=green, Suspended=red, Pending=amber)

**Activity Log** — Audit trail of all system actions:
- User name, role, action, timestamp, and details

### 5.4 Report Waste

A comprehensive waste reporting form with:

1. **Camera/Image Upload** — Take a photo with your device camera or upload from gallery. The image is displayed as a preview.
2. **Waste Category** — Dropdown: Plastic, Glass, Organic, Paper, Metal, Electronic, Mixed Waste
3. **Incident Urgency** — Four visual buttons: Low, Medium, High, Emergency (color‑coded)
4. **Location** — Faculty dropdown + building name/text input
5. **Description** — Text area for additional details
6. **AI Classification** — A "Classify with AI" button that analyzes the uploaded image and/or description using the Gemini API (or heuristic fallback if no API key is configured)

When submitted:
- The report appears in the student's "My Submissions" and the admin's dashboard
- A system notification is created
- An activity log entry is recorded

### 5.5 History & Archives

A filterable table showing all reports:

- **Search bar** — search by ID, keywords, faculty, building
- **Category filter** — filter by waste type
- **Status filter** — filter by current status
- **Export buttons** — Mock PDF and Excel export (simulated)
- **Registry table** — ID, incident material (with thumbnail), location, urgency level, status, and "View Timeline" button

### 5.6 Live Fleet Map

An interactive map powered by **MapLibre GL JS** with OpenStreetMap tiles. Features:

- **Waste Bins toggle** — Shows 10 color‑coded bin markers across campus:
  - Plastic (green), Organic (amber), Paper (blue), Glass (purple), Electronic (red), Metal (grey), General (slate), Mixed (teal)
  - Overflowing bins have a red pulse ring
  - Click any bin to see: ID, name, waste category, fill level (with progress bar), and status
- **Collection Vehicles toggle** — Shows 3 truck markers:
  - En Route (blue), Collecting (green), Returning (amber), Idle (slate)
  - Click any truck to see: ID, name, driver name, and status
- **Bin Legend** / **Vehicle Legend** overlay
- **Navigation controls** (zoom, compass)
- **OpenStreetMap attribution**

Coordinates are set to UNICROSS campus, Calabar, Nigeria (approximately 4.9755°N, 8.351°E).

### 5.7 Notifications

A chronological feed of system notifications with:

- **Unread indicators** — green ring + "Unread Badge" tag
- **Notification types**: success (green), info (blue), warning (amber), error (red)
- **"Mark All as Read"** button
- **Empty state** — friendly message when no notifications exist

### 5.8 User Directory (Admin)

Accessible from the sidebar when logged in as admin. Shows all registered users with management controls. See section 5.3 above.

### 5.9 Settings (Configuration)

Three sections:

1. **Profile Settings** — Update name, email, phone, hostel, and **profile picture URL**
2. **Notification Preferences** — Toggle email, SMS, and in‑app notifications
3. **Security Credentials** — Change password form

### 5.10 Dashboard Layout (Sidebar)

The sidebar navigation is shared across all portal pages:

- **Top**: UNICROSS branding + "OCWMS PORTAL" label
- **Navigation links** (role‑filtered):
  - Ecosystem Dashboard (all)
  - Report Waste (student, admin)
  - My Submissions (student)
  - History & Archives (all)
  - Live Fleet Map (all)
  - Notifications (all)
  - User Directory (admin)
  - Configuration (all)
- **Bottom**: 
  - Test Profile Swapper (Student / Staff / Admin quick switch)
  - Current user profile card with avatar, name, role, and logout button

---

## 6. AI Waste Classification

### 6.1 How It Works

1. User captures or uploads an image of waste material
2. Optionally adds a text description
3. Clicks "Classify with AI"
4. The image is sent to the backend `/api/classify` endpoint
5. The backend attempts to use **Google Gemini API** for classification
6. If no API key is configured, a **heuristic fallback** analyzes the description text

### 6.2 Classification Results

The AI returns:

| Field | Description |
|-------|-------------|
| `category` | Waste type: Plastic, Glass, Organic, Paper, Metal, Electronic, Mixed Waste |
| `confidence` | Confidence score (0.0 – 1.0) |
| `handlingTip` | Practical disposal advice |
| `recyclePotential` | High, Medium, or Low |
| `greenTip` | Environmental fact or statistic |

### 6.3 Heuristic Fallback

When no Gemini API key is configured (`GEMINI_API_KEY` in `.env`), the system uses keyword matching on the description text to categorize waste. For example:

- "bottle", "plastic", "cup", "nylon" → **Plastic**
- "glass", "jar" → **Glass**
- "food", "banana", "peel", "organic" → **Organic**
- "paper", "book", "cardboard" → **Paper**
- "metal", "iron", "aluminium" → **Metal**
- "electronic", "battery", "phone" → **Electronic**

---

## 7. Component Tree

```
src/
├── App.tsx                        # Root: view routing, state management, localStorage sync
├── main.tsx                       # React DOM entry
├── index.css                      # Tailwind import
├── types/index.ts                 # TypeScript interfaces + shared constants
├── data/mockData.ts               # Initial seed data
└── components/
    ├── LandingPage.tsx             # Public marketing page (hero, features, etc.)
    ├── UnicrossLogo.tsx            # UNICROSS shield SVG component
    ├── AuthScreens.tsx             # Login & Register forms
    ├── DashboardLayout.tsx         # Portal sidebar + topbar + content wrapper
    ├── UserDashboard.tsx           # Student portal (reports, charts, activity)
    ├── StaffDashboard.tsx          # Staff portal (tasks, status updates)
    ├── AdminDashboard.tsx          # Admin portal (analytics, user mgmt, audit)
    ├── ReportForm.tsx              # Waste reporting form with AI classification
    ├── ReportDetails.tsx           # Report detail view (comments, timeline, status)
    ├── MapSection.tsx              # MapLibre GL interactive campus map
    ├── SettingsScreen.tsx          # Profile, notifications, password settings
```

---

## 8. How to Run the Project

### Development Mode

```bash
cd C:\Users\brigh\Desktop\UOWMS
npm run dev
```

Opens at **http://localhost:3000** with hot module replacement.

### Production Build

```bash
npm run build
```

Builds to the `dist/` folder. Start with:

```bash
npm start
```

### Configuration

Create `.env` in the project root:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Without this key, the AI classifier falls back to text‑based heuristic matching.

---

## 9. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **LocalStorage instead of a database** | Zero setup for evaluation/prototype. All data persists across sessions without installing MongoDB or PostgreSQL. |
| **Single `server.ts` serving both API and frontend** | Simpler deployment — one process, one port. Can be deployed to Render / Railway / Fly.io as-is. |
| **MapLibre GL JS instead of Google Maps** | Free, no API key required. Uses OpenStreetMap tiles which are also free and unrestricted. |
| **Role bypass sandbox on the landing page** | Evaluators can instantly access any dashboard without going through registration, making presentations smooth. |
| **Tailwind CSS instead of a component library** | Lighter bundle, full design control, no dependency on Material UI / Chakra etc. |
| **SVG logo instead of PNG** | Crisp at any resolution, no white background issues, no external HTTP request. |

---

## 10. Deployment

The project can be deployed to any Node.js hosting platform:

### Recommended: Render.com

1. Create a free account at https://render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository: `RealBright1989/UOWMS`
4. Configure:
   - **Build Command**: `npx vite build && npx esbuild server.ts --bundle --platform=node --outfile=dist/server.js`
   - **Start Command**: `node dist/server.js`
5. Deploy

### Alternative: Railway.app

Similar setup with free monthly credits. Connect GitHub repo, auto‑detects Node.js.

---

## 11. Testing & Evaluation Guide

### For Project Evaluators

1. **Visit the landing page** — review hero carousel, features, testimonials
2. **Click any Quick Access card** in the Demo Sandbox:
   - **Student**: Submit a waste report with image and description
   - **Staff**: View assigned tasks, update status to "In Progress" or "Completed"
   - **Admin**: View analytics charts, manage users in the directory, check activity logs
3. **Test the Live Fleet Map** — toggle between bins and vehicles, click markers
4. **Test AI Classification** — upload a waste image or type a description, click "Classify with AI"
5. **Check data persistence** — close and reopen the browser, all data is preserved

### Defending the Project

Key talking points:

- **Why React?** Component reusability, virtual DOM for performance, huge ecosystem
- **Why TypeScript?** Type safety catches bugs at compile time, better IDE support
- **Why Tailwind?** Utility‑first CSS allows rapid prototyping without context‑switching
- **Why MapLibre?** Free, open‑source, no API key required
- **Why LocalStorage?** Perfect for prototypes — no backend database needed
- **Real‑world potential**: Swap LocalStorage for MongoDB/PostgreSQL, add real IoT bin sensors, integrate GPS tracking on collection vehicles

---

*Document generated for UNICROSS OCWMS project defense.*
