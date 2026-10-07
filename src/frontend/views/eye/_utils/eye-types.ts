/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx.
 *
 * Light local types for the eye slice. Domain rows stay `any` (verbatim
 * from the source view — the file's existing `any[]` domain data); only
 * tab/filter/notify shapes are typed. No behavior change.
 */

/** Domain patient row (verbatim `any` from EyeClinicView). */
export type EyePatient = any;

/** Saved consultation/encounter log row (verbatim `any` from EyeClinicView). */
export type EyeConsultationRecord = any;

export type EyeInternalTab = 'registered-patients' | 'consultation' | 'all-records';

export type EyeStatusFilter = 'all' | 'Paid' | 'Partial' | 'Unpaid' | 'Awaiting Consult' | 'Consulted';

export interface EyeNotify {
	showSuccess: (msg: string) => void;
	showError: (msg: string) => void;
}
