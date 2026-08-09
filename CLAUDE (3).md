# CLAUDE.md

This file gives Claude Code persistent context for the FoodExpress project.
Read PROJECT_CONTEXT.md first for full details — this file is the short version
you should hold yourself to on every task.

## Project Summary

FoodExpress — a food delivery website. Node.js/Express backend, React frontend,
MongoDB database. Customers browse restaurants, order food. Admins manage
restaurants, menu items, and orders.

## Tech Stack (do not deviate without asking)

- Backend: Node.js, Express, Mongoose
- Frontend: React (Vite), Tailwind CSS
- Auth: JWT + bcrypt
- No TypeScript

## Coding Conventions

- Backend: MVC-style — models/, controllers/, routes/, middleware/
- Frontend: pages/ for route-level components, components/ for reusable pieces
- Async/await everywhere — no `.then()` chains
- All API responses follow: `{ success: true/false, data, message }`
- Environment variables in `.env`, never hardcoded secrets

## 5 Rules I Will Hold You To

1. Never store plain-text passwords — always bcrypt hash before saving.
2. Every protected route uses the auth middleware — never inline JWT checks.
3. Don't add new npm packages without telling me why first.
4. Keep backend and frontend strictly separated — only talk via REST API calls.
5. When a prompt says "STOP, don't write code yet" — actually stop and wait.

## Workflow

- I will give you prompts one at a time from PROMPTS_CHEATSHEET.md.
- After each prompt, show me what you created before I move to the next one.
- If something in PROJECT_CONTEXT.md conflicts with what I ask, point it out.
