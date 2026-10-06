/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (ActionFeedbackModal).
 */

import { CheckCircle2, X } from "lucide-react";
import type { CashierActionFeedback } from "../_hooks/useCashierPayments";

export interface ActionFeedbackModalProps {
  actionFeedbackModal: CashierActionFeedback | null;
  setActionFeedbackModal: (v: CashierActionFeedback | null) => void;
}

export default function ActionFeedbackModal({
  actionFeedbackModal,
  setActionFeedbackModal,
}: ActionFeedbackModalProps) {
  return (
    <>
			{/* GLOBAL ACTION SUCCESS & VERIFICATION MODAL */}
			{actionFeedbackModal && actionFeedbackModal.isOpen && (
				<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
						<div className="flex items-start justify-between border-b border-slate-100 pb-4">
							<div className="flex items-center gap-3">
								<div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
									<CheckCircle2 className="h-7 w-7" />
								</div>
								<div>
									<h3 className="text-base font-black text-slate-800">
										{actionFeedbackModal.title}
									</h3>
									<p className="text-xs text-emerald-700 font-bold mt-0.5">
										{actionFeedbackModal.badgeText ||
											"Action Successfully Completed"}
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setActionFeedbackModal(null)}
								className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-2">
							<p className="text-xs font-semibold text-slate-800 leading-relaxed">
								{actionFeedbackModal.message}
							</p>
							{actionFeedbackModal.patientName && (
								<div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs">
									<span className="font-bold text-slate-600">
										Patient:
									</span>
									<span className="font-extrabold text-slate-900">
										{actionFeedbackModal.patientName} (
										{actionFeedbackModal.hospitalNumber || "—"})
									</span>
								</div>
							)}
							{actionFeedbackModal.amount !== undefined && (
								<div className="flex items-center justify-between text-xs">
									<span className="font-bold text-slate-600">
										Amount Verified:
									</span>
									<span className="font-mono font-black text-emerald-800 text-sm">
										₦{actionFeedbackModal.amount.toLocaleString()}
									</span>
								</div>
							)}
						</div>

						{actionFeedbackModal.details &&
							actionFeedbackModal.details.length > 0 && (
								<div className="space-y-2">
									<p className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">
										Departmental Execution Details
									</p>
									<div className="divide-y divide-slate-100 bg-slate-50/80 rounded-2xl border border-slate-100 p-3 space-y-2">
										{actionFeedbackModal.details.map((item, idx) => (
											<div
												key={idx}
												className="pt-2 first:pt-0 flex items-center justify-between text-xs"
											>
												<span className="text-slate-500 font-medium">
													{item.label}
												</span>
												<span className="font-bold text-slate-800 text-right">
													{item.value}
												</span>
											</div>
										))}
									</div>
								</div>
							)}

						<div className="pt-2 flex justify-end">
							<button
								type="button"
								onClick={() => setActionFeedbackModal(null)}
								className="w-full py-3 bg-[#2A758C] hover:bg-[#1f5869] text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer text-center"
							>
								Acknowledge & Continue
							</button>
						</div>
					</div>
				</div>
			)}
    </>
  );
}
