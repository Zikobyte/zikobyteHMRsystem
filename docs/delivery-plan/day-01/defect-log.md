# Day 1 defect log

Recorded 2026-10-10. These defects came out of the Day 1 inventories. **None were fixed on Day 1**: each is mapped to the day in the 15-day plan (`docs/internal/Taiwo_Deliverables.docx`, `Kelechi_Deliverables.docx`) that already owns the fix, so no fix is done twice or ahead of the kobo cutover. Defects with no slot are marked **Unscheduled** and need an owner at the Day 7 review.

Priority 0 means it loses or misroutes money or clinical data, or blocks a core flow. Priority 1 means wrong but recoverable. Priority 2 means cleanup.

## Registration and OPD

| # | Defect | Where | Priority | Planned fix |
| --- | --- | --- | --- | --- |
| 1 | Unidentified emergency sends phone "Unknown" and is always rejected | `views/opd/_hooks/useRegistrationForm.ts:502-504` | Priority 0 | Day 4, D05 (emergency intake contract) |
| 2 | "Eye Clinic" card option offered but always rejected by the validator | intake forms; `useRegistrationForm.ts:411` | Priority 1 | Day 4, D25 (registration contract mismatch) |
| 3 | `duplicatesFound` not cleared on a no-match response, so submit can stay blocked | `useRegistrationForm.ts:322` | Priority 1 | Day 4, D18 |
| 4 | Single registration has no transaction; failures leave partial records | `patients.repository.ts:158` onwards | Priority 0 | Day 6, D02 |
| 5 | Family/Company category dropped for Maternity and Emergency | `useRegistrationForm.ts:419-430` | Priority 1 | Day 9, D24 |
| 6 | Returning view reads `history.outstanding`; server returns `outstandingBalances` | `ReturningPatientView.tsx:340`; `patients.routes.ts:577` | Priority 1 | Day 3, D23 |
| 7 | No validation of email, enums, lengths, vitals, maternity fields, Female check | `patients.validator.ts` | Priority 1 | Day 8, D17 |
| 8 | Emergency fee 0 on patient/card vs 5000 on invoice when no flag is set | `patients.service.ts:53-65`; `patients.repository.ts:453-479` | Priority 1 | Unscheduled — fold into the kobo cutover |
| 9 | Maternity fee 5000 vs 3000 + 2000 cards vs 8000 invoice; constants drift from catalogue | `patients.constants.ts`; `patients.repository.ts:297-299` | Priority 1 | Day 7 E02 check; fix with the kobo cutover |
| 10 | Default phone `08000000000` causes false duplicate blocks | `patients.validator.ts:15-31` | Priority 1 | Day 4, with D05 |
| 11 | Server trusts client `hospitalNumber`, `registeredBy`, `registrationDate` | `patients.repository.ts:173-175`, `patients.service.ts:71` | Priority 1 | Unscheduled |
| 12 | Duplicate rule differs between server (exact phone string) and frontend (digits) | `patients.repository.ts:996-1025`; `useRegistrationForm.ts:343-353` | Priority 2 | Day 8, D17 |
| 13 | Duplicate registration returns 400, not 409; raw database errors returned to client | `patients.controller.ts:70-75` | Priority 2 | Unscheduled |
| 14 | No role check on family deposit, encounters, re-queue, history, patient list, prices, families, companies, invoices | `patients.routes.ts:20-21`, `:455`, `:1151` | Priority 0 | Unscheduled — security; needs owner |
| 15 | Two encounter-queueing paths; `/:id/re-queue` sends no broadcast | `patients.routes.ts:1151` | Priority 1 | Day 9, D22 (returning-visit policy) |
| 16 | Raw fetch skips token-expiry handling | `ExportButton.tsx:112`, `PatientDetailModal.tsx:52` | Priority 2 | Unscheduled |
| 17 | OPD staff get a silent 403 on `/payments/outstanding*` and see empty debts | `AdmissionsView.tsx`, `PendingBalanceModal.tsx` | Priority 1 | Day 9, D23 |
| 18 | Triage tab unreachable for nurses; route `departments` field unused | `lib/routing/navigation.ts` | Priority 1 | Unscheduled |
| 19 | Admissions view treats a triage row as an admission | `components/AdmissionsView.tsx` | Priority 1 | Day 9, D27 |
| 20 | OPD has no live refresh (no WebSocket, no polling) | `views/opd/**` | Priority 2 | Unscheduled |

## Cashier and payments

BE = `src/backend/routes/payments/payments.routes.ts`.

