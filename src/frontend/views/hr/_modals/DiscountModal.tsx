/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx (ADD DISCOUNT MODAL,
 * verbatim JSX).
 *
 * Discount definer: welfare policy form bound to the discounts hook
 * result. Mounted by the shell.
 */

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { UseHrDiscountsResult } from '../_hooks/useHrDiscounts';

export interface DiscountModalProps {
  data: UseHrDiscountsResult;
}

export default function DiscountModal({ data }: DiscountModalProps) {
  const {
    showAddDiscountModal,
    setShowAddDiscountModal,
    discountForm,
    setDiscountForm,
    handleSaveDiscount
  } = data;

  return (
    <AnimatePresence>
      {showAddDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Define Staff / Welfare Discount Policy</h3>
              <button onClick={() => setShowAddDiscountModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDiscount} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Policy Title *</label>
                <input
                  type="text"
                  required
                  value={discountForm.title}
                  onChange={(e) => setDiscountForm({ ...discountForm, title: e.target.value })}
                  placeholder="e.g. Hospital Staff Medical Welfare Benefit"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount Code</label>
                  <input
                    type="text"
                    value={discountForm.discount_code}
                    onChange={(e) => setDiscountForm({ ...discountForm, discount_code: e.target.value.toUpperCase() })}
                    placeholder="e.g. STAFF50"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Percentage (% OFF)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountForm.percentage}
                    onChange={(e) => setDiscountForm({ ...discountForm, percentage: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Applicable Hospital Services</label>
                <input
                  type="text"
                  value={discountForm.applicable_service}
                  onChange={(e) => setDiscountForm({ ...discountForm, applicable_service: e.target.value })}
                  placeholder="All Consultations, Routine Diagnostics & In-House Pharmacy"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={discountForm.description}
                  onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })}
                  placeholder="Details about eligibility and authorization requirements..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDiscountModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700"
                >
                  Activate Policy
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
