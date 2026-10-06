export interface LabCatalogueEntry {
  code: string;
  itemName: string;
  price: number;
  category: string;
  grandfathered?: boolean;
}

export interface LabSeedRow {
  id: string;
  item_code: string;
  item_name: string;
  price: number;
  category: string;
}

const C = (
  code: string,
  itemName: string,
  price: number,
  category: string,
  grandfathered = false,
): LabCatalogueEntry => ({ code, itemName, price, category, grandfathered });

export const LAB_CATALOGUE: LabCatalogueEntry[] = [
  // Parasitology — requirements priced
  C('MP_STD', 'MP – Malaria Parasite (Standard)', 3000, 'Parasitology'),
  C('MP_COMP', 'MP – Malaria Parasite (Comprehensive)', 5000, 'Parasitology'),
  C('STOOL_ANALYSIS', 'Stool Analysis', 5000, 'Parasitology', true),
  C('MICROFILARIA', 'Microfilaria (MF)', 5000, 'Parasitology', true),
  // Serology — requirements priced
  C('WIDAL', 'Widal Test', 5000, 'Serology'),
  C('RVS', 'RVS – Retroviral Screening (HIV)', 5000, 'Serology'),
  C('HBSAG', 'HbsAg – Hepatitis B Surface Antigen', 3500, 'Serology'),
  C('VDRL', 'VDRL – Syphilis Test', 3500, 'Serology'),
  C('BLOOD_GROUP_GENOTYPE', 'Blood Group & Genotype', 3000, 'Serology'),
  C('GENOTYPE', 'Genotype', 10000, 'Serology'),
  C('CROSS_MATCH', 'Cross Matching', 10000, 'Serology'),
  C('HP_PYLORI', 'HP – Helicobacter Pylori', 5000, 'Serology'),
  C('HCV', 'Hepatitis C (HCV)', 3500, 'Serology', true),
  // Hematology — requirements priced
  C('FBC', 'FBC – Full Blood Count', 7000, 'Hematology'),
  C('HB', 'Hb – Haemoglobin', 3000, 'Hematology'),
  // Biochemistry — requirements priced
  C('UA', 'Urinalysis (UA)', 3000, 'Biochemistry'),
  C('LFT_STD', 'LFT – Liver Function Test (Standard)', 12000, 'Biochemistry'),
  C('LFT_COMP', 'LFT – Liver Function Test (Comprehensive)', 15000, 'Biochemistry'),
  C('SEUC_STD', 'SEUC – Serum Electrolytes, Urea & Creatinine (Standard)', 12000, 'Biochemistry'),
  C('SEUC_COMP', 'SEUC – Serum Electrolytes, Urea & Creatinine (Comprehensive)', 15000, 'Biochemistry'),
  C('PSA', 'PSA – Prostate Specific Antigen', 15000, 'Biochemistry'),
  C('HBA1C', 'HBA1c – Glycated Haemoglobin', 10500, 'Biochemistry'),
  C('HORMONAL', 'Hormonal Profile', 90000, 'Biochemistry'),
  C('FBS_RBS', 'FBS/RBS – Fasting/Random Blood Sugar', 2000, 'Biochemistry'),
  C('CHOLESTEROL', 'Cholesterol', 10000, 'Biochemistry'),
  C('BILIRUBIN_TOTAL', 'Total Bilirubin', 7000, 'Biochemistry'),
  // Microbiology — requirements priced
  C('CULTURE_SENS', 'Culture & Sensitivity', 18000, 'Microbiology'),
  C('SPUTUM', 'Sputum Analysis', 18000, 'Microbiology'),
  // Grandfathered extras — in active use, absent from requirements list
  C('LIPID_PROFILE', 'Lipid Profile', 15000, 'Biochemistry', true),
  C('FOB', 'Faecal Occult Blood Test (FOB)', 3000, 'Biochemistry', true),
  C('PT_HCG', 'Pregnancy Test – PT (HCG)', 2500, 'Biochemistry', true),
  C('EAR_SWAB_MCS', 'EAR SWAB M/C/S', 7000, 'Microbiology', true),
  C('HVS_MCS', 'HVS M/C/S', 7000, 'Microbiology', true),
  C('URINE_MCS', 'Urine M/C/S', 7000, 'Microbiology', true),
  C('PUS_SWAB_MCS', 'Pus Swab M/C/S', 10000, 'Microbiology', true),
  C('SEMEN_MCS', 'Semen Culture M/C/S', 15000, 'Microbiology', true),
  C('URETHRAL_SWAB_MCS', 'Urethral Swab M/C/S', 7000, 'Microbiology', true),
  C('STOOL_MCS', 'Stool Culture M/C/S', 15000, 'Microbiology', true),
  C('SPUTUM_MCS', 'Sputum M/C/S', 10000, 'Microbiology', true),
];

const entriesByCode = new Map<string, LabCatalogueEntry>();
for (const entry of LAB_CATALOGUE) {
  entriesByCode.set(entry.code, entry);
}

export function labPriceForCode(code: string): number | null {
  const entry = entriesByCode.get((code || '').trim().toUpperCase());
  return entry ? entry.price : null;
}

export function labEntryForCode(code: string): LabCatalogueEntry | null {
  return entriesByCode.get((code || '').trim().toUpperCase()) ?? null;
}

