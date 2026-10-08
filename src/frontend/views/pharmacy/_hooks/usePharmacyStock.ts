/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx.
 *
 * Stock hook: owns the bulk-store receive form (drug name + quantity),
 * the stock ledger (localStorage `zmc_pharmacy_stock` cache with seed
 * rows), the receive handler (upsert by drug name), and the success/error
 * messaging. The dispense-time deduction is exposed via setStockLogs so
 * usePharmacyDispensing keeps its verbatim deduct-on-dispense logic.
 * Stock JSX lives in _tabs/StockTab.
 */

import { useEffect, useState } from 'react';
import type * as React from 'react';
import type { StockItem } from '../_utils/pharmacy-procurement';

export interface UsePharmacyStockOptions {
  canActElsewhere: boolean;
  roleGuardMessage: string;
}

export interface UsePharmacyStockResult {
  stockDrugName: string;
  setStockDrugName: (value: string) => void;
  stockQty: string;
  setStockQty: (value: string) => void;
  stockLogs: StockItem[];
  setStockLogs: React.Dispatch<React.SetStateAction<StockItem[]>>;
  stockSuccess: string;
  setStockSuccess: (value: string) => void;
  stockError: string;
  setStockError: (value: string) => void;
  handleAddStockSubmit: (e: React.FormEvent) => void;
}

export function usePharmacyStock({ canActElsewhere, roleGuardMessage }: UsePharmacyStockOptions): UsePharmacyStockResult {
  // State: Stock Log
  const [stockDrugName, setStockDrugName] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [stockLogs, setStockLogs] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('zmc_pharmacy_stock');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { id: 'STK-01', drugName: 'PARACETAMOL 500mg', quantity: 250, lastReceivedQty: 100, lastReceivedDate: '07/08/2026' },
      { id: 'STK-02', drugName: 'OMEPRAZOLE 20mg', quantity: 85, lastReceivedQty: 50, lastReceivedDate: '06/08/2026' },
      { id: 'STK-03', drugName: 'ANTACID SUSPENSION', quantity: 42, lastReceivedQty: 20, lastReceivedDate: '05/08/2026' },
      { id: 'STK-04', drugName: 'CEFTRIAXONE 1g', quantity: 60, lastReceivedQty: 30, lastReceivedDate: '04/08/2026' }
    ];
  });
  const [stockSuccess, setStockSuccess] = useState('');
  const [stockError, setStockError] = useState('');

  useEffect(() => {
    localStorage.setItem('zmc_pharmacy_stock', JSON.stringify(stockLogs));
  }, [stockLogs]);

  // Handler: Stock Log Submit
  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStockError('');
    setStockSuccess('');

    if (!canActElsewhere) {
      setStockError(roleGuardMessage);
      return;
    }

    if (!stockDrugName.trim()) {
      setStockError('Drug name is required.');
      return;
    }
    const qtyVal = parseInt(stockQty);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      setStockError('Please enter a valid quantity from bulk.');
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB');

    setStockLogs(prev => {
      const existingIdx = prev.findIndex(s => s.drugName.toLowerCase() === stockDrugName.trim().toLowerCase());
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qtyVal,
          lastReceivedQty: qtyVal,
          lastReceivedDate: formattedDate
        };
        return updated;
      } else {
        return [
          {
            id: `STK-${Math.floor(10 + Math.random() * 90)}`,
            drugName: stockDrugName.trim().toUpperCase(),
            quantity: qtyVal,
            lastReceivedQty: qtyVal,
            lastReceivedDate: formattedDate
          },
          ...prev
        ];
      }
    });

    setStockSuccess(`Received ${qtyVal} units of ${stockDrugName.toUpperCase()} into pharmacy store.`);
    setStockDrugName('');
    setStockQty('');
    setTimeout(() => setStockSuccess(''), 4000);
  };

  return {
    stockDrugName,
    setStockDrugName,
    stockQty,
    setStockQty,
    stockLogs,
    setStockLogs,
    stockSuccess,
    setStockSuccess,
    stockError,
    setStockError,
    handleAddStockSubmit
  };
}
