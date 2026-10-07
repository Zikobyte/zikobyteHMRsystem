/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (visit encounter &
 * queueing modal). Verbatim JSX: patient header, visit-type / clinic /
 * priority fields, conditional escalation-reason textarea, cancel/confirm
 * footer. No behavior change — `selectedPatient` sharing is preserved via the
 * shell wrapper (shell sets `selectedPatient`, then delegates to the queue
 * hook open-handler); encounter state/handlers arrive as props.
 */

import { motion, AnimatePresence } from "motion/react";
import { Clock, X, Loader2 } from "lucide-react";
import type { Patient } from "@/types";
import type { RegistrationSubmitHandler } from "../_components/register/registrationProps";

export interface EncounterModalProps {
	open: boolean;
	patient: Patient | null;
	encounterVisitType: string;
	setEncounterVisitType: (value: string) => void;
	encounterClinic: string;
	setEncounterClinic: (value: string) => void;
	encounterPriority: string;
	setEncounterPriority: (value: string) => void;
	encounterReason: string;
	setEncounterReason: (value: string) => void;
	isQueueing: boolean;
	onClose: () => void;
	onSubmit: RegistrationSubmitHandler;
}

export default function EncounterModal({
	open,
	patient,
	encounterVisitType,
	setEncounterVisitType,
	encounterClinic,
	setEncounterClinic,
	encounterPriority,
	setEncounterPriority,
	encounterReason,
	setEncounterReason,
	isQueueing,
	onClose,
	onSubmit,
}: EncounterModalProps) {
	return (
		<AnimatePresence>
			{open && patient && (
				<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-xl space-y-6"
					>
						<div className="flex justify-between items-center pb-4 border-b border-slate-100">
							<div className="flex items-center gap-2">
								<Clock className="h-5 w-5 text-[#2A758C]" />
								<h3 className="text-base font-bold text-slate-900">
									Queue Patient Visit
								</h3>
							</div>
							<button
								onClick={onClose}
								className="text-slate-400 hover:text-slate-600"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div>
							<p className="text-[11px] text-slate-400 uppercase tracking-widest font-mono font-bold">
								Patient Details
							</p>
							<p className="text-xs font-bold text-slate-800 mt-1">
								{patient.name}
							</p>
							<p className="text-[11px] font-mono text-[#2A758C] mt-0.5">
								{patient.hospitalNumber}
							</p>
						</div>

						<form
							onSubmit={onSubmit}
							className="space-y-4"
						>
							<div>
								<label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
									Visit Consultation Type
								</label>
								<select
									value={encounterVisitType}
									onChange={(e) =>
										setEncounterVisitType(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
								>
									<option value="New Patient Consultation">
										New Patient Consultation
									</option>
									<option value="Returning Patient Consultation">
										Returning Patient Consultation
									</option>
									<option value="Antenatal Checkup">
										Antenatal Checkup
									</option>
									<option value="Follow-up">Follow-up</option>
								</select>
							</div>

							<div>
								<label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
									Destination Clinic Room
								</label>
								<select
									value={encounterClinic}
									onChange={(e) =>
										setEncounterClinic(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
								>
									<option value="General OPD Out-Patient Clinic">
										General OPD Out-Patient Clinic
									</option>
									<option value="Eye Clinic">
										Eye Clinic (Ophthalmology)
									</option>
								</select>
							</div>

							<div>
								<label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
									Priority Classification
								</label>
								<select
									value={encounterPriority}
									onChange={(e) =>
										setEncounterPriority(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
								>
									<option value="Routine">Routine</option>
									<option value="Urgent">Urgent</option>
									<option value="Emergency">Emergency</option>
								</select>
							</div>

							{encounterPriority !== "Routine" && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
								>
									<label className="block text-[10px] font-bold text-rose-800 uppercase mb-1.5">
										Priority Escalation Reason (Required)
									</label>
									<textarea
										required
										placeholder="Specify reasons for urgency (vitals threshold, labor, severe bleeding etc.)"
										value={encounterReason}
										onChange={(e) =>
											setEncounterReason(e.target.value)
										}
										className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 h-20"
									/>
								</motion.div>
							)}

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
									disabled={isQueueing}
									className="px-5 py-2 bg-[#A3D1E0] hover:bg-[#82bdcf] disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
								>
									{isQueueing && (
										<Loader2 className="h-3 w-3 animate-spin" />
									)}
									{isQueueing
										? "Sending..."
										: "Confirm & Send to Queue"}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
