import { describe, test, expect } from 'bun:test';
import { labEntryForCode } from '../../src/backend/catalogue/lab-catalogue';

function stubBrowserGlobals(): void {
  const store = new Map<string, string>();
  (globalThis as Record<string, unknown>).localStorage = {
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
  (globalThis as Record<string, unknown>).window = {
    location: { hostname: 'localhost', origin: 'http://localhost:3000', pathname: '/' },
    atob: (value: string) => Buffer.from(value, 'base64').toString('binary'),
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    history: { pushState: () => undefined },
  };
}

describe('frontend catalogue parity with canonical lab catalogue', () => {
  test('every DoctorView test code exists in the canonical table at an equal displayed price', async () => {
    stubBrowserGlobals();
    const doctor = await import('@/views/doctor/_utils/doctor-catalog');
    const groups = [
      doctor.CHEMISTRY_TESTS,
      doctor.SEROLOGY_TESTS,
      doctor.HAEMATOLOGY_TESTS,
      doctor.MICROBIOLOGY_TESTS,
      doctor.PARASITOLOGY_TESTS,
    ];
    let checked = 0;
    for (const group of groups) {
      for (const item of group as { code: string; name: string; price: number }[]) {
        const canonical = labEntryForCode(item.code);
        expect(canonical).not.toBe(null);
        expect(canonical?.price).toBe(item.price);
        checked += 1;
      }
    }
    expect(checked > 0).toBe(true);
  });

  test('every walk-in catalogue id resolves to an equal canonical price', async () => {
    stubBrowserGlobals();
    const lab = await import('@/views/LaboratoryView');
    const catalog = lab.WALK_IN_LAB_CATALOG as {
      category: string;
      tests: { id: string; name: string; price: number }[];
    }[];
    let checked = 0;
    for (const group of catalog) {
      for (const item of group.tests) {
        const canonical = labEntryForCode(item.id);
        expect(canonical).not.toBe(null);
        expect(canonical?.price).toBe(item.price);
        checked += 1;
      }
    }
    expect(checked > 0).toBe(true);
  });
});
