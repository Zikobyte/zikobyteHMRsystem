/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (CashierHeader).
 * Banner + alerts + maternity handover banner + KPI switch.
 */

import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Baby,
  Calculator,
  CheckCircle,
  CheckCircle2,
  Clock,
  Coins,
  DollarSign,
  FlaskConical,
  LogOut,
  Receipt,
  TrendingUp,
  User as UserIcon,
  Users,
} from "lucide-react";
import type { Invoice } from "@/types";
import type { CashierActiveTab } from "../_hooks/useCashierData";
import type { MaternityHandoverRecord } from "../MaternitySuppliesCashierView";
import type { CashierQueueItem } from "../_utils/cashier-totals";

export interface CashierHeaderProps {
  activeTab: CashierActiveTab;
  error: string;
  success: string;
  maternitySupplies: MaternityHandoverRecord[];
  pendingPaymentsCount: number;
  pendingPaymentsSum: number;
  dischargeBillsCount: number;
  dischargeBillsSum: number;
  outstandingBalancesCount: number;
  outstandingTotalOwed: number;
  totalPatientsCount: number;
  totalCollected: number;
  cashTotal: number;
  pendingLabQueueItems: CashierQueueItem[];
  invoices: Invoice[];
  totalPVExpensed: number;
  largestPVExpense: number;
  totalPVCount: number;
  totalNoChargeSettle: number;
  totalNoChargeCount: number;
  noChargeStaffSelfCount: number;
  setActiveTab: (tab: CashierActiveTab) => void;
  setIsBalanceModalOpen: (v: boolean) => void;
}

