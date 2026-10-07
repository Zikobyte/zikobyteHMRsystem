/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from nursing/_tabs/DetainedPatientsView.tsx (confirmation modal).
 *
 * Success confirmation dialog for detained/admitted/released outcomes.
 * Verbatim JSX.
 */

import { Activity, BedDouble, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { DetainedConfirmationDialog } from '../_hooks/useDetainedPatients';

export interface DetainedConfirmationModalProps {
  dialog: DetainedConfirmationDialog;
  onDismiss: () => void;
}

export default function DetainedConfirmationModal({ dialog, onDismiss }: DetainedConfirmationModalProps) {
  return (
    <AnimatePresence>
      {dialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-center space-y-4"
          >
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
              dialog.type === 'detained'
                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                : dialog.type === 'admitted'
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-blue-100 text-blue-700 border border-blue-300'
            }`}>
              {dialog.type === 'detained' ? (
                <Activity className="h-7 w-7" />
              ) : dialog.type === 'admitted' ? (
                <BedDouble className="h-7 w-7" />
              ) : (
                <CheckCircle2 className="h-7 w-7" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                {dialog.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
                {dialog.message}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onDismiss}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
