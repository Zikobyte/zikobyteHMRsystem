import { Activity, ArrowLeft, HeartHandshake } from "lucide-react";
import type { DirectoryCategory } from "../directory-types";

export interface DirectoryHeaderProps {
	activeCategory: DirectoryCategory;
	standardCount: number;
	specializedCount: number;
	onBackToQueue?: () => void;
	onSelectStandard: () => void;
	onSelectSpecialized: () => void;
}

export default function DirectoryHeader({
	activeCategory,
	standardCount,
	specializedCount,
	onBackToQueue,
	onSelectStandard,
	onSelectSpecialized,
}: DirectoryHeaderProps) {
	return (
		<div className="bg-[#1D222B] px-6 py-5 border-b border-[#151921] shrink-0">
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div className="flex items-center gap-3">
					{onBackToQueue && (
						<button
							onClick={onBackToQueue}
							className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold mr-1"
							title="Return to Consultation Desk"
						>
							<ArrowLeft className="h-4 w-4" />
							<span className="hidden sm:inline">Back</span>
						</button>
					)}
					<div className="p-2.5 bg-[#2A758C]/20 border border-[#2A758C]/40 rounded-2xl text-[#A3D1E0]">
						{activeCategory === "standard" ? (
							<HeartHandshake className="h-6 w-6 text-sky-400" />
						) : (
							<Activity className="h-6 w-6 text-rose-400" />
						)}
					</div>
					<div>
						<div className="flex items-center gap-2.5">
							<h1 className="text-lg md:text-xl font-black text-white tracking-tight">
								{activeCategory === "standard"
									? "Standard Cards Clinical Registry"
									: "Specialized Clinical Care Directory"}
							</h1>
							<span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 font-mono">
								Doctor Access
							</span>
						</div>
						<p className="text-xs text-slate-400 mt-0.5">
							{activeCategory === "standard"
								? "Authoritative general outpatient medical dossiers, vital histories, and active consultation statuses"
								: "Maternity obstetric tracking, gestational monitoring, and emergency acute trauma clinical intake protocols"}
						</p>
					</div>
				</div>

				{/* Quick Category Switcher */}
				<div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
					<button
						onClick={onSelectStandard}
						className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
							activeCategory === "standard"
								? "bg-sky-500 text-slate-950 shadow-md scale-[1.02]"
								: "text-slate-400 hover:text-white"
						}`}
					>
						<HeartHandshake className="h-4 w-4" />
						<span>Standard Cards</span>
						<span
							className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
								activeCategory === "standard"
									? "bg-slate-950 text-white font-bold"
									: "bg-slate-800 text-slate-400"
							}`}
						>
							{standardCount}
						</span>
					</button>

					<button
						onClick={onSelectSpecialized}
						className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
							activeCategory === "specialized"
								? "bg-rose-500 text-white shadow-md scale-[1.02]"
								: "text-slate-400 hover:text-white"
						}`}
					>
						<Activity className="h-4 w-4" />
						<span>Specialized Care</span>
						<span
							className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
								activeCategory === "specialized"
									? "bg-rose-950 text-rose-200 font-bold"
									: "bg-slate-800 text-slate-400"
							}`}
						>
							{specializedCount}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}
