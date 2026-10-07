/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/AdmittedPatientsView.tsx (RIGHT CONTAINER, section 2).
 *
 * Clinical record links bar (Medications / Observations / Vitals / Billing,
 * plus Maternity Checklist for maternity-ward patients). Verbatim JSX and
 * tab-count semantics; active tab + counts arrive via props.
 */

import { Activity, Baby, ClipboardList, Pill, Receipt } from 'lucide-react';
import type { AdmittedSubLink } from '../../_hooks/useAdmittedPatients';

export interface AdmittedSubTabsProps {
  activeSubLink: AdmittedSubLink;
  onActiveSubLinkChange: (value: AdmittedSubLink) => void;
  prescriptionsCount: number;
  observationsCount: number;
  vitalsCount: number;
  billingCount: number;
  isMaternity: boolean;
}

export default function AdmittedSubTabs({
  activeSubLink,
  onActiveSubLinkChange,
  prescriptionsCount,
  observationsCount,
  vitalsCount,
  billingCount,
  isMaternity,
}: AdmittedSubTabsProps) {
  const tabs = [
    { id: 'medications', label: 'Medications', icon: Pill, count: prescriptionsCount },
    { id: 'observations', label: 'Observations', icon: ClipboardList, count: observationsCount },
    { id: 'vitals', label: 'Vitals', icon: Activity, count: vitalsCount },
    { id: 'billing', label: 'Billing', icon: Receipt, count: billingCount },
    ...(isMaternity
      ? [{ id: 'maternity-checklist', label: 'Maternity Checklist', icon: Baby, count: undefined, isMaternity: true }]
      : [])
  ];

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
      {tabs.map((tab: any) => {
        const Icon = tab.icon;
        const isActive = activeSubLink === tab.id;
        return (
          <button
            key={tab.id}
            id={`nurse-patient-tab-${tab.id}`}
            onClick={() => onActiveSubLinkChange(tab.id as AdmittedSubLink)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? tab.isMaternity
                  ? 'bg-[#E11D48] text-white shadow-xs font-black ring-2 ring-pink-300'
                  : 'bg-[#2A758C] text-white shadow-xs font-black'
                : tab.isMaternity
                  ? 'text-pink-700 bg-pink-50 hover:bg-pink-100 hover:text-pink-900 border border-pink-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
