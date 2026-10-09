# Shared vocabulary

**Status: DRAFT — needs agreement from Taiwo and Kelechi.** Proposed 2026-10-10.

For the rest of the 15-day plan, every bug report, ticket, test name and spec uses these eight words with exactly these meanings. If a word below doesn't fit a case, change this page first; don't invent a new word in a bug thread.

| Word | Meaning | Represented by | Don't say |
| --- | --- | --- | --- |
| **patient** | A person known to the hospital. One person has exactly one patient record and one hospital number (`ZMC-YYYY-NNNN`) for life; a returning person is never registered again. | `zmc_patients` | client, file (except for the physical folder), customer |
| **encounter** | One visit by one patient, from registration or re-queue until completion or discharge. A returning patient gets a new encounter, never a new patient. Every clinical record, invoice, payment and queue item belongs to exactly one encounter. | `zmc_encounters` | visit, case, consultation (a consultation is a service inside an encounter) |
| **service** | One priced item the hospital provides, identified by its catalogue code: clinical card, consultation, a lab test, a medication, an eye service, a procedure. | catalogue in `src/backend/catalogue/` | item, test (unless it's a lab test), fee |
| **invoice** | The charge for one or more services on one encounter. It has a total, an amount paid and a status. | `zmc_invoices` | bill, charge, receipt |
| **payment** | Money received against exactly one invoice, by one method, recorded by one person. It is Unconfirmed until a cashier confirms it. | `zmc_payments` | collection, deposit (a family deposit is account credit, not a payment) |
| **debt** | The unpaid remainder of an invoice that the patient was allowed to leave owing (partial payment, underpaid emergency). It points at the invoice it came from and is cleared by later payments. | `zmc_outstanding_balances` | outstanding, balance, arrears (as nouns) |
| **queue item** | One encounter waiting at one department or desk for one next action. An encounter has at most one active queue item per department. | `zmc_patient_queue` | ticket, entry, slot |
| **handover** | A transfer from another department to the cashier — cash collected elsewhere (emergency, walk-in lab) or supplies used (maternity) — that stays unconfirmed until the cashier accepts it. | Unconfirmed `zmc_payments` rows; maternity supply records | transfer, remittance |

## Rules that follow from the words

- A payment binds to **patient + encounter + invoice + service**. Never select or update by patient alone.
- An encounter moves between departments only by closing one queue item and opening the next.
- "Paid" is a property of an invoice, never of a patient or an encounter as a whole.
- A debt always names the invoice it came from; clearing a debt updates that invoice.

## Codebase names that map to these words

These names aren't changing today; they're listed so discussions can translate them.

| In the code | Means |
| --- | --- |
| `outstandingBalances`, `history.outstanding`, `outstanding_balance` on a patient | debt (and a per-patient total of debts) |
| `total_bill`, `totalBill`, `totalAmount`, `total_amount`, `amount` on an invoice | invoice total |
| `amount`, `amountPaid`, `paymentAmount`, `cash_collected` | payment amount |
| `discharge_bill` | invoice (the discharge invoice of an admission encounter) |
| Payment Vitae / PV | cashier expense (not one of the eight words; not money from patients) |
| visit (in UI text) | encounter |
