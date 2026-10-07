/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/AdmittedPatientsView.tsx (SUCCESS CONFIRMATION MODAL).
 *
 * Success dialog shown after medication administration, observation, and
 * vitals submissions. Verbatim JSX; message + close arrive via props.
 */

import { CheckCircle2 } from 'lucide-react';

export interface AdmittedSuccessModalProps {
  message: string | null;
  onClose: () => void;
}

export default function AdmittedSuccessModal({ message, onClose }: AdmittedSuccessModalProps) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">Success</h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
            {message}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            id="modal-close-btn"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-black bg-[#2A758C] text-white hover:bg-[#236376] transition-all shadow-xs cursor-pointer"
          >
            Okay, Continue
          </button>
        </div>
      </div>
    </div>
  );
}
