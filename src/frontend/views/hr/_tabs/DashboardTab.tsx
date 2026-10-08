/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx (SUBTAB: HR DASHBOARD,
 * verbatim JSX).
 *
 * Overview desk: top-4 KPI metrics, employee distribution by role, and
 * the recent procurement table (live stats with directory fallbacks).
 * Derived counts/roleDist are computed here verbatim from the source
 * view; the shell supplies the cross-domain lists.
 */

import {
  Boxes,
  Briefcase,
  Building2,
  ChevronRight,
  Moon,
  Pill,
  ShieldCheck,
  Stethoscope,
  Sun,
  UserCheck,
  Users
} from 'lucide-react';
import type { Candidate, Employee, HRDashboardStats, JobOpening, Procurement } from '../../../types';

export interface DashboardTabProps {
  stats: HRDashboardStats | null;
  employees: Employee[];
  jobOpenings: JobOpening[];
  candidates: Candidate[];
  procurements: Procurement[];
  onTabChange: (tab: string) => void;
}

export default function DashboardTab({
  stats,
  employees,
  jobOpenings,
  candidates,
  procurements,
  onTabChange
}: DashboardTabProps) {
  // Role distribution calculated from stats or live list
  const roleDist = stats?.roleDistribution || {
    doctors: employees.filter(e => e.role?.toLowerCase().includes('doctor')).length,
    nurses: employees.filter(e => e.role?.toLowerCase().includes('nurse')).length,
    pharmacists: employees.filter(e => e.role?.toLowerCase().includes('pharmacist')).length,
    security: employees.filter(e => e.role?.toLowerCase().includes('security') || e.role?.toLowerCase().includes('guard')).length,
    dayWorkers: employees.filter(e => e.shift?.toLowerCase() === 'day' || e.role?.toLowerCase().includes('day')).length,
    nightWorkers: employees.filter(e => e.shift?.toLowerCase() === 'night' || e.role?.toLowerCase().includes('night')).length,
  };

  const totalEmployeesCount = stats?.totalEmployees ?? employees.length;
  const openPositionsCount = stats?.openPositions ?? jobOpenings.filter(j => j.status === 'Open').length;
  const totalCandidatesCount = stats?.totalCandidates ?? candidates.length;
  const totalProcurementsCount = stats?.totalProcurements ?? procurements.length;

  return (
    <div className="space-y-6">

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Employees */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Employees</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalEmployeesCount}</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Active Staff
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Verified records in database</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
        </div>

        {/* Open Positions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Positions</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{openPositionsCount}</span>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              Hiring
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active vacancy requisitions</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
        </div>

        {/* Total Candidates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Candidates</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalCandidatesCount}</span>
            <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
              Applicants
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">In recruitment pipeline</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-600" />
        </div>

        {/* Total Procurements */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Procurements</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalProcurementsCount}</span>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              Requisitions
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Supply & equipment orders</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
        </div>

      </div>

      {/* Employee Distribution by Role */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Employee Distribution by Role</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown across clinical, nursing, pharmacy, security, day and night staff directly from database
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {totalEmployeesCount} Total Registered
          </span>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-5">

          {/* Doctors */}
          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">Doctors</span>
              <Stethoscope className="w-4 h-4 text-sky-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">{roleDist.doctors}</div>
              <div className="text-[10px] font-bold text-sky-700 mt-0.5">
                {totalEmployeesCount > 0 ? ((roleDist.doctors / totalEmployeesCount) * 100).toFixed(0) : 0}% of staff
              </div>
            </div>
            <div className="w-full bg-sky-200/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full"
                style={{ width: `${totalEmployeesCount > 0 ? (roleDist.doctors / totalEmployeesCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Nurses */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Nurses</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">{roleDist.nurses}</div>
              <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                {totalEmployeesCount > 0 ? ((roleDist.nurses / totalEmployeesCount) * 100).toFixed(0) : 0}% of staff
              </div>
            </div>
            <div className="w-full bg-emerald-200/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${totalEmployeesCount > 0 ? (roleDist.nurses / totalEmployeesCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Pharmacists */}
          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Pharmacists</span>
              <Pill className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">{roleDist.pharmacists}</div>
              <div className="text-[10px] font-bold text-purple-700 mt-0.5">
                {totalEmployeesCount > 0 ? ((roleDist.pharmacists / totalEmployeesCount) * 100).toFixed(0) : 0}% of staff
              </div>
            </div>
            <div className="w-full bg-purple-200/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full"
                style={{ width: `${totalEmployeesCount > 0 ? (roleDist.pharmacists / totalEmployeesCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Security */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Security</span>
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">{roleDist.security}</div>
              <div className="text-[10px] font-bold text-amber-700 mt-0.5">
                {totalEmployeesCount > 0 ? ((roleDist.security / totalEmployeesCount) * 100).toFixed(0) : 0}% of staff
              </div>
            </div>
            <div className="w-full bg-amber-200/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full"
                style={{ width: `${totalEmployeesCount > 0 ? (roleDist.security / totalEmployeesCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Day Workers */}
          <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider">Day Workers</span>
              <Sun className="w-4 h-4 text-orange-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">{roleDist.dayWorkers}</div>
              <div className="text-[10px] font-bold text-orange-700 mt-0.5">
                Day Shift Personnel
              </div>
            </div>
            <div className="w-full bg-orange-200/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-orange-600 h-full rounded-full"
                style={{ width: `${totalEmployeesCount > 0 ? (roleDist.dayWorkers / totalEmployeesCount) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Night Workers */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Night Workers</span>
              <Moon className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">{roleDist.nightWorkers}</div>
              <div className="text-[10px] font-bold text-indigo-700 mt-0.5">
                Night Shift Coverage
              </div>
            </div>
            <div className="w-full bg-indigo-200/60 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${totalEmployeesCount > 0 ? (roleDist.nightWorkers / totalEmployeesCount) * 100 : 0}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Recent Procurement Table (Required by user) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Procurement</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest supply requisitions, pharmaceutical deliveries, and diagnostic equipment orders
            </p>
          </div>
          <button
            onClick={() => onTabChange('hr-procurement')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            View Full Procurement Ledger
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Items</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {((stats?.recentProcurements && stats.recentProcurements.length > 0)
                ? stats.recentProcurements
                : procurements.slice(0, 5)).map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                  {/* Date */}
                  <td className="py-4 px-6 font-mono text-slate-700 whitespace-nowrap">
                    {item.date || new Date().toISOString().split('T')[0]}
                  </td>

                  {/* Items */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{item.items || item.item_name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.department || 'Hospital General'} • Supplier: {item.supplier_name || 'Vendor'}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-6 font-black text-slate-900 whitespace-nowrap">
                    ₦{(item.amount || 0).toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.status === 'Ordered' || item.status === 'Approved'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : item.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {item.status || 'Delivered'}
                    </span>
                  </td>
                </tr>
              ))}

              {(!stats?.recentProcurements || stats.recentProcurements.length === 0) && procurements.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No procurement records found in the database.
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
