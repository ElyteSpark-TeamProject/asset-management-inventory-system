# System Architecture

## Stack (MERN)
- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router DOM
- **Backend:** Node.js, Express 5, TypeScript
- **Database:** MongoDB (via Mongoose)

## High-Level Architecture
- **Client-Server Model:** The React frontend acts as a Single Page Application (SPA), communicating with the Express backend via REST APIs.
- **Authentication:** Stateless authentication using JSON Web Tokens (JWT).
- **Deployment:** The application is built using `vite build` and `esbuild` for the backend, serving static assets through Express in production.
