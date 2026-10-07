/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (lab-payments).
 */

import { CheckCircle2, FlaskConical, Loader2, Printer, Receipt } from "lucide-react";
import type { Invoice, LabPayment, Patient, Payment } from "@/types";
import type {
  CashierQueueItem,
  LabCategoryFilter,
} from "../_utils/cashier-totals";

export interface LabPaymentsTabProps {
  patients: Patient[];
  payments: Payment[];
  invoices: Invoice[];
  pendingLabQueueItems: CashierQueueItem[];
  filteredLabItems: CashierQueueItem[];
  labHistoryRecords: LabPayment[];
  labSubTab: "pending" | "history";
  labPayMethods: Record<string, string>;
  labCategoryFilter: LabCategoryFilter;
  labCustomAmounts: Record<string, string>;
  searchQuery: string;
  isLoading: boolean;
  setLabSubTab: (v: "pending" | "history") => void;
  setLabPayMethods: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setLabCategoryFilter: (v: LabCategoryFilter) => void;
  setLabCustomAmounts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleConfirmLabPayment: (qItem: CashierQueueItem, totalAmount: number, invoiceId?: string) => Promise<void>;
}

export default function LabPaymentsTab({
  patients,
  payments,
  invoices,
  pendingLabQueueItems,
  filteredLabItems,
  labHistoryRecords,
  labSubTab,
  labPayMethods,
  labCategoryFilter,
  labCustomAmounts,
  searchQuery,
  isLoading,
  setLabSubTab,
  setLabPayMethods,
  setLabCategoryFilter,
  setLabCustomAmounts,
  handleConfirmLabPayment,
}: LabPaymentsTabProps) {
  void payments;
  void searchQuery;
  return (
				<div className="space-y-4">
					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
								<FlaskConical className="h-5 w-5 text-[#2A758C]" />{" "}
								Doctor Laboratory Payment Requests
							</h3>
							<p className="text-xs text-slate-400 mt-0.5">
								Manage live lab collection queue and access permanent
								database records of all settled laboratory transactions.
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							{/* Sub-tab Switcher */}
							<div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/80">
								<button
									type="button"
									onClick={() => setLabSubTab("pending")}
									className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
										labSubTab === "pending"
											? "bg-[#2A758C] text-white shadow-xs"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									<span>Pending Requests</span>
									{pendingLabQueueItems.length > 0 && (
										<span
											className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${
												labSubTab === "pending"
													? "bg-white text-[#2A758C]"
													: "bg-rose-500 text-white"
											}`}
										>
											{pendingLabQueueItems.length}
										</span>
									)}
								</button>
								<button
									type="button"
									onClick={() => setLabSubTab("history")}
									className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
										labSubTab === "history"
											? "bg-[#2A758C] text-white shadow-xs"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									<Receipt className="h-3.5 w-3.5" />
									<span>Stored Payment Records</span>
									<span
										className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${
											labSubTab === "history"
												? "bg-white text-[#2A758C]"
												: "bg-slate-200 text-slate-700"
										}`}
									>
										{labHistoryRecords.length}
									</span>
								</button>
							</div>

							<select
								value={labCategoryFilter}
								onChange={(e) =>
									setLabCategoryFilter(e.target.value as "ALL" | "Standard" | "Maternity" | "Emergency")
								}
								className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
							>
								<option value="ALL">All Card Types</option>
								<option value="Standard">
									Regular / Standard Card
								</option>
								<option value="Maternity">Maternity Card</option>
								<option value="Emergency">Emergency Card</option>
							</select>
						</div>
					</div>

					{labSubTab === "pending" ? (
						filteredLabItems.length === 0 ? (
							<div className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-3">
								<FlaskConical className="h-10 w-10 text-slate-300 mx-auto" />
								<h4 className="text-sm font-bold text-slate-700">
									No Pending Lab Requests
								</h4>
								<p className="text-xs text-slate-400 max-w-sm mx-auto">
									There are currently no doctor lab payment requests
									waiting for cashier collection. Switch to{" "}
									<strong>Stored Payment Records</strong> to view
									completed transactions.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
								{filteredLabItems.map((q: CashierQueueItem) => {
									const pat =
										patients.find((p) => p.id === q.patient_id);
									const inv = invoices.find(
										(i) =>
											(i.encounter_id === q.encounter_id ||
												i.patient_id === q.patient_id) &&
											i.status === "Unpaid",
									);
									const cardType =
										pat?.cardType || q.card_type || "Standard";
									const totalAmount = inv
										? Number(inv.amount || 0)
										: 0;
									const invDesc =
										inv?.description ||
										"Laboratory Investigations Fee";

									let testList: string[] = [];
									if (invDesc.includes(":")) {
										const testsPart = invDesc.split(":")[1];
										if (testsPart) {
											testList = testsPart
												.split(",")
												.map((s) => s.trim())
												.filter(Boolean);
										}
									}

									return (
										<div
											key={q.id}
											className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between hover:border-[#2A758C]/40 transition-all"
										>
											<div className="space-y-3">
												<div className="flex items-start justify-between gap-2">
													<div>
														<h4 className="font-black text-slate-800 text-sm">
															{q.patient_name ||
																pat?.name ||
																"Outpatient"}
														</h4>
														<span className="text-[11px] font-mono text-[#2A758C] font-semibold">
															{q.hospital_number ||
																pat?.hospitalNumber ||
																"—"}
														</span>
													</div>
													{cardType === "Emergency" ||
													q.priority === "Emergency" ? (
														<span className="px-2.5 py-1 text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 rounded-lg uppercase tracking-wider">
															Emergency Card
														</span>
													) : cardType === "Maternity" ? (
														<span className="px-2.5 py-1 text-[10px] font-black bg-pink-100 text-pink-800 border border-pink-200 rounded-lg uppercase tracking-wider">
															Maternity Card
														</span>
													) : (
														<span className="px-2.5 py-1 text-[10px] font-black bg-sky-100 text-sky-800 border border-sky-200 rounded-lg uppercase tracking-wider">
															Regular Card
														</span>
													)}
												</div>

												<div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
													<p>
														<strong>Ordering Doctor:</strong>{" "}
														{q.processed_by ||
															"Consulting Doctor"}
													</p>
													<p className="font-mono text-[10px] text-slate-400">
														Request Time:{" "}
														{q.arrival_time
															? new Date(
																	q.arrival_time,
																).toLocaleTimeString([], {
																	hour: "2-digit",
																	minute: "2-digit",
																})
															: "Recently"}
													</p>
												</div>

												<div className="space-y-1.5">
													<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
														Requested Lab Tests
													</span>
													{testList.length > 0 ? (
														<div className="flex flex-wrap gap-1.5">
															{testList.map((t, idx) => (
																<span
																	key={idx}
																	className="bg-slate-100 text-slate-800 text-[11px] font-extrabold px-2.5 py-1 rounded-lg border border-slate-200/80"
																>
																	{t}
																</span>
															))}
														</div>
													) : (
														<p className="text-xs text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
															{invDesc}
														</p>
													)}
												</div>
											</div>

											<div className="pt-3 border-t border-slate-100 space-y-3">
												<div className="flex items-center justify-between">
													<span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider font-mono">
														Total Fee:
													</span>
													<span className="text-base font-black text-slate-800">
														₦{totalAmount.toLocaleString()}
													</span>
												</div>

												<div className="space-y-2">
													<div>
														<div className="flex items-center justify-between mb-1">
															<label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
																{cardType === "Emergency" ||
																q.priority === "Emergency"
																	? "Amount Collected Now (₦)"
																	: "Amount to Collect (₦)"}
															</label>
															<span className="text-[10px] font-mono font-bold text-[#2A758C] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
																Max: ₦
																{totalAmount.toLocaleString()}
															</span>
														</div>
														<input
															type="number"
															placeholder={String(totalAmount)}
															value={
																labCustomAmounts[q.id] !==
																undefined
																	? labCustomAmounts[q.id]
																	: String(totalAmount)
															}
															onChange={(e) =>
																setLabCustomAmounts((prev) => ({
																	...prev,
																	[q.id]: e.target.value,
																}))
															}
															className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-mono font-bold focus:ring-2 focus:ring-[#2A758C] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
														/>
													</div>

													<div className="flex items-center gap-2">
														<select
															value={
																labPayMethods[q.id] || "Cash"
															}
															onChange={(e) =>
																setLabPayMethods((prev) => ({
																	...prev,
																	[q.id]: e.target.value,
																}))
															}
															className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-2.5 py-2.5 text-slate-800 focus:outline-none flex-1 cursor-pointer"
														>
															<option value="Cash">Cash</option>
															<option value="POS">
																POS Terminal
															</option>
															<option value="Transfer">
																Bank Transfer
															</option>
														</select>

														<button
															type="button"
															disabled={isLoading}
															onClick={() =>
																handleConfirmLabPayment(
																	q,
																	totalAmount,
																	inv?.id,
																)
															}
															className="bg-[#2A758C] hover:bg-[#1f5869] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
														>
															{isLoading ? (
																<Loader2 className="h-4 w-4 animate-spin" />
															) : (
																<CheckCircle2 className="h-4 w-4 text-emerald-300" />
															)}
															<span>Collect Amount</span>
														</button>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)
					) : (
						/* Stored Payment Records Sub-Tab */
						<div className="space-y-4">
							<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
								<div>
									<h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
										Total Stored Lab Revenue
									</h4>
									<span className="text-xl font-black text-slate-800">
										₦
										{labHistoryRecords
											.reduce(
												(sum: number, rec: any) =>
													sum + Number(rec.amount || 0),
												0,
											)
											.toLocaleString()}
									</span>
								</div>
								<div className="text-right">
									<span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
										Records Count
									</span>
									<p className="text-lg font-black text-[#2A758C]">
										{labHistoryRecords.length} Saved Entries
									</p>
								</div>
							</div>

							{labHistoryRecords.length === 0 ? (
								<div className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-3">
									<Receipt className="h-10 w-10 text-slate-300 mx-auto" />
									<h4 className="text-sm font-bold text-slate-700">
										No Stored Lab Payment Records
									</h4>
									<p className="text-xs text-slate-400 max-w-sm mx-auto">
										When cashier collects lab payments, permanent
										records will be automatically logged and retrieved
										here.
									</p>
								</div>
							) : (
								<div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
									<div className="overflow-x-auto">
										<table className="w-full text-left border-collapse text-xs">
											<thead>
												<tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">
													<th className="p-4">Date & Time</th>
													<th className="p-4">Patient Name</th>
													<th className="p-4">Hospital #</th>
													<th className="p-4">Card Type</th>
													<th className="p-4">
														Lab Investigations Summary
													</th>
													<th className="p-4">Amount</th>
													<th className="p-4">Method</th>
													<th className="p-4">Cashier</th>
													<th className="p-4 text-center">
														Receipt
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-slate-100 font-medium text-slate-700">
												{labHistoryRecords
													.filter((rec: any) => {
														if (labCategoryFilter !== "ALL") {
															if (
																labCategoryFilter ===
																	"Standard" &&
																rec.card_type !== "Standard" &&
																rec.card_type !== "Regular"
															)
																return false;
															if (
																labCategoryFilter ===
																	"Maternity" &&
																rec.card_type !== "Maternity"
															)
																return false;
															if (
																labCategoryFilter ===
																	"Emergency" &&
																rec.card_type !== "Emergency"
															)
																return false;
														}
														if (searchQuery) {
															const q =
																searchQuery.toLowerCase();
															const nameMatch = (
																rec.patient_name || ""
															)
																.toLowerCase()
																.includes(q);
															const hNumMatch = (
																rec.hospital_number || ""
															)
																.toLowerCase()
																.includes(q);
															const testsMatch = (
																rec.tests_summary || ""
															)
																.toLowerCase()
																.includes(q);
															return (
																nameMatch ||
																hNumMatch ||
																testsMatch
															);
														}
														return true;
													})
													.map((rec: any) => (
														<tr
															key={rec.id}
															className="hover:bg-slate-50/60 transition-colors"
														>
															<td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
																{rec.date_paid
																	? new Date(
																			rec.date_paid,
																		).toLocaleString([], {
																			month: "short",
																			day: "numeric",
																			year: "numeric",
																			hour: "2-digit",
																			minute: "2-digit",
																		})
																	: "Recently"}
															</td>
															<td className="p-4 font-extrabold text-slate-800">
																{rec.patient_name ||
																	"Outpatient"}
															</td>
															<td className="p-4 font-mono font-bold text-[#2A758C]">
																{rec.hospital_number || "—"}
															</td>
															<td className="p-4">
																<span
																	className={`px-2 py-0.5 text-[10px] font-black rounded-lg uppercase tracking-wider ${
																		rec.card_type ===
																		"Emergency"
																			? "bg-rose-100 text-rose-800"
																			: rec.card_type ===
																				  "Maternity"
																				? "bg-pink-100 text-pink-800"
																				: "bg-sky-100 text-sky-800"
																	}`}
																>
																	{rec.card_type || "Standard"}
																</span>
															</td>
															<td
																className="p-4 text-slate-600 max-w-xs truncate"
																title={rec.tests_summary}
															>
																{rec.tests_summary ||
																	"Laboratory Investigations"}
															</td>
															<td className="p-4 font-black text-slate-900 font-mono">
																₦
																{Number(
																	rec.amount || 0,
																).toLocaleString()}
															</td>
															<td className="p-4">
																<span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md border border-slate-200/80">
																	{rec.payment_method ||
																		"Cash"}
																</span>
															</td>
															<td className="p-4 text-slate-500 font-bold text-[11px]">
																{rec.collected_by || "Cashier"}
															</td>
															<td className="p-4 text-center">
																{/* NOTE: window.print() prints the full page; scope to this receipt row/area with print-only CSS when the print-styling pass lands. */}
																<button
																	type="button"
																	onClick={() =>
																		window.print()
																	}
																	className="p-1.5 text-slate-400 hover:text-[#2A758C] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
																	title="Print Receipt"
																>
																	<Printer className="h-4 w-4" />
																</button>
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
  );
}
