# Cashier inventory — Day 1

Shared by Taiwo and Kelechi — **Kelechi to review**. Recorded 2026-10-10.

- FE = `src/frontend/views/cashier/`, BE = `src/backend/routes/payments/payments.routes.ts` (mounted at `/api/payments`; every route requires login).
- All cashier calls use `apiFetch`; no raw fetch.
- Role checks: Administrator, IT Administrator, Management and Super Administrator pass everything; a route allowing Cashier also admits Account Officer and Accountant (`src/backend/middleware/auth.middleware.ts:51-78`).
- **Money today is naira** in `NUMERIC(12,2)`/`DECIMAL(10,2)` columns, handled as JavaScript floats. No `*100`, `/100` or `toFixed` in the cashier frontend; the only backend `/100` is the percentage discount (BE:1881). See the kobo reminder in `.TODO`.

## Surfaces

| Surface | UI (file:line) | API | Handler | Roles | Tables written | Money fields |
| --- | --- | --- | --- | --- | --- | --- |
| Generic payment (full) | `_components/RecordPaymentForm.tsx:241` → `_hooks/useCashierPayments.ts:761`; lab full path `:240` | POST `/payments` | BE:840 | Cashier, Admin, Mgmt, Lab Scientist, Nurse, Receptionist, Doctor | payments, invoices (Paid), encounters, patient_queue, lab_payments, patients | `amount` — never compared with the invoice; `status` taken from client |
| Partial payment | same form when amount < `selectedTotalBill` (`useCashierPayments.ts:733`); lab partial `:218` | POST `/payments/partial` | BE:1694 | Cashier, Receptionist, Records Officer, Admin, Mgmt | payments (`amount`, `total_bill`, `balance`), outstanding_balances, invoices, patient_queue, `patients.outstanding_balance` | `totalBill`, `amountPaid`; server uses the invoice amount if found, else the client's `totalBill` (BE:1712) |
| Lab payments (queue) | `_tabs/LabPaymentsTab.tsx:326` → `useCashierPayments.ts:193` | POST `/payments` or `/payments/partial`, then POST `/patients/opd/queue/:id/route` | the route call has **no backend route**; error swallowed | — | — | total = first Unpaid invoice matching encounter **or patient** (LabPaymentsTab:154-164); 0 if none |
| Lab history (read) | LabPaymentsTab history | GET `/payments/lab-history` | BE:1487 | Cashier, lab roles | — | `amount`, `tests_summary` |
| Walk-in labs | `_tabs/WalkInVerifyTab.tsx:400` → `useCashierPayments.ts:575`; also RecordPaymentForm walk-in branch `:751` | POST `/payments/lab/confirm-walk-in`; list GET `/payments/lab/walk-in` (BE:559) | BE:690 | Cashier, Account Officer, lab roles, Admin, IT Admin, Mgmt | payments, invoices, encounters, patients, patient_queue, lab_payments, outstanding_balances | `amount` tendered; total read from the invoice (client `totalBill`/`totalAmount` ignored) |
| Debts | `_tabs/OutstandingTab.tsx:236` → `handleRecordRowPayment` (`useCashierPayments.ts:472`) | POST `/payments/outstanding/settle`; GET `/payments/outstanding` (BE:1510) | BE:1597 | Cashier, Admin, Mgmt | outstanding_balances, payments, `patients.outstanding_balance` | sends `paymentAmount`; reads `balance`, `total_bill`; server caps at stored balance (BE:1616) |
| Discount request | `RecordPaymentForm.tsx:217` → `_modals/DiscountModal.tsx:95` → `_hooks/useCashierDiscounts.ts:93` | POST `/payments/discount-request` | BE:1854 | Cashier, Receptionist, Records Officer, Admin, Mgmt, **Doctor, Nurse** | discount_requests | `originalAmount` from client; server derives `calculated_discount`, `final_amount` |
| Discount approve / reject | `_tabs/DiscountsTab.tsx:155/164` → `useCashierDiscounts.ts:158/181` | POST `/payments/discount-requests/:id/approve`, `/reject`; list GET (BE:1936) | BE:1960 / BE:2032 | HR roles, Admin, Mgmt, IT Admin (not Cashier) | discount_requests; `invoices.amount` set to `final_amount` | `final_amount`, `original_amount`, `discount_value` |
| No-charge | `_tabs/NoChargeTab.tsx:65` → `useCashierPayments.ts:906` | POST/GET `/payments/no-charge` | BE:1417 | Cashier, Admin, Mgmt | no_charge_records, patient_queue, encounters (`No Charge (Approved)`), patients | `treatmentCost` |
| Expense vouchers | **Not found as a feature.** Nearest is Payment Vitae (daily expenses): `_tabs/VitaeTab.tsx:53` → `useCashierPayments.ts:851` | POST/GET `/payments/vitae` | BE:1344 / BE:1318 | Cashier, Admin, Mgmt | payment_vitae | `amount`; only checks it's present |
| Maternity supply handover | `MaternitySuppliesCashierView.tsx:107-140` (in `_tabs/MaternitySuppliesTab.tsx`) | POST `/nursing/maternity-supplies/:id/balance`; GET `/nursing/maternity-supplies` | `nursing/nursing.routes.ts:1314` / `:1295` | Cashier | **in-memory cache only** — no PostgreSQL write | `total_amount`; item `amount ?? price ?? default_price` |
| Department handover (confirm unconfirmed cash) | `_components/DepartmentHandoverPanel.tsx:86` → `useCashierPayments.ts:137` | POST `/payments/:id/confirm` | BE:147 | Cashier, Admin, Mgmt | payments, invoices (Paid), encounters, patient_queue, patients | stored `amount`; not compared with the invoice |
| Eye registrations | `_tabs/EyeRegistrationsTab.tsx:182` → `useCashierPayments.ts:321` | POST `/patients/eye-clinic/verify-payment`; GET `/patients/eye-clinic/patients` | `patients/patients.routes.ts:1063` / `:622` | **login only** | eye_patients only; nothing in payments | `amount`, default 3000 on both sides |
| Procurement queue (read) | `_tabs/ProcurementQueueTab.tsx` → `_hooks/useCashierData.ts:324` | GET `/hr/procurements` | `hr/hr.routes.ts:798` | **login only** | — | `amount` |
| Pending-all (read) | `_tabs/PendingAllTab.tsx` | none (from `useCashierData.ts:205-243`) | — | — | — | sums `invoice.amount \|\| total` (`_utils/cashier-totals.ts:154`) |
| Balance day | `_components/CashierHeader.tsx:99` → `_modals/BalanceDayModal.tsx` | **none** — "Print & Lock" only shows a message | **not found** | — | — | collected − expenses over **all time** |

