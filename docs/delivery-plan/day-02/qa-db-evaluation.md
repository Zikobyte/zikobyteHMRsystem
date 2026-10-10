# QA and database evaluation before Day 3

Recorded 2026-10-10. This was a read-only review by the project's qa-engineer and database-engineer agents; this page consolidates their reports. No code, schema, test or database was changed. Baseline at the time: `bun test` 89 pass, `bun run lint` 0 errors.

## Verdict

**Not ready for Day 3 as planned.** The Day 1–2 findings hold up — no claim checked was wrong — but two kinds of groundwork are missing:

1. **No way to prove the Day 3 gate.** The gate is a scripted database test showing that paying one of two bills leaves the other untouched. The 89 tests touch none of the code Day 3 changes (`payments.routes.ts`, the patients repository, `refreshCache`), and there's no supertest or test database.
2. **The database enforces none of the matrix's rules.** There are no CHECK constraints, no indexes beyond primary keys, and no row locks. Some paths corrupt other patients' financial rows today, and clinical rows are being hard-deleted.

The kobo cutover as written in `.TODO` (one atomic rename before Day 3) isn't realistic. The database engineer recommends expand-then-contract on the billing core **before Day 4**, and doing Day 3 on the naira columns with all money arithmetic in SQL.

## Corrections applied to the Day 1–2 documents

| Item | Correction | Where applied |
| --- | --- | --- |
| Defect 1 | The `"Unknown"` phone is at `useRegistrationForm.ts:504` | defect-log.md |
| Defect 22 | The leak is in queue and routing code; invoice marking in POST `/payments` and `/:id/confirm` is already scoped | defect-log.md |
| Defect 28 | Worse than logged: confirm-walk-in also rewrites the **amount** of every payment on the encounter, Completed ones included (`payments.routes.ts:739-744`) | defect-log.md, cashier-inventory.md |
| Defect 31 | The client `totalBill` is used only when no invoice resolves; the remaining risk is that the encounter lookup ignores the service | defect-log.md, cashier-inventory.md |
| Gap 50 | Lines are `patients.repository.ts:789-809` | state-transition-matrix.md |
| Gap 65 | A sequential second confirm gets 400; double routing happens only with concurrent requests | state-transition-matrix.md |
| "No `ON CONFLICT` on billing tables" | One exists, and it's harmful: the eye card invoice uses `ON CONFLICT (id) DO NOTHING` with an id that repeats every 1,000 seconds (`patients.routes.ts:810-818`) | status-catalogue.md |
| `.TODO` kobo item | `zmc_invoices.total_amount` doesn't exist; about 40 money columns across about 20 tables need converting, not five | `.TODO` |

## New gaps

Numbering continues from the [state-transition matrix](state-transition-matrix.md) (46–74). I checked each Critical item against the code.

| # | Gap | Where | Priority | Proposed slot |
| --- | --- | --- | --- | --- |
| 75 | **PATCH `/patients/:id` with `vitals`, `maternityDetails` or `emergencyDetails` set to null deletes all of the patient's rows of that kind** — the same clinical data loss as gap 55, through a second route | `patients.repository.ts:587-588`, `:610-611`, `:633-634` | Priority 0 | Before Day 3, together with 55 |
| 76 | **All start-up DDL runs as one statement batch.** If any statement fails (for example a new constraint that existing rows violate), the whole batch rolls back and the server silently runs cache-only, losing every write on restart | `db.repo.ts:409`, `:1146`, `:1508-1514` | Priority 0 | Rule from now on: nothing that can fail on existing data goes in `db.repo.ts` |
| 77 | Doctor claim takes the doctor's identity from the request body (`doctorName`) | `patients.routes.ts:31`, `:111` | Priority 0 | Day 5, D12 |
| 78 | Eye card invoice id repeats every 1,000 seconds and `ON CONFLICT DO NOTHING` silently drops the invoice; eye invoices have no patient or encounter | `patients.routes.ts:810-818`, `:1026-1030` | Priority 1 | With `.TODO` "Eye billing unification" |
| 79 | No foreign keys from debts, lab payments or discount requests to invoices or encounters; payments use `ON DELETE SET NULL`, so deleting an invoice silently orphans its payments | `db.repo.ts:672-680`, `:696-707`, `:1074-1078` | Priority 1 | Migration runner |
| 80 | No `CREATE INDEX` anywhere; no `UNIQUE (patient_id, visit_number)` on encounters | `db.repo.ts` | Priority 1 | Indexes now (safe); unique via runner |
| 81 | Invoice `amount_paid` and `balance` are never maintained (only the eye insert writes them) | `db.repo.ts:720-721`; `patients.routes.ts:815` | Priority 1 | Decide derive-vs-store before Day 4 |
| 82 | Start-up DDL isn't add-only: it drops columns and constraints and changes types on every boot | `db.repo.ts:488-490`, `:681-682`, `:811-814` | Priority 1 | Move into the runner baseline |
| 83 | Timestamps are `TIMESTAMP` without time zone, so the stored value depends on the server's time zone; the cashier-day lock needs a defined Lagos business date | `db.repo.ts` | Priority 1 | Before the day-lock work |
| 84 | `refreshCache` loads invoices and payments as raw snake_case rows, so a column rename silently changes field names in the UI | `db.repo.ts:347` | Priority 1 | Kobo cutover |
| 85 | Discount approval runs outside any transaction | `payments.routes.ts:1960-2030` | Priority 1 | Day 9, D31 (also gap 68) |

