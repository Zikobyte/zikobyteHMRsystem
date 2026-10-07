/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from nursing/_tabs/DetainedPatientsView.tsx (detain modal).
 *
 * "Detain Patient for Observation" modal: patient identity card + reason
 * presets + clinical-card observation + Mark-as-Detained/Cancel actions.
 * Verbatim JSX.
 */

import { Activity, RefreshCw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { PendingPatient } from '../_hooks/useDetainedPatients';

export interface DetainedDetainModalProps {
  patient: PendingPatient | null;
  detentionReason: string;
  setDetentionReason: (value: string) => void;
  clinicalCardObservation: string;
  setClinicalCardObservation: (value: string) => void;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const DETENTION_PRESETS = [
  'BP check after medication',
  'IV fluid monitoring',
  'Post-nebulization asthma observation',
  'Allergic reaction monitoring',
  'Blood sugar check post-insulin'
];

export default function DetainedDetainModal({
  patient,
  detentionReason,
  setDetentionReason,
  clinicalCardObservation,
  setClinicalCardObservation,
  isSubmitting,
  onClose,
  onSubmit
}: DetainedDetainModalProps) {
  return (
    <AnimatePresence>
      {patient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Detain Patient for Observation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Record short-stay observation parameters on the patient clinical card.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Patient Identification Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#2A758C]/15 border border-[#2A758C]/30 text-[#2A758C] flex items-center justify-center font-black text-base">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Patient Name
                  </span>
                  <h4 className="text-base font-black text-slate-900">
                    {patient.name}
                  </h4>
                </div>
              </div>

              <div className="sm:text-right pl-2 sm:pl-0 border-l sm:border-l-0 border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Patient ID Number
                </span>
                <span className="text-sm font-mono font-black text-[#2A758C]">
                  {patient.hospital_number || patient.patient_id}
                </span>
              </div>
            </div>

            {/* Detain Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Reason for detention */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Reason for Detention <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={detentionReason}
                  onChange={(e) => setDetentionReason(e.target.value)}
                  placeholder="e.g., BP check after medication, IV fluid monitoring..."
                  className="w-full px-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 bg-white"
                />
                {/* Quick Select Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Quick Select:</span>
                  {DETENTION_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDetentionReason(preset)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                        detentionReason === preset
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial observation recorded on clinical card */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Initial Observation Recorded on Clinical Card <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={clinicalCardObservation}
                  onChange={(e) => setClinicalCardObservation(e.target.value)}
                  placeholder="Record baseline vitals, patient orientation, pain score, or bedside nursing triage details on clinical card..."
                  className="w-full px-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 bg-white leading-relaxed"
                ></textarea>
                <p className="text-[11px] text-slate-400">
                  This will be stamped on the patient's observation log and maintained for clinical handover.
                </p>
              </div>

              {/* Modal Buttons: Cancel and Mark as Detained */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Activity className="h-4 w-4" />
                  )}
                  <span>Mark as Detained</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
