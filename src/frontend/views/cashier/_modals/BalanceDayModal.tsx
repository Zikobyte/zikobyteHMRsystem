/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (BalanceDayModal).
 */

import { AnimatePresence, motion } from "motion/react";
import { Calculator, Printer, ShieldAlert, X } from "lucide-react";
import type { Payment } from "@/types";

export interface BalanceDayModalProps {
  isBalanceModalOpen: boolean;
  payments: Payment[];
  cashTotal: number;
  posTotal: number;
  transferTotal: number;
  totalCollected: number;
  totalPVExpensed: number;
  totalPVCount: number;
  setIsBalanceModalOpen: (v: boolean) => void;
  setSuccess: (msg: string) => void;
}

export default function BalanceDayModal({
  isBalanceModalOpen,
  payments,
  cashTotal,
  posTotal,
  transferTotal,
  totalCollected,
  totalPVExpensed,
  totalPVCount,
  setIsBalanceModalOpen,
  setSuccess,
}: BalanceDayModalProps) {
  return (
    <>
			{/* 6. Day Revenue Balancing Modal */}
			<AnimatePresence>
				{isBalanceModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 overflow-hidden space-y-5"
						>
							{/* Modal Header */}
							<div className="flex items-center justify-between pb-4 border-b border-slate-100">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-2xl bg-[#2A758C]/10 border border-[#2A758C]/20 flex items-center justify-center text-[#2A758C]">
										<Calculator className="h-5 w-5" />
									</div>
									<div>
										<h3 className="text-base font-black text-slate-800 tracking-tight">
											Day's Revenue Balancing & Shift Settlement
										</h3>
										<p className="text-xs text-slate-400">
											Official Daily Financial Summary & Balance
											Reconciliation
										</p>
									</div>
								</div>
								<button
									onClick={() => setIsBalanceModalOpen(false)}
									className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
								>
									<X className="h-4 w-4" />
								</button>
							</div>

							{/* Unconfirmed Handovers Alert Banner */}
							{payments.filter((p) => p.status === "Unconfirmed")
								.length > 0 && (
								<div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
									<ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
									<div className="text-xs text-amber-900 space-y-1">
										<p className="font-bold">
											Unconfirmed Handovers Pending (
											{
												payments.filter(
													(p) => p.status === "Unconfirmed",
												).length
											}
											)
										</p>
										<p className="text-[11px] text-amber-800">
											There is{" "}
											<strong>
												₦
												{payments
													.filter(
														(p) => p.status === "Unconfirmed",
													)
													.reduce(
														(acc, p) => acc + Number(p.amount),
														0,
													)
													.toLocaleString()}
											</strong>{" "}
											in unconfirmed cash collected by OPD/Lab.
											Please confirm receipt on the Billing Desk
											before closing shift.
										</p>
									</div>
								</div>
							)}

							{/* Revenue Breakdown Matrix */}
							<div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
								<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
									1. Confirmed Gross Income
								</p>
								<div className="grid grid-cols-3 gap-2 text-xs">
									<div className="bg-white p-3 rounded-xl border border-slate-100">
										<span className="text-[10px] text-slate-400 block font-medium">
											Cash Income
										</span>
										<span className="font-black text-slate-800 font-mono mt-1 block">
											₦{cashTotal.toLocaleString()}
										</span>
									</div>
									<div className="bg-white p-3 rounded-xl border border-slate-100">
										<span className="text-[10px] text-slate-400 block font-medium">
											POS Terminal
										</span>
										<span className="font-black text-slate-800 font-mono mt-1 block">
											₦{posTotal.toLocaleString()}
										</span>
									</div>
									<div className="bg-white p-3 rounded-xl border border-slate-100">
										<span className="text-[10px] text-slate-400 block font-medium">
											Bank Transfer
										</span>
										<span className="font-black text-slate-800 font-mono mt-1 block">
											₦{transferTotal.toLocaleString()}
										</span>
									</div>
								</div>

								<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-700">
									<span>Total Confirmed Gross Revenue:</span>
									<span className="font-mono text-sm text-emerald-600">
										₦{totalCollected.toLocaleString()}
									</span>
								</div>
							</div>

							{/* Disbursements Deductions Matrix */}
							<div className="space-y-2 bg-rose-50/50 p-4 rounded-2xl border border-rose-100/60">
								<p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest font-mono">
									2. Less: Payment Vitae (PV) Expenses
								</p>
								<div className="flex items-center justify-between text-xs">
									<span className="text-slate-600">
										Total PV Receipts ({totalPVCount}):
									</span>
									<span className="font-bold text-rose-700 font-mono">
										- ₦{totalPVExpensed.toLocaleString()}
									</span>
								</div>
							</div>

							{/* Net Balanced Revenue Box */}
							<div className="p-4 bg-[#2A758C]/10 border border-[#2A758C]/20 rounded-2xl flex items-center justify-between">
								<div>
									<span className="text-[10px] font-extrabold text-[#2A758C] uppercase tracking-widest block font-mono">
										Net Balanced Revenue (After PV)
									</span>
									<span className="text-xs text-slate-500">
										Net Cash In Till:{" "}
										<strong>
											₦
											{(
												cashTotal - totalPVExpensed
											).toLocaleString()}
										</strong>
									</span>
								</div>
								<div className="text-right">
									<span className="text-xl font-black text-[#2A758C] font-mono">
										₦
										{(
											totalCollected - totalPVExpensed
										).toLocaleString()}
									</span>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center justify-end gap-3 pt-2">
								<button
									onClick={() => setIsBalanceModalOpen(false)}
									className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl transition-all cursor-pointer"
								>
									Close
								</button>
								<button
									onClick={() => {
										setSuccess(
											"Day's Revenue Balance sheet logged and printed successfully!",
										);
										setIsBalanceModalOpen(false);
									}}
									className="px-5 py-2 text-xs font-bold text-white bg-[#2A758C] hover:bg-[#1f5869] rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer"
								>
									<Printer className="h-4 w-4" />
									<span>Print & Lock Day's Balance Sheet</span>
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
    </>
  );
}
