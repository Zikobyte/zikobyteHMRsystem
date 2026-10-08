/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 shell (was 2613-line HRDashboardView.tsx, now composes hr/).
 *
 * Shell keeps: props (activeSubTab, onTabChange, currentUser),
 * normalizedSubTab routing, hook composition, department header + tab
 * nav buttons, modal mounts. Domain state lives in _hooks/, tab JSX in
 * _tabs/, modals in _modals/, shared chrome in _components/, light
 * types in _utils/.
 * Lazy entry: App.tsx + lib/routing/routes.ts import
 * '@/views/hr/HRDashboardView' (ORCHESTRATOR rewires — do not touch).
 */

import { useEffect } from 'react';
import {
  Boxes,
  Calendar,
  Percent,
  Plus,
  RefreshCw,
  UserCheck,
  UserPlus,
  Users
} from 'lucide-react';
import type { User } from '../../types';
import HrAlerts from './_components/HrAlerts';
import { LayoutDashboardIcon } from './_components/HrIcons';
import { useHrAbsences } from './_hooks/useHrAbsences';
import { useHrDashboard } from './_hooks/useHrDashboard';
import { useHrDiscounts } from './_hooks/useHrDiscounts';
import { useHrEmployees } from './_hooks/useHrEmployees';
import { useHrProcurement } from './_hooks/useHrProcurement';
import { useHrRecruitment } from './_hooks/useHrRecruitment';
import AbsenceModal from './_modals/AbsenceModal';
import CandidateModal from './_modals/CandidateModal';
import DiscountModal from './_modals/DiscountModal';
import EmployeeModal from './_modals/EmployeeModal';
import JobModal from './_modals/JobModal';
import ProcurementModal from './_modals/ProcurementModal';
import AbsencesTab from './_tabs/AbsencesTab';
import DashboardTab from './_tabs/DashboardTab';
import DiscountsTab from './_tabs/DiscountsTab';
import EmployeesTab from './_tabs/EmployeesTab';
import ProcurementTab from './_tabs/ProcurementTab';
import RecruitmentTab from './_tabs/RecruitmentTab';

interface HRDashboardViewProps {
  activeSubTab: string;
  onTabChange: (tab: string) => void;
  currentUser?: User | null;
}

