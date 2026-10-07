/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx (summary stat cards).
 *
 * Shell-level department totals. Verbatim JSX.
 */

import { CheckCircle2, Clock, CreditCard, Users } from 'lucide-react';

export interface EyeStatsCardsProps {
	totalRecords: number;
	waitingConsultations: number;
	paymentPending: number;
	completedToday: number;
}

export default function EyeStatsCards({ totalRecords, waitingConsultations, paymentPending, completedToday }: EyeStatsCardsProps) {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
				<div className="flex items-center justify-between">
					<span className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Total Records</span>
					<div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
						<Users className="h-4 w-4" />
					</div>
				</div>
				<div className="flex items-baseline justify-between">
					<p className="text-2xl font-black text-slate-900 font-mono">{totalRecords}</p>
					<span className="text-[10px] text-slate-500 font-medium">Eye Clinic Database</span>
				</div>
			</div>

			<div className="bg-amber-50/70 p-4.5 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1.5">
				<div className="flex items-center justify-between">
					<span className="text-[10px] sm:text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">Waiting Consultations</span>
					<div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
						<Clock className="h-4 w-4" />
					</div>
				</div>
				<div className="flex items-baseline justify-between">
					<p className="text-2xl font-black text-amber-800 font-mono">{waitingConsultations}</p>
					<span className="text-[10px] text-amber-700 font-medium">Active Ocular Queue</span>
				</div>
			</div>

			<div className="bg-rose-50/70 p-4.5 rounded-2xl border border-rose-200/80 shadow-2xs space-y-1.5">
				<div className="flex items-center justify-between">
					<span className="text-[10px] sm:text-[11px] font-extrabold text-rose-700 uppercase tracking-wider">Payment Pending</span>
					<div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800">
						<CreditCard className="h-4 w-4" />
					</div>
				</div>
				<div className="flex items-baseline justify-between">
					<p className="text-2xl font-black text-rose-800 font-mono">{paymentPending}</p>
					<span className="text-[10px] text-rose-700 font-medium">Awaiting Settlement</span>
				</div>
			</div>

			<div className="bg-emerald-50/70 p-4.5 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1.5">
				<div className="flex items-center justify-between">
					<span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">Completed Consultations</span>
					<div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
						<CheckCircle2 className="h-4 w-4" />
					</div>
				</div>
				<div className="flex items-baseline justify-between">
					<p className="text-2xl font-black text-emerald-800 font-mono">{completedToday}</p>
					<span className="text-[10px] text-emerald-700 font-medium">Encounter Logs</span>
				</div>
			</div>
		</div>
	);
}
