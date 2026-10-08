/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx (PAGE 3: PROCUREMENT, verbatim
 * JSX).
 *
 * Medication requisition desk: the multi-row request form (submitted via
 * handleSubmitProcurement in _hooks/usePharmacyProcurement to the HR
 * procurement ledger) and the request cards ledger. The inline error
 * banner below keeps its `role="alert"` + `{procurementError && (`
 * contract for tests/procurement/submit.test.ts.
 */

import type * as React from 'react';
import { AlertCircle, CheckCircle2, Plus, Send } from 'lucide-react';
import type { ProcurementFormRow, ProcurementRequest } from '../_utils/pharmacy-procurement';

export interface ProcurementTabProps {
  procurementSuccess: string;
  procurementError: string;
  setProcurementError: (value: string) => void;
  procurementFormRows: ProcurementFormRow[];
  handleAddProcurementRow: () => void;
  handleRemoveProcurementRow: (id: string) => void;
  handleUpdateProcurementRow: (id: string, field: keyof ProcurementFormRow, value: string) => void;
  handleSubmitProcurement: (e: React.FormEvent) => Promise<void>;
  procurementRequests: ProcurementRequest[];
  canActElsewhere: boolean;
}

export default function ProcurementTab({
  procurementSuccess,
  procurementError,
  setProcurementError,
  procurementFormRows,
  handleAddProcurementRow,
  handleRemoveProcurementRow,
  handleUpdateProcurementRow,
  handleSubmitProcurement,
  procurementRequests,
  canActElsewhere
}: ProcurementTabProps) {
  return (
        <div className="space-y-6">

          {procurementSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{procurementSuccess}</span>
            </div>
          )}

          {procurementError && (
            <div role="alert" className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-800 font-medium flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{procurementError}</span>
              </div>
              <button onClick={() => setProcurementError('')} className="text-rose-700 hover:text-rose-900 text-xs font-bold shrink-0">Dismiss</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column: Request Medication Procurement Form */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">Request Medication Procurement</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Submit a medication request. It will be sent to the HR procurement ledger for approval and fund release.
                </p>
              </div>

              <form onSubmit={handleSubmitProcurement} className="space-y-5">
                <div className="space-y-4">
                  {procurementFormRows.map((row, idx) => {
                    const qtyVal = parseInt(row.quantity) || 0;
                    const priceVal = parseFloat(row.unitPrice) || 0;
                    const rowTotal = qtyVal * priceVal;

                    return (
                      <div key={row.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700 font-mono">
                            Item #{idx + 1}
                          </span>
                          {procurementFormRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveProcurementRow(row.id)}
                              className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-0.5 rounded hover:bg-rose-50 cursor-pointer"
                            >
                              —
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-6 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Medication name</label>
                            <input
                              type="text"
                              placeholder="e.g. CEFTRIAXONE 1g (box of 10)"
                              value={row.name}
                              onChange={e => handleUpdateProcurementRow(row.id, 'name', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                              required
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Qty</label>
                            <input
                              type="number"
                              min="1"
                              placeholder="1"
                              value={row.quantity}
                              onChange={e => handleUpdateProcurementRow(row.id, 'quantity', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                              required
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Price/unit (₦)</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={row.unitPrice}
                              onChange={e => handleUpdateProcurementRow(row.id, 'unitPrice', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                              required
                            />
                          </div>
                        </div>

                        {rowTotal > 0 && (
                          <div className="text-right text-[11px] font-mono font-bold text-amber-900">
                            Subtotal: ₦{rowTotal.toLocaleString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddProcurementRow}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Item
                  </button>

                  <button
                    type="submit"
                    disabled={!canActElsewhere}
                    title={!canActElsewhere ? 'Pharmacist only' : undefined}
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    Submit Request to HR procurement ledger
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: My Procurement Requests Cards */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                My Procurement Requests
              </h2>

              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {procurementRequests.map(req => (
                  <div key={req.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 font-mono">{req.id}</h3>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">{req.timestamp}</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-md font-mono">
                        {req.status}
                      </span>
                    </div>

                    <div className="overflow-x-auto border-t border-b border-slate-200/80 my-2">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100/80 text-[10px] font-black text-slate-600 uppercase tracking-wider font-mono">
                            <th className="py-2 px-3">Item</th>
                            <th className="py-2 px-3">Category</th>
                            <th className="py-2 px-3 text-center">Quantity</th>
                            <th className="py-2 px-3 text-right">Price/Unit</th>
                            <th className="py-2 px-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {req.items.map((item: any, idx: number) => {
                            const unitPrice = item.unitPrice || (item.totalPrice && item.quantity ? Math.round(item.totalPrice / item.quantity) : 0);
                            const category = item.category || 'Pharmaceuticals';
                            return (
                              <tr key={idx} className="hover:bg-slate-100/50">
                                <td className="py-2 px-3 font-sans font-bold text-slate-800">{item.name}</td>
                                <td className="py-2 px-3 text-[11px] text-slate-600">{category}</td>
                                <td className="py-2 px-3 text-center font-bold text-slate-700">{item.quantity}</td>
                                <td className="py-2 px-3 text-right text-slate-600">₦{unitPrice.toLocaleString()}</td>
                                <td className="py-2 px-3 text-right font-black text-slate-900">₦{item.totalPrice.toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono pt-1">
                      <span className="font-bold text-slate-600">Total:</span>
                      <span className="font-black text-sm text-slate-900">₦{req.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
  );
}
