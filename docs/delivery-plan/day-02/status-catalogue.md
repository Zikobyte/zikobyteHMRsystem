# Status catalogue — Day 2

Reference for [state-transition-matrix.md](state-transition-matrix.md). Recorded 2026-10-10. Lists every column that carries state, the values the code actually writes, and what each desk treats as "in my queue".

Abbreviations: `db` = `src/backend/database/db.repo.ts`, `pr` = `src/backend/routes/patients/patients.repository.ts`, `pR` = `src/backend/routes/patients/patients.routes.ts`, `pay` = `src/backend/routes/payments/payments.routes.ts`.

## Ground facts

- Every state column is a free-text `VARCHAR`. There are **no CHECK constraints, enums or foreign keys on state**. `PATIENT_STATUS` in `patients.constants.ts:14-23` is never imported.
- `zmc_encounters` has no `status` column; its state is `clinical_status` (default `Pending Vitals`), `payment_status` (default `Unpaid`) and `priority` (default `Normal`) (`db:493-508`).
- `zmc_patient_queue` has `queue_type` and `status` but no department column, so routing works by rewriting or inserting `queue_type` (`db:946-956`).
- There are **no unique or partial indexes** on queue items or encounters, **no `FOR UPDATE` row locks and no `ON CONFLICT`** on any billing table, so the database never blocks a duplicate.
- `src/frontend/types.ts` types every status as plain `string`.

## Columns and defaults

| Table | State columns (default) | DDL |
| --- | --- | --- |
| zmc_patients | `status` (no default; cache treats NULL as `Triage Pending`, `db:331`), `card_type`, `outstanding_balance` (0) | `db:447-474` |
| zmc_encounters | `clinical_status` (`Pending Vitals`), `payment_status` (`Unpaid`), `priority` (`Normal`), `closed_at`, `destination_clinic`, `visit_type` | `db:493-508` |
| zmc_patient_queue | `queue_type` (required, no default), `status` (`Waiting`), `priority` (`Normal`), `processed_at`, `processed_by` | `db:946-956` |
| zmc_invoices | `status` (`Unpaid`), `amount_paid`, `balance` (0) | `db:655-666`, `:720-721` |
| zmc_payments | `status` (`Pending` — never written explicitly), `total_bill`, `balance` | `db:669-723` |
| zmc_outstanding_balances | `status` (`Owing`), `department`, `cleared_at`, `cleared_by` | `db:701-718` |
| zmc_discount_requests | `status` (`Pending`), `approved_by`, `approved_at`, `rejection_reason` | `db:1072-1091` |
| zmc_no_charge_records | **no state column** | `db:1060-1069` |
| zmc_clinical_cards | `status` (`Active`), `category` (`Individual`) | `db:959-967` |
| zmc_clinical_card_replacements | no status; `history_refreshed` (FALSE) | `db:970-980` |

## Values written

**`zmc_patient_queue.queue_type`**

| Value | Written at |
| --- | --- |
| Nursing Front-Desk | `pr:437` (registration), `pr:724` (createEncounter) |
| Doctor Consultation | `pr:509` (emergency), `pr:727`, `pr:1544`; `pay:227`, `:964`, `:987`, `:1456`; **`db:210` (refreshCache)** |
| Cashier Consultation Payment | `pr:720`, `pr:925` (after vitals) |
| Eye Clinic Consultation | `pr:722` |
| Cashier Lab Payment | `pR:251`, `pr:1438`, `pay:535` (walk-in) |
| Cashier Pharmacy Payment | `pR:374`, `pr:1438` |
| Laboratory | `pay:253`, `:296`, `:767` (rewrites every row of the encounter), `:1012`, `:1076` |
| Pharmacy | `pay:333`, `:1113` |

Read but never written: `Cashier Desk` (`pay:241`, `:346`, `:1127`), `Emergency` and `%Billing%` (`pay:1127`, `:1803`), `Billing` (`cashier-totals.ts:131`), `Cashier` (`BillingQueuesPanel.tsx:104`).

**`zmc_patient_queue.status`:** `Waiting` (default; also re-set on doctor exit `pR:121-123` and walk-in confirm `pay:767-770`), `Processing` (doctor select only, `pR:72-75`), `Completed`. `Lab Results Ready` is read (`useDoctorQueue.ts:836`) but never written.

**Priority (encounter and queue):** `Normal` (default, `pr:387`, `pR:1164`), `Routine` (`pay:491`, `:535` and fallbacks; the UI also sends it), `Urgent` (only read in the sort at `pr:884`), `Emergency` (`pr:446`). `Normal` and `Routine` mean the same thing.

**`zmc_patients.status`:** `Triage Pending`, `Emergency Dispatched`, `Waiting for Doctor` (also `db:222` refreshCache and `patients.service.ts:203`), `Awaiting Cashier Payment`, `Waiting for Eye Doc`, `Waiting for Vitals`, `Waiting for Consultation Payment`, `In Consultation`, `Waiting for Lab Payment`, `Waiting for Pharmacy Payment`, `Waiting for Laboratory`, `Waiting for Pharmacy`, `Waiting for Doctor (Lab Results Ready)`, `Completed`, `History Refreshed` (card replacement), `Waiting for Cashier (Walk-In Lab)`, `Discharged` (seed only). PATCH `/patients/:id` can set any value (`pr:566-582`). The constants `Billing Pending`, `Lab Pending`, `Pharmacy Pending`, `Admitted` are never written.

