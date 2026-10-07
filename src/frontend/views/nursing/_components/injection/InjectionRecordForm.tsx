/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/InjectionRecordsView.tsx.
 *
 * "Log Injection" form card with hospital-patient card autocomplete,
 * injection-type select/custom input, dose + nurse sign, and quick
 * injection shortcuts. Verbatim JSX; state arrives via props (same
 * identifiers as the original locals) and submit/clear arrive via
 * callbacks.
 */

import type React from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Database,
  Plus,
  RefreshCw,
  Syringe,
  User,
  X
} from 'lucide-react';
import type { InjectionFormErrors, RegisteredPatientCard } from '../../_hooks/useInjectionRecords';

export interface InjectionRecordFormProps {
  date: string;
  setDate: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  patientName: string;
  setPatientName: (value: string) => void;
  selectedInjectionType: string;
  setSelectedInjectionType: (value: string) => void;
  customInjectionType: string;
  setCustomInjectionType: (value: string) => void;
  isCustomInjection: boolean;
  setIsCustomInjection: (value: boolean) => void;
  dose: string;
  setDose: (value: string) => void;
  nurseSign: string;
  setNurseSign: (value: string) => void;
  formErrors: InjectionFormErrors;
  setFormErrors: React.Dispatch<React.SetStateAction<InjectionFormErrors>>;
  saving: boolean;
  commonInjections: string[];
  registeredPatients: RegisteredPatientCard[];
  loadingPatients: boolean;
  showCardSuggestions: boolean;
  setShowCardSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPatientCard: RegisteredPatientCard | null;
  setSelectedPatientCard: (value: RegisteredPatientCard | null) => void;
  filteredCardSuggestions: RegisteredPatientCard[];
  cardInputContainerRef: React.RefObject<HTMLDivElement | null>;
  cardInputRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: (e: React.FormEvent) => void;
  onClearForm: () => void;
  onSelectPatient: (p: RegisteredPatientCard) => void;
  onFetchPatients: () => void;
}

