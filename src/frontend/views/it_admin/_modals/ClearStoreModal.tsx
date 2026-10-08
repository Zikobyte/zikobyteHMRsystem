/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (MODAL D:
 * CLEAR DATA STORE CONFIRMATION, verbatim JSX).
 *
 * Per-store destructive confirmation bound to the maintenance ops hook
 * result (store to clear, confirm handler, loading flag). The confirm
 * string, record summary, and success/error messages live in the hook
 * and are preserved verbatim. Mounted by the shell.
 */

import { RefreshCw, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { UseMaintenanceOpsResult } from '../_hooks/useMaintenanceOps';

export interface ClearStoreModalProps {
  data: UseMaintenanceOpsResult;
}

export default function ClearStoreModal({ data }: ClearStoreModalProps) {
  const {
    storeToClear,
    setStoreToClear,
    handleConfirmClearStore,
    maintenanceLoading,
    formatBytes
  } = data;

  return (
    <AnimatePresence>
      {storeToClear && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-slate-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-800"
          >
            <div className="bg-rose-50 px-6 py-4.5 border-b border-rose-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-xl text-rose-600 border border-rose-200">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-rose-900 font-black text-base">Clear Data Store</h3>
                  <p className="text-[11px] text-rose-600 font-medium">{storeToClear.name}</p>
                </div>
              </div>
              <button
                onClick={() => setStoreToClear(null)}
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to clear <strong className="text-slate-900 font-bold">{storeToClear.name}</strong>?
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Store Key:</span>
                  <span className="text-slate-800 font-bold">{storeToClear.key}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Records to remove:</span>
                  <span className="text-rose-600 font-bold">{storeToClear.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storage Freed:</span>
                  <span className="text-slate-800 font-bold">{formatBytes(storeToClear.sizeBytes)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStoreToClear(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearStore}
                  disabled={maintenanceLoading !== null}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {maintenanceLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                  <span>Yes, Clear Store</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
