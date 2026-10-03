export interface MedCatalogueEntry {
  code: string;
  itemName: string;
  price: number;
  category: string;
  grandfathered?: boolean;
}

export interface MedSeedRow {
  id: string;
  item_code: string;
  item_name: string;
  price: number;
  category: string;
}

const M = (
  code: string,
  itemName: string,
  price: number,
  category: string,
  grandfathered = false,
): MedCatalogueEntry => ({ code, itemName, price, category, grandfathered });

export const MED_CATALOGUE: MedCatalogueEntry[] = [
  M('MED_PARACETAMOL_500MG_TAB', 'Paracetamol 500mg tab', 800, 'Tablets', true),
  M('MED_IBUPROFEN_400MG_TAB', 'Ibuprofen 400mg tab', 1200, 'Tablets', true),
  M('MED_DICLOFENAC_50MG_TAB', 'Diclofenac 50mg tab', 1500, 'Tablets', true),
  M('MED_COARTEM', 'Artemether/Lumefantrine (Coartem)', 2800, 'Tablets', true),
  M('MED_DHA_PIPERAQUINE', 'Dihydroartemisinin/Piperaquine', 3200, 'Tablets', true),
  M('MED_AMOXICILLIN_500MG_CAP', 'Amoxicillin 500mg cap', 2500, 'Capsules', true),
  M('MED_AUGMENTIN_625MG', 'Amoxicillin/Clavulanate (Augmentin) 625mg', 4800, 'Tablets', true),
  M('MED_CIPROFLOXACIN_500MG_TAB', 'Ciprofloxacin 500mg tab', 2200, 'Tablets', true),
  M('MED_AZITHROMYCIN_500MG_TAB', 'Azithromycin 500mg tab', 3500, 'Tablets', true),
  M('MED_METRONIDAZOLE_400MG_TAB', 'Metronidazole 400mg tab', 1000, 'Tablets', true),
  M('MED_CEFUROXIME_500MG_TAB', 'Cefuroxime 500mg tab', 2500, 'Tablets', true),
  M('MED_ERYTHROMYCIN_500MG_TAB', 'Erythromycin 500mg tab', 2500, 'Tablets', true),
  M('MED_AMPICLOX_CAP', 'Ampiclox cap', 2200, 'Capsules', true),
  M('MED_OMEPRAZOLE_20MG_CAP', 'Omeprazole 20mg cap', 2000, 'Capsules', true),
  M('MED_MIST_MAG', 'Antacid Suspension (Mist Mag)', 1500, 'Suspensions', true),
  M('MED_BUSCOPAN', 'Hyoscine Butylbromide (Buscopan)', 1800, 'Tablets', true),
  M('MED_METOCLOPRAMIDE_10MG_TAB', 'Metoclopramide 10mg tab', 800, 'Tablets', true),
  M('MED_ORS', 'Oral Rehydration Salts (ORS)', 600, 'Sachets', true),
  M('MED_LOPERAMIDE_2MG_CAP', 'Loperamide 2mg cap', 1000, 'Capsules', true),
  M('MED_CETIRIZINE_10MG_TAB', 'Cetirizine 10mg tab', 1200, 'Tablets', true),
  M('MED_LORATADINE_10MG_TAB', 'Loratadine 10mg tab', 1500, 'Tablets', true),
  M('MED_CHLORPHENIRAMINE_4MG_TAB', 'Chlorpheniramine 4mg tab', 500, 'Tablets', true),
  M('MED_HYDROCORTISONE_100MG_INJ', 'Hydrocortisone 100mg inj', 2500, 'Injections', true),
  M('MED_DEXAMETHASONE_4MG_INJ', 'Dexamethasone 4mg inj', 1800, 'Injections', true),
  M('MED_VITAMIN_C_100MG_TAB', 'Vitamin C 100mg tab', 500, 'Tablets', true),
  M('MED_VITAMIN_B_COMPLEX_TAB', 'Vitamin B-Complex tab', 800, 'Tablets', true),
  M('MED_FOLIC_ACID_5MG_TAB', 'Folic Acid 5mg tab', 600, 'Tablets', true),
  M('MED_FERROUS_SULPHATE_200MG_TAB', 'Ferrous Sulphate 200mg tab', 800, 'Tablets', true),
  M('MED_MULTIVITAMIN_SYRUP', 'Multivitamin syrup', 2000, 'Syrups', true),
  M('MED_ZINC_SULFATE_20MG_TAB', 'Zinc Sulfate 20mg tab', 1000, 'Tablets', true),
  M('MED_AMLODIPINE_5MG_TAB', 'Amlodipine 5mg tab', 2000, 'Tablets', true),
  M('MED_LISINOPRIL_5MG_TAB', 'Lisinopril 5mg tab', 2500, 'Tablets', true),
  M('MED_LISINOPRIL_10MG_TAB', 'Lisinopril 10mg tab', 3000, 'Tablets', true),
  M('MED_METFORMIN_500MG_TAB', 'Metformin 500mg tab', 1800, 'Tablets', true),
  M('MED_GLIBENCLAMIDE_5MG_TAB', 'Glibenclamide 5mg tab', 1500, 'Tablets', true),
  M('MED_LABETALOL_100MG', 'Labetalol 100mg', 3500, 'Tablets', true),
  M('MED_METHYLDOPA_250MG', 'Methyldopa 250mg', 3000, 'Tablets', true),
  M('MED_CEFTRIAXONE_IV_1G', 'Ceftriaxone IV 1g', 4500, 'Injections', true),
  M('MED_MAGNESIUM_SULPHATE_50PCT_INJ', 'Magnesium Sulphate 50% inj', 3500, 'Injections', true),
  M('MED_ARTESUNATE_IV_60MG', 'Artesunate IV 60mg', 4000, 'Injections', true),
  M('MED_HYDRALAZINE_IV_20MG', 'Hydralazine IV 20mg', 3500, 'Injections', true),
  M('MED_OXYTOCIN_10IU', 'Oxytocin 10 IU', 2500, 'Injections', true),
  M('MED_DICLOFENAC_IM_75MG', 'Diclofenac IM 75mg', 1500, 'Injections', true),
  M('MED_PROMETHAZINE_IM_50MG', 'Promethazine IM 50mg', 1200, 'Injections', true),
];

