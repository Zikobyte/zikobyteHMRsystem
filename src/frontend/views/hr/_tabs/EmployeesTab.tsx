/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx (SUBTAB: EMPLOYEES
 * DIRECTORY, verbatim JSX).
 *
 * Employee management desk: heading + add action, global directory
 * search, and the six role-categorized tables (doctors, nurses,
 * pharmacists, securities, day workers, night workers) rendered via
 * _components/EmployeeCategoryTable. State and handlers arrive via the
 * employees hook result.
 */

import {
  Building2,
  Moon,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Sun
} from 'lucide-react';
import EmployeeCategoryTable from '../_components/EmployeeCategoryTable';
import type { UseHrEmployeesResult } from '../_hooks/useHrEmployees';

export interface EmployeesTabProps {
  data: UseHrEmployeesResult;
}

export default function EmployeesTab({ data }: EmployeesTabProps) {
  const {
    employees,
    searchTerm,
    setSearchTerm,
    setShowAddEmployeeModal,
    setEditingEmployee,
    setEmployeeForm,
    handleDeleteEmployee
  } = data;

  return (
    <div className="space-y-6" id="employee-management-view">
      {/* Employee Management Heading & Add Employee Action */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Employee Management</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
              {employees.length} Total Staff
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Role-categorized hospital workforce registry with contact info, registration dates, and document metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="add-employee-top-btn"
            onClick={() => {
              setEditingEmployee(null);
              setEmployeeForm({
                name: '',
                role: 'Nurse',
                department: 'Nursing',
                email: '',
                phone: '',
                shift: 'Day',
                status: 'Active',
                salary: 350000,
                hire_date: new Date().toISOString().split('T')[0],
                date_joined: new Date().toISOString().split('T')[0],
                documents_count: 0
              });
              setShowAddEmployeeModal(true);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name, phone, email across all role tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* 1. DOCTORS TABLE */}
      <EmployeeCategoryTable
        title="Doctors"
        icon={<Stethoscope className="w-4 h-4 text-sky-600" />}
        categoryEmployees={employees.filter(e => (e.role || '').toLowerCase().includes('doctor'))}
        badgeBg="bg-sky-50 border border-sky-100"
        searchTerm={searchTerm}
        onDelete={handleDeleteEmployee}
      />

      {/* 2. NURSES TABLE */}
      <EmployeeCategoryTable
        title="Nurses"
        icon={<Building2 className="w-4 h-4 text-emerald-600" />}
        categoryEmployees={employees.filter(e => (e.role || '').toLowerCase().includes('nurse'))}
        badgeBg="bg-emerald-50 border border-emerald-100"
        searchTerm={searchTerm}
        onDelete={handleDeleteEmployee}
      />

      {/* 3. PHARMACISTS TABLE */}
      <EmployeeCategoryTable
        title="Pharmacists"
        icon={<Pill className="w-4 h-4 text-amber-600" />}
        categoryEmployees={employees.filter(e => (e.role || '').toLowerCase().includes('pharmacist'))}
        badgeBg="bg-amber-50 border border-amber-100"
        searchTerm={searchTerm}
        onDelete={handleDeleteEmployee}
      />

      {/* 4. SECURITIES TABLE */}
      <EmployeeCategoryTable
        title="Securities"
        icon={<ShieldCheck className="w-4 h-4 text-purple-600" />}
        categoryEmployees={employees.filter(e => (e.role || '').toLowerCase().includes('security') || (e.role || '').toLowerCase().includes('guard'))}
        badgeBg="bg-purple-50 border border-purple-100"
        searchTerm={searchTerm}
        onDelete={handleDeleteEmployee}
      />

      {/* 5. DAY WORKERS TABLE */}
      <EmployeeCategoryTable
        title="Day workers"
        icon={<Sun className="w-4 h-4 text-amber-500" />}
        categoryEmployees={employees.filter(e => {
          const role = (e.role || '').toLowerCase();
          const shift = (e.shift || '').toLowerCase();
          if (role.includes('day worker') || role === 'day') return true;
          if (shift === 'day' && !role.includes('doctor') && !role.includes('nurse') && !role.includes('pharmacist') && !role.includes('security') && !role.includes('guard')) {
            return true;
          }
          return false;
        })}
        badgeBg="bg-amber-50/80 border border-amber-200/60"
        searchTerm={searchTerm}
        onDelete={handleDeleteEmployee}
      />

      {/* 6. NIGHT WORKERS TABLE */}
      <EmployeeCategoryTable
        title="Night workers"
        icon={<Moon className="w-4 h-4 text-indigo-600" />}
        categoryEmployees={employees.filter(e => {
          const role = (e.role || '').toLowerCase();
          const shift = (e.shift || '').toLowerCase();
          if (role.includes('night worker') || role === 'night') return true;
          if (shift === 'night' && !role.includes('doctor') && !role.includes('nurse') && !role.includes('pharmacist') && !role.includes('security') && !role.includes('guard')) {
            return true;
          }
          return false;
        })}
        badgeBg="bg-indigo-50 border border-indigo-100"
        searchTerm={searchTerm}
        onDelete={handleDeleteEmployee}
      />
    </div>
  );
}
