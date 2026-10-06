/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (Billing: BillingQueuesPanel).
 * Emergency / Walk-In / Regular queue tabs.
 */

import {
	CheckCircle2,
	Clock,
	Loader2,
	ShieldAlert,
	Users,
} from "lucide-react";
import type { Invoice, Patient, Payment } from "@/types";
import type { CashierQueueItem, CashierWalkInItem } from "../_utils/cashier-totals";

export interface BillingQueuesPanelProps {
  patients: Patient[];
  payments: Payment[];
  queueItems: CashierQueueItem[];
  invoices: Invoice[];
  walkInPending: CashierWalkInItem[];
  pendingQueueTab: "emergency" | "walkin" | "regular";
  isLoadingQueue: boolean;
  setPendingQueueTab: (v: "emergency" | "walkin" | "regular") => void;
  setSelectedPatient: (p: Patient | null) => void;
  setPayAmount: (v: string) => void;
  setPayRef: (v: string) => void;
  setPayPurpose: (v: string) => void;
  setSelectedTotalBill: (v: number) => void;
  handleSelectQueueItem: (q: CashierQueueItem) => void;
  handleSelectWalkInForBilling: (item: CashierWalkInItem) => void;
}

export default function BillingQueuesPanel({
  patients,
  payments,
  queueItems,
  invoices,
  walkInPending,
  pendingQueueTab,
  isLoadingQueue,
  setPendingQueueTab,
  setSelectedPatient,
  setPayAmount,
  setPayRef,
  setPayPurpose,
  setSelectedTotalBill,
  handleSelectQueueItem,
  handleSelectWalkInForBilling,
}: BillingQueuesPanelProps) {
  void payments;
  void queueItems;
  void setSelectedPatient;
  void setPayAmount;
  void setPayRef;
  void setPayPurpose;
  void setSelectedTotalBill;
  return (
    <>
						{/* LEFT COLUMN: Pending Billing Queues */}
						<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3 flex flex-col justify-between">
							<div>
								<div className="flex items-center justify-between gap-1.5 mb-3">
									<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
										<Clock className="h-4 w-4 text-[#2A758C]" /> 2.
										Pending Billing Queues
									</h3>
									<span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-full">
										3 Queue Categories
									</span>
								</div>

								{/* THREE CATEGORIZED QUEUE TABS */}
								{(() => {
									const emergencyList = queueItems.filter(
										(q) =>
											q.status === "Waiting" &&
											(q.priority === "Emergency" ||
												q.cardType === "Emergency" ||
												q.patientCategory === "Emergency" ||
												(q.queue_type &&
													q.queue_type
														.toLowerCase()
														.includes("emergency"))),
									);
									const emergencyInvs = invoices.filter(
										(inv) =>
											inv.status === "Unpaid" &&
											(inv.cardType === "Emergency" ||
												(inv.description &&
													inv.description
														.toLowerCase()
														.includes("emergency"))),
									);
									const regularList = queueItems.filter(
										(q) =>
											q.status === "Waiting" &&
											q.priority !== "Emergency" &&
											q.cardType !== "Emergency" &&
											q.patientCategory !== "Emergency" &&
											(q.queue_type ===
												"Cashier Consultation Payment" ||
												q.queue_type === "Cashier Lab Payment" ||
												q.queue_type ===
													"Cashier Pharmacy Payment" ||
												q.queue_type === "Cashier"),
									);
									const regularInvs = invoices.filter(
										(inv) =>
											inv.status === "Unpaid" &&
											inv.cardType !== "Emergency" &&
											(!inv.description ||
												!inv.description
													.toLowerCase()
													.includes("emergency")),
									);

									return (
										<>
											<div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl mb-3 border border-slate-200/60">
												<button
													type="button"
													onClick={() =>
														setPendingQueueTab("emergency")
													}
													className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
														pendingQueueTab === "emergency"
															? "bg-rose-600 text-white shadow-xs"
															: "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
													}`}
												>
													<ShieldAlert className="h-3.5 w-3.5" />
													<span>Emergency</span>
													{emergencyList.length +
														emergencyInvs.length >
														0 && (
														<span
															className={`px-1.5 py-0.2 text-[9px] font-black rounded-full ${pendingQueueTab === "emergency" ? "bg-white text-rose-700" : "bg-rose-100 text-rose-800"}`}
														>
															{emergencyList.length +
																emergencyInvs.length}
														</span>
													)}
												</button>

												<button
													type="button"
													onClick={() =>
														setPendingQueueTab("walkin")
													}
													className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
														pendingQueueTab === "walkin"
															? "bg-amber-600 text-white shadow-xs"
															: "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
													}`}
												>
													<Users className="h-3.5 w-3.5" />
													<span>Walk-In</span>
													{walkInPending.length > 0 && (
														<span
															className={`px-1.5 py-0.2 text-[9px] font-black rounded-full ${pendingQueueTab === "walkin" ? "bg-white text-amber-800" : "bg-amber-100 text-amber-900"}`}
														>
															{walkInPending.length}
														</span>
													)}
												</button>

												<button
													type="button"
													onClick={() =>
														setPendingQueueTab("regular")
													}
													className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all cursor-pointer ${
														pendingQueueTab === "regular"
															? "bg-[#2A758C] text-white shadow-xs"
															: "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
													}`}
												>
													<Clock className="h-3.5 w-3.5" />
													<span>Regular</span>
													{regularList.length +
														regularInvs.length >
														0 && (
														<span
															className={`px-1.5 py-0.2 text-[9px] font-black rounded-full ${pendingQueueTab === "regular" ? "bg-white text-[#2A758C]" : "bg-sky-100 text-sky-900"}`}
														>
															{regularList.length +
																regularInvs.length}
														</span>
													)}
												</button>
											</div>

											{isLoadingQueue ? (
												<div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
													<Loader2 className="animate-spin h-4 w-4 text-[#2A758C]" />
													<span>
														Refreshing active billing queues...
													</span>
												</div>
											) : (
												<div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
													{/* TAB 1: EMERGENCY QUEUE */}
													{pendingQueueTab === "emergency" && (
														<div>
															{emergencyList.length === 0 &&
															emergencyInvs.length === 0 ? (
																<div className="py-10 text-center text-xs text-slate-400 font-medium border border-dashed border-rose-200 rounded-xl bg-rose-50/30">
																	<ShieldAlert className="h-7 w-7 text-rose-400 mx-auto mb-1.5" />
																	<p className="font-bold text-rose-800">
																		No emergency patients
																		pending payment
																	</p>
																	<p className="text-[10px] text-slate-400 mt-0.5">
																		Emergency triage queues
																		are completely clear.
																	</p>
																</div>
															) : (
																<div className="space-y-2">
																	<p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider font-mono flex items-center justify-between">
																		<span>
																			🚨 Priority Emergency
																			Billing Queue
																		</span>
																		<span>
																			{emergencyList.length +
																				emergencyInvs.length}{" "}
																			Pending
																		</span>
																	</p>
																	{emergencyList.map((q) => (
																		<button
																			key={q.id}
																			onClick={() =>
																				handleSelectQueueItem(
																					q,
																				)
																			}
																			className="w-full text-left p-3 rounded-xl text-xs bg-rose-50 hover:bg-rose-100/80 border border-rose-200 flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
																		>
																			<div className="truncate pr-2">
																				<div className="flex items-center gap-1.5">
																					<span className="px-1.5 py-0.2 text-[9px] font-black bg-rose-600 text-white rounded-md uppercase">
																						EMERGENCY
																					</span>
																					<p className="font-bold text-slate-800 truncate group-hover:text-rose-950">
																						{
																							q.patient_name
																						}
																					</p>
																				</div>
																				<p className="text-[10px] text-slate-500 font-mono mt-0.5">
																					{q.hospital_number ||
																						"—"}
																				</p>
																			</div>
																			<span className="text-[10px] bg-rose-600 text-white font-black px-3 py-1.5 rounded-lg shrink-0 shadow-2xs group-hover:scale-105 transition-all">
																				Select & Pay
																			</span>
																		</button>
																	))}
																	{emergencyInvs.map((inv) => (
																		<button
																			key={inv.id}
																			onClick={() => {
																				const pat =
																					patients.find(
																						(p) =>
																							p.id ===
																							inv.patient_id,
																					);
																				if (pat) {
																					setSelectedPatient(
																						pat,
																					);
																					setPayAmount(
																						String(
																							inv.amount,
																						),
																					);
																					setSelectedTotalBill(
																						Number(
																							inv.amount,
																						) || 0,
																					);
																					setPayPurpose(
																						inv.description ||
																							"Emergency Treatment Bill",
																					);
																					setPayRef(
																						inv.id,
																					);
																				}
																			}}
																			className="w-full text-left p-3 rounded-xl text-xs bg-rose-50/70 hover:bg-rose-100 border border-rose-200 flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
																		>
																			<div className="truncate pr-2">
																				<p className="font-bold text-slate-800 truncate">
																					{
																						inv.patient_name
																					}
																				</p>
																				<p className="text-[10px] text-rose-700 font-mono mt-0.5 truncate">
																					{inv.description}
																				</p>
																			</div>
																			<span className="text-[10px] bg-rose-600 text-white font-bold px-2.5 py-1 rounded-lg shrink-0 font-mono">
																				₦
																				{Number(
																					inv.amount,
																				).toLocaleString()}
																			</span>
																		</button>
																	))}
																</div>
															)}
														</div>
													)}

													{/* TAB 2: WALK-IN PATIENTS */}
													{pendingQueueTab === "walkin" && (
														<div>
															{walkInPending.length === 0 ? (
																<div className="py-10 text-center text-xs text-slate-400 font-medium border border-dashed border-amber-200 rounded-xl bg-amber-50/30">
																	<Users className="h-7 w-7 text-amber-400 mx-auto mb-1.5" />
																	<p className="font-bold text-amber-800">
																		No walk-in laboratory
																		patients pending
																		verification
																	</p>
																	<p className="text-[10px] text-slate-400 mt-0.5">
																		Direct walk-in lab
																		registrations will appear
																		here immediately.
																	</p>
																</div>
															) : (
																<div className="space-y-2">
																	<p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider font-mono flex items-center justify-between">
																		<span>
																			🚶 Direct Walk-In Lab
																			Patients
																		</span>
																		<span>
																			{walkInPending.length}{" "}
																			Waiting
																		</span>
																	</p>
																	{walkInPending.map(
																		(item) => (
																			<button
																				key={
																					item.encounterId
																				}
																				onClick={() =>
																					handleSelectWalkInForBilling(
																						item,
																					)
																				}
																				className="w-full text-left p-3 rounded-xl text-xs bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
																			>
																				<div className="truncate pr-2">
																					<p className="font-bold text-slate-800 truncate group-hover:text-amber-950">
																						{
																							item.patientName
																						}
																					</p>
																					<p className="text-[10px] text-amber-800 font-medium truncate mt-0.5">
																						{item.testsSummary ||
																							"Laboratory Panel"}
																					</p>
																				</div>
																				<div className="text-right shrink-0">
																					<span className="text-xs font-black text-slate-900 font-mono block">
																						₦
																						{(
																							item.totalAmount ||
																							0
																						).toLocaleString()}
																					</span>
																					<span className="text-[9px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-md mt-0.5 inline-block">
																						Select & Pay
																					</span>
																				</div>
																			</button>
																		),
																	)}
																</div>
															)}
														</div>
													)}

													{/* TAB 3: REGULAR PENDING PAYMENTS */}
													{pendingQueueTab === "regular" && (
														<div>
															{regularList.length === 0 &&
															regularInvs.length === 0 ? (
																<div className="py-10 text-center text-xs text-slate-400 font-medium border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
																	<CheckCircle2 className="h-7 w-7 text-emerald-400 mx-auto mb-1.5" />
																	<p className="font-bold text-slate-700">
																		No regular pending
																		payments
																	</p>
																	<p className="text-[10px] text-slate-400 mt-0.5">
																		OPD consultation & routine
																		billing queues are clear.
																	</p>
																</div>
															) : (
																<div className="space-y-3">
																	{/* Consultation Group */}
																	{regularList.filter(
																		(q) =>
																			q.queue_type ===
																			"Cashier Consultation Payment",
																	).length > 0 && (
																		<div>
																			<p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5 font-mono">
																				● OPD Consultation
																				Fee (₦5,000)
																			</p>
																			<div className="space-y-1.5">
																				{regularList
																					.filter(
																						(q) =>
																							q.queue_type ===
																							"Cashier Consultation Payment",
																					)
																					.map((q) => (
																						<button
																							key={q.id}
																							onClick={() =>
																								handleSelectQueueItem(
																									q,
																								)
																							}
																							className="w-full text-left p-2.5 rounded-xl text-xs bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-100 flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
																						>
																							<div className="truncate pr-2">
																								<p className="font-bold text-slate-800 truncate group-hover:text-emerald-950">
																									{
																										q.patient_name
																									}
																								</p>
																								<p className="text-[10px] text-slate-500 font-mono mt-0.5">
																									{
																										q.hospital_number
																									}
																								</p>
																							</div>
																							<span className="text-[10px] bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg shrink-0 shadow-2xs group-hover:scale-105 transition-all">
																								Select &
																								Pay
																							</span>
																						</button>
																					))}
																			</div>
																		</div>
																	)}

																	{/* Lab Group */}
																	{regularList.filter(
																		(q) =>
																			q.queue_type ===
																			"Cashier Lab Payment",
																	).length > 0 && (
																		<div>
																			<p className="text-[10px] font-bold text-[#2A758C] uppercase tracking-wider mb-1.5 font-mono">
																				● Doctor Lab Request
																				Payment
																			</p>
																			<div className="space-y-1.5">
																				{regularList
																					.filter(
																						(q) =>
																							q.queue_type ===
																							"Cashier Lab Payment",
																					)
																					.map((q) => (
																						<button
																							key={q.id}
																							onClick={() =>
																								handleSelectQueueItem(
																									q,
																								)
																							}
																							className="w-full text-left p-2.5 rounded-xl text-xs bg-sky-50/50 hover:bg-sky-100/60 border border-sky-100 flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
																						>
																							<div className="truncate pr-2">
																								<p className="font-bold text-slate-800 truncate group-hover:text-sky-950">
																									{
																										q.patient_name
																									}
																								</p>
																								<p className="text-[10px] text-slate-500 font-mono mt-0.5">
																									{
																										q.hospital_number
																									}
																								</p>
																							</div>
																							<span className="text-[10px] bg-[#2A758C] text-white font-bold px-2.5 py-1 rounded-lg shrink-0 shadow-2xs group-hover:scale-105 transition-all">
																								Select &
																								Pay
																							</span>
																						</button>
																					))}
																			</div>
																		</div>
																	)}

																	{/* Pharmacy Group */}
																	{regularList.filter(
																		(q) =>
																			q.queue_type ===
																			"Cashier Pharmacy Payment",
																	).length > 0 && (
																		<div>
																			<p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1.5 font-mono">
																				● Pharmacy
																				Prescriptions
																			</p>
																			<div className="space-y-1.5">
																				{regularList
																					.filter(
																						(q) =>
																							q.queue_type ===
																							"Cashier Pharmacy Payment",
																					)
																					.map((q) => (
																						<button
																							key={q.id}
																							onClick={() =>
																								handleSelectQueueItem(
																									q,
																								)
																							}
																							className="w-full text-left p-2.5 rounded-xl text-xs bg-amber-50/50 hover:bg-amber-100/60 border border-amber-100 flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
																						>
																							<div className="truncate pr-2">
																								<p className="font-bold text-slate-800 truncate group-hover:text-amber-950">
																									{
																										q.patient_name
																									}
																								</p>
																								<p className="text-[10px] text-slate-500 font-mono mt-0.5">
																									{
																										q.hospital_number
																									}
																								</p>
																							</div>
																							<span className="text-[10px] bg-amber-600 text-white font-bold px-2.5 py-1 rounded-lg shrink-0 shadow-2xs group-hover:scale-105 transition-all">
																								Select &
																								Pay
																							</span>
																						</button>
																					))}
																			</div>
																		</div>
																	)}

																	{/* Unpaid Regular Invoices */}
																	{regularInvs.length > 0 && (
																		<div>
																			<p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">
																				● Unpaid Outpatient
																				Invoices
																			</p>
																			<div className="space-y-1.5">
																				{regularInvs.map(
																					(inv) => (
																						<button
																							key={
																								inv.id
																							}
																							onClick={() => {
																								const pat =
																									patients.find(
																										(
																											p,
																										) =>
																											p.id ===
																											inv.patient_id,
																									);
																								if (
																									pat
																								) {
																									setSelectedPatient(
																										pat,
																									);
																									setPayAmount(
																										String(
																											inv.amount,
																										),
																									);
																									setSelectedTotalBill(
																										Number(
																											inv.amount,
																										) ||
																											0,
																									);
																									setPayPurpose(
																										inv.description,
																									);
																									setPayRef(
																										inv.id,
																									);
																								}
																							}}
																							className="w-full text-left p-2.5 rounded-xl text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-all group cursor-pointer shadow-2xs"
																						>
																							<div className="truncate pr-2">
																								<p className="font-bold text-slate-800 truncate">
																									{
																										inv.patient_name
																									}
																								</p>
																								<p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
																									{
																										inv.description
																									}
																								</p>
																							</div>
																							<span className="text-[10px] bg-slate-800 text-white font-bold px-2.5 py-1 rounded-lg shrink-0 font-mono">
																								₦
																								{Number(
																									inv.amount,
																								).toLocaleString()}
																							</span>
																						</button>
																					),
																				)}
																			</div>
																		</div>
																	)}
																</div>
															)}
														</div>
													)}
												</div>
											)}
										</>
									);
								})()}
							</div>
						</div>
    </>
  );
}
