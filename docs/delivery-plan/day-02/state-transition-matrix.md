# State-transition matrix (D01)

**The contract for Days 3–15.** OPD and cashier sides by Taiwo; doctor side by Kelechi (section 6, pending). Recorded 2026-10-10.

Each row gives the **target** transition — the rule every later fix must satisfy — next to what the code does today. Where the target depends on hospital policy, the row says **needs sign-off** and gives a proposed default; those decisions are listed in [README.md](README.md). Words follow [the Day 1 vocabulary](../day-01/vocabulary.md). Current stored values are in [status-catalogue.md](status-catalogue.md).

**Enforcement today** means what the backend checks right now:
- **Enforced** — the backend checks the precondition and the role.
- **Partial** — some checks exist, but a listed gap lets a wrong transition through.
- **Frontend only** — only the UI prevents it; a direct API call or second device gets through.
- **None** — nothing prevents it.

Gap numbers 1–45 are in [the Day 1 defect log](../day-01/defect-log.md); 46 onwards are new and listed in section 7. Priority 0 means it loses or misroutes money or clinical data, or blocks a core flow; Priority 1, wrong but recoverable; Priority 2, cleanup.

## 1. Target states

One state per entity, replacing today's overlapping strings.

| Entity | Target states (in order) | Replaces today's values |
| --- | --- | --- |
| Encounter (clinical) | Awaiting Triage → Awaiting Consultation Payment → Awaiting Doctor → In Consultation → (doctor-side states, section 6) → Completed. Emergency: In Emergency Care → doctor-side states. | `Pending Vitals` = `Waiting for Vitals` → Awaiting Triage; `Waiting for Consultation Payment` → Awaiting Consultation Payment; `Pending Consultation` = `Awaiting Doctor` → Awaiting Doctor. Drop never-written `Open`, `Triage Completed`, `Pending Registration`. |
| Encounter (payment) | Derived from its invoices: Unpaid, Unconfirmed, Partially Paid, Paid, No Charge | Today stored separately and often wrong (`Paid` with no payment, `Paid` on partial) |
| Queue item | Waiting → Processing (claimed, with who and when) → Completed | Same values; `Processing` is only used by doctors today |
| Queue type | Nursing Front-Desk, Cashier Consultation Payment, Cashier Lab Payment, Cashier Pharmacy Payment, Doctor Consultation, Laboratory, Pharmacy, Eye Clinic Consultation | Retire `Cashier Desk`, `Emergency`, `Billing`, `Cashier` (read, never written) |
| Priority | Routine, Urgent, Emergency | `Normal` → Routine |
| Invoice | Unpaid → Partially Paid → Paid; or No Charge | Retire invoice `Unconfirmed` and `Pending`; eye `UNPAID`/`Part Paid` → same set |
| Payment | Unconfirmed (cash held by another department) → Completed | Retire default `Pending`; status never taken from the client |
| Debt | Owing → Settled | Same |
| Discount request | Pending → Approved → Applied, or Pending → Rejected | Add Applied |
| Clinical card | Active → Replaced | Same |
| Cashier day | Open → Locked | Doesn't exist today |

**Invariants:**
- An encounter has at most one queue item in Waiting or Processing per queue type.
- Every payment, debt and discount names exactly one invoice. Every invoice names one encounter, and every encounter names one patient.
- A transition changes only the rows of the invoice, encounter and service it names. Never select or update by patient alone.
- Every transition records who and when.

## 2. OPD side

