/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (discounts).
 */

import { CheckCircle2, Clock, Percent, ThumbsUp, X } from "lucide-react";
import type { DiscountRequest } from "@/types";

export interface DiscountsTabProps {
  discountRequestsList: DiscountRequest[];
  handleApproveDiscount: (requestId: string) => Promise<void>;
  handleRejectDiscount: (requestId: string) => Promise<void>;
}

export default function DiscountsTab({
  discountRequestsList,
  handleApproveDiscount,
  handleRejectDiscount,
}: DiscountsTabProps) {
  return (
				<div className="space-y-6">
					<div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h3 className="text-base font-black text-slate-900 flex items-center gap-2">
								<Percent className="h-5 w-5 text-amber-600" /> Patient
								Discount Requests (HR Approval Required)
							</h3>
							<p className="text-xs text-slate-500 mt-0.5">
								Review, authorize, or decline patient discount requests
								submitted for HR / Management review.
							</p>
						</div>
						<div className="flex items-center gap-2">
							<span className="px-3.5 py-1.5 bg-amber-50 text-amber-900 font-mono font-bold text-xs rounded-xl border border-amber-200 shadow-2xs">
								Pending HR Approvals:{" "}
								{
									discountRequestsList.filter(
										(d) => d.status === "Pending",
									).length
								}{" "}
								Request(s)
							</span>
						</div>
					</div>

					<div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse">
								<thead>
									<tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
										<th className="p-3">Patient Name / Hospital #</th>
										<th className="p-3">Requested By & Date</th>
										<th className="p-3">Original Bill</th>
										<th className="p-3">Discount Type & Value</th>
										<th className="p-3">Calculated Discount</th>
										<th className="p-3">Payable After HR Approval</th>
										<th className="p-3">Reason for Discount</th>
										<th className="p-3">Status</th>
										<th className="p-3 text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{discountRequestsList.length === 0 ? (
										<tr>
											<td
												colSpan={9}
												className="text-center p-12 text-xs text-slate-400 font-medium"
											>
												<Percent className="h-8 w-8 text-slate-300 mx-auto mb-2" />
												No discount requests submitted yet.
											</td>
										</tr>
									) : (
										discountRequestsList.map((d) => (
											<tr
												key={d.id}
												className="text-xs hover:bg-slate-50/70 transition-colors"
											>
												<td className="p-3 font-extrabold text-slate-900 align-top">
													<div>{d.patient_name}</div>
													<div className="text-[10px] text-[#2A758C] font-mono">
														{d.hospital_number || "Outpatient"}
													</div>
												</td>
												<td className="p-3 text-slate-600 align-top">
													<div className="font-semibold text-slate-800">
														{d.requested_by}
													</div>
													<div className="text-[10px] text-slate-400 font-mono">
														{new Date(
															d.requested_at,
														).toLocaleDateString()}{" "}
														{new Date(
															d.requested_at,
														).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</div>
												</td>
												<td className="p-3 font-mono font-bold text-slate-700 align-top">
													₦
													{Number(
														d.original_amount,
													).toLocaleString()}
												</td>
												<td className="p-3 align-top">
													<span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-mono font-bold text-xs">
														{d.discount_type === "Percentage"
															? `${d.discount_value}%`
															: `₦${Number(d.discount_value).toLocaleString()}`}
													</span>
												</td>
												<td className="p-3 font-mono font-bold text-amber-700 align-top">
													-₦
													{Number(
														d.calculated_discount,
													).toLocaleString()}
												</td>
												<td className="p-3 font-mono font-black text-emerald-700 text-sm align-top">
													₦
													{Number(d.final_amount).toLocaleString()}
												</td>
												<td className="p-3 text-slate-700 max-w-xs align-top font-medium">
													<p className="line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] text-slate-800">
														"{d.reason}"
													</p>
												</td>
												<td className="p-3 align-top">
													{d.status === "Approved" ? (
														<span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] inline-flex items-center gap-1">
															<CheckCircle2 className="h-3 w-3 text-emerald-600" />{" "}
															HR Approved (
															{d.approved_by || "HR"})
														</span>
													) : d.status === "Rejected" ? (
														<span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 border border-rose-300 font-bold text-[10px] inline-flex items-center gap-1">
															<X className="h-3 w-3 text-rose-600" />{" "}
															HR Rejected
														</span>
													) : (
														<span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 font-bold text-[10px] inline-flex items-center gap-1 animate-pulse">
															<Clock className="h-3 w-3 text-amber-600" />{" "}
															Pending HR Review
														</span>
													)}
												</td>
												<td className="p-3 text-right align-top">
													{d.status === "Pending" ? (
														<div className="flex items-center justify-end gap-1.5">
															<button
																onClick={() =>
																	handleApproveDiscount(d.id)
																}
																className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
															>
																<ThumbsUp className="h-3.5 w-3.5 text-emerald-200" />{" "}
																Approve → HR
															</button>
															<button
																onClick={() =>
																	handleRejectDiscount(d.id)
																}
																className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-rose-200 transition-all cursor-pointer"
															>
																Reject
															</button>
														</div>
													) : (
														<span className="text-[11px] text-slate-400 font-mono">
															Processed
														</span>
													)}
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
