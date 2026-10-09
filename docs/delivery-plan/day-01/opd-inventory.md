# OPD inventory — Day 1

Owner: Taiwo. Recorded 2026-10-10. Lists every OPD route, tab, form and modal, with the API each one calls.

- Frontend paths are under `src/frontend/`; backend handlers are in `src/backend/routes/patients/patients.{routes,controller}.ts` unless noted.
- All frontend calls go through `apiFetch` unless marked **raw fetch**.
- `authorizeRoles` always admits Administrator, IT Administrator, Management and Super Administrator. "OPD group" means OPD Clerk, Receptionist and Records Officer.

## Routes and tabs

The route table is `lib/routing/routes.ts`. Access is decided by `isNavigationAllowed` in `navigation.ts`; `App.tsx` mounts `views/opd/OPDRegistrationView.tsx` when `view-plan.ts` resolves to `opd`.

| Path | Tab / sub-tab | Who can actually reach it |
| --- | --- | --- |
| `/opd`, `/patients` | patients / reception | opd, nurse, all |
| `/opd/reception`, `/opd/returning`, `/opd/admissions` | patients / reception, returning, admissions | anyone with `patients` (opd, nurse, all) |
| `/nursing/triage`, `/triage` | triage / nursing | **only `all`** (the tab maps to `nursing`, which no department list includes) |
| `/records` | records | opd, doctor, all |
| `/settings` | settings / catalog | it, all |

`_components/OpdHeader.tsx` hides some sub-tabs: nurses don't see reception, returning or admissions; Receptionist and Records Officer don't see nursing; replacements shows only when `canManageCardReplacements` passes.

## Entry points

| Entry point (file under `views/opd/` unless noted) | User action | API call | Backend handler | Role check |
| --- | --- | --- | --- | --- |
| Shell on load (`OPDRegistrationView.tsx`, `_hooks/*`) | Loads OPD data | GET `/patients` | `controller.getAll` | **none** |
| | | GET `/patients/opd/companies`, `/patients/opd/families` | `getCompanies`, `getFamilies` | **none** |
| | | GET `/patients/opd/queue` | `getQueue` | Doctor, Nurse, OPD group, Cashier, Lab, Pharmacist, Eye Clinic |
| | | GET `/patients/opd/prices` | `getPrices` | **none** |
| | | GET `/patients/opd/cards/replacements` (only if the role is allowed) | `getCardReplacements` | OPD group, Cashier |
| `_tabs/ReceptionTab.tsx` | Daily stats, search, row actions, per-row downloads | none; downloads are built in the browser (`_hooks/useOpdDownloads.ts`) | — | — |
| `components/shared/ExportButton.tsx` (in ReceptionTab) | Registry export | **raw fetch** GET `/api/exports?type=patients` (line 112) | `exports.routes.ts` GET `/` | in-code `checkExportPermission` only |
| `_components/OpdHeader.tsx` bulk download | Excel/Word/PDF of the filtered list | none (browser-built) | — | — |
| `_modals/RegistrationModal.tsx` (Standard/Maternity/Emergency forms, `_components/register/*`) | Register a new patient — see [registration-contract.md](registration-contract.md) | GET `/patients/opd/duplicates` (on blur) | `checkDuplicates` | same as queue |
| | | POST `/patients` (`_hooks/useRegistrationForm.ts:563`) | `controller.create`, broadcasts `PATIENT_REGISTERED` | OPD group, IT Admin, Admin, Mgmt, Doctor, Nurse, Head Nurse, Cashier, Eye Clinic, Account Officer |
| SuccessChecklistModal | Folder/card/receipt/triage checklist | none; "moved to Cashier queue" is UI text only | — | — |
| EncounterModal (Reception row) | Queue a visit | POST `/patients/opd/encounters` | `createEncounter`, broadcasts `ENCOUNTER_CREATED`, `PATIENT_ROUTED_TO_DOCTOR` | **none** |
| CardReplacementModal | Log a lost-card replacement | POST `/patients/opd/cards/replace` | `requestCardReplacement` (no broadcast) | OPD group, Cashier |
| FamilyDepositModal (handler in shell) | Top up a family account | POST `/patients/opd/families/deposit` | `addFamilyDeposit` | **none** (money write) |
| `_components/ReturningPatientView.tsx` | Search returning patients | GET `/patients/search/returning` | inline, `patients.routes.ts:422` | same as queue |
| | View history and debts | GET `/patients/:id/history` | inline, `patients.routes.ts:455` | **none** |
| | Re-queue | POST `/patients/:id/re-queue` | inline, `patients.routes.ts:1151` (no broadcast) | **none** |
| `components/PendingBalanceModal.tsx` | View or settle a debt | GET `/payments/outstanding/patient/:id` | `payments.routes.ts:1567` | Cashier, Account Officer, Accountant, admin roles |
| | | POST `/payments/outstanding/settle` | `payments.routes.ts:1598` | Cashier, Admin, Mgmt |
| `components/AdmissionsView.tsx` (admissions sub-tab) | Admissions and balance overview | GET `/patients/opd/queue`, `/payments/outstanding`, `/patients` (failures swallowed) | `getQueue`, `payments.routes.ts:1511`, `getAll` | outstanding is financial roles only |
| NursingQueueTab + VitalsModal | Record triage vitals | POST `/patients/opd/queue/vitals` | `recordOPDVitals`, broadcasts `VITALS_RECORDED` | Nurse, OPD group, Doctor |
| EscalatePriorityModal | Raise queue priority | POST `/patients/opd/queue/priority` | `updateEncounterPriority`, broadcasts `PRIORITY_UPDATED` | Doctor, Nurse, OPD group |
| CatalogTab + PriceEditModal | View or edit prices | POST `/patients/opd/prices` | `updatePrice` | Admin, IT Admin, Mgmt |
| `_tabs/RecordsTab.tsx` | Archive search, export | **raw fetch** GET `/api/exports?type=patients` and `?type=medical-records` | exports GET `/` | in-code check only |
| ReplacementsTab | Read-only replacement log | none (data from shell) | — | — |
| `components/patient-detail/PatientDetailModal.tsx` | Full patient record | GET `/patients/:id/history`; **raw fetch** PDF export (line 52) | as above | history has **none** |

