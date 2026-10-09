# Registration contract — Day 1

Owner: Taiwo. Recorded 2026-10-10. States exactly what the registration API accepts and rejects for Standard, Maternity and Emergency, as the code behaves today. Paths are under `src/backend/routes/patients/` unless noted.

## Endpoints

| Endpoint | Roles | Validation | Handler |
| --- | --- | --- | --- |
| `POST /api/patients` | OPD Clerk, Receptionist, Records Officer, IT Admin, Admin, Mgmt, Doctor, Nurse, Head Nurse, Cashier, Eye Clinic, Account Officer (`patients.routes.ts:1211`) | `validateCreatePatient` (`patients.validator.ts:78`) | `controller.create` → `service.registerPatient` (`patients.service.ts:31`) → `repository.create` (`patients.repository.ts:158`) |
| `POST /api/patients/bulk` | same list (`patients.routes.ts:1187`) | per row, inside the service (`patients.service.ts:105`) | `controller.bulkCreate` |

All routes need a valid JWT. Auth failures return 401 (`Unauthorized access. Authentication token is missing or invalid.` / `Session expired, please login again`) or 403 (`Access denied. You do not have permission for this department or action.`).

## Shared rules (all three types)

Checked in this order; the first failure returns **400** `{success:false, error}` (`patients.validator.ts:11-76`).

| Field | Accepted | Rejection message |
| --- | --- | --- |
| `name` | string, at least 2 characters after trimming | `Patient full name is required and must be at least 2 characters.` |
| `dateOfBirth` | parseable date | `Valid Date of Birth is required` |
| | not after today | `Date of Birth cannot be in the future. Please enter a valid birth date.` |
| | not before 1900-01-01 | `Date of Birth cannot be earlier than year 1900.` |
| `gender` | `Male`, `Female`, `Other` | `Gender must be Male, Female, or Other` |
| `phoneNumber` | 7–15 digits after stripping non-digits | `A valid and complete phone number (at least 7 digits) is required.` |
| `address` | non-empty after trimming | `Address is required` |
| `cardType` | `Standard`, `Maternity`, `Emergency` | `Card type must be Standard, Maternity, or Emergency` |

**Duplicate check** (`patients.service.ts:38-44`, `patients.repository.ts:996-1025`): blocks when an existing patient has the same name (case-insensitive, trimmed) **or** the identical phone string. Skipped for `Unidentified Emergency Patient`. Returns **400** (not 409): `Registration Blocked: Patient record already exists for "<name>" (Hospital Number: <hn>). Duplicate registration is not permitted. Please use their existing file.`

Any other error, including raw PostgreSQL errors, comes back as 400 with the raw message (`patients.controller.ts:70-75`). Success is 201 `Patient registered successfully`.

## Accepted without validation

- **Stored as sent, no format/enum/length check:** `email`, `maritalStatus`, `idType`, `idNumber`, `nextOfKin*`, `broughtInBy*`. Values longer than the column fail at the database.
- **`vitals`:** written to `zmc_patient_vitals` whenever the object is present, even empty; not type-checked.
- **Billing category:** `patientCategory` (`Family`/`Company`), `familyName`, `familyRelationship` (default `Dependent`), `companyName`, `employeeId`, `designation`, `letterReference`.
- **Trusted from the client:** `hospitalNumber` replaces the generated `ZMC-YYYY-NNNN`; `registeredBy` (and `requestedBy` on bulk) records whatever the client says; `registrationDate`.
- **Ignored:** `cardFee` (server overwrites), `status` (overwritten later), `letterVerified`.

## Per type

