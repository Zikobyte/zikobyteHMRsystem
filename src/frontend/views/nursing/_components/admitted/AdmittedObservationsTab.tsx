/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/AdmittedPatientsView.tsx (TAB 2: OBSERVATIONS).
 *
 * Record-new-observation form plus the previous-observations log. Verbatim
 * JSX; form state arrives via props from useAdmittedPatients.
 */

import type { FormEvent } from 'react';
import { Check, ClipboardList, Clock, RefreshCw } from 'lucide-react';
import type { ObservationRecord, ObservationType } from '../../_hooks/useAdmittedPatients';

export interface AdmittedObservationsTabProps {
  observations: ObservationRecord[];
  observationType: ObservationType;
  onObservationTypeChange: (value: ObservationType) => void;
  observationDetails: string;
  onObservationDetailsChange: (value: string) => void;
  isRecordingObservation: boolean;
  onRecordObservation: (e: FormEvent) => void;
}

export default function AdmittedObservationsTab({
  observations,
  observationType,
  onObservationTypeChange,
  observationDetails,
  onObservationDetailsChange,
  isRecordingObservation,
  onRecordObservation,
}: AdmittedObservationsTabProps) {
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Container: Record New Observation */}
      <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-[#2A758C]" />
            <span>Record New Observation</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Log clinical observations, patient symptoms, wound care notes, or bedside feedback.
          </p>
        </div>

        <form onSubmit={onRecordObservation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observation Type:
              </label>
              <select
                value={observationType}
                onChange={(e) => onObservationTypeChange(e.target.value as ObservationType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2A758C] focus:bg-white"
              >
                <option value="General">General</option>
                <option value="Wound">Wound</option>
                <option value="Patient complaint">Patient complaint</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Observation Details:
            </label>
            <textarea
              rows={3}
              value={observationDetails}
              onChange={(e) => onObservationDetailsChange(e.target.value)}
              placeholder="Write observation details here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:bg-white transition-all"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              id="record-observation-btn"
              disabled={isRecordingObservation || !observationDetails.trim()}
              className="px-5 py-2 rounded-xl text-xs font-black bg-[#2A758C] text-white hover:bg-[#236376] transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isRecordingObservation ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Record Observation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Container: Previous Observations */}
      <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#2A758C]" />
              <span>Previous Observations</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Observations previously recorded for this particular patient
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {observations?.length || 0} Entries
          </span>
        </div>

        <div className="space-y-3">
          {(observations || []).length === 0 ? (
            <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl p-4 text-xs text-slate-500">
              No previous observations recorded for this patient.
            </div>
          ) : (
            (observations || []).map((obs) => {
              const isComplaint = obs.observation_type === 'Patient complaint';
              const isWound = obs.observation_type === 'Wound';
              return (
                <div
                  key={obs.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        isComplaint
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : isWound
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {obs.observation_type}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        By: {obs.recorded_by}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {obs.recorded_at}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {obs.details}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
