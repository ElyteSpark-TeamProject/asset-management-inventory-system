# AI Development Workflow

When prompting AI assistants (like GitHub Copilot, ChatGPT, Claude, or Google AI Studio) during this project, follow these guidelines to prevent breaking the repo and ensure smooth collaboration.

## 1. Context Injection (The "Rule of Context")
AI models write better code when they understand the whole system. Before asking for a feature:
- Provide the database schema for your module (from `Database-Schema.md`).
- Provide the API contract for your endpoints (from `API-Contracts.md`).
- Give the AI a brief overview of how your module connects with others.
- *Tip:* Copy and paste the relevant sections of the `docs/` files directly into your AI prompt.

## 2. Mock Data First (The "Unblocker Rule")
To prevent blocking the frontend team while the backend database is being configured, always start with mock data.
- **Frontend:** Ask the AI to build the React UI using a static JSON array. 
- **Backend:** Ask the AI to build the Express routes and return static JSON instead of querying Mongoose.
- *Prompt Example:* "Create the GET `/api/assets` endpoint returning a mock array of 3 assets. Do not connect to MongoDB yet."
- Only after both sides are working with mock data should you wire up the real MongoDB connection.

## 3. Scope Restriction (The "Blast Radius Rule")
AI models can sometimes "over-help" by editing files outside your domain. Prevent this by being explicit.
- Always tell the AI exactly which files it is allowed to touch.
- *Prompt Example:* "I am Member 2 (Asset CRUD). You are ONLY allowed to modify `backend/controllers/assetController.ts` and `frontend/src/pages/Assets.tsx`. Do NOT modify `server.ts` or `App.tsx`."

## 4. Iterative Prompting (The "Step-by-Step Rule")
Do not ask the AI to build your entire module in one prompt. Break it down:
1. "Create the Mongoose schema for Assets." (Verify and commit)
2. "Create the GET and POST Express routes for Assets." (Verify and commit)
3. "Create the React UI table to display these assets." (Verify and commit)

## 5. Git & Collaboration Strategy
Since this is a team of 7 working completely online:
- **Branch Naming:** Create a branch for your module (e.g., `feature/auth`, `feature/assets`).
- **Isolation:** Only modify files assigned to your module. If you MUST change a shared file (like `App.tsx` or `api.ts`), announce it in your team chat.
- **PR 1 (Mock Phase):** Create a Pull Request (PR) when your mock data implementation is working visually and functionally.
- **PR 2 (Integration Phase):** Create a second PR when you have successfully connected your module to MongoDB and removed the mock data.
- **Review:** Use AI to review your peers' code! You can paste their PR into an AI and ask: "Does this Express controller handle errors gracefully? Are there any security issues?"