## QA findings

**Accuracy:** 23 claims checked, weighted to Priority 0: 20 confirmed, 3 partly right (corrected above), none wrong. Gap 46 (`refreshCache` moving patients to the doctor) affects every Standard registration, not an edge case.

**Coverage:** none of the 89 tests touches payments, queue transitions or the database. `tests/procurement/cashier-queue.test.ts` checks source text rather than behaviour (Low). The `tests/bun-test.d.ts` stub lacks matchers the database tests will need, such as `toContain` and `rejects`.

**None of the Day 3–7 gate tests can be written today:**

- TOOLING MISSING: payment isolation — pay the lab invoice; the pharmacy invoice, its cashier queue item and its payments stay untouched, with before/after rows.
- TOOLING MISSING: partial payment routing — `/payments/partial` updates only the intended invoice and opens the right next queue item with exactly one debt.
- TOOLING MISSING: emergency handover with partial cash — confirm records only the cash received, leaves the invoice unpaid and keeps the remainder as debt.
- TOOLING MISSING: debt settlement — the right debt, invoice, patient total, payment and audit rows update; the final settlement clears everywhere.
- TOOLING MISSING: two concurrent doctor claims — exactly one owner.
- TOOLING MISSING: two concurrent cashier settlements — one success, no negative balance.
- TOOLING MISSING: double-click idempotency — one payment and one receipt per key.
- TOOLING MISSING: failed multi-table registration — no partial patient, card, encounter, invoice or queue rows.
- TOOLING MISSING: triage creates exactly one cashier queue item.
- TOOLING MISSING: Day 7 end-to-end browser runs on a real database (Playwright).

**Smallest test infrastructure that unblocks Day 3, in order:**
1. Replace `tests/bun-test.d.ts` with `@types/bun`; the 89 tests must still pass.
2. Add supertest and separate `test:unit` / `test:integration` / `test:e2e` scripts; integration tests in their own folder.
3. A throwaway PostgreSQL on loopback (for example a Docker `postgres:16` container on a spare port). Not `pg-mem` or PGlite: the start-up DDL and the concurrency tests need real PostgreSQL.
4. A guarded test bootstrap. Set the `PG*` variables before any import, refuse any database whose name doesn't end in `_test` or isn't on loopback, and fail loudly unless PostgreSQL is active. Mount routers on a test Express app; never import `server.ts`, because it starts listening when imported.
5. Synthetic fixture builders (`TEST Patient 0001`, `TEST-0000001`, `0000000001`) and a minted-JWT helper. No real data, nothing from the seed.

**Obstacles in the code** (High unless noted):
- `src/backend/config/env.ts` auto-loads the developer's `.env` when imported, so a test could reach a real database. The bootstrap guard is mandatory.
- `initializeDatabase` swallows connection errors and falls back to the cache.
- The pool is a module-level singleton with no close function.
- `refreshCache` runs at the end of initialisation and rewrites queue rows (gap 46).
- Seeding inserts plaintext-password users (Medium).

**Regression tests to write first (all fail today):**
1. Partial payment on invoice A leaves invoice B Unpaid (D08). Variants: full amount, and a client total that the server must ignore.
2. Full payment on the lab invoice leaves the pharmacy invoice, its queue item and its routing untouched (D07). Variant: the same through confirm.
3. An invoice belonging to another patient is rejected (gap 61).
4. A ₦1 payment doesn't mark a ₦5,000 invoice Paid (defect 24).
5. Lab invoice selection and clearing the selection context (D28). These need the selection logic pulled out of `LabPaymentsTab.tsx` and `useCashierPayments.ts` into pure functions first.

## Database findings