export function labSeedRows(): LabSeedRow[] {
  return LAB_CATALOGUE.map((entry, index) => ({
    id: `pc-lab2-${index + 1}`,
    item_code: entry.code,
    item_name: entry.itemName,
    price: entry.price,
    category: 'Laboratory',
  }));
}

export const LEGACY_LAB_NAME_TO_CODE: Record<string, string> = {
  'Liver Function Test (LFT)': 'LFT_COMP',
  'Electrolyte, Urea, Creatinine (E/U/C)': 'SEUC_COMP',
  'Lipid Profile': 'LIPID_PROFILE',
  'Prostate Specific Antigen (PSA)': 'PSA',
  Cholesterol: 'CHOLESTEROL',
  'Random Blood Sugar (RBS)': 'FBS_RBS',
  'Fasting Blood Sugar (FBS)': 'FBS_RBS',
  'Full Blood Count (FBC)': 'FBC',
  'Hormonal Assay': 'HORMONAL',
  'HbA1c (Glycated Sugar)': 'HBA1C',
  'Urine Analysis (UA)': 'UA',
  'Faecal Occult Blood Test (FOB)': 'FOB',
  'Pregnancy Test – PT (HCG)': 'PT_HCG',
  'Widal Test': 'WIDAL',
  'Hepatitis B (HBsAg)': 'HBSAG',
  'Hepatitis C (HCV)': 'HCV',
  'VDRL (Syphilis)': 'VDRL',
  'Retroviral Screening (RVS)': 'RVS',
  'Blood Percentage (HB)': 'HB',
  'Blood Group (BG)': 'BLOOD_GROUP_GENOTYPE',
  'Genotype (GT)': 'GENOTYPE',
  'EAR SWAB M/C/S': 'EAR_SWAB_MCS',
  'HVS M/C/S': 'HVS_MCS',
  'Urine M/C/S': 'URINE_MCS',
  'Pus Swab M/C/S': 'PUS_SWAB_MCS',
  'Semen Culture M/C/S': 'SEMEN_MCS',
  'Urethral Swab M/C/S': 'URETHRAL_SWAB_MCS',
  'Stool Culture M/C/S': 'STOOL_MCS',
  'Sputum M/C/S': 'SPUTUM_MCS',
  'H. pylori (HP)': 'HP_PYLORI',
  'Stool Analysis': 'STOOL_ANALYSIS',
  'Microfilaria (MF)': 'MICROFILARIA',
  'Malaria Parasite (MP)': 'MP_STD',
  'MP – Malaria Parasite (Standard)': 'MP_STD',
  'MP – Malaria Parasite (Comprehensive)': 'MP_COMP',
  'FBC – Full Blood Count': 'FBC',
  'Hb – Haemoglobin': 'HB',
  'Urinalysis (UA)': 'UA',
  'LFT – Liver Function Test (Standard)': 'LFT_STD',
  'LFT – Liver Function Test (Comprehensive)': 'LFT_COMP',
  'SEUC – Serum Electrolytes, Urea & Creatinine (Standard)': 'SEUC_STD',
  'SEUC – Serum Electrolytes, Urea & Creatinine (Comprehensive)': 'SEUC_COMP',
  'PSA – Prostate Specific Antigen': 'PSA',
  'HBA1c – Glycated Haemoglobin': 'HBA1C',
  'Hormonal Profile': 'HORMONAL',
  'FBS/RBS – Fasting/Random Blood Sugar': 'FBS_RBS',
  'Total Bilirubin': 'BILIRUBIN_TOTAL',
  'Culture & Sensitivity': 'CULTURE_SENS',
  'Sputum Analysis': 'SPUTUM',
  'Widal Test ': 'WIDAL',
  'RVS – Retroviral Screening (HIV)': 'RVS',
  'HbsAg – Hepatitis B Surface Antigen': 'HBSAG',
  'VDRL – Syphilis Test': 'VDRL',
  'Blood Group & Genotype': 'BLOOD_GROUP_GENOTYPE',
  Genotype: 'GENOTYPE',
  'Cross Matching': 'CROSS_MATCH',
  'HP – Helicobacter Pylori': 'HP_PYLORI',
};

export function labCodeForLegacyName(name: string): string | null {
  if (!name) return null;
  const direct = LEGACY_LAB_NAME_TO_CODE[name];
  if (direct) return direct;
  const trimmed = LEGACY_LAB_NAME_TO_CODE[name.trim()];
  return trimmed ?? null;
}

export interface ResolvedLabTest {
  code: string;
  name: string;
  price: number;
  category: string;
}

export function resolveLabTestPrice(input: { code?: unknown; name?: unknown }): ResolvedLabTest | null {
  const rawCode = typeof input.code === 'string' ? input.code.trim().toUpperCase() : '';
  if (rawCode) {
    const entry = entriesByCode.get(rawCode);
    if (entry) {
      return { code: entry.code, name: entry.itemName, price: entry.price, category: entry.category };
    }
    return null;
  }
  const rawName = typeof input.name === 'string' ? input.name : '';
  const mappedCode = labCodeForLegacyName(rawName);
  if (!mappedCode) return null;
  const entry = entriesByCode.get(mappedCode);
  if (!entry) return null;
  return { code: entry.code, name: entry.itemName, price: entry.price, category: entry.category };
}