| # | From | Action | Actor (target) | Enforcement today | To | Next queue | Owner | Today and gaps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| O1 | (new person) | Standard registration | OPD Clerk, Receptionist, Records Officer | **Partial** — validator and duplicate check; no transaction; backend also admits Doctor, Nurse, Cashier, Eye Clinic, Account Officer | Patient created; encounter Awaiting Triage, Routine; invoice (card + consultation) Unpaid; queue item Nursing Front-Desk, Waiting | **Nursing Front-Desk** | OPD | Writes match the target, but `refreshCache` later moves the item to Doctor Consultation (46). No transaction (4). Success screen says "moved to Cashier queue". |
| O2 | (new person) | Maternity registration | same as O1 | **Partial** — as O1; no Female or maternity-field check | As O1, plus maternity record and maternity number; invoice total 8000 | **Nursing Front-Desk** | OPD | Fees disagree: 5000 / 3000 + 2000 / 8000 (9). Family/Company category dropped (5). No maternity validation (7). Same `refreshCache` jump (46). |
| O3 | (new or unidentified person) | Emergency registration | same as O1 | **Partial** — as O1; unidentified intake broken | Patient created; encounter In Emergency Care, Emergency; invoice Unpaid; payment Unconfirmed for the cash actually collected (a handover, C9) | **Doctor Consultation** (Emergency priority) | OPD / Emergency desk | "Unknown" phone always rejected (1). Invoice set to `Unconfirmed`, which the cashier's unpaid list never shows (67). No emergency record when `emergencyDetails` is omitted. |
| O4 | Patient with no open encounter | Returning patient: search → history → re-queue | OPD Clerk, Receptionist, Records Officer | **None** — no role check on history or re-queue; no check for an open encounter or debt | New encounter Awaiting Triage (same as O5) — **needs sign-off**, policy 2 | **Nursing Front-Desk** (proposed) | OPD | Today: straight to Doctor Consultation with no triage, no invoice, encounter `Paid` (49, 51); re-books old emergency cash (50); no broadcast (15); debts don't show (6). |
| O5 | Patient with no open encounter | New encounter (Queue Visit) | OPD Clerk, Receptionist, Records Officer | **None** — no role check, no patient or open-encounter check | New encounter Awaiting Triage, invoice for the consultation Unpaid, queue item Nursing Front-Desk | **Nursing Front-Desk** (proposed; Eye Clinic visits → Eye Clinic Consultation) | OPD | Today: always Doctor or Eye from the UI, encounter inserted `Paid` with no payment (49); duplicates allowed and `visit_number` can collide (51); old emergency cash re-booked (50). O4 and O5 should be one backend path. |
| O6 | Encounter Awaiting Triage + Nursing Front-Desk item Waiting | Record triage vitals | Nurse, Head Nurse | **None** — no check that the item exists or is Waiting, or that the encounter belongs to the patient; vitals unvalidated; Receptionist and Records Officer also allowed | Nursing item Completed; vitals saved against the encounter with units; encounter Awaiting Consultation Payment; **one** Cashier Consultation Payment item, Waiting | **Cashier Consultation Payment** | Nursing | Every save adds another cashier item (52, D19). Success message and broadcast say "doctor" (53). Vitals shown by patient, not encounter (54). `recordVitals` in `patients.service.ts:203` sets patient status `Waiting for Doctor` with no queue change (H3). |
| O7 | Any open encounter | Escalate priority | Nurse, Head Nurse, Doctor | **Partial** — role checked; value, reason and target not checked | Encounter and all its open queue items (Waiting and Processing) get the new priority; reason, actor and time recorded | **Unchanged** — same queue, re-sorted | Nursing | Processing items skipped, any string accepted, audit role hard-coded `Nurse`, broadcast to every client with no IDs (57). |
| O8 | Patient with an Active card | Request card replacement → approve | Request: OPD Clerk, Receptionist, Records Officer. Approve: a different user — **needs sign-off**, policy 5 | **None** — no approval step; `approved_by` is the requester | Old card Replaced, new card Active, replacement logged; fee invoice if policy says so; **clinical history untouched** | **No queue change** — the patient stays where they are | OPD | **Deletes all the patient's vitals, maternity and emergency records** (55). No approval, maternity card stays Active, partial write on number clash (56). Patient status overwritten with `History Refreshed` (74). |

## 3. Cashier side

