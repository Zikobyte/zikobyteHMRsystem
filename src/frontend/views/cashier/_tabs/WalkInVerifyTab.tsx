/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (walkin-verify).
 */

import { CheckCircle, CheckCircle2, ClipboardList, FlaskConical, Loader2, Search, X } from "lucide-react";
import type { Patient, Payment } from "@/types";
import type { CashierWalkInItem } from "../_utils/cashier-totals";

export interface WalkInVerifyItem extends CashierWalkInItem {
  patientName: string;
  totalAmount: number;
  encounterId: string;
}

export interface WalkInVerifyTabProps {
  patients: Patient[];
  payments: Payment[];
  walkInPending: CashierWalkInItem[];
  walkInPaid: CashierWalkInItem[];
  selectedWalkInVerify: WalkInVerifyItem | null;
  walkInVerifyPayMethod: string;
  walkInCustomAmounts: Record<string, string>;
  isVerifyingWalkIn: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  setSelectedWalkInVerify: (v: WalkInVerifyItem | null) => void;
  setWalkInVerifyPayMethod: (v: string) => void;
  setWalkInCustomAmounts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setViewTestsModal: (v: { patientName: string; hospitalNumber?: string; testsList?: string[]; testsSummary?: string; totalAmount?: number } | null) => void;
  handleConfirmWalkInVerification: (patient: WalkInVerifyItem) => Promise<void>;
}