const entriesByCode = new Map<string, MedCatalogueEntry>();
const entriesByName = new Map<string, MedCatalogueEntry>();
for (const entry of MED_CATALOGUE) {
  entriesByCode.set(entry.code, entry);
  entriesByName.set(entry.itemName.toLowerCase(), entry);
}

// Short datalist aliases used by the DoctorView prescription inputs.
const DATALIST_ALIASES: Record<string, string> = {
  'paracetamol 500mg': 'MED_PARACETAMOL_500MG_TAB',
  'amoxicillin 500mg': 'MED_AMOXICILLIN_500MG_CAP',
  'ciprofloxacin 500mg': 'MED_CIPROFLOXACIN_500MG_TAB',
  'ibuprofen 400mg': 'MED_IBUPROFEN_400MG_TAB',
  'metronidazole 400mg': 'MED_METRONIDAZOLE_400MG_TAB',
  'folic acid 5mg': 'MED_FOLIC_ACID_5MG_TAB',
};

export function medEntryForCode(code: string): MedCatalogueEntry | null {
  return entriesByCode.get((code || '').trim().toUpperCase()) ?? null;
}

export function medCodeForLegacyName(name: string): string | null {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  const entry = entriesByName.get(normalized);
  if (entry) return entry.code;
  return DATALIST_ALIASES[normalized] ?? null;
}

export interface ResolvedMed {
  code: string;
  name: string;
  price: number;
  category: string;
}

export function resolveMedPrice(input: { code?: unknown; name?: unknown }): ResolvedMed | null {
  const rawCode = typeof input.code === 'string' ? input.code.trim().toUpperCase() : '';
  if (rawCode) {
    const entry = entriesByCode.get(rawCode);
    if (entry) {
      return { code: entry.code, name: entry.itemName, price: entry.price, category: entry.category };
    }
    return null;
  }
  const rawName = typeof input.name === 'string' ? input.name : '';
  const mappedCode = medCodeForLegacyName(rawName);
  if (!mappedCode) return null;
  const entry = entriesByCode.get(mappedCode);
  if (!entry) return null;
  return { code: entry.code, name: entry.itemName, price: entry.price, category: entry.category };
}

export function medSeedRows(): MedSeedRow[] {
  return MED_CATALOGUE.map((entry, index) => ({
    id: `pc-med-${index + 1}`,
    item_code: entry.code,
    item_name: entry.itemName,
    price: entry.price,
    category: 'Pharmacy',
  }));
}
