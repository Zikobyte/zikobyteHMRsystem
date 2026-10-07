/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (ADMINISTER MEDICATION MODAL).
 * Verbatim JSX — medication, note draft, and callbacks arrive as props.
 */

import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { AdmittedMedRecord } from "../_utils/doctor-types";

export interface AdministerMedicationModalProps {
	open: boolean;
	medication: AdmittedMedRecord | null;
	note: string;
	onNoteChange: (value: string) => void;
	onClose: () => void;
	onConfirm: (medId: string, note: string) => void;
}

export default function AdministerMedicationModal({
	open,
	medication: selectedMedToAdminister,
	note: administerNote,
	onNoteChange: setAdministerNote,
	onClose,
	onConfirm: handleAdministerMedication,
}: AdministerMedicationModalProps) {
	return (
		<AnimatePresence>
			{open && selectedMedToAdminister && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
					<motion.div
						initial={{ opacity: 0, scale: 0.96 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.96 }}
						className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
					>
						<div className="p-4 bg-emerald-700 text-white flex justify-between items-center">
							<div className="flex items-center gap-2">
								<Check className="h-5 w-5" />
								<h3 className="text-sm font-bold">
									Administer Medication
								</h3>
							</div>
							<button
								type="button"
								onClick={onClose}
								className="text-emerald-100 hover:text-white p-1 rounded-lg cursor-pointer"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="p-5 space-y-3 text-xs">
							<div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
								<p className="font-extrabold text-emerald-900 text-sm">
									{selectedMedToAdminister.name}
								</p>
								<p className="text-emerald-700 font-mono mt-0.5">
									Dose: {selectedMedToAdminister.dose} | Frequency:{" "}
									{selectedMedToAdminister.frequency || "STAT"}
								</p>
							</div>

							<div className="space-y-1">
								<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
									Administration Notes (optional)
								</label>
								<textarea
									rows={2}
									value={administerNote}
									onChange={(e) =>
										setAdministerNote(e.target.value)
									}
									placeholder="e.g. Tolerated well, IV site clear..."
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
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
								onClick={() =>
									handleAdministerMedication(
										selectedMedToAdminister.id,
										administerNote,
									)
								}
								className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
							>
								Mark as Administered
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
