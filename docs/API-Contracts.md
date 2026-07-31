# API Contracts

Base URL: `/api`

## Auth (`/api/auth`)
- `POST /login` - Returns JWT and user object.
- `POST /register` - Registers a new user.

## Assets (`/api/assets`)
- `GET /` - List all assets (supports query params for filtering).
- `POST /` - Create a new asset.
- `PUT /:id` - Update an asset.
- `DELETE /:id` - Delete an asset.

## Assignments (`/api/assignments`)
- `GET /` - List assignments.
- `POST /assign` - Assign an asset to a user.
- `POST /return/:id` - Return an asset.

## Employees (`/api/employees`)
- `GET /` - List all employees.
- `GET /:id` - Get employee details and assigned assets.

## Reports (`/api/reports`)
- `GET /stats` - Get aggregate stats for the dashboard.
- `GET /export` - Export report data (CSV/PDF).
