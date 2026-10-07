/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from HRDashboardView.tsx.
 *
 * Light local types for the hr slice. Domain rows keep the canonical
 * `Employee | Absence | JobOpening | Candidate | Procurement |
 * DiscountPolicy | HRDashboardStats` shapes from ../../../types (verbatim
 * from the source view); only tab/notify shapes are declared here.
 * No behavior change.
 */

/** Normalized HR sub-tab ids routed by the shell. */
export type HrNormalizedTab =
  | 'dashboard'
  | 'employees'
  | 'absences'
  | 'recruitment'
  | 'procurement'
  | 'discounts';

/** Shared messaging contract injected into every hr domain hook. */
export interface HrNotify {
  showNotification: (msg: string) => void;
  setError: (msg: string | null) => void;
}
