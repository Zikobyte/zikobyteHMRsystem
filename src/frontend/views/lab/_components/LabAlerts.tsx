/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx.
 *
 * Global toast feedback (success/error). Verbatim JSX.
 */

import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface LabAlertsProps {
  success: string;
  error: string;
}

export default function LabAlerts({ success, error }: LabAlertsProps) {
  return (
    <>
      {/* Global Toast Feedback */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2.5 shadow-xs animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </>
  );
}
