/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (admitted OBSERVATIONS sub-tab).
 * Verbatim JSX — clinical observations & ward round logs. State arrives
 * as props.
 */

import { Plus } from "lucide-react";
import type { AdmittedPatient } from "../../_utils/doctor-types";
import { matchesDateFilter } from "../../_utils/doctor-format";
import type { AdmittedSubTabProps } from "./VitalsTab";

export interface ObservationsTabProps extends AdmittedSubTabProps {
	onAdd: () => void;
}

export default function ObservationsTab({
	patient: selectedAdmitted,
	dateFilter: recordDateFilter,
	onClearDateFilter,
	onAdd,
}: ObservationsTabProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center mb-2">
				<h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
					Clinical Observations & Ward Round Logs
				</h4>
				<button
					type="button"
					onClick={onAdd}
					className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A758C] hover:bg-[#1f5869] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
				>
					<Plus className="h-3.5 w-3.5" />
					<span>Add Observation</span>
				</button>
			</div>

			{(() => {
				const filteredObs = (
					selectedAdmitted.observationsRecords ||
					[]
				).filter((rec) =>
					matchesDateFilter(
						rec.timestamp ?? '',
						recordDateFilter,
					),
				);

				if (
					selectedAdmitted.observationsRecords
						?.length === 0
				) {
					return (
						<p className="text-xs text-slate-400 font-medium py-8 text-center">
							No clinical observation logs
							recorded for this admission
							session.
						</p>
					);
				}

				if (filteredObs.length === 0) {
					return (
						<div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
							<p className="text-xs text-slate-500 font-bold">
								No records found for the
								selected date.
							</p>
							<button
								onClick={onClearDateFilter}
								className="mt-2 text-xs text-[#2A758C] font-bold hover:underline cursor-pointer"
							>
								View all observations
							</button>
						</div>
					);
				}

				return (
					<div className="space-y-3">
						{filteredObs.map(
							(rec, idx) => (
								<div
									key={rec.id || idx}
									className="bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-2"
								>
									<div className="flex justify-between items-center border-b border-slate-200/50 pb-2 text-[11px] font-mono text-slate-400">
										<span className="font-bold text-[#2A758C] uppercase bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
											{rec.category ||
												"Clinical Note"}
										</span>
										<span>
											{rec.timestamp}
										</span>
									</div>
									<p className="text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
										{rec.note}
									</p>
									<div className="text-[10px] text-right font-mono text-slate-400">
										Recorded by:{" "}
										<span className="font-bold text-slate-700">
											{rec.recordedBy}
										</span>
									</div>
								</div>
							),
						)}
					</div>
				);
			})()}
		</div>
	);
}
