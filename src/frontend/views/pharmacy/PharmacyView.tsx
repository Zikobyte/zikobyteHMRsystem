/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 shell (was 1368-line PharmacyView.tsx, now composes pharmacy/).
 *
 * Shell keeps: props (activeTab, onTabChange, currentUser — all
 * optional), Phase 4 role gates (Pharmacist full action, Doctor in
 * Admitted Orders only, admin bypass), internalTab routing
 * (dispensing/admitted/procurement/stock via parent tab + localStorage),
 * hook composition, department header + role notice, tab mounts.
 * Domain state lives in _hooks/, tab JSX in _tabs/, shared chrome in
 * _components/, domain types + pure procurement helpers in
 * _utils/pharmacy-procurement.ts (re-exported here so the pre-slice
 * helper import path keeps working).
 * Lazy entry: App.tsx + lib/routing/routes.ts import
 * '@/views/pharmacy/PharmacyView' (ORCHESTRATOR rewires — do not touch).
 */

import { useEffect, useState } from 'react';
import type { User } from '@/types';
import PharmacyHeader from './_components/PharmacyHeader';
import PharmacyRoleNotice from './_components/PharmacyRoleNotice';
import { usePharmacyAdmitted } from './_hooks/usePharmacyAdmitted';
import { usePharmacyDispensing } from './_hooks/usePharmacyDispensing';
import { usePharmacyProcurement } from './_hooks/usePharmacyProcurement';
import { usePharmacyStock } from './_hooks/usePharmacyStock';
import AdmittedTab from './_tabs/AdmittedTab';
import DispensingTab from './_tabs/DispensingTab';
import ProcurementTab from './_tabs/ProcurementTab';
import StockTab from './_tabs/StockTab';
import type { PharmacyInternalTab } from './_utils/pharmacy-procurement';

// Pre-slice helper import path compatibility (canonical home is
// _utils/pharmacy-procurement.ts — see tests/procurement/submit.test.ts).
export {
  buildProcurementItems,
  buildProcurementPayload,
  EMPTY_PROCUREMENT_MESSAGE,
  getProcurementValidationError,
  partitionProcurementResults
} from './_utils/pharmacy-procurement';
export type { ProcurementFormRow, ProcurementRequestItem } from './_utils/pharmacy-procurement';

interface PharmacyViewProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  currentUser?: Partial<Pick<User, 'role' | 'department' | 'username'>>;
}

