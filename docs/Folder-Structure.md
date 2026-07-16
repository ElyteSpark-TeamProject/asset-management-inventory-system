# Folder Structure

The repository is divided into distinct domains to avoid merge conflicts and allow parallel development.

```text
/
├── backend/          # Express server, controllers, routes, models
├── database/         # Database connection and schema SQL files
├── docs/             # AI context and project documentation (this folder)
├── frontend/         # React SPA (components, pages, styles)
├── package.json      # Shared dependencies and build scripts
└── vite.config.ts    # Build configuration for both frontend and backend
```

## Rules
- **Do not mix domains:** Frontend code stays in `frontend/`, backend code in `backend/`.
- **Module Isolation:** Inside `frontend/src/pages` and `backend/controllers`, stick to your assigned module files to prevent conflicts.
