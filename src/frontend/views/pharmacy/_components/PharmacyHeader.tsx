/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx (department header, verbatim
 * JSX).
 *
 * Top department header card with the Pharmacy title and the active
 * section badge. No modal exists in the pharmacy lane, so _modals/ is
 * intentionally omitted.
 */

import { Pill } from 'lucide-react';
import type { PharmacyInternalTab } from '../_utils/pharmacy-procurement';

export interface PharmacyHeaderProps {
  activeTab: PharmacyInternalTab;
}

export default function PharmacyHeader({ activeTab }: PharmacyHeaderProps) {
  return (
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-700">
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Pharmacy Department</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Clinical dispensing, inpatient ward requisitions, medication procurement, & bulk store stock control.
              </p>
            </div>
          </div>
        </div>

        {/* Active Section Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-amber-500/10 text-amber-800 rounded-xl font-mono text-xs font-bold border border-amber-500/20 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            {activeTab === 'dispensing' && 'Dispensing Desk'}
            {activeTab === 'admitted' && 'Admitted Ward Orders'}
            {activeTab === 'procurement' && 'Procurement Requests'}
            {activeTab === 'stock' && 'Bulk Store Stock Log'}
          </span>
        </div>
      </div>
  );
}
