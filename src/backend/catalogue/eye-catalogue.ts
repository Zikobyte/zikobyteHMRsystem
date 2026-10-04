export interface EyeCatalogueEntry {
  name: string;
  price: number;
  category: string;
}

const E = (name: string, price: number, category: string): EyeCatalogueEntry => ({ name, price, category });

export const EYE_CATALOGUE: EyeCatalogueEntry[] = [
  // Tests
  E('Visual Acuity', 1000, 'Tests'),
  E('Ophthalmoscopy', 1000, 'Tests'),
  E('Auto Refraction', 5000, 'Tests'),
  E('C.V.F (Colour Vision Field)', 10000, 'Tests'),
  E('Tonometry', 5000, 'Tests'),
  E('Slit Lamp Biomicroscopy', 10000, 'Tests'),
  // Procedures
  E('Eye Irrigation', 5000, 'Procedures'),
  E('Foreign Body Removal', 10000, 'Procedures'),
  E('Dilation', 2000, 'Procedures'),
  // Frames
  E('Designer Frames', 35000, 'Frames'),
  E('Semi Designer Frames', 20000, 'Frames'),
  E('Plastic Frames', 15000, 'Frames'),
  E('Children Frames', 13000, 'Frames'),
  // Lenses
  E('Single Vision / Simple Bifocal Lens', 15000, 'Lenses'),
  E('High Minus/Plus Single Vision', 20000, 'Lenses'),
  E('Minus Addition Lens', 20000, 'Lenses'),
  E('Single Vision Transition', 25000, 'Lenses'),
  E('Simple Bifocal / Varilux Transition', 30000, 'Lenses'),
  E('Single Bluecut', 35000, 'Lenses'),
  E('Bifocal Bluecut', 40000, 'Lenses'),
  E('Special Order White', 30000, 'Lenses'),
  E('Special Order Transition', 45000, 'Lenses'),
  E('Special Order Bluecut', 60000, 'Lenses'),
  // Accessories
  E('Ropes', 1500, 'Accessories'),
  E('Lens Cleaner', 2500, 'Accessories'),
  E('Purse', 2000, 'Accessories'),
];

const entriesByName = new Map<string, EyeCatalogueEntry>();
for (const entry of EYE_CATALOGUE) {
  entriesByName.set(entry.name.trim().toLowerCase(), entry);
}

export function resolveEyeServicePrice(name: unknown): EyeCatalogueEntry | null {
  if (typeof name !== 'string') return null;
  return entriesByName.get(name.trim().toLowerCase()) ?? null;
}

export function resolveEyeServicesTotal(services: unknown): { total: number; resolved: EyeCatalogueEntry[]; unknown: string[] } {
  const list = Array.isArray(services) ? services : [];
  let total = 0;
  const resolved: EyeCatalogueEntry[] = [];
  const unknown: string[] = [];
  for (const s of list) {
    const name = typeof s === 'string' ? s : (s as any)?.name;
    const hit = resolveEyeServicePrice(name);
    if (!hit) {
      unknown.push(String(name || 'Unknown service'));
      continue;
    }
    total += hit.price;
    resolved.push(hit);
  }
  return { total, resolved, unknown };
}
