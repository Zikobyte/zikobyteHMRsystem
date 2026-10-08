/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (MODAL E:
 * FULL SYSTEM RESET DOUBLE-CONFIRMATION, verbatim JSX).
 *
 * Double-confirmed destructive reset bound to the maintenance ops hook
 * result. The RESET confirm string, warning copy, and success/error
 * messages live in the hook and are preserved verbatim. Mounted by the
 * shell.
 */

import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { UseMaintenanceOpsResult } from '../_hooks/useMaintenanceOps';

export interface SystemResetModalProps {
  data: UseMaintenanceOpsResult;
}

export default function SystemResetModal({ data }: SystemResetModalProps) {
  const {
    isResetModalOpen,
    setIsResetModalOpen,
    resetConfirmText,
    setResetConfirmText,
    handleExecuteSystemReset,
    maintenanceLoading
  } = data;

  return (
    <AnimatePresence>
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-rose-200 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-800"
          >
            <div className="bg-rose-600 px-6 py-4.5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white font-black text-base">Full System Reset Confirmation</h3>
                  <p className="text-[11px] text-rose-100 font-medium">Double-confirmed destructive operation</p>
                </div>
              </div>
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-rose-800 leading-relaxed font-medium">
                <strong>Warning:</strong> This will erase all registered patients, triage vitals, clinical encounters, pharmacy orders, lab orders, invoices, and payments. Administrator accounts and system schemas will remain intact.
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                  Type <span className="font-mono text-rose-600 font-black">RESET</span> to confirm execution:
                </label>
                <input
                  type="text"
                  value={resetConfirmText}
                  onChange={(e) => setResetConfirmText(e.target.value)}
                  placeholder="RESET"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 uppercase"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={resetConfirmText.trim().toUpperCase() !== 'RESET' || maintenanceLoading !== null}
                  onClick={handleExecuteSystemReset}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {maintenanceLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>Execute Full Reset</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
