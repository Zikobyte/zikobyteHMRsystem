/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3C extraction from OPDRegistrationView.tsx (SUBTAB: RECORDS).
 * Verbatim JSX: Medical Records archive table + search + ExportButtons +
 * View HMS. No behavior change — directory data and opener arrive as props.
 *
 * The archive rows tolerate both backend snake_case and mapped camelCase
 * patient keys; the local extension keeps props typed without `any`.
 */

import { Eye, FileText, Search } from "lucide-react";
import ExportButton from "@/components/shared/ExportButton";
import type { Patient } from "@/types";

export interface RecordsArchivePatient extends Patient {
	hospital_number?: string;
	phone_number?: string;
	card_type?: string;
	date_of_birth?: string;
	age?: number | string;
}

export interface RecordsTabProps {
	search: string;
	onSearchChange: (value: string) => void;
	filteredPatients: RecordsArchivePatient[];
	onSelectDetail: (patient: RecordsArchivePatient) => void;
}

export default function RecordsTab({
	search,
	onSearchChange,
	filteredPatients,
	onSelectDetail,
}: RecordsTabProps) {
	return (
		<div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
				<div>
					<h2 className="text-base font-black text-slate-900 flex items-center gap-2">
						<FileText className="h-5 w-5 text-[#2A758C]" />
						Medical Records & Clinical HMS Archive
					</h2>
					<p className="text-xs text-slate-500 font-medium mt-0.5">
						Search patients, export clinical health summaries
						(PDF/Word/Excel), and inspect medical histories
					</p>
				</div>

				<div className="flex items-center gap-3">
					<ExportButton
						exportType="patients"
						label="Export Patient Registry"
						className="bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 font-extrabold"
					/>
				</div>
			</div>

			{/* Search bar and Filters */}
			<div className="flex flex-col sm:flex-row items-center gap-3">
				<div className="relative flex-1 w-full">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
					<input
						type="text"
						placeholder="Search patient name, hospital number (e.g. ZMC-2026-001), or phone..."
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2A758C]/20"
					/>
				</div>
				<div className="text-xs font-bold text-slate-400 px-3 py-2 bg-slate-50 rounded-xl font-mono shrink-0">
					Total Records: {filteredPatients.length}
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/80">
							<th className="p-3.5">Hospital No.</th>
							<th className="p-3.5">Patient Full Name</th>
							<th className="p-3.5">Gender / Age</th>
							<th className="p-3.5">Phone / Contact</th>
							<th className="p-3.5">Category</th>
							<th className="p-3.5">Status</th>
							<th className="p-3.5 text-right">
								Medical Report Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{filteredPatients.length === 0 ? (
							<tr>
								<td
									colSpan={7}
									className="text-center p-10 text-xs text-slate-400 font-medium"
								>
									No matching patient medical records found.
								</td>
							</tr>
						) : (
							filteredPatients.map((p) => (
								<tr
									key={p.id}
									className="text-xs hover:bg-slate-50/70 transition-colors"
								>
									<td className="p-3.5 font-mono font-bold text-[#2A758C]">
										{p.hospital_number ||
											p.hospitalNumber ||
											p.id}
									</td>
									<td className="p-3.5 font-bold text-slate-900">
										{p.name}
									</td>
									<td className="p-3.5 text-slate-600">
										{p.gender} •{" "}
										{p.age
											? `${p.age} yrs`
											: p.date_of_birth
												? p.date_of_birth.split("T")[0]
												: "N/A"}
									</td>
									<td className="p-3.5 text-slate-600 font-mono">
										{p.phone_number || p.phoneNumber || "N/A"}
									</td>
									<td className="p-3.5">
										<span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md uppercase font-mono">
											{p.card_type || p.cardType || "Standard"}
										</span>
									</td>
									<td className="p-3.5">
										<span
											className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
												p.status?.includes("Admitted")
													? "bg-sky-100 text-sky-800"
													: p.status?.includes("Emergency")
														? "bg-rose-100 text-rose-800"
														: "bg-emerald-100 text-emerald-800"
											}`}
										>
											{p.status || "Active"}
										</span>
									</td>
									<td className="p-3.5 text-right">
										<div className="flex items-center justify-end gap-2">
											<button
												type="button"
												onClick={() =>
													onSelectDetail(p)
												}
												className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
												title="Open full HMS Patient Record"
											>
												<Eye className="h-3.5 w-3.5 text-slate-600" />
												<span>View HMS</span>
											</button>

											<ExportButton
												exportType="medical-records"
												patientId={
													p.hospital_number ||
													p.hospitalNumber ||
													p.id
												}
												label="Download HMS"
												className="bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 font-extrabold py-1.5 px-3 text-xs rounded-xl"
											/>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
