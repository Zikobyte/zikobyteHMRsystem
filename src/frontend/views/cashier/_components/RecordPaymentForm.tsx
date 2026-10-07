/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (Billing: RecordPaymentForm).
 */

import {
	CheckCircle2,
	Clock,
	Loader2,
	Percent,
	User as UserIcon,
	X,
} from "lucide-react";
import type { DiscountRequest, Patient } from "@/types";
import type { DiscountTarget } from "../_hooks/useCashierDiscounts";

export interface RecordPaymentFormProps {
  selectedPatient: Patient | null;
  payAmount: string;
  payMethod: string;
  payRef: string;
  payPurpose: string;
  selectedTotalBill: number;
  discountRequestsList: DiscountRequest[];
  isLoading: boolean;
  setSelectedPatient: (p: Patient | null) => void;
  setPayAmount: (v: string) => void;
  setPayMethod: (v: string) => void;
  setPayRef: (v: string) => void;
  setPayPurpose: (v: string) => void;
  handleRecordPaymentSubmit: (e: React.FormEvent) => Promise<void>;
  handleOpenDiscountModal: (target: DiscountTarget) => void;
}

export default function RecordPaymentForm({
  selectedPatient,
  payAmount,
  payMethod,
  payRef,
  payPurpose,
  selectedTotalBill,
  discountRequestsList,
  isLoading,
  setSelectedPatient,
  setPayAmount,
  setPayMethod,
  setPayRef,
  setPayPurpose,
  handleRecordPaymentSubmit,
  handleOpenDiscountModal,
}: RecordPaymentFormProps) {
  void selectedTotalBill;
  return (
    <>
						{/* RIGHT COLUMN: Process Card / Bill Settlement Form */}
						<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
								3. Process Card / Bill Settlement
							</h3>

							{selectedPatient ? (
								<div className="space-y-4">
									{/* Selected Patient info summary */}
									<div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl relative space-y-2">
										<button
											onClick={() => setSelectedPatient(null)}
											className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-all cursor-pointer"
										>
											<X className="h-3.5 w-3.5" />
										</button>
										<div>
											<p className="text-xs font-bold text-slate-800">
												{selectedPatient.name}
											</p>
											<p className="text-[10px] text-[#2A758C] font-mono mt-0.5">
												{selectedPatient.hospitalNumber}
											</p>
										</div>

										<div className="pt-2 border-t border-slate-100/60 grid grid-cols-2 gap-2 text-[10px]">
											<div>
												<span className="text-slate-400 block font-medium">
													Category:
												</span>
												<span className="font-bold text-slate-700">
													{selectedPatient.patientCategory ||
														"Individual"}
												</span>
											</div>
											<div>
												<span className="text-slate-400 block font-medium">
													Card Category:
												</span>
												<span
													className={`font-bold uppercase ${
														selectedPatient.cardType ===
														"Emergency"
															? "text-rose-600"
															: selectedPatient.cardType ===
																  "Maternity"
																? "text-purple-600"
																: "text-emerald-600"
													}`}
												>
													{selectedPatient.cardType || "Standard"}{" "}
													Card
												</span>
											</div>
											<div>
												<span className="text-slate-400 block font-medium">
													Gender / DOB:
												</span>
												<span className="font-semibold text-slate-700">
													{selectedPatient.gender || "N/A"},{" "}
													{selectedPatient.dateOfBirth
														? new Date(
																selectedPatient.dateOfBirth,
															).toLocaleDateString()
														: "N/A"}
												</span>
											</div>
											<div>
												<span className="text-slate-400 block font-medium">
													Phone:
												</span>
												<span className="font-mono text-slate-700">
													{selectedPatient.phoneNumber || "N/A"}
												</span>
											</div>
										</div>
									</div>

									{/* Discount Request / HR Approval Section */}
									{(() => {
										const approvedDisc = discountRequestsList.find(
											(d) =>
												d.patient_id === selectedPatient.id &&
												d.status === "Approved",
										);
										const pendingDisc = discountRequestsList.find(
											(d) =>
												d.patient_id === selectedPatient.id &&
												d.status === "Pending",
										);

										if (approvedDisc) {
											return (
												<div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium space-y-1 shadow-2xs">
													<div className="flex items-center justify-between font-bold">
														<span className="flex items-center gap-1.5 text-emerald-800">
															<CheckCircle2 className="h-4 w-4 text-emerald-600" />{" "}
															HR Approved Discount Applied
														</span>
														<span className="bg-emerald-200 text-emerald-950 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
															HR Authorized
														</span>
													</div>
													<p className="text-[11px] text-emerald-800">
														Original:{" "}
														<strong className="line-through">
															₦
															{Number(
																approvedDisc.original_amount,
															).toLocaleString()}
														</strong>{" "}
														→ Discount:{" "}
														<strong>
															-₦
															{Number(
																approvedDisc.calculated_discount,
															).toLocaleString()}{" "}
															(
															{approvedDisc.discount_type ===
															"Percentage"
																? `${approvedDisc.discount_value}%`
																: `₦${Number(approvedDisc.discount_value).toLocaleString()}`}
															)
														</strong>
													</p>
													<div className="font-mono font-black text-xs text-emerald-900 flex justify-between pt-1 border-t border-emerald-200/80">
														<span>Discounted Payable:</span>
														<span>
															₦
															{Number(
																approvedDisc.final_amount,
															).toLocaleString()}
														</span>
													</div>
												</div>
											);
										}

										if (pendingDisc) {
											return (
												<div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center justify-between shadow-2xs">
													<span className="flex items-center gap-1.5 text-amber-800 font-semibold">
														<Clock className="h-4 w-4 text-amber-600 animate-spin" />{" "}
														Discount Request Pending HR Approval
													</span>
													<span className="font-mono text-[11px] font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-md">
														{pendingDisc.discount_type ===
														"Percentage"
															? `${pendingDisc.discount_value}%`
															: `₦${Number(pendingDisc.discount_value).toLocaleString()}`}{" "}
														Requested
													</span>
												</div>
											);
										}

										return (
											<button
												type="button"
												onClick={() =>
													handleOpenDiscountModal({
														patientId: selectedPatient.id,
														patientName: selectedPatient.name,
														hospitalNumber:
															selectedPatient.hospitalNumber,
														invoiceId: payRef || undefined,
														originalAmount:
															selectedTotalBill ||
															parseFloat(payAmount) ||
															0,
													})
												}
												className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
											>
												<Percent className="h-4 w-4 text-amber-100" />
												<span>
													Request Discount → HR Approval Required
												</span>
											</button>
										);
									})()}

									{/* Form to process */}
									<form
										onSubmit={handleRecordPaymentSubmit}
										className="space-y-3.5"
									>
										<div>
											<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
												Payment Purpose
											</label>
											<input
												type="text"
												required
												placeholder="e.g. Registration Card Fee"
												value={payPurpose}
												onChange={(e) =>
													setPayPurpose(e.target.value)
												}
												className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
											/>
										</div>

										<div className="grid grid-cols-2 gap-2">
											<div>
												<div className="flex items-center justify-between mb-1.5">
													<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
														{selectedPatient?.cardType ===
															"Emergency" ||
														selectedPatient?.patientCategory ===
															"Emergency"
															? "Amount Collected Now (₦)"
															: "Amount to Collect (₦)"}
													</label>
													{selectedTotalBill > 0 && (
														<span className="text-[10px] font-mono font-bold text-[#2A758C] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
															Max: ₦
															{selectedTotalBill.toLocaleString()}
														</span>
													)}
												</div>
												<input
													type="number"
													required
													placeholder="0.00"
													max={
														selectedTotalBill > 0
															? selectedTotalBill
															: undefined
													}
													value={payAmount}
													onChange={(e) =>
														setPayAmount(e.target.value)
													}
													className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
												/>
											</div>
											<div>
												<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
													Payment Method
												</label>
												<select
													value={payMethod}
													onChange={(e) =>
														setPayMethod(e.target.value)
													}
													className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
												>
													<option value="Cash">Cash</option>
													<option value="POS">POS Terminal</option>
													<option value="Transfer">
														Bank Transfer
													</option>
													<option value="Insurance">
														Insurance Claim
													</option>
												</select>
											</div>
										</div>

										<div>
											<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
												Receipt Ref / Invoice # (Optional)
											</label>
											<input
												type="text"
												placeholder="Auto-generated if left blank"
												value={payRef}
												onChange={(e) => setPayRef(e.target.value)}
												className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
											/>
										</div>

										{selectedTotalBill > 0 &&
											parseFloat(payAmount) < selectedTotalBill && (
												<div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center justify-between font-medium">
													<span>Remaining Balance:</span>
													<span className="font-mono font-bold text-amber-900">
														₦
														{Math.max(
															0,
															selectedTotalBill -
																(parseFloat(payAmount) || 0),
														).toLocaleString()}{" "}
														→ Outstanding Balances
													</span>
												</div>
											)}

										<button
											type="submit"
											disabled={isLoading}
											className="w-full bg-[#2A758C] hover:bg-[#1f5869] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isLoading ? (
												<>
													<Loader2 className="animate-spin h-4 w-4 text-white" />
													Processing Payment...
												</>
											) : (
												<>
													<CheckCircle2 className="h-4 w-4 text-emerald-300" />{" "}
													Collect Amount{" "}
													{payAmount
														? `(₦${parseFloat(payAmount || "0").toLocaleString()})`
														: ""}
												</>
											)}
										</button>
									</form>
								</div>
							) : (
								<div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-100 rounded-xl bg-slate-50/50">
									<UserIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
									<p className="font-bold text-slate-700">
										No patient account selected
									</p>
									<p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
										Select a patient from the Pending Billing Queue on
										the left, or search using the account lookup box
										above.
									</p>
								</div>
							)}
						</div>
    </>
  );
}
