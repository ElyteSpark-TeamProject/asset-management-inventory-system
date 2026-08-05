# Integrator Tasks (Module 7)

Here is the checklist of tasks for the Project Integrator & UI Lead, divided by dependencies.

## Part 1: Phase 1 (Can be done NOW, 100% Independent)
*You can build the foundational skeleton without waiting for anyone.*

### Frontend Shell & Routing
1. [x] Set up `frontend/src/main.tsx` (React 19, React Router DOM, and Tailwind imports).
2. [x] Configure global routes in `frontend/src/App.tsx` using **placeholder components** for Login, Dashboard, Assets, Assignments, Employees, Reports.
3. [x] Build the application shell in `frontend/src/components/Layout.tsx` (Sidebar navigation, Top Header, and a responsive main content area).

### Backend Foundation
4. [x] Set up the Express server entry point in `backend/server.ts` (Setup CORS, JSON parsing middleware, and Vite middleware for development).
5. [x] Setup the main API router in `backend/routes/api.ts` (Create the base `/api` router that will later hold team routes).

### Project Configuration
6. [x] Manage shared dependencies in `package.json` (Tailwind, React Router, Express, Mongoose, etc.).
7. [x] Define the `.env.example` file so the team knows which environment variables are needed.

---

## Part 2: Phase 2 (Requires other members to finish their modules)
*These tasks happen when merging and integrating your team's code.*

### Frontend Integration
8. [ ] Update `frontend/src/App.tsx`: Replace your placeholder routes with the actual Page components built by Members 1-6.
9. [ ] UI Consistency: Review their pages and apply standard Tailwind classes to ensure everything matches the layout theme.
10. [ ] Global State: Hook up the Auth Context (from Member 1) to the Sidebar (so it shows the logged-in user's name and role).

### Backend Integration
11. [ ] Update `backend/routes/api.ts`: Import and attach the specific routers (`authRoutes`, `assetRoutes`, etc.) created by Members 1-6.
12. [ ] Database Connection: Ensure the Mongoose connection in `backend/server.ts` or `database/db.ts` integrates cleanly with their schemas.

### Final Checks
13. [ ] Resolve any Git merge conflicts in `package.json`, `App.tsx`, and `api.ts`.
14. [ ] Verify full end-to-end flow across all modules (Login -> View Assets -> Assign -> Logout).
