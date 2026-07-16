# IBM Asset Management & Inventory Tracking System - Boilerplate

This boilerplate is designed for a team of 7 working entirely online with a strict 15-day deadline. It is structured to **prevent merge conflicts**, **ensure independent workflows**, and **safeguard against incomplete work**.

## Safeguard Strategy (How to avoid failure)

1. **Modular Architecture (Feature-Sliced Design)**
   - The backend and frontend are divided into completely independent modules (e.g., `assets`, `employees`, `auth`).
   - If one team member fails to complete their module, the rest of the application will still function.
   - For example, if the "Reports" module is unfinished, the "Assets" module will still work perfectly.

2. **Mock Data First**
   - Each module owner must start by returning Mock Data (JSON) from their backend controller or frontend component.
   - Only switch to the real MongoDB database once the schema and API are fully tested. This prevents the frontend team from being blocked by the backend team.

3. **Strict Folder Ownership**
   - Each member "owns" specific files and routes. **Do not edit another member's files** without communicating.
   - Shared files (like `server.ts` or `App.tsx`) should only be edited via careful Pull Requests.

## Team Work Breakdown (Group of 7)

*If a member drops out, their module can be stubbed with mock data to still present a "complete" project.*

### 👨‍💻 Member 1: Authentication & Users (Foundation)
- **Backend:** `backend/models/User.ts`, `backend/routes/auth.ts`, JWT login, Role-based middleware (Admin vs Employee).
- **Frontend:** `Login.tsx` page, `AuthContext.tsx` to protect routes.
- *Safeguard:* If delayed, hardcode a fake login that just returns `isAdmin: true` so the rest of the team isn't blocked.

### 👨‍💻 Member 2: Asset Core (CRUD)
- **Backend:** `backend/models/Asset.ts`, `backend/routes/assets.ts` (Create, Read, Update, Delete assets like laptops, monitors).
- **Frontend:** `Assets.tsx` list view, "Add Asset" modal.
- *Safeguard:* Start by storing assets in a simple array in memory before connecting to MongoDB.

### 👨‍💻 Member 3: Asset Assignment & Return
- **Backend:** `backend/models/Assignment.ts` (Linking Users to Assets). Checkout and Return logic.
- **Frontend:** `Assignments.tsx` view, assigning an asset to an employee.
- *Safeguard:* Depends on Member 1 & 2. If they are delayed, use hardcoded User IDs and Asset IDs to build this module anyway.

### 👨‍💻 Member 4: Employee Management
- **Backend:** `backend/routes/employees.ts` (Managing non-admin users in the company).
- **Frontend:** `Employees.tsx` list view, viewing an employee's currently assigned assets.
- *Safeguard:* Can easily be mocked with JSON data.

### 👨‍💻 Member 5: Dashboard & Analytics
- **Backend:** Create a `/api/stats` endpoint aggregating data (total assets, assigned, available).
- **Frontend:** `Dashboard.tsx` using `recharts` to build visual charts.
- *Safeguard:* Use static numbers in the charts until the backend APIs are ready.

### 👨‍💻 Member 6: Search, Filter & Inventory Tracking
- **Backend:** Add robust query parameters to the Asset routes (e.g., `/api/assets?status=available&category=laptop`).
- **Frontend:** Add search bars and category dropdown filters to the `Assets.tsx` page.
- *Safeguard:* Can implement filtering purely on the client-side (React state) if the backend filter APIs take too long.

### 👨‍💻 Member 7: DevOps, UI/UX & Integration (The Integrator)
- **Role:** Ensures the app looks cohesive. Handles Tailwind styling, responsive UI, database connection (`database/db.ts`), and final testing.
- **Safeguard:** This person helps anyone who is falling behind to ensure the 15-day deadline is met.

## How to Run Locally

Follow these steps to set up and run the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env` (or create a new `.env` file).
   - Set your MongoDB URI in the `.env` file. If you don't have one, the app will still run in mock mode.
   ```env
   MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/asset_db"
   ```

4. **Start the Development Server:**
   This will start both the frontend (Vite) and backend (Express) concurrently.
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   The application should now be running at: [http://localhost:3000](http://localhost:3000)

### Production Build

To build the app for production and run it:

```bash
# Compile frontend and backend
npm run build

# Start the production server
npm run start
```