**Accuracy:** all schema claims confirmed, several wider than stated. There are no indexes at all, foreign keys are missing on billing tables, and there are clinical DELETE paths through PATCH (gap 75). Money columns are `DECIMAL(10,2)`, `NUMERIC(12,2)` or `INT`; none is a float, so multiplying by 100 for kobo is exact.

**Schema the target states need** — what can go in safely now and what needs the migration runner:

| Change | When |
| --- | --- |
| Non-unique indexes on queue, encounter, invoice, payment and debt lookup columns | **Now**, add-only. These can't fail on existing data. |
| `version`, `updated_by`/`updated_at`, `confirmed_by`/`confirmed_at`, `collected_by_user_id` columns | **Now**, add-only. |
| Status CHECKs and new foreign keys | **Now, as `NOT VALID`** inside a guarded `DO` block, so they apply to new rows only. Validate later through the runner. |
| One open queue item per encounter and queue type (partial unique index) | **Runner**, after cleaning duplicates (query Q1). Needed by Day 5–6 at the latest. |
| One Owing debt per invoice (partial unique index) | **Runner**, after merging duplicates (Q2). Needed for Day 4. |
| One active consultation per doctor; unique visit numbers; unique idempotency keys | **Runner**. |
| Payments must name an invoice; invoices must name a patient and encounter; CASCADE → RESTRICT on about 39 foreign keys | **Runner**, after backfill. |
| New tables: discount applications (append-only), cashier days, state-transition history | New tables are safe, but create the money ones **after** the kobo expand. The cashier-days table needs policy 4. |

**Concurrency.** Most billing paths already use `withBillingTransaction`, but they read their preconditions outside it and then update unconditionally. The fix is the same everywhere:
- lock in a fixed order (invoice → encounter → queue → patient);
- use conditional updates such as `UPDATE … WHERE status = 'Unconfirmed' … RETURNING`, and turn 0 rows into a 409;
- take the patient and amount from the locked row, never from the client.

READ COMMITTED is enough. Paths covered: full payment, partial payment, settle, confirm, walk-in confirm, discount approval, doctor claim, and a new server-side cashier claim.

**`refreshCache` (gaps 46/47):** nothing legitimate depends on its two queue-repair UPDATEs. The doctor desk already shows Nursing items as "Vitals Pending", so removing them hides no patient. Safe removal:
1. Snapshot the affected rows (Q12).
2. Delete both UPDATEs.
3. Have the Nursing lead decide each moved patient by hand. Don't bulk-revert anyone, because some may already be in consultation.
4. Stop the HR handlers calling `refreshCache`, and add a role check to the cache-clear endpoint.

**Existing-data checks:** the database engineer wrote read-only SQL (Q1–Q12, in [integrity-queries.sql](integrity-queries.sql)) to measure:
- duplicate open queue items;
- duplicate or wrong Owing debts;
- invoices Paid with too little money;
- encounters Paid with no payment;
- emergency cash booked again;
- clinical rows lost to deletion;
- stored status values;
- visit-number collisions;
- orphan references;
- patients moved by `refreshCache`.

Run them only on a **restored copy**, never the live database. Deleted clinical rows can be recovered only from a backup, and no backup has been verified. The audit log can't help, because it is trimmed to 500 rows.

## Recommended order before Day 3

1. Take a verified `pg_dump -Fc` backup; run Q1–Q12 on a restored copy and record the counts.
2. Stop the bleeding (full path, small scope):
   - remove the six clinical DELETE paths (gaps 55, 75), making card replacement one transaction;
   - remove the two `refreshCache` queue repairs (46, 47);
   - fix walk-in confirm rewriting payment amounts (defect 28).
3. Test infrastructure slice (QA steps 1–5 above). This is the `.TODO` test-infrastructure item.
4. Migration runner with a baseline that absorbs the destructive start-up DDL (gaps 76, 82).
5. Add-only database work: indexes, version and who/when columns, `NOT VALID` CHECKs and foreign keys.
6. Day 3 fixes on the naira columns: money arithmetic in SQL only, no new money columns, regression tests first.
7. Kobo expand on the billing core, before Day 4.
8. Data cleanup and the runner migrations for the two partial unique indexes, before Day 5.

## Decisions for you

1. **Order:** accept the order above, which shifts Day 3 back by about two days of groundwork? Or run Day 3 alongside it, with the risk that its fixes go untested until the infrastructure lands?
2. **Kobo timing:** expand on the billing core before Day 4, as recommended, or keep the `.TODO` plan of one rename before Day 3?
3. **Test database:** Docker container or a locally installed PostgreSQL on a spare port?
4. **Policies 1, 2, 4 and 5** from the [Day 2 README](README.md) still block the debt, open-encounter and day-lock constraints and the partial-payment routing.
