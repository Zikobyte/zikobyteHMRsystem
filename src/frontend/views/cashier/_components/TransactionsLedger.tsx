/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (Billing: TransactionsLedger).
 */

import { CheckCircle, Receipt } from "lucide-react";
import ExportButton from "@/components/shared/ExportButton";
import type { Payment } from "@/types";

export interface TransactionsLedgerProps {
  filteredPayments: Payment[];
  filterMethod: string;
  setFilterMethod: (v: string) => void;
  getPatientDetails: (patId: string | undefined) => { name: string; hNum: string };
  getCollectorName: (userId?: string) => string;
  setSuccess: (msg: string) => void;
  setError: (msg: string) => void;
}

export default function TransactionsLedger({
  filteredPayments,
  filterMethod,
  setFilterMethod,
  getPatientDetails,
  getCollectorName,
  setSuccess,
  setError,
}: TransactionsLedgerProps) {
  return (
    <>
					{/* FULL-WIDTH TRANSACTIONS LOG LEDGER */}
					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
								<Receipt className="h-4 w-4 text-[#2A758C]" /> 4.
								Transactions Log Ledger
							</h3>

							<div className="flex flex-wrap items-center gap-3">
								<ExportButton
									exportType="financials"
									label="Download Ledger"
									className="bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 font-extrabold"
									onSuccess={(msg) => setSuccess(msg)}
									onFailure={(msg) => setError(msg)}
								/>

								<div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl">
									<button
										onClick={() => setFilterMethod("ALL")}
										className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${filterMethod === "ALL" ? "bg-[#2A758C] text-white shadow-2xs" : "text-slate-500 hover:text-slate-800"}`}
									>
										All Payments
									</button>
									<button
										onClick={() => setFilterMethod("CASH")}
										className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${filterMethod === "CASH" ? "bg-[#2A758C] text-white shadow-2xs" : "text-slate-500 hover:text-slate-800"}`}
									>
										Cash
									</button>
									<button
										onClick={() => setFilterMethod("POS")}
										className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${filterMethod === "POS" ? "bg-[#2A758C] text-white shadow-2xs" : "text-slate-500 hover:text-slate-800"}`}
									>
										POS
									</button>
									<button
										onClick={() => setFilterMethod("TRANSFER")}
										className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${filterMethod === "TRANSFER" ? "bg-[#2A758C] text-white shadow-2xs" : "text-slate-500 hover:text-slate-800"}`}
									>
										Transfer
									</button>
								</div>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-left text-xs">
								<thead>
									<tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] font-bold uppercase">
										<th className="pb-3">Patient Details</th>
										<th className="pb-3">Reference ID</th>
										<th className="pb-3">Payment Method</th>
										<th className="pb-3">Amount</th>
										<th className="pb-3">Date / Clerk</th>
										<th className="pb-3 text-right">
											Status & Action
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-50 text-slate-700">
									{filteredPayments.length > 0 ? (
										filteredPayments.map((p) => {
											const details = getPatientDetails(p.patientId);
											return (
												<tr
													key={p.id}
													className="hover:bg-slate-50/60 transition-all"
												>
													<td className="py-3">
														<p className="font-bold text-slate-800">
															{details.name}
														</p>
														<p className="text-[10px] text-slate-400 font-mono mt-0.5">
															{details.hNum}
														</p>
													</td>
													<td className="py-3 font-mono text-[10px] text-[#2A758C] font-semibold">
														{p.invoiceId || "PAY-ONLINE"}
													</td>
													<td className="py-3">
														<span
															className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase ${
																p.paymentMethod === "Cash"
																	? "bg-amber-50 text-amber-800 border border-amber-200/60"
																	: p.paymentMethod === "POS"
																		? "bg-indigo-50 text-indigo-800 border border-indigo-200/60"
																		: "bg-blue-50 text-blue-800 border border-blue-200/60"
															}`}
														>
															{p.paymentMethod}
														</span>
													</td>
													<td className="py-3 font-mono font-black text-slate-800">
														₦{p.amount.toLocaleString()}
													</td>
													<td className="py-3">
														<p className="text-[10px] text-slate-600 font-semibold">
															{new Date(
																p.datePaid,
															).toLocaleDateString()}
														</p>
														<p className="text-[9px] text-slate-400 mt-0.5">
															Clerk:{" "}
															{getCollectorName(p.collectedBy)}
														</p>
													</td>
													<td className="py-3 text-right">
														<div className="flex items-center gap-2 justify-end">
															<span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold text-[9px] px-2.5 py-1 rounded-full uppercase border border-emerald-200/60 shrink-0">
																<CheckCircle className="h-3 w-3 text-emerald-500" />{" "}
																Completed
															</span>
															<ExportButton
																exportType="receipt"
																paymentId={p.id}
																label="Receipt"
																className="!py-1 !px-2.5 bg-slate-100 border border-slate-300 font-black text-[10px] h-7 flex items-center justify-center rounded-lg text-black hover:bg-slate-200 shrink-0 cursor-pointer"
															/>
														</div>
													</td>
												</tr>
											);
										})
									) : (
										<tr>
											<td
												colSpan={6}
												className="py-12 text-center text-slate-400"
											>
												<Receipt className="h-8 w-8 text-slate-200 mx-auto mb-2" />
												<p className="font-bold text-slate-700 text-xs">
													No recorded transactions found
												</p>
												<p className="text-[10px] text-slate-400 mt-1">
													Try switching the method filters above or
													process a new bill settlement.
												</p>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
    </>
  );
}
