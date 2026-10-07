/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3C extraction from OPDRegistrationView.tsx (header block).
 * Verbatim JSX: OPD header (title, Register/Returning buttons, dept nav
 * buttons, header export dropdown). No behavior change — values/handlers
 * arrive as props from the shell.
 */

import { HeartHandshake, UserCheck, UserPlus, Download } from "lucide-react";
import { canManageCardReplacements } from "../_hooks/useOpdReplacements";
import type { RegTab } from "../_hooks/useRegistrationForm";

export type OpdSubTab =
	| "reception"
	| "returning"
	| "admissions"
	| "nursing"
	| "catalog"
	| "records"
	| "replacements";

export interface OpdHeaderProps {
	activeSubTab: OpdSubTab;
	userRole?: string | null;
	onSubTabChange: (tab: OpdSubTab) => void;
	onOpenRegister: (initialTab?: RegTab) => void;
	onGoReturning: () => void;
	isHeaderDownloadOpen: boolean;
	onToggleHeaderDownload: () => void;
	onCloseHeaderDownload: () => void;
	filteredCount: number;
	onDownloadExcel: () => void;
	onDownloadDoc: () => void;
	onDownloadPdf: () => void;
}

export default function OpdHeader({
	activeSubTab,
	userRole,
	onSubTabChange,
	onOpenRegister,
	onGoReturning,
	isHeaderDownloadOpen,
	onToggleHeaderDownload,
	onCloseHeaderDownload,
	filteredCount,
	onDownloadExcel,
	onDownloadDoc,
	onDownloadPdf,
}: OpdHeaderProps) {
	return (
		<div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
			<div className="flex items-center gap-4">
				<div className="w-12 h-12 bg-[#A3D1E0]/20 rounded-2xl flex items-center justify-center text-[#2A758C] font-black">
					<HeartHandshake className="h-6 w-6" />
				</div>
				<div>
					<h1 className="text-xl font-bold text-slate-900 tracking-tight">
						Out-Patient Department (OPD)
					</h1>
					<p className="text-xs text-slate-500 font-medium">
						Official Zikora Medical Center Intake & Nurse Triage Desk
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<div className="flex items-center gap-2">
					<button
						onClick={onGoReturning}
						className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-[#2A758C] text-white hover:bg-[#205b6d] transition-all cursor-pointer shadow-sm whitespace-nowrap"
					>
						<UserCheck className="h-4 w-4" /> Returning Patient
					</button>
					<button
						onClick={() => onOpenRegister("standard")}
						className="flex items-center gap-2 px-4 py-2.5 rounded-none text-xs font-black bg-green-700 text-white hover:bg-green-800 transition-all cursor-pointer whitespace-nowrap"
					>
						<UserPlus className="h-4 w-4" /> Register New Patient
					</button>
				</div>
				{/* TOP LEVEL VIEW SELECTOR FOR ADMINS/DOCTORS */}
				<div className="department-page-nav flex bg-slate-50 border border-slate-100 p-1.5 rounded-2xl gap-1">
					{userRole !== "Nurse" && (
						<>
							<button
								onClick={() => onSubTabChange("reception")}
								className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
									activeSubTab === "reception"
										? "bg-white text-slate-900 shadow-xs"
										: "text-slate-500 hover:text-slate-900"
								}`}
							>
								Reception Desk
							</button>

							<button
								onClick={() => onSubTabChange("returning")}
								className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
									activeSubTab === "returning"
										? "bg-white text-slate-900 shadow-xs"
										: "text-slate-500 hover:text-slate-900"
								}`}
							>
								Returning Patient
							</button>

							<button
								onClick={() => onSubTabChange("admissions")}
								className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
									activeSubTab === "admissions"
										? "bg-white text-slate-900 shadow-xs"
										: "text-slate-500 hover:text-slate-900"
								}`}
							>
								Admissions & Balances
							</button>
						</>
					)}

					{userRole !== "Receptionist" &&
						userRole !== "Records Officer" && (
							<button
								onClick={() => onSubTabChange("nursing")}
								className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
									activeSubTab === "nursing"
										? "bg-white text-slate-900 shadow-xs"
										: "text-slate-500 hover:text-slate-900"
								}`}
							>
								Nursing Front-Desk
							</button>
						)}

					<button
						onClick={() => onSubTabChange("catalog")}
						className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
							activeSubTab === "catalog"
								? "bg-white text-slate-900 shadow-xs"
								: "text-slate-500 hover:text-slate-900"
						}`}
					>
						Price Catalogue
					</button>

					<button
						onClick={() => onSubTabChange("records")}
						className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
							activeSubTab === "records"
								? "bg-white text-slate-900 shadow-xs"
								: "text-slate-500 hover:text-slate-900"
						}`}
					>
						Medical Reports & HMS
					</button>

					{canManageCardReplacements(userRole) && (
						<button
							onClick={() => onSubTabChange("replacements")}
							className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
								activeSubTab === "replacements"
									? "bg-white text-slate-900 shadow-xs"
									: "text-slate-500 hover:text-slate-900"
							}`}
						>
							Card Replacements
						</button>
					)}
				</div>

				{/* Prominent header-level Export / Download Registry button */}
				<div className="relative">
					<button
						id="header-export-btn"
						onClick={onToggleHeaderDownload}
						className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-black shadow-sm rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer border border-slate-300 shrink-0"
						title="Download / Export Patient Data"
					>
						<Download className="h-4 w-4 text-black shrink-0" />
						<span>Export Patient Registry</span>
					</button>

					{isHeaderDownloadOpen && (
						<>
							{/* Backdrop to close dropdown */}
							<div
								className="fixed inset-0 z-10"
								onClick={onCloseHeaderDownload}
							/>

							<div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 py-1.5 overflow-hidden">
								<div className="px-3.5 py-2 border-b border-slate-50 bg-slate-50/50">
									<p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										Download Data ({filteredCount} rows)
									</p>
								</div>

								<button
									onClick={() => {
										onDownloadExcel();
										onCloseHeaderDownload();
									}}
									className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
								>
									<img
										src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/excel.png"
										className="h-4 w-4 object-contain shrink-0"
										referrerPolicy="no-referrer"
										alt="Excel"
									/>
									<span>Excel Spreadsheet (.csv)</span>
								</button>

								<button
									onClick={() => {
										onDownloadDoc();
										onCloseHeaderDownload();
									}}
									className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
								>
									<img
										src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/google.png"
										className="h-4 w-4 object-contain shrink-0"
										referrerPolicy="no-referrer"
										alt="Google Doc"
									/>
									<span>Google Doc / Word (.doc)</span>
								</button>

								<button
									onClick={() => {
										onDownloadPdf();
										onCloseHeaderDownload();
									}}
									className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
								>
									<img
										src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/pdf1.png"
										className="h-4 w-4 object-contain shrink-0"
										referrerPolicy="no-referrer"
										alt="PDF"
									/>
									<span>Print Report / PDF (.pdf)</span>
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
