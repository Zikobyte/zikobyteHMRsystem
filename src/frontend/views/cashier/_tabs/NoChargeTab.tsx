/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (no-charge).
 */

import { CheckCircle, User as UserIcon } from "lucide-react";
import type { Patient } from "@/types";
import type { CashierNoChargeRecord } from "../_utils/cashier-totals";

export interface NoChargeTabProps {
  patients: Patient[];
  noChargeRecords: CashierNoChargeRecord[];
  isLoading: boolean;
  ncStaffName: string;
  ncRelationship: string;
  ncPatientId: string;
  ncTreatmentCost: string;
  ncTreatmentDescription: string;
  ncApprovedByDoctor: string;
  setNcStaffName: (v: string) => void;
  setNcRelationship: (v: string) => void;
  setNcPatientId: (v: string) => void;
  setNcTreatmentCost: (v: string) => void;
  setNcTreatmentDescription: (v: string) => void;
  setNcApprovedByDoctor: (v: string) => void;
  handleRecordNoChargeSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function NoChargeTab({
  patients,
  noChargeRecords,
  isLoading,
  ncStaffName,
  ncRelationship,
  ncPatientId,
  ncTreatmentCost,
  ncTreatmentDescription,
  ncApprovedByDoctor,
  setNcStaffName,
  setNcRelationship,
  setNcPatientId,
  setNcTreatmentCost,
  setNcTreatmentDescription,
  setNcApprovedByDoctor,
  handleRecordNoChargeSubmit,
}: NoChargeTabProps) {
  void patients;
  void noChargeRecords;
  return (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Form Column */}
					<div className="lg:col-span-1 space-y-6">
						<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
								Log No-Charge Staff Treatment
							</h3>
							<p className="text-[11px] text-[#2A758C] font-semibold leading-normal">
								Authorized for clinic staff, their dependents, and
								relatives of the Medical Director.
							</p>

							<form
								onSubmit={handleRecordNoChargeSubmit}
								className="space-y-4"
							>
								<div>
									<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
										Staff Beneficiary Name
									</label>
									<input
										type="text"
										required
										placeholder="e.g. Nurse Jane Doe"
										value={ncStaffName}
										onChange={(e) => setNcStaffName(e.target.value)}
										className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
									/>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
											Relationship
										</label>
										<select
											value={ncRelationship}
											onChange={(e) =>
												setNcRelationship(e.target.value)
											}
											className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
										>
											<option value="Self">Self (Staff)</option>
											<option value="Child">
												Child / Dependent
											</option>
											<option value="Spouse">
												Spouse / Dependent
											</option>
											<option value="MD Relative">
												MD Relative
											</option>
										</select>
									</div>
									<div>
										<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
											Estimated Cost (₦)
										</label>
										<input
											type="number"
											required
											placeholder="0"
											value={ncTreatmentCost}
											onChange={(e) =>
												setNcTreatmentCost(e.target.value)
											}
											className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-bold"
										/>
									</div>
								</div>

								<div>
									<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
										Link Registered Patient (Optional)
									</label>
									<select
										value={ncPatientId}
										onChange={(e) => setNcPatientId(e.target.value)}
										className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
									>
										<option value="">
											-- No linked EMR profile --
										</option>
										{patients.map((p) => (
											<option key={p.id} value={p.id}>
												{p.name} ({p.hospitalNumber})
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
										Treatment Details
									</label>
									<textarea
										required
										placeholder="e.g. Free malaria therapy treatment and pharmacy dispensing"
										value={ncTreatmentDescription}
										onChange={(e) =>
											setNcTreatmentDescription(e.target.value)
										}
										rows={3}
										className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
									/>
								</div>

								<div>
									<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
										Approving Doctor
									</label>
									<select
										value={ncApprovedByDoctor}
										onChange={(e) =>
											setNcApprovedByDoctor(e.target.value)
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

								<button
									type="submit"
									disabled={isLoading}
									className="w-full bg-[#2A758C] hover:bg-[#1f5869] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
								>
									<CheckCircle className="h-4 w-4" /> Log Approved
									Treatment
								</button>
							</form>
						</div>
					</div>

					{/* Ledger Column */}
					<div className="lg:col-span-2">
						<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
								<UserIcon className="h-4 w-4 text-[#2A758C]" />{" "}
								No-Charge Patient Records Ledger
							</h3>

							<div className="overflow-x-auto">
								<table className="w-full text-left text-xs">
									<thead>
										<tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] font-bold uppercase">
											<th className="pb-2.5">Beneficiary / Staff</th>
											<th className="pb-2.5">Relationship</th>
											<th className="pb-2.5">Treatment Details</th>
											<th className="pb-2.5">Settle Cost</th>
											<th className="pb-2.5">Approved By</th>
											<th className="pb-2.5 text-right">
												Date / Time
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-50 text-slate-700">
										{noChargeRecords.length > 0 ? (
											noChargeRecords.map((r) => (
												<tr
													key={r.id}
													className="hover:bg-slate-50/50 transition-all"
												>
													<td className="py-3">
														<p className="font-bold text-slate-800">
															{r.staffName}
														</p>
														{r.patientName && (
															<p className="text-[10px] text-[#2A758C] font-mono mt-0.5">
																EMR: {r.patientName} (
																{r.hospitalNumber})
															</p>
														)}
													</td>
													<td className="py-3">
														<span className="px-2 py-0.5 bg-sky-50 text-[#2A758C] border border-sky-100 rounded-full text-[9px] font-bold uppercase">
															{r.relationship}
														</span>
													</td>
													<td className="py-3 text-slate-600 font-medium">
														{r.treatmentDescription}
													</td>
													<td className="py-3 font-mono font-bold text-slate-700">
														₦{r.treatmentCost.toLocaleString()}
													</td>
													<td className="py-3 font-semibold text-slate-600 text-[11px]">
														{r.approvedByDoctor}
													</td>
													<td className="py-3 text-right text-[10px] text-slate-400 font-mono">
														{new Date(
															r.createdAt,
														).toLocaleDateString()}{" "}
														{new Date(
															r.createdAt,
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
													colSpan={6}
													className="py-12 text-center text-slate-400"
												>
													<UserIcon className="h-8 w-8 text-slate-200 mx-auto mb-2" />
													<p className="font-medium text-xs">
														No No-Charge patient treatments logged
													</p>
													<p className="text-[10px] text-slate-400 mt-1">
														Authorized zero-charge entries will be
														catalogued here.
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
