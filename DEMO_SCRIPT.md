# OCWMS Presentation & Defence Demo Script

## Pre-Demo Checklist

Before starting, ensure:
- [ ] Server is running at `http://localhost:3000`
- [ ] Browser is open to the landing page
- [ ] Browser is in full-screen mode (F11)
- [ ] Screen is mirrored/projected for supervisor to see
- [ ] Have 2 browser tabs ready (one for student, one for admin/staff)

---

## Step-by-Step Demo Walkthrough

### STEP 1: Landing Page Overview
**Say:** "This is the landing page of the Online Campus Waste Management System for UNICROSS."

**Show:**
- UNICROSS branding and logo at the top
- Navigation bar with links (Features, How It Works, Gallery, Testimonials, Contact)
- Hero image carousel — let it rotate through 2-3 slides
- Trust badges: "GPS Tracking", "AI Classification", "24/7 Monitoring"
- Scroll down to show the four feature cards:
  - Garbage Collection Fleet
  - Smart Waste Bins
  - Recycling Stations
  - Trained Personnel
- "How It Works" section — 4 numbered steps
- Animated statistics counters (28,450+ Tons, 12,600+ Routes, etc.)

**Click:** "Features" in the nav bar to smooth-scroll to the features section.

---

### STEP 2: Quick Access Section
**Say:** "The system provides three user roles — Student, Staff, and Administrator. For demonstration, we have quick access buttons for instant login."

**Show:**
- Scroll to the Quick Access section
- Point out the three role cards: Student Resident, Sanitation Field Staff, System Administrator
- Mention the pre-configured demo emails

---

### STEP 3: Registration Flow
**Say:** "Let me first show how a new student registers."

**Click:** "Get Started" button in the top navigation bar.

**Show:**
- The Registration form with all fields:
  - Full Legal Name
  - Matric Number
  - Phone Number
  - Email Address
  - Faculty (dropdown — show the 6 options)
  - Department
  - Hostel Allocation
  - Password / Confirm Password
- Point out the form validation (try submitting empty — it should show errors)

**Fill in sample data:**
- Name: "Chinedu Peter"
- Matric: "U/2022/BIO/0198"
- Phone: "08098765432"
- Email: "chinedu.peter@student.unicross.edu.ng"
- Faculty: "Biological Sciences"
- Department: "Microbiology"
- Hostel: "Hostel C"
- Password: any password

**Click:** "Create My Ecosystem Profile"

**Show:**
- Successful registration → redirected to Student Dashboard
- Welcome notification appears in the notifications panel

---

### STEP 4: Student Dashboard
**Say:** "This is the Student Dashboard. It shows an overview of the student's waste reporting activity."

**Show:**
- Welcome banner with the student's name and "UNICROSS Campus Environmental Guardian" label
- Four KPI cards:
  - Total Submissions (count)
  - Awaiting Staff (count)
  - Active Cleanup (count)
  - Resolved Issues (count)
- Weekly Submissions bar chart (Mon–Sun)
- Waste Categories pie chart (donut chart)
- Recent Submissions table:
  - Filing ID
  - Incident Details (thumbnail + category)
  - Faculty Landmark
  - Urgency (colour-coded badge)
  - Status (colour dot)
  - "Inspect Timeline" action button

---

### STEP 5: Report Waste (AI Classification Demo)
**Say:** "Now let me demonstrate the waste reporting process with AI-powered classification."

**Click:** "Report Waste" in the sidebar.

**Show:**
- Photo upload zone (drag/click-to-upload)
- Four preset sandbox photos for quick demo
- Interactive mini-map on the right with clickable landmarks

**Click:** One of the preset photos (e.g., plastic bottles).

**Click:** "Analyse" (AI Classification button).

**Show:**
- Loading spinner while AI processes
- Results appear:
  - Category: "Plastic"
  - Confidence: 92%
  - Handling Tip: "Clean residue. Place in Green Bin labeled PLASTICS."
  - Recycle Potential: "High"
  - Green Tip: "Plastic bottles take 450 years to decompose!"

**Fill in the form:**
- Waste Category: "Plastic" (auto-filled by AI)
- Incident Urgency: Click "High"
- Campus Faculty/Area: "Engineering"
- Building Name: "Block A"
- Description: "Large pile of plastic bottles near the entrance"

