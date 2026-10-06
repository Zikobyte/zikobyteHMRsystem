/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (replace lost clinical
 * card modal). Verbatim JSX: mandatory history-refresh warning, old/new card
 * numbers, last-office-seen select, replacement reason, role-gated approve
 * footer. No behavior change — `selectedPatient` sharing is preserved via the
 * shell wrapper; the OPD/Cashier role gate arrives as `canManageReplacements`
 * (computed in the shell with `canManageCardReplacements`).
 */

import { motion, AnimatePresence } from "motion/react";
import { CreditCard, AlertCircle, X, Loader2 } from "lucide-react";
import type { Patient } from "@/types";
import type { RegistrationSubmitHandler } from "../_components/register/registrationProps";

export interface CardReplacementModalProps {
	open: boolean;
	patient: Patient | null;
	replacementOldCard: string;
	replacementNewCard: string;
	setReplacementNewCard: (value: string) => void;
	replacementOffice: string;
	setReplacementOffice: (value: string) => void;
	replacementReason: string;
	setReplacementReason: (value: string) => void;
	isSavingReplacement: boolean;
	canManageReplacements: boolean;
	onClose: () => void;
	onSubmit: RegistrationSubmitHandler;
}

export default function CardReplacementModal({
	open,
	patient,
	replacementOldCard,
	replacementNewCard,
	setReplacementNewCard,
	replacementOffice,
	setReplacementOffice,
	replacementReason,
	setReplacementReason,
	isSavingReplacement,
	canManageReplacements,
	onClose,
	onSubmit,
}: CardReplacementModalProps) {
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
								<CreditCard className="h-5 w-5 text-rose-600" />
								<h3 className="text-base font-bold text-slate-900">
									Replace Lost Clinical Card
								</h3>
							</div>
							<button
								onClick={onClose}
								className="text-slate-400 hover:text-slate-600"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Warning about medical history reset */}
						<div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex gap-3 text-xs">
							<AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
							<div>
								<p className="font-bold text-rose-900">
									MANDATORY HISTORICAL DATA REFRESH
								</p>
								<p className="mt-1 leading-relaxed">
									By submitting a card replacement, all historical
									vitals, maternity details, and emergency logs will
									be deleted. The patient's status will be set to{" "}
									<span className="font-bold">
										"History Refreshed"
									</span>
									. This is a strict safety audit procedure.
								</p>
							</div>
						</div>

						<form
							onSubmit={onSubmit}
							className="space-y-4"
						>
							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
									Patient Name
								</label>
								<input
									type="text"
									disabled
									value={patient.name}
									className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
										Old Card Number
									</label>
									<input
										type="text"
										disabled
										value={replacementOldCard}
										className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-mono"
									/>
								</div>
								<div>
									<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
										New Card Number
									</label>
									<input
										type="text"
										required
										value={replacementNewCard}
										onChange={(e) =>
											setReplacementNewCard(e.target.value)
										}
										className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-bold"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
									Last Office Seen Claimed
								</label>
								<select
									value={replacementOffice}
									onChange={(e) =>
										setReplacementOffice(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
								>
									<option value="Nursing Front-Desk">
										Nursing Front-Desk
									</option>
									<option value="Doctor Office">
										Doctor Office
									</option>
									<option value="Reception / Records">
										Reception / Records
									</option>
									<option value="Billing / Cashier">
										Billing / Cashier
									</option>
								</select>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
									Reason for Replacement
								</label>
								<textarea
									required
									value={replacementReason}
									onChange={(e) =>
										setReplacementReason(e.target.value)
									}
									placeholder="Lost, damaged, stolen card details..."
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 h-20"
								/>
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
								<button
									type="button"
									onClick={onClose}
									className="px-4.5 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={
										isSavingReplacement ||
										!canManageReplacements
									}
									title={
										canManageReplacements
											? undefined
											: "OPD or Cashier staff only"
									}
									className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 disabled:cursor-not-allowed"
								>
									{isSavingReplacement && (
										<Loader2 className="h-3 w-3 animate-spin" />
									)}
									{isSavingReplacement
										? "Approving..."
										: "Approve & Reset History"}
								</button>
							</div>
							{!canManageReplacements && (
								<p className="text-[11px] text-slate-500 font-medium">
									Only OPD or Cashier staff can approve card
									replacements.
								</p>
							)}
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
