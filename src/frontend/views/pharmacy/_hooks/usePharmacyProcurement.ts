/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx.
 *
 * Procurement hook: owns the medication requisition form rows, the
 * request ledger (localStorage `zmc_pharmacy_procurement` cache with the
 * seed PROC-003 card), the row add/remove/update actions, and
 * handleSubmitProcurement — the honest per-item submitter (POST
 * /hr/procurements via Promise.allSettled, partitioned into
 * succeeded/failed; any failure surfaces the inline error and returns
 * before the local card / success text). apiFetch paths, payload shape
 * (via buildProcurementPayload), and the failure strings are preserved
 * verbatim. Procurement JSX lives in _tabs/ProcurementTab.
 */

import { useEffect, useState } from 'react';
import type * as React from 'react';
import { apiFetch } from '@/utils/api';
import {
  buildProcurementItems,
  buildProcurementPayload,
  EMPTY_PROCUREMENT_MESSAGE,
  getProcurementValidationError,
  partitionProcurementResults
} from '../_utils/pharmacy-procurement';
import type { ProcurementFormRow, ProcurementRequest } from '../_utils/pharmacy-procurement';

export interface UsePharmacyProcurementOptions {
  canActElsewhere: boolean;
  roleGuardMessage: string;
}

export interface UsePharmacyProcurementResult {
  procurementFormRows: ProcurementFormRow[];
  setProcurementFormRows: React.Dispatch<React.SetStateAction<ProcurementFormRow[]>>;
  procurementRequests: ProcurementRequest[];
  setProcurementRequests: React.Dispatch<React.SetStateAction<ProcurementRequest[]>>;
  procurementSuccess: string;
  setProcurementSuccess: (value: string) => void;
  procurementError: string;
  setProcurementError: (value: string) => void;
  handleAddProcurementRow: () => void;
  handleRemoveProcurementRow: (id: string) => void;
  handleUpdateProcurementRow: (id: string, field: keyof ProcurementFormRow, value: string) => void;
  handleSubmitProcurement: (e: React.FormEvent) => Promise<void>;
}

export function usePharmacyProcurement({ canActElsewhere, roleGuardMessage }: UsePharmacyProcurementOptions): UsePharmacyProcurementResult {
  // State: Procurement
  const [procurementFormRows, setProcurementFormRows] = useState<ProcurementFormRow[]>([
    { id: '1', name: '', quantity: '', unitPrice: '' }
  ]);

  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>(() => {
    const saved = localStorage.getItem('zmc_pharmacy_procurement');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: 'PROC-003',
        timestamp: '07/08/2026, 08:00:00',
        status: 'Pending',
        items: [
          { name: 'INSULIN GLARGINE (10 vials)', quantity: 5, unitPrice: 22000, totalPrice: 110000 },
          { name: 'CEFTRIAXONE 1g (box of 10)', quantity: 4, unitPrice: 18000, totalPrice: 72000 },
          { name: 'MAGNESIUM SULPHATE injection', quantity: 4, unitPrice: 4000, totalPrice: 16000 }
        ],
        total: 198000
      }
    ];
  });
  const [procurementSuccess, setProcurementSuccess] = useState('');
  const [procurementError, setProcurementError] = useState('');

  useEffect(() => {
    localStorage.setItem('zmc_pharmacy_procurement', JSON.stringify(procurementRequests));
  }, [procurementRequests]);

  // Handler: Procurement Form Row Actions
  const handleAddProcurementRow = () => {
    setProcurementFormRows(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', quantity: '', unitPrice: '' }
    ]);
  };

  const handleRemoveProcurementRow = (id: string) => {
    if (procurementFormRows.length <= 1) return;
    setProcurementFormRows(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateProcurementRow = (id: string, field: keyof ProcurementFormRow, value: string) => {
    setProcurementFormRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmitProcurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcurementSuccess('');
    setProcurementError('');

    if (!canActElsewhere) {
      setProcurementError(roleGuardMessage);
      return;
    }

    // Validate rows (pure helper; empty rows surface inline validation, not a card)
    const validItems = buildProcurementItems(procurementFormRows);

    const validationError = getProcurementValidationError(validItems);
    if (validationError) {
      setProcurementError(validationError);
      return;
    }

    const nextNumber = procurementRequests.length + 3;
    const reqId = `PROC-${nextNumber.toString().padStart(3, '0')}`;
    const totalCalc = validItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')}, ${now.toLocaleTimeString()}`;

    const savedUser = localStorage.getItem('zmc_user');
    const requestedBy = savedUser ? (JSON.parse(savedUser)?.name || JSON.parse(savedUser)?.username) : undefined;

    try {
      const results = await Promise.allSettled(validItems.map(item => apiFetch('/hr/procurements', {
        method: 'POST',
        body: JSON.stringify(buildProcurementPayload(item, requestedBy || 'Pharmacy Desk'))
      })));
      const { failed, errorMessage } = partitionProcurementResults(validItems, results);
      if (failed.length > 0) {
        setProcurementError(errorMessage ?? EMPTY_PROCUREMENT_MESSAGE);
        return;
      }
    } catch (err: any) {
      const names = validItems.map(item => item.name).join(', ');
      setProcurementError(`Procurement submission failed for ${validItems.length} item(s): ${names}. No request was recorded — please retry.`);
      return;
    }

    const newRequest: ProcurementRequest = {
      id: reqId,
      timestamp: formattedDate,
      status: 'Pending',
      items: validItems,
      total: totalCalc
    };

    setProcurementRequests(prev => [newRequest, ...prev]);
    setProcurementFormRows([{ id: Date.now().toString(), name: '', quantity: '', unitPrice: '' }]);
    setProcurementSuccess(`Procurement request ${reqId} successfully submitted to HR procurement ledger!`);
    setTimeout(() => setProcurementSuccess(''), 5000);
  };

  return {
    procurementFormRows,
    setProcurementFormRows,
    procurementRequests,
    setProcurementRequests,
    procurementSuccess,
    setProcurementSuccess,
    procurementError,
    setProcurementError,
    handleAddProcurementRow,
    handleRemoveProcurementRow,
    handleUpdateProcurementRow,
    handleSubmitProcurement
  };
}
