/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3C extraction from OPDRegistrationView.tsx (SUBTAB 1: RECEPTION).
 * Verbatim JSX: daily-counts dashboard + Registered Patient Files table +
 * search + intake buttons + per-row actions + family/company panels.
 * No behavior change — data, handlers, and modal-openers arrive as props.
 */

import {
	Activity,
	Baby,
	Briefcase,
	CreditCard,
	Download,
	FileText,
	Plus,
	PlusCircle,
	Search,
	Users,
} from "lucide-react";
import ExportButton from "@/components/shared/ExportButton";
import type { Patient } from "@/types";
import { getAge } from "../_utils/opdDates";
import { canManageCardReplacements } from "../_hooks/useOpdReplacements";
import type {
	OpdCompany,
	OpdFamilyAccount,
} from "../_hooks/useOpdDirectory";
import type { RegTab } from "../_hooks/useRegistrationForm";

export interface ReceptionTabProps {
	totalToday: number;
	standardToday: number;
	maternityToday: number;
	emergencyToday: number;
	search: string;
	onSearchChange: (value: string) => void;
	filteredPatients: Patient[];
	userRole?: string | null;
	onOpenRegister: (initialTab?: RegTab) => void;
	onOpenEncounter: (patient: Patient) => void;
	onOpenReplacement: (patient: Patient) => void;
	onSelectDetail: (patient: Patient) => void;
	activeDownloadPatientId: string | null;
	onSetActiveDownloadPatientId: (id: string | null) => void;
	onDownloadSingleExcel: (patient: Patient) => void;
	onDownloadSingleDoc: (patient: Patient) => void;
	onDownloadSinglePdf: (patient: Patient) => void;
	families: OpdFamilyAccount[];
	companies: OpdCompany[];
	onOpenDeposit: (family: OpdFamilyAccount) => void;
	onExportSuccess: (message: string) => void;
	onExportFailure: (message: string) => void;
}

