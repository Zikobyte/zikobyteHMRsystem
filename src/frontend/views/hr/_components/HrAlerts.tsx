/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx.
 *
 * Success / error alert banners (verbatim JSX). The shell renders this
 * directly under the department header.
 */

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export interface HrAlertsProps {
  successMsg: string | null;
  error: string | null;
  onDismissError: () => void;
}

export default function HrAlerts({ successMsg, error, onDismissError }: HrAlertsProps) {
  return (
    <>
      {/* Success / Error Alerts */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={onDismissError} className="text-rose-600 hover:text-rose-800 font-bold text-xs">Dismiss</button>
        </div>
      )}
    </>
  );
}
