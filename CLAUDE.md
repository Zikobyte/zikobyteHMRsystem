# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ZMC (Zikora Medical Center) Hospital Management System. A single Node/Express process serves the REST API (`/api`), a WebSocket endpoint (`/ws`), and the React 19 + Vite + Tailwind 4 frontend from one origin (port 3000).

## Commands

Use Bun as the command runner (`bun run <script>`, `bun test`). The `package.json` scripts themselves still invoke `tsx`/`node`; migrating them is a separate `.TODO` item.

- `bun run dev` — runs `tsx server.ts`: Express + PostgreSQL init + Vite middleware + WebSocket. `dev:backend` is an alias for the same thing. Never run `node server.ts`.
- `bun run lint` — this is just `tsc --noEmit` (there is no ESLint). Baseline: 0 errors.
- `bun run build` — `vite build` plus esbuild bundling `server.ts` into `dist/server.cjs`; then `bun run start:production`.
- `bun test` — runs everything in `tests/` (`bun:test`, types stubbed in `tests/bun-test.d.ts`); one file with `bun test tests/backend/backfill.test.ts`. Baseline: 89 pass. Tests are DB-free unit tests; supertest, a test Postgres, React Testing Library/happy-dom and Playwright are approved but not installed yet (see `.TODO`).
- Env: copy `.env.example` → `.env`. Needs `PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD` and `JWT_SECRET`. A separately hosted frontend (Netlify) needs build-time `VITE_API_BASE_URL` and `VITE_WS_URL`.

## Architecture

overall system design can be found in the `SYSTEM_DESIGN_GUIDE.md` in the `/docs` directory

- `server.ts` is the composition root: mounts middleware, route modules under `/api/<feature>` (auth, users, patients, payments, exports, verify-identity, notifications, hr, nursing), inline audit-log endpoints, the WS server (JWT-authenticated via the first payload / `?token=`), then Vite (dev) or `dist` static files (prod). API routes must stay mounted before the frontend catch-all.
- Backend (`src/backend`):
  - Feature folders under `routes/<feature>/`: `auth`, `users` and `patients` follow `routes → controller → service → repository`, plus `validator` and `constants`. `payments` has `*.routes.ts` and a validator. `hr`, `nursing`, `notifications` and `exports` are a single `*.routes.ts`, and `verify-identity` is a single file in `routes/`. Audit-log and `/api/maintenance/*` endpoints live inline in `server.ts`.
  - `database/db.repo.ts` is a very large file holding the in-memory `Database` shape, seed data, PostgreSQL schema/init (`zmc_*` DDL created in code by `initializeDatabase`, ~2,300 lines) and the cache. Code reads via `getDB()` (in-memory cache) and `getPostgresPool()`; `refreshCache()` reloads from Postgres and also runs queue-repair UPDATEs on `zmc_patient_queue` and `zmc_patients`; a change to one store usually needs a matching change to the other. Handlers frequently write to both Postgres and the cache, and fall back to cache-only when no pool exists.
  - `catalogue/` holds the canonical lab, meds and eye catalogues and pricing (also used to seed DB and for `backfill`). The server-side catalogue is the source of truth for prices; frontend copies must not drift (see `.TODO`, and `tests/catalogue/frontend-parity.test.ts`).
  - `middleware/auth.middleware.ts` provides `authenticateJWT` and `authorizeRoles([...])`; roles are display strings such as `'IT Administrator'`, `'Doctor'`, `'Cashier'`.
  - `utils/ws.util.ts` tracks WS clients for pushing real-time updates between departments.

- Frontend (`src/frontend`, alias `@` → `src/frontend`, `@backend` → `src/backend`):
  - `lib/routing/` (`routes.ts`, `navigation.ts`, `session.tsx`, `view-plan.ts`) decides which department view a user lands on from their role/department (`ViewKind`: dashboard, opd, nursing, eye, doctor, lab, pharmacy, admin, hr, cashier, ...). Adding a department means updating the view plan and routes.
  - `views/<department>/` (cashier, doctor, eye, hr, it_admin, lab, nursing, opd, pharmacy, dashboard) holds department modules, route-lazy-loaded (code-split) via `routes.ts`, which maps each tab/path to a view and the departments allowed to see it. Modules have `_components/`, `_hooks/` and `_utils/` subfolders (some also `_tabs/`, `_modals/`). `navigation.ts` has the access checks, `view-plan.ts` builds per-user views and `session.tsx` holds login state. Cross-department UI lives in `components/shared`, `forms`, `layouts`, `patient-detail`.
  - `utils/api.ts` is the API/WS client; use `apiFetch` for requests rather than raw `fetch`.
- Docs: `docs/SYSTEM_DESIGN_GUIDE.md`, `docs/activity-log.md` (major changes log), `docs/product-guides`. `.opencode/agents` and `.agents/skills` contain agent/skill definitions for other tools.

## Domain conventions

From `docs/SYSTEM_DESIGN_GUIDE.md`, which is the target design; the code may lag it (e.g. nothing in `src/` uses `amount_kobo` yet).

