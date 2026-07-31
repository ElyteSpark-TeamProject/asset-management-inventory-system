# Folder Structure

The repository is divided into distinct, isolated domains. This modular structure is intentionally designed for a team of 7 to work in parallel while minimizing Git merge conflicts.

```text
/
├── backend/                  # Server-side Express application
│   ├── server.ts             # Express application entry point & middleware setup
│   ├── controllers/          # Business logic & request handlers
│   │   ├── assetController.ts
│   │   ├── assignmentController.ts
│   │   ├── authController.ts
│   │   ├── employeeController.ts
│   │   └── reportController.ts
│   ├── models/               # Mongoose database schemas & models
│   │   ├── Asset.ts
│   │   ├── Assignment.ts
│   │   └── User.ts
│   └── routes/               # Express route definitions (API endpoints)
│       ├── api.ts            # Main API router aggregating all endpoints
│       ├── assets.ts
│       ├── assignments.ts
│       ├── auth.ts
│       ├── employees.ts
│       └── reports.ts
│
├── database/                 # Database configuration & raw schemas
│   ├── db.ts                 # Mongoose connection logic
│   └── schema.sql            # Raw SQL schemas (if applicable/reference)
│
├── docs/                     # Project documentation & AI context
│   ├── API-Contracts.md      # Expected request/response formats
│   ├── Database-Schema.md    # Data models documentation
│   ├── Dependencies.md       # Tech stack list
│   ├── Folder-Structure.md   # (This file)
│   ├── Module-Assignments.md # Team member task division
│   ├── Project-Overview.md   # Client details and requirements
│   └── Workflow.md           # Git and AI usage rules
│
├── frontend/                 # Client-side React Application
│   ├── index.html            # Main HTML template
│   └── src/
│       ├── App.tsx           # React Router setup & main component
│       ├── main.tsx          # React DOM mounting & React 19 setup
│       ├── index.css         # Tailwind CSS global imports
│       ├── utils.ts          # Shared utility functions (e.g., Tailwind merge)
│       ├── components/       # Reusable UI components
│       │   └── Layout.tsx    # App shell, sidebar navigation, topbar
│       └── pages/            # Page-level route components (Module specific)
│           ├── Assets.tsx
│           ├── Assignments.tsx
│           ├── Dashboard.tsx
│           ├── Employees.tsx
│           ├── Login.tsx
│           └── Reports.tsx
│
├── .env.example              # Template for environment variables (No secrets!)
├── .gitignore                # Ignored files (node_modules, dist, etc.)
├── package.json              # Shared dependencies and run scripts (npm run dev/build)
├── tsconfig.json             # TypeScript configuration for the whole monorepo
└── vite.config.ts            # Vite configuration (builds both frontend and backend)
```

## Architecture Rules

1. **Strict Separation of Concerns:**
   - **Frontend** code (`React`, `Tailwind`) MUST stay inside `frontend/`.
   - **Backend** code (`Express`, `Mongoose`) MUST stay inside `backend/`.
   - **Database** config MUST stay inside `database/`.

2. **Module Isolation (Preventing Conflicts):**
   - Each team member is responsible for specific files within `backend/controllers`, `backend/routes`, and `frontend/src/pages`. 
   - **Do NOT** edit another team member's controller or page without notifying them.
   - Shared files like `frontend/src/App.tsx`, `backend/server.ts`, and `backend/routes/api.ts` should be edited carefully, ideally via Pull Requests.

3. **Aliases:**
   - The project uses path aliases. Imports like `@/...` resolve to the `frontend/src` directory for the frontend code, ensuring cleaner imports.