export default function ReceptionTab({
	totalToday,
	standardToday,
	maternityToday,
	emergencyToday,
	search,
	onSearchChange,
	filteredPatients,
	userRole,
	onOpenRegister,
	onOpenEncounter,
	onOpenReplacement,
	onSelectDetail,
	activeDownloadPatientId,
	onSetActiveDownloadPatientId,
	onDownloadSingleExcel,
	onDownloadSingleDoc,
	onDownloadSinglePdf,
	families,
	companies,
	onOpenDeposit,
	onExportSuccess,
	onExportFailure,
}: ReceptionTabProps) {
	return (
		<div className="space-y-6">
			{/* Daily Registration Counts Dashboard */}
			<div
				className="grid grid-cols-2 md:grid-cols-4 gap-4"
				id="daily-intake-stats"
			>
				<div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
					<div className="w-10 h-10 bg-[#A3D1E0]/15 rounded-xl flex items-center justify-center text-[#2A758C] shrink-0">
						<Users className="h-5 w-5" />
					</div>
					<div>
						<p className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
							Total Today
						</p>
						<p className="text-lg font-bold text-slate-800 font-mono">
							{totalToday}
						</p>
					</div>
				</div>

				<div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
					<div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
						<FileText className="h-5 w-5" />
					</div>
					<div>
						<p className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
							Standard Card
						</p>
						<p className="text-lg font-bold text-slate-800 font-mono">
							{standardToday}
						</p>
					</div>
				</div>

				<div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
					<div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
						<Baby className="h-5 w-5" />
					</div>
					<div>
						<p className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
							Maternity Card
						</p>
						<p className="text-lg font-bold text-slate-800 font-mono">
							{maternityToday}
						</p>
					</div>
				</div>

				<div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
					<div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
						<Activity className="h-5 w-5" />
					</div>
					<div>
						<p className="text-[10px] text-slate-400 font-bold uppercase font-mono tracking-wider">
							Emergency Card
						</p>
						<p className="text-lg font-bold text-slate-800 font-mono">
							{emergencyToday}
						</p>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				{/* Patients Intake & Registrations Log - Now Full Width */}
				<div className="w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
					<div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
						<div>
							<h2 className="text-sm font-bold text-slate-900">
								Registered Patient Files
							</h2>
							<p className="text-[11px] text-slate-500 font-medium">
								Search, queue visits, or replace clinical cards
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<button
								id="opd-regular-intake-btn"
								onClick={() => onOpenRegister("standard")}
								className="px-4 py-2 bg-[#2A758C] hover:bg-[#205b6d] text-white font-black rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 border border-[#1f5869]"
								title="Register a new regular out-patient"
							>
								<Plus className="h-4 w-4 text-white stroke-[2.5]" />
								<span>Regular Intake</span>
							</button>
							<button
								id="opd-maternity-intake-btn"
								onClick={() => onOpenRegister("maternity")}
								className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-[11px] flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-200/60"
							>
								<Plus className="h-3 w-3" />
								Maternity Intake
							</button>
							<button
								id="opd-emergency-intake-btn"
								onClick={() => onOpenRegister("emergency")}
								className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-xl text-[11px] flex items-center gap-1.5 transition-all cursor-pointer border border-rose-200/60"
							>
								<Plus className="h-3 w-3" />
								Emergency Intake
							</button>
						</div>
					</div>

					{/* Search Input & Download/Export Dropdown */}
					<div className="flex gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
							<input
								type="text"
								placeholder="Search patient file by Name, Hospital No, Phone..."
								value={search}
								onChange={(e) => onSearchChange(e.target.value)}
								className="w-full bg-slate-50 border border-slate-100 focus:border-[#A3D1E0] focus:ring-1 focus:ring-[#A3D1E0] focus:bg-white rounded-xl py-2 pl-9 pr-4 text-[11px] font-semibold text-slate-700 placeholder-slate-400 transition-all outline-none"
							/>
						</div>

						{/* Export/Download Button */}
						<ExportButton
							exportType="patients"
							search={search}
							label="Download Registry"
							className="bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 font-extrabold"
							onSuccess={(msg) => onExportSuccess(msg)}
							onFailure={(msg) => onExportFailure(msg)}
						/>
					</div>

					{/* Table */}
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="border-b border-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
									<th className="p-2.5">Hospital Number</th>
									<th className="p-2.5">Patient Name</th>
									<th className="p-2.5">Card Category</th>
									<th className="p-2.5">Phone</th>
									<th className="p-2.5">Status</th>
									<th className="p-2.5 text-right">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-50">
								{filteredPatients.length === 0 ? (
									<tr>
										<td
											colSpan={6}
											className="text-center p-8 text-xs text-slate-400 font-medium"
										>
											No registered patients found. Click "New
											Registration" to start.
										</td>
									</tr>
								) : (
									filteredPatients.map((patient, idx) => {
										const age = getAge(patient.dateOfBirth);
										return (
											<tr
												key={`${patient.id}-${idx}`}
												onClick={() =>
													onSelectDetail(patient)
												}
												onKeyDown={(event) => {
													if (
														event.key === "Enter" ||
														event.key === " "
													) {
														event.preventDefault();
														onSelectDetail(
															patient,
														);
													}
												}}
												tabIndex={0}
												role="button"
												aria-label={`View full details for ${patient.name}`}
												className="text-[11px] hover:bg-slate-50/50 focus:bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2A758C]/40 transition-colors cursor-pointer"
											>
												<td className="p-2.5 font-mono font-bold text-[#2A758C]">
													{patient.hospitalNumber}
												</td>
												<td className="p-2.5">
													<p className="font-bold text-slate-800">
														{patient.name}
													</p>
													<p className="text-[9px] text-slate-500 mt-0.5">
														{patient.gender}, {age} Years
													</p>
												</td>
												<td className="p-2.5 font-semibold text-slate-600">
													{patient.cardType}
												</td>
												<td className="p-2.5 text-slate-600 font-mono text-[10px]">
													{patient.phoneNumber}
												</td>
												<td className="p-2.5">
													<span
														className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
															patient.status ===
															"History Refreshed"
																? "bg-orange-50 text-orange-700 border border-orange-100"
																: "bg-slate-50 text-slate-700 border border-slate-100"
														}`}
													>
														{patient.status}
													</span>
												</td>
												<td
													className="p-2.5 text-right space-x-1.5 flex items-center justify-end"
													onClick={(event) =>
														event.stopPropagation()
													}
												>
													<button
														onClick={() =>
															onOpenEncounter(patient)
														}
														className="px-2.5 py-1 bg-[#A3D1E0]/15 hover:bg-[#A3D1E0]/30 text-[#2a758c] font-bold rounded-lg text-[10px] transition-colors cursor-pointer inline-flex items-center gap-1"
													>
														<PlusCircle className="h-2.5 w-2.5" />{" "}
														Queue Visit
													</button>
													<button
														onClick={() =>
															onOpenReplacement(
																patient,
															)
														}
														disabled={
															!canManageCardReplacements(
																userRole,
															)
														}
														className={`px-2.5 py-1 font-bold rounded-lg text-[10px] transition-colors inline-flex items-center gap-1 ${canManageCardReplacements(userRole) ? "bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
														title={
															canManageCardReplacements(
																userRole,
															)
																? "Replace Lost Card"
																: "OPD or Cashier staff only"
														}
													>
														<CreditCard className="h-2.5 w-2.5" />{" "}
														Replace Card
													</button>
													<div className="relative inline-block text-left">
														<button
															onClick={() =>
																onSetActiveDownloadPatientId(
																	activeDownloadPatientId ===
																		patient.id
																		? null
																		: patient.id,
																)
															}
															className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px] transition-all cursor-pointer inline-flex items-center gap-1 border border-emerald-100 shadow-2xs hover:scale-105"
															title="Download Patient Data / Medical Card"
														>
															<Download className="h-3 w-3 text-emerald-600" />
															<span>Download</span>
														</button>

														{activeDownloadPatientId ===
															patient.id && (
															<>
																<div
																	className="fixed inset-0 z-30"
																	onClick={() =>
																		onSetActiveDownloadPatientId(
																			null,
																		)
																	}
																/>
																<div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-100 rounded-xl shadow-xl z-40 py-1 overflow-hidden text-left">
																	<div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100">
																		<p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
																			Download options
																		</p>
																	</div>
																	<button
																		onClick={() => {
																			onDownloadSingleExcel(
																				patient,
																			);
																			onSetActiveDownloadPatientId(
																				null,
																			);
																		}}
																		className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
																	>
																		<img
																			src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/excel.png"
																			className="h-4 w-4 object-contain shrink-0"
																			referrerPolicy="no-referrer"
																			alt="Excel"
																		/>
																		<span>
																			Excel / CSV
																			(.csv)
																		</span>
																	</button>
																	<button
																		onClick={() => {
																			onDownloadSingleDoc(
																				patient,
																			);
																			onSetActiveDownloadPatientId(
																				null,
																			);
																		}}
																		className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
																	>
																		<img
																			src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/google.png"
																			className="h-4 w-4 object-contain shrink-0"
																			referrerPolicy="no-referrer"
																			alt="Google Doc"
																		/>
																		<span>
																			Word Document
																			(.doc)
																		</span>
																	</button>
																	<button
																		onClick={() => {
																			onDownloadSinglePdf(
																				patient,
																			);
																			onSetActiveDownloadPatientId(
																				null,
																			);
																		}}
																		className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
																	>
																		<img
																			src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/pdf1.png"
																			className="h-4 w-4 object-contain shrink-0"
																			referrerPolicy="no-referrer"
																			alt="PDF"
																		/>
																		<span>
																			Print Card / PDF
																			(.pdf)
																		</span>
																	</button>
																</div>
															</>
														)}
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Accounts Profile Directory Panel - Now relocated below the main table for full section width support */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Family Deposit accounts panel */}
					<div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
						<div>
							<h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
								<Users className="h-4 w-4 text-[#A3D1E0]" />
								Family Deposit Balances
							</h3>
							<p className="text-[10px] text-slate-500">
								Shared family cards deducting from centralized
								balances
							</p>
						</div>

						<div className="space-y-2.5">
							{families.map((fam) => (
								<div
									key={fam.id}
									className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100"
								>
									<div>
										<h4 className="text-[11px] font-bold text-slate-800">
											{fam.name} Account
										</h4>
										<p className="text-[9px] text-slate-500 mt-0.5">
											{" "}
											مرکزی ڈپازٹ کھاتہ
										</p>
									</div>
									<div className="text-right flex items-center gap-3">
										<div>
											<span className="text-[11px] font-mono font-bold text-slate-950">
												₦
												{parseFloat(
													fam.balance,
												).toLocaleString()}
											</span>
										</div>
										<button
											onClick={() => onOpenDeposit(fam)}
											className="p-1 text-[#2A758C] hover:bg-[#A3D1E0]/20 rounded-lg transition-colors cursor-pointer"
											title="Top Up Deposit Balance"
										>
											<PlusCircle className="h-3.5 w-3.5" />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Corporate Billing account panel */}
					<div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
						<div>
							<h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
								<Briefcase className="h-4 w-4 text-[#A3D1E0]" />
								Corporate Company Accounts
							</h3>
							<p className="text-[10px] text-slate-500">
								Authorized monthly corporate billings
							</p>
						</div>

						<div className="space-y-2.5">
							{companies.map((comp) => (
								<div
									key={comp.id}
									className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center"
								>
									<div>
										<h4 className="text-[11px] font-bold text-slate-800">
											{comp.name}
										</h4>
										<p className="text-[9px] text-slate-500 mt-0.5">
											Code: {comp.code}
										</p>
									</div>
									<span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-bold uppercase rounded-lg border border-emerald-100">
										Monthly Invoice
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
