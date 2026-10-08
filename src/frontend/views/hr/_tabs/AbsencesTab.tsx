/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx (SUBTAB: ABSENCES &
 * LEAVE REQUESTS, verbatim JSX).
 *
 * Absence tracker desk: header + record action, daily/weekly/monthly/
 * yearly timeframe tabs, summary metric cards, and the chronological
 * absence records table. State and handlers arrive via the absences
 * hook result; the record form lives in _modals/AbsenceModal.
 */

import { AlertCircle, Calendar, Clock, Plus, Trash2, Users } from 'lucide-react';
import type { UseHrAbsencesResult } from '../_hooks/useHrAbsences';

export interface AbsencesTabProps {
  data: UseHrAbsencesResult;
}

export default function AbsencesTab({ data }: AbsencesTabProps) {
  const {
    absences,
    absenceTimeframe,
    setAbsenceTimeframe,
    setAbsenceForm,
    setShowAddAbsenceModal,
    handleDeleteAbsence
  } = data;

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Absence Tracker</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track staff absence frequency, category reasons, and record daily shift attendance status
          </p>
        </div>
        <button
          onClick={() => {
            setAbsenceForm({
              employee_name: '',
              employee_id: '',
              department: 'Medical',
              date: '2026-08-18',
              status: 'Sick Leave',
              reason: ''
            });
            setShowAddAbsenceModal(true);
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Record Absence
        </button>
      </div>

      {/* Timeframe Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl w-fit border border-slate-200/60">
        {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setAbsenceTimeframe(tf)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              absenceTimeframe === tf
                ? 'bg-white text-sky-700 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Absences */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Absences</span>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">
            {absences.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">All logged staff records</div>
        </div>

        {/* Sick Leave */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Sick Leave</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-amber-600">
            {absences.filter(a => (a.status || a.leave_type || '').toLowerCase().includes('sick')).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Medical & GP certified</div>
        </div>

        {/* Personal Leave */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Personal Leave</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-blue-600">
            {absences.filter(a => {
              const s = (a.status || a.leave_type || '').toLowerCase();
              return s.includes('personal') || s.includes('casual');
            }).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">Bereavement & personal</div>
        </div>

        {/* Unauthorized */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Unauthorized</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-black text-rose-600">
            {absences.filter(a => (a.status || a.leave_type || '').toLowerCase().includes('unauthorized')).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">No-show & unexcused</div>
        </div>
      </div>

      {/* Absence Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Absence Records</h3>
            <p className="text-xs text-slate-500 mt-0.5">Chronological log of staff absences across hospital departments</p>
          </div>
          <div className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
            {absences.length} Total Records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Reason</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {absences.map((abs) => {
                const displayDate = (() => {
                  const d = abs.date || abs.start_date || abs.applied_at;
                  if (!d) return '—';
                  if (d.includes('/')) return d;
                  const parts = d.split('T')[0].split('-');
                  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                  return d;
                })();

                const statusStr = abs.status || abs.leave_type || 'Sick Leave';
                const isSick = statusStr.toLowerCase().includes('sick');
                const isPersonal = statusStr.toLowerCase().includes('personal') || statusStr.toLowerCase().includes('casual');
                const isUnauthorized = statusStr.toLowerCase().includes('unauthorized');
                const isVacation = statusStr.toLowerCase().includes('vacation') || statusStr.toLowerCase().includes('annual');

                return (
                  <tr key={abs.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-slate-700 whitespace-nowrap">
                      {displayDate}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{abs.employee_name}</div>
                      {abs.department && (
                        <div className="text-[11px] text-slate-400 font-medium">{abs.department}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        isSick
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : isPersonal
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : isUnauthorized
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : isVacation
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {statusStr}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-sm text-slate-700 font-medium">
                      {abs.reason || '—'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteAbsence(abs.id, abs.employee_name)}
                        title="Delete absence record"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {absences.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    No absence records logged in the database. Click "Record Absence" to add a new record.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
