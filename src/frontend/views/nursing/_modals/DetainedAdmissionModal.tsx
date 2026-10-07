/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from nursing/_tabs/DetainedPatientsView.tsx (admission modal).
 *
 * "Complete Patient Admission" modal: ward/bed/diagnosis/next-of-kin/
 * region/religion/doctor-orders form. Verbatim JSX.
 */

import { BedDouble, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { DetainedAdmissionForm, DetainedPatient, PendingPatient } from '../_hooks/useDetainedPatients';

export interface DetainedAdmissionModalProps {
  patient: PendingPatient | DetainedPatient | null;
  admissionForm: DetainedAdmissionForm;
  setAdmissionForm: (value: DetainedAdmissionForm) => void;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function DetainedAdmissionModal({
  patient,
  admissionForm,
  setAdmissionForm,
  isSubmitting,
  onClose,
  onSubmit
}: DetainedAdmissionModalProps) {
  return (
    <AnimatePresence>
      {patient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 max-h-[92vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2A758C]/15 border border-[#2A758C]/30 flex items-center justify-center text-[#2A758C]">
                  <BedDouble className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Complete Patient Admission
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assign ward bed, register clinical diagnosis, next of kin, and formal doctor's orders.
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

            {/* Patient Name & Patient ID Number Banner */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#2A758C] text-white flex items-center justify-center font-black text-base shadow-xs">
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
                  Patient ID
                </span>
                <span className="text-sm font-mono font-black text-[#2A758C]">
                  {patient.hospital_number || patient.patient_id}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ward Dropdown */}
                {/* Options: General Ward Abuja, Maternity Ward Lagos, ICU, Pediatric Ward, Private Room */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    Ward <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={admissionForm.ward}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, ward: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20 focus:border-[#2A758C] text-slate-900 bg-white"
                  >
                    <option value="General Ward Abuja">General Ward Abuja</option>
                    <option value="Maternity Ward Lagos">Maternity Ward Lagos</option>
                    <option value="ICU">ICU</option>
                    <option value="Pediatric Ward">Pediatric Ward</option>
                    <option value="Private Room">Private Room</option>
                  </select>
                </div>

                {/* Bed Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    Bed Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bed 847, M-3, Bed 12..."
                    value={admissionForm.bedNumber}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, bedNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20 focus:border-[#2A758C] text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Provisional Diagnosis */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Provisional Diagnosis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter provisional medical diagnosis..."
                  value={admissionForm.provisionalDiagnosis}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, provisionalDiagnosis: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20 focus:border-[#2A758C] text-slate-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Next of Kin */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    Next of Kin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name & relationship..."
                    value={admissionForm.nextOfKin}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, nextOfKin: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20 focus:border-[#2A758C] text-slate-900 bg-white"
                  />
                </div>

                {/* Region */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={admissionForm.region}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, region: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20 focus:border-[#2A758C] text-slate-900 bg-white"
                  >
                    <option value="South West">South West</option>
                    <option value="North Central">North Central</option>
                    <option value="South East">South East</option>
                    <option value="South South">South South</option>
                    <option value="North West">North West</option>
                    <option value="North East">North East</option>
                  </select>
                </div>

                {/* Religion */}
                {/* Options: Christianity, Islam, Traditional, Other */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                    Religion <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={admissionForm.religion}
                    onChange={(e) => setAdmissionForm({ ...admissionForm, religion: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20 focus:border-[#2A758C] text-slate-900 bg-white"
                  >
                    <option value="Christianity">Christianity</option>
                    <option value="Islam">Islam</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Doctor's orders or standing orders */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                  Doctor's Orders or Standing Orders <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter physician orders, medication schedules, activity instructions, and observation intervals..."
                  value={admissionForm.doctorOrders}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, doctorOrders: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20 focus:border-[#2A758C] text-slate-900 bg-white leading-relaxed"
                ></textarea>
              </div>

              {/* Buttons */}
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
                  className="px-5 py-2.5 rounded-xl bg-[#2A758C] hover:bg-[#225f72] text-white font-black text-xs shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  <span>Complete Admission</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
