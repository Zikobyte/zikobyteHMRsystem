/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (pending-payments-all).
 * Verbatim JSX: consolidated pending breakdown (lab + billing queue + invoices).
 */

import { ArrowLeft, ClipboardList, Clock, Eye, FlaskConical, Receipt } from "lucide-react";
import type { Invoice, Patient, Payment } from "@/types";
import type { CashierActiveTab } from "../_hooks/useCashierData";
import type {
  CashierQueueItem,
  CashierWalkInItem,
} from "../_utils/cashier-totals";

export interface PendingAllTabProps {
  patients: Patient[];
  payments: Payment[];
  invoices: Invoice[];
  walkInPending: CashierWalkInItem[];
  pendingLabCount: number;
  pendingLabQueueItems: CashierQueueItem[];
  billingQueuePendingItems: CashierQueueItem[];
  billingQueueCount: number;
  unpaidInvoices: Invoice[];
  pendingPaymentsCount: number;
  pendingPaymentsSum: number;
  setActiveTab: (tab: CashierActiveTab) => void;
}

export default function PendingAllTab({
  patients,
  payments,
  invoices,
  walkInPending,
  pendingLabCount,
  pendingLabQueueItems,
  billingQueuePendingItems,
  billingQueueCount,
  unpaidInvoices,
  pendingPaymentsCount,
  pendingPaymentsSum,
  setActiveTab,
}: PendingAllTabProps) {
  void payments;
  void invoices;
  return (
				<div className="space-y-5">
					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => setActiveTab("billing")}
								className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer shrink-0"
								title="Back"
							>
								<ArrowLeft className="h-4 w-4" />
							</button>
							<div>
								<h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
									<Clock className="h-5 w-5 text-amber-600" /> All
									Pending Payments
								</h3>
								<p className="text-xs text-slate-400 mt-0.5">
									Full breakdown of the {pendingPaymentsCount} pending
									payment record{pendingPaymentsCount === 1 ? "" : "s"}{" "}
									counted on the dashboard card, ₦
									{pendingPaymentsSum.toLocaleString()} due from unpaid
									invoices.
								</p>
							</div>
						</div>
					</div>

					{/* Section A: Pending Lab Requests */}
					<div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
						<div className="p-4 border-b border-slate-100 flex items-center justify-between">
							<h4 className="text-xs font-black text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
								<FlaskConical className="h-4 w-4 text-[#2A758C]" />{" "}
								Pending Lab Requests
							</h4>
							<span className="px-2 py-0.5 text-[10px] font-black bg-[#2A758C]/10 text-[#2A758C] rounded-full">
								{pendingLabCount}
							</span>
						</div>
						{pendingLabCount === 0 ? (
							<p className="p-5 text-xs text-slate-400">
								No lab payment requests waiting for collection.
							</p>
						) : (
							<div className="divide-y divide-slate-100">
								{pendingLabQueueItems.map((q: CashierQueueItem) => {
									const pat =
										patients.find((p) => p.id === q.patient_id);
									return (
										<div
											key={q.id}
											className="p-4 flex items-center justify-between text-xs"
										>
											<div>
												<p className="font-bold text-slate-800">
													{q.patient_name ||
														pat?.name ||
														"Outpatient"}
												</p>
												<p className="text-[10px] font-mono text-slate-400">
													{q.hospital_number ||
														pat?.hospitalNumber ||
														"—"}
												</p>
											</div>
											<span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase">
												{pat?.cardType || q.card_type || "Standard"}
											</span>
										</div>
									);
								})}
								{walkInPending.map((item: CashierWalkInItem) => (
									<div
										key={item.id || item.patient_id}
										className="p-4 flex items-center justify-between text-xs"
									>
										<div>
											<p className="font-bold text-slate-800">
												{item.patient_name ||
													item.name ||
													"Walk-In Patient"}
											</p>
											<p className="text-[10px] font-mono text-slate-400">
												{item.hospital_number || "—"}
											</p>
										</div>
										<span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">
											Walk-In
										</span>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Section B: Pending Billing Queue */}
					<div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
						<div className="p-4 border-b border-slate-100 flex items-center justify-between">
							<h4 className="text-xs font-black text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
								<ClipboardList className="h-4 w-4 text-[#2A758C]" />{" "}
								Pending Billing Queue
							</h4>
							<span className="px-2 py-0.5 text-[10px] font-black bg-[#2A758C]/10 text-[#2A758C] rounded-full">
								{billingQueueCount}
							</span>
						</div>
						{billingQueueCount === 0 ? (
							<p className="p-5 text-xs text-slate-400">
								No patients currently waiting in the billing queue.
							</p>
						) : (
							<div className="divide-y divide-slate-100">
								{billingQueuePendingItems.map((q: CashierQueueItem) => {
									const pat =
										patients.find((p) => p.id === q.patient_id);
									return (
										<div
											key={q.id}
											className="p-4 flex items-center justify-between text-xs"
										>
											<div>
												<p className="font-bold text-slate-800">
													{q.patient_name ||
														pat?.name ||
														"Outpatient"}
												</p>
												<p className="text-[10px] font-mono text-slate-400">
													{q.hospital_number ||
														pat?.hospitalNumber ||
														"—"}
												</p>
											</div>
											<span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase">
												{q.status}
											</span>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Section C: Unpaid Invoices */}
					<div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
						<div className="p-4 border-b border-slate-100 flex items-center justify-between">
							<h4 className="text-xs font-black text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
								<Receipt className="h-4 w-4 text-[#2A758C]" /> Unpaid
								Invoices
							</h4>
							<span className="px-2 py-0.5 text-[10px] font-black bg-[#2A758C]/10 text-[#2A758C] rounded-full">
								{unpaidInvoices.length}
							</span>
						</div>
						{unpaidInvoices.length === 0 ? (
							<p className="p-5 text-xs text-slate-400">
								No unpaid invoices on record.
							</p>
						) : (
							<div className="divide-y divide-slate-100">
								{unpaidInvoices.map((inv: Invoice) => {
									const pat = patients.find(
										(p) => p.id === inv.patient_id,
									);
									return (
										<div
											key={inv.id}
											className="p-4 flex items-center justify-between text-xs"
										>
											<div>
												<p className="font-bold text-slate-800">
													{inv.patient_name ||
														pat?.name ||
														"Outpatient"}
												</p>
												<p className="text-[10px] text-slate-400">
													{inv.description || "Invoice"}
												</p>
											</div>
											<span className="text-xs font-black text-amber-700">
												₦
												{(
													Number(inv.amount) ||
													Number(inv.total) ||
													0
												).toLocaleString()}
											</span>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
  );
}
