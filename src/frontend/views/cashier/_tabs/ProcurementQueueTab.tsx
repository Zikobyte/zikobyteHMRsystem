/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (procurement-queue).
 * Read-only; reuses mapper.
 */

import { ClipboardList } from "lucide-react";
import { mapCashierProcurementQueueRow } from "../_utils/cashier-mapper";

export interface ProcurementQueueTabProps {
  procurementQueue: Record<string, unknown>[];
  isLoadingProcurementQueue: boolean;
  fetchProcurementQueue: () => Promise<void>;
}

export default function ProcurementQueueTab({
  procurementQueue,
  isLoadingProcurementQueue,
  fetchProcurementQueue,
}: ProcurementQueueTabProps) {
  return (
				<div className="space-y-6">
					<div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h3 className="text-base font-black text-slate-900 flex items-center gap-2">
								<ClipboardList className="h-5 w-5 text-[#2A758C]" />{" "}
								Procurement Queue (Read-Only)
							</h3>
							<p className="text-xs text-slate-500 mt-0.5">
								Pharmacy procurement requests raised for HR review.
								Cashiers can view items, quantities, amounts, statuses,
								and requesters. All decisions stay with HR / Management.
							</p>
						</div>
						<div className="flex items-center gap-2">
							<span className="px-3.5 py-1.5 bg-slate-50 text-slate-700 font-mono font-bold text-xs rounded-xl border border-slate-200 shadow-2xs">
								{procurementQueue.length} Request(s)
							</span>
							<button
								type="button"
								onClick={fetchProcurementQueue}
								disabled={isLoadingProcurementQueue}
								aria-label="Refresh procurement queue"
								className="px-3.5 py-1.5 bg-[#2A758C] hover:bg-[#1f5869] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-2xs cursor-pointer"
							>
								{isLoadingProcurementQueue ? "Refreshing…" : "Refresh"}
							</button>
						</div>
					</div>

					<div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
						<div className="overflow-x-auto">
							<table
								className="w-full text-left border-collapse"
								aria-label="Procurement queue"
							>
								<thead>
									<tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50">
										<th scope="col" className="p-3">
											Item
										</th>
										<th scope="col" className="p-3">
											Quantity
										</th>
										<th scope="col" className="p-3">
											Amount
										</th>
										<th scope="col" className="p-3">
											Status
										</th>
										<th scope="col" className="p-3">
											Requested By
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{isLoadingProcurementQueue ? (
										<tr>
											<td
												colSpan={5}
												className="text-center p-8 text-xs text-slate-400 font-medium"
											>
												Loading procurement requests…
											</td>
										</tr>
									) : procurementQueue.length === 0 ? (
										<tr>
											<td
												colSpan={5}
												className="text-center p-8 text-xs text-slate-400 font-medium"
											>
												<ClipboardList className="h-8 w-8 text-slate-300 mx-auto mb-2" />
												No procurement requests found.
											</td>
										</tr>
									) : (
										procurementQueue.map((raw: any) => {
											const row = mapCashierProcurementQueueRow(raw);
											return (
												<tr
													key={row.id}
													className="text-xs hover:bg-slate-50/70 transition-colors"
												>
													<td className="p-3 font-extrabold text-slate-900 align-top">
														<div>{row.item}</div>
														<div className="text-[10px] text-slate-400 font-mono font-normal mt-0.5">
															{row.supplierName} ·{" "}
															{row.department}
														</div>
													</td>
													<td className="p-3 font-mono font-bold text-slate-700 align-top">
														{row.quantity.toLocaleString()}
													</td>
													<td className="p-3 font-mono font-bold text-slate-700 align-top">
														₦{row.amount.toLocaleString()}
													</td>
													<td className="p-3 align-top">
														<span
															className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
																row.status === "Delivered"
																	? "bg-emerald-50 text-emerald-700 border-emerald-200"
																	: row.status === "Ordered"
																		? "bg-amber-50 text-amber-800 border-amber-200"
																		: "bg-slate-100 text-slate-600 border-slate-200"
															}`}
														>
															{row.status}
														</span>
													</td>
													<td className="p-3 font-semibold text-slate-600 align-top">
														{row.requestedBy}
													</td>
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						</div>
						<p className="text-[11px] text-slate-400 font-medium">
							Read-only visibility. Contact HR / Management for decisions
							or corrections.
						</p>
					</div>
				</div>
  );
}
