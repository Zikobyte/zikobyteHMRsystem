/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (vitae).
 */

import { PlusCircle, Receipt } from "lucide-react";
import type { CashierVitaeRecord } from "../_utils/cashier-totals";

export interface VitaeTabProps {
  paymentVitae: CashierVitaeRecord[];
  isLoading: boolean;
  pvPersonName: string;
  pvDescription: string;
  pvAmount: string;
  pvApprovedByDoctor: string;
  setPvPersonName: (v: string) => void;
  setPvDescription: (v: string) => void;
  setPvAmount: (v: string) => void;
  setPvApprovedByDoctor: (v: string) => void;
  handleRecordPVSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function VitaeTab({
  paymentVitae,
  isLoading,
  pvPersonName,
  pvDescription,
  pvAmount,
  pvApprovedByDoctor,
  setPvPersonName,
  setPvDescription,
  setPvAmount,
  setPvApprovedByDoctor,
  handleRecordPVSubmit,
}: VitaeTabProps) {
  void paymentVitae;
  return (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Form Column */}
					<div className="lg:col-span-1 space-y-6">
						<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
								Log Daily Expense (Payment Vitae)
							</h3>
							<p className="text-[11px] text-slate-400 leading-normal">
								Record and dispense cash for immediate clinic operating
								costs as approved by the physician on duty.
							</p>

							<form
								onSubmit={handleRecordPVSubmit}
								className="space-y-4"
							>
								<div>
									<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
										Recipient Name
									</label>
									<input
										type="text"
										required
										placeholder="e.g. John Doe (Cleaner)"
										value={pvPersonName}
										onChange={(e) => setPvPersonName(e.target.value)}
										className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
									/>
								</div>

								<div>
									<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
										Expense Description
									</label>
									<input
										type="text"
										required
										placeholder="e.g. Purchased 5L liquid antiseptic soap"
										value={pvDescription}
										onChange={(e) => setPvDescription(e.target.value)}
										className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
									/>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
											Amount Dispensed (₦)
										</label>
										<input
											type="number"
											required
											placeholder="0.00"
											value={pvAmount}
											onChange={(e) => setPvAmount(e.target.value)}
											className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-bold"
										/>
									</div>
									<div>
										<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
											Approving Doctor
										</label>
										<select
											value={pvApprovedByDoctor}
											onChange={(e) =>
												setPvApprovedByDoctor(e.target.value)
											}
											className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
										>
											<option value="Dr. Alan Smith">
												Dr. Alan Smith
											</option>
											<option value="Dr. Michael Johnson">
												Dr. Michael Johnson
											</option>
											<option value="Dr. Clara Vance">
												Dr. Clara Vance
											</option>
										</select>
									</div>
								</div>

								<button
									type="submit"
									disabled={isLoading}
									className="w-full bg-[#2A758C] hover:bg-[#1f5869] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
								>
									<PlusCircle className="h-4 w-4" /> Disburse Approved
									Cash
								</button>
							</form>
						</div>
					</div>

					{/* Ledger Column */}
					<div className="lg:col-span-2">
						<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
								<Receipt className="h-4 w-4 text-[#2A758C]" /> Daily
								Payment Vitae (PV) Ledger
							</h3>

							<div className="overflow-x-auto">
								<table className="w-full text-left text-xs">
									<thead>
										<tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] font-bold uppercase">
											<th className="pb-2.5">Recipient Details</th>
											<th className="pb-2.5">
												Purpose / Description
											</th>
											<th className="pb-2.5">Amount Disbursed</th>
											<th className="pb-2.5">Approved By</th>
											<th className="pb-2.5 text-right">
												Date / Time
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-50 text-slate-700">
										{paymentVitae.length > 0 ? (
											paymentVitae.map((v) => (
												<tr
													key={v.id}
													className="hover:bg-slate-50/50 transition-all"
												>
													<td className="py-3">
														<p className="font-bold text-slate-800">
															{v.personName}
														</p>
													</td>
													<td className="py-3 text-slate-600 font-medium">
														{v.description}
													</td>
													<td className="py-3 font-mono font-bold text-rose-600">
														- ₦{v.amount.toLocaleString()}
													</td>
													<td className="py-3 font-semibold text-slate-600 text-[11px]">
														{v.approvedByDoctor}
													</td>
													<td className="py-3 text-right text-[10px] text-slate-400 font-mono">
														{new Date(
															v.createdAt,
														).toLocaleDateString()}{" "}
														{new Date(
															v.createdAt,
														).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</td>
												</tr>
											))
										) : (
											<tr>
												<td
													colSpan={5}
													className="py-12 text-center text-slate-400"
												>
													<Receipt className="h-8 w-8 text-slate-200 mx-auto mb-2" />
													<p className="font-medium text-xs">
														No Payment Vitae logged today
													</p>
													<p className="text-[10px] text-slate-400 mt-1">
														Dispense approved expenditures to seed
														the log ledger.
													</p>
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
  );
}