**Click:** "Dispatch Incident Report to Collectors"

**Show:**
- Success message
- Redirected to Dashboard
- New report appears in the Recent Submissions table with status "Pending"

---

### STEP 6: Notifications Panel
**Say:** "The system automatically generates notifications for every action."

**Click:** "Notifications" in the sidebar.

**Show:**
- Notification list with:
  - "[Plastic] Incident Reported" — info type (blue dot)
  - "Welcome to UNICROSS OCWMS!" — success type (green dot)
- Timestamps on each notification
- "Mark All as Read" button
- Unread badges

---

### STEP 7: Settings Page
**Say:** "Students can manage their profile and preferences."

**Click:** "Settings" (Configuration) in the sidebar.

**Show:**
- Profile Settings section:
  - Avatar preview
  - Name, Email, Phone, Hostel fields
  - Save button
- Notification Preferences:
  - Email alerts toggle
  - SMS dispatches toggle
  - Critical banners toggle
- Security Credentials:
  - Current password, New password, Confirm password
  - Update button
- Green Code of Conduct guidelines card

---

### STEP 8: Login as Staff
**Say:** "Now let me switch to the Staff view to show the sanitation field staff experience."

**Click:** Profile Swapper at the bottom of the sidebar (or logout and use Quick Access).

**Click:** "STAFF" Quick Access button on the login page.

**Show:**
- Staff email auto-filled: `emeka.obi@unicross.edu.ng`
- Click "Enter Operational Panel"

---

### STEP 9: Staff Dashboard
**Say:** "This is the Staff Dashboard. It shows tasks assigned to this sanitation staff member."

**Show:**
- "SANITATION FORCE DISPATCH" banner with staff name
- Four KPI cards:
  - Assigned Tasks (count)
  - Completed Resolutions (count)
  - Average Completion Time (2.4 Hrs)
  - Operational Tier (Class A)
- Task table with columns:
  - Task ID
  - Incident Assets (thumbnail + category)
  - Landmark Coordinates
  - Priority badge (colour-coded)
  - Duty Status (animated dot)
  - Action buttons

**Show the report we just created** (if assigned to this staff member).

---

### STEP 10: Accept and Resolve Task
**Say:** "The staff member can accept a task, perform the cleanup, and resolve it with photo evidence."

**Click:** "Accept Task" on the pending report.

**Show:**
- Status changes from "Assigned" to "In Progress"
- Duty Status dot animates

**Click:** "Resolve Task" on the same report.

**Show:**
- Photo selection dialog appears
- Select a completion photo (preset or upload)

**Click:** "Dispatch Cleanup Completion Report"

**Show:**
- Status changes to "Completed"
- "TASK RESOLVED" badge appears
- Report removed from active task list

---

### STEP 11: Login as Admin
**Say:** "Finally, let me show the Administrator view with full system control."

**Click:** Profile Swapper → "ADMIN" Quick Access.

**Click:** "ADMIN" button or login with `florence.effiong@unicross.edu.ng`.

---

### STEP 12: Admin Dashboard — Analytics
**Say:** "The Admin Dashboard provides comprehensive analytics and system management."

**Show:**
- Five KPI cards:
  - Total Users (count)
  - Field Crew (count)
  - Total Reports (count)
  - Resolutions (count)
  - Active Trucks (count)

**Show the Sanitation Analytics tab:**
- Area chart (monthly submission trends)
- Pie chart (report status distribution)
- Bar chart (waste categories breakdown)
- Faculty landmark rankings
- Recent report cards

---

### STEP 13: Admin — User Management
**Say:** "Administrators can manage all user accounts."

**Click:** "User Directory" tab.

**Show:**
- Search bar with real-time filtering
- Role filter dropdown (All/Student/Staff/Admin)
- User table with columns:
  - Avatar + Name
  - Email
  - Role (editable dropdown)
  - Status (toggle: Active/Suspended)
  - Actions (delete button)

