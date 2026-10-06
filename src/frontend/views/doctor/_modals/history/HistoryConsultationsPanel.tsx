/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (HistoryModal inner tab:
 * consultations). Verbatim JSX — renders from history data props only.
 */

import type { PatientHistoryData } from "../../_utils/doctor-types";

export interface HistoryPanelProps {
	data: PatientHistoryData;
}

export default function HistoryConsultationsPanel({ data }: HistoryPanelProps) {
	return (
		<div className="space-y-4">
			{data.consultations?.length === 0 ? (
				<p className="text-xs text-slate-400 text-center py-8">
					No prior consultation records
					recorded.
				</p>
			) : (
				data.consultations?.map(
					(c) => (
						<div
							key={c.id}
							className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5"
						>
							<div className="flex justify-between items-start">
								<div>
									<span className="text-xs font-black text-slate-900 block">
										{c.diagnosis ||
											"Clinical Consultation"}
									</span>
									<span className="text-[10px] text-slate-500 font-mono">
										Encounter:{" "}
										{c.encounter_id || "—"}{" "}
										• Doctor:{" "}
										<strong className="text-slate-700">
											{c.doctor_name ||
												c.doctor_id ||
												"Doctor"}
										</strong>
									</span>
								</div>
								<span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
									{c.created_at
										? new Date(
												c.created_at,
											).toLocaleString()
										: "—"}
								</span>
							</div>
							{c.chief_complaint && (
								<p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 font-mono">
									<strong className="text-slate-700">
										Complaint:
									</strong>{" "}
									{c.chief_complaint}
								</p>
							)}
							{c.clinical_notes && (
								<p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100 font-mono">
									<strong className="text-slate-700">
										Doctor Notes:
									</strong>{" "}
									{c.clinical_notes}
								</p>
							)}
						</div>
					),
				)
			)}
		</div>
	);
}
