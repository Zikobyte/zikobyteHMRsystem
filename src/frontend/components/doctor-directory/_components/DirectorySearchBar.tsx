import { Filter, Search } from "lucide-react";
import type { DirectoryCategory } from "../directory-types";

export interface DirectorySearchBarProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusChange: (value: string) => void;
	currentCount: number;
	activeCategory: DirectoryCategory;
}

export default function DirectorySearchBar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusChange,
	currentCount,
	activeCategory,
}: DirectorySearchBarProps) {
	return (
		<div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-2xs space-y-4">
			<div className="flex flex-col sm:flex-row items-center gap-3">
				{/* Search Input */}
				<div className="relative flex-1 w-full">
					<Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={
							activeCategory === "standard"
								? "Search standard patients by name, hospital no (ZMC-2026-xxx), phone, or address..."
								: "Search specialized cases by name, maternity no, emergency type, escort/informant, or notes..."
						}
						className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20 focus:border-[#2A758C] transition-all"
					/>
					{searchQuery && (
						<button
							onClick={() => onSearchChange("")}
							className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
						>
							Clear
						</button>
					)}
				</div>

				{/* Status Filter */}
				<div className="flex items-center gap-2 w-full sm:w-auto">
					<Filter className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
					<select
						value={statusFilter}
						onChange={(e) => onStatusChange(e.target.value)}
						className="w-full sm:w-48 bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20"
					>
						<option value="all">All Statuses ({currentCount})</option>
						<option value="waiting">Awaiting Doctor / Triage</option>
						<option value="consulting">In Consultation</option>
						<option value="lab">Lab Results Pending/Ready</option>
						<option value="completed">Completed / Discharged</option>
					</select>
				</div>
			</div>
		</div>
	);
}
