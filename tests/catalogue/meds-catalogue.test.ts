import { describe, test, expect } from 'bun:test';
import {
  MED_CATALOGUE,
  medCodeForLegacyName,
  medSeedRows,
  resolveMedPrice,
} from '../../src/backend/catalogue/meds-catalogue';

const BACKEND_MAP_NAMES = [
  'Paracetamol 500mg tab',
  'Ibuprofen 400mg tab',
  'Diclofenac 50mg tab',
  'Artemether/Lumefantrine (Coartem)',
  'Dihydroartemisinin/Piperaquine',
  'Amoxicillin 500mg cap',
  'Amoxicillin/Clavulanate (Augmentin) 625mg',
  'Ciprofloxacin 500mg tab',
  'Azithromycin 500mg tab',
  'Metronidazole 400mg tab',
  'Cefuroxime 500mg tab',
  'Erythromycin 500mg tab',
  'Ampiclox cap',
  'Omeprazole 20mg cap',
  'Antacid Suspension (Mist Mag)',
  'Hyoscine Butylbromide (Buscopan)',
  'Metoclopramide 10mg tab',
  'Oral Rehydration Salts (ORS)',
  'Loperamide 2mg cap',
  'Cetirizine 10mg tab',
  'Loratadine 10mg tab',
  'Chlorpheniramine 4mg tab',
  'Hydrocortisone 100mg inj',
  'Dexamethasone 4mg inj',
  'Vitamin C 100mg tab',
  'Vitamin B-Complex tab',
  'Folic Acid 5mg tab',
  'Ferrous Sulphate 200mg tab',
  'Multivitamin syrup',
  'Zinc Sulfate 20mg tab',
  'Amlodipine 5mg tab',
  'Lisinopril 5mg tab',
  'Lisinopril 10mg tab',
  'Metformin 500mg tab',
  'Glibenclamide 5mg tab',
  'Labetalol 100mg',
  'Methyldopa 250mg',
  'Ceftriaxone IV 1g',
  'Magnesium Sulphate 50% inj',
  'Artesunate IV 60mg',
  'Hydralazine IV 20mg',
  'Oxytocin 10 IU',
  'Diclofenac IM 75mg',
  'Promethazine IM 50mg',
];

describe('canonical medication catalogue carries the agreed prices', () => {
  test('every legacy backend map name resolves to a priced code', () => {
    for (const name of BACKEND_MAP_NAMES) {
      const resolved = resolveMedPrice({ name });
      expect(resolved).not.toBe(null);
      expect((resolved?.price ?? 0) > 0).toBe(true);
    }
  });

  test('codes and seed ids are unique and seed rows carry catalogue prices', () => {
    const codes = MED_CATALOGUE.map((entry) => entry.code);
    expect(new Set(codes).size).toBe(codes.length);
    const rows = medSeedRows();
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
    const byCode = new Map(rows.map((row) => [row.item_code, row]));
    for (const entry of MED_CATALOGUE) {
      expect(byCode.get(entry.code)?.price).toBe(entry.price);
    }
  });

  test('short datalist aliases resolve; unknown names return null for review', () => {
    expect(medCodeForLegacyName('Paracetamol 500mg')).toBe('MED_PARACETAMOL_500MG_TAB');
    expect(medCodeForLegacyName('Folic Acid 5mg')).toBe('MED_FOLIC_ACID_5MG_TAB');
    expect(resolveMedPrice({ code: 'MED_COARTEM' })?.price).toBe(2800);
    expect(resolveMedPrice({ code: 'MED_NOPE' })).toBe(null);
    expect(resolveMedPrice({ name: 'Mystery Mixture' })).toBe(null);
    expect(resolveMedPrice({})).toBe(null);
  });

  test('explicit code wins over name', () => {
    expect(resolveMedPrice({ code: 'MED_ORS', name: 'Paracetamol 500mg tab' })).toMatchObject({
      code: 'MED_ORS',
      price: 600,
    });
  });
});
