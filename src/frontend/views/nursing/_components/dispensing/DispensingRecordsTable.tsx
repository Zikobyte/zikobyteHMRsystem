/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/NurseDispensingView.tsx.
 *
 * "All Dispensing Records" audit register card: status filter tabs,
 * search, refresh, records table, and footer notice. Verbatim JSX;
 * review-toggle and delete arrive via callbacks.
 */

import { Calendar, CheckCheck, CheckCircle2, ClipboardList, Clock, Pill, RefreshCw, Search, ShieldCheck, Trash2, User, X } from 'lucide-react';
import type { DispensingRecord, DispensingStatusFilter } from '../../_hooks/useNurseDispensing';

export interface DispensingRecordsTableProps {
  filteredRecords: DispensingRecord[];
  isEmpty: boolean;
  totalCount: number;
  pendingCount: number;
  reviewedCount: number;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: DispensingStatusFilter;
  setStatusFilter: (value: DispensingStatusFilter) => void;
  onRefresh: () => void;
  onToggleReview: (recordId: string) => void;
  onDeleteRecord: (recordId: string, name: string) => void;
}

export default function DispensingRecordsTable({
  filteredRecords,
  isEmpty,
  totalCount,
  pendingCount,
  reviewedCount,
  loading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onRefresh,
  onToggleReview,
  onDeleteRecord
}: DispensingRecordsTableProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">All Dispensing Records</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2A758C]/10 text-[#2A758C] border border-[#2A758C]/20">
              {filteredRecords.length} {filteredRecords.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Live audit register of medications dispensed by the nursing staff at bedside or triage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs font-medium text-slate-600">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'pending' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('reviewed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'reviewed' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Reviewed ({reviewedCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, card, drug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2A758C]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh dispensing records"
            className="p-2 text-slate-500 hover:text-[#2A758C] hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shrink-0 self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#2A758C]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dispensing Records Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Patient Name</th>
              <th className="py-3.5 px-4">Card No</th>
              <th className="py-3.5 px-4">Drug</th>
              <th className="py-3.5 px-4">Qty</th>
              <th className="py-3.5 px-4">Recorded By</th>
              <th className="py-3.5 px-4 text-center">Reviewed?</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading && isEmpty ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-[#2A758C]" />
                    <span className="font-medium text-slate-500">Loading dispensing logs...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ClipboardList className="h-8 w-8 text-slate-300" />
                    <span className="font-medium text-slate-600">No dispensing records found</span>
                    <span className="text-[11px] text-slate-400">
                      {searchQuery ? 'Try adjusting your search criteria' : 'Fill out the form above to record drug dispensing'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr
                  key={rec.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold font-mono">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{rec.date}</span>
                    </div>
                  </td>

                  {/* Patient Name */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900 block">{rec.patient_name}</span>
                  </td>

                  {/* Card No */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {rec.card_number}
                    </span>
                  </td>

                  {/* Drug */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Pill className="h-3 w-3" />
                      </div>
                      <span className="font-semibold text-slate-800">{rec.drug}</span>
                    </div>
                  </td>

                  {/* Qty */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                      {rec.quantity}
                    </span>
                  </td>

                  {/* Recorded By */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <User className="h-3 w-3 text-slate-400" />
                      <span className="font-medium">{rec.recorded_by}</span>
                    </div>
                  </td>

                  {/* Reviewed? */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {rec.reviewed ? (
                      <button
                        type="button"
                        onClick={() => onToggleReview(rec.id)}
                        title={`Click to toggle. Reviewed by ${rec.reviewed_by || 'Staff'} on ${rec.reviewed_at || 'record'}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Reviewed</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleReview(rec.id)}
                        title="Click to sign off as Reviewed"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        <span>Pending</span>
                      </button>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleReview(rec.id)}
                        className="p-1 text-slate-400 hover:text-[#2A758C] hover:bg-slate-100 rounded-lg transition-colors"
                        title={rec.reviewed ? 'Mark as Unreviewed' : 'Mark as Reviewed'}
                      >
                        <CheckCheck className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(rec.id, rec.patient_name)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info notice */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>All dispensing transactions are cryptographically logged for pharmacy inventory reconciliation.</span>
        </div>
        <div>
          Showing <strong className="text-slate-700">{filteredRecords.length}</strong> of <strong className="text-slate-700">{totalCount}</strong> total dispensing logs
        </div>
      </div>
    </div>
  );
}
