# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ZMC (Zikora Medical Center) Hospital Management System. A single Node/Express process serves the REST API (`/api`), a WebSocket endpoint (`/ws`), and the React 19 + Vite + Tailwind 4 frontend from one origin (port 3000).

## Commands

- `npm run dev` — runs `tsx server.ts`: Express + PostgreSQL init + Vite middleware + WebSocket. `dev:backend` is an alias for the same thing. Never run `node server.ts`.
- `npm run lint` — this is just `tsc --noEmit` (there is no ESLint).
- `npm run build` — `vite build` plus esbuild bundling `server.ts` into `dist/server.cjs`; then `npm run start:production`.
- Tests: no npm script. Tests in `tests/` import `bun:test` (types stubbed in `tests/bun-test.d.ts`), so run them with Bun: `bun test`, or one file with `bun test tests/backend/backfill.test.ts`.
- Env: copy `.env.example` → `.env`. Needs `PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD` and `JWT_SECRET`. A separately hosted frontend (Netlify) needs build-time `VITE_API_BASE_URL` and `VITE_WS_URL`.

## Architecture

- `server.ts` is the composition root: mounts middleware, route modules under `/api/<feature>` (auth, users, patients, payments, exports, verify-identity, notifications, hr, nursing), inline audit-log endpoints, the WS server (JWT-authenticated via the first payload / `?token=`), then Vite (dev) or `dist` static files (prod). API routes must stay mounted before the frontend catch-all.
- Backend (`src/backend`):
  - Feature folders under `routes/<feature>/`: `auth`, `users` and `patients` follow `routes → controller → service → repository`, plus `validator` and `constants`. `payments` has `*.routes.ts` and a validator. `hr`, `nursing`, `notifications` and `exports` are a single `*.routes.ts`, and `verify-identity` is a single file in `routes/`. Audit-log and `/api/maintenance/*` endpoints live inline in `server.ts`.
  - `database/db.repo.ts` is a very large file holding the in-memory `Database` shape, seed data, PostgreSQL schema/init (`zmc_*` DDL created in code by `initializeDatabase`, ~2,300 lines) and the cache. Code reads via `getDB()` (in-memory cache) and `getPostgresPool()`; `refreshCache()` reloads from Postgres and also runs queue-repair UPDATEs on `zmc_patient_queue` and `zmc_patients`; a change to one store usually needs a matching change to the other. Handlers frequently write to both Postgres and the cache, and fall back to cache-only when no pool exists.
  - `catalogue/` holds the canonical lab, meds and eye catalogues and pricing (also used to seed DB and for `backfill`). The server-side catalogue is the source of truth for prices; frontend copies must not drift (see `.todo`, and `tests/catalogue/frontend-parity.test.ts`).
  - `middleware/auth.middleware.ts` provides `authenticateJWT` and `authorizeRoles([...])`; roles are display strings such as `'IT Administrator'`, `'Doctor'`, `'Cashier'`.
  - `utils/ws.util.ts` tracks WS clients for pushing real-time updates between departments.

- Frontend (`src/frontend`, alias `@` → `src/frontend`, `@backend` → `src/backend`):
  - `lib/routing/` (`routes.ts`, `navigation.ts`, `session.tsx`, `view-plan.ts`) decides which department view a user lands on from their role/department (`ViewKind`: dashboard, opd, nursing, eye, doctor, lab, pharmacy, admin, hr, cashier, ...). Adding a department means updating the view plan and routes.
  - `views/<department>/` (cashier, doctor, eye, hr, it_admin, lab, nursing, opd, pharmacy, dashboard) holds department modules, route-lazy-loaded (code-split) via `routes.ts`, which maps each tab/path to a view and the departments allowed to see it. Modules have `_components/`, `_hooks/` and `_utils/` subfolders (some also `_tabs/`, `_modals/`). `navigation.ts` has the access checks, `view-plan.ts` builds per-user views and `session.tsx` holds login state. Cross-department UI lives in `components/shared`, `forms`, `layouts`, `patient-detail`.
  - `utils/api.ts` is the API/WS client; use `apiFetch` for requests rather than raw `fetch`.
- Docs: `docs/SYSTEM_DESIGN_GUIDE.md`, `docs/activity-log.md` (major changes log), `docs/product-guides`. `.opencode/agents` and `.agents/skills` contain agent/skill definitions for other tools.

## Domain conventions

From `docs/SYSTEM_DESIGN_GUIDE.md`, which is the target design; the code may lag it (e.g. nothing in `src/` uses `amount_kobo` yet).

- Money is integer kobo (`amount_kobo`). Format ₦ only at the UI edge; never use floats.
- State-changing writes record who and when (`created_by`/`updated_by`, timestamps). Clinical records are never silently overwritten; append or version them.
- Canonical role keys: `opd`, `cashier`, `doctor`, `lab`, `pharmacy`, `nurse`, `eyeclinic`, `account`, `hr`, plus `it_admin` for maintenance. The code's `types.ts` still carries legacy role labels.

## Todos

`.todo` (repo root) is the tracked backlog. Read it at the start of a session and again before finishing work that its related activities. Remove an item when it's resolved, and mention open items that relate to the current task.

## Rules

- Never label plan items with bare alphanumeric codes (L1, P0, G2, etc.). Always use the full category name — Level 1, Priority 0, Gate 2 - or a descriptive title. This keeps every item traceable without needing a legend
