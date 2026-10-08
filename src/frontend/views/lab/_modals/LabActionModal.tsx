/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx.
 *
 * Global laboratory action-confirmation modal (published results,
 * walk-in registration, walk-in finalization). Verbatim JSX. Mounted by
 * the shell; content is set by the _hooks/ submit handlers.
 */

import { CheckCircle2, X } from 'lucide-react';
import type { LabActionModalState } from '../_utils/lab-types';

export interface LabActionModalProps {
  modal: LabActionModalState | null;
  onClose: () => void;
}

export default function LabActionModal({ modal: actionModal, onClose }: LabActionModalProps) {
  if (!actionModal || !actionModal.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-teal-100 text-[#2A758C] flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">{actionModal.title}</h3>
              <p className="text-xs text-[#2A758C] font-bold mt-0.5">{actionModal.badgeText || 'Laboratory Task Executed'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl space-y-2">
          <p className="text-xs font-semibold text-slate-800 leading-relaxed">
            {actionModal.message}
          </p>
          {actionModal.patientName && (
            <div className="pt-2 border-t border-teal-200/60 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600">Patient Name:</span>
              <span className="font-extrabold text-slate-900">{actionModal.patientName} ({actionModal.hospitalNumber || 'Walk-In'})</span>
            </div>
          )}
        </div>

        {actionModal.details && actionModal.details.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Departmental Processing Log</p>
            <div className="divide-y divide-slate-100 bg-slate-50/80 rounded-2xl border border-slate-100 p-3 space-y-2">
              {actionModal.details.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{item.label}</span>
                  <span className="font-bold text-slate-800 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-[#2A758C] hover:bg-[#1f5869] text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer text-center"
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
