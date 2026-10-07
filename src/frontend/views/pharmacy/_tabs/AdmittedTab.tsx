/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx (PAGE 2: ADMITTED ORDERS,
 * verbatim JSX).
 *
 * Inpatient ward requisitions: filter bar, shared dispense banners, and
 * the ward-order cards with the dispense-to-ward action. Doctors are
 * fully actionable here (canActOnAdmitted); other non-Pharmacist roles
 * stay read-only. State and handlers arrive via props from
 * usePharmacyAdmitted (orders) and usePharmacyDispensing (banners).
 */

import {
  AlertCircle,
  BedDouble,
  Check,
  CheckCircle2,
  Search
} from 'lucide-react';
import type { AdmittedOrder } from '../_utils/pharmacy-procurement';

export interface AdmittedTabProps {
  admittedOrders: AdmittedOrder[];
  admittedSearch: string;
  setAdmittedSearch: (value: string) => void;
  dispenseSuccess: string;
  setDispenseSuccess: (value: string) => void;
  dispenseError: string;
  setDispenseError: (value: string) => void;
  canActOnAdmitted: boolean;
  handleDispenseAdmittedOrder: (id: string) => void;
}

export default function AdmittedTab({
  admittedOrders,
  admittedSearch,
  setAdmittedSearch,
  dispenseSuccess,
  setDispenseSuccess,
  dispenseError,
  setDispenseError,
  canActOnAdmitted,
  handleDispenseAdmittedOrder
}: AdmittedTabProps) {
  return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-amber-600" />
                  Inpatient Admitted Ward Orders
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review and fulfill medication orders for patients currently admitted in hospital wards.
                </p>
              </div>
              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter ward orders..."
                  value={admittedSearch}
                  onChange={e => setAdmittedSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            {dispenseSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 font-medium flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{dispenseSuccess}</span>
                </div>
                <button onClick={() => setDispenseSuccess('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">Dismiss</button>
              </div>
            )}

            {dispenseError && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-800 font-medium flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{dispenseError}</span>
                </div>
                <button onClick={() => setDispenseError('')} className="text-rose-700 hover:text-rose-900 text-xs font-bold">Dismiss</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {admittedOrders.map(order => (
                <div key={order.id} className="bg-slate-50/70 border border-slate-200/80 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                        {order.ward} • {order.bedNumber}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">{order.patientName}</h3>
                      <p className="text-[11px] font-mono text-slate-500">ID: {order.patientId} | Date: {order.admittedDate}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      order.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <p className="text-[11px] font-bold text-slate-500 font-mono uppercase">Ward Regimen Items:</p>
                    {order.medications.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-800 font-mono">
                        <div>
                          <p className="font-bold">{m.name}</p>
                          <p className="text-[10px] text-slate-500">{m.doseSchedule}</p>
                        </div>
                        <span className="font-bold">x{m.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-100 pt-2 flex justify-between font-mono font-bold text-slate-900">
                      <span>Total:</span>
                      <span>₦{order.totalBill.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    {order.status === 'Pending Ward Release' ? (
                      <button
                        onClick={() => handleDispenseAdmittedOrder(order.id)}
                        disabled={!canActOnAdmitted}
                        title={!canActOnAdmitted ? 'Pharmacist only' : undefined}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="h-3.5 w-3.5" /> Dispense to Ward Nurse
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Fulfilled & Released to Ward
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  );
}
