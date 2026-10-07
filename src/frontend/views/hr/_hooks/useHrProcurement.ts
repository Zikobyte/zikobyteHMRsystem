/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx.
 *
 * Procurement hook: owns the requisitions ledger (GET /hr/procurements),
 * the requisition form + add-modal flag, and the submit/status flows
 * (POST /hr/procurements with the computed totalAmount + item_name/items
 * fallback, PATCH /hr/procurements/:id, DELETE /hr/procurements/:id).
 * Ledger JSX lives in _tabs/ProcurementTab, the submitter in
 * _modals/ProcurementModal. apiFetch paths and payloads preserved
 * verbatim. (Note: the Promise.allSettled multi-item submit pattern
 * covered by tests/procurement/submit.test.ts lives in PharmacyView and
 * is untouched by this slice.)
 */

import type * as React from 'react';
import { useState } from 'react';
import { apiFetch } from '../../../utils/api';
import type { Procurement, User } from '../../../types';
import type { HrNotify } from '../_utils/hr-types';

export interface UseHrProcurementOptions {
  notify: HrNotify;
  currentUser?: User | null;
  refreshStats?: () => Promise<void>;
}

export interface UseHrProcurementResult {
  procurements: Procurement[];
  fetchProcurements: () => Promise<void>;
  procurementForm: {
    item_name: string;
    items: string;
    quantity: number;
    unit_price: number;
    amount: number;
    department: string;
    supplier_name: string;
    requested_by: string;
    status: string;
    date: string;
    category: string;
  };
  setProcurementForm: (form: UseHrProcurementResult['procurementForm']) => void;
  showAddProcurementModal: boolean;
  setShowAddProcurementModal: (value: boolean) => void;
  handleSaveProcurement: (e: React.FormEvent) => Promise<void>;
  handleUpdateProcurementStatus: (id: string, status: string) => Promise<void>;
  handleDeleteProcurement: (id: string, itemName: string) => Promise<void>;
}

export function useHrProcurement({ notify, currentUser, refreshStats }: UseHrProcurementOptions): UseHrProcurementResult {
  const { showNotification, setError } = notify;

  const [procurements, setProcurements] = useState<Procurement[]>([]);

  const [procurementForm, setProcurementForm] = useState({
    item_name: '',
    items: '',
    quantity: 1,
    unit_price: 10000,
    amount: 10000,
    department: 'General Hospital',
    supplier_name: 'MedEquip Solutions Ltd',
    requested_by: currentUser?.name || 'HR Department',
    status: 'Ordered',
    date: new Date().toISOString().split('T')[0],
    category: 'Medical Supplies'
  });

  // Modals
  const [showAddProcurementModal, setShowAddProcurementModal] = useState(false);

  const fetchProcurements = async () => {
    try {
      const res = await apiFetch('/hr/procurements');
      if (res.success && Array.isArray(res.data)) {
        setProcurements(res.data);
      }
    } catch (err) {
      console.error('Failed to load procurements:', err);
    }
  };

  // Handlers for Procurement
  const handleSaveProcurement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalAmount = procurementForm.quantity * procurementForm.unit_price;
      const res = await apiFetch('/hr/procurements', {
        method: 'POST',
        body: JSON.stringify({
          ...procurementForm,
          amount: totalAmount,
          item_name: procurementForm.item_name || procurementForm.items,
          items: procurementForm.items || procurementForm.item_name
        })
      });
      if (res.success) {
        showNotification(`Procurement requisition recorded`);
        setShowAddProcurementModal(false);
        setProcurementForm({
          item_name: '',
          items: '',
          quantity: 1,
          unit_price: 10000,
          amount: 10000,
          department: 'General Hospital',
          supplier_name: 'MedEquip Solutions Ltd',
          requested_by: currentUser?.name || 'HR Department',
          status: 'Ordered',
          date: new Date().toISOString().split('T')[0],
          category: 'Medical Supplies'
        });
        await fetchProcurements();
        await refreshStats?.();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save procurement');
    }
  };

  const handleUpdateProcurementStatus = async (id: string, status: string) => {
    try {
      const res = await apiFetch(`/hr/procurements/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (res.success) {
        showNotification(`Procurement status updated to ${status}`);
        await fetchProcurements();
        await refreshStats?.();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update procurement');
    }
  };

  const handleDeleteProcurement = async (id: string, itemName: string) => {
    if (!window.confirm(`Are you sure you want to delete the procurement order for "${itemName}"?`)) return;
    try {
      const res = await apiFetch(`/hr/procurements/${id}`, {
        method: 'DELETE'
      });
      if (res.success) {
        showNotification(`Procurement record deleted`);
        await fetchProcurements();
        await refreshStats?.();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete procurement');
    }
  };

  return {
    procurements,
    fetchProcurements,
    procurementForm,
    setProcurementForm,
    showAddProcurementModal,
    setShowAddProcurementModal,
    handleSaveProcurement,
    handleUpdateProcurementStatus,
    handleDeleteProcurement
  };
}
