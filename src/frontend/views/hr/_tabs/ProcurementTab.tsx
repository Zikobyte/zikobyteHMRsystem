/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx (SUBTAB: PROCUREMENTS
 * LEDGER, verbatim JSX).
 *
 * Procurement desk: quick metrics bar plus the itemized hospital
 * procurement & supplies ledger with per-order status flow. State and
 * handlers arrive via the procurement hook result; the requisition
 * form lives in _modals/ProcurementModal.
 */

import { Boxes, Plus, Trash2 } from 'lucide-react';
import type { UseHrProcurementResult } from '../_hooks/useHrProcurement';

export interface ProcurementTabProps {
  data: UseHrProcurementResult;
}

export default function ProcurementTab({ data }: ProcurementTabProps) {
  const {
    procurements,
    setShowAddProcurementModal,
    handleUpdateProcurementStatus,
    handleDeleteProcurement
  } = data;

  return (
    <div className="space-y-6">
      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Requisitions</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{procurements.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tracked hospital orders</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Spend</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₦{procurements.reduce((sum, p) => sum + (Number(p.amount) || ((p.quantity || 1) * (p.unit_price || 0))), 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Procurement budget</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Delivered & Stocked</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {procurements.filter(p => p.status === 'Delivered').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Completed deliveries</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">In Progress / Pending</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {procurements.filter(p => p.status !== 'Delivered' && p.status !== 'Cancelled').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active fulfillment</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Hospital Procurement & Supplies Ledger ({procurements.length})</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Itemized procurement history per order with category breakdown, unit pricing, and fulfillment state
            </p>
          </div>
          <button
            onClick={() => setShowAddProcurementModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Procurement Order
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Item</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Quantity</th>
                <th className="py-3.5 px-6">Price/Unit</th>
                <th className="py-3.5 px-6">Total</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {procurements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                    No procurement records found in the database.
                  </td>
                </tr>
              ) : (
                procurements.map((proc) => (
                  <tr key={proc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-[13px]">{proc.item_name || proc.items}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {proc.date ? `Date: ${proc.date}` : ''} {proc.supplier_name ? `• ${proc.supplier_name}` : ''} {proc.department ? `• ${proc.department}` : ''}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
                        {proc.category || 'Medical Supplies'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">
                      {proc.quantity || 1}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700 whitespace-nowrap">
                      ₦{Number(proc.unit_price || (proc.amount && proc.quantity ? proc.amount / proc.quantity : proc.amount) || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900 whitespace-nowrap">
                      ₦{Number(proc.amount || ((proc.quantity || 1) * (proc.unit_price || 0))).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        proc.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : proc.status === 'Ordered' || proc.status === 'Approved'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : proc.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {proc.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={proc.status}
                          onChange={(e) => handleUpdateProcurementStatus(proc.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-700 font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Ordered">Ordered</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteProcurement(proc.id, proc.item_name || proc.items)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
