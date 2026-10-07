/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/AdmittedPatientsView.tsx (TAB 3: VITALS).
 *
 * Record-current-vitals form, initial vitals at registration, and the
 * nursing vital-history rounds. Verbatim JSX; form state arrives via props
 * from useAdmittedPatients.
 */

import type { FormEvent } from 'react';
import { Activity, Check, Clock, Droplet, Heart, RefreshCw, Thermometer, Wind } from 'lucide-react';
import type { VitalRecord } from '../../_hooks/useAdmittedPatients';

export interface AdmittedVitalsTabProps {
  patientName: string;
  initialVitals: VitalRecord | null;
  vitalHistory: VitalRecord[];
  vitalBP: string;
  onVitalBPChange: (value: string) => void;
  vitalHR: string;
  onVitalHRChange: (value: string) => void;
  vitalTemp: string;
  onVitalTempChange: (value: string) => void;
  vitalRR: string;
  onVitalRRChange: (value: string) => void;
  vitalSPO2: string;
  onVitalSPO2Change: (value: string) => void;
  isRecordingVitals: boolean;
  onRecordVitals: (e: FormEvent) => void;
}

export default function AdmittedVitalsTab({
  patientName,
  initialVitals,
  vitalHistory,
  vitalBP,
  onVitalBPChange,
  vitalHR,
  onVitalHRChange,
  vitalTemp,
  onVitalTempChange,
  vitalRR,
  onVitalRRChange,
  vitalSPO2,
  onVitalSPO2Change,
  isRecordingVitals,
  onRecordVitals,
}: AdmittedVitalsTabProps) {
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Form: Record Current Vitals */}
      <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#2A758C]" />
            <span>Record Current Vitals</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Fill in current bedside vital signs for {patientName} to log directly into clinical records.
          </p>
        </div>

        <form onSubmit={onRecordVitals} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Blood Pressure */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Heart className="h-3.5 w-3.5 text-rose-500" />
                <span>Blood Pressure:</span>
              </label>
              <input
                type="text"
                value={vitalBP}
                onChange={(e) => onVitalBPChange(e.target.value)}
                placeholder="e.g. 140/90"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:bg-white"
              />
            </div>

            {/* Heart Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-red-500" />
                <span>Heart Rate (bpm):</span>
              </label>
              <input
                type="text"
                value={vitalHR}
                onChange={(e) => onVitalHRChange(e.target.value)}
                placeholder="e.g. 86"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:bg-white"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Thermometer className="h-3.5 w-3.5 text-amber-500" />
                <span>Temperature (°C):</span>
              </label>
              <input
                type="text"
                value={vitalTemp}
                onChange={(e) => onVitalTempChange(e.target.value)}
                placeholder="e.g. 37.1"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:bg-white"
              />
            </div>

            {/* Respiratory Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Wind className="h-3.5 w-3.5 text-teal-500" />
                <span>Respiratory Rate (cpm):</span>
              </label>
              <input
                type="text"
                value={vitalRR}
                onChange={(e) => onVitalRRChange(e.target.value)}
                placeholder="e.g. 19"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:bg-white"
              />
            </div>

            {/* Oxygen Saturation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Droplet className="h-3.5 w-3.5 text-blue-500" />
                <span>Oxygen Saturation (%):</span>
              </label>
              <input
                type="text"
                value={vitalSPO2}
                onChange={(e) => onVitalSPO2Change(e.target.value)}
                placeholder="e.g. 98"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:bg-white"
              />
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              id="record-vitals-btn"
              disabled={isRecordingVitals}
              className="px-5 py-2 rounded-xl text-xs font-black bg-[#2A758C] text-white hover:bg-[#236376] transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              {isRecordingVitals ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Recording Vitals...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Record Vitals</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Section: Initial Vitals at Registration */}
      <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" />
            <span>Initial Vitals at Registration</span>
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
            Baseline Registration Triage
          </span>
        </div>

        {initialVitals ? (
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-white border border-emerald-100">
                <span className="text-[10px] text-slate-500 font-bold block">Blood Pressure</span>
                <span className="text-sm font-black text-slate-900">
                  {initialVitals.blood_pressure || '135/88'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-emerald-100">
                <span className="text-[10px] text-slate-500 font-bold block">Heart Rate</span>
                <span className="text-sm font-black text-slate-900">
                  {initialVitals.heart_rate || '84'} <span className="text-[10px] font-normal text-slate-500">bpm</span>
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-emerald-100">
                <span className="text-[10px] text-slate-500 font-bold block">Temperature</span>
                <span className="text-sm font-black text-slate-900">
                  {initialVitals.temperature || '36.8'} <span className="text-[10px] font-normal text-slate-500">°C</span>
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-emerald-100">
                <span className="text-[10px] text-slate-500 font-bold block">Resp. Rate</span>
                <span className="text-sm font-black text-slate-900">
                  {initialVitals.respiratory_rate || '18'} <span className="text-[10px] font-normal text-slate-500">cpm</span>
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-emerald-100">
                <span className="text-[10px] text-slate-500 font-bold block">SpO2</span>
                <span className="text-sm font-black text-slate-900">
                  {initialVitals.spo2 || '98'} <span className="text-[10px] font-normal text-slate-500">%</span>
                </span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-slate-600">
              <span>Recorded By: <strong>{initialVitals.recorded_by}</strong></span>
              <span>Timestamp: <strong>{initialVitals.recorded_at}</strong></span>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
            No initial registration vitals found.
          </div>
        )}
      </div>

      {/* Section: Vital History from Nursing Records */}
      <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#2A758C]" />
              <span>Vital History from Nursing Records</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Chronological vital readings taken during ward rounds and monitoring
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {vitalHistory?.length || 0} Recorded Rounds
          </span>
        </div>

        <div className="space-y-3">
          {(vitalHistory || []).length === 0 ? (
            <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl p-4 text-xs text-slate-500">
              No nursing vitals history recorded yet for this date.
            </div>
          ) : (
            (vitalHistory || []).map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Recorded By: <span className="text-[#2A758C] font-black">{v.recorded_by}</span>
                  </span>
                  <span className="text-slate-500 font-bold flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {v.recorded_at}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">BP</span>
                    <span className="font-black text-slate-900">{v.blood_pressure || '—'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">HR</span>
                    <span className="font-black text-slate-900">{v.heart_rate ? `${v.heart_rate} bpm` : '—'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Temp</span>
                    <span className="font-black text-slate-900">{v.temperature ? `${v.temperature} °C` : '—'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">RR</span>
                    <span className="font-black text-slate-900">{v.respiratory_rate ? `${v.respiratory_rate} cpm` : '—'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">SpO2</span>
                    <span className="font-black text-slate-900">{v.spo2 ? `${v.spo2} %` : '—'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