| | Standard | Maternity | Emergency |
| --- | --- | --- | --- |
| Extra rules | none | none — gender isn't forced to Female, `maternityDetails` isn't required, LMP/EDD aren't checked | when `patientCanProvideDetails === false`, missing fields default to name `Unidentified Emergency Patient`, DOB today, gender `Male`, phone `08000000000`, address `Emergency Trauma Scene` (`patients.validator.ts:15-31`) |
| Extra payload | — | `maternityDetails` (gravida, para, lmp, edd, gestationalAge, tribe, occupation, abortion, premature) → `zmc_maternity_records` | `emergencyDetails` (isSickEmergency, isUnbookedLabour, isAccident, isDoctorOnCall, isAfterHours, customDetails, cashCollected, doctorOnCallName) |
| `zmc_patients.card_fee` | 3000 (`CARD_FEES`, `patients.constants.ts`) | 5000 | 25,000 / 50,000 / 50,000 / 5,000 by flag; **0 when no flag is set** |
| Other identifiers | — | `maternity_number` = hospital number with `ZMC` → `MAT` | — |
| `zmc_clinical_cards` | one card | **two cards, hardcoded 3000 + 2000** | one card (fee can be 0) |
| `zmc_encounters` | General Outpatient Consultation, Normal, Unpaid, Waiting for Vitals | Antenatal Consultation, otherwise same | Emergency Medicine Registration, priority Emergency, In Emergency Care; payment `Unconfirmed` if cash > 0 else `Unpaid` |
| `zmc_invoices` | `CLINICAL_CARD_STANDARD` (3000) + `CONSULTATION_GENERAL` (2000), Unpaid | `CLINICAL_CARD_MATERNITY` (5000) + `CONSULTATION_MATERNITY` (3000) = 8000 | flag total, **minimum 5000**; `Unconfirmed` if cash ≥ total else `Unpaid` |
| `zmc_payments` | — | — | if cash > 0: Cash, Unconfirmed, capped at the total |
| `zmc_patient_queue` | Nursing Front-Desk, Waiting | same | Doctor Consultation, Emergency |
| Final patient status | Triage Pending | Triage Pending | Emergency Dispatched |
| `zmc_emergency_records` | only if `emergencyDetails` is sent — then the **client's** `totalBillAmount`/`cashCollected` are stored | same | server-computed total and cash; **no row if `emergencyDetails` is omitted** |
| Family deduction | −3000 hardcoded from the family account; invoice stays Unpaid | — | — |
| Broadcasts | `PATIENT_REGISTERED` to Nurse and Cashier | same | same, plus `EMERGENCY_PATIENT_ARRIVED` to Doctor (not on bulk) |

Registration writes straight to PostgreSQL; it doesn't touch the in-memory cache.

**Bulk:** `rows` must be a non-empty array of at most 200 objects (`Request body must include a non-empty "rows" array of patient payloads.`, `Bulk import is limited to 200 rows per request (received N). Split the file and retry.`, `Row must be a create-patient object.`). Rows run in one transaction with a savepoint each; partial success commits and returns 201; all rows failing returns 400 `Bulk import failed: all N row(s) rejected. …`.

## Gaps

Scheduled fixes are in [defect-log.md](defect-log.md).

1. **Unidentified emergency always fails from the OPD form.** It sends `phoneNumber: phoneNumber || "Unknown"` (`views/opd/_hooks/useRegistrationForm.ts:502-504`); the server only defaults an *empty* phone, so "Unknown" fails the digit check. Existing tests omit the phone, so they miss it. (D05)
2. **"Eye Clinic" card option always fails.** All three intake forms offer it and send `cardType: "Eye Clinic"`, which the validator rejects. (D25)
3. **Family/Company billing is dropped for Maternity and Emergency.** The billing step shows on all three forms, but only the Standard payload includes the category fields (`useRegistrationForm.ts:419-430`). (D24)
4. **Single registration has no transaction.** A failure after the patient insert (bad LMP/EDD, non-numeric vitals, card-number clash) leaves a partial record and returns the raw database error. (D02)
5. **Emergency fee disagreement:** with no flags, patient row and card show 0, invoice shows 5000, and the cashier broadcast reads `Card Fee: N0`. The frontend requires 5000 minimum cash; the server doesn't.
6. **Maternity fee disagreement:** 5000 on the patient row, 3000 + 2000 on the cards, 8000 on the invoice. Card-fee constants drift from the catalogue.
7. **Default phone causes false duplicates:** a named emergency patient without a phone gets `08000000000`, which then blocks the next one.
8. **Duplicate rules differ:** the server compares the exact phone string, the frontend compares digits; two different people with the same full name are always blocked.
9. **Missing validation:** email format, enums for marital status/ID type/relationships, field lengths, vitals ranges and units, maternity fields, Female/age check for Maternity. (D17)

## Test coverage

Only `tests/backend/patients-bulk.test.ts` touches registration (validator only, no database): valid row, blank name, future DOB, short phone, missing card type, unidentified-emergency defaults, ignored `cardFee`, non-object rows, all-rows-rejected. Not covered: invalid card types such as "Eye Clinic", invalid gender, the 1900 bound, the "Unknown" phone, the duplicate check, Maternity/Emergency behaviour, database side effects, and the `POST /` route itself. There are no frontend registration tests.
