/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (Billing: DepartmentHandoverPanel).
 */

import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import type { Payment } from "@/types";

export interface DepartmentHandoverPanelProps {
  payments: Payment[];
  isConfirmingHandover: string | null;
  handleConfirmHandover: (paymentId: string) => Promise<void>;
  getPatientDetails: (patId: string | undefined) => { name: string; hNum: string };
}

export default function DepartmentHandoverPanel({
  payments,
  isConfirmingHandover,
  handleConfirmHandover,
  getPatientDetails,
}: DepartmentHandoverPanelProps) {
  return (
    <>
						{/* Section B1: Departmental Cash Handovers */}
						{payments.filter((p) => p.status === "Unconfirmed").length >
						0 ? (
							<div className="lg:col-span-1 bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="text-xs font-black text-amber-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
										<ShieldAlert className="h-4 w-4 text-amber-600" />{" "}
										Departmental Handovers
									</h3>
									<span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-200 text-amber-900 rounded-full animate-pulse">
										{
											payments.filter(
												(p) => p.status === "Unconfirmed",
											).length
										}{" "}
										Unconfirmed
									</span>
								</div>
								<p className="text-[11px] text-amber-800">
									Cash collected by OPD Nurses or Lab Scientists.
									Confirm receipt to balance revenue.
								</p>
								<div className="space-y-2 max-h-40 overflow-y-auto">
									{payments
										.filter((p) => p.status === "Unconfirmed")
										.map((p) => {
											const pat = getPatientDetails(p.patientId);
											return (
												<div
													key={p.id}
													className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs space-y-2"
												>
													<div className="flex items-start justify-between">
														<div>
															<p className="font-bold text-slate-800 text-xs">
																{pat.name}
															</p>
															<p className="text-[10px] text-slate-400 font-mono">
																{pat.hNum}
															</p>
														</div>
														<span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
															₦{p.amount.toLocaleString()}
														</span>
													</div>
													<div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
														<span>
															Method:{" "}
															<strong className="text-slate-700">
																{p.paymentMethod}
															</strong>
														</span>
														<span className="font-mono text-slate-400">
															{p.datePaid
																? p.datePaid.split("T")[0]
																: "Today"}
														</span>
													</div>
													<button
														onClick={() =>
															handleConfirmHandover(p.id)
														}
														disabled={
															isConfirmingHandover === p.id
														}
														className="w-full mt-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
													>
														{isConfirmingHandover === p.id ? (
															<Loader2 className="animate-spin h-3.5 w-3.5" />
														) : (
															<CheckCircle2 className="h-3.5 w-3.5" />
														)}
														<span>Confirm & Settle Handover</span>
													</button>
												</div>
											);
										})}
								</div>
							</div>
						) : (
							<div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-center">
								<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
									Status Indicator
								</span>
								<p className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
									<CheckCircle2 className="h-4 w-4 text-emerald-500" />
									All Departmental Handovers Settled
								</p>
								<p className="text-[10px] text-slate-400 mt-0.5">
									Ready for active billing processing.
								</p>
							</div>
						)}
    </>
  );
}
