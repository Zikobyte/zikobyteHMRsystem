/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (admitted VITALS sub-tab).
 * Verbatim JSX — date-filtered vitals logs history. State arrives as props.
 */

import type { AdmittedPatient } from "../../_utils/doctor-types";
import { matchesDateFilter } from "../../_utils/doctor-format";

export interface AdmittedSubTabProps {
	patient: AdmittedPatient;
	dateFilter: string;
	onClearDateFilter: () => void;
}

export default function VitalsTab({
	patient: selectedAdmitted,
	dateFilter: recordDateFilter,
	onClearDateFilter,
}: AdmittedSubTabProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center mb-2">
				<h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
					Vitals Logs History
				</h4>
				{recordDateFilter && (
					<span className="text-[10px] text-slate-400 font-mono">
						Showing entries matching date:{" "}
						{recordDateFilter}
					</span>
				)}
			</div>

			{(() => {
				const filteredVitals = (
					selectedAdmitted.vitalsRecords || []
				).filter((rec) =>
					matchesDateFilter(
						rec.timestamp ?? '',
						recordDateFilter,
					),
				);

				if (
					selectedAdmitted.vitalsRecords
						?.length === 0
				) {
					return (
						<p className="text-xs text-slate-400 font-medium py-8 text-center">
							No vitals logs recorded for this
							admission session.
						</p>
					);
				}

				if (filteredVitals.length === 0) {
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
								View all vitals logs
							</button>
						</div>
					);
				}

				return (
					<div className="space-y-4">
						{filteredVitals.map(
							(rec, idx) => (
								<div
									key={idx}
									className="bg-slate-50 rounded-xl p-4 border border-slate-150"
								>
									<div className="flex justify-between items-center pb-2.5 border-b border-slate-200/50 mb-3 text-[11px] font-mono text-slate-400">
										<span className="font-bold text-slate-700">
											{rec.timestamp}
										</span>
										<span>
											By:{" "}
											<span className="text-[#2A758C] font-bold">
												{rec.recordedBy}
											</span>
										</span>
									</div>
									<div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
										<div>
											<span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">
												BP
											</span>
											<span className="text-xs font-black text-slate-800">
												{rec.bp}
											</span>
										</div>
										<div>
											<span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">
												HR (Pulse)
											</span>
											<span className="text-xs font-black text-slate-800">
												{rec.hr}
											</span>
										</div>
										<div>
											<span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">
												Temp
											</span>
											<span className="text-xs font-black text-slate-800">
												{rec.temp}
											</span>
										</div>
										<div>
											<span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">
												RR
											</span>
											<span className="text-xs font-black text-slate-800">
												{rec.rr}
											</span>
										</div>
										<div>
											<span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">
												SpO₂
											</span>
											<span className="text-xs font-black text-slate-800">
												{rec.spo2}
											</span>
										</div>
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