**`zmc_encounters.clinical_status`:** `Pending Vitals` and `Waiting for Vitals` (same meaning), `In Emergency Care`, `Pending Consultation`, `In Consultation`, `Awaiting Doctor` (doctor exit), `Waiting for Consultation Payment`, `Waiting for Lab Payment`, `Waiting for Pharmacy Payment`, `Waiting for Cashier Payment`, `Waiting for Laboratory`, `Waiting for Pharmacy`, `Waiting for Doctor (Lab Results Ready)`, `Completed`. `Open`, `Triage Completed` and `Pending Registration` are matched (`pay:974`) but never written.

**`zmc_encounters.payment_status`:** `Unpaid`, `Unconfirmed`, `Paid`, `No Charge (Approved)`. `createEncounter` always inserts `Paid` (`pr:735`); confirm-walk-in sets `Paid` on a partial payment (`pay:762`); the partial-payment path never updates it.

**`zmc_invoices.status`:** `Unpaid`, `Unconfirmed` (emergency, `pr:479`), `Paid`, `Partially Paid`, `Pending` (eye invoices, `pR:825`, `:1024`). Eye-clinic tables use another spelling set: `UNPAID`, `Part Paid`. Discount approval changes `amount` only (`pay:2001`).

**`zmc_payments.status`:** `Completed`, `Unconfirmed`, or **any string the client sends** for Cashier/Admin/Management (`pay:854`). The browser counts `Completed`, `Paid` or empty as collected (`cashier-totals.ts:80`).

**`zmc_outstanding_balances`:** `status` `Owing` / `Settled`; `department` `Laboratory`, `Pharmacy`, `Eye Clinic`, `Emergency Desk`, `OPD Reception`, or free text from the request.

**`zmc_discount_requests.status`:** `Pending`, `Approved`, `Rejected`. No "applied" state.

**`zmc_clinical_cards.status`:** `Active`, `Replaced`.

## Hidden writes in `refreshCache` (`db:204-228`)

1. **`db:208-219`** — every `Nursing Front-Desk` queue item in `Waiting` whose encounter's `destination_clinic` is `General OPD Out-Patient Clinic` or LIKE `%Doctor%`, `%Out-Patient%`, `%Consultation%` becomes `Doctor Consultation`. Standard and Maternity registration always use that clinic (`pr:386`), so any refresh sends new patients to the doctor **without triage or consultation payment**. Encounter state is not touched.
2. **`db:221-228`** — any patient with any `Doctor Consultation` item in `Waiting` gets `status = 'Waiting for Doctor'`, overwriting `In Consultation`, `Waiting for Laboratory`, `Emergency Dispatched` and so on.

`refreshCache` runs on server start-up with data (`db:1504`), seeding (`db:2306`), `/api/maintenance/cache-clear` (any logged-in user, `server.ts:145-148`), clear-store and system-reset (`server.ts:192`, `:244`), and **after all 18 HR create/update/delete handlers** (`hr.routes.ts:274`–`:1115`).

## What each desk treats as "in my queue"

The backend feed `GET /patients/opd/queue` (`pr:842-889`) returns only items in `Waiting` or `Processing` and does not return `clinical_status`.

| Desk | Filter |
| --- | --- |
| Doctor (`useDoctorQueue.ts:714-727`) | `queue_type` in Doctor Consultation, Cashier Consultation Payment, Nursing Front-Desk, Eye Clinic Consultation; one item per patient, preferring Doctor/Eye and Processing. Labels: Cashier → "IN CASHIER DEPT", Nursing → "AWAITING CONSULTATION (Vitals Pending)", "LAB RESULTS READY" (unreachable — `clinical_status` isn't in the feed) |
| Doctor active consultation (`pR:44-47`) | Doctor Consultation, `Processing`, `processed_by` = this doctor |
| Cashier regular list (`BillingQueuesPanel.tsx:95-105`) | `Waiting` only, not Emergency, `queue_type` in Cashier Consultation/Lab/Pharmacy Payment or `Cashier` |
| Cashier lab pending (`cashier-totals.ts:109-123`) | Cashier Lab Payment in Waiting/Processing, plus walk-ins added again — walk-ins are counted twice |
| Cashier billing queue (`cashier-totals.ts:126-133`) | `queue_type = 'Billing'` — never written, always empty |
| Cashier unpaid invoices (`cashier-totals.ts:136-139`, `:174-176`) | invoice `Unpaid` or `Pending`; excludes `Unconfirmed` and `Partially Paid` |
| Cashier walk-in (`pay:575-639`) | `visit_type = 'Laboratory Walk-In'`; paid if encounter Paid, invoice Paid or patient `Waiting for Laboratory` |
| Cashier eye registrations (`useCashierData.ts:270-274`) | status `Awaiting Cashier Verification`, or payment `UNPAID`, or balance > 0 |
| Nursing (`NursingQueueTab.tsx:51`, `:65`) | Nursing Front-Desk items |
