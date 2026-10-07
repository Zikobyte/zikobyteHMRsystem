/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 shell (was 1370-line LaboratoryView.tsx, now composes lab/).
 *
 * Shell keeps: props (activeTab), regular/walkin tab routing, hook
 * composition, department header + page nav buttons, search + alerts,
 * tab mounts, modal mounts. Domain state lives in _hooks/, tab JSX in
 * _tabs/, modals in _modals/, shared chrome in _components/, catalog +
 * light types in _utils/.
 * Lazy entry: App.tsx + lib/routing/routes.ts import
 * '@/views/lab/LaboratoryView' (ORCHESTRATOR rewires — do not touch).
 */

import { useEffect, useState } from 'react';
import {
  ChevronRight,
  FlaskConical,
  FlaskRound,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import { socketManager } from '../../utils/api';
import LabAlerts from './_components/LabAlerts';
import LabSearchBar from './_components/LabSearchBar';
import { useLabRegular } from './_hooks/useLabRegular';
import { useLabRoleGate } from './_hooks/useLabRoleGate';
import { useLabWalkIn } from './_hooks/useLabWalkIn';
import LabActionModal from './_modals/LabActionModal';
import WalkInResultsModal from './_modals/WalkInResultsModal';
import RegularTab from './_tabs/RegularTab';
import WalkInTab from './_tabs/WalkInTab';
import type { LabActionModalState, LabPageTab, LaboratoryViewProps } from './_utils/lab-types';

// Back-compat re-export: catalog now lives in _utils/lab-catalog.ts with an
// identical export name/shape (orchestrator rewires the parity-test import).
export { WALK_IN_LAB_CATALOG } from './_utils/lab-catalog';

export default function LaboratoryView({ activeTab: propActiveTab }: LaboratoryViewProps = {}) {
  // Page Tab state: 'regular' | 'walkin'
  const [activeTab, setActiveTab] = useState<LabPageTab>(propActiveTab === 'lab-walkin' ? 'walkin' : 'regular');

  useEffect(() => {
    if (propActiveTab) setActiveTab(propActiveTab === 'lab-walkin' ? 'walkin' : 'regular');
  }, [propActiveTab]);

  // Feedback messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Action Confirmation Modal State across all laboratory tasks
  const [actionModal, setActionModal] = useState<LabActionModalState | null>(null);

  // Search query filter for laboratory patient lists
  const [searchQuery, setSearchQuery] = useState('');

  // ---- Phase 8 hooks (domain state + API handlers live in _hooks/) ----
  const notify = { setError, setSuccess };
  const modal = { setActionModal };

  const { canSubmitLabResults } = useLabRoleGate();
  const regular = useLabRegular({ notify, modal });
  const walkIn = useLabWalkIn({ notify, modal });

  const refreshQueues = () => {
    regular.fetchRegularQueue();
    walkIn.fetchWalkInQueue();
  };

  useEffect(() => {
    regular.fetchRegularQueue();
    walkIn.fetchWalkInQueue();

    // Auto-poll walk-in queue every 4 seconds to catch Cashier payment confirmations automatically
    const interval = setInterval(() => {
      walkIn.fetchWalkInQueue();
    }, 4000);

    // Subscribe to WebSocket events for live real-time synchronization
    const unsubscribe = socketManager.subscribe((msg: any) => {
      if ([
        'LAB_ORDER_CREATED',
        'PATIENT_ROUTED_TO_LAB',
        'LAB_RESULTS_READY',
        'LAB_WALK_IN_REGISTERED',
        'LAB_WALK_IN_PAID',
        'PAYMENT_HANDOVER_CONFIRMED'
      ].includes(msg.type)) {
        regular.fetchRegularQueue();
        walkIn.fetchWalkInQueue();
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  // Filtered queues based on search query
  const filteredRegularQueue = regular.regularQueue.filter((patient) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const name = (patient.patient_name || patient.name || '').toLowerCase();
    const id = (patient.hospital_number || patient.patient_id || patient.id || '').toLowerCase();
    const phone = (patient.phone_number || '').toLowerCase();
    const notes = (patient.doctor_notes || '').toLowerCase();
    const tests = (patient.ordered_tests || []).map((t: any) => t.name || '').join(' ').toLowerCase();
    return name.includes(q) || id.includes(q) || phone.includes(q) || notes.includes(q) || tests.includes(q);
  });

  const filteredWalkInPending = walkIn.walkInPendingPayment.filter((patient) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const name = (patient.patientName || '').toLowerCase();
    const phone = (patient.phoneNumber || '').toLowerCase();
    const summary = (patient.testsSummary || '').toLowerCase();
    const id = (patient.patientId || patient.encounterId || '').toLowerCase();
    return name.includes(q) || phone.includes(q) || summary.includes(q) || id.includes(q);
  });

  const filteredWalkInPaid = walkIn.walkInPaidReady.filter((patient) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const name = (patient.patientName || '').toLowerCase();
    const phone = (patient.phoneNumber || '').toLowerCase();
    const summary = (patient.testsSummary || '').toLowerCase();
    const id = (patient.patientId || patient.encounterId || '').toLowerCase();
    return name.includes(q) || phone.includes(q) || summary.includes(q) || id.includes(q);
  });

  return (
    <div className="space-y-6" id="laboratory_department_root">
      {/* Top Department Header & Page Selector */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[#2A758C]/10 flex items-center justify-center text-[#2A758C]">
            <FlaskConical className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Laboratory Department
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage doctor-referred pathology queues, walk-in registrations, and result submissions.
            </p>
          </div>
        </div>

        <button
          onClick={refreshQueues}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
          title="Refresh Laboratory Queues"
        >
          <RefreshCw className={`h-4 w-4 ${(regular.isLoadingRegular || walkIn.isLoadingWalkIn) ? 'animate-spin' : ''}`} />
          <span>Refresh Queues</span>
        </button>
      </div>

      {/* Prominent Page Selection Tabs */}
      <div className="department-page-nav grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab('regular')}
          className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'regular'
              ? 'bg-[#2A758C] text-white shadow-md ring-2 ring-[#2A758C]/20'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${activeTab === 'regular' ? 'bg-white/20 text-white' : 'bg-[#2A758C]/10 text-[#2A758C]'}`}>
              <FlaskRound className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight">Regular Lab Queue</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'regular' ? 'bg-white/20 text-white' : 'bg-[#2A758C] text-white'
                }`}>
                  {regular.regularQueue.length} Patient(s) Waiting
                </span>
              </div>
              <p className={`text-xs mt-0.5 font-medium ${activeTab === 'regular' ? 'text-cyan-100' : 'text-slate-500'}`}>
                Doctor-referred patients with confirmed payment waiting for tests
              </p>
            </div>
          </div>
          <ChevronRight className={`h-5 w-5 ${activeTab === 'regular' ? 'text-white' : 'text-slate-400'}`} />
        </button>

        <button
          onClick={() => setActiveTab('walkin')}
          className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer ${
            activeTab === 'walkin'
              ? 'bg-[#2A758C] text-white shadow-md ring-2 ring-[#2A758C]/20'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${activeTab === 'walkin' ? 'bg-white/20 text-white' : 'bg-[#2A758C]/10 text-[#2A758C]'}`}>
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight">Walk-in Lab Patient</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'walkin' ? 'bg-white/20 text-white' : 'bg-[#2A758C] text-white'
                }`}>
                  {walkIn.walkInPaidReady.length + walkIn.walkInPendingPayment.length} Total
                </span>
              </div>
              <p className={`text-xs mt-0.5 font-medium ${activeTab === 'walkin' ? 'text-cyan-100' : 'text-slate-500'}`}>
                Direct Walk-in Patient Registration, Pending Payment & Paid Testing
              </p>
            </div>
          </div>
          <ChevronRight className={`h-5 w-5 ${activeTab === 'walkin' ? 'text-white' : 'text-slate-400'}`} />
        </button>
      </div>

      {/* Laboratory Search Bar */}
      <LabSearchBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        activeTab={activeTab}
        regularResultCount={filteredRegularQueue.length}
        walkInResultCount={filteredWalkInPending.length + filteredWalkInPaid.length}
      />

      {/* Global Toast Feedback */}
      <LabAlerts success={success} error={error} />

      {/* PAGE 1: REGULAR LAB QUEUE */}
      {activeTab === 'regular' && (
        <RegularTab
          regular={regular}
          filteredRegularQueue={filteredRegularQueue}
          searchQuery={searchQuery}
          canSubmitLabResults={canSubmitLabResults}
        />
      )}

      {/* PAGE 2: WALK-IN LAB PATIENT */}
      {activeTab === 'walkin' && (
        <WalkInTab
          walkIn={walkIn}
          filteredWalkInPending={filteredWalkInPending}
          filteredWalkInPaid={filteredWalkInPaid}
          searchQuery={searchQuery}
        />
      )}

      {/* Modal when processing a Paid Walk-In Patient */}
      {walkIn.selectedPaidWalkIn && (
        <WalkInResultsModal
          patient={walkIn.selectedPaidWalkIn}
          resultsInput={walkIn.walkInResultsInput}
          onResultsInputChange={walkIn.setWalkInResultsInput}
          isSubmitting={walkIn.isSubmittingWalkInResults}
          canSubmitLabResults={canSubmitLabResults}
          onClose={() => walkIn.setSelectedPaidWalkIn(null)}
          onSubmit={walkIn.handleProcessPaidWalkIn}
        />
      )}

      {/* GLOBAL LABORATORY ACTION CONFIRMATION MODAL */}
      <LabActionModal modal={actionModal} onClose={() => setActionModal(null)} />
    </div>
  );
}