| # | Defect | Where | Priority | Planned fix |
| --- | --- | --- | --- | --- |
| 21 | `/partial` marks every invoice for the patient (`patient_id = $1 OR id = $2`) | BE:1793-1795 | Priority 0 | Day 3, D08 |
| 22 | Generic payment and confirmation clear other cashier rows for the patient | BE:840 onwards, BE:147 onwards | Priority 0 | Day 3, D07 |
| 23 | Lab UI picks the first Unpaid invoice matching encounter or patient | `LabPaymentsTab.tsx:154-164` | Priority 0 | Day 3, D28 |
| 24 | POST `/payments` never compares amount with the invoice; client sets `status`; browser guesses totals | BE:840-937, BE:854; `useCashierPayments.ts:661-681` | Priority 0 | Day 3, D07, and Day 10, D28 |
| 25 | `/patients/opd/queue/:id/route` doesn't exist; partial lab payments never reach the lab | `useCashierPayments.ts:232` | Priority 0 | Day 4, D09 |
| 26 | Emergency handover confirmation marks Paid without comparing to the invoice | BE:147 onwards | Priority 0 | Day 4, D10 |
| 27 | Settlement uses client `patientId`, checks the balance outside the transaction | BE:1597-1658 | Priority 0 | Day 4, D11, and Day 5, D13 |
| 28 | `confirm-walk-in` updates every Unconfirmed payment for the patient | BE:743 | Priority 0 | Day 3, with D07 |
| 29 | Walk-in lab creates an Unconfirmed full-amount payment that can be confirmed as cash collected | BE:516-521; `DepartmentHandoverPanel.tsx` | Priority 0 | Day 10, D30 |
| 30 | RecordPaymentForm walk-in branch omits `patientId` and gets 400 | `useCashierPayments.ts:751-759` | Priority 1 | Day 10, D30 |
| 31 | `/partial` falls back to client `totalBill` | BE:1712 | Priority 0 | Day 3, D08 |
| 32 | Discount `originalAmount` from client; approval overwrites invoice amount; can miss the invoice | BE:1854-2004 | Priority 0 | Day 9, D31 (also `.TODO` "Automatic discount application") |
| 33 | Cashiers see Approve/Reject buttons that return 403; HR sees an empty list | `DiscountsTab.tsx:151-168`; BE:1938 | Priority 1 | Day 9, D31 |
| 34 | Idempotency support exists but the frontend never sends keys | BE:75-110 | Priority 0 | Day 6 (money submissions) |
| 35 | Eye payment verify has no role check; failures still mark paid locally; no ledger row | `patients.routes.ts:1063`; `useCashierPayments.ts:321-373` | Priority 0 | Unscheduled — needs owner (relates to `.TODO` "Eye billing unification") |
| 36 | Maternity supply balance writes only to the in-memory cache | `nursing.routes.ts:1314` | Priority 0 | Unscheduled — needs owner |
| 37 | Balance day stores nothing and totals all time | `BalanceDayModal.tsx`; `cashier-totals.ts:80` | Priority 1 | Unscheduled ("day locked" is a Day 2 matrix state) |
| 38 | No expense-voucher feature (only Payment Vitae, free-text approver) | `VitaeTab.tsx`; `useCashierPayments.ts:122-130` | Priority 1 | Unscheduled — confirm requirement |
| 39 | Exact-match cashier role check saves Account Officer/Accountant payments as Unconfirmed | BE:853 | Priority 1 | Unscheduled |
| 40 | No role check on `/patients/opd/invoices` and GET `/hr/procurements` | `patients.routes.ts`; `hr.routes.ts:798` | Priority 1 | Unscheduled — security |
| 41 | No transaction around no-charge, Payment Vitae, discount approval, maternity balance | BE:1417, BE:1344, BE:1960 | Priority 1 | Day 5, D13 (concurrency) |
| 42 | Money field names and units inconsistent (`amount`/`amountPaid`/`paymentAmount`/`totalBill`), naira floats | across payments | Priority 1 | Kobo cutover (`.TODO`), before Day 3 |
| 43 | `collected_by` holds user ID in some handlers, username in others | BE:179, 744, 750, 889, 1648, 1763 | Priority 2 | Kobo cutover or Day 10 |
| 44 | No-charge cost 0 allowed by browser, rejected by server | `useCashierPayments.ts:909`; BE:1423 | Priority 2 | Day 10, D32 |
| 45 | Dead `handleSettleOutstanding` code | `useCashierPayments.ts:79-82`, `:402` | Priority 2 | Day 4, D11 (remove while touching settlement) |
