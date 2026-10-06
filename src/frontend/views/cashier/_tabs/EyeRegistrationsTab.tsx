/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (iclinic-registrations).
 */

import { CheckCircle2, ClipboardList, Eye, Send } from "lucide-react";
import type { Patient } from "@/types";
import type { EyeRegistrationRow } from "../_hooks/useCashierData";

export interface EyeRegistrationsTabProps {
  patients: Patient[];
  eyeRegistrationsList: EyeRegistrationRow[];
  eyePayMethods: Record<string, string>;
  eyePayAmounts: Record<string, string>;
  setEyePayMethods: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setEyePayAmounts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleVerifyEyeRegistration: (patient: EyeRegistrationRow) => Promise<void>;
}

export default function EyeRegistrationsTab({
  patients,
  eyeRegistrationsList,
  eyePayMethods,
  eyePayAmounts,
  setEyePayMethods,
  setEyePayAmounts,
  handleVerifyEyeRegistration,
}: EyeRegistrationsTabProps) {
  void patients;
  return (
				<div className="space-y-6">
					<div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<div className="flex items-center gap-2">
								<Eye className="h-6 w-6 text-[#A3D1E0]" />
								<h3 className="text-lg font-bold">
									Eye Clinic - Patient Registration Billing
								</h3>
							</div>
							<p className="text-xs text-slate-300 mt-1">
								Process New Patient Eye Clinic Card Fees (₦3,000) or
								approved outstanding bills before patients proceed to
								Eye Clinic consultation.
							</p>
						</div>
						<div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-right">
							<span className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">
								Pending Registrations
							</span>
							<span className="text-2xl font-black text-[#A3D1E0] font-mono">
								{eyeRegistrationsList.length}
							</span>
						</div>
					</div>

					<div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
						<div className="flex justify-between items-center border-b border-slate-100 pb-4">
							<h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
								<ClipboardList className="h-4 w-4 text-[#2A758C]" />
								Queue of Eye Clinic Registrations Awaiting Payment /
								Verification
							</h4>
							<span className="text-xs text-slate-400 font-mono">
								Auto-synced with Eye Clinic Registration Desk
							</span>
						</div>

						{eyeRegistrationsList.length === 0 ? (
							<div className="text-center py-12 text-slate-400">
								<CheckCircle2 className="h-10 w-10 text-emerald-500/40 mx-auto mb-2" />
								<p className="text-xs font-semibold">
									No pending Eye Clinic registrations in queue.
								</p>
								<p className="text-[11px] text-slate-400 mt-1">
									When a patient registers in the Eye Clinic, they will
									appear here instantly for billing.
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{eyeRegistrationsList.map((pat) => {
									const payAmt = eyePayAmounts[pat.id] || "3000";
									const payMeth = eyePayMethods[pat.id] || "Cash";
									return (
										<div
											key={pat.id}
											className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3 relative hover:shadow-sm transition-all"
										>
											<div className="flex justify-between items-start">
												<div>
													<span className="px-2 py-0.5 bg-[#2A758C]/10 text-[#2A758C] font-mono text-[10px] font-bold rounded-md">
														{pat?.hospitalNumber}
													</span>
													<h5 className="text-sm font-bold text-slate-900 mt-1">
														{pat?.name}
													</h5>
													<p className="text-[11px] text-slate-500">
														{pat.phoneNumber} •{" "}
														{pat.dateOfBirth || "N/A"}
													</p>
												</div>
												<div className="text-right">
													<span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg block">
														₦3,000 Card Fee
													</span>
													<span className="text-[10px] text-slate-400 block mt-1">
														Eye Clinic
													</span>
												</div>
											</div>

											<div className="text-[11px] text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-100">
												<div>
													<strong className="text-slate-700">
														Chief Complaint:
													</strong>{" "}
													{pat.chiefComplaint || "N/A"}
												</div>
												<div>
													<strong className="text-slate-700">
														Next of Kin:
													</strong>{" "}
													{pat.nextOfKin || "N/A"}
												</div>
												<div>
													<strong className="text-slate-700">
														Address:
													</strong>{" "}
													{pat.address || "N/A"}
												</div>
											</div>

											<div className="grid grid-cols-2 gap-2 pt-1">
												<div>
													<label className="block text-[10px] font-bold text-slate-500 mb-1">
														Amount Collecting (₦)
													</label>
													<input
														type="number"
														value={payAmt}
														onChange={(e) =>
															setEyePayAmounts({
																...eyePayAmounts,
																[pat.id]: e.target.value,
															})
														}
														className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold"
													/>
												</div>
												<div>
													<label className="block text-[10px] font-bold text-slate-500 mb-1">
														Payment Method
													</label>
													<select
														value={payMeth}
														onChange={(e) =>
															setEyePayMethods({
																...eyePayMethods,
																[pat.id]: e.target.value,
															})
														}
														className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold"
													>
														<option value="Cash">Cash</option>
														<option value="POS">
															POS Terminal
														</option>
														<option value="Bank Transfer">
															Bank Transfer
														</option>
														<option value="Approved Outstanding Bill">
															Approved Outstanding Bill
														</option>
													</select>
												</div>
											</div>

											<button
												onClick={() =>
													handleVerifyEyeRegistration(pat)
												}
												className="w-full py-2.5 bg-[#2A758C] hover:bg-[#1f5869] text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
											>
												<CheckCircle2 className="h-4 w-4 text-[#A3D1E0]" />
												<span>
													Verify Payment & Send Patient to
													Consultations
												</span>
											</button>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
  );
}
