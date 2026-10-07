/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx.
 *
 * Laboratory search bar with per-tab result counts. Verbatim JSX.
 */

import { Search, X } from 'lucide-react';
import type { LabPageTab } from '../_utils/lab-types';

export interface LabSearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  activeTab: LabPageTab;
  regularResultCount: number;
  walkInResultCount: number;
}

export default function LabSearchBar({
  searchQuery,
  onSearchQueryChange: setSearchQuery,
  activeTab,
  regularResultCount,
  walkInResultCount,
}: LabSearchBarProps) {
  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2A758C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lab patients by name, hospital ID, phone number, or ordered test..."
          className="w-full pl-11 pr-10 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs font-semibold text-slate-900 rounded-2xl border border-slate-200/80 focus:border-[#2A758C] focus:ring-2 focus:ring-[#2A758C]/20 transition-all outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-full bg-slate-200/60 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Clear search filter"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {searchQuery.trim() && (
        <div className="px-3.5 py-2.5 bg-[#2A758C]/10 text-[#2A758C] rounded-2xl text-xs font-bold shrink-0 flex items-center justify-between sm:justify-start gap-2 border border-[#2A758C]/20">
          <span>SearchResults:</span>
          <span className="font-extrabold font-mono">
            {activeTab === 'regular'
              ? `${regularResultCount} patient(s)`
              : `${walkInResultCount} patient(s)`}
          </span>
        </div>
      )}
    </div>
  );
}
