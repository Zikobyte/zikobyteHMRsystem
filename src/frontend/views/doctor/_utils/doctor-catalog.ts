/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx.
 *
 * Doctor catalogs: lab-test groups (export names IDENTICAL — the
 * tests/catalogue/frontend-parity test imports them), medication and
 * injection catalogs, plus the medication price-resolution helper.
 * The helper now imports resolveMedPrice properly (the original file had
 * that import commented out, which was a tsc error).
 */

import { resolveMedPrice } from "@backend/catalogue/meds-catalogue";

export interface DoctorLabTest {
	code: string;
	name: string;
	price: number;
}

// Lab tests catalog matching exact user requests & pricing spec
export const CHEMISTRY_TESTS: DoctorLabTest[] = [
  { code: 'LFT_COMP', name: 'Liver Function Test (LFT)', price: 15000 },
  { code: 'SEUC_COMP', name: 'Electrolyte, Urea, Creatinine (E/U/C)', price: 15000 },
  { code: 'LIPID_PROFILE', name: 'Lipid Profile', price: 15000 },
  { code: 'PSA', name: 'Prostate Specific Antigen (PSA)', price: 15000 },
  { code: 'CHOLESTEROL', name: 'Cholesterol', price: 10000 },
  { code: 'FBS_RBS', name: 'Random Blood Sugar (RBS)', price: 2000 },
  { code: 'FBS_RBS', name: 'Fasting Blood Sugar (FBS)', price: 2000 },
  { code: 'FBC', name: 'Full Blood Count (FBC)', price: 7000 },
  { code: 'HORMONAL', name: 'Hormonal Assay', price: 90000 },
  { code: 'HBA1C', name: 'HbA1c (Glycated Sugar)', price: 10500 },
  { code: 'UA', name: 'Urine Analysis (UA)', price: 3000 },
  { code: 'FOB', name: 'Faecal Occult Blood Test (FOB)', price: 3000 },
  { code: 'PT_HCG', name: 'Pregnancy Test – PT (HCG)', price: 2500 }
];

export const SEROLOGY_TESTS: DoctorLabTest[] = [
  { code: 'WIDAL', name: 'Widal Test', price: 5000 },
  { code: 'HBSAG', name: 'Hepatitis B (HBsAg)', price: 3500 },
  { code: 'HCV', name: 'Hepatitis C (HCV)', price: 3500 },
  { code: 'VDRL', name: 'VDRL (Syphilis)', price: 3500 },
  { code: 'RVS', name: 'Retroviral Screening (RVS)', price: 5000 }
];

export const HAEMATOLOGY_TESTS: DoctorLabTest[] = [
  { code: 'HB', name: 'Blood Percentage (HB)', price: 3000 },
  { code: 'BLOOD_GROUP_GENOTYPE', name: 'Blood Group (BG)', price: 3000 },
  { code: 'GENOTYPE', name: 'Genotype (GT)', price: 10000 }
];

export const MICROBIOLOGY_TESTS: DoctorLabTest[] = [
  { code: 'EAR_SWAB_MCS', name: 'EAR SWAB M/C/S', price: 7000 },
  { code: 'HVS_MCS', name: 'HVS M/C/S', price: 7000 },
  { code: 'URINE_MCS', name: 'Urine M/C/S', price: 7000 },
  { code: 'PUS_SWAB_MCS', name: 'Pus Swab M/C/S', price: 10000 },
  { code: 'SEMEN_MCS', name: 'Semen Culture M/C/S', price: 15000 },
  { code: 'URETHRAL_SWAB_MCS', name: 'Urethral Swab M/C/S', price: 7000 },
  { code: 'STOOL_MCS', name: 'Stool Culture M/C/S', price: 15000 },
  { code: 'SPUTUM_MCS', name: 'Sputum M/C/S', price: 10000 },
  { code: 'HP_PYLORI', name: 'H. pylori (HP)', price: 5000 }
];

export const PARASITOLOGY_TESTS: DoctorLabTest[] = [
  { code: 'STOOL_ANALYSIS', name: 'Stool Analysis', price: 5000 },
  { code: 'MICROFILARIA', name: 'Microfilaria (MF)', price: 5000 },
  { code: 'MP_STD', name: 'Malaria Parasite (MP)', price: 3000 }
];

// Medications Catalog
export const MEDICATIONS_CATALOG: string[] = [
  'Paracetamol 500mg',
  'Amoxicillin 500mg',
  'Ciprofloxacin 500mg',
  'Artemether/Lumefantrine (Coartem)',
  'Ibuprofen 400mg',
  'Metronidazole 400mg',
  'Multivitamin caps',
  'Folic Acid 5mg',
  'Labetalol 100mg',
  'Methyldopa 250mg'
];

// Injections Catalog
export const INJECTIONS_CATALOG: string[] = [
  'Ceftriaxone IV 1g',
  'Magnesium Sulphate 50% inj',
  'Artesunate IV 60mg',
  'Hydralazine IV 20mg',
  'Oxytocin 10 IU',
  'Diclofenac IM 75mg',
  'Promethazine IM 50mg'
];

/** Resolve a medication's canonical price (0 when unresolvable). */
export function getMedicationPrice(medName: string): number {
  const resolved = resolveMedPrice({ name: medName });
  return resolved ? resolved.price : 0;
}
