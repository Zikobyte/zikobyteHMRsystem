/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from nursing/_tabs/DetainedPatientsView.tsx (pending table).
 *
 * "Mark patient as detained from pending admissions" container: header with
 * total-detained badge + search + refresh, and the pending admissions table
 * with Detain/Admit row actions. Verbatim JSX.
 */

import { Activity, BedDouble, ClipboardList, Clock, Phone, RefreshCw, Search } from 'lucide-react';
import type { DetainedPatient, PendingPatient } from '../../_hooks/useDetainedPatients';

export interface DetainedPendingTableProps {
  pendingPatients: PendingPatient[];
  totalDetainedCount: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
  onDetain: (patient: PendingPatient) => void;
  onAdmit: (patient: PendingPatient | DetainedPatient) => void;
}

export default function DetainedPendingTable({
  pendingPatients,
  totalDetainedCount,
  searchQuery,
  setSearchQuery,
  isLoading,
  onRefresh,
  onDetain,
  onAdmit
}: DetainedPendingTableProps) {
  return (
    <div
      id="pending-admissions-container"
      className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5"
    >
      {/* Table Header with Title, Total Detained Badge, and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <ClipboardList className="h-5 w-5 text-[#2A758C]" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Mark patient as detained from pending admissions
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Select any pending patient to detain for observation or complete formal ward admission.
          </p>
        </div>

        {/* Metrics & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Total Detained Patients Count Badge */}
          <div
            id="total-detained-metric-badge"
            className="bg-amber-50 border border-amber-200/80 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-2xs"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block leading-none">
                Total Detained
              </span>
              <span className="text-base font-black text-amber-950 leading-tight">
                {totalDetainedCount} {totalDetainedCount === 1 ? 'Patient' : 'Patients'}
              </span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient name, ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20 focus:border-[#2A758C] text-slate-800 font-medium transition-all"
            />
          </div>

          <button
            onClick={onRefresh}
            title="Refresh Data"
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-[#2A758C]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Pending Admissions Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-3.5">Patient Details</th>
              <th scope="col" className="px-4 py-3.5">Demographics</th>
              <th scope="col" className="px-4 py-3.5">Department / Referred By</th>
              <th scope="col" className="px-4 py-3.5">Observation / Admission Reason</th>
              <th scope="col" className="px-4 py-3.5">Time Logged</th>
              <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white font-medium">
            {pendingPatients.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30 text-[#2A758C]" />
                  <p className="font-semibold text-slate-600">No pending admissions found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">All triage candidates have either been detained or admitted to wards.</p>
                </td>
              </tr>
            ) : (
              pendingPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#2A758C]/10 border border-[#2A758C]/20 text-[#2A758C] flex items-center justify-center font-black text-xs shrink-0">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-sm leading-snug">
                          {patient.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {patient.hospital_number || patient.patient_id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-0.5">
                      <span className="text-slate-800 font-semibold block">
                        {patient.gender} • {patient.age}
                      </span>
                      {patient.phone_number && (
                        <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                          <Phone className="h-2.5 w-2.5" />
                          {patient.phone_number}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                        {patient.department || 'Outpatient'}
                      </span>
                      {patient.referred_by && (
                        <span className="text-[10px] text-slate-500 block">
                          Ref: {patient.referred_by}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 max-w-xs">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {patient.reason || 'Pending clinical assessment'}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-[11px] whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{patient.pending_since || 'Recent'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {/* Detain Button */}
                      <button
                        id={`detain-btn-${patient.id}`}
                        onClick={() => onDetain(patient)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Activity className="h-3.5 w-3.5" />
                        <span>Detain</span>
                      </button>

                      {/* Admit Button */}
                      <button
                        id={`admit-btn-${patient.id}`}
                        onClick={() => onAdmit(patient)}
                        className="px-3 py-1.5 rounded-xl bg-[#2A758C] hover:bg-[#225f72] text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <BedDouble className="h-3.5 w-3.5" />
                        <span>Admit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
