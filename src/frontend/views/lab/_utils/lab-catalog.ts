/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx.
 *
 * Walk-in lab test catalog (verbatim names/prices). Moved here with
 * IDENTICAL export name/shape (`WALK_IN_LAB_CATALOG`); the catalogue
 * frontend-parity test imports it from this path.
 */

// Categorized test catalog with exact names and prices from specifications
export const WALK_IN_LAB_CATALOG = [
  {
    category: 'Parasitology',
    tests: [
      { id: 'mp_std', name: 'MP – Malaria Parasite (Standard)', price: 3000 },
      { id: 'mp_comp', name: 'MP – Malaria Parasite (Comprehensive)', price: 5000 },
    ]
  },
  {
    category: 'Serology',
    tests: [
      { id: 'widal', name: 'Widal Test', price: 5000 },
      { id: 'rvs', name: 'RVS – Retroviral Screening (HIV)', price: 5000 },
      { id: 'hbsag', name: 'HbsAg – Hepatitis B Surface Antigen', price: 3500 },
      { id: 'vdrl', name: 'VDRL – Syphilis Test', price: 3500 },
      { id: 'blood_group_genotype', name: 'Blood Group & Genotype', price: 3000 },
      { id: 'genotype', name: 'Genotype', price: 10000 },
      { id: 'cross_match', name: 'Cross Matching', price: 10000 },
      { id: 'hp_pylori', name: 'HP – Helicobacter Pylori', price: 5000 },
    ]
  },
  {
    category: 'Hematology',
    tests: [
      { id: 'fbc', name: 'FBC – Full Blood Count', price: 7000 },
      { id: 'hb', name: 'Hb – Haemoglobin', price: 3000 },
    ]
  },
  {
    category: 'Biochemistry',
    tests: [
      { id: 'ua', name: 'Urinalysis (UA)', price: 3000 },
      { id: 'lft_std', name: 'LFT – Liver Function Test (Standard)', price: 12000 },
      { id: 'lft_comp', name: 'LFT – Liver Function Test (Comprehensive)', price: 15000 },
      { id: 'seuc_std', name: 'SEUC – Serum Electrolytes, Urea & Creatinine (Standard)', price: 12000 },
      { id: 'seuc_comp', name: 'SEUC – Serum Electrolytes, Urea & Creatinine (Comprehensive)', price: 15000 },
      { id: 'psa', name: 'PSA – Prostate Specific Antigen', price: 15000 },
      { id: 'hba1c', name: 'HBA1c – Glycated Haemoglobin', price: 10500 },
      { id: 'hormonal', name: 'Hormonal Profile', price: 90000 },
      { id: 'fbs_rbs', name: 'FBS/RBS – Fasting/Random Blood Sugar', price: 2000 },
      { id: 'cholesterol', name: 'Cholesterol', price: 10000 },
      { id: 'bilirubin_total', name: 'Total Bilirubin', price: 7000 },
    ]
  },
  {
    category: 'Microbiology',
    tests: [
      { id: 'culture_sens', name: 'Culture & Sensitivity', price: 18000 },
      { id: 'sputum', name: 'Sputum Analysis', price: 18000 },
    ]
  }
];