export default function WalkInVerifyTab({
  patients,
  payments,
  walkInPending,
  walkInPaid,
  selectedWalkInVerify,
  walkInVerifyPayMethod,
  walkInCustomAmounts,
  isVerifyingWalkIn,
  searchQuery,
  setSearchQuery,
  setSelectedWalkInVerify,
  setWalkInVerifyPayMethod,
  setWalkInCustomAmounts,
  setViewTestsModal,
  handleConfirmWalkInVerification,
}: WalkInVerifyTabProps) {
  void patients;
  void payments;
  return (
				<div className="space-y-6">
					{/* Header & Stats Banner */}
					<div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
						<div>
							<div className="flex items-center gap-2">
								<h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
									<ClipboardList className="h-5 w-5 text-[#2A758C]" />
									Walk-in Lab Payment Verification
								</h3>
								<span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 uppercase font-mono">
									Forwarded from Laboratory
								</span>
							</div>
							<p className="text-xs text-slate-500 mt-1 max-w-2xl">
								Review complete registration forms and verify payments
								for walk-in patients registered in the Laboratory
								department. Once confirmed, patients are automatically
								routed to Laboratory for testing.
							</p>
						</div>

						<div className="flex items-center gap-3">
							<div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl text-center">
								<span className="block text-[10px] font-black text-amber-800 uppercase tracking-widest font-mono">
									Pending Verification
								</span>
								<span className="text-lg font-black text-amber-900">
									{walkInPending.length} Patients
								</span>
							</div>
							<div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-center">
								<span className="block text-[10px] font-black text-emerald-800 uppercase tracking-widest font-mono">
									Verified & Paid
								</span>
								<span className="text-lg font-black text-emerald-900">
									{walkInPaid.length} Patients
								</span>
							</div>
						</div>
					</div>

					{/* Search Bar */}
					<div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search walk-in patient name, hospital ID, phone, referring doctor, or test name..."
								className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A758C]"
							/>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
								>
									<X className="h-3.5 w-3.5" />
								</button>
							)}
						</div>
					</div>

					{/* Grid of Walk-in Pending Verification Cards */}
					<div className="space-y-4">
						<h4 className="text-xs font-black text-slate-700 uppercase tracking-wider font-mono flex items-center justify-between">
							<span>
								Awaiting Cashier Payment Verification (
								{
									walkInPending.filter((p) => {
										if (!searchQuery.trim()) return true;
										const q = searchQuery.toLowerCase();
										return (
											(p.patientName || "")
												.toLowerCase()
												.includes(q) ||
											(p.hospitalNumber || "")
												.toLowerCase()
												.includes(q) ||
											(p.phoneNumber || "")
												.toLowerCase()
												.includes(q) ||
											(p.referringDoctor || "")
												.toLowerCase()
												.includes(q) ||
											(p.testsSummary || "")
												.toLowerCase()
												.includes(q)
										);
									}).length
								}
								)
							</span>
							<span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
								● Forwarded from Laboratory
							</span>
						</h4>

						{walkInPending.length === 0 ? (
							<div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-2">
								<CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
								<h5 className="text-sm font-bold text-slate-800">
									All Forwarded Walk-In Payments Verified
								</h5>
								<p className="text-xs text-slate-400 max-w-sm mx-auto">
									There are currently no walk-in laboratory patient
									registrations awaiting cashier payment verification.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								{walkInPending
									.filter((p) => {
										if (!searchQuery.trim()) return true;
										const q = searchQuery.toLowerCase();
										return (
											(p.patientName || "")
												.toLowerCase()
												.includes(q) ||
											(p.hospitalNumber || "")
												.toLowerCase()
												.includes(q) ||
											(p.phoneNumber || "")
												.toLowerCase()
												.includes(q) ||
											(p.referringDoctor || "")
												.toLowerCase()
												.includes(q) ||
											(p.testsSummary || "")
												.toLowerCase()
												.includes(q)
										);
									})
									.map((item: any, index: number) => {
										const isSelected =
											selectedWalkInVerify?.encounterId ===
											item.encounterId;

										return (
											<div
												key={item.encounterId || index}
												className={`bg-white rounded-3xl border transition-all p-6 space-y-5 flex flex-col justify-between shadow-xs ${
													isSelected
														? "border-[#2A758C] ring-2 ring-[#2A758C]/20"
														: "border-slate-200 hover:border-slate-300"
												}`}
											>
												{/* Top Header */}
												<div className="space-y-4">
													<div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
														<div>
															<div className="flex items-center gap-2">
																<h4 className="text-base font-black text-slate-900">
																	{item.patientName}
																</h4>
																<span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-800 rounded-md font-mono border border-amber-200">
																	UNCONFIRMED
																</span>
															</div>
															<p className="text-xs font-mono text-[#2A758C] font-extrabold mt-0.5">
																ID:{" "}
																{item.hospitalNumber ||
																	"HOSP-LAB-NEW"}
															</p>
														</div>
														<div className="text-right">
															<span className="block text-[10px] font-mono text-slate-400 uppercase font-bold">
																Forwarded At
															</span>
															<span className="text-xs font-bold text-slate-600">
																{item.dateRegistered
																	? new Date(
																			item.dateRegistered,
																		).toLocaleTimeString([], {
																			hour: "2-digit",
																			minute: "2-digit",
																		})
																	: "Recently"}
															</span>
														</div>
													</div>

													{/* Patient Registration Form Details Grid */}
													<div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-xs space-y-2.5">
														<div className="grid grid-cols-2 gap-2 text-slate-700">
															<div>
																<span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
																	DOB / Gender
																</span>
																<span className="font-semibold text-slate-900">
																	{item.dob || "—"} (
																	{item.gender || "—"})
																</span>
															</div>
															<div>
																<span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
																	Marital Status
																</span>
																<span className="font-semibold text-slate-900">
																	{item.maritalStatus ||
																		"Single"}
																</span>
															</div>
															<div>
																<span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
																	Phone Number
																</span>
																<span className="font-semibold text-slate-900">
																	{item.phoneNumber || "—"}
																</span>
															</div>
															<div>
																<span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
																	Referring Doctor
																</span>
																<span className="font-semibold text-indigo-700">
																	{item.referringDoctor ||
																		"Outside Doctor"}
																</span>
															</div>
														</div>
														<div className="pt-2 border-t border-slate-200/60">
															<span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
																Residential Address
															</span>
															<span className="font-medium text-slate-800">
																{item.address || "Not Provided"}
															</span>
														</div>
													</div>

													{/* Selected Lab Tests Modal Trigger Button */}
													<div className="pt-2">
														<button
															type="button"
															onClick={() =>
																setViewTestsModal(item)
															}
															className="w-full px-4 py-2.5 bg-[#2A758C]/10 hover:bg-[#2A758C]/20 text-[#2A758C] border border-[#2A758C]/30 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
														>
															<FlaskConical className="h-4 w-4" />
															<span>
																View Ordered Tests (
																{item.testCount ||
																	item.testsList?.length ||
																	1}
																)
															</span>
														</button>
													</div>
												</div>

												{/* Payment Verification Controls */}
												<div className="pt-4 border-t border-slate-100 space-y-3 bg-slate-50/50 p-4 rounded-2xl">
													<div className="flex items-center justify-between">
														<span className="text-xs font-black text-slate-500 uppercase tracking-wider font-mono">
															Total Payable Fee:
														</span>
														<span className="text-xl font-black text-[#2A758C] font-mono">
															₦
															{(
																item.totalAmount || 0
															).toLocaleString()}
														</span>
													</div>

													<div className="space-y-2">
														<div>
															<div className="flex items-center justify-between mb-1">
																<label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
																	Amount Collected Now (₦)
																</label>
																<span className="text-[10px] font-mono font-bold text-[#2A758C] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
																	Max: ₦
																	{(
																		item.totalAmount || 0
																	).toLocaleString()}
																</span>
															</div>
															<input
																type="number"
																placeholder={String(
																	item.totalAmount || 0,
																)}
																value={
																	walkInCustomAmounts[
																		item.encounterId
																	] !== undefined
																		? walkInCustomAmounts[
																				item.encounterId
																			]
																		: String(
																				item.totalAmount ||
																					0,
																			)
																}
																onChange={(e) =>
																	setWalkInCustomAmounts(
																		(prev) => ({
																			...prev,
																			[item.encounterId]:
																				e.target.value,
																		}),
																	)
																}
																className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono font-bold focus:ring-2 focus:ring-[#2A758C] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
															/>
														</div>

														<div className="flex items-center gap-2">
															<select
																value={
																	isSelected
																		? walkInVerifyPayMethod
																		: "Cash"
																}
																onChange={(e) => {
																	setSelectedWalkInVerify(
																		item,
																	);
																	setWalkInVerifyPayMethod(
																		e.target.value,
																	);
																}}
																className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none flex-1 cursor-pointer"
															>
																<option value="Cash">
																	Cash
																</option>
																<option value="POS">
																	POS Terminal
																</option>
																<option value="Transfer">
																	Bank Transfer
																</option>
															</select>

															<button
																type="button"
																disabled={isVerifyingWalkIn}
																onClick={() => {
																	setSelectedWalkInVerify(
																		item,
																	);
																	handleConfirmWalkInVerification(
																		item,
																	);
																}}
																className="bg-[#2A758C] hover:bg-[#1f5869] text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
															>
																{isVerifyingWalkIn &&
																isSelected ? (
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
						)}
					</div>

					{/* Verified / Paid Walk-In History Ledger */}
					<div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
						<div className="flex items-center justify-between pb-3 border-b border-slate-100">
							<h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
								<CheckCircle className="h-4 w-4 text-emerald-500" />
								Verified & Confirmed Walk-In Payments (
								{walkInPaid.length})
							</h4>
							<span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
								Ready / In Progress in Laboratory
							</span>
						</div>

						{walkInPaid.length === 0 ? (
							<div className="py-8 text-center text-xs text-slate-400">
								No confirmed walk-in lab payments recorded yet today.
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full text-left text-xs">
									<thead>
										<tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] font-bold uppercase">
											<th className="pb-3">Patient Name & ID</th>
											<th className="pb-3">Contact & Address</th>
											<th className="pb-3">Referring Doctor</th>
											<th className="pb-3">Lab Tests</th>
											<th className="pb-3">Amount Paid</th>
											<th className="pb-3 text-right">Status</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-50 text-slate-700">
										{walkInPaid.map((p, idx) => (
											<tr
												key={p.encounterId || idx}
												className="hover:bg-slate-50"
											>
												<td className="py-3">
													<p className="font-bold text-slate-800">
														{p.patientName}
													</p>
													<p className="text-[10px] text-[#2A758C] font-mono mt-0.5">
														{p.hospitalNumber}
													</p>
												</td>
												<td className="py-3">
													<p className="font-semibold text-slate-800">
														{p.phoneNumber}
													</p>
													<p className="text-[10px] text-slate-400">
														{p.address}
													</p>
												</td>
												<td className="py-3 text-indigo-700 font-medium">
													{p.referringDoctor || "Outside Doctor"}
												</td>
												<td className="py-3">
													<p className="font-semibold text-slate-800">
														{p.testsSummary}
													</p>
												</td>
												<td className="py-3 font-mono font-black text-slate-900">
													₦{p.totalAmount.toLocaleString()}
												</td>
												<td className="py-3 text-right">
													<span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
														<CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
														Verified & Sent to Lab
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
  );
}
