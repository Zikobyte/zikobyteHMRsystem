import { describe, test, expect } from 'bun:test';
import {
  LAB_CATALOGUE,
  labCodeForLegacyName,
  labEntryForCode,
  labPriceForCode,
  labSeedRows,
} from '../../src/backend/catalogue/lab-catalogue';

const REQUIREMENTS: Record<string, number> = {
  MP_STD: 3000,
  MP_COMP: 5000,
  WIDAL: 5000,
  UA: 3000,
  LFT_STD: 12000,
  LFT_COMP: 15000,
  SEUC_STD: 12000,
  SEUC_COMP: 15000,
  PSA: 15000,
  HBA1C: 10500,
  HORMONAL: 90000,
  FBC: 7000,
  FBS_RBS: 2000,
  BLOOD_GROUP_GENOTYPE: 3000,
  GENOTYPE: 10000,
  CROSS_MATCH: 10000,
  CULTURE_SENS: 18000,
  SPUTUM: 18000,
  CHOLESTEROL: 10000,
  RVS: 5000,
  HBSAG: 3500,
  VDRL: 3500,
  HB: 3000,
  BILIRUBIN_TOTAL: 7000,
};

describe('canonical lab catalogue mirrors requirements price list', () => {
  test('every requirements test is present at the exact requirements price', () => {
    for (const [code, price] of Object.entries(REQUIREMENTS)) {
      expect(labPriceForCode(code)).toBe(price);
    }
  });

  test('codes and seed ids are unique and prices are positive', () => {
    const codes = LAB_CATALOGUE.map((entry) => entry.code);
    expect(new Set(codes).size).toBe(codes.length);
    const rows = labSeedRows();
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
    expect(new Set(rows.map((row) => row.item_code)).size).toBe(rows.length);
    for (const entry of LAB_CATALOGUE) {
      expect(entry.price > 0).toBe(true);
    }
  });

  test('seed rows carry the catalogue price verbatim', () => {
    const rows = new Map(labSeedRows().map((row) => [row.item_code, row]));
    for (const [code, price] of Object.entries(REQUIREMENTS)) {
      expect(rows.get(code)?.price).toBe(price);
      expect(rows.get(code)?.category).toBe('Laboratory');
    }
  });

  test('code lookup is case-insensitive and rejects unknowns', () => {
    expect(labEntryForCode('widal')?.price).toBe(5000);
    expect(labPriceForCode('no-such-test')).toBe(null);
    expect(labEntryForCode('')).toBe(null);
  });

  test('legacy backend and doctor names resolve to canonical codes', () => {
    expect(labCodeForLegacyName('Liver Function Test (LFT)')).toBe('LFT_COMP');
    expect(labCodeForLegacyName('Widal Test')).toBe('WIDAL');
    expect(labCodeForLegacyName('Malaria Parasite (MP)')).toBe('MP_STD');
    expect(labCodeForLegacyName('Hormonal Assay')).toBe('HORMONAL');
    expect(labCodeForLegacyName('Blood Percentage (HB)')).toBe('HB');
    expect(labCodeForLegacyName('FBC – Full Blood Count')).toBe('FBC');
    expect(labCodeForLegacyName('not a real test')).toBe(null);
  });
});
