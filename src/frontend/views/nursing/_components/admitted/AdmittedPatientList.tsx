/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/AdmittedPatientsView.tsx (LEFT CONTAINER).
 *
 * Admitted census header with total count + refresh, search box, ward
 * category chips, and the patient selection cards list. Verbatim JSX;
 * census state arrives via props from useAdmittedPatients.
 */

import { BedDouble, ChevronRight, RefreshCw, Search } from 'lucide-react';
import type { AdmittedPatient } from '../../_hooks/useAdmittedPatients';

export interface AdmittedPatientListProps {
  patients: AdmittedPatient[];
  totalAdmittedCount: number;
  isLoadingPatients: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedWardFilter: string;
  onSelectedWardFilterChange: (value: string) => void;
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  onRefresh: () => void;
}

export default function AdmittedPatientList({
  patients,
  totalAdmittedCount,
  isLoadingPatients,
  searchQuery,
  onSearchQueryChange,
  selectedWardFilter,
  onSelectedWardFilterChange,
  selectedPatientId,
  onSelectPatient,
  onRefresh,
}: AdmittedPatientListProps) {
  return (
    <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col space-y-4">

      {/* Left Container Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>Admitted Patients</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#2A758C]/10 text-[#2A758C]">
              {totalAdmittedCount}
            </span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Select an admitted patient to view complete clinical records
          </p>
        </div>

        <button
          onClick={onRefresh}
          title="Refresh Inpatient Census"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoadingPatients ? 'animate-spin text-[#2A758C]' : ''}`} />
        </button>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, ID, ward, bed..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:bg-white transition-all"
        />
      </div>

      {/* Ward Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        {[
          { id: 'all', label: 'All Wards' },
          { id: 'Maternity', label: 'Maternity Ward' },
          { id: 'General', label: 'General Ward' },
          { id: 'Emergency', label: 'Emergency' },
          { id: 'Female', label: 'Female Ward' },
          { id: 'Male', label: 'Male Ward' }
        ].map((w) => (
          <button
            key={w.id}
            onClick={() => onSelectedWardFilterChange(w.id)}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedWardFilter === w.id
                ? 'bg-[#2A758C] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* Patient Cards List */}
      <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
        {isLoadingPatients ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-[#2A758C]" />
            <span>Loading admitted patient census...</span>
          </div>
        ) : patients.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
            <BedDouble className="h-8 w-8 mx-auto text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-700">No admitted patients found</p>
            <p className="text-[11px] text-slate-400 mt-1">Try adjusting your search query or filter</p>
          </div>
        ) : (
          patients.map((p) => {
            const isSelected = p.id === selectedPatientId;
            const isMaternity = (p.ward || '').toLowerCase().includes('maternity') || (p.category || '').toLowerCase().includes('maternity');
            const isEmergency = (p.ward || '').toLowerCase().includes('emergency') || (p.status || '').toLowerCase().includes('emergency');
            const admittedStatus = isMaternity ? 'MATERNITY WARD' : isEmergency ? 'EMERGENCY' : (p.ward ? p.ward.toUpperCase() : 'GENERAL WARD');
            const statusBadgeColor = isMaternity
              ? 'bg-pink-100 text-pink-800 border-pink-200'
              : isEmergency
                ? 'bg-rose-100 text-rose-800 border-rose-200'
                : 'bg-blue-100 text-blue-800 border-blue-200';

            return (
              <div
                key={p.id}
                id={`admitted-patient-card-${p.id}`}
                onClick={() => onSelectPatient(p.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#2A758C] bg-[#2A758C]/5 shadow-sm ring-2 ring-[#2A758C]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      {p.name}
                      {isMaternity && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-pink-100 text-pink-700">
                          Maternity
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] font-bold text-[#2A758C] mt-0.5">
                      ID: {p.hospital_number || p.id}
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${statusBadgeColor}`}>
                    {admittedStatus}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Ward & Bed:</span>
                    <span className="font-bold text-slate-800">{p.ward} • {p.bed}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Admitted:</span>
                    <span className="font-semibold text-slate-700">{p.admitted_date}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2 text-[10px] font-bold text-[#2A758C] flex items-center gap-1">
                    <span>Selected Inpatient</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
