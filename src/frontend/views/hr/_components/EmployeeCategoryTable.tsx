/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx
 * (`renderEmployeeCategoryTable` helper, verbatim as a component).
 *
 * Role-categorized employee table: category header with headcount badge,
 * responsive directory table (name / phone / email / date joined /
 * documents), search-scoped empty state, and the per-row delete action.
 * Rendered six times by _tabs/EmployeesTab (doctors, nurses,
 * pharmacists, securities, day workers, night workers).
 */

import type { ReactNode } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import type { Employee } from '../../../types';

export interface EmployeeCategoryTableProps {
  title: string;
  icon: ReactNode;
  categoryEmployees: Employee[];
  badgeBg: string;
  searchTerm: string;
  onDelete: (id: string, name: string) => Promise<void>;
}

export default function EmployeeCategoryTable({
  title,
  icon,
  categoryEmployees,
  badgeBg,
  searchTerm,
  onDelete
}: EmployeeCategoryTableProps) {
  const filtered = categoryEmployees.filter(e => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.name?.toLowerCase().includes(term) ||
      e.phone?.toLowerCase().includes(term) ||
      e.email?.toLowerCase().includes(term) ||
      e.role?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
      {/* Table Category Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${badgeBg}`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">{title}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {filtered.length} {filtered.length === 1 ? 'Employee' : 'Employees'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Hospital database records for {title.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-6">Name</th>
              <th className="py-3.5 px-6">Phone</th>
              <th className="py-3.5 px-6">Email</th>
              <th className="py-3.5 px-6">Date Joined</th>
              <th className="py-3.5 px-6">Documents</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="font-semibold text-slate-600">No {title.toLowerCase()} found</p>
                    <p className="text-[11px] text-slate-400">
                      {searchTerm ? 'No results matched your search query.' : `No employees currently registered under ${title.toLowerCase()} in the database.`}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Name */}
                  <td className="py-4 px-6">
                    <div className="font-black text-slate-900">{emp.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">ID: {emp.id.substring(0, 8)}</div>
                  </td>

                  {/* Phone */}
                  <td className="py-4 px-6 font-medium text-slate-700">
                    {emp.phone || '—'}
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 text-slate-600">
                    {emp.email || '—'}
                  </td>

                  {/* Date Joined */}
                  <td className="py-4 px-6 text-slate-700 font-medium">
                    {emp.date_joined || emp.hire_date || '—'}
                  </td>

                  {/* Documents */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      {emp.documents_count ?? 0} {emp.documents_count === 1 ? 'doc' : 'docs'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onDelete(emp.id, emp.name)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title={`Delete ${emp.name}`}
                        aria-label={`Delete ${emp.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
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
