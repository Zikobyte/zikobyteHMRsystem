/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (ADD MEDICATION LOG MODAL).
 * Verbatim JSX — draft fields and callbacks arrive as props. The status
 * select is typed via MedLogStatus (fixes the original string/union
 * tsc error at the onChange site).
 */

import { Pill, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { MedLogStatus } from "../_utils/doctor-types";

export interface AddMedLogModalProps {
	open: boolean;
	medName: string;
	medDose: string;
	medQuantity: string;
	medFrequency: string;
	medStatus: MedLogStatus;
	medNote: string;
	onMedNameChange: (value: string) => void;
	onMedDoseChange: (value: string) => void;
	onMedQuantityChange: (value: string) => void;
	onMedFrequencyChange: (value: string) => void;
	onMedStatusChange: (value: MedLogStatus) => void;
	onMedNoteChange: (value: string) => void;
	onClose: () => void;
	onSave: () => void;
}

export default function AddMedLogModal({
	open,
	medName: newMedName,
	medDose: newMedDose,
	medQuantity: newMedQuantity,
	medFrequency: newMedFrequency,
	medStatus: newMedStatus,
	medNote: newMedNote,
	onMedNameChange: setNewMedName,
	onMedDoseChange: setNewMedDose,
	onMedQuantityChange: setNewMedQuantity,
	onMedFrequencyChange: setNewMedFrequency,
	onMedStatusChange: setNewMedStatus,
	onMedNoteChange: setNewMedNote,
	onClose,
	onSave: handleAddMedicationLog,
}: AddMedLogModalProps) {
	return (
		<AnimatePresence>
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
					<motion.div
						initial={{ opacity: 0, scale: 0.96 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.96 }}
						className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
					>
						<div className="p-4 bg-[#2A758C] text-white flex justify-between items-center">
							<div className="flex items-center gap-2">
								<Pill className="h-5 w-5" />
								<h3 className="text-sm font-bold">
									Add Medication Administration Log
								</h3>
							</div>
							<button
								type="button"
								onClick={onClose}
								className="text-sky-100 hover:text-white p-1 rounded-lg cursor-pointer"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="p-5 space-y-3 text-xs">
							<div className="space-y-1">
								<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
									Medication Name
								</label>
								<input
									type="text"
									value={newMedName}
									onChange={(e) => setNewMedName(e.target.value)}
									placeholder="e.g. Paracetamol IV 1g, Ceftriaxone 1g"
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
								/>
							</div>

							<div className="grid grid-cols-3 gap-2">
								<div className="space-y-1">
									<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
										Dose
									</label>
									<input
										type="text"
										value={newMedDose}
										onChange={(e) => setNewMedDose(e.target.value)}
										placeholder="e.g. 1g"
										className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
									/>
								</div>
								<div className="space-y-1">
									<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
										Quantity
									</label>
									<input
										type="text"
										value={newMedQuantity}
										onChange={(e) =>
											setNewMedQuantity(e.target.value)
										}
										className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
									/>
								</div>
								<div className="space-y-1">
									<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
										Frequency
									</label>
									<input
										type="text"
										value={newMedFrequency}
										onChange={(e) =>
											setNewMedFrequency(e.target.value)
										}
										placeholder="e.g. TDS"
										className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
									/>
								</div>
							</div>

							<div className="space-y-1">
								<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
									Status
								</label>
								<select
									value={newMedStatus}
									onChange={(e) => setNewMedStatus(e.target.value as MedLogStatus)}
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
								>
									<option value="Administered">Administered</option>
									<option value="Pending">Pending</option>
									<option value="Dispensed">Dispensed</option>
									<option value="Cancelled">Cancelled</option>
								</select>
							</div>

							<div className="space-y-1">
								<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
									Clinical Note (optional)
								</label>
								<textarea
									rows={2}
									value={newMedNote}
									onChange={(e) => setNewMedNote(e.target.value)}
									placeholder="Clinical notes or patient reaction..."
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none font-mono"
								/>
							</div>
						</div>

						<div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
							<button
								type="button"
								onClick={onClose}
								className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleAddMedicationLog}
								className="px-4 py-1.5 bg-[#2A758C] hover:bg-[#1f5869] text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
							>
								Save Log
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
