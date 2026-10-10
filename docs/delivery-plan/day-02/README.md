# Day 2 — State-transition matrix (D01)

15-day delivery plan, Week 1. Recorded 2026-10-10. Documentation only; no code changed.

## Documents

| Document | Owner | Contents |
| --- | --- | --- |
| [state-transition-matrix.md](state-transition-matrix.md) | Taiwo (OPD, cashier) + Kelechi (doctor) | Target states, 8 OPD and 12 cashier transitions, next queue by service, hidden transitions, 29 new gaps (46–74) |
| [status-catalogue.md](status-catalogue.md) | Taiwo | Every state column, every value the code writes, and what each desk treats as its queue |
| [qa-db-evaluation.md](qa-db-evaluation.md) | qa-engineer + database-engineer review | Readiness for Day 3, corrections applied to Days 1–2, gaps 75–85, recommended order, decisions |
| [integrity-queries.sql](integrity-queries.sql) | database-engineer | Read-only checks for existing bad data (run on a restored copy only) |

## Acceptance gate

| Gate item | Status |
| --- | --- |
| A single combined matrix document exists | **Met for OPD and cashier.** The doctor section is a placeholder for Kelechi. |
| Every state has an owner and an explicit next queue | **Met** for all 20 OPD and cashier rows. Six rows depend on policy decisions below. |
| Gaps graded by priority | **Met** — every gap has Priority 0, 1 or 2 and a planned day or "Unscheduled". |
| Transitions enforced only in the frontend are marked | **Met** — the "Enforcement today" column. Only C1 (queue selection) is frontend only; five rows have no backend enforcement at all. |

## Policy decisions that need sign-off

Each affects the rows named. The proposed default is what the matrix assumes until someone with authority decides.

| # | Decision | Rows | Proposed default | Needed by |
| --- | --- | --- | --- | --- |
| 1 | Partial consultation, lab or pharmacy payment: does the patient move on (credit) or wait at the cashier? | C3, C5, C10 | Hold at the cashier unless an authorized credit exemption is recorded; release on final settlement | Day 4 (its gate refers to "the agreed credit policy") |
| 2 | Returning visit: triage and consultation payment again, or straight to the doctor? | O4, O5 | Same path as a new encounter (Nursing → Cashier → Doctor); emergencies go straight to the doctor | Day 9 (D22) |
| 3 | No-charge: who approves, and is the invoice closed as No Charge? | C8 | Approved by someone other than the cashier; invoice closed as No Charge | Day 10 (D32) |
| 4 | Day lock: who locks, and what it blocks | C11 | Cashier locks, supervisor countersigns; no payment, confirmation or settlement can be dated to a locked day | Before balance-day work is scheduled |
| 5 | Card replacement: fee and approver | O8 | Approver other than the requester; clinical history is never deleted (not optional) | Day 9 (D26) |
| 6 | Triage before consultation payment for Standard and Maternity | O1, O2, O6 | Keep the current order: registration → Nursing → Cashier → Doctor | Confirm now; H1 currently breaks it |

## What stands out

- **Five transitions have no backend enforcement** (returning patient, new encounter, triage, card replacement, day lock) and queue selection exists only in the browser — the API accepts these calls in any state.
- **`refreshCache` sends untriaged, unpaid patients to the doctor** (gap 46). It runs on start-up and after every HR edit. It undermines the Day 3–6 tests, so it's proposed for Day 3.
- **Card replacement deletes clinical history** (gap 55). It's clinical data loss scheduled for Day 9; consider pulling it forward.
- **Cashier routing is patient-wide.** One payment can open the doctor, laboratory and pharmacy queues together (58), and partial payment opens nothing (62). This is the core of Days 3–4.
- **Nothing in the database stops duplicates or races** (71, 72): no constraints on state values, no unique open-queue index, no row locks. Fixing these structurally needs the migration runner in `.TODO`.

## Next

- Kelechi: add the doctor section with the same columns and review the cashier rows.
- Both: agree the [Day 1 vocabulary](../day-01/vocabulary.md) and the six policy decisions.
- Kobo cutover timing (see the [Day 1 README](../day-01/README.md)) still needs deciding before Day 3.