| # | From | Action | Actor (target) | Enforcement today | To | Next queue | Owner | Today and gaps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | Cashier queue item Waiting | Select a queue item and its invoice | Cashier | **Frontend only** — no API call, no write | Queue item Processing, claimed by this cashier, bound to one invoice | **Same queue** (claimed) | Cashier | Two cashiers can work the same item; the selected reference can be an encounter ID that is later sent as `invoiceId` (70). |
| C2 | Invoice Unpaid or Partially Paid + its cashier item | Full payment | Cashier | **Partial** — validator checks amount > 0 and method; the backend never compares amount with the invoice, never checks the invoice belongs to the patient, takes status from the client | Payment Completed; invoice Paid; that service's cashier item Completed; encounter payment derived | **The paid service's next queue only** (section 4) | Cashier | Routing finds items by patient with `LIMIT 1` and runs consultation, lab and pharmacy branches together (58); lab fallback matches any historic "Laboratory" invoice (59); consultation fallback adds Doctor items without a duplicate check (60); can mark another patient's invoice Paid (61). Also 21–24. |
| C3 | Invoice Unpaid | Partial payment | Cashier | **Partial** — amount ≤ total checked; total falls back to the client value | Payment Completed; invoice Partially Paid; debt Owing (C4). Cashier item stays Waiting **unless** an authorized credit exemption is recorded, then the next queue opens — **needs sign-off**, policy 1 | **Held at the cashier** (proposed), or the service's next queue under a credit exemption | Cashier | Marks every invoice for the patient (21); completes every cashier item for the patient (62); opens no next queue (62, 25); never updates encounter payment. |
| C4 | Partial payment, underpaid handover, or partial walk-in | Debt created (system step inside C3, C10, C12) | Same actor as the parent step | **Partial** | Debt Owing, linked to the invoice; balance = invoice total − all payments on it | **None** — appears on the Outstanding list | Cashier | Balance ignores earlier payments; a second partial creates a second debt (63). Department is free text. |
| C5 | Debt Owing | Settle debt | Cashier | **Partial** — amount ≤ balance, but read outside the transaction; patient taken from the client | Payment Completed; debt Settled or reduced; invoice amount paid updated and Paid when cleared; patient total recomputed | **None**; if C3 held the encounter, the service's next queue opens on final settlement | Cashier | Invoice stays Partially Paid and nobody is routed (64); client patient ID and stale read (27); OPD modal gets 403 (17). |
| C6 | Invoice Unpaid | Request discount | Cashier | **Partial** — type and bounds checked; invoice not checked; duplicates allowed; Doctor and Nurse also allowed | Discount request Pending, linked to the invoice; invoice and cashier item unchanged | **Discount approvals** (HR / Account) | Cashier | Client `originalAmount` (32); reference may be an encounter ID; duplicate Pending requests (68). |
| C7 | Discount Pending | Approve or reject | HR or Account Officer; never the requester | **Partial** — Pending and not-own-request checked; invoice status not checked; no concurrency guard | Approved: invoice balance reduced by a recorded discount application (not by overwriting the amount), request Applied when used. Rejected: invoice unchanged. | **Back to the cashier item** for that invoice | HR / Account | Overwrites `invoices.amount` and can reprice a Paid invoice (68, 32); concurrent approvals both succeed (68); cashiers see buttons that 403 and HR sees an empty list (33). |
| C8 | Invoice Unpaid | No-charge exemption | Requested by Cashier; approved by a different authorized user — **needs sign-off**, policy 3 | **Partial** — fields checked; no patient or queue check; approver is free text | Invoice No Charge; exemption record with approver; that service's cashier item Completed | **The service's next queue** | Cashier | Only consultation items move; invoice stays Unpaid (69); approver defaults to "Dr. Alan Smith"; no transaction (41). |
| C9 | Cash collected outside the cashier | Record handover (system step in emergency registration and walk-in lab) | Collecting department (OPD/Emergency, Laboratory) | **Partial** | Payment Unconfirmed, linked to the invoice, for the amount actually collected | **Cashier handover panel** | Collecting department | Walk-in creates an Unconfirmed payment for the full amount nobody collected (29); later encounters re-book old emergency cash (50). |
| C10 | Payment Unconfirmed | Confirm handover | Cashier, not the person who collected the cash | **Partial** — "not Completed" checked outside the transaction; amount and invoice not checked | Payment Completed. Invoice Paid only if payments cover it; otherwise Partially Paid and a debt (C4) | **The service's next queue** (policy 1 applies when underpaid) | Cashier | Marks Paid unconditionally (26, D10); any status except Completed accepted, collector may confirm own cash, no lab payment row, double confirm routes twice (65). |
| C11 | Cashier day Open | Balance and lock the day | Cashier, countersigned by a supervisor — **needs sign-off**, policy 4 | **None** — no endpoint, table or flag | Day Locked with persisted totals; no payment, confirmation or settlement can be dated to a locked day | **None** | Cashier | "Print & Lock" only shows a message; totals cover all time (37). |
| C12 | Walk-in lab invoice Unpaid | Confirm walk-in payment | Cashier | **Partial** — amount ≤ invoice total; invoice and encounter state not checked | Payment Completed; invoice Paid or Partially Paid (+ debt); cashier lab item Completed; **one** Laboratory item Waiting | **Laboratory** | Cashier | Rewrites every queue item of the encounter, encounter `Paid` on partial, can be repeated (66); four ways to pay a walk-in (29, 30). |

