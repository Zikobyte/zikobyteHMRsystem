/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (DiscountModal).
 */

import { AnimatePresence, motion } from "motion/react";
import { Coins, Loader2, Percent, Send, X } from "lucide-react";
import type { DiscountTarget } from "../_hooks/useCashierDiscounts";

export interface DiscountModalProps {
  discountModalOpen: boolean;
  discountTarget: DiscountTarget | null;
  discountType: "Percentage" | "Fixed";
  discountValue: string;
  discountReason: string;
  isSubmittingDiscount: boolean;
  setDiscountModalOpen: (v: boolean) => void;
  setDiscountType: (v: "Percentage" | "Fixed") => void;
  setDiscountValue: (v: string) => void;
  setDiscountReason: (v: string) => void;
  handleDiscountSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function DiscountModal({
  discountModalOpen,
  discountTarget,
  discountType,
  discountValue,
  discountReason,
  isSubmittingDiscount,
  setDiscountModalOpen,
  setDiscountType,
  setDiscountValue,
  setDiscountReason,
  handleDiscountSubmit,
}: DiscountModalProps) {
  return (
    <>
			{/* DISCOUNT REQUEST MODAL */}
			<AnimatePresence>
				{discountModalOpen && discountTarget && (
					<div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4"
						>
							<div className="flex items-start justify-between border-b border-slate-100 pb-3">
								<div>
									<h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
										<Percent className="h-5 w-5 text-amber-600" />{" "}
										Discount Request → HR Approval Required
									</h3>
									<p className="text-[11px] text-slate-500 mt-0.5">
										Submit discount authorization request to Human
										Resources / Management.
									</p>
								</div>
								<button
									type="button"
									onClick={() => setDiscountModalOpen(false)}
									className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer hover:bg-slate-100 transition-all"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							{/* Patient Summary Badge */}
							<div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs flex items-center justify-between">
								<div>
									<p className="font-extrabold text-slate-800">
										{discountTarget.patientName}
									</p>
									<p className="text-[10px] text-slate-500 font-mono">
										{discountTarget.hospitalNumber || "Outpatient"}
									</p>
								</div>
								<div className="text-right">
									<span className="text-[10px] text-slate-400 block uppercase font-mono">
										Original Bill
									</span>
									<span className="font-mono font-black text-slate-900 text-sm">
										₦
										{(
											discountTarget.originalAmount || 0
										).toLocaleString()}
									</span>
								</div>
							</div>

							<form
								onSubmit={handleDiscountSubmit}
								className="space-y-4"
							>
								{/* Discount Type Selector */}
								<div>
									<label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
										Discount Type
									</label>
									<div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
										<button
											type="button"
											onClick={() => setDiscountType("Percentage")}
											className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
												discountType === "Percentage"
													? "bg-amber-600 text-white shadow-xs"
													: "text-slate-600 hover:bg-slate-200/60"
											}`}
										>
											<Percent className="h-3.5 w-3.5" />
											<span>Percentage (%)</span>
										</button>
										<button
											type="button"
											onClick={() => setDiscountType("Fixed")}
											className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
												discountType === "Fixed"
													? "bg-amber-600 text-white shadow-xs"
													: "text-slate-600 hover:bg-slate-200/60"
											}`}
										>
											<Coins className="h-3.5 w-3.5" />
											<span>Fixed Amount (₦)</span>
										</button>
									</div>
								</div>

								{/* Value Input */}
								<div>
									<label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
										{discountType === "Percentage"
											? "Discount Percentage (%)"
											: "Discount Amount (₦)"}
									</label>
									<input
										type="number"
										required
										min="0.01"
										step="any"
										placeholder={
											discountType === "Percentage"
												? "e.g. 10"
												: "e.g. 5000"
										}
										value={discountValue}
										onChange={(e) => setDiscountValue(e.target.value)}
										className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
									/>
								</div>

								{/* Reason Input */}
								<div>
									<label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
										Reason for Discount *
									</label>
									<textarea
										required
										rows={3}
										placeholder="e.g. Staff dependent, financial hardship, MD directive..."
										value={discountReason}
										onChange={(e) =>
											setDiscountReason(e.target.value)
										}
										className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
									/>
								</div>

								{/* Realtime Calculation Summary */}
								{discountValue && parseFloat(discountValue) > 0 && (
									<div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1">
										<div className="flex justify-between font-medium text-[11px]">
											<span>Original Bill:</span>
											<span className="font-mono font-bold">
												₦
												{(
													discountTarget.originalAmount || 0
												).toLocaleString()}
											</span>
										</div>
										<div className="flex justify-between font-medium text-[11px] text-amber-700">
											<span>Calculated Discount:</span>
											<span className="font-mono font-bold">
												-₦
												{(discountType === "Percentage"
													? ((discountTarget.originalAmount || 0) *
															parseFloat(discountValue)) /
														100
													: parseFloat(discountValue)
												).toLocaleString()}
											</span>
										</div>
										<div className="flex justify-between font-bold text-xs pt-1 border-t border-amber-200/80 text-amber-900">
											<span>Final Payable After HR Approval:</span>
											<span className="font-mono text-sm">
												₦
												{Math.max(
													0,
													(discountTarget.originalAmount || 0) -
														(discountType === "Percentage"
															? ((discountTarget.originalAmount ||
																	0) *
																	parseFloat(discountValue)) /
																100
															: parseFloat(discountValue)),
												).toLocaleString()}
											</span>
										</div>
									</div>
								)}

								<div className="flex items-center gap-2 pt-2">
									<button
										type="button"
										onClick={() => setDiscountModalOpen(false)}
										className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-all"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={isSubmittingDiscount}
										className="flex-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
									>
										{isSubmittingDiscount ? (
											<Loader2 className="animate-spin h-4 w-4" />
										) : (
											<Send className="h-4 w-4" />
										)}
										<span>Submit Discount Request → HR</span>
									</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

    </>
  );
}
