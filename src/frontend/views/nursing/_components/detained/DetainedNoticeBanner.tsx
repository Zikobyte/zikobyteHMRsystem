/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from nursing/_tabs/DetainedPatientsView.tsx (notice banner).
 *
 * Top short-stay clinical protocol banner. Verbatim JSX.
 */

import { Activity } from 'lucide-react';

export default function DetainedNoticeBanner() {
  return (
    <div
      id="detained-patients-notice-banner"
      className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-950 shadow-xs"
    >
      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
        <Activity className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900">
            Short-Stay Clinical Protocol
          </span>
          <span className="text-xs font-bold text-amber-900">Observation Guidelines</span>
        </div>
        <p className="text-sm sm:text-base font-semibold text-amber-900 leading-snug">
          These patients are held for observation only. No formal admission sheet required. Observations recorded on clinical card.
        </p>
      </div>
    </div>
  );
}
