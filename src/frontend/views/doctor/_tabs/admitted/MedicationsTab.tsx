/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (admitted MEDICATIONS sub-tab).
 * Verbatim JSX — inpatient medications & administration logs with
 * administer/cancel actions. State and callbacks arrive as props.
 */

import { Check, Plus } from "lucide-react";
import type { AdmittedMedRecord, AdmittedPatient } from "../../_utils/doctor-types";
import { matchesDateFilter } from "../../_utils/doctor-format";

export interface MedicationsTabProps {
	patient: AdmittedPatient;
	dateFilter: string;
	onClearDateFilter: () => void;
	onAddLog: () => void;
	onAdminister: (med: AdmittedMedRecord) => void;
	onCancel: (medId: string) => void;
}

export default function MedicationsTab({
	patient: selectedAdmitted,
	dateFilter: recordDateFilter,
	onClearDateFilter,
	onAddLog,
	onAdminister,
	onCancel: handleCancelMedication,
}: MedicationsTabProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center mb-2">
				<h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
					Inpatient Medications & Administration
					Logs
				</h4>
				<button
					type="button"
					onClick={onAddLog}
					className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A758C] hover:bg-[#1f5869] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
				>
					<Plus className="h-3.5 w-3.5" />
					<span>Add Medication Log</span>
				</button>
			</div>

			{(() => {
				const filteredMeds = (
					selectedAdmitted.medicationsRecords || []
				).filter((rec) =>
					matchesDateFilter(
						rec.timestamp ?? '',
						recordDateFilter,
					),
				);

				if (
					selectedAdmitted.medicationsRecords
						?.length === 0
				) {
					return (
						<p className="text-xs text-slate-400 font-medium py-8 text-center">
							No medications logs recorded for
							this admission session.
						</p>
					);
				}

				if (filteredMeds.length === 0) {
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
								View all medication logs
							</button>
						</div>
					);
				}

				return (
					<div className="space-y-3">
						{filteredMeds.map(
							(rec, idx) => {
								const isPending =
									rec.status === "Pending";
								const isDispensed =
									rec.status === "Dispensed";
								const isAdministered =
									rec.status ===
									"Administered";
								const isCancelled =
									rec.status === "Cancelled";

								return (
									<div
										key={rec.id || idx}
										className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2"
									>
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
											<div>
												<div className="flex items-center gap-2">
													<p className="text-xs font-black text-slate-900 uppercase tracking-wide">
														{rec.name}
													</p>
													<span
														className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
															isAdministered
																? "bg-emerald-100 text-emerald-800"
																: isDispensed
																	? "bg-sky-100 text-sky-800"
																	: isCancelled
																		? "bg-rose-100 text-rose-800"
																		: "bg-amber-100 text-amber-800"
														}`}
													>
														{rec.status ||
															"Pending"}
													</span>
												</div>
												<p className="text-[11px] text-slate-500 font-mono mt-0.5">
													Dose:{" "}
													<strong className="text-slate-700">
														{rec.dose ||
															"—"}
													</strong>{" "}
													| Qty:{" "}
													{rec.quantity ||
														"1"}{" "}
													| Freq:{" "}
													{rec.frequency ||
														"OD"}
												</p>
											</div>

											<div className="flex items-center gap-2">
												{(isPending ||
													isDispensed) && (
													<button
														type="button"
														onClick={() => {
															onAdminister(
																rec,
															);
														}}
														className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 shadow-xs"
													>
														<Check className="h-3 w-3" />{" "}
														Administer
													</button>
												)}
												{isPending && (
													<button
														type="button"
														onClick={() =>
															handleCancelMedication(
																rec.id,
															)
														}
														className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer transition-all"
													>
														Cancel
													</button>
												)}
											</div>
										</div>

										<div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-400 gap-1 pt-1">
											<span>
												Ordered:{" "}
												{rec.timestamp} by{" "}
												<strong className="text-slate-600">
													{rec.orderedBy ||
														"Doctor"}
												</strong>
											</span>
											{rec.administeredAt && (
												<span className="text-emerald-700 font-semibold">
													Administered at{" "}
													{
														rec.administeredAt
													}{" "}
													by{" "}
													{rec.administeredBy ||
														"Nurse"}
												</span>
											)}
										</div>

										{rec.note && (
											<p className="text-xs text-slate-600 bg-white border border-slate-100 rounded-lg p-2 font-mono italic">
												"{rec.note}"
											</p>
										)}
									</div>
								);
							},
						)}
					</div>
				);
			})()}
		</div>
	);
}
