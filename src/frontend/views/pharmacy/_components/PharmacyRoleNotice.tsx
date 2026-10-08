/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx (read-only notice, verbatim
 * JSX).
 *
 * Phase 4 role-gating notice: rendered for non-Pharmacist roles with
 * user context. Doctors keep full action in Admitted Orders only.
 */

import { AlertCircle } from 'lucide-react';

export interface PharmacyRoleNoticeProps {
  hasUserContext: boolean;
  isPharmacist: boolean;
  isDoctor: boolean;
  currentRole: string;
  currentDepartment: string;
}

export default function PharmacyRoleNotice({
  hasUserContext,
  isPharmacist,
  isDoctor,
  currentRole,
  currentDepartment
}: PharmacyRoleNoticeProps) {
  if (!hasUserContext || isPharmacist) return null;

  return (
      <div
        role="note"
        aria-label="Read-only access notice"
        className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-900 font-medium flex items-center gap-2"
      >
        <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
        <span>
          {isDoctor ? (
            <>Viewing as Doctor — read-only except Admitted Orders, which are fully actionable.</>
          ) : (
            <>Viewing as {currentRole || currentDepartment} — read-only. Actions are restricted to Pharmacists (Doctors may act only in Admitted Orders).</>
          )}
        </span>
      </div>
  );
}