**WebSocket:** nothing under `views/opd` subscribes or sends; OPD also doesn't poll. The app-wide `DashboardNotifications` and `NotificationCenter` listen to `PATIENT_REGISTERED`, `VITALS_RECORDED` and `PATIENT_UPDATED`.

**localStorage:** OPD only reads `zmc_user`, to choose the default sub-tab and decide whether to load replacements. It stores no OPD data.

## Findings

Each is also in [defect-log.md](defect-log.md) with a planned day.

1. **No role check** on POST `/opd/families/deposit` (money), POST `/opd/encounters`, POST `/:id/re-queue`, GET `/:id/history`, GET `/`, and GET `/opd/prices`, `/opd/families`, `/opd/companies`, `/opd/invoices`, `/opd/encounters`.
2. **Two ways to queue an encounter:** EncounterModal → `/opd/encounters` (controller, broadcasts) and ReturningPatientView → `/:id/re-queue` (inline SQL, no role check, no broadcast — the doctor queue only sees it on its 10-second poll).
3. **Raw fetch** at `components/shared/ExportButton.tsx:112` and `components/patient-detail/PatientDetailModal.tsx:52` skips `apiFetch`'s expired-token handling.
4. **Silent 403 for OPD staff:** AdmissionsView and PendingBalanceModal call `/payments/outstanding*`, which is limited to financial roles, so receptionists see an empty list. ReturningPatientView and AdmissionsView assume `userRole = 'Receptionist'` when none is passed.
5. **History/debt field mismatch:** ReturningPatientView reads `history.outstanding` (line 340) but the server returns `outstandingBalances` (`patients.routes.ts:577`), so debts never show. This is D23.
6. **Routing mismatches:** the triage tab is unreachable for nurses; route `departments`/`component` fields are never read; IT users land on the price catalog but only Admin/Mgmt see the edit button, though the backend allows IT Admin; doctors reach the full OPD shell through `/records`.
7. **No live refresh:** OPD lists update only after the user's own changes.
8. **Card replacement permission is checked three ways** (frontend role list, route, and a 403-avoidance guard). Export permission uses its own lowercase role list that ignores the shared role equivalence (Head Nurse missing).
9. `/opd/queue/save-notes` and `/opd/consultations/save-notes` both point at one handler and have no role check.
