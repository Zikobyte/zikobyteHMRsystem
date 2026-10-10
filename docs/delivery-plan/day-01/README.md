# Day 1 — Stabilise the build and freeze the state model

15-day delivery plan, Week 1. Recorded 2026-10-10. The source checklists are `docs/internal/Taiwo_Deliverables.docx` and `docs/internal/Kelechi_Deliverables.docx`.

Day 1 is documentation only. Defects found are logged in [defect-log.md](defect-log.md) against the day that owns the fix; no code was changed.

## Documents

| Document | Owner | Contents |
| --- | --- | --- |
| [build-baseline.md](build-baseline.md) | Taiwo | Lint, test and production-build results |
| [opd-inventory.md](opd-inventory.md) | Taiwo | Every OPD route, tab, form and modal, with the API it calls |
| [registration-contract.md](registration-contract.md) | Taiwo | What Standard, Maternity and Emergency registration accept and reject |
| [cashier-inventory.md](cashier-inventory.md) | Taiwo + Kelechi | Every cashier tab, modal and payment surface |
| [vocabulary.md](vocabulary.md) | Taiwo + Kelechi | The eight shared words — **draft** |
| [defect-log.md](defect-log.md) | Taiwo | 45 defects, each with a priority and a planned fix day |
| Doctor inventory | Kelechi | Not in this folder yet |

## Acceptance gate

| Gate item | Status |
| --- | --- |
| Clean build, or remaining build errors listed with owners | **Met** — `bun run lint` 0 errors, `bun test` 89 pass, `bun run build` succeeds. The cashier/nursing TypeScript errors in the plan no longer reproduce; Kelechi to confirm the doctor-directory error is also gone. |
| Three inventories exist | **Partly met** — OPD and cashier inventories and the registration contract are done; the doctor inventory is Kelechi's. |
| Shared vocabulary agreed | **Open** — drafted; needs Kelechi's sign-off. |

## Notes for later days

- **Kobo cutover first.** The cashier inventory shows money stored as naira floats under five different field names. The kobo reminder in `.TODO` says the schema rename, backfill and validator change should land before the Day 3 payment fixes, so those fixes are written once against the final schema. That cutover depends on the migration runner (also in `.TODO`) — decide its timing before Day 3.
- **Scripted database tests.** The Day 3–6 gates need scripted database tests, which depend on the test-infrastructure item in `.TODO`.
- **Unscheduled Priority 0 defects** in the defect log (missing role checks, eye payment verification, maternity supply balance in memory only) need owners.

**Next:** [Day 2 — state-transition matrix](../day-02/README.md).