## 4. Next queue by service

Applies to C2, C8, C10, C12, and to C3/C5 when policy 1 releases the encounter.

| Service on the invoice | Cashier queue item | Next queue after payment |
| --- | --- | --- |
| Registration / consultation | Cashier Consultation Payment | Doctor Consultation |
| Lab tests ordered by a doctor | Cashier Lab Payment | Laboratory |
| Medications | Cashier Pharmacy Payment | Pharmacy |
| Walk-in lab | Cashier Lab Payment | Laboratory |
| Emergency registration | none (already in Doctor Consultation) | no change |
| Eye Clinic | (separate eye tables today — see `.TODO` "Eye billing unification") | Eye Clinic Consultation |

A payment opens exactly one next queue item: the one for the service it paid.

## 5. Hidden transitions (no actor requested them)

Each must be removed or turned into an explicit, audited transition.

| # | Where | What it does | Gap |
| --- | --- | --- | --- |
| H1 | `refreshCache`, `db.repo.ts:208-219` | Moves every triage-waiting Standard/Maternity item to Doctor Consultation, skipping triage and payment | 46 |
| H2 | `refreshCache`, `db.repo.ts:221-228` | Sets patient status `Waiting for Doctor` for anyone with any waiting doctor item | 47 |
| H3 | `patients.service.ts:203` (`recordVitals`) | Sets patient status `Waiting for Doctor` with no queue change | 54 |
| H4 | `payments.routes.ts:766-770` (confirm-walk-in) | Rewrites every queue item of the encounter, including Completed ones, to Laboratory/Waiting | 66 |

`refreshCache` runs on start-up, seeding, maintenance endpoints any logged-in user can call, and after every HR write (48).

## 6. Doctor side — Kelechi

**Pending.** Kelechi drafts this section from his Day 2 checklist with the same columns: waiting, in cashier dept, vitals pending, processing/claimed, held, notes saved, labs sent, medications sent, completed, lab results returned, pharmacy dispensed, admission, discharge.

Facts found today that touch the doctor side:
- The doctor desk shows four queue types and picks one item per patient (`useDoctorQueue.ts:714-727`). Its labels "IN CASHIER DEPT" and "AWAITING CONSULTATION (Vitals Pending)" come from Cashier and Nursing items.
- "LAB RESULTS READY" can never show: `GET /patients/opd/queue` doesn't return `clinical_status`, and the queue status `Lab Results Ready` is never written (73).
- Select and exit write `Processing` / `In Consultation` and `Waiting` / `Awaiting Doctor` (`patients.routes.ts:28-133`). The doctor's "is this mine" check is Doctor Consultation + Processing + `processed_by` (`patients.routes.ts:44-47`).
- Because of H1, unpaid and untriaged Standard/Maternity patients appear as plain "AWAITING CONSULTATION" doctor items.

## 7. New gaps

Found on Day 2 and not in the Day 1 log. Planned days use the D-numbers in the deliverables documents.

