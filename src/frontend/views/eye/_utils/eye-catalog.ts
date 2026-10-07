/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx.
 *
 * Eye clinic pricing catalogs (verbatim values): eye tests, procedures,
 * frames, lenses, accessories. No behavior change.
 */

export interface EyeCatalogItem {
	name: string;
	price: number;
}

export const EYE_TESTS: EyeCatalogItem[] = [
	{ name: 'Visual Acuity', price: 1000 },
	{ name: 'Ophthalmoscopy', price: 1000 },
	{ name: 'Auto Refraction', price: 5000 },
	{ name: 'C.V.F (Colour Vision Field)', price: 10000 },
	{ name: 'Tonometry', price: 5000 },
	{ name: 'Slit Lamp Biomicroscopy', price: 10000 }
];

export const PROCEDURES: EyeCatalogItem[] = [
	{ name: 'Eye Irrigation', price: 5000 },
	{ name: 'Foreign Body Removal', price: 10000 },
	{ name: 'Dilation', price: 2000 }
];

export const FRAMES: EyeCatalogItem[] = [
	{ name: 'Designer Frames', price: 35000 },
	{ name: 'Semi Designer Frames', price: 20000 },
	{ name: 'Plastic Frames', price: 15000 },
	{ name: 'Children Frames', price: 13000 }
];

export const LENSES: EyeCatalogItem[] = [
	{ name: 'Single Vision / Simple Bifocal Lens', price: 15000 },
	{ name: 'High Minus/Plus Single Vision', price: 20000 },
	{ name: 'Minus Addition Lens', price: 20000 },
	{ name: 'Single Vision Transition', price: 25000 },
	{ name: 'Simple Bifocal / Varilux Transition', price: 30000 },
	{ name: 'Single Bluecut', price: 35000 },
	{ name: 'Bifocal Bluecut', price: 40000 },
	{ name: 'Special Order White', price: 30000 },
	{ name: 'Special Order Transition', price: 45000 },
	{ name: 'Special Order Bluecut', price: 60000 }
];

export const ACCESSORIES: EyeCatalogItem[] = [
	{ name: 'Ropes', price: 1500 },
	{ name: 'Lens Cleaner', price: 2500 },
	{ name: 'Purse', price: 2000 }
];
