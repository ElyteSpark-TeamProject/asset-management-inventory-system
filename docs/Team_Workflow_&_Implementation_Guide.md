# 15-Day Team Workflow: IBM Asset Management & Inventory Tracking System

**Project:** Full-Stack Asset Management Web Application  
**Tech Stack:** React (Frontend), Node.js/Express (Backend), MongoDB (Database)  
**Team Size:** 7 Members  
**Deadline:** 15 Days (Accelerated Timeline)  

---

## 📅 Phase 1: Planning & Setup (Days 1-2)
*Focus: Architecture, repository setup, and assigning responsibilities.*

* **Day 1: Kickoff & Schema Design**
  * Finalize the MongoDB database schema (Users, Assets, Assignments).
  * Define API contracts (endpoints, request/response formats) for all modules.
  * **Integrator (Member 7):** Initialize the Git repository, setup the monorepo folder structure (`frontend/`, `backend/`), and configure Tailwind CSS & Vite.
* **Day 2: Module Assignment & Mock Data**
  * Assign the 7 modules to team members (Auth, Assets, Assignments, Employees, Dashboard, Search/Filters, Integrator).
  * Everyone creates their feature branches (e.g., `feature/auth`, `feature/assets`).
  * Define static JSON mock data for frontend development to prevent blocking.

## 📅 Phase 2: UI & API Scaffolding (Days 3-6)
*Focus: Building the UI with mock data and setting up basic backend routes.*

* **Days 3-4: Frontend Layouts & Backend Scaffolding**
  * **Frontend:** Build the static React components (Tables, Modals, Forms, Sidebar) using Tailwind CSS. Populate them with the agreed-upon mock data.
  * **Backend:** Setup Express router files for each module. Return static JSON responses matching the mock data.
* **Days 5-6: Frontend Routing & State**
  * Connect React Router to navigate between Dashboard, Assets, Employees, and Login pages.
  * Setup React context or local state for managing forms.

## 📅 Phase 3: Database Integration & Core Logic (Days 7-10)
*Focus: Connecting the frontend to the real backend and database.*

* **Day 7: Database Connection & Auth**
  * Connect Express to MongoDB via Mongoose.
  * **Member 1:** Complete JWT Authentication (Login/Register) and Role-based middleware (Admin vs Employee).
* **Days 8-9: CRUD Operations & API Hookup**
  * **Backend:** Replace mock JSON responses with real Mongoose queries (`.find()`, `.save()`, `.populate()`).
  * **Frontend:** Swap out mock data arrays with Axios/Fetch calls to the backend APIs.
* **Day 10: The Assignment Engine**
  * **Member 3:** Finalize the core logic: Assigning an asset to an employee, handling return dates, and updating asset statuses (e.g., "Available" to "Assigned").

## 📅 Phase 4: Advanced Features (Days 11-12)
*Focus: Analytics, Search, and Reporting.*

* **Day 11: Dashboard & Analytics**
  * **Member 5:** Use `recharts` to build visual charts (e.g., Assets by Category, Status distribution) fetching aggregated data from the backend.
  * **Member 6:** Implement global search and category filters on the Assets and Employees pages.
* **Day 12: Report Generation**
  * Implement the ability to export asset/inventory reports (generate CSVs or handle print-friendly CSS views).

## 📅 Phase 5: Testing & UI Polish (Days 13-14)
*Focus: Bug fixing, responsiveness, and merging.*

* **Day 13: Integration & Merge**
  * **Member 7 (Integrator):** Lead the merging of all feature branches into the `main` branch. Resolve any Git conflicts.
  * Ensure the app works seamlessly from Login -> Dashboard -> Assigning an Asset -> Logging out.
* **Day 14: QA & Responsive Design**
  * Test the application on mobile/tablet screen sizes.
  * Handle edge cases (e.g., trying to assign an asset that is already checked out, invalid logins).

## 📅 Phase 6: Final Deliverables (Day 15)
*Focus: Packaging the project for client submission.*

* **Day 15: Documentation & Submission Prep**
  * Finalize the `README.md` with "How to run locally" instructions.
  * Export the Database scripts/seed data (e.g., a `.json` or `.js` file to populate the initial admin user and sample assets).
  * Take clear, high-quality screenshots of every page (Login, Dashboard, Assets, Reports) for the `Screenshots/` folder.
  * Ensure the API Documentation is up to date.
  * Zip the source code (excluding `node_modules`) or verify the GitHub repository is public/shared with the client.

---

### 🚨 Daily Workflow Rules for the Team:
1. **Never edit `main` directly:** Always work on your designated `feature/` branch.
2. **Mock Data First:** If the backend isn't ready, use hardcoded JSON so the frontend doesn't get blocked.
3. **Respect Boundaries:** Only edit the files assigned to your specific module to avoid severe merge conflicts.
