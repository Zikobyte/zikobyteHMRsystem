/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (escalate queue priority
 * modal). Verbatim JSX: priority-level select, escalation-reason textarea,
 * cancel/escalate footer. No behavior change — escalation state and submit
 * wiring arrive as props. The shell keeps the
 * `isEscalateOpen && selectedQueueItem` gate via the `open` prop.
 */

import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import type { RegistrationSubmitHandler } from "../_components/register/registrationProps";

export interface EscalatePriorityModalProps {
	open: boolean;
	escalatePriority: string;
	setEscalatePriority: (value: string) => void;
	escalateReason: string;
	setEscalateReason: (value: string) => void;
	isEscalating: boolean;
	onClose: () => void;
	onSubmit: RegistrationSubmitHandler;
}

export default function EscalatePriorityModal({
	open,
	escalatePriority,
	setEscalatePriority,
	escalateReason,
	setEscalateReason,
	isEscalating,
	onClose,
	onSubmit,
}: EscalatePriorityModalProps) {
	return (
		<AnimatePresence>
			{open && (
				<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-xl space-y-6"
					>
						<div className="flex justify-between items-center pb-4 border-b border-slate-100">
							<h3 className="text-base font-bold text-slate-900">
								Escalate Queue Priority
							</h3>
							<button
								onClick={onClose}
								className="text-slate-400 hover:text-slate-600"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<form
							onSubmit={onSubmit}
							className="space-y-4"
						>
							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
									New Priority Level
								</label>
								<select
									value={escalatePriority}
									onChange={(e) =>
										setEscalatePriority(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
								>
									<option value="Routine">Routine</option>
									<option value="Urgent">Urgent</option>
									<option value="Emergency">Emergency</option>
								</select>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
									Escalation Reason
								</label>
								<textarea
									required
									placeholder="Provide detailed clinical reason for queue escalation..."
									value={escalateReason}
									onChange={(e) =>
										setEscalateReason(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 h-24"
								/>
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
								<button
									type="button"
									onClick={onClose}
									className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isEscalating}
									className="px-5 py-2 bg-[#A3D1E0] hover:bg-[#82bdcf] disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
								>
									{isEscalating && (
										<Loader2 className="h-3 w-3 animate-spin" />
									)}
									{isEscalating
										? "Escalating..."
										: "Save & Escalate Queue"}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
