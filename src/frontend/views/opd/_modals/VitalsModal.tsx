/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (record
 * sickness-appropriate vitals modal). Verbatim JSX including the
 * pediatric/antenatal conditional logic (pediatric <12y bypasses BP,
 * antenatal checkups record BP & weight only). No behavior change — queue
 * item, vitals state, and submit wiring arrive as props.
 */

import { motion, AnimatePresence } from "motion/react";
import { Activity, X, Info, Loader2 } from "lucide-react";
import { getAge } from "../_utils/opdDates";
import type { OpdQueueItem } from "../_hooks/useOpdQueue";
import type { RegistrationSubmitHandler } from "../_components/register/registrationProps";

export interface VitalsModalProps {
	open: boolean;
	queueItem: OpdQueueItem | null;
	vitalsBP: string;
	setVitalsBP: (value: string) => void;
	vitalsTemp: string;
	setVitalsTemp: (value: string) => void;
	vitalsPulse: string;
	setVitalsPulse: (value: string) => void;
	vitalsResp: string;
	setVitalsResp: (value: string) => void;
	vitalsSpo2: string;
	setVitalsSpo2: (value: string) => void;
	vitalsWeight: string;
	setVitalsWeight: (value: string) => void;
	vitalsHeight: string;
	setVitalsHeight: (value: string) => void;
	isSavingVitals: boolean;
	onClose: () => void;
	onSubmit: RegistrationSubmitHandler;
}

export default function VitalsModal({
	open,
	queueItem,
	vitalsBP,
	setVitalsBP,
	vitalsTemp,
	setVitalsTemp,
	vitalsPulse,
	setVitalsPulse,
	vitalsResp,
	setVitalsResp,
	vitalsSpo2,
	setVitalsSpo2,
	vitalsWeight,
	setVitalsWeight,
	vitalsHeight,
	setVitalsHeight,
	isSavingVitals,
	onClose,
	onSubmit,
}: VitalsModalProps) {
	return (
		<AnimatePresence>
			{open && queueItem && (
				<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto"
					>
						<div className="flex justify-between items-center pb-4 border-b border-slate-100">
							<div className="flex items-center gap-2">
								<Activity className="h-5 w-5 text-[#2A758C]" />
								<h3 className="text-base font-bold text-slate-900">
									Record Sickness/Age Vitals
								</h3>
							</div>
							<button
								onClick={onClose}
								className="text-slate-400 hover:text-slate-600"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Patient Information */}
						<div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
							<p className="font-bold text-slate-800">
								{queueItem.patient_name}
							</p>
							<div className="flex justify-between text-slate-500 mt-1 font-mono text-[10px]">
								<span>
									Hospital No: {queueItem.hospital_number}
								</span>
								<span>
									Age: {getAge(queueItem.date_of_birth)}{" "}
									Years
								</span>
								<span>Gender: {queueItem.gender}</span>
							</div>
							{/* Visual guidelines warning based on rules */}
							<div className="mt-2.5 pt-2 border-t border-slate-200/50 flex gap-2 text-[10px] text-slate-600 leading-normal">
								<Info className="h-4 w-4 text-[#2A758C] shrink-0" />
								<span>
									{getAge(queueItem.date_of_birth) < 12 ? (
										<span className="font-bold text-[#2A758C]">
											PEDIATRIC PATIENT: Record TPRW. Blood
											Pressure is auto-bypassed.
										</span>
									) : queueItem.visit_type ===
									  "Antenatal Checkup" ? (
										<span className="font-bold text-pink-700">
											ANTENATAL CHECKUP: Basic Checkup only (BP &
											Weight).
										</span>
									) : (
										<span className="font-bold text-emerald-700">
											ADULT PATIENT: Full TPRBPW record required.
										</span>
									)}
								</span>
							</div>
						</div>

						<form onSubmit={onSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								{/* Blood Pressure - Only for Adults or Antenatal */}
								{getAge(queueItem.date_of_birth) >= 12 && (
									<div className="col-span-2">
										<label className="block text-[11px] font-bold text-slate-500 mb-1">
											Blood Pressure (mmHg)
										</label>
										<input
											type="text"
											placeholder="120/80"
											value={vitalsBP}
											onChange={(e) =>
												setVitalsBP(e.target.value)
											}
											className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-mono font-bold"
										/>
									</div>
								)}

								{/* Temperature - Bypassed for Antenatal */}
								{queueItem.visit_type !==
									"Antenatal Checkup" && (
									<div>
										<label className="block text-[11px] font-bold text-slate-500 mb-1">
											Temperature (°C)
										</label>
										<input
											type="number"
											step="0.1"
											placeholder="36.5"
											value={vitalsTemp}
											onChange={(e) =>
												setVitalsTemp(e.target.value)
											}
											className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-mono"
										/>
									</div>
								)}

								{/* Pulse Rate - Bypassed for Antenatal */}
								{queueItem.visit_type !==
									"Antenatal Checkup" && (
									<div>
										<label className="block text-[11px] font-bold text-slate-500 mb-1">
											Pulse Rate (bpm)
										</label>
										<input
											type="number"
											placeholder="72"
											value={vitalsPulse}
											onChange={(e) =>
												setVitalsPulse(e.target.value)
											}
											className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-mono"
										/>
									</div>
								)}

								{/* Respiratory Rate - Bypassed for Antenatal */}
								{queueItem.visit_type !==
									"Antenatal Checkup" && (
									<div>
										<label className="block text-[11px] font-bold text-slate-500 mb-1">
											Resp Rate (cpm)
										</label>
										<input
											type="number"
											placeholder="16"
											value={vitalsResp}
											onChange={(e) =>
												setVitalsResp(e.target.value)
											}
											className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-mono"
										/>
									</div>
								)}

								{/* SpO2 - Bypassed for Antenatal */}
								{queueItem.visit_type !==
									"Antenatal Checkup" && (
									<div>
										<label className="block text-[11px] font-bold text-slate-500 mb-1">
											SpO2 Oxygen (%)
										</label>
										<input
											type="number"
											placeholder="98"
											value={vitalsSpo2}
											onChange={(e) =>
												setVitalsSpo2(e.target.value)
											}
											className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-mono"
										/>
									</div>
								)}

								{/* Weight - Everyone needs weight */}
								<div>
									<label className="block text-[11px] font-bold text-slate-500 mb-1">
										Weight (kg)
									</label>
									<input
										type="number"
										step="0.1"
										placeholder="70"
										value={vitalsWeight}
										onChange={(e) =>
											setVitalsWeight(e.target.value)
										}
										className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-mono"
									/>
								</div>

								{/* Height - Only for Non-Antenatal */}
								{queueItem.visit_type !==
									"Antenatal Checkup" && (
									<div>
										<label className="block text-[11px] font-bold text-slate-500 mb-1">
											Height (cm)
										</label>
										<input
											type="number"
											placeholder="170"
											value={vitalsHeight}
											onChange={(e) =>
												setVitalsHeight(e.target.value)
											}
											className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-mono"
										/>
									</div>
								)}
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
								<button
									type="button"
									onClick={onClose}
									className="px-4.5 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isSavingVitals}
									className="px-5 py-2 bg-[#A3D1E0] hover:bg-[#82bdcf] disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
								>
									{isSavingVitals && (
										<Loader2 className="h-3 w-3 animate-spin" />
									)}
									{isSavingVitals
										? "Saving..."
										: "Save Vitals & Send to Doc Queue"}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
