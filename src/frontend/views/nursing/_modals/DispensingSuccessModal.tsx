/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/NurseDispensingView.tsx.
 *
 * Save-confirmation modal with the persisted record summary. Verbatim JSX;
 * close arrives via callback.
 */

import { CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { DispensingSuccessDialog } from '../_hooks/useNurseDispensing';

export interface DispensingSuccessModalProps {
  successDialog: DispensingSuccessDialog;
  onClose: () => void;
}

export default function DispensingSuccessModal({ successDialog, onClose }: DispensingSuccessModalProps) {
  return (
    <AnimatePresence>
      {successDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{successDialog.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {successDialog.message}
                </p>
              </div>

              {successDialog.record && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-semibold text-slate-800 font-mono">{successDialog.record.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-600">Patient:</span>
                    <span className="font-bold text-slate-900">{successDialog.record.patient_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-600">Card Number:</span>
                    <span className="font-mono text-slate-800 font-semibold">{successDialog.record.card_number}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-600">Drug Dispensed:</span>
                    <span className="font-semibold text-emerald-700">{successDialog.record.drug}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                    <span className="text-slate-600">Quantity:</span>
                    <span className="font-bold text-slate-800">{successDialog.record.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Recorded By:</span>
                    <span className="font-medium text-slate-800">{successDialog.record.recorded_by}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#2A758C] hover:bg-[#236377] text-white text-sm font-bold shadow-xs transition-colors"
              >
                Done & Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
