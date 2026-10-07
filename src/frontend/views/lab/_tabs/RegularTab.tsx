/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx (PAGE 1: REGULAR LAB QUEUE).
 *
 * Doctor-referred queue list + patient details with doctor notes,
 * categorized ordered-tests breakdown, and results submission.
 * Verbatim JSX; state and handlers come from useLabRegular.
 */

import {
  CheckCircle2,
  ChevronRight,
  Clock,
  FlaskConical,
  FlaskRound,
  Loader2,
  Phone,
  Search,
  Send
} from 'lucide-react';
import type { UseLabRegularResult } from '../_hooks/useLabRegular';

export interface RegularTabProps {
  regular: UseLabRegularResult;
  filteredRegularQueue: any[];
  searchQuery: string;
  canSubmitLabResults: boolean;
}

export default function RegularTab({
  regular,
  filteredRegularQueue,
  searchQuery,
  canSubmitLabResults,
}: RegularTabProps) {
  const {
    regularQueue,
    selectedRegularPatient,
    isLoadingRegular,
    isSubmittingRegular,
    regularResultsInput,
    setRegularResultsInput,
    orderedLabTests,
    doctorNotes,
    totalRegularCost,
    groupedOrderedByCategory,
    handleSelectRegularPatient,
    handleSubmitResultsToDoctor,
  } = regular;

  return (
    <div className="space-y-6">
      {/* Summary Metric Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#2A758C] shrink-0 border border-white/10">
            <FlaskConical className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Department Queue Summary</span>
            <h2 className="text-xl font-black tracking-tight">Pending Lab Test Page</h2>
          </div>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block">Total Patients Waiting</span>
          <span className="text-2xl font-black text-white">{regularQueue.length} Patient(s)</span>
        </div>
      </div>

      {/* Two-Column Grid: Left = Waiting List, Right = Patient Details & Test Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Waiting Queue List */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#2A758C]" />
              Patients Waiting in Dept ({filteredRegularQueue.length})
            </h3>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Pending Lab Test
            </span>
          </div>

          {isLoadingRegular ? (
            <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin h-7 w-7 text-[#2A758C]" />
              <span>Loading waiting patients...</span>
            </div>
          ) : regularQueue.length === 0 ? (
            <div className="py-16 text-center p-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No Patients Waiting</p>
              <p className="text-[11px] text-slate-400">All referred laboratory tests have been processed.</p>
            </div>
          ) : filteredRegularQueue.length === 0 ? (
            <div className="py-16 text-center p-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 space-y-2">
              <Search className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No Matching Patients</p>
              <p className="text-[11px] text-slate-400">No patients match "{searchQuery}" in Regular Queue.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredRegularQueue.map((patient) => {
                const isSelected = selectedRegularPatient?.id === patient.id;
                const name = patient.patient_name || patient.name || 'Patient';
                const id = patient.hospital_number || patient.patient_id || patient.id;
                const phone = patient.phone_number || '—';

                return (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectRegularPatient(patient)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#2A758C]/5 border-[#2A758C] shadow-sm'
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{name}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {id}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {phone}
                        </p>
                      </div>
                      <ChevronRight className={`h-5 w-5 mt-1 transition-transform ${isSelected ? 'text-[#2A758C] translate-x-0.5' : 'text-slate-300'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Patient Details & Results Form */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
          {!selectedRegularPatient ? (
            <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center space-y-3 p-8">
              <FlaskRound className="h-12 w-12 text-slate-300" />
              <h3 className="text-sm font-bold text-slate-700">Select a Patient from the Pending Lab Queue</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Click on any patient listed on the left to view doctor notes, ordered tests breakdown, and submit laboratory test results.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Patient Info Header */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedRegularPatient.patient_name || selectedRegularPatient.name || 'Patient'}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium mt-1">
                    <span className="font-mono bg-slate-200/70 px-2 py-0.5 rounded-md font-bold text-slate-800">
                      ID: {selectedRegularPatient.hospital_number || selectedRegularPatient.patient_id || '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {selectedRegularPatient.phone_number || '—'}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 shrink-0 self-start sm:self-auto">
                  Awaiting Lab Processing
                </span>
              </div>

              {/* Doctor's Notes */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-1">
                <span className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider font-mono block">Doctor's Notes</span>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {doctorNotes || 'No notes recorded.'}
                </p>
              </div>

              {/* Categorized Ordered Tests & Cost Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono">
                  Ordered Tests
                </h4>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                  {Object.keys(groupedOrderedByCategory).map((catKey) => (
                    <div key={catKey} className="space-y-2">
                      <span className="text-[11px] font-black text-[#2A758C] uppercase tracking-wider block font-mono border-b border-slate-200/80 pb-1">
                        {catKey}
                      </span>
                      <div className="space-y-1.5 pl-2">
                        {groupedOrderedByCategory[catKey].map((testItem: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-800">
                            <span>{testItem.name}</span>
                            <span className="font-mono text-slate-900 font-bold">₦{(testItem.price || 0).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Total Lab Cost */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between font-black text-sm text-slate-900">
                    <span>Total Lab Cost:</span>
                    <span className="text-[#2A758C] text-base font-mono">₦{totalRegularCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Results Form */}
              <form onSubmit={handleSubmitResultsToDoctor} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold text-slate-800">
                    Lab Results <span className="text-rose-500">*</span>
                  </label>

                  <textarea
                    rows={6}
                    required
                    value={regularResultsInput}
                    onChange={(e) => setRegularResultsInput(e.target.value)}
                    placeholder={`Enter detailed lab test results here...\n\nExample:\nMalaria Parasite: Negative\nBlood Group: O+\nHemoglobin: 14.5 g/dL`}
                    className="w-full p-4 text-xs font-mono text-slate-800 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C] focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRegular || !canSubmitLabResults}
                  title={!canSubmitLabResults ? 'Laboratory staff only' : undefined}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#2A758C] hover:bg-[#1f5869] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingRegular ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      <span>Submitting Results to Doctor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Results to Doctor</span>
                    </>
                  )}
                </button>
                {!canSubmitLabResults && (
                  <p className="text-[11px] text-slate-500 font-medium">Laboratory staff only — results are read-only for your role.</p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