- Money is always kobo in `BIGINT` columns (`*_kobo`, e.g. `amount_kobo`). Never `NUMERIC`, `INTEGER` or floats. Format ₦ only at the UI edge.
- State-changing writes record who and when (`created_by`/`updated_by`, timestamps). Clinical records are never silently overwritten; append or version them.
- Canonical role keys: `opd`, `cashier`, `doctor`, `lab`, `pharmacy`, `nurse`, `eyeclinic`, `account`, `hr`, plus `it_admin` for maintenance. The code's `types.ts` still carries legacy role labels.

## Todos

`.TODO` (repo root, uppercase) is the tracked backlog. Read it at the start of a session and again before finishing work that its related activities. Remove an item when it's resolved, and mention open items that relate to the current task.

## Rules

- Never label plan items with bare alphanumeric codes (L1, P0, G2, etc.). Always use the full category name — Level 1, Priority 0, Gate 2 - or a descriptive title. This keeps every item traceable without needing a legend

## Agent Workflow

Project subagents live in `.claude/agents/`. Orchestration stays in the main session: no subagent has the Agent tool, so subagents never delegate to each other. The main session sends work to them, and they hand work to each other through the feature spec file `docs/features/<feature-name>.md` (template: `docs/features/_TEMPLATE.md`). Every delegation prompt must stand alone, because subagents don't see this conversation: give the spec path, the exact task and what to report.

| Agent | Role | Writes |
| --- | --- | --- |
| hospital-manager | Hospital workflow expert; writes the spec and acceptance criteria | `docs/features/` only |
| database-engineer | Schema, migrations, constraints, indexes, `refreshCache`, seeds, backup/restore | DB layer + tests |
| backend-engineer | APIs, validation, authorization, audit logging, business logic, `package.json` | `src/backend`, `server.ts` + tests |
| frontend-engineer | UI, forms, client state, routing | `src/frontend` + tests |
| qa-engineer | Test strategy, end-to-end/regression tests, fixtures, coverage review | `tests/`, `e2e/`, test config only |
| security-auditor | Security and NDPA review, dependency audit | read-only |
| adversarial-reviewer | Attacks the change; APPROVED/REJECTED verdict | read-only |

Each agent preloads the project skills it needs from `.claude/skills/` (listed in its `skills:` frontmatter). The read-only agents and the agents with path limits are backed by hooks in `.claude/hooks/`. Read-only agents return findings to the main session, which records them in the spec's "Review findings" section.

### Choosing the path

- **Lightweight path:** copy, styling and small bug fixes that don't touch the schema, auth, billing logic or clinical data handling. Send the work to the owning engineer (regression test first for bugs), then have qa-engineer run the suite. Done when the suite passes.
- **Full path:** new features, schema changes, auth/permissions, billing, anything touching clinical or patient data, and anything the lightweight path turns up as bigger than expected. Run it with `/ship-feature <feature description>`.

### Full path

1. **Gate 1, Requirements:** hospital-manager creates the feature spec with workflow notes and acceptance criteria. Show the user any criteria marked [JUDGMENT CALL] (judgment calls about hospital operations) before building.
2. **Gate 2, Build:** database-engineer (design note and rollback note in the spec, then DDL or migrations), then backend-engineer (API contract in the spec, then code), then frontend-engineer, in dependency order. Run independent work in parallel.
3. **Gate 3, Verification:** qa-engineer adds end-to-end and regression tests and runs the full suite; security-auditor reviews. Run both in parallel.
4. **Gate 4, Adversarial Review:** adversarial-reviewer attacks the combined result against the feature spec.
5. **Iteration:** if the verdict is REJECTED, send each required fix to its owning agent, then repeat Gates 3 and 4. Continue until APPROVED. After three rounds, stop and escalate the unresolved issues to the user with the reviewer's evidence.
6. Nothing on the full path is complete until the full test suite passes, security-auditor has no unresolved Critical/High findings, and adversarial-reviewer returns APPROVED.

### Rules for every agent

- **Tests:** builder agents (database, backend, frontend, qa) never report done without tests they wrote and ran, with commands and results. Bug fixes start with a failing regression test. Until the test-infrastructure item in `.TODO` lands, API, database, component and end-to-end tests are reported as `TOOLING MISSING: <test> — <what it would assert>`, never skipped silently.
- **Domain rules, always required:** two patient identifiers before clinical actions; explicit units on doses, quantities and lab values; audit logging of patient-data access and changes; no health data in logs, errors, URLs, fixtures or seeds (synthetic data only); no silent loss of clinical data.
- **Domain rules, required only for code that touches the area:** break-glass access and optimistic locking (record access and editing); allergy checks (prescribing and dispensing).
- **Scope follows the design guide:** HMO/NHIA billing and the drug-interaction checker are out of the first release. hospital-manager records them as future gaps or behind future flags.
- **Known issue:** audit-log trimming and clearing (`server.ts:97`, `:131`, `:142-143`) is a HIGH `.TODO` item. It blocks only changes that touch audit logging.
