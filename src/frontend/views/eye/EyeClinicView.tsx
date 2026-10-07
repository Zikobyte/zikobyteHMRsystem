/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 shell (was 1989-line EyeClinicView.tsx, now composes eye/).
 *
 * Shell keeps: props (activeTab, onTabChange), internalTab routing, hook
 * composition, department header + tab nav buttons, modal mounts. Domain
 * state lives in _hooks/, tab JSX in _tabs/, modals in _modals/, shared
 * chrome in _components/, catalogs + light types in _utils/.
 * Lazy entry: App.tsx + lib/routing/routes.ts import '@/views/eye/EyeClinicView'.
 */

import { useState } from 'react';
import { ClipboardList, Eye, Stethoscope, Users } from 'lucide-react';
import EyeAlerts from './_components/EyeAlerts';
import EyeStatsCards from './_components/EyeStatsCards';
import { useEyeClinicData } from './_hooks/useEyeClinicData';
import { useEyeConsultation } from './_hooks/useEyeConsultation';
import { useEyeRegistration } from './_hooks/useEyeRegistration';
import EyeConfirmModal from './_modals/EyeConfirmModal';
import EyeRecordViewModal from './_modals/EyeRecordViewModal';
import EyeRegisterModal from './_modals/EyeRegisterModal';
import AllRecordsTab from './_tabs/AllRecordsTab';
import ConsultationTab from './_tabs/ConsultationTab';
import RegisteredPatientsTab from './_tabs/RegisteredPatientsTab';
import type { EyeInternalTab } from './_utils/eye-types';

interface EyeClinicViewProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function EyeClinicView({ activeTab: propActiveTab, onTabChange }: EyeClinicViewProps = {}) {
  const [internalTab, setInternalTab] = useState<EyeInternalTab>('registered-patients');

  const activeTab = (propActiveTab && propActiveTab !== 'eye-clinic'
    ? propActiveTab
    : internalTab) as EyeInternalTab;

  const handleTabSwitch = (tab: EyeInternalTab) => {
    setInternalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // ---- Phase 5 hooks (domain state + API handlers live in _hooks/) ----
  const data = useEyeClinicData();
  const notify = { showSuccess: data.showSuccess, showError: data.showError };

  const consultation = useEyeConsultation({ notify, refresh: data.fetchEyeClinicData });

  const registration = useEyeRegistration({
    notify,
    patients: data.patients,
    refresh: data.fetchEyeClinicData,
    onPatientFound: (pat) => {
      consultation.selectPatientForConsult(pat);
      handleTabSwitch('consultation');
    }
  });

  const proceedToConsultation = (p: any) => {
    consultation.selectPatientForConsult(p);
    handleTabSwitch('consultation');
  };

  return (
    <div className="w-full bg-slate-50 font-sans space-y-5" id="eye-clinic-module">

      {/* =========================================================
          MAIN WORKSPACE CONTENT AREA
         ========================================================= */}
      <main className="w-full space-y-5 min-w-0 overflow-x-hidden">

        {/* Notifications & Dynamic Alerts */}
        <EyeAlerts
          successMsg={data.successMsg}
          errorMsg={data.errorMsg}
          onClearSuccess={() => data.showSuccess('')}
          onClearError={() => data.showError('')}
        />

        {/* Global Eye Clinic Department Navigation Header */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-100/80 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 shadow-2xs">
              <Eye className="h-6 w-6 text-sky-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Eye Clinic Department</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200">
                  Ophthalmology & Optometry
                </span>
              </div>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                Authoritative ocular database, clinical intake validations, diagnostic examination desk & cashier synchronization.
              </p>
            </div>
          </div>

          <div className="department-page-nav flex flex-wrap items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => handleTabSwitch('registered-patients')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'registered-patients'
                  ? 'bg-[#2A758C] text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>1. Patient Directory</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'registered-patients' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {data.patients.length}
              </span>
            </button>

            <button
              onClick={() => handleTabSwitch('consultation')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'consultation'
                  ? 'bg-[#2A758C] text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              <span>2. Consultation Desk</span>
              {data.waitingConsultations > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-mono font-black animate-pulse">
                  {data.waitingConsultations}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabSwitch('all-records')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'all-records'
                  ? 'bg-[#2A758C] text-white shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <ClipboardList className="h-3.5 w-3.5" />
              <span>3. All Records</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'all-records' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {data.savedRecords.length}
              </span>
            </button>
          </div>
        </div>

        {/* Global Eye Clinic Summary Stat Cards */}
        <EyeStatsCards
          totalRecords={data.totalRecords}
          waitingConsultations={data.waitingConsultations}
          paymentPending={data.paymentPending}
          completedToday={data.completedToday}
        />

        {/* =========================================================
            PAGE 1: REGISTERED PATIENTS VIEW
           ========================================================= */}
        {activeTab === 'registered-patients' && (
          <RegisteredPatientsTab
            allCount={data.patients.length}
            filteredPatients={data.registeredFilteredPatients}
            registeredSearch={data.registeredSearch}
            onRegisteredSearchChange={data.setRegisteredSearch}
            statusFilter={data.statusFilter}
            onStatusFilterChange={data.setStatusFilter}
            onOpenRegister={() => {
              registration.setRegErrors({});
              registration.setIsRegisterModalOpen(true);
            }}
            onSendToCashier={registration.setRegConfirmModalPatient}
            onProceedToConsultation={proceedToConsultation}
          />
        )}

        {/* =========================================================
            PAGE 2: CONSULTATION VIEW
           ========================================================= */}
        {activeTab === 'consultation' && (
          <ConsultationTab
            queue={data.filteredQueue}
            queueSearch={data.queueSearch}
            onQueueSearchChange={data.setQueueSearch}
            consultation={consultation}
          />
        )}

        {/* =========================================================
            PAGE 3: ALL RECORDS VIEW
           ========================================================= */}
        {activeTab === 'all-records' && (
          <AllRecordsTab
            records={data.recordsToDisplay}
            recordsSearch={data.recordsSearch}
            onRecordsSearchChange={data.setRecordsSearch}
            onViewRecord={consultation.setSelectedRecordToView}
          />
        )}

      </main>

      {/* =========================================================
          REGISTER NEW EYE PATIENT MODAL WITH VALIDATION FEEDBACK
         ========================================================= */}
      <EyeRegisterModal
        open={registration.isRegisterModalOpen}
        registration={registration}
        onClose={() => registration.setIsRegisterModalOpen(false)}
      />

      {/* =========================================================
          REGISTRATION CONFIRMATION & CASHIER ROUTING MODAL
         ========================================================= */}
      <EyeConfirmModal
        patient={registration.regConfirmModalPatient}
        onClose={() => registration.setRegConfirmModalPatient(null)}
        onVerify={(patientId) =>
          data.handleVerifyCashierPayment(patientId, {
            onVerified: (updatedPat) => {
              registration.setRegConfirmModalPatient(null);
              if (updatedPat) {
                proceedToConsultation(updatedPat);
              }
            }
          })
        }
      />

      {/* =========================================================
          PRINT / VIEW RECORD MODAL OVERLAY
         ========================================================= */}
      <EyeRecordViewModal
        record={consultation.selectedRecordToView}
        onClose={() => consultation.setSelectedRecordToView(null)}
      />

    </div>
  );
}