export default function PharmacyView({ activeTab: parentActiveTab, onTabChange, currentUser }: PharmacyViewProps = {}) {
  // Phase 4 role gating: desk is visible to all, but only Pharmacy staff
  // (plus Administrator/IT Administrator/Management bypass, mirroring
  // backend auth.middleware isRoleAuthorized) may act outside Admitted
  // Orders. Doctors are fully actionable in Admitted Orders only.
  const currentRole = (currentUser?.role ?? '').trim();
  const currentDepartment = (currentUser?.department ?? '').trim();
  const hasUserContext = currentRole !== '' || currentDepartment !== '';
  const roleLower = currentRole.toLowerCase();
  const deptLower = currentDepartment.toLowerCase();
  const isAdminBypass =
    roleLower === 'administrator' ||
    roleLower === 'it administrator' ||
    roleLower === 'management' ||
    roleLower === 'super administrator';
  // No user context (legacy/test usage) preserves full Pharmacist flow.
  const isPharmacist =
    !hasUserContext ||
    roleLower.includes('pharmac') ||
    deptLower.includes('pharmac') ||
    isAdminBypass;
  const isDoctor = roleLower === 'doctor';
  const canActOnAdmitted = isPharmacist || isDoctor;
  const canActElsewhere = isPharmacist;
  const ROLE_GUARD_MESSAGE =
    'Pharmacist only — Doctors may act only in Admitted Orders.';

  // Active Sub-Tab Navigation
  const [activeTab, setActiveTab] = useState<PharmacyInternalTab>(() => {
    if (parentActiveTab) {
      if (parentActiveTab.includes('admitted')) return 'admitted';
      if (parentActiveTab.includes('procurement')) return 'procurement';
      if (parentActiveTab.includes('stock')) return 'stock';
      return 'dispensing';
    }
    return (localStorage.getItem('zmc_pharmacy_subtab') as PharmacyInternalTab) || 'dispensing';
  });

  useEffect(() => {
    if (parentActiveTab) {
      if (parentActiveTab.includes('admitted')) setActiveTab('admitted');
      else if (parentActiveTab.includes('procurement')) setActiveTab('procurement');
      else if (parentActiveTab.includes('stock')) setActiveTab('stock');
      else setActiveTab('dispensing');
    }
  }, [parentActiveTab]);

  const handleTabChange = (tab: PharmacyInternalTab) => {
    setActiveTab(tab);
    localStorage.setItem('zmc_pharmacy_subtab', tab);
    if (onTabChange) {
      onTabChange(`pharmacy-${tab}`);
    }
  };

  // ---- Phase 8 hooks (domain state + API handlers live in _hooks/) ----
  const stock = usePharmacyStock({ canActElsewhere, roleGuardMessage: ROLE_GUARD_MESSAGE });
  const dispensing = usePharmacyDispensing({
    canActElsewhere,
    roleGuardMessage: ROLE_GUARD_MESSAGE,
    setStockLogs: stock.setStockLogs
  });
  const notify = { setDispenseSuccess: dispensing.setDispenseSuccess, setDispenseError: dispensing.setDispenseError };
  const admitted = usePharmacyAdmitted({
    canActOnAdmitted,
    roleGuardMessage: ROLE_GUARD_MESSAGE,
    notify
  });
  const procurement = usePharmacyProcurement({ canActElsewhere, roleGuardMessage: ROLE_GUARD_MESSAGE });

  return (
    <div className="space-y-6" id="pharmacy_department_root">

      {/* 1. TOP DEPARTMENT HEADER & SUB-NAVIGATION TABS */}
      <PharmacyHeader activeTab={activeTab} />

      {/* Phase 4: read-only notice for non-Pharmacist roles */}
      <PharmacyRoleNotice
        hasUserContext={hasUserContext}
        isPharmacist={isPharmacist}
        isDoctor={isDoctor}
        currentRole={currentRole}
        currentDepartment={currentDepartment}
      />

      {/* ========================================================================= */}
      {/* PAGE 1: DISPENSING PAGE                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'dispensing' && (
        <DispensingTab
          pendingQueue={dispensing.pendingQueue}
          filteredQueue={dispensing.filteredQueue}
          selectedPatient={dispensing.selectedPatient}
          selectedPatientId={dispensing.selectedPatientId}
          setSelectedPatientId={dispensing.setSelectedPatientId}
          dispensingSearch={dispensing.dispensingSearch}
          setDispensingSearch={dispensing.setDispensingSearch}
          dispenseSuccess={dispensing.dispenseSuccess}
          setDispenseSuccess={dispensing.setDispenseSuccess}
          dispenseError={dispensing.dispenseError}
          setDispenseError={dispensing.setDispenseError}
          canActElsewhere={canActElsewhere}
          handleDispenseMeds={dispensing.handleDispenseMeds}
          handleSimulatePayment={dispensing.handleSimulatePayment}
          handleDownloadHMS={dispensing.handleDownloadHMS}
        />
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: ADMITTED ORDERS PAGE                                            */}
      {/* ========================================================================= */}
      {activeTab === 'admitted' && (
        <AdmittedTab
          admittedOrders={admitted.admittedOrders}
          admittedSearch={admitted.admittedSearch}
          setAdmittedSearch={admitted.setAdmittedSearch}
          dispenseSuccess={dispensing.dispenseSuccess}
          setDispenseSuccess={dispensing.setDispenseSuccess}
          dispenseError={dispensing.dispenseError}
          setDispenseError={dispensing.setDispenseError}
          canActOnAdmitted={canActOnAdmitted}
          handleDispenseAdmittedOrder={admitted.handleDispenseAdmittedOrder}
        />
      )}

      {/* ========================================================================= */}
      {/* PAGE 3: PROCUREMENT PAGE                                                */}
      {/* ========================================================================= */}
      {activeTab === 'procurement' && (
        <ProcurementTab
          procurementSuccess={procurement.procurementSuccess}
          procurementError={procurement.procurementError}
          setProcurementError={procurement.setProcurementError}
          procurementFormRows={procurement.procurementFormRows}
          handleAddProcurementRow={procurement.handleAddProcurementRow}
          handleRemoveProcurementRow={procurement.handleRemoveProcurementRow}
          handleUpdateProcurementRow={procurement.handleUpdateProcurementRow}
          handleSubmitProcurement={procurement.handleSubmitProcurement}
          procurementRequests={procurement.procurementRequests}
          canActElsewhere={canActElsewhere}
        />
      )}

      {/* ========================================================================= */}
      {/* PAGE 4: STOCK LOG PAGE                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'stock' && (
        <StockTab
          stockSuccess={stock.stockSuccess}
          stockError={stock.stockError}
          stockDrugName={stock.stockDrugName}
          setStockDrugName={stock.setStockDrugName}
          stockQty={stock.stockQty}
          setStockQty={stock.setStockQty}
          stockLogs={stock.stockLogs}
          canActElsewhere={canActElsewhere}
          handleAddStockSubmit={stock.handleAddStockSubmit}
        />
      )}

    </div>
  );
}
