/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx.
 *
 * Admitted-orders hook: owns the inpatient ward requisitions
 * (localStorage `zmc_pharmacy_admitted` cache with seed rows), the ward
 * filter search, and the dispense-to-ward handler. The shared
 * dispense success/error messaging lives in usePharmacyDispensing and
 * arrives via `notify` so both tabs surface the same banners.
 * Admitted JSX lives in _tabs/AdmittedTab.
 */

import { useEffect, useState } from 'react';
import type * as React from 'react';
import type { AdmittedOrder } from '../_utils/pharmacy-procurement';

export interface PharmacyDispenseNotify {
  setDispenseSuccess: (value: string) => void;
  setDispenseError: (value: string) => void;
}

export interface UsePharmacyAdmittedOptions {
  canActOnAdmitted: boolean;
  roleGuardMessage: string;
  notify: PharmacyDispenseNotify;
}

export interface UsePharmacyAdmittedResult {
  admittedOrders: AdmittedOrder[];
  setAdmittedOrders: React.Dispatch<React.SetStateAction<AdmittedOrder[]>>;
  admittedSearch: string;
  setAdmittedSearch: (value: string) => void;
  handleDispenseAdmittedOrder: (id: string) => void;
}

export function usePharmacyAdmitted({ canActOnAdmitted, roleGuardMessage, notify }: UsePharmacyAdmittedOptions): UsePharmacyAdmittedResult {
  const { setDispenseSuccess, setDispenseError } = notify;

  // State: Admitted Orders
  const [admittedOrders, setAdmittedOrders] = useState<AdmittedOrder[]>(() => {
    const saved = localStorage.getItem('zmc_pharmacy_admitted');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: 'ADM-801',
        patientName: 'Emeka Okonkwo',
        patientId: 'PAT-1082',
        ward: 'Male Surgical Ward',
        bedNumber: 'Bed 04',
        medications: [
          { name: 'CEFTRIAXONE 1g Injection', quantity: 5, unitPrice: 2500, doseSchedule: '1g IV BD x 5 days' },
          { name: 'IV NORMAL SALINE 0.9% 1000ml', quantity: 2, unitPrice: 1500, doseSchedule: '1L IV x 24 hrs' },
          { name: 'PARACETAMOL 1g IV Infusion', quantity: 3, unitPrice: 1500, doseSchedule: '1g IV TDS x 3 days' }
        ],
        totalBill: 20000,
        paymentStatus: 'PAID',
        status: 'Pending Ward Release',
        admittedDate: '08/08/2026'
      },
      {
        id: 'ADM-802',
        patientName: 'Fatima Yusuf',
        patientId: 'PAT-1094',
        ward: 'Maternity Ward',
        bedNumber: 'Bed 02',
        medications: [
          { name: 'OXYTOCIN 10 IU Injection', quantity: 2, unitPrice: 1200, doseSchedule: '10 IU IM stat' },
          { name: 'CEFUROXIME 500mg', quantity: 14, unitPrice: 250, doseSchedule: '500mg BD x 7 days' }
        ],
        totalBill: 5900,
        paymentStatus: 'PAID',
        status: 'Pending Ward Release',
        admittedDate: '09/08/2026'
      }
    ];
  });
  const [admittedSearch, setAdmittedSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('zmc_pharmacy_admitted', JSON.stringify(admittedOrders));
  }, [admittedOrders]);

  // Dispense Admitted Order
  const handleDispenseAdmittedOrder = (id: string) => {
    if (!canActOnAdmitted) {
      setDispenseError(roleGuardMessage);
      return;
    }
    const order = admittedOrders.find(o => o.id === id);
    setAdmittedOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Dispensed' } : o));
    if (order) {
      setDispenseSuccess(`Ward medications for ${order.patientName} (${order.ward} • ${order.bedNumber}) dispensed and released to the ward nurse!`);
      setTimeout(() => setDispenseSuccess(''), 5000);
    }
  };

  return {
    admittedOrders,
    setAdmittedOrders,
    admittedSearch,
    setAdmittedSearch,
    handleDispenseAdmittedOrder
  };
}
