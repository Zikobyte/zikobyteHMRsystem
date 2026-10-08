import { describe, test, expect } from 'bun:test';
import {
  BULK_IMPORT_MAX_ROWS,
  validateCreatePatientPayload,
} from '../../src/backend/routes/patients/patients.validator';
import { PatientsService } from '../../src/backend/routes/patients/patients.service';

const validRow = () => ({
  name: 'Adaeze Okonkwo',
  dateOfBirth: '1990-05-14',
  gender: 'Female',
  phoneNumber: '08031234567',
  address: '12 Allen Avenue, Ikeja',
  cardType: 'Standard',
});

// NOTE: bun:test runtime supports toContain/rejects, but the repo's tsc types
// for expect() only expose toBe/toBeNull/toMatchObject — so containment is
// asserted via String.includes(...) + toBe(true) to keep `bun run lint` at 0.
function contains(haystack: unknown, needle: string): boolean {
  return String(haystack).includes(needle);
}

describe('POST /patients/bulk contract (DB-free)', () => {
  test('cap is 200 rows per request', () => {
    expect(BULK_IMPORT_MAX_ROWS).toBe(200);
  });

  test('valid create-patient payload passes the shared validator', () => {
    expect(validateCreatePatientPayload(validRow())).toBeNull();
  });

  test('missing name is rejected', () => {
    expect(contains(validateCreatePatientPayload({ ...validRow(), name: ' ' }), 'full name')).toBe(true);
  });

  test('future date of birth is rejected', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    expect(contains(validateCreatePatientPayload({ ...validRow(), dateOfBirth: tomorrow }), 'future')).toBe(
      true
    );
  });

  test('short phone number is rejected', () => {
    expect(contains(validateCreatePatientPayload({ ...validRow(), phoneNumber: '123' }), 'phone number')).toBe(
      true
    );
  });

  test('missing cardType is rejected', () => {
    const row = { ...validRow() } as any;
    delete row.cardType;
    expect(contains(validateCreatePatientPayload(row), 'Card type')).toBe(true);
  });

  test('unidentified emergency intake gets server defaults (same as POST /)', () => {
    const row: any = { cardType: 'Emergency', patientCanProvideDetails: false };
    expect(validateCreatePatientPayload(row)).toBeNull();
    expect(row.name).toBe('Unidentified Emergency Patient');
    expect(row.phoneNumber).toBe('08000000000');
  });

  test('client cardFee is ignored by validation (fee is server-authoritative in the service)', () => {
    expect(validateCreatePatientPayload({ ...validRow(), cardFee: 1 } as any)).toBeNull();
  });

  test('non-object rows are reported as row errors, not crashes', async () => {
    const svc = new PatientsService();
    const err = await svc.bulkRegisterPatients([null, 'not-an-object'], 'tester').then(
      () => null,
      (e) => e
    );
    expect(err === null).toBe(false);
    expect(contains(err && err.message, 'all 2 row(s) rejected')).toBe(true);
  });

  test('all-invalid batch throws total failure before touching the database', async () => {
    const svc = new PatientsService();
    const err = await svc
      .bulkRegisterPatients([{ name: '' }, { ...validRow(), phoneNumber: '1' }], 'tester')
      .then(
        () => null,
        (e) => e
      );
    expect(err === null).toBe(false);
    expect(contains(err && err.message, 'all 2 row(s) rejected')).toBe(true);
    expect(contains(err && err.message, 'Row 0:')).toBe(true);
    expect(contains(err && err.message, 'Row 1:')).toBe(true);
  });
});
