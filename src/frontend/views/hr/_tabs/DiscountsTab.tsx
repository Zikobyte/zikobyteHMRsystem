/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx (SUBTAB: DISCOUNTS &
 * STAFF SCHEMES, verbatim JSX).
 *
 * Discount policies desk: standardized hospital subsidy schemes, staff
 * medical benefits, and compassionate fee waivers grid. State arrives
 * via the discounts hook result; the definer lives in
 * _modals/DiscountModal.
 */

import { Plus } from 'lucide-react';
import type { UseHrDiscountsResult } from '../_hooks/useHrDiscounts';

export interface DiscountsTabProps {
  data: UseHrDiscountsResult;
}

export default function DiscountsTab({ data }: DiscountsTabProps) {
  const { discounts, setShowAddDiscountModal } = data;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Staff & Patient Welfare Discount Policies ({discounts.length})</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standardized hospital subsidy schemes, staff medical benefits, and compassionate fee waivers
            </p>
          </div>
          <button
            onClick={() => setShowAddDiscountModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Discount Policy
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {discounts.map((disc) => (
            <div key={disc.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  {disc.category}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {disc.percentage}% OFF
                </span>
              </div>

              <h3 className="font-black text-slate-900 text-sm mt-3">{disc.title}</h3>
              <div className="mt-1 font-mono text-xs text-slate-500 font-bold">Code: {disc.discount_code || 'N/A'}</div>
              <p className="text-xs text-slate-600 mt-2">{disc.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 flex flex-col gap-1">
                <div><strong className="text-slate-700">Applies to:</strong> {disc.applicable_service}</div>
                <div><strong className="text-slate-700">Authorized by:</strong> {disc.authorized_by}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
