/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (family account deposit
 * top-up modal). Verbatim JSX: account-head display, top-up amount, remarks,
 * cancel/confirm footer. No behavior change.
 *
 * Minimal-churn coupling decision (per the 3D brief): deposit state
 * (`depositAmount` / `depositDescription`) and the submit handler stay in the
 * shell and arrive as props, exactly like the other small modals.
 */

import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import type { OpdFamilyAccount } from "../_hooks/useOpdDirectory";
import type { RegistrationSubmitHandler } from "../_components/register/registrationProps";

export interface FamilyDepositModalProps {
	open: boolean;
	family: OpdFamilyAccount | null;
	depositAmount: string;
	setDepositAmount: (value: string) => void;
	depositDescription: string;
	setDepositDescription: (value: string) => void;
	isSavingDeposit: boolean;
	onClose: () => void;
	onSubmit: RegistrationSubmitHandler;
}

export default function FamilyDepositModal({
	open,
	family,
	depositAmount,
	setDepositAmount,
	depositDescription,
	setDepositDescription,
	isSavingDeposit,
	onClose,
	onSubmit,
}: FamilyDepositModalProps) {
	return (
		<AnimatePresence>
			{open && family && (
				<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-xl space-y-6"
					>
						<div className="flex justify-between items-center pb-4 border-b border-slate-100">
							<h3 className="text-base font-bold text-slate-900">
								Family Account Deposit
							</h3>
							<button
								onClick={onClose}
								className="text-slate-400 hover:text-slate-600"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<form onSubmit={onSubmit} className="space-y-4">
							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
									Family Account Head
								</label>
								<input
									type="text"
									disabled
									value={`${family.name} Head`}
									className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-bold"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
									Top-up Deposit Amount (₦)
								</label>
								<input
									type="number"
									required
									placeholder="5000"
									value={depositAmount}
									onChange={(e) => setDepositAmount(e.target.value)}
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-black"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
									Transaction Remarks
								</label>
								<input
									type="text"
									value={depositDescription}
									onChange={(e) =>
										setDepositDescription(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
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
									disabled={isSavingDeposit}
									className="px-5 py-2 bg-[#A3D1E0] hover:bg-[#82bdcf] disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
								>
									{isSavingDeposit && (
										<Loader2 className="h-3 w-3 animate-spin" />
									)}
									{isSavingDeposit
										? "Confirming..."
										: "Confirm Deposit"}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
