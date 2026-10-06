/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (HistoryModal inner tab:
 * vitals logs). Verbatim JSX — renders from history data props only.
 */

import type { HistoryPanelProps } from "./HistoryConsultationsPanel";

export default function HistoryVitalsPanel({ data }: HistoryPanelProps) {
	return (
		<div className="space-y-3">
			{data.vitals?.length === 0 ? (
				<p className="text-xs text-slate-400 text-center py-8">
					No vitals logs recorded.
				</p>
			) : (
				data.vitals?.map(
					(v) => (
						<div
							key={v.id}
							className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80"
						>
							<div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-200/60 text-[11px] font-mono text-slate-500">
								<span>
									Recorded:{" "}
									<strong className="text-slate-700">
										{v.recorded_at
											? new Date(
													v.recorded_at,
												).toLocaleString()
											: "—"}
									</strong>
								</span>
								<span>
									By:{" "}
									<strong className="text-[#2A758C]">
										{v.nurse_name ||
											v.recorded_by ||
											"Nurse"}
									</strong>
								</span>
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 text-center">
								<div className="bg-white p-2 rounded-lg border border-slate-100">
									<span className="block text-[9px] text-slate-400 font-bold uppercase">
										BP
									</span>
									<span className="text-xs font-black text-slate-800">
										{v.blood_pressure ||
											"—"}
									</span>
								</div>
								<div className="bg-white p-2 rounded-lg border border-slate-100">
									<span className="block text-[9px] text-slate-400 font-bold uppercase">
										Pulse
									</span>
									<span className="text-xs font-black text-slate-800">
										{v.pulse_rate
											? `${v.pulse_rate} bpm`
											: "—"}
									</span>
								</div>
								<div className="bg-white p-2 rounded-lg border border-slate-100">
									<span className="block text-[9px] text-slate-400 font-bold uppercase">
										Temp
									</span>
									<span className="text-xs font-black text-slate-800">
										{v.temperature
											? `${v.temperature}°C`
											: "—"}
									</span>
								</div>
								<div className="bg-white p-2 rounded-lg border border-slate-100">
									<span className="block text-[9px] text-slate-400 font-bold uppercase">
										Weight
									</span>
									<span className="text-xs font-black text-slate-800">
										{v.weight
											? `${v.weight} kg`
											: "—"}
									</span>
								</div>
								<div className="bg-white p-2 rounded-lg border border-slate-100">
									<span className="block text-[9px] text-slate-400 font-bold uppercase">
										Height
									</span>
									<span className="text-xs font-black text-slate-800">
										{v.height
											? `${v.height} cm`
											: "—"}
									</span>
								</div>
								<div className="bg-white p-2 rounded-lg border border-slate-100">
									<span className="block text-[9px] text-slate-400 font-bold uppercase">
										Resp Rate
									</span>
									<span className="text-xs font-black text-slate-800">
										{v.respiratory_rate ||
											"—"}
									</span>
								</div>
								<div className="bg-white p-2 rounded-lg border border-slate-100">
									<span className="block text-[9px] text-slate-400 font-bold uppercase">
										SpO₂
									</span>
									<span className="text-xs font-black text-slate-800">
										{v.spo2
											? `${v.spo2}%`
											: "—"}
									</span>
								</div>
							</div>
						</div>
					),
				)
			)}
		</div>
	);
}