**Demonstrate:**
- Search for a user by name
- Change a user's role (e.g., Student → Staff)
- Suspend a user (toggle status)
- Point out the delete button (don't actually delete)

---

### STEP 14: Admin — Assign Staff to Report
**Say:** "The administrator can assign sanitation staff to pending reports."

**Click:** On a "Pending" report in the analytics view.

**Show:**
- Report details modal/panel
- Staff assignment dropdown (list of available staff)
- Select a staff member
- Click "Dispatch Selected Officer"

**Show:**
- Report status changes to "Assigned"
- Notification generated for the assigned staff
- Activity log entry created

---

### STEP 15: Live Fleet Map
**Say:** "The system includes an interactive campus map for tracking waste bins and collection vehicles."

**Click:** "Live Fleet Map" in the sidebar.

**Show:**
- MapLibre GL map with OpenStreetMap tiles
- Centered on UNICROSS campus
- Default view: Waste Bins

**Click on a bin marker:**
- Popup shows: bin name, category, fill level bar (green/amber/red), status

**Click:** "Collection Vehicles" toggle.

**Show:**
- 3 truck markers appear
- Click a truck → popup shows: truck name, driver name, operational status

**Point out:**
- Dynamic legend showing colour mappings
- Fill level indicators on bins

---

### STEP 16: System Audit Logs
**Say:** "Every action in the system is logged for accountability and auditing."

**Click:** "System Audit Logs" tab in the Admin Dashboard.

**Show:**
- Chronological list of all system activities
- Each entry shows:
  - Colour-coded action dot
  - Action type (New Report Filed, Status: Assigned, etc.)
  - User who performed the action
  - Role
  - Timestamp
  - Detailed description

**Point out the entries from our demo:**
- "New Report Filed" by Chinedu Peter
- "Status: Assigned" by Admin
- "Status: In Progress" by Staff
- "Status: Completed" by Staff

---

### STEP 17: History and Archives
**Say:** "All reports can be searched, filtered, and exported."

**Click:** "History & Archives" in the sidebar.

**Show:**
- Export buttons (PDF and Excel)
- Filter bar:
  - Search input
  - Category dropdown
  - Status dropdown
- Results table with all reports

**Demonstrate:**
- Filter by category (e.g., "Plastic")
- Filter by status (e.g., "Completed")
- Show the "View Timeline" action button

---

### STEP 18: Close and Summary
**Say:** "To summarise, the OCWMS provides:

1. **For Students:** Easy waste reporting with AI classification, real-time status tracking, and campus mapping
2. **For Staff:** Task management with accept/resolve workflow and photo evidence
3. **For Administrators:** Full analytics, user management, staff assignment, and system audit trail
4. **For the University:** Centralised waste management with accountability, data-driven decisions, and environmental sustainability

The system is built with React, Node.js, Express.js, and MapLibre GL, using a three-tier architecture with RESTful API endpoints. It can be deployed on any cloud platform or run locally."

---

## Key Talking Points for Defence

### Architecture
- Three-tier: Presentation (React SPA) → Application (Node.js/Express) → Data (JSON file)
- 22 RESTful API endpoints across 6 route modules
- Role-based access control with 3 distinct user roles

### Technology Choices
- React + TypeScript for type safety and component reusability
- Node.js + Express for JavaScript across all tiers
- MapLibre GL for free OpenStreetMap tiles (no API key)
- Google Gemini API for AI waste classification (with heuristic fallback)
- JSON file database for simplicity (easily replaceable with PostgreSQL/MongoDB)

### Key Features
- AI-powered waste image classification
- Real-time report lifecycle management (Pending → Assigned → In Progress → Completed)
- Interactive campus mapping with bin fill levels and vehicle tracking
- Automated notifications and activity logging
- Role-based dashboards with distinct visual themes
- Photo evidence for completed cleanups

### Scalability
- Backend is stateless — can be horizontally scaled
- JSON database can be replaced with PostgreSQL/MongoDB
- Docker support for containerised deployment
- RESTful API allows mobile app integration

---

## Backup Plans

If the live demo fails:
1. **Server won't start:** Use screenshots in a prepared slide deck
2. **AI classification fails:** The heuristic fallback still works (keyword matching)
3. **Map doesn't load:** Show screenshots; explain MapLibre GL + OpenStreetMap
4. **Browser crashes:** Have a backup browser ready
5. **Internet is slow:** Run everything on localhost (no external dependencies needed except AI)
