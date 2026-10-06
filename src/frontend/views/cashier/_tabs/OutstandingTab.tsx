/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (outstanding).
 */

import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import type { OutstandingBalance, Payment } from "@/types";

export interface OutstandingTabProps {
  outstandingList: OutstandingBalance[];
  payments: Payment[];
  rowPaymentAmounts: Record<string, string>;
  rowPaymentMethods: Record<string, string>;
  recordingRowId: string | null;
  setRowPaymentAmounts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setRowPaymentMethods: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleRecordRowPayment: (item: OutstandingBalance) => Promise<void>;
}

export default function OutstandingTab({
  outstandingList,
  payments,
  rowPaymentAmounts,
  rowPaymentMethods,
  recordingRowId,
  setRowPaymentAmounts,
  setRowPaymentMethods,
  handleRecordRowPayment,
}: OutstandingTabProps) {
  void payments;
  return (
				<div className="space-y-6">
					<div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h3 className="text-base font-black text-slate-900 flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-amber-500" />{" "}
								Active Outstanding Balances & Patient Debts
							</h3>
							<p className="text-xs text-slate-500 mt-0.5">
								Patients holding pending balances or partial payments.
								Cashiers can record payments directly and update
								balances.
							</p>
						</div>
						<div className="flex items-center gap-2">
							<span className="px-3.5 py-1.5 bg-rose-50 text-rose-700 font-mono font-bold text-xs rounded-xl border border-rose-200 shadow-2xs">
								Total Hospital Outstanding Debt: ₦
								{outstandingList
									.reduce(
										(acc, curr) => acc + (Number(curr.balance) || 0),
										0,
									)
									.toLocaleString()}
							</span>
						</div>
					</div>

					<div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
										<th className="p-3">Hospital Number</th>
										<th className="p-3">Patient Name</th>
										<th className="p-3">Fee Purpose</th>
										<th className="p-3">What is owed</th>
										<th className="p-3 text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{outstandingList.length === 0 ? (
										<tr>
											<td
												colSpan={5}
												className="text-center p-8 text-xs text-slate-400 font-medium"
											>
												No active outstanding balances recorded. All
												patient bills are fully settled!
											</td>
										</tr>
									) : (
										outstandingList.map((item) => (
											<tr
												key={item.id}
												className="text-xs hover:bg-slate-50/70 transition-colors"
											>
												<td className="p-3 font-mono font-bold text-[#2A758C] align-top pt-4">
													{item.hospital_number}
												</td>
												<td className="p-3 font-extrabold text-slate-900 align-top pt-4">
													<div>{item.patient_name}</div>
													{item.phone_number && (
														<div className="text-[10px] text-slate-400 font-normal font-mono">
															{item.phone_number}
														</div>
													)}
												</td>
												<td className="p-3 text-slate-700 font-medium align-top pt-4">
													<span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-lg text-[11px] font-semibold inline-block">
														{item.purpose || "Hospital Fee"}
													</span>
												</td>

												{/* What is owed Column */}
												<td className="p-3 align-top">
													<div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 space-y-1.5 min-w-[240px]">
														{/* Department Owed */}
														<div className="flex items-center justify-between text-[11px]">
															<span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">
																Department:
															</span>
															<span className="font-extrabold text-[#2A758C] bg-[#2A758C]/10 border border-[#2A758C]/20 px-2 py-0.5 rounded-md">
																{item.department_owed ||
																	item.department ||
																	"Hospital Services"}
															</span>
														</div>

														{/* Total Amount Owed */}
														<div className="flex items-center justify-between text-[11px]">
															<span className="text-slate-500 font-medium">
																Total Amount Owed:
															</span>
															<span className="font-mono font-extrabold text-slate-800">
																₦
																{Number(
																	item.total_bill || 0,
																).toLocaleString()}
															</span>
														</div>

														{/* Total Remaining Owed */}
														<div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
															<span className="text-rose-600 font-bold">
																Total Remaining Owed:
															</span>
															<span className="font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
																₦
																{Number(
																	item.balance || 0,
																).toLocaleString()}
															</span>
														</div>

														{/* Last Payment Made */}
														<div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
															<span className="font-medium">
																Last Payment:
															</span>
															<span className="font-mono font-semibold text-slate-600">
																{item.last_payment_date
																	? new Date(
																			item.last_payment_date,
																		).toLocaleString(
																			"en-US",
																			{
																				month: "short",
																				day: "numeric",
																				year: "numeric",
																				hour: "2-digit",
																				minute: "2-digit",
																			},
																		)
																	: "No prior payment"}
															</span>
														</div>
													</div>
												</td>

												{/* Actions Column */}
												<td className="p-3 text-right align-top pt-4">
													<div className="flex flex-col sm:flex-row items-center justify-end gap-2">
														{/* Payment Method Selector */}
														<select
															value={
																rowPaymentMethods[item.id] ||
																"Cash"
															}
															onChange={(e) =>
																setRowPaymentMethods(
																	(prev) => ({
																		...prev,
																		[item.id]: e.target.value,
																	}),
																)
															}
															className="bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 shadow-2xs focus:ring-2 focus:ring-[#2A758C] focus:outline-none"
														>
															<option value="Cash">
																💵 Cash
															</option>
															<option value="POS">
																💳 POS Card
															</option>
															<option value="Transfer">
																🏦 Bank Transfer
															</option>
														</select>

														{/* Input Field: Amount */}
														<div className="relative">
															<span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
																₦
															</span>
															<input
																type="number"
																placeholder="Amount"
																value={
																	rowPaymentAmounts[
																		item.id
																	] !== undefined
																		? rowPaymentAmounts[
																				item.id
																			]
																		: ""
																}
																onChange={(e) =>
																	setRowPaymentAmounts(
																		(prev) => ({
																			...prev,
																			[item.id]:
																				e.target.value,
																		}),
																	)
																}
																className="w-32 bg-white border border-slate-200 rounded-xl pl-7 pr-2.5 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#2A758C] focus:border-[#2A758C] focus:outline-none shadow-2xs placeholder:text-slate-400 placeholder:font-sans [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
															/>
														</div>

														{/* Record Payment Button */}
														<button
															type="button"
															onClick={() =>
																handleRecordRowPayment(item)
															}
															disabled={
																recordingRowId === item.id
															}
															className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95"
														>
															{recordingRowId === item.id ? (
																<>
																	<Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
																	Recording...
																</>
															) : (
																<>
																	<CheckCircle className="h-3.5 w-3.5" />{" "}
																	Collect Amount
																</>
															)}
														</button>
													</div>

													<div className="mt-1.5 flex items-center justify-end gap-1.5 text-[10px]">
														<span className="text-slate-400 font-medium">
															Quick fill:
														</span>
														<button
															type="button"
															onClick={() =>
																setRowPaymentAmounts(
																	(prev) => ({
																		...prev,
																		[item.id]:
																			item.balance.toString(),
																	}),
																)
															}
															className="text-[#2A758C] hover:underline font-bold font-mono bg-[#2A758C]/5 px-1.5 py-0.5 rounded border border-[#2A758C]/20"
														>
															Full Balance (₦
															{Number(
																item.balance || 0,
															).toLocaleString()}
															)
														</button>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
  );
}
