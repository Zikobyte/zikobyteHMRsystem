# Build baseline — Day 1

Recorded 2026-10-10 on branch `joloo` (commit `33ca647`), using Bun as the runner.

| Check | Command | Result |
| --- | --- | --- |
| Type check | `bun run lint` (`tsc --noEmit`) | **0 errors** |
| Unit tests | `bun test` | **89 pass, 0 fail** (762 assertions, 16 files) |
| Production build | `bun run build` (`vite build` + esbuild of `server.ts`) | **Succeeds**; `dist/server.cjs` 575 kB |

## Notes

- The plan says TypeScript errors in the cashier and nursing files block a clean build. Those errors no longer reproduce, so there is no build-error list to assign owners to. Kelechi's separate doctor-directory key/props error should be confirmed the same way.
- The build prints one warning, not an error: several chunks are over 500 kB after minification (`index` 719 kB, `OPDRegistrationView` 483 kB, `PatientDirectoryImportView` 455 kB, `DoctorView` 423 kB). This is a performance concern, not a blocker, and is unscheduled.
- `dist/` is git-ignored, so the build leaves no tracked changes.
- The tests are database-free unit tests. API, database, component and end-to-end tests are blocked on the test-infrastructure item in `.TODO`. The scripted database tests that the Day 3–6 acceptance gates ask for depend on it.
