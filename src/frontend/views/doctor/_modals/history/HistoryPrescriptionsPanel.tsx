/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (HistoryModal inner tab:
 * prescriptions). Verbatim JSX — renders from history data props only.
 */

import type { HistoryPanelProps } from "./HistoryConsultationsPanel";

export default function HistoryPrescriptionsPanel({ data }: HistoryPanelProps) {
	return (
		<div className="space-y-3">
			{data.pharmacyOrders
				?.length === 0 ? (
				<p className="text-xs text-slate-400 text-center py-8">
					No pharmacy prescription records
					found.
				</p>
			) : (
				data.pharmacyOrders?.map(
					(po) => (
						<div
							key={po.id}
							className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2"
						>
							<div className="flex justify-between items-start">
								<div>
									<span className="text-xs font-extrabold text-slate-900 block">
										Order #{po.id}
									</span>
									<span className="text-[10px] text-slate-500 font-mono">
										Date:{" "}
										{po.created_at
											? new Date(
													po.created_at,
												).toLocaleString()
											: "—"}
									</span>
								</div>
								<span
									className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
										po.status ===
										"Dispensed"
											? "bg-emerald-100 text-emerald-800"
											: "bg-blue-100 text-blue-800"
									}`}
								>
									{po.status}
								</span>
							</div>
							{po.items &&
								Array.isArray(po.items) && (
									<div className="space-y-1.5">
										{po.items.map(
											(
												item,
												idx,
											) => (
												<div
													key={idx}
													className="bg-white p-2 rounded-lg border border-slate-100 text-xs flex justify-between"
												>
													<span className="font-bold text-slate-800">
														{item.name ||
															item.drug_name}
													</span>
													<span className="text-slate-500 font-mono">
														{item.dose ||
															item.dosage}{" "}
														•{" "}
														{
															item.frequency
														}{" "}
														•{" "}
														{
															item.duration
														}
													</span>
												</div>
											),
										)}
									</div>
								)}
						</div>
					),
				)
			)}
		</div>
	);
}