| # | Gap | Where | Priority | Planned fix |
| --- | --- | --- | --- | --- |
| 46 | `refreshCache` moves triage-waiting patients to the doctor queue | `db.repo.ts:208-219` | Priority 0 | Unscheduled — propose Day 3 (queue integrity, before payment tests rely on queue rows) |
| 47 | `refreshCache` overwrites patient status | `db.repo.ts:221-228` | Priority 1 | With 46 |
| 48 | `refreshCache` runs after every HR write and from a maintenance endpoint any user can call | `hr.routes.ts:274`–`:1115`; `server.ts:145-148` | Priority 1 | With 46; role check is in `.TODO` "Maintenance endpoint role checks" |
| 49 | New encounters inserted with `payment_status = 'Paid'` and no payment | `patients.repository.ts:735` | Priority 0 | Day 9, D22 |
| 50 | Every later encounter re-books the old emergency cash as a new Unconfirmed payment | `patients.repository.ts:795-809` | Priority 0 | Day 9, D22 |
| 51 | Re-queue and new encounter skip triage and payment; no open-encounter check; `visit_number` can collide | `patients.repository.ts:717-830` | Priority 0 | Day 9, D22 |
| 52 | Each triage save adds another cashier item (D19) | `patients.repository.ts:924-928` | Priority 0 | Day 5, D19 |
| 53 | Triage success message and broadcast say "doctor"; backend routes to cashier | `useOpdQueue.ts:184-186`; `patients.controller.ts:302-310` | Priority 1 | Day 5, D21/D22 |
| 54 | Vitals shown by patient, not by encounter; `recordVitals` changes status without a queue change | `patients.repository.ts:860-869`; `patients.service.ts:203` | Priority 1 | Day 5 (vital freshness) |
| 55 | Card replacement deletes the patient's vitals, maternity and emergency records | `patients.repository.ts:969-977` | Priority 0 | Day 9, D26 — clinical data loss; consider pulling forward |
| 56 | Card replacement has no approval; maternity card stays Active; partial write on number clash | `patients.repository.ts:952-984`; `patients.controller.ts:337-338` | Priority 1 | Day 9, D26 |
| 57 | Priority escalation accepts any value, skips Processing items, hard-codes audit role, broadcasts to all | `patients.repository.ts:933-950` | Priority 2 | Day 8, D20 |
| 58 | One payment runs the consultation, lab and pharmacy routing branches, each found by patient with `LIMIT 1` | `payments.routes.ts:940-1129` | Priority 0 | Day 3, D07 |
| 59 | Lab routing fallback matches any historic "Laboratory" invoice | `payments.routes.ts:1058-1062`, `:281` | Priority 0 | Day 3, D07 |
| 60 | Consultation fallback inserts a Doctor item without a duplicate check | `payments.routes.ts:972-991` | Priority 1 | Day 6, D14 |
| 61 | POST `/payments` never checks the invoice or encounter belongs to the patient | `payments.routes.ts:896-937` | Priority 0 | Day 3, D07 |
| 62 | Partial payment completes every cashier item for the patient and opens no next queue; encounter payment untouched | `payments.routes.ts:1799-1805` | Priority 0 | Day 4, D09 (OR predicate: Day 3, D08) |
| 63 | Debt balance ignores earlier payments; a second partial creates a second debt | `payments.routes.ts:1760-1789` | Priority 0 | Day 4, D11 |
| 64 | Settling a debt leaves the invoice Partially Paid and routes nobody | `payments.routes.ts:1597-1658` | Priority 0 | Day 4, D11 |
| 65 | Confirm accepts any status except Completed, lets the collector confirm, writes no lab payment row, double confirm routes twice | `payments.routes.ts:147-347` | Priority 0 | Day 4, D10; Day 5, D13 |
| 66 | Confirm-walk-in sets encounter Paid on partial, rewrites every queue item, can be repeated | `payments.routes.ts:690-809` | Priority 0 | Day 10, D30 |
| 67 | Emergency invoice status `Unconfirmed` is invisible to the cashier's unpaid list | `patients.repository.ts:479`; `cashier-totals.ts:136-139` | Priority 1 | Day 4, D10 |
| 68 | Discount approval can reprice a Paid invoice, is never marked used, isn't guarded against double approval; duplicate Pending requests allowed | `payments.routes.ts:1854-2004` | Priority 1 | Day 9, D31 |
| 69 | No-charge only moves consultation items and leaves the invoice Unpaid | `payments.routes.ts:1417-1461` | Priority 1 | Day 10, D32 |
| 70 | Cashier selection is client-only; two cashiers can work one item; an encounter ID can be sent as `invoiceId` | `useCashierPayments.ts:642-705`, `:768` | Priority 1 | Day 5, D13 |
| 71 | No CHECK constraints or enums on state columns; near-duplicate and phantom values | `db.repo.ts` DDL | Priority 1 | Unscheduled — needs the migration runner (`.TODO`) |
| 72 | No unique index stopping two open queue items per encounter and queue type; no row locks | `db.repo.ts:946-956` | Priority 0 | Day 5, D13 and Day 6, D14 |
| 73 | Doctor feed omits `clinical_status`, so "Lab Results Ready" never shows | `patients.repository.ts:842-889`; `useDoctorQueue.ts:836` | Priority 1 | Kelechi — doctor side |
| 74 | Card replacement overwrites patient status with `History Refreshed` | `patients.repository.ts:980-981` | Priority 2 | Day 9, D26 |