export default function CashierHeader({
  activeTab,
  error,
  success,
  maternitySupplies,
  pendingPaymentsCount,
  pendingPaymentsSum,
  dischargeBillsCount,
  dischargeBillsSum,
  outstandingBalancesCount,
  outstandingTotalOwed,
  totalPatientsCount,
  totalCollected,
  cashTotal,
  pendingLabQueueItems,
  invoices,
  totalPVExpensed,
  largestPVExpense,
  totalPVCount,
  totalNoChargeSettle,
  totalNoChargeCount,
  noChargeStaffSelfCount,
  setActiveTab,
  setIsBalanceModalOpen,
}: CashierHeaderProps) {
  return (
    <>
			{/* 1. Header Banner */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
				<div>
					<h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
						<Coins className="h-6 w-6 text-[#2A758C]" /> Billing & Cashier
						Desk
					</h2>
					<p className="text-xs text-slate-400 mt-1">
						Accept card fees, settle bills, log daily PV expenses, and
						manage No Charge treatments.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<button
						onClick={() => setIsBalanceModalOpen(true)}
						className="flex items-center gap-2 text-xs font-bold text-white bg-[#2A758C] hover:bg-[#1f5869] px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
					>
						<Calculator className="h-4 w-4" />
						<span>Balance Day's Revenue</span>
					</button>
					<div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
						<Clock className="h-4 w-4 text-[#2A758C]" />
						<span>Intranet Active Gateway</span>
					</div>
				</div>
			</div>

			{/* 2. Alerts */}
			{error && (
				<div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-center gap-3 text-xs font-semibold">
					<AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
					<span>{error}</span>
				</div>
			)}
			{success && (
				<div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-semibold">
					<CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
					<span>{success}</span>
				</div>
			)}

			{/* Maternity Handover Alert Banner */}
			{maternitySupplies.filter((r: MaternityHandoverRecord) => r.status === "Pending Handover")
				.length > 0 &&
				activeTab === "billing" && (
					<div className="p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-200 text-pink-900 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-2xl bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-700 shrink-0">
								<Baby className="h-5 w-5" />
							</div>
							<div>
								<div className="flex items-center gap-2">
									<span className="text-xs font-black text-slate-900">
										Maternity Ward Cash Handover Awaiting Reconcile
									</span>
									<span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E11D48] text-white">
										{
											maternitySupplies.filter(
												(r: MaternityHandoverRecord) => r.status === "Pending Handover",
											).length
										}{" "}
										Pending
									</span>
								</div>
								<p className="text-[11px] text-pink-800 font-medium mt-0.5">
									Ward nurses collected bedside cash for delivery and
									baby supplies. Total pending physical cash:{" "}
									<strong className="font-mono text-pink-950 font-black">
										₦
										{maternitySupplies
											.filter(
												(r: MaternityHandoverRecord) => r.status === "Pending Handover",
											)
											.reduce(
												(sum: number, r: MaternityHandoverRecord) =>
													sum + (Number(r.total_amount) || 0),
												0,
											)
											.toLocaleString()}
									</strong>
								</p>
							</div>
						</div>
						<button
							onClick={() => setActiveTab("maternity-supplies")}
							className="px-4 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE185D] text-white text-xs font-black shrink-0 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
						>
							<span>Review & Balance Cash</span>
							<ArrowUpRight className="h-3.5 w-3.5" />
						</button>
					</div>
				)}

			{/* 3. KPI stats cards */}
			{activeTab === "billing" ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
					{/* Card 1: Pending Payments */}
					<div
						onClick={() => setActiveTab("pending-payments-all")}
						className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5 hover:border-amber-200 hover:shadow-sm transition-all cursor-pointer group"
					>
						<div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
							<Clock className="h-5 w-5" />
						</div>
						<div className="min-w-0">
							<span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono truncate">
								Pending Payments
							</span>
							<span className="text-lg font-black text-slate-900 block leading-tight">
								{pendingPaymentsCount}
							</span>
							<span className="text-[10px] font-mono font-bold text-amber-600 block truncate mt-0.5">
								₦{pendingPaymentsSum.toLocaleString()} due
							</span>
						</div>
					</div>

					{/* Card 2: Discharge Bills */}
					<div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group">
						<div className="h-11 w-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
							<LogOut className="h-5 w-5" />
						</div>
						<div className="min-w-0">
							<span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono truncate">
								Discharge Bills
							</span>
							<span className="text-lg font-black text-slate-900 block leading-tight">
								{dischargeBillsCount}
							</span>
							<span className="text-[10px] font-mono font-bold text-indigo-600 block truncate mt-0.5">
								₦{dischargeBillsSum.toLocaleString()} due
							</span>
						</div>
					</div>

					{/* Card 3: Outstanding Balances */}
					<div
						onClick={() => setActiveTab("outstanding")}
						className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5 hover:border-rose-200 hover:shadow-sm transition-all cursor-pointer group"
					>
						<div className="h-11 w-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 group-hover:scale-105 transition-transform">
							<AlertTriangle className="h-5 w-5" />
						</div>
						<div className="min-w-0">
							<span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono truncate">
								Outstanding Balances
							</span>
							<span className="text-lg font-black text-slate-900 block leading-tight">
								{outstandingBalancesCount}
							</span>
							<span className="text-[10px] font-mono font-bold text-rose-600 block truncate mt-0.5">
								₦{outstandingTotalOwed.toLocaleString()} owed
							</span>
						</div>
					</div>

					{/* Card 4: Total Patients */}
					<div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5 hover:border-teal-200 hover:shadow-sm transition-all cursor-pointer group">
						<div className="h-11 w-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-105 transition-transform">
							<Users className="h-5 w-5" />
						</div>
						<div className="min-w-0">
							<span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono truncate">
								Total Patients
							</span>
							<span className="text-lg font-black text-slate-900 block leading-tight">
								{totalPatientsCount}
							</span>
							<span className="text-[10px] font-bold text-slate-400 block truncate mt-0.5">
								Registered in System
							</span>
						</div>
					</div>

					{/* Card 5: Revenue Collected */}
					<div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer group">
						<div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
							<TrendingUp className="h-5 w-5" />
						</div>
						<div className="min-w-0">
							<span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono truncate">
								Revenue Collected
							</span>
							<span className="text-lg font-black text-emerald-700 block leading-tight">
								₦{totalCollected.toLocaleString()}
							</span>
							<span className="text-[10px] font-mono font-bold text-slate-500 block truncate mt-0.5">
								Cash ₦{cashTotal.toLocaleString()}
							</span>
						</div>
					</div>
				</div>
			) : activeTab === "lab-payments" ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
						<div className="h-12 w-12 rounded-xl bg-[#2A758C]/10 border border-[#2A758C]/20 flex items-center justify-center text-[#2A758C] shrink-0">
							<FlaskConical className="h-6 w-6" />
						</div>
						<div>
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
								Pending Lab Requests
							</span>
							<span className="text-lg font-black text-slate-800">
								{pendingLabQueueItems.length} Patients
							</span>
						</div>
					</div>

					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
						<div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
							<DollarSign className="h-6 w-6" />
						</div>
						<div>
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
								Pending Lab Fee Sum
							</span>
							<span className="text-lg font-black text-slate-800">
								₦
								{pendingLabQueueItems
									.reduce((acc: number, q: CashierQueueItem) => {
										const inv = invoices.find(
											(i) =>
												i.patient_id === q.patient_id &&
												i.status === "Unpaid",
										);
										return acc + (inv ? Number(inv.amount || 0) : 0);
									}, 0)
									.toLocaleString()}
							</span>
						</div>
					</div>

					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
						<div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
							<CheckCircle2 className="h-6 w-6" />
						</div>
						<div>
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
								Gateway Status
							</span>
							<span className="text-xs font-bold text-emerald-700">
								Ready for Cashier Collection
							</span>
						</div>
					</div>
				</div>
			) : activeTab === "vitae" ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
						<div className="h-12 w-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
							<TrendingUp className="h-6 w-6" />
						</div>
						<div>
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
								Total PV Expensed
							</span>
							<span className="text-lg font-black text-slate-800">
								₦{totalPVExpensed.toLocaleString()}
							</span>
						</div>
					</div>

					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
						<div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
							<DollarSign className="h-6 w-6" />
						</div>
						<div>
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
								Largest PV Disbursement
							</span>
							<span className="text-lg font-black text-slate-800">
								₦{largestPVExpense.toLocaleString()}
							</span>
						</div>
					</div>

					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
						<div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#2A758C] shrink-0">
							<Receipt className="h-6 w-6" />
						</div>
						<div>
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
								Disbursements Count
							</span>
							<span className="text-lg font-black text-slate-800">
								{totalPVCount} Receipts
							</span>
						</div>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
						<div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
							<TrendingUp className="h-6 w-6" />
						</div>
						<div>
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
								No-Charge Total Absorbed
							</span>
							<span className="text-lg font-black text-slate-800">
								₦{totalNoChargeSettle.toLocaleString()}
							</span>
						</div>
					</div>

					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
						<div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
							<UserIcon className="h-6 w-6" />
						</div>
						<div>
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
								Staff & Dependents Served
							</span>
							<span className="text-lg font-black text-slate-800">
								{totalNoChargeCount} Patients
							</span>
						</div>
					</div>

					<div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
						<div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#2A758C] shrink-0">
							<CheckCircle className="h-6 w-6" />
						</div>
						<div>
							<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
								Self (Staff) Treatments
							</span>
							<span className="text-lg font-black text-slate-800">
								{noChargeStaffSelfCount} Sessions
							</span>
						</div>
					</div>
				</div>
			)}
    </>
  );
}
