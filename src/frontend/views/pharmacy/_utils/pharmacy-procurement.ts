/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx.
 *
 * Shared pharmacy domain types + pure procurement helpers. The five
 * procurement contracts (EMPTY_PROCUREMENT_MESSAGE,
 * buildProcurementItems, getProcurementValidationError,
 * buildProcurementPayload, partitionProcurementResults) are moved
 * verbatim — names, signatures, and behavior identical — so
 * tests/procurement/submit.test.ts keeps passing after the orchestrator
 * rewires its imports here. Payload shape mirrors POST /hr/procurements
 * as sent by handleSubmitProcurement in _hooks/usePharmacyProcurement.
 */

export interface PrescribedItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PatientQueueItem {
  id: string;
  patientId: string;
  patientName: string;
  hospitalNumber: string;
  phoneNumber: string;
  prescribedMeds: PrescribedItem[];
  totalBill: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL';
  status: 'Pending' | 'Dispensed';
  date: string;
}

export interface AdmittedOrder {
  id: string;
  patientName: string;
  patientId: string;
  ward: string;
  bedNumber: string;
  medications: { name: string; quantity: number; unitPrice: number; doseSchedule: string }[];
  totalBill: number;
  paymentStatus: 'PAID' | 'UNPAID';
  status: 'Pending Ward Release' | 'Dispensed';
  admittedDate: string;
}

export interface ProcurementFormRow {
  id: string;
  name: string;
  quantity: string;
  unitPrice: string;
}

export interface ProcurementRequestItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ProcurementRequest {
  id: string;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Funds Released';
  items: ProcurementRequestItem[];
  total: number;
}

export interface StockItem {
  id: string;
  drugName: string;
  quantity: number;
  lastReceivedQty: number;
  lastReceivedDate: string;
}

/** Normalized pharmacy sub-tab ids routed by the shell. */
export type PharmacyInternalTab = 'dispensing' | 'admitted' | 'procurement' | 'stock';

// Pure procurement helpers (exported for bun:test).
// Payload shape mirrors POST /hr/procurements as sent by handleSubmitProcurement.
export const EMPTY_PROCUREMENT_MESSAGE = 'Please fill in at least one medication item name.';

export function buildProcurementItems(rows: ProcurementFormRow[]): ProcurementRequestItem[] {
  const validItems: ProcurementRequestItem[] = [];
  for (const row of rows) {
    if (!row.name.trim()) continue;
    const qty = parseInt(row.quantity) || 1;
    const price = parseFloat(row.unitPrice) || 0;
    validItems.push({
      name: row.name.trim(),
      quantity: qty,
      unitPrice: price,
      totalPrice: qty * price
    });
  }
  return validItems;
}

export function getProcurementValidationError(validItems: ProcurementRequestItem[]): string | null {
  if (validItems.length === 0) return EMPTY_PROCUREMENT_MESSAGE;
  return null;
}

export function buildProcurementPayload(item: ProcurementRequestItem, requestedBy: string) {
  return {
    item_name: item.name,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    amount: item.totalPrice,
    department: 'Pharmacy',
    requested_by: requestedBy || 'Pharmacy Desk',
    status: 'Pending',
    category: 'Pharmacy Procurement'
  };
}

export function partitionProcurementResults(
  items: ProcurementRequestItem[],
  results: PromiseSettledResult<unknown>[]
): { succeeded: ProcurementRequestItem[]; failed: ProcurementRequestItem[]; errorMessage: string | null } {
  const succeeded: ProcurementRequestItem[] = [];
  const failed: ProcurementRequestItem[] = [];
  items.forEach((item, idx) => {
    const r = results[idx];
    if (r && r.status === 'fulfilled') succeeded.push(item);
    else failed.push(item);
  });
  if (failed.length === 0) return { succeeded, failed, errorMessage: null };
  const names = failed.map(f => f.name).join(', ');
  return {
    succeeded,
    failed,
    errorMessage: `Procurement submission failed for ${failed.length} item(s): ${names}. No request was recorded — please retry.`
  };
}
