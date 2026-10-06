/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (admitted OVERVIEW sub-tab).
 * Verbatim JSX — clinical notes / doctor's orders editors, orders
 * history log, and inpatient profile details. State arrives as props.
 */

import { FileText, Save, Stethoscope } from "lucide-react";
import type { AdmittedPatient } from "../../_utils/doctor-types";

export interface OverviewTabProps {
	patient: AdmittedPatient;
	notesInput: string;
	ordersInput: string;
	onNotesChange: (value: string) => void;
	onOrdersChange: (value: string) => void;
	onSaveNotes: (value: string) => void;
	onSaveOrders: (value: string) => void;
}

export default function OverviewTab({
	patient: selectedAdmitted,
	notesInput: admittedNotesInput,
	ordersInput: admittedDoctorOrdersInput,
	onNotesChange: setAdmittedNotesInput,
	onOrdersChange: setAdmittedDoctorOrdersInput,
	onSaveNotes: handleSaveAdmittedNotes,
	onSaveOrders: handleSaveDoctorOrders,
}: OverviewTabProps) {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2 space-y-6">
					{/* 1. Clinical Notes / Diagnosis */}
					<div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
						<div className="flex justify-between items-center">
							<span className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
								<FileText className="h-4 w-4 text-[#2A758C]" />
								Current Notes / Diagnosis
							</span>
							<span className="text-[10px] text-slate-400 font-mono">
								Admission diagnosis
							</span>
						</div>
						<textarea
							rows={3}
							value={admittedNotesInput}
							onChange={(e) =>
								setAdmittedNotesInput(
									e.target.value,
								)
							}
							onBlur={() =>
								handleSaveAdmittedNotes(
									admittedNotesInput,
								)
							}
							placeholder="Clinical diagnosis and current status notes..."
							className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2A758C] font-mono leading-relaxed"
						/>
						<div className="flex justify-between items-center pt-1">
							<span className="text-[10px] text-slate-400 font-mono">
								Auto-saves on blur
							</span>
							<button
								type="button"
								onClick={() =>
									handleSaveAdmittedNotes(
										admittedNotesInput,
									)
								}
								className="px-3.5 py-1.5 bg-[#2A758C] hover:bg-[#205d70] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
							>
								<Save className="w-3.5 h-3.5" />
								<span>Save Notes</span>
							</button>
						</div>
					</div>

					{/* 2. Doctor's Orders & Directives (Separated) */}
					<div className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
						<div className="flex justify-between items-center">
							<span className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
								<Stethoscope className="h-4 w-4 text-indigo-600" />
								Doctor's Orders / Clinical
								Directives
							</span>
							<span className="text-[10px] text-indigo-600 font-mono font-bold">
								Nursing & Ward Directives
							</span>
						</div>
						<textarea
							rows={3}
							value={admittedDoctorOrdersInput}
							onChange={(e) =>
								setAdmittedDoctorOrdersInput(
									e.target.value,
								)
							}
							placeholder="Directives for nursing team: IV fluid rate, positioning, monitoring intervals..."
							className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed"
						/>
						<div className="flex justify-between items-center pt-1">
							<span className="text-[10px] text-slate-400 font-mono">
								Appends to clinical orders
								history
							</span>
							<button
								type="button"
								onClick={() =>
									handleSaveDoctorOrders(
										admittedDoctorOrdersInput,
									)
								}
								className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
							>
								<Save className="w-3.5 h-3.5" />
								<span>
									Save Doctor's Orders
								</span>
							</button>
						</div>
					</div>

					{/* 3. Doctor's Orders History Log */}
					{selectedAdmitted.doctorOrdersHistory &&
						selectedAdmitted.doctorOrdersHistory
							.length > 0 && (
							<div className="space-y-2">
								<span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
									Doctor's Directives History
								</span>
								<div className="space-y-2 max-h-48 overflow-y-auto">
									{selectedAdmitted.doctorOrdersHistory.map(
										(h, idx) => (
											<div
												key={h.id || idx}
												className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs"
											>
												<div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pb-1 border-b border-slate-200/50 mb-1">
													<span className="font-bold text-slate-700">
														{h.doctorName ||
															"Doctor"}
													</span>
													<span>
														{h.timestamp}
													</span>
												</div>
												<p className="text-slate-800 font-mono whitespace-pre-wrap">
													{h.orderText}
												</p>
											</div>
										),
									)}
								</div>
							</div>
						)}
				</div>

				<div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4 h-fit">
					<h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
						Inpatient Profile Details
					</h5>

					<div className="space-y-3.5 divide-y divide-slate-100 text-xs">
						<div className="flex justify-between py-1">
							<span className="text-slate-400">
								Ward / Bed
							</span>
							<span className="font-bold text-slate-800">
								{selectedAdmitted.ward} /{" "}
								{selectedAdmitted.bed}
							</span>
						</div>
						<div className="flex justify-between pt-2.5">
							<span className="text-slate-400">
								Religion
							</span>
							<span className="font-bold text-slate-800">
								{selectedAdmitted.religion ||
									"—"}
							</span>
						</div>
						<div className="flex justify-between pt-2.5">
							<span className="text-slate-400">
								EDD
							</span>
							<span className="font-bold text-slate-800 font-mono">
								{selectedAdmitted.edd || "—"}
							</span>
						</div>
						<div className="flex justify-between pt-2.5">
							<span className="text-slate-400">
								Gravida / Para
							</span>
							<span className="font-bold text-slate-800">
								{selectedAdmitted.gravidaPara ||
									"—"}
							</span>
						</div>
						<div className="flex justify-between pt-2.5">
							<span className="text-slate-400">
								Total Charged
							</span>
							<span className="font-black text-slate-900 font-mono">
								₦
								{Number(
									selectedAdmitted.totalCharged ||
										0,
								).toLocaleString()}
							</span>
						</div>
						<div className="flex justify-between pt-2.5">
							<span className="text-slate-400">
								Payments Made
							</span>
							<span className="font-black text-emerald-700 font-mono">
								₦
								{Number(
									selectedAdmitted.paymentsMade ||
										0,
								).toLocaleString()}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
