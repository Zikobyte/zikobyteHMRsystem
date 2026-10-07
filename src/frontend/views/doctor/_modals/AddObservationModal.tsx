/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (ADD OBSERVATION MODAL).
 * Verbatim JSX — category/note drafts and callbacks arrive as props.
 * The category select is typed via ObsCategory (fixes the original
 * string/union tsc error at the onChange site).
 */

import { Activity, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ObsCategory } from "../_hooks/useAdmittedOrders";

export interface AddObservationModalProps {
	open: boolean;
	category: ObsCategory;
	note: string;
	onCategoryChange: (value: ObsCategory) => void;
	onNoteChange: (value: string) => void;
	onClose: () => void;
	onSave: () => void;
}

export default function AddObservationModal({
	open,
	category: obsCategory,
	note: obsNote,
	onCategoryChange: setObsCategory,
	onNoteChange: setObsNote,
	onClose,
	onSave: handleAddObservation,
}: AddObservationModalProps) {
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
								<Activity className="h-5 w-5" />
								<h3 className="text-sm font-bold">
									Add Clinical Observation
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
									Category
								</label>
								<select
									value={obsCategory}
									onChange={(e) => setObsCategory(e.target.value as ObsCategory)}
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
								>
									<option value="Doctor Round">Doctor Round</option>
									<option value="Nursing Evaluation">
										Nursing Evaluation
									</option>
									<option value="Surgical / Wound Check">
										Surgical / Wound Check
									</option>
									<option value="Dietary / Fluid Charting">
										Dietary / Fluid Charting
									</option>
									<option value="General Progress">
										General Progress
									</option>
								</select>
							</div>

							<div className="space-y-1">
								<label className="block text-[10px] font-bold text-slate-400 uppercase font-mono">
									Observation Notes
								</label>
								<textarea
									rows={4}
									value={obsNote}
									onChange={(e) => setObsNote(e.target.value)}
									placeholder="Detail patient clinical status, response to treatment, examination findings..."
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2A758C] font-mono leading-relaxed"
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
								onClick={handleAddObservation}
								className="px-4 py-1.5 bg-[#2A758C] hover:bg-[#1f5869] text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
							>
								Save Observation
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
