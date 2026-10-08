/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx.
 *
 * TOP KPI METRICS GRID: rounded-3xl KPI cards (verbatim JSX + keyboard
 * handlers). Revenue card opens the verification modal via callback.
 */

import {
	Activity,
	FileText,
	HeartHandshake,
	ShieldCheck,
	TrendingUp,
	Users,
} from "lucide-react";

export interface KpiCardsProps {
	totalPatients: number;
	standardCount: number;
	maternityCount: number;
	emergencyCount: number;
	totalRevenue: number;
	isLoading: boolean;
	isStatsLoading: boolean;
	onNavigateToPatients: () => void;
	onNavigateToStandardCards?: () => void;
	onNavigateToSpecializedCare?: () => void;
	onOpenRevenueModal: () => void;
}

export default function KpiCards({
	totalPatients,
	standardCount,
	maternityCount,
	emergencyCount,
	totalRevenue,
	isLoading,
	isStatsLoading,
	onNavigateToPatients,
	onNavigateToStandardCards,
	onNavigateToSpecializedCare,
	onOpenRevenueModal,
}: KpiCardsProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
			{/* KPI 1: Total Patients */}
			<div
				onClick={onNavigateToPatients}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ")
						onNavigateToPatients();
				}}
				className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs hover:shadow-md hover:border-[#2A758C]/40 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between cursor-pointer group text-left"
				aria-label="View all patients"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-slate-500 font-bold text-xs group-hover:text-[#2A758C] transition-colors">
						<Users className="h-4 w-4 text-[#2A758C]" />
						<span>Total Patients</span>
					</div>
					<span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
						<TrendingUp className="h-3 w-3" /> +3.78%
					</span>
				</div>
				<div className="mt-4">
					<h3 className="text-3xl font-black text-slate-900 tracking-tight font-mono">
						{isLoading || isStatsLoading
							? "..."
							: totalPatients.toLocaleString()}
					</h3>
					<div className="flex items-center justify-between mt-1">
						<p className="text-[11px] text-slate-400 font-medium">
							Registered clinical record members
						</p>
						<span className="text-[10px] font-black text-[#2A758C] opacity-80 group-hover:opacity-100 flex items-center gap-0.5 transition-all">
							View patients →
						</span>
					</div>
				</div>
			</div>

			{/* KPI 2: Standard Registrations */}
			<div
				onClick={onNavigateToStandardCards}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ")
						onNavigateToStandardCards?.();
				}}
				className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs hover:shadow-md hover:border-sky-300 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between cursor-pointer group text-left"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-slate-500 font-bold text-xs group-hover:text-sky-700 transition-colors">
						<HeartHandshake className="h-4 w-4 text-sky-600" />
						<span>Standard Cards</span>
					</div>
					<span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-sky-50 text-sky-600 border border-sky-100">
						<TrendingUp className="h-3 w-3" /> +2.14%
					</span>
				</div>
				<div className="mt-4">
					<h3 className="text-3xl font-black text-slate-900 tracking-tight font-mono group-hover:text-sky-950">
						{isLoading || isStatsLoading
							? "..."
							: standardCount.toLocaleString()}
					</h3>
					<div className="flex items-center justify-between mt-1">
						<p className="text-[11px] text-slate-400 font-medium">
							General outpatient consultations
						</p>
						<span className="text-[10px] font-black text-sky-600 opacity-80 group-hover:opacity-100 flex items-center gap-0.5 transition-all">
							View cases →
						</span>
					</div>
				</div>
			</div>

			{/* KPI 3: Maternity & Emergency */}
			<div
				onClick={onNavigateToSpecializedCare}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ")
						onNavigateToSpecializedCare?.();
				}}
				className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs hover:shadow-md hover:border-rose-300 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between cursor-pointer group text-left"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-slate-500 font-bold text-xs group-hover:text-rose-700 transition-colors">
						<Activity className="h-4 w-4 text-rose-500" />
						<span>Specialized Care</span>
					</div>
					<span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-50 text-rose-600 border border-rose-100">
						<TrendingUp className="h-3 w-3" /> +1.64%
					</span>
				</div>
				<div className="mt-4">
					<h3 className="text-3xl font-black text-slate-900 tracking-tight font-mono group-hover:text-rose-950">
						{isLoading || isStatsLoading
							? "..."
							: (maternityCount + emergencyCount).toLocaleString()}
					</h3>
					<div className="flex items-center justify-between mt-1">
						<p className="text-[11px] text-slate-400 font-medium">
							{maternityCount} Maternity • {emergencyCount} Emergency
						</p>
						<span className="text-[10px] font-black text-rose-600 opacity-80 group-hover:opacity-100 flex items-center gap-0.5 transition-all">
							View cases →
						</span>
					</div>
				</div>
			</div>

			{/* KPI 4: Total Revenue & Independent Verification */}
			<div
				onClick={onOpenRevenueModal}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ")
						onOpenRevenueModal();
				}}
				className="bg-white rounded-3xl p-5 border border-slate-100/80 shadow-2xs hover:shadow-md hover:border-emerald-300 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between cursor-pointer group text-left"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-slate-500 font-bold text-xs group-hover:text-emerald-700 transition-colors">
						<FileText className="h-4 w-4 text-emerald-600" />
						<span>Revenue Collections</span>
					</div>
					<span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
						<TrendingUp className="h-3 w-3" /> +4.25%
					</span>
				</div>
				<div className="mt-4">
					<h3 className="text-3xl font-black text-slate-900 tracking-tight font-mono group-hover:text-emerald-950">
						₦
						{isLoading || isStatsLoading
							? "..."
							: totalRevenue.toLocaleString()}
					</h3>
					<div className="flex items-center justify-between mt-1">
						<p className="text-[11px] text-slate-400 font-medium">
							Balanced in Cashier ledger
						</p>
						<span className="text-[10px] font-black text-emerald-600 opacity-90 group-hover:opacity-100 flex items-center gap-0.5 transition-all">
							<ShieldCheck className="h-3 w-3 inline" /> Audit &
							Verify →
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