export default function HRDashboardView({ activeSubTab, onTabChange, currentUser }: HRDashboardViewProps) {
  // ---- Phase 6 hooks (domain state + API handlers live in _hooks/) ----
  const dashboard = useHrDashboard();
  const notify = { showNotification: dashboard.showNotification, setError: dashboard.setError };

  const employees = useHrEmployees({ notify, refreshStats: dashboard.fetchDashboardStats });
  const absences = useHrAbsences({ notify, currentUser });
  const recruitment = useHrRecruitment({ notify, refreshStats: dashboard.fetchDashboardStats });
  const procurement = useHrProcurement({ notify, currentUser, refreshStats: dashboard.fetchDashboardStats });
  const discounts = useHrDiscounts({ notify });

  const fetchAllDomains = () => Promise.all([
    dashboard.fetchDashboardStats(),
    employees.fetchEmployees(),
    absences.fetchAbsences(),
    recruitment.fetchRecruitment(),
    procurement.fetchProcurements(),
    discounts.fetchDiscounts()
  ]);

  const refreshCurrentView = async () => {
    dashboard.setRefreshing(true);
    await fetchAllDomains();
    dashboard.setRefreshing(false);
  };

  useEffect(() => {
    const loadAllData = async () => {
      dashboard.setLoading(true);
      await fetchAllDomains();
      dashboard.setLoading(false);
    };
    loadAllData();
  }, []);

  // Tab mapping
  const normalizedSubTab =
    activeSubTab === 'hr-employees' || activeSubTab === 'employees' ? 'employees' :
    activeSubTab === 'hr-absences' || activeSubTab === 'absences' ? 'absences' :
    activeSubTab === 'hr-recruitment' || activeSubTab === 'recruitment' ? 'recruitment' :
    activeSubTab === 'hr-procurement' || activeSubTab === 'procurement' ? 'procurement' :
    activeSubTab === 'hr-discounts' || activeSubTab === 'discounts' ? 'discounts' :
    'dashboard';

  return (
    <div className="space-y-6 pb-12" id="hr-dashboard-container">

      {/* 1. Header & Navigation Pills */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Human Resources & Procurement</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  Live Database
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hospital workforce analytics, staffing distribution, leave management & procurement logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshCurrentView}
              disabled={dashboard.refreshing}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dashboard.refreshing ? 'animate-spin text-sky-600' : ''}`} />
              Sync Data
            </button>

            {normalizedSubTab === 'employees' && (
              <button
                onClick={() => {
                  employees.setEditingEmployee(null);
                  employees.setShowAddEmployeeModal(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Employee
              </button>
            )}

            {normalizedSubTab === 'absences' && (
              <button
                onClick={() => absences.setShowAddAbsenceModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Log Leave Request
              </button>
            )}

            {normalizedSubTab === 'recruitment' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => recruitment.setShowAddJobModal(true)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Post Job Opening
                </button>
                <button
                  onClick={() => recruitment.setShowAddCandidateModal(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Candidate
                </button>
              </div>
            )}

            {normalizedSubTab === 'procurement' && (
              <button
                onClick={() => procurement.setShowAddProcurementModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Record Procurement
              </button>
            )}

            {normalizedSubTab === 'discounts' && (
              <button
                onClick={() => discounts.setShowAddDiscountModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Discount Scheme
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="department-page-nav flex items-center gap-1.5 mt-4 overflow-x-auto pt-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon className="w-4 h-4" /> },
            { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
            { id: 'absences', label: 'Absences', icon: <Calendar className="w-4 h-4" /> },
            { id: 'recruitment', label: 'Recruitment', icon: <UserCheck className="w-4 h-4" /> },
            { id: 'procurement', label: 'Procurement', icon: <Boxes className="w-4 h-4" /> },
            { id: 'discounts', label: 'Discounts', icon: <Percent className="w-4 h-4" /> },
          ].map((tab) => {
            const isActive = normalizedSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id === 'dashboard' ? 'hr-dashboard' : `hr-${tab.id}`)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Success / Error Alerts */}
      <HrAlerts
        successMsg={dashboard.successMsg}
        error={dashboard.error}
        onDismissError={() => dashboard.setError(null)}
      />

      {/* ========================================================================= */}
      {/* 2. SUBTAB: HR DASHBOARD (MAIN VIEW SPECIFIED BY USER)                     */}
      {/* ========================================================================= */}
      {normalizedSubTab === 'dashboard' && (
        <DashboardTab
          stats={dashboard.stats}
          employees={employees.employees}
          jobOpenings={recruitment.jobOpenings}
          candidates={recruitment.candidates}
          procurements={procurement.procurements}
          onTabChange={onTabChange}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. SUBTAB: EMPLOYEES DIRECTORY (EMPLOYEE MANAGEMENT)                      */}
      {/* ========================================================================= */}
      {normalizedSubTab === 'employees' && (
        <EmployeesTab data={employees} />
      )}

      {/* ========================================================================= */}
      {/* 4. SUBTAB: ABSENCES & LEAVE REQUESTS                                     */}
      {/* ========================================================================= */}
      {normalizedSubTab === 'absences' && (
        <AbsencesTab data={absences} />
      )}

      {/* ========================================================================= */}
      {/* 5. SUBTAB: RECRUITMENT & CANDIDATES                                       */}
      {/* ========================================================================= */}
      {normalizedSubTab === 'recruitment' && (
        <RecruitmentTab data={recruitment} />
      )}

      {/* ========================================================================= */}
      {/* 6. SUBTAB: PROCUREMENTS LEDGER                                           */}
      {/* ========================================================================= */}
      {normalizedSubTab === 'procurement' && (
        <ProcurementTab data={procurement} />
      )}

      {/* ========================================================================= */}
      {/* 7. SUBTAB: DISCOUNTS & STAFF SCHEMES                                      */}
      {/* ========================================================================= */}
      {normalizedSubTab === 'discounts' && (
        <DiscountsTab data={discounts} />
      )}

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}

      {/* ADD EMPLOYEE MODAL */}
      <EmployeeModal data={employees} />

      {/* RECORD NEW ABSENCE MODAL */}
      <AbsenceModal data={absences} employees={employees.employees} />

      {/* ADD JOB OPENING MODAL */}
      <JobModal data={recruitment} />

      {/* ADD CANDIDATE MODAL */}
      <CandidateModal data={recruitment} />

      {/* ADD PROCUREMENT MODAL */}
      <ProcurementModal data={procurement} />

      {/* ADD DISCOUNT MODAL */}
      <DiscountModal data={discounts} />

    </div>
  );
}
