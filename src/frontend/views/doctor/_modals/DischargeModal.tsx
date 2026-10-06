/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (DISCHARGE PATIENT MODAL).
 * Verbatim JSX — visibility, patient, draft fields, and callbacks
 * arrive as props from the shell (useAdmittedOrders owns the draft).
 */

import { LogOut, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { AdmittedPatient } from "../_utils/doctor-types";

export interface DischargeModalProps {
	open: boolean;
	patient: AdmittedPatient | undefined;
	diagnosis: string;
	condition: string;
	instructions: string;
	followUp: string;
	onDiagnosisChange: (value: string) => void;
	onConditionChange: (value: string) => void;
	onInstructionsChange: (value: string) => void;
	onFollowUpChange: (value: string) => void;
	onClose: () => void;
	onConfirm: () => void;
}

export default function DischargeModal({
	open,
	patient: selectedAdmitted,
	diagnosis: dischargeDiagnosis,
	condition: dischargeCondition,
	instructions: dischargeInstructions,
	followUp: dischargeFollowUp,
	onDiagnosisChange: setDischargeDiagnosis,
	onConditionChange: setDischargeCondition,
	onInstructionsChange: setDischargeInstructions,
	onFollowUpChange: setDischargeFollowUp,
	onClose,
	onConfirm: handleConfirmDischarge,
}: DischargeModalProps) {
	return (
		<AnimatePresence>
			{open && selectedAdmitted && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
					<motion.div
						initial={{ opacity: 0, scale: 0.96 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.96 }}
						className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
					>
						<div className="p-5 bg-rose-600 text-white flex justify-between items-center">
							<div className="flex items-center gap-2.5">
								<LogOut className="h-5 w-5" />
								<div>
									<h3 className="text-sm font-extrabold">
										Discharge Inpatient
									</h3>
									<p className="text-[11px] text-rose-100">
										{selectedAdmitted.name} (
										{selectedAdmitted.ward} - Bed{" "}
										{selectedAdmitted.bed})
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={onClose}
								className="text-rose-100 hover:text-white p-1 rounded-lg cursor-pointer"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
							{/* Financial Summary */}
							<div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1 font-mono">
								<div className="flex justify-between">
									<span className="text-slate-500">
										Total Incurred:
									</span>
									<span className="font-bold text-slate-800">
										₦
										{Number(
											selectedAdmitted.totalCharged || 0,
										).toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-slate-500">
										Payments Made:
									</span>
									<span className="font-bold text-emerald-700">
										₦
										{Number(
											selectedAdmitted.paymentsMade || 0,
										).toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between pt-1 border-t border-slate-200">
									<span className="text-slate-700 font-bold">
										Outstanding Balance:
									</span>
									<span
										className={`font-black ${Number(selectedAdmitted.totalCharged || 0) - Number(selectedAdmitted.paymentsMade || 0) > 0 ? "text-rose-600" : "text-slate-800"}`}
									>
										₦
										{Math.max(
											0,
											Number(selectedAdmitted.totalCharged || 0) -
												Number(
													selectedAdmitted.paymentsMade || 0,
												),
										).toLocaleString()}
									</span>
								</div>
							</div>

							<div className="space-y-1">
								<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
									Discharge Diagnosis / Summary
								</label>
								<textarea
									rows={2}
									value={dischargeDiagnosis}
									onChange={(e) =>
										setDischargeDiagnosis(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
								/>
							</div>

							<div className="space-y-1">
								<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
									Patient Condition on Discharge
								</label>
								<select
									value={dischargeCondition}
									onChange={(e) =>
										setDischargeCondition(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
								>
									<option value="Clinically Improved">
										Clinically Improved / Stable
									</option>
									<option value="Recovered / Resolved">
										Recovered / Resolved
									</option>
									<option value="Transferred to Specialist Facility">
										Transferred to Specialist Facility
									</option>
									<option value="Discharged Against Medical Advice (DAMA)">
										Discharged Against Medical Advice (DAMA)
									</option>
								</select>
							</div>

							<div className="space-y-1">
								<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
									Discharge Instructions & Take-Home Meds
								</label>
								<textarea
									rows={2}
									value={dischargeInstructions}
									onChange={(e) =>
										setDischargeInstructions(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
								/>
							</div>

							<div className="space-y-1">
								<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
									Follow-up Appointment
								</label>
								<input
									type="text"
									value={dischargeFollowUp}
									onChange={(e) =>
										setDischargeFollowUp(e.target.value)
									}
									placeholder="e.g. 2 weeks at Outpatient Clinic"
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
								/>
							</div>
						</div>

						<div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleConfirmDischarge}
								className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
							>
								Confirm Discharge & Vacate Bed
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
