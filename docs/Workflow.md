# AI Development Workflow

When prompting AI assistants (like GitHub Copilot, ChatGPT, Claude, or Google AI Studio) during this project, follow these guidelines to prevent breaking the repo:

## 1. Context Injection
Always point the AI to this `docs/` folder or copy-paste the relevant `.md` file to give the AI context about the schema, architecture, or its specific module before asking for code.

## 2. Mock Data First
To prevent blocking other team members, prompt the AI to build your feature using **Mock Data** first. 
*Prompt Example:* "Create the GET /api/assets endpoint returning a mock array of 3 assets. Do not connect to MongoDB yet."

## 3. Scope Restriction
Tell the AI exactly which files it is allowed to edit based on your module assignment.
*Prompt Example:* "I am Member 2. You are only allowed to modify `backend/controllers/assetController.ts` and `frontend/src/pages/Assets.tsx`."

## 4. Git Strategy
- Create a branch for your module (e.g., `feature/auth`, `feature/assets`).
- Only modify files assigned to your module.
- Create a Pull Request (PR) when your mock data implementation is working.
- Create a second PR when you have successfully connected your module to MongoDB.
