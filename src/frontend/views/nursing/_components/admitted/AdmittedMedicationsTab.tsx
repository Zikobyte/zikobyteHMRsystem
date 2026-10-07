/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/AdmittedPatientsView.tsx (TAB 1: MEDICATIONS).
 *
 * Prescribed medications grid with bedside-administration confirmation form
 * plus the administration history log. Verbatim JSX; selection + form state
 * arrive via props from useAdmittedPatients.
 */

import type { FormEvent } from 'react';
import { Check, CheckCircle2, Clock, Pill, RefreshCw, X } from 'lucide-react';
import type { AdministrationRecord, PrescribedMedication } from '../../_hooks/useAdmittedPatients';

export interface AdmittedMedicationsTabProps {
  patientName: string;
  prescriptions: PrescribedMedication[];
  administrationHistory: AdministrationRecord[];
  selectedPrescription: PrescribedMedication | null;
  onSelectPrescription: (med: PrescribedMedication) => void;
  onClearPrescription: () => void;
  adminNotes: string;
  onAdminNotesChange: (value: string) => void;
  isAdministering: boolean;
  onConfirmAdministration: (e: FormEvent) => void;
}

export default function AdmittedMedicationsTab({
  patientName,
  prescriptions,
  administrationHistory,
  selectedPrescription,
  onSelectPrescription,
  onClearPrescription,
  adminNotes,
  onAdminNotesChange,
  isAdministering,
  onConfirmAdministration,
}: AdmittedMedicationsTabProps) {
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Prescribed Medications Container */}
      <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Pill className="h-4 w-4 text-[#2A758C]" />
              <span>Prescribed Medications</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Doctor-prescribed medication orders. Select a medication to record bedside administration.
            </p>
          </div>
        </div>

        {/* Prescribed Medications List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(prescriptions || []).map((med) => {
            const isSelected = selectedPrescription?.id === med.id;
            return (
              <div
                key={med.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#2A758C] bg-[#2A758C]/5 ring-2 ring-[#2A758C]/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-black text-slate-900 uppercase leading-snug">
                      {med.medication_name}
                    </h4>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#2A758C]"></span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-500">Quantity: </span>
                      <span className="font-bold text-slate-800">{med.quantity}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Frequency: </span>
                      <span className="font-bold text-slate-800">{med.frequency}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/80">
                  <button
                    type="button"
                    id={`select-medication-${med.id}`}
                    onClick={() => onSelectPrescription(med)}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#2A758C] text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Select</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CONFIRM ADMINISTRATION FORM (WHEN SELECT IS CLICKED) */}
        {selectedPrescription && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 animate-fade-in space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2A758C]" />
                <h4 className="text-xs font-black text-slate-900">
                  Confirm Administration: <span className="text-[#2A758C] font-black">{selectedPrescription.medication_name}</span>
                </h4>
              </div>
              <button
                onClick={onClearPrescription}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-600">
              Scheduled Dose: <strong>{selectedPrescription.frequency}</strong> • Ordered Qty: <strong>{selectedPrescription.quantity}</strong>
            </p>

            <form onSubmit={onConfirmAdministration} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Administration Notes <span className="text-slate-400 font-normal">(Optional)</span>:
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => onAdminNotesChange(e.target.value)}
                  placeholder="e.g. BP 142/94 – notified doctor, given with water, patient tolerated well..."
                  className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClearPrescription}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-administration-btn"
                  disabled={isAdministering}
                  className="px-4 py-1.5 rounded-lg text-xs font-black bg-[#2A758C] text-white hover:bg-[#236376] transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isAdministering ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Administering...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Confirm Administration</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Administration History Section */}
      <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#2A758C]" />
              <span>Administration History</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Log of doses administered by nursing staff for {patientName}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {administrationHistory?.length || 0} Doses Recorded
          </span>
        </div>

        <div className="space-y-2.5">
          {(administrationHistory || []).length === 0 ? (
            <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl p-4 text-xs text-slate-500">
              No medication administration history recorded for this date.
            </div>
          ) : (
            (administrationHistory || []).map((adm) => (
              <div
                key={adm.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 uppercase">
                      {adm.medication_name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Administered
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    <span className="font-bold text-slate-900">By: {adm.administered_by}</span>
                    {adm.notes && (
                      <span className="text-slate-600 block sm:inline sm:ml-2">
                        • {adm.notes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-500 sm:text-right shrink-0">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {adm.administered_at}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