export default function InjectionRecordForm({
  date,
  setDate,
  cardNumber,
  setCardNumber,
  patientName,
  setPatientName,
  selectedInjectionType,
  setSelectedInjectionType,
  customInjectionType,
  setCustomInjectionType,
  isCustomInjection,
  setIsCustomInjection,
  dose,
  setDose,
  nurseSign,
  setNurseSign,
  formErrors,
  setFormErrors,
  saving,
  commonInjections,
  registeredPatients,
  loadingPatients,
  showCardSuggestions,
  setShowCardSuggestions,
  selectedPatientCard,
  setSelectedPatientCard,
  filteredCardSuggestions,
  cardInputContainerRef,
  cardInputRef,
  onSubmit,
  onClearForm,
  onSelectPatient,
  onFetchPatients
}: InjectionRecordFormProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2A758C]/10 border border-[#2A758C]/20 flex items-center justify-center text-[#2A758C]">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Log Injection</h3>
            <p className="text-xs text-slate-500">
              Record injectable medication administration and link directly to the patient's card.
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
          {/* Date * */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Date <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (formErrors.date) {
                    setFormErrors(prev => ({ ...prev, date: undefined }));
                  }
                }}
                placeholder="07/09/2026"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all ${
                  formErrors.date
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            {formErrors.date && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {formErrors.date}
              </p>
            )}
          </div>

          {/* Card Number * */}
          <div className="relative" ref={cardInputContainerRef}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Card Number <span className="text-rose-500 font-bold">*</span>
              </label>
              {registeredPatients.length > 0 && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Database className="h-3 w-3 text-[#2A758C]" />
                  <span>{registeredPatients.length} hospital patients</span>
                </span>
              )}
            </div>

            <div className="relative">
              <input
                ref={cardInputRef}
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(e.target.value);
                  setShowCardSuggestions(true);
                  setSelectedPatientCard(null);
                  if (formErrors.cardNumber) {
                    setFormErrors(prev => ({ ...prev, cardNumber: undefined }));
                  }
                }}
                onFocus={() => {
                  setShowCardSuggestions(true);
                  if (registeredPatients.length === 0) {
                    onFetchPatients();
                  }
                }}
                onClick={() => {
                  setShowCardSuggestions(true);
                }}
                placeholder="Search by card ID, name or phone…"
                className={`w-full pl-3.5 pr-16 py-2.5 rounded-xl border text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all ${
                  formErrors.cardNumber
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              />

              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {loadingPatients && (
                  <RefreshCw className="h-3.5 w-3.5 text-[#2A758C] animate-spin" />
                )}
                {cardNumber && (
                  <button
                    type="button"
                    onClick={() => {
                      setCardNumber('');
                      setSelectedPatientCard(null);
                      setShowCardSuggestions(true);
                      cardInputRef.current?.focus();
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    title="Clear card number"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowCardSuggestions(prev => !prev)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                  title={showCardSuggestions ? "Close patient dropdown" : "Show patient dropdown"}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showCardSuggestions ? 'rotate-180 text-[#2A758C]' : ''}`} />
                </button>
              </div>
            </div>

            {formErrors.cardNumber && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {formErrors.cardNumber}
              </p>
            )}

            {/* Selected Patient Verification Pill */}
            {selectedPatientCard && (
              <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-[11px] text-emerald-800">
                <div className="flex items-center gap-1.5 font-medium truncate">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Auto-linked: <strong>{selectedPatientCard.name}</strong></span>
                </div>
                <span className="font-mono text-[10px] bg-emerald-100/70 text-emerald-900 px-1.5 py-0.5 rounded shrink-0">
                  {selectedPatientCard.hospital_number}
                </span>
              </div>
            )}

            {/* Card Database Query & Autocomplete Dropdown */}
            {showCardSuggestions && (
              <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden py-1 max-h-64 flex flex-col">
                <div className="px-3.5 py-2 text-[11px] font-bold text-slate-700 uppercase tracking-wider bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#2A758C]">
                    <Database className="h-3.5 w-3.5" />
                    <span>Hospital Patients ({filteredCardSuggestions.length})</span>
                  </div>
                  <span className="text-[10px] font-normal text-slate-400">Click to select & auto-fill</span>
                </div>

                <div className="overflow-y-auto divide-y divide-slate-100/80">
                  {filteredCardSuggestions.length > 0 ? (
                    filteredCardSuggestions.map((p, idx) => (
                      <button
                        key={`${p.hospital_number}-${idx}`}
                        type="button"
                        onClick={() => onSelectPatient(p)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-[#2A758C]/5 transition-colors flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-[#2A758C] transition-colors truncate">
                              {p.name}
                            </span>
                            {p.gender && (
                              <span className="text-[10px] text-slate-400">({p.gender})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            {p.category && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                {p.category}
                              </span>
                            )}
                            {p.phone_number && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {p.phone_number}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="text-xs font-mono font-bold text-[#2A758C] bg-[#2A758C]/10 group-hover:bg-[#2A758C] group-hover:text-white px-2.5 py-1 rounded-lg transition-colors border border-[#2A758C]/20">
                            {p.hospital_number}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-slate-600 font-medium">
                        No registered patient matches &ldquo;{cardNumber}&rdquo;
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        You can still use this card number and type the patient&apos;s name manually.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowCardSuggestions(false)}
                        className="mt-2 text-xs font-semibold text-[#2A758C] hover:underline"
                      >
                        Use &ldquo;{cardNumber}&rdquo; as manual card
                      </button>
                    </div>
                  )}
                </div>

                {filteredCardSuggestions.length > 0 && (
                  <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Showing {filteredCardSuggestions.length} registered patient{filteredCardSuggestions.length !== 1 ? 's' : ''}</span>
                    <span className="text-slate-500 font-medium">Press Esc to close</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Patient Name * */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Patient Name <span className="text-rose-500 font-bold">*</span>
              </label>
              {selectedPatientCard && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200/60">
                  Auto-filled from database
                </span>
              )}
            </div>
            <input
              type="text"
              value={patientName}
              onChange={(e) => {
                setPatientName(e.target.value);
                if (formErrors.patientName) {
                  setFormErrors(prev => ({ ...prev, patientName: undefined }));
                }
              }}
              placeholder="Auto-filled when card selected, or type manually"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all ${
                formErrors.patientName
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            />
            {formErrors.patientName && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {formErrors.patientName}
              </p>
            )}
          </div>

          {/* Injection Type * */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Injection Type <span className="text-rose-500 font-bold">*</span>
            </label>
            {!isCustomInjection ? (
              <div className="space-y-1.5">
                <select
                  value={selectedInjectionType}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__custom__') {
                      setIsCustomInjection(true);
                      setSelectedInjectionType('');
                    } else {
                      setSelectedInjectionType(val);
                    }
                    if (formErrors.injectionType) {
                      setFormErrors(prev => ({ ...prev, injectionType: undefined }));
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all ${
                    formErrors.injectionType
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <option value="">-- Select injection --</option>
                  {commonInjections.map((inj, idx) => (
                    <option key={idx} value={inj}>
                      {inj}
                    </option>
                  ))}
                  <option value="__custom__">Type injection name...</option>
                </select>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="text"
                  value={customInjectionType}
                  onChange={(e) => {
                    setCustomInjectionType(e.target.value);
                    if (formErrors.injectionType) {
                      setFormErrors(prev => ({ ...prev, injectionType: undefined }));
                    }
                  }}
                  placeholder="Type injection name..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all ${
                    formErrors.injectionType
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomInjection(false);
                    setCustomInjectionType('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#2A758C] hover:underline font-semibold"
                >
                  Select list
                </button>
              </div>
            )}
            {formErrors.injectionType && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {formErrors.injectionType}
              </p>
            )}
          </div>

          {/* Dose * */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Dose <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={dose}
              onChange={(e) => {
                setDose(e.target.value);
                if (formErrors.dose) {
                  setFormErrors(prev => ({ ...prev, dose: undefined }));
                }
              }}
              placeholder="e.g. 500mg, 1 ampoule"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all ${
                formErrors.dose
                  ? 'border-rose-400 bg-rose-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            />
            {formErrors.dose && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {formErrors.dose}
              </p>
            )}
          </div>

          {/* Nurse Sign */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nurse Sign
            </label>
            <div className="relative">
              <input
                type="text"
                value={nurseSign}
                onChange={(e) => setNurseSign(e.target.value)}
                placeholder="nurse1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all"
              />
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Administering nurse signature or identification identifier.
            </p>
          </div>

          {/* Action Buttons Column */}
          <div className="flex items-end gap-3 pt-2 md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#2A758C] hover:bg-[#236377] text-white text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Syringe className="h-4 w-4 stroke-[2.5]" />
                  <span>Save Injection Record</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClearForm}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors"
            >
              Clear Form
            </button>
          </div>
        </div>

        {/* Quick Selection Shortcuts */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Quick Injections:</span>
          {[
            { name: 'IV Hydralazine 10mg', dose: '10mg, 1 ampoule' },
            { name: 'IM Diclofenac 75mg', dose: '75mg, 1 ampoule' },
            { name: 'IV Ceftriaxone 1g', dose: '1g, 1 vial' },
            { name: 'IV Hydrocortisone 100mg', dose: '100mg stat' },
            { name: 'Tetanus Toxoid (TT)', dose: '0.5ml IM' }
          ].map((inj, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSelectedInjectionType(inj.name);
                setIsCustomInjection(false);
                if (!dose) setDose(inj.dose);
                setFormErrors(prev => ({ ...prev, injectionType: undefined }));
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-slate-200 text-slate-700 transition-all"
            >
              + {inj.name}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
