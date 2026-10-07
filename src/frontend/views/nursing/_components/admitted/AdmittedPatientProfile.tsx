/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/AdmittedPatientsView.tsx (RIGHT CONTAINER, section 1).
 *
 * Patient demographic & admission profile card: identity row, maternity
 * EDD/GA strip, ward & bed allocation pill, doctor's notes, and the
 * records-date filter. Verbatim JSX; values arrive via props.
 */

import { Baby, Calendar, Phone, Stethoscope } from 'lucide-react';
import type { AdmittedPatient } from '../../_hooks/useAdmittedPatients';

export interface AdmittedPatientProfileProps {
  patient: AdmittedPatient;
  recordsDateFilter: string;
  onRecordsDateFilterChange: (value: string) => void;
}

export default function AdmittedPatientProfile({
  patient: selectedPatient,
  recordsDateFilter,
  onRecordsDateFilterChange,
}: AdmittedPatientProfileProps) {
  return (
    <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {selectedPatient.name}
            </h2>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              {selectedPatient.status || 'ADMITTED'}
            </span>
            {selectedPatient.category && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
                {selectedPatient.category}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
            <span className="font-black text-[#2A758C]">
              ID: {selectedPatient.hospital_number || selectedPatient.id}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-slate-400" />
              Phone: {selectedPatient.phone_number || '08063344556'}
            </span>
            <span>•</span>
            <span>
              DOB: {selectedPatient.date_of_birth || '2000-02-14'} | {selectedPatient.gender || 'Female'}
            </span>
          </div>

          {/* EDD & GA for Maternity patients */}
          {(selectedPatient.edd || selectedPatient.gestational_age || (selectedPatient.category || '').toLowerCase().includes('maternity')) && (
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 pt-1">
              <span className="flex items-center gap-1.5 text-pink-700">
                <Baby className="h-3.5 w-3.5" />
                EDD: {selectedPatient.edd || '2026-06-17'}
              </span>
              <span>•</span>
              <span className="text-slate-700">
                GA: {selectedPatient.gestational_age || '40 weeks'}
              </span>
              {selectedPatient.gravida_para && (
                <>
                  <span>•</span>
                  <span className="text-slate-600">{selectedPatient.gravida_para}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Ward & Bed Allocation Pill */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs self-start text-right min-w-[170px]">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Ward & Bed Allocation</div>
          <div className="text-sm font-black text-slate-900 mt-0.5">
            {selectedPatient.ward}
          </div>
          <div className="text-xs font-bold text-[#2A758C]">
            Bed: {selectedPatient.bed}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Admitted: {selectedPatient.admitted_date}
          </div>
        </div>
      </div>

      {/* Doctor's Notes / Orders */}
      <div className="mt-4 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
          <Stethoscope className="h-3.5 w-3.5 text-[#2A758C]" />
          <span>Doctor's Notes / Orders:</span>
        </div>
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs font-medium text-amber-900 leading-relaxed">
          {selectedPatient.doctor_notes || 'G1P0 in early labour at 40 weeks. Monitoring with partograph. Preeclampsia watch – BP elevated.'}
        </div>
      </div>

      {/* View records for date: Filter */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#2A758C]" />
          <label htmlFor="view-records-date-filter" className="font-bold text-slate-700">
            View records for date:
          </label>
          <input
            id="view-records-date-filter"
            type="date"
            value={recordsDateFilter}
            onChange={(e) => onRecordsDateFilterChange(e.target.value)}
            placeholder="dd/mm/yyyy"
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#2A758C]"
          />
          {recordsDateFilter && (
            <button
              onClick={() => onRecordsDateFilterChange('')}
              className="text-[11px] font-bold text-[#2A758C] hover:underline cursor-pointer"
            >
              Clear date filter
            </button>
          )}
        </div>

        <div className="text-[11px] text-slate-500">
          Showing records for: <span className="font-bold text-slate-700">{recordsDateFilter || 'All Recorded Dates'}</span>
        </div>
      </div>
    </div>
  );
}
