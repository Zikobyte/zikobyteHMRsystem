/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx.
 *
 * Top welcome action banner with DB status badge + register/returning
 * navigation (verbatim JSX).
 */

import { Database, Search, UserPlus } from "lucide-react";
import type { User } from "@/types";

export interface WelcomeBannerProps {
	dbStatus: any;
	isCheckingDb: boolean;
	user?: User | null;
	onNavigateToPatients: () => void;
	onNavigateToReturningPatients?: () => void;
	onOpenRegisterPatient?: () => void;
}

export default function WelcomeBanner({
	dbStatus,
	isCheckingDb,
	user,
	onNavigateToPatients,
	onNavigateToReturningPatients,
	onOpenRegisterPatient,
}: WelcomeBannerProps) {
	return (
		<div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-slate-100/80 shadow-2xs gap-4">
			<div>
				<h2 className="text-xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-3">
					Clinical Central Dashboard
					{isCheckingDb ? (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 animate-pulse border border-slate-200">
							<Database className="h-3 w-3" />
							Checking DB...
						</span>
					) : dbStatus?.postgresActive ? (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
							<Database className="h-3 w-3 text-emerald-600" />
							PostgreSQL Active
						</span>
					) : (
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs">
							<span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
							<Database className="h-3 w-3 text-amber-600" />
							JSON System Active
						</span>
					)}
				</h2>
				<p className="text-slate-500 text-xs font-medium mt-1">
					Real-time overview of clinical intakes, registration
					statistics, revenue ledgers, and department queues.
				</p>
			</div>
			<div className="flex flex-wrap items-center gap-3">
				{onNavigateToReturningPatients && user?.role !== "Doctor" && (
					<button
						onClick={onNavigateToReturningPatients}
						className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#2A758C] border border-[#2A758C]/30 font-extrabold px-5 py-2.5 rounded-2xl text-xs transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
					>
						<Search className="h-4 w-4" /> Returning Patient
					</button>
				)}
				{user?.role !== "Doctor" && (
					<button
						onClick={onOpenRegisterPatient || onNavigateToPatients}
						className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-extrabold px-5 py-2.5 rounded-none text-xs transition-all cursor-pointer"
					>
						<UserPlus className="h-4 w-4" /> Register New Patient
					</button>
				)}
			</div>
		</div>
	);
}
