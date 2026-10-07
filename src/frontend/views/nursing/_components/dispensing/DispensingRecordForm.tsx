/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/NurseDispensingView.tsx.
 *
 * "Record Drug Dispensed" form card with patient/drug autocomplete
 * suggestions and quick-drug shortcuts. Verbatim JSX; state arrives via
 * props (same identifiers as the original locals) and submit/clear arrive
 * via callbacks.
 */

import type React from 'react';
import { AlertCircle, Check, Pill, Plus, RefreshCw, User, X } from 'lucide-react';
import type { DispensingFormErrors, RegisteredPatientOption } from '../../_hooks/useNurseDispensing';

export interface DispensingRecordFormProps {
  patientName: string;
  setPatientName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  drugDispensed: string;
  setDrugDispensed: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  recordedBy: string;
  setRecordedBy: (value: string) => void;
  formErrors: DispensingFormErrors;
  setFormErrors: React.Dispatch<React.SetStateAction<DispensingFormErrors>>;
  saving: boolean;
  showPatientSuggestions: boolean;
  setShowPatientSuggestions: (value: boolean) => void;
  showDrugSuggestions: boolean;
  setShowDrugSuggestions: (value: boolean) => void;
  filteredPatientSuggestions: RegisteredPatientOption[];
  filteredDrugSuggestions: string[];
  onSubmit: (e: React.FormEvent) => void;
  onClearForm: () => void;
}

export default function DispensingRecordForm({
  patientName,
  setPatientName,
  cardNumber,
  setCardNumber,
  drugDispensed,
  setDrugDispensed,
  quantity,
  setQuantity,
  recordedBy,
  setRecordedBy,
  formErrors,
  setFormErrors,
  saving,
  showPatientSuggestions,
  setShowPatientSuggestions,
  showDrugSuggestions,
  setShowDrugSuggestions,
  filteredPatientSuggestions,
  filteredDrugSuggestions,
  onSubmit,
  onClearForm
}: DispensingRecordFormProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2A758C]/10 border border-[#2A758C]/20 flex items-center justify-center text-[#2A758C]">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Record Drug Dispensed</h3>
            <p className="text-xs text-slate-500">
              Enter bedside dispensing details to log medication administration on the patient's card.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Fields marked with</span>
          <span className="text-rose-500 font-bold text-sm">*</span>
          <span className="text-xs text-slate-500 font-medium">are required</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Patient Name * */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Patient Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={patientName}
                onChange={(e) => {
                  setPatientName(e.target.value);
                  setShowPatientSuggestions(true);
                  if (formErrors.patientName) {
                    setFormErrors(prev => ({ ...prev, patientName: undefined }));
                  }
                }}
                onFocus={() => setShowPatientSuggestions(true)}
                placeholder="Patient full name"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all ${
                  formErrors.patientName
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              />
              {patientName && (
                <button
                  type="button"
                  onClick={() => {
                    setPatientName('');
                    setShowPatientSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {formErrors.patientName && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {formErrors.patientName}
              </p>
            )}

            {/* Patient Autocomplete Suggestions */}
            {showPatientSuggestions && filteredPatientSuggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden py-1 max-h-48 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                  Suggested Patients
                </div>
                {filteredPatientSuggestions.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPatientName(p.name);
                      setCardNumber(p.hospital_number);
                      setShowPatientSuggestions(false);
                      setFormErrors(prev => ({ ...prev, patientName: undefined, cardNumber: undefined }));
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#2A758C]/5 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                  >
                    <span className="text-xs font-semibold text-slate-800">{p.name}</span>
                    <span className="text-[11px] font-mono text-[#2A758C] bg-[#2A758C]/10 px-2 py-0.5 rounded-md">
                      {p.hospital_number}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Card Number * */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Card Number <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(e.target.value);
                if (formErrors.cardNumber) {
                  setFormErrors(prev => ({ ...prev, cardNumber: undefined }));
                }
              }}
              placeholder="e.g. OPD-2024-0001"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all ${
                formErrors.cardNumber
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            />
            {formErrors.cardNumber && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {formErrors.cardNumber}
              </p>
            )}
          </div>

          {/* Drug Dispensed * */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Drug Dispensed <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={drugDispensed}
                onChange={(e) => {
                  setDrugDispensed(e.target.value);
                  setShowDrugSuggestions(true);
                  if (formErrors.drugDispensed) {
                    setFormErrors(prev => ({ ...prev, drugDispensed: undefined }));
                  }
                }}
                onFocus={() => setShowDrugSuggestions(true)}
                placeholder="Search drug..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all ${
                  formErrors.drugDispensed
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              />
              {drugDispensed && (
                <button
                  type="button"
                  onClick={() => {
                    setDrugDispensed('');
                    setShowDrugSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {formErrors.drugDispensed && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {formErrors.drugDispensed}
              </p>
            )}

            {/* Drug Autocomplete Suggestions */}
            {showDrugSuggestions && filteredDrugSuggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden py-1 max-h-48 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span>Common Ward Medications</span>
                  <span className="text-[9px] text-slate-500 lowercase">click to select</span>
                </div>
                {filteredDrugSuggestions.map((d, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDrugDispensed(d);
                      setShowDrugSuggestions(false);
                      setFormErrors(prev => ({ ...prev, drugDispensed: undefined }));
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-emerald-50/60 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                  >
                    <span className="text-xs font-semibold text-slate-800">{d}</span>
                    <Pill className="h-3 w-3 text-emerald-500" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quantity * */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Quantity <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                if (formErrors.quantity) {
                  setFormErrors(prev => ({ ...prev, quantity: undefined }));
                }
              }}
              placeholder="e.g. 1 card, 2 bottles"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all ${
                formErrors.quantity
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            />
            {formErrors.quantity && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {formErrors.quantity}
              </p>
            )}
          </div>

          {/* Recorded By */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Recorded By
            </label>
            <div className="relative">
              <input
                type="text"
                value={recordedBy}
                onChange={(e) => setRecordedBy(e.target.value)}
                placeholder="nurse1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all"
              />
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Nurse username or staff identification logged on shift.
            </p>
          </div>

          {/* Action Buttons Column */}
          <div className="flex items-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-5 py-2.5 rounded-xl bg-[#2A758C] hover:bg-[#236377] text-white text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>Save Dispensing Record</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClearForm}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Quick Selection Shortcuts */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Quick Drugs:</span>
          {['Paracetamol 500mg Tabs', 'Amoxicillin 500mg Caps', 'IV Normal Saline 500ml', 'Ibuprofen 400mg Tabs', 'Coartem (AL)'].map((drugItem, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setDrugDispensed(drugItem);
                setShowDrugSuggestions(false);
                if (!quantity) setQuantity('1 card');
                setFormErrors(prev => ({ ...prev, drugDispensed: undefined }));
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-slate-700 transition-all"
            >
              + {drugItem}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