Initial load (`useCashierData.ts:205-243`): GET `/patients`, `/payments` (BE:1287), `/users`, `/patients/opd/queue`, `/patients/opd/invoices` (no role check).

localStorage: `zmc_eye_patients_new` and `zmc_eye_registrations_queue` (eye verification), `zmc_user`.

## Findings

Each is also in [defect-log.md](defect-log.md) with a planned day.

**Server trusts the client's totals**
1. POST `/payments` never compares `amount` with the invoice; "full vs partial" is decided in the browser (`useCashierPayments.ts:732`), yet the server marks invoice and encounter Paid. With no invoice, the total is a browser guess: 5000 / 8500 / 5000 / pending-balance suggestion (`useCashierPayments.ts:661-681`).
2. `/partial` falls back to the client's `totalBill` (BE:1712).
3. Discount `originalAmount` comes from the browser and is never checked; approval overwrites `invoices.amount`. If the reference holds an encounter ID, approval updates nothing.
4. POST `/payments` accepts `status` from the request body (BE:854).

**Writes reach the wrong rows**
5. `/partial` updates **every invoice for the patient**: `WHERE patient_id = $1 OR id = $2` (BE:1793-1795). (D08)
6. `confirm-walk-in` updates every Unconfirmed payment for the patient (BE:743).
7. `/outstanding/settle` uses the client's `patientId` for the payment row and roll-up, and checks the balance outside the transaction (BE:1605-1658). (D11, D13)

**Broken or missing paths**
8. RecordPaymentForm's walk-in branch omits `patientId` (`useCashierPayments.ts:751-759`) and gets a 400.
9. POST `/patients/opd/queue/:id/route` doesn't exist; partial lab payments never reach the Laboratory queue or lab history. (D09)
10. Eye verification: on API failure the browser still marks the patient paid in localStorage and shows a fake payment; on success no `zmc_payments` row is written, so eye revenue is missing from the ledger.
11. Maternity supply balance writes only to the in-memory cache; `cashier_name`/`notes` are ignored.
12. Balance day persists nothing and totals all time; `getCompletedPayments` counts rows with no status (`cashier-totals.ts:80`).
13. `handleSettleOutstanding` (`useCashierPayments.ts:79-82`, `:402`) is dead code.
14. The idempotency support on `/` and `/partial` (BE:75-110) is unused; the frontend never sends `idempotencyKey`. (Day 6)

**Duplicate payment paths**
15. A walk-in lab can be paid three ways: WalkInVerifyTab, RecordPaymentForm, and DepartmentHandoverPanel. The third works because POST `/payments/lab/walk-in` creates an Unconfirmed payment for the **full** invoice that nobody collected (BE:516-521); confirming it books the full amount as collected.
16. Lab routing happens in both POST `/` (BE:994-1093) and `/:id/confirm` (BE:~240-300).

**Field names and conventions** (inputs to the kobo plan)
17. Amount is called `amount`, `amountPaid`, `paymentAmount`, `totalBill` or `totalAmount` depending on the endpoint.
18. `collected_by` stores a user ID in some handlers and a username in others; usernames display as "Cashier Desk".
19. The discount list is returned as `discountRequests`, everything else as `data`. Payments are camelCase; outstanding, lab-history and discounts are snake_case.
20. No-charge: the browser allows a cost of 0, the server rejects it.
21. `confirm-walk-in` accepts any payment method string.

**Role checks**
22. DiscountsTab shows Approve/Reject to Cashiers, who get 403. (D31)
23. HR can reach `/discounts` but the list endpoint excludes HR, so it shows empty.
24. POST `/payments` decides "is cashier" by exact role name, so Account Officer, Accountant and IT Admin payments are saved as Unconfirmed.
25. No role check: `/patients/eye-clinic/verify-payment` (changes payment status), `/patients/opd/invoices`, GET `/hr/procurements`.
26. Doctors and nurses can request discounts; Payment Vitae and no-charge "approved by" is free text defaulting to "Dr. Alan Smith" (`useCashierPayments.ts:122-130`).
27. No transaction around no-charge, Payment Vitae, discount approval or maternity balance.
