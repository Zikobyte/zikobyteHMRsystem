/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx.
 *
 * 403-avoidance role gate: POST /opd/queue/lab-complete is Lab-only
 * (patients.routes.ts:407). The view is routable by doctor dept, so
 * non-lab roles get a disabled submit + note. Results viewing stays
 * intact. Presentation-only: no backend change. Verbatim logic.
 */

import { useEffect, useState } from 'react';

export interface UseLabRoleGateResult {
  currentUserRole: string | null;
  canSubmitLabResults: boolean;
}

export function useLabRoleGate(): UseLabRoleGateResult {
  // 403-avoidance gate: POST /opd/queue/lab-complete is Lab-only (patients.routes.ts:407).
  // The view is routable by doctor dept, so non-lab roles get a disabled submit + note.
  // Results viewing stays intact. Presentation-only: no backend change.
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zmc_user');
      if (saved) setCurrentUserRole(JSON.parse(saved)?.role ?? null);
    } catch {
      setCurrentUserRole(null);
    }
  }, []);
  const LAB_RESULT_SUBMIT_ROLES = ['Laboratory Scientist', 'Lab Technician', 'Scientist', 'Laboratory'];
  const LAB_RESULT_ADMIN_BYPASS = ['Administrator', 'IT Administrator', 'Management', 'Super Administrator'];
  const canSubmitLabResults =
    !!currentUserRole &&
    ([...LAB_RESULT_SUBMIT_ROLES, ...LAB_RESULT_ADMIN_BYPASS] as string[]).includes(currentUserRole);

  return { currentUserRole, canSubmitLabResults };
}
