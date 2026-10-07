/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (SUBTAB:
 * ACTIVITY LOG, verbatim JSX).
 *
 * Security audit desk: login/logout/created/reset summary mini-cards,
 * search + action-filter + clear-logs bar, and the audit trail table.
 * State and handlers arrive via the audit-log hook result.
 */

import {
  ChevronDown,
  Key,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  UserPlus
} from 'lucide-react';
import type { UseAuditLogResult } from '../_hooks/useAuditLog';

export interface ActivityLogTabProps {
  data: UseAuditLogResult;
}

export default function ActivityLogTab({ data }: ActivityLogTabProps) {
  const {
    logCounts,
    logSearch,
    setLogSearch,
    actionFilter,
    setActionFilter,
    actionOptions,
    auditLogs,
    fetchAuditLogs,
    filteredLogs,
    getNormalizedAction,
    setIsClearLogsModalOpen,
    formatDate
  } = data;

  return (
    <div className="space-y-5">
      {/* Summary Mini-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* 1. Login */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Login</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center">
              <LogIn className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {logCounts.login}
          </div>
        </div>

        {/* 2. Logout */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Logout</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center">
              <LogOut className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {logCounts.logout}
          </div>
        </div>

        {/* 3. User Created */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">User Created</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
              <UserPlus className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {logCounts.userCreated}
          </div>
        </div>

        {/* 4. Password Reset */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Password Reset</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Key className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {logCounts.passwordReset}
          </div>
        </div>
      </div>

      {/* Search, Action Filter & Clear Logs Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by username, name, or details…"
            value={logSearch}
            onChange={(e) => setLogSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:ring-2 focus:ring-[#2A758C]/15 transition-all"
          />
        </div>

        {/* Filter Dropdown + Clear Logs button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* All Actions Dropdown */}
          <div className="relative">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-3 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2A758C] focus:ring-2 focus:ring-[#2A758C]/15 transition-all appearance-none cursor-pointer"
            >
              {actionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Clear Logs Button */}
          <button
            onClick={() => setIsClearLogsModalOpen(true)}
            disabled={auditLogs.length === 0}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Logs</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={fetchAuditLogs}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">
            No activity logs match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Action</th>
                  <th className="py-3.5 px-5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.map((log) => {
                  const badge = getNormalizedAction(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900">{log.user_name || 'IT Administrator'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {log.user_id && log.user_id.startsWith('audit-') ? 'admin' : (log.user_id || 'admin')}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-medium text-slate-600">
                        {log.user_role || 'IT Administrator'}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-700 font-medium max-w-md">
                        {log.details || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="text-right text-[11px] font-mono text-slate-400 pr-2">
        Showing {filteredLogs.length} of {auditLogs.length} audit trail entries (Max 500 retained)
      </div>
    </div>
  );
}
