-- Existing-data integrity checks (Q1–Q12) from the database evaluation, 2026-10-10.
-- See qa-db-evaluation.md. READ-ONLY. Run only against a RESTORED COPY, never the live database:
--   BEGIN READ ONLY; SET LOCAL statement_timeout = '60s'; <query>; ROLLBACK;
-- Output is internal ids only (no names, phone numbers or hospital numbers).
-- Not yet run; record counts in qa-db-evaluation.md once executed.

-- Q1 Duplicate open queue items per encounter + queue_type
SELECT encounter_id, queue_type, COUNT(*) AS n,
       array_agg(id ORDER BY arrival_time) AS item_ids,
       array_agg(status ORDER BY arrival_time) AS statuses,
       MIN(arrival_time) AS first_at, MAX(arrival_time) AS last_at
FROM zmc_patient_queue
WHERE status IN ('Waiting','Processing')
GROUP BY encounter_id, queue_type
HAVING COUNT(*) > 1
ORDER BY n DESC;

-- Q2 More than one Owing debt per invoice (and per encounter when invoice is NULL)
SELECT invoice_id, encounter_id, patient_id, COUNT(*) AS debts, SUM(balance) AS total_balance,
       array_agg(id ORDER BY created_at) AS debt_ids
FROM zmc_outstanding_balances
WHERE status = 'Owing'
GROUP BY invoice_id, encounter_id, patient_id
HAVING COUNT(*) > 1;

-- Q2b Owing debts whose balance disagrees with invoice amount minus Completed payments
SELECT ob.id, ob.invoice_id, ob.balance AS debt_balance,
       i.amount - COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'Completed'), 0) AS computed_balance
FROM zmc_outstanding_balances ob
JOIN zmc_invoices i ON i.id = ob.invoice_id
LEFT JOIN zmc_payments p ON p.invoice_id = i.id
WHERE ob.status = 'Owing'
GROUP BY ob.id, ob.invoice_id, ob.balance, i.amount
HAVING ob.balance <> i.amount - COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'Completed'), 0);

-- Q3 Invoices Paid (or Partially Paid) with Completed payments below the amount
-- Rows with paid_linked = 0 and paid_unlinked = 0 are the likely victims of the
-- patient_id OR predicate (payments.routes.ts:1793/1795).
WITH by_inv AS (
  SELECT invoice_id, SUM(amount) AS paid FROM zmc_payments
  WHERE status = 'Completed' AND invoice_id IS NOT NULL GROUP BY invoice_id),
by_enc_unlinked AS (
  SELECT encounter_id, SUM(amount) AS paid FROM zmc_payments
  WHERE status = 'Completed' AND invoice_id IS NULL AND encounter_id IS NOT NULL GROUP BY encounter_id)
SELECT i.id, i.status, i.encounter_id, i.amount,
       COALESCE(b.paid, 0) AS paid_linked,
       COALESCE(u.paid, 0) AS paid_unlinked_same_encounter,
       i.amount - COALESCE(b.paid, 0) AS shortfall_linked
FROM zmc_invoices i
LEFT JOIN by_inv b ON b.invoice_id = i.id
LEFT JOIN by_enc_unlinked u ON u.encounter_id = i.encounter_id
WHERE i.status IN ('Paid','Partially Paid')
  AND COALESCE(b.paid, 0) < i.amount
ORDER BY shortfall_linked DESC;

-- Q4 Encounters payment_status Paid with no Completed payment
-- Expect many from createEncounter inserting 'Paid' (patients.repository.ts:735); group by visit_type to size gap 49.
SELECT e.id, e.visit_type, e.destination_clinic, e.clinical_status, e.created_at
FROM zmc_encounters e
WHERE e.payment_status = 'Paid'
  AND NOT EXISTS (
    SELECT 1 FROM zmc_payments p
    WHERE p.status = 'Completed'
      AND (p.encounter_id = e.id
           OR p.invoice_id IN (SELECT i.id FROM zmc_invoices i WHERE i.encounter_id = e.id)))
ORDER BY e.created_at;

-- Q5 Payments re-booked from old emergency cash (gap 50, patients.repository.ts:789-809)
WITH er AS (
  SELECT DISTINCT ON (patient_id) patient_id, cash_collected
  FROM zmc_emergency_records WHERE cash_collected > 0
  ORDER BY patient_id, recorded_at DESC)
SELECT pay.patient_id, er.cash_collected,
       COUNT(*) AS rebooked_rows,
       COUNT(*) FILTER (WHERE pay.status = 'Completed') AS confirmed_rows,
       SUM(pay.amount) FILTER (WHERE pay.status = 'Completed') AS revenue_double_counted,
       array_agg(pay.id ORDER BY pay.date_paid) AS payment_ids
FROM zmc_payments pay
JOIN er ON er.patient_id = pay.patient_id
WHERE pay.amount = er.cash_collected
  AND pay.invoice_id IS NULL              -- re-book path inserts invoice_id NULL
  AND pay.description IS NULL             -- original intake row carries a description
  AND pay.payment_method = 'Cash'
GROUP BY pay.patient_id, er.cash_collected;

-- Q5b Any patient with more than one Unconfirmed payment of identical amount (wider net)
SELECT patient_id, amount, COUNT(*) AS n, array_agg(id) AS ids
FROM zmc_payments WHERE status = 'Unconfirmed'
GROUP BY patient_id, amount HAVING COUNT(*) > 1;

