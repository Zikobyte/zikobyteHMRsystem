import { Activity, Baby, Flame, HeartHandshake, RefreshCw } from "lucide-react";
import ExportButton from "@/components/shared/ExportButton";
import type {
	DirectoryCategory,
	SpecializedSubFilter,
} from "../directory-types";

export interface DirectoryFilterBarProps {
	activeCategory: DirectoryCategory;
	specializedSubFilter: SpecializedSubFilter;
	onSubFilterChange: (value: SpecializedSubFilter) => void;
	standardCount: number;
	specializedCount: number;
	maternityCount: number;
	emergencyCount: number;
	isRefreshing: boolean;
	onRefresh: () => void;
}

export default function DirectoryFilterBar({
	activeCategory,
	specializedSubFilter,
	onSubFilterChange,
	standardCount,
	specializedCount,
	maternityCount,
	emergencyCount,
	isRefreshing,
	onRefresh,
}: DirectoryFilterBarProps) {
	return (
		<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-2xs">
			{/* If Specialized: sub-tabs */}
			{activeCategory === "specialized" ? (
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider font-mono mr-1">
						Filter Category:
					</span>
					<button
						onClick={() => onSubFilterChange("all")}
						className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
							specializedSubFilter === "all"
								? "bg-slate-900 text-white shadow-sm"
								: "bg-slate-100 text-slate-600 hover:bg-slate-200"
						}`}
					>
						<Activity className="h-3.5 w-3.5" />
						<span>All Specialized</span>
						<span className="text-[10px] opacity-75 font-mono">
							({specializedCount})
						</span>
					</button>

					<button
						onClick={() => onSubFilterChange("maternity")}
						className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
							specializedSubFilter === "maternity"
								? "bg-pink-600 text-white shadow-sm"
								: "bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200/50"
						}`}
					>
						<Baby className="h-3.5 w-3.5" />
						<span>Maternity Care (Obstetrics)</span>
						<span className="text-[10px] font-mono">
							({maternityCount})
						</span>
					</button>

					<button
						onClick={() => onSubFilterChange("emergency")}
						className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
							specializedSubFilter === "emergency"
								? "bg-rose-600 text-white shadow-sm"
								: "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/50"
						}`}
					>
						<Flame className="h-3.5 w-3.5" />
						<span>Emergency & Acute Trauma</span>
						<span className="text-[10px] font-mono">
							({emergencyCount})
						</span>
					</button>
				</div>
			) : (
				<div className="flex items-center gap-3">
					<span className="text-xs font-extrabold text-slate-500 font-mono uppercase tracking-wider">
						Category Scope:
					</span>
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-extrabold">
						<HeartHandshake className="h-3.5 w-3.5 text-sky-600" />
						Standard Registrations ({standardCount} records)
					</span>
				</div>
			)}

			{/* Quick Refresh and Export */}
			<div className="flex items-center gap-2 self-end md:self-auto">
				<button
					onClick={onRefresh}
					disabled={isRefreshing}
					className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
					title="Refresh database records"
				>
					<RefreshCw
						className={`h-4 w-4 ${isRefreshing ? "animate-spin text-[#2A758C]" : ""}`}
					/>
					<span className="hidden sm:inline">Refresh</span>
				</button>

				<ExportButton
					exportType="patients"
					label="Export HMS Data"
					className="bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 py-2.5 px-3.5 text-xs font-black rounded-xl"
				/>
			</div>
		</div>
	);
}
