/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/NurseDispensingView.tsx.
 *
 * Top banner + department KPIs (total / pending / reviewed). Verbatim JSX.
 */

import { Pill } from 'lucide-react';

export interface DispensingBannerProps {
  totalCount: number;
  pendingCount: number;
  reviewedCount: number;
}

export default function DispensingBanner({ totalCount, pendingCount, reviewedCount }: DispensingBannerProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
            <Pill className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Nurse Dispensing</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Ward Register
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
              Point-of-care medication administration, emergency ward drug dispensing, and clinical card accountability.
            </p>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-slate-200/60 flex items-center justify-center text-slate-700 font-bold text-xs">
              {totalCount}
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-600">Total Entries</div>
              <div className="text-xs font-bold text-slate-800">All Records</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
              {pendingCount}
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-800">Pending</div>
              <div className="text-xs font-bold text-amber-900">Awaiting Sign-off</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              {reviewedCount}
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-800">Reviewed</div>
              <div className="text-xs font-bold text-emerald-900">Doctor/Charge Nurse</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
