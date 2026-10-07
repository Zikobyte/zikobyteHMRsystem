/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from nursing/_tabs/DetainedPatientsView.tsx (currently detained).
 *
 * "Currently Detained" section: active observation cards with reason,
 * last nurse notes, timestamps, and Admit-to-Ward / Release actions.
 * Verbatim JSX.
 */

import { Activity, BedDouble, Clock, FileText, LogOut } from 'lucide-react';
import type { DetainedPatient, PendingPatient } from '../../_hooks/useDetainedPatients';

export interface DetainedCurrentListProps {
  detainedPatients: DetainedPatient[];
  onAdmit: (patient: PendingPatient | DetainedPatient) => void;
  onRelease: (patient: DetainedPatient) => void;
}

export default function DetainedCurrentList({ detainedPatients, onAdmit, onRelease }: DetainedCurrentListProps) {
  return (
    <div
      id="currently-detained-section"
      className="bg-white border-2 border-amber-500/20 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Currently Detained</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                {detainedPatients.length} Active Observation{detainedPatients.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients under active clinical card observation. Observation entries are maintained without formal admission sheets.
            </p>
          </div>
        </div>
      </div>

      {detainedPatients.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-amber-50/40 border border-amber-200/50">
          <Activity className="h-8 w-8 mx-auto text-amber-500/40 mb-2" />
          <p className="font-bold text-slate-700">No Patients Currently Detained</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            When you mark a patient as detained from the pending admissions list above, they will automatically appear here with their clinical card observations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detainedPatients.map((detained) => (
            <div
              key={detained.id}
              id={`detained-card-${detained.id}`}
              className="bg-white border-2 border-amber-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Top Header Row of Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 flex items-center justify-center font-black text-sm">
                      {detained.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base leading-tight">
                        {detained.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span className="font-mono font-semibold text-slate-700">{detained.hospital_number}</span>
                        <span>•</span>
                        <span>{detained.gender}, {detained.age}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                    Under Observation
                  </span>
                </div>

                {/* Reason for Detainment */}
                <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block mb-0.5">
                    Reason for Detainment
                  </span>
                  <p className="text-xs font-bold text-amber-950 leading-snug">
                    {detained.reason_for_detention}
                  </p>
                </div>

                {/* Last Notes Written by the Nurse while the Patient was Detained */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <FileText className="h-3 w-3 text-[#2A758C]" />
                      Last Notes Written by Nurse (Clinical Card)
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {detained.detained_by}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                    "{detained.last_nurse_notes || detained.initial_observation}"
                  </p>
                </div>

                {/* Detained Timestamp */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    Detained: {detained.detained_at}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {detained.department || 'Observation Unit'}
                  </span>
                </div>
              </div>

              {/* Bottom Action Buttons: Release Button by the side */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`detained-admit-btn-${detained.id}`}
                  onClick={() => onAdmit(detained)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <BedDouble className="h-3.5 w-3.5 text-[#2A758C]" />
                  <span>Admit to Ward</span>
                </button>

                {/* The requested Release button */}
                <button
                  id={`release-btn-${detained.id}`}
                  onClick={() => onRelease(detained)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Release</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
