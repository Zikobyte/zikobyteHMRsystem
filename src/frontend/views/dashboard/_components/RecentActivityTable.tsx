/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx.
 *
 * Recent Activity & Admissions Directory card (verbatim JSX + row styling
 * logic). Owns the patient search query locally; directory fallback +
 * filtering reuse _utils/dashboardDefaults.
 */

import { useState } from "react";
import { Activity, ArrowUpRight, Eye, Search } from "lucide-react";
import type { Patient } from "@/types";
import ExportButton from "@/components/shared/ExportButton";
import {
	defaultRecentPatients,
	filterRecentList,
} from "../_utils/dashboardDefaults";

export interface RecentActivityTableProps {
	patients: Patient[];
	totalPatients: number;
	onNavigateToPatients: () => void;
	onPatientClick: (patientItem: Patient | any) => void;
}

export default function RecentActivityTable({
	patients,
	totalPatients,
	onNavigateToPatients,
	onPatientClick,
}: RecentActivityTableProps) {
	const [patientSearchQuery, setPatientSearchQuery] = useState("");

	const patientDirectory =
		patients.length > 0 ? patients : defaultRecentPatients;
	const recentList = filterRecentList(patientDirectory, patientSearchQuery);

	return (
		<div className="bg-white rounded-3xl border border-slate-100/80 p-6 shadow-2xs overflow-hidden">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
				<div>
					<h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2.5">
						<div className="p-2 bg-teal-50 rounded-2xl text-[#2A758C]">
							<Activity className="h-5 w-5" />
						</div>
						<span>Recent Activity & Admissions Directory</span>
					</h3>
					<p className="text-xs text-slate-400 font-medium mt-1">
						More than {totalPatients + 400}+ registered members overall
						in network
					</p>
				</div>
				<div className="flex items-center gap-2.5">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
						<input
							type="search"
							value={patientSearchQuery}
							onChange={(e) => setPatientSearchQuery(e.target.value)}
							placeholder="Search patients..."
							aria-label="Search patients by name, hospital number, phone, card type, or status"
							className="w-44 sm:w-56 pl-9 pr-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:border-[#2A758C] transition-all"
						/>
					</div>
					<ExportButton
						exportType="patients"
						label="Export Directory"
						className="bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 font-extrabold"
					/>
					<button
						onClick={onNavigateToPatients}
						className="text-xs text-slate-700 hover:text-slate-900 px-4 py-2 rounded-2xl border border-slate-200/80 hover:border-slate-300 font-extrabold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-50/50 hover:bg-slate-100/80"
					>
						{patientSearchQuery
							? `${recentList.length} Results`
							: "View All"}{" "}
						<ArrowUpRight className="h-4 w-4 text-[#2A758C]" />
					</button>
				</div>
			</div>

			{/* Table Body */}
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
							<th className="py-2.5 px-4 font-bold">
								Patient / Member
							</th>
							<th className="py-2.5 px-4 font-bold">Phone Contact</th>
							<th className="py-2.5 px-4 font-bold">Amount Paid</th>
							<th className="py-2.5 px-4 font-bold">Card Level</th>
							<th className="py-2.5 px-4 font-bold">Status State</th>
							<th className="py-2.5 px-4 font-bold text-right">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
						{recentList.map((item, index) => {
							// Get stylized role background based on standard index
							const roleColors = [
								{
									bg: "bg-[#A3D1E0]/20 text-[#2b5663] border border-[#A3D1E0]/20",
									label: "Standard",
								},
								{
									bg: "bg-rose-50 text-rose-700 border border-rose-200",
									label: "Maternity",
								},
								{
									bg: "bg-amber-50 text-amber-700 border border-amber-200",
									label: "Emergency",
								},
								{
									bg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
									label: "Standard",
								},
								{
									bg: "bg-indigo-50 text-indigo-700 border border-indigo-200",
									label: "Standard",
								},
							];
							const rc = roleColors[index % roleColors.length];

							// Stylized status mapping
							const statuses = [
								"Approved",
								"In Progress",
								"Success",
								"Rejected",
							];
							const itemStatus =
								item.status || statuses[index % statuses.length];
							let statusStyle =
								"bg-emerald-50 text-emerald-700 border border-emerald-200";
							if (
								itemStatus === "Waiting for Doctor" ||
								itemStatus === "In Progress"
							) {
								statusStyle =
									"bg-amber-50 text-amber-700 border border-amber-200";
							} else if (
								itemStatus === "Triage Pending" ||
								itemStatus === "Rejected"
							) {
								statusStyle =
									"bg-rose-50 text-rose-700 border border-rose-200";
							}

							// Initial circle avatar matching colors in video list
							const colors = [
								"bg-[#A3D1E0]/40 text-[#2b5663]",
								"bg-rose-100 text-rose-700",
								"bg-amber-100 text-amber-800",
								"bg-emerald-100 text-emerald-700",
								"bg-indigo-100 text-indigo-700",
							];
							const avatarColor = colors[index % colors.length];

							return (
								<tr
									key={item.id}
									onClick={() => onPatientClick(item)}
									className="hover:bg-[#F0F8FA] transition-all cursor-pointer group hover:shadow-2xs"
								>
									<td className="py-2.5 px-4 flex items-center gap-3">
										<div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 text-[#2A758C] font-black flex items-center justify-center text-[10px] shadow-2xs group-hover:scale-105 transition-transform">
											{item.name
												.split(" ")
												.map((n) => n[0])
												.join("")
												.substring(0, 2)
												.toUpperCase()}
										</div>
										<div>
											<div className="font-bold text-slate-900 text-xs group-hover:text-[#2A758C] transition-colors flex items-center gap-1.5">
												<span>{item.name}</span>
												<span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-[#2A758C] text-white px-1.5 py-0.2 rounded-full font-sans font-normal">
													View Record
												</span>
											</div>
											<div className="text-[9px] text-slate-400 font-mono mt-0.5">
												ID:{" "}
												{(item as any).hospitalNumber ||
													`ZMC-2026-00${index}`}
											</div>
										</div>
									</td>
									<td className="py-2.5 px-4 text-slate-500 font-semibold font-mono text-[11px]">
										{(item as any).phoneNumber || "N/A"}
									</td>
									<td className="py-2.5 px-4 font-mono font-bold text-slate-900 text-[11px]">
										N{(item.cardFee || 3000).toLocaleString()}
									</td>
									<td className="py-2.5 px-4 text-slate-500">
										<span className="inline-flex px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
											{(item as any).cardType || rc.label}
										</span>
									</td>
									<td className="py-2.5 px-4">
										<span
											className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle}`}
										>
											{itemStatus}
										</span>
									</td>
									<td className="py-2.5 px-4 text-right">
										<div className="flex justify-end gap-1.5">
											<button
												onClick={(e) => {
													e.stopPropagation();
													onPatientClick(item);
												}}
												className="px-2.5 py-1 text-[10px] font-extrabold text-[#2A758C] bg-teal-50 hover:bg-[#2A758C] hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-teal-200/60 shadow-2xs"
											>
												<Eye className="h-3 w-3" /> Inspect EMR
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
