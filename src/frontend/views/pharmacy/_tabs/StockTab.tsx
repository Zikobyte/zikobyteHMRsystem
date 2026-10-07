/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx (PAGE 4: STOCK LOG, verbatim
 * JSX).
 *
 * Bulk-store receive form (drug name + quantity from bulk) and the
 * current stock ledger with quantity health badges. State and handlers
 * arrive via props from usePharmacyStock; the role gate arrives as
 * canActElsewhere.
 */

import type * as React from 'react';
import { AlertCircle, Boxes, CheckCircle2, Plus } from 'lucide-react';
import type { StockItem } from '../_utils/pharmacy-procurement';

export interface StockTabProps {
  stockSuccess: string;
  stockError: string;
  stockDrugName: string;
  setStockDrugName: (value: string) => void;
  stockQty: string;
  setStockQty: (value: string) => void;
  stockLogs: StockItem[];
  canActElsewhere: boolean;
  handleAddStockSubmit: (e: React.FormEvent) => void;
}

export default function StockTab({
  stockSuccess,
  stockError,
  stockDrugName,
  setStockDrugName,
  stockQty,
  setStockQty,
  stockLogs,
  canActElsewhere,
  handleAddStockSubmit
}: StockTabProps) {
  return (
        <div className="space-y-6">

          {/* Receive New Stock Form Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Stock Log – Receive New Stock</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Record medications received from the bulk room into the pharmacy store.
              </p>
            </div>

            {stockSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{stockSuccess}</span>
              </div>
            )}

            {stockError && (
              <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-800 font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{stockError}</span>
              </div>
            )}

            <form onSubmit={handleAddStockSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-6 space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Drug Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. PARACETAMOL 500mg"
                  value={stockDrugName}
                  onChange={e => setStockDrugName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Qty from Bulk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="100"
                  value={stockQty}
                  onChange={e => setStockQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={!canActElsewhere}
                  title={!canActElsewhere ? 'Pharmacist only' : undefined}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  Add Stock
                </button>
              </div>
            </form>
          </div>

          {/* Current Stock Table / List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-800">Current Stock</h2>

            {stockLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Boxes className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-600">No stock entries yet</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Drug Name</th>
                      <th className="py-3 px-4 text-center">Store Qty</th>
                      <th className="py-3 px-4 text-center">Last Received Qty</th>
                      <th className="py-3 px-4 text-right">Last Date Received</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {stockLogs.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{item.drugName}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            item.quantity > 50
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.quantity > 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {item.quantity} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-slate-600">+{item.lastReceivedQty}</td>
                        <td className="py-3 px-4 text-right text-slate-500">{item.lastReceivedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
  );
}