-- Q6 Clinical rows lost to card replacement or PATCH null (gaps 55, 75).
-- Deletes leave no tombstone, so this is indirect evidence only. Cross-tabulate 6b–6d with 6a
-- to separate card-replacement loss from PATCH-null loss. Only a pre-deletion backup can recover data.
-- 6a affected patients
SELECT r.patient_id, MIN(r.created_at) AS first_replacement, COUNT(*) AS replacements
FROM zmc_clinical_card_replacements r WHERE r.history_refreshed GROUP BY r.patient_id;
-- 6b triage evidently happened (Nursing item Completed) but no vitals row exists for that encounter
SELECT q.patient_id, q.encounter_id, q.processed_at
FROM zmc_patient_queue q
WHERE q.queue_type = 'Nursing Front-Desk' AND q.status = 'Completed'
  AND NOT EXISTS (SELECT 1 FROM zmc_patient_vitals v WHERE v.encounter_id = q.encounter_id);
-- 6c maternity-card patients with no maternity record
SELECT p.id FROM zmc_patients p
WHERE (p.maternity_number IS NOT NULL OR p.card_type = 'Maternity')
  AND NOT EXISTS (SELECT 1 FROM zmc_maternity_records m WHERE m.patient_id = p.id);
-- 6d emergency encounters with no emergency record
SELECT DISTINCT e.patient_id FROM zmc_encounters e
WHERE (e.clinical_status = 'In Emergency Care' OR e.priority = 'Emergency' OR e.visit_type ILIKE '%Emergency%')
  AND NOT EXISTS (SELECT 1 FROM zmc_emergency_records er WHERE er.patient_id = e.patient_id);

-- Q7 Vocabulary actually stored (input to CHECK design)
SELECT 'queue.status' col, status v, COUNT(*) FROM zmc_patient_queue GROUP BY 2
UNION ALL SELECT 'queue.queue_type', queue_type, COUNT(*) FROM zmc_patient_queue GROUP BY 2
UNION ALL SELECT 'enc.clinical_status', clinical_status, COUNT(*) FROM zmc_encounters GROUP BY 2
UNION ALL SELECT 'enc.payment_status', payment_status, COUNT(*) FROM zmc_encounters GROUP BY 2
UNION ALL SELECT 'enc.priority', priority, COUNT(*) FROM zmc_encounters GROUP BY 2
UNION ALL SELECT 'inv.status', status, COUNT(*) FROM zmc_invoices GROUP BY 2
UNION ALL SELECT 'pay.status', status, COUNT(*) FROM zmc_payments GROUP BY 2
UNION ALL SELECT 'ob.status', status, COUNT(*) FROM zmc_outstanding_balances GROUP BY 2
UNION ALL SELECT 'disc.status', status, COUNT(*) FROM zmc_discount_requests GROUP BY 2
ORDER BY 1, 3 DESC;

-- Q8 visit_number collisions
SELECT patient_id, visit_number, COUNT(*) FROM zmc_encounters GROUP BY 1,2 HAVING COUNT(*) > 1;

-- Q9 duplicate idempotency keys
SELECT idempotency_key, COUNT(*) FROM zmc_payments WHERE idempotency_key IS NOT NULL GROUP BY 1 HAVING COUNT(*) > 1;

-- Q10 orphan references (block VALIDATE of NOT VALID foreign keys)
SELECT 'ob.invoice' k, COUNT(*) FROM zmc_outstanding_balances ob WHERE invoice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM zmc_invoices i WHERE i.id = ob.invoice_id)
UNION ALL SELECT 'ob.encounter', COUNT(*) FROM zmc_outstanding_balances ob WHERE encounter_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM zmc_encounters e WHERE e.id = ob.encounter_id)
UNION ALL SELECT 'disc.invoice', COUNT(*) FROM zmc_discount_requests d WHERE invoice_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM zmc_invoices i WHERE i.id = d.invoice_id)
UNION ALL SELECT 'pay.no_invoice', COUNT(*) FROM zmc_payments WHERE invoice_id IS NULL
UNION ALL SELECT 'inv.no_patient', COUNT(*) FROM zmc_invoices WHERE patient_id IS NULL;

-- Q10b payments whose patient/encounter disagree with their invoice (gap 61 fallout)
SELECT p.id FROM zmc_payments p JOIN zmc_invoices i ON i.id = p.invoice_id
WHERE i.patient_id IS DISTINCT FROM p.patient_id
   OR (p.encounter_id IS NOT NULL AND i.encounter_id IS DISTINCT FROM p.encounter_id);

-- Q11 duplicate Pending discount requests per invoice
SELECT invoice_id, COUNT(*) FROM zmc_discount_requests WHERE status = 'Pending' GROUP BY 1 HAVING COUNT(*) > 1;

-- Q12 rows moved by refreshCache (gap 46): Doctor item while the encounter is still pre-triage
SELECT q.id, q.encounter_id, q.arrival_time, e.clinical_status
FROM zmc_patient_queue q JOIN zmc_encounters e ON e.id = q.encounter_id
WHERE q.queue_type = 'Doctor Consultation' AND q.status IN ('Waiting','Processing')
  AND e.clinical_status IN ('Pending Vitals','Waiting for Vitals')
  AND NOT EXISTS (SELECT 1 FROM zmc_patient_vitals v WHERE v.encounter_id = q.encounter_id);
