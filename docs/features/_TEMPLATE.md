# Feature: < feature name >

Spec file for the agent workflow (see "Agent Workflow" in `CLAUDE.md`). Copy this file to `docs/features/<feature-name>.md` (kebab-case). Each agent reads the whole file first and appends to its own section; never rewrite another agent's section. Use synthetic examples only — no real patient names, hospital numbers or other identifiers.

- **Status:** Draft | Requirements approved | In build | In verification | Approved | Escalated
- **Path:** Full | Lightweight
- **Requested by / date:**
- **Related `.TODO` items:**

## 1. Workflow and acceptance criteria (hospital-manager)

### Real-world workflow

Who does what, in which department, in what order; what happens on the paper fallback during a power or network outage.

### Roles and access

Which canonical roles (`opd`, `cashier`, `doctor`, `lab`, `pharmacy`, `nurse`, `eyeclinic`, `account`, `hr`, `it_admin`) may view or change what.

### Acceptance criteria

Numbered, testable, Given/When/Then. Mark each one that is a judgment call about hospital operations with **[JUDGMENT CALL]** so the main session shows it to the user before building.

1. Given … When … Then …

### Out of scope / future gaps

Including anything that belongs to HMO/NHIA billing or the drug-interaction checker (out of the first release per the design guide).

### Open questions

## 2. Schema design note (database-engineer)

Tables, columns (with units for clinical values), constraints, indexes (and the query each serves), state-machine changes, migration plan, **rollback note**, `refreshCache` mapping changes, data risks.

## 3. API contract (backend-engineer)

Per endpoint: method, path, roles allowed, request body, response, error codes, audit-log entries written, WebSocket events emitted.

## 4. UI notes (frontend-engineer)

Screens touched, roles that see them, error/offline states, endpoints consumed.

## 5. Test log

Each builder appends: commands run, results (pass/fail counts), new test files, and any **TOOLING MISSING** lines.

## 6. Review findings

Appended by the main session from security-auditor and adversarial-reviewer reports (they are read-only), one subsection per round.

### Round 1

- Security audit:
- Adversarial review verdict:
- Required fixes and owners:
