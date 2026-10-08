/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (error/success
 * banners, verbatim JSX).
 */

import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface ItAdminAlertsProps {
  error: string;
  success: string;
  onClearError: () => void;
  onClearSuccess: () => void;
}

export default function ItAdminAlerts({ error, success, onClearError, onClearSuccess }: ItAdminAlertsProps) {
  return (
    <>
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-xs font-semibold shadow-xs">
          <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={onClearError} className="p-1 hover:bg-rose-100 rounded-lg cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-semibold shadow-xs">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
          <span className="flex-1">{success}</span>
          <button onClick={onClearSuccess} className="p-1 hover:bg-emerald-100 rounded-lg cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
