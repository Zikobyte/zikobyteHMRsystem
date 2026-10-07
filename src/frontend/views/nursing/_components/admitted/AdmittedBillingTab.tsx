/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/AdmittedPatientsView.tsx (TAB 4: BILLING).
 *
 * Charged / paid / outstanding summary metrics plus the itemized inpatient
 * ledger table. Verbatim JSX; resolved totals + items arrive via props.
 */

import { Receipt } from 'lucide-react';
import type { BillingItem } from '../../_hooks/useAdmittedPatients';

export interface AdmittedBillingTabProps {
  patientName: string;
  totalCharged: number;
  totalPaid: number;
  outstandingBalance: number;
  items: BillingItem[];
}

export default function AdmittedBillingTab({
  patientName,
  totalCharged,
  totalPaid,
  outstandingBalance,
  items,
}: AdmittedBillingTabProps) {
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Three Billing Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total Amount Charged */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Total Amount Charged
          </span>
          <div className="text-2xl font-black text-slate-900">
            ₦{totalCharged.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Inpatient ward, care & meds</span>
        </div>

        {/* Total Amount Paid */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
            Total Amount Paid
          </span>
          <div className="text-2xl font-black text-emerald-800">
            ₦{totalPaid.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Deposits & verified payments</span>
        </div>

        {/* Outstanding Balance */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Outstanding Balance
          </span>
          <div className="text-2xl font-black text-amber-800">
            ₦{outstandingBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Current balance due</span>
        </div>

      </div>

      {/* Itemized Billing Table / List */}
      <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-[#2A758C]" />
              <span>Patient Inpatient Ledger</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              All hospital fees, bed accommodation charges, and payments on record for {patientName}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Description / Item</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount (₦)</th>
                <th className="py-2.5 px-3 text-right">Recorded Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(items || []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No billing records found for this patient.
                  </td>
                </tr>
              ) : (
                (items || []).map((bill) => {
                  const isPayment = bill.type === 'Payment';
                  return (
                    <tr key={bill.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {bill.item}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isPayment ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {bill.type}
                        </span>
                      </td>
                      <td className={`py-3 px-3 text-right font-black ${
                        isPayment ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {isPayment ? '-' : ''}₦{Number(bill.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 font-medium">
                        {bill.recorded_at}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
