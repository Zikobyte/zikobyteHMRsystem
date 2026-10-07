/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (HistoryModal inner tab:
 * invoices). Verbatim JSX — renders from history data props only.
 */

import type { HistoryPanelProps } from "./HistoryConsultationsPanel";

export default function HistoryInvoicesPanel({ data }: HistoryPanelProps) {
	return (
		<div className="space-y-3">
			{data.invoices?.length ===
			0 ? (
				<p className="text-xs text-slate-400 text-center py-8">
					No invoice records found.
				</p>
			) : (
				data.invoices?.map(
					(inv) => (
						<div
							key={inv.id}
							className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex justify-between items-center"
						>
							<div>
								<span className="text-xs font-extrabold text-slate-900 block">
									Invoice #
									{inv.invoice_number ||
										inv.id}
								</span>
								<span className="text-[10px] text-slate-500 font-mono">
									{inv.created_at
										? new Date(
												inv.created_at,
											).toLocaleString()
										: "—"}{" "}
									•{" "}
									{inv.notes ||
										"Medical services"}
								</span>
							</div>
							<div className="text-right">
								<span className="text-xs font-black text-[#2A758C] block font-mono">
									₦
									{Number(
										inv.total_amount || 0,
									).toLocaleString()}
								</span>
								<span
									className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
										inv.payment_status ===
										"Paid"
											? "bg-emerald-100 text-emerald-800"
											: "bg-amber-100 text-amber-800"
									}`}
								>
									{inv.payment_status ||
										"Pending"}
								</span>
							</div>
						</div>
					),
				)
			)}
		</div>
	);
}
