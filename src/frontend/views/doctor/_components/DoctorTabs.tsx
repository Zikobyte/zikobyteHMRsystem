/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (module header chrome).
 *
 * DoctorTabs: the 4-tab bar (outpatients / standard / specialized /
 * admitted) + search box + read-only consultation totals strip.
 * Tab clicks switch the tab, clear search, and forward the route to
 * onNavigateTab — verbatim from the original header.
 */

import {
	Activity,
	BedDouble,
	HeartHandshake,
	Search,
	Stethoscope,
	UserCheck,
} from "lucide-react";
import type { DoctorConsultTotals, DoctorTab } from "../_utils/doctor-types";

export interface DoctorTabsProps {
	currentTab: DoctorTab;
	onTabChange: (tab: DoctorTab) => void;
	onNavigateTab?: (tab: string) => void;
	searchQuery: string;
	onSearchChange: (value: string) => void;
	consultTotals: DoctorConsultTotals | null;
	isTotalsLoading: boolean;
	totalsFailed: boolean;
}

export default function DoctorTabs({
	currentTab,
	onTabChange: setCurrentTab,
	onNavigateTab,
	searchQuery,
	onSearchChange: setSearchQuery,
	consultTotals,
	isTotalsLoading,
	totalsFailed,
}: DoctorTabsProps) {
	return (
		<>
			{/* Main Module Tabs & Search Header */}
			<div className="bg-[#1D222B] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#151921] shrink-0">
				<div>
					<h2 className="text-white text-lg font-black tracking-tight flex items-center gap-2">
						<UserCheck className="h-5 w-5 text-[#A3D1E0]" />
						Doctor Clinical Portal
					</h2>
					<p className="text-[11px] text-slate-400 mt-0.5">
						Manage outpatient consultations & admitted patients ward
						rounds
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					{/* Tabs */}
					<div className="flex bg-slate-800/60 p-1 border border-slate-700/50 rounded-xl flex-wrap gap-1">
						<button
							onClick={() => {
								setCurrentTab("outpatients");
								setSearchQuery("");
								if (onNavigateTab) onNavigateTab("consult");
							}}
							className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
								currentTab === "outpatients"
									? "bg-[#A3D1E0] text-slate-950 font-black shadow-sm"
									: "text-slate-300 hover:text-white"
							}`}
						>
							<Stethoscope className="h-3.5 w-3.5" />
							<span>Out-Patients consultations</span>
						</button>

						<button
							onClick={() => {
								setCurrentTab("standard");
								setSearchQuery("");
								if (onNavigateTab) onNavigateTab("standard-cards");
							}}
							className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
								currentTab === "standard"
									? "bg-sky-400 text-slate-950 font-black shadow-sm"
									: "text-slate-300 hover:text-white"
							}`}
						>
							<HeartHandshake className="h-3.5 w-3.5" />
							<span>Standard Cards</span>
						</button>

						<button
							onClick={() => {
								setCurrentTab("specialized");
								setSearchQuery("");
								if (onNavigateTab) onNavigateTab("specialized-care");
							}}
							className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
								currentTab === "specialized"
									? "bg-rose-500 text-white font-black shadow-sm"
									: "text-slate-300 hover:text-white"
							}`}
						>
							<Activity className="h-3.5 w-3.5" />
							<span>Specialized Care</span>
						</button>

						<button
							onClick={() => {
								setCurrentTab("admitted");
								setSearchQuery("");
								if (onNavigateTab) onNavigateTab("doctor-admitted");
							}}
							className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
								currentTab === "admitted"
									? "bg-[#A3D1E0] text-slate-950 font-black shadow-sm"
									: "text-slate-300 hover:text-white"
							}`}
						>
							<BedDouble className="h-3.5 w-3.5" />
							<span>Admitted Patients</span>
						</button>
					</div>

					{/* Search box (shown on outpatients & admitted views) */}
					{(currentTab === "outpatients" || currentTab === "admitted") && (
						<div className="relative">
							<Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
							<input
								type="text"
								placeholder="Search patients..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="bg-slate-800/80 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-1.5 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-[#A3D1E0]"
							/>
						</div>
					)}
				</div>
			</div>

			{/* Phase 1: READ-ONLY consultation totals strip (doctor-only view, no revenue, no actions) */}
			{(currentTab === "outpatients" || currentTab === "admitted") &&
				!totalsFailed &&
				(consultTotals || isTotalsLoading) && (
					<div
						aria-label="Consultation totals"
						role="status"
						aria-busy={isTotalsLoading}
						className="bg-white border-b border-slate-200 px-6 py-2 flex flex-wrap gap-2 shrink-0"
					>
						<span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
							<span className="font-medium text-slate-500">Total</span>
							<span
								className={`font-mono font-bold text-slate-900 ${isTotalsLoading && !consultTotals ? "animate-pulse" : ""}`}
							>
								{isTotalsLoading && !consultTotals
									? "—"
									: (
											consultTotals?.totalPatients ?? 0
										).toLocaleString()}
							</span>
						</span>
						<span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
							<span className="font-medium text-slate-500">
								Standard
							</span>
							<span
								className={`font-mono font-bold text-slate-900 ${isTotalsLoading && !consultTotals ? "animate-pulse" : ""}`}
							>
								{isTotalsLoading && !consultTotals
									? "—"
									: (
											consultTotals?.standardCount ?? 0
										).toLocaleString()}
							</span>
						</span>
						<span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
							<span className="font-medium text-slate-500">
								Maternity
							</span>
							<span
								className={`font-mono font-bold text-slate-900 ${isTotalsLoading && !consultTotals ? "animate-pulse" : ""}`}
							>
								{isTotalsLoading && !consultTotals
									? "—"
									: (
											consultTotals?.maternityCount ?? 0
										).toLocaleString()}
							</span>
						</span>
						<span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
							<span className="font-medium text-slate-500">
								Emergency
							</span>
							<span
								className={`font-mono font-bold text-slate-900 ${isTotalsLoading && !consultTotals ? "animate-pulse" : ""}`}
							>
								{isTotalsLoading && !consultTotals
									? "—"
									: (
											consultTotals?.emergencyCount ?? 0
										).toLocaleString()}
							</span>
						</span>
						<span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
							<span className="font-medium text-slate-500">
								Admitted
							</span>
							<span
								className={`font-mono font-bold text-slate-900 ${isTotalsLoading && !consultTotals ? "animate-pulse" : ""}`}
							>
								{isTotalsLoading && !consultTotals
									? "—"
									: (
											consultTotals?.admissionsCount ?? 0
										).toLocaleString()}
							</span>
						</span>
						<span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
							<span className="font-medium text-slate-500">
								In Queue
							</span>
							<span
								className={`font-mono font-bold text-slate-900 ${isTotalsLoading && !consultTotals ? "animate-pulse" : ""}`}
							>
								{isTotalsLoading && !consultTotals
									? "—"
									: (consultTotals?.queueCount ?? 0).toLocaleString()}
							</span>
						</span>
					</div>
				)}
		</>
	);
}
