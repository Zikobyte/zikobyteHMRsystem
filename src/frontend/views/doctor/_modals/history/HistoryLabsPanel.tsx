/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (HistoryModal inner tab:
 * laboratory orders). Verbatim JSX — renders from history data props only.
 */

import type { HistoryPanelProps } from "./HistoryConsultationsPanel";

export default function HistoryLabsPanel({ data }: HistoryPanelProps) {
	return (
		<div className="space-y-3">
			{data.labOrders?.length ===
			0 ? (
				<p className="text-xs text-slate-400 text-center py-8">
					No laboratory orders or results found.
				</p>
			) : (
				data.labOrders?.map(
					(lo) => (
						<div
							key={lo.id}
							className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2"
						>
							<div className="flex justify-between items-start">
								<div>
									<span className="text-xs font-extrabold text-slate-900 block">
										[{lo.category || "LAB"}
										] {lo.test_name}
									</span>
									<span className="text-[10px] text-slate-500 font-mono">
										Order ID: {lo.id} •
										Status:{" "}
										<strong className="text-slate-700">
											{lo.status}
										</strong>
									</span>
								</div>
								<span
									className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
										lo.status ===
										"Completed"
											? "bg-emerald-100 text-emerald-800"
											: "bg-amber-100 text-amber-800"
									}`}
								>
									{lo.status}
								</span>
							</div>
							{lo.result_value && (
								<div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs font-mono">
									<span className="text-slate-500 font-bold">
										Result:{" "}
									</span>
									<strong className="text-emerald-700">
										{lo.result_value}
									</strong>
									{lo.reference_range && (
										<span className="text-slate-400 ml-2">
											(Ref:{" "}
											{lo.reference_range}
											)
										</span>
									)}
								</div>
							)}
							{lo.technician_notes && (
								<p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100 font-mono italic">
									"{lo.technician_notes}"
								</p>
							)}
						</div>
					),
				)
			)}
		</div>
	);
}
