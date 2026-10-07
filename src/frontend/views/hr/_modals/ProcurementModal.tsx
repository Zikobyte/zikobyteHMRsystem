/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx (ADD PROCUREMENT
 * MODAL, verbatim JSX).
 *
 * Procurement submitter: requisition form (item/category/quantity/unit
 * price/total/supplier/department) bound to the procurement hook
 * result. Mounted by the shell.
 */

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { UseHrProcurementResult } from '../_hooks/useHrProcurement';

export interface ProcurementModalProps {
  data: UseHrProcurementResult;
}

export default function ProcurementModal({ data }: ProcurementModalProps) {
  const {
    showAddProcurementModal,
    setShowAddProcurementModal,
    procurementForm,
    setProcurementForm,
    handleSaveProcurement
  } = data;

  return (
    <AnimatePresence>
      {showAddProcurementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Record Procurement Requisition</h3>
              <button onClick={() => setShowAddProcurementModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProcurement} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Item(s) Name / Description *</label>
                  <input
                    type="text"
                    required
                    value={procurementForm.items}
                    onChange={(e) => setProcurementForm({ ...procurementForm, items: e.target.value, item_name: e.target.value })}
                    placeholder="e.g. Digital BP Monitors (x10)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={procurementForm.category}
                    onChange={(e) => setProcurementForm({ ...procurementForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Medical Supplies">Medical Supplies</option>
                    <option value="Diagnostic Equipment">Diagnostic Equipment</option>
                    <option value="Pharmaceuticals">Pharmaceuticals</option>
                    <option value="Consumables">Consumables</option>
                    <option value="Facility & Linen">Facility & Linen</option>
                    <option value="Surgical Equipment">Surgical Equipment</option>
                    <option value="Laboratory Reagents">Laboratory Reagents</option>
                    <option value="Office & Admin">Office & Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={procurementForm.quantity}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value, 10) || 1;
                      setProcurementForm({ ...procurementForm, quantity: qty, amount: qty * procurementForm.unit_price });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Price (₦)</label>
                  <input
                    type="number"
                    value={procurementForm.unit_price}
                    onChange={(e) => {
                      const unit = parseFloat(e.target.value) || 0;
                      setProcurementForm({ ...procurementForm, unit_price: unit, amount: procurementForm.quantity * unit });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Amount (₦)</label>
                  <input
                    type="number"
                    value={procurementForm.amount}
                    onChange={(e) => setProcurementForm({ ...procurementForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-black text-sky-700 bg-sky-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={procurementForm.status}
                    onChange={(e) => setProcurementForm({ ...procurementForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Ordered">Ordered</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    value={procurementForm.supplier_name}
                    onChange={(e) => setProcurementForm({ ...procurementForm, supplier_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={procurementForm.department}
                    onChange={(e) => setProcurementForm({ ...procurementForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProcurementModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700"
                >
                  Record Requisition
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
