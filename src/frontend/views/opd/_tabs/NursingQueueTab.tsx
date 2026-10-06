/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3C extraction from OPDRegistrationView.tsx (SUBTAB 2: NURSING).
 * Verbatim JSX: nursing triage queue table + vitals/escalate actions.
 * No behavior change — queue data and open-handlers arrive as props.
 */

import { Clock } from "lucide-react";
import { getAge } from "../_utils/opdDates";
import type { OpdQueueItem } from "../_hooks/useOpdQueue";

export interface NursingQueueTabProps {
	queueItems: OpdQueueItem[];
	onOpenVitals: (item: OpdQueueItem) => void;
	onOpenEscalate: (item: OpdQueueItem) => void;
}

export default function NursingQueueTab({
	queueItems,
	onOpenVitals,
	onOpenEscalate,
}: NursingQueueTabProps) {
	return (
		<div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
			<div>
				<h2 className="text-sm font-bold text-slate-900">
					Nursing Triage Active Queue
				</h2>
				<p className="text-[11px] text-slate-500 font-medium">
					Prioritized clinical queue of incoming patient encounters
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
							<th className="p-2.5">Priority</th>
							<th className="p-2.5">Hospital Number</th>
							<th className="p-2.5">Patient Name</th>
							<th className="p-2.5">Visit Type</th>
							<th className="p-2.5">Clinic Room</th>
							<th className="p-2.5">Queue Status</th>
							<th className="p-2.5 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-50">
						{queueItems.filter(
							(q) => q.queue_type === "Nursing Front-Desk",
						).length === 0 ? (
							<tr>
								<td
									colSpan={7}
									className="text-center p-8 text-xs text-slate-400 font-medium"
								>
									No patients currently waiting at the Nursing
									desk.
								</td>
							</tr>
						) : (
							queueItems
								.filter(
									(q) => q.queue_type === "Nursing Front-Desk",
								)
								.map((item) => {
									const age = getAge(item.date_of_birth);
									const isEmergency =
										item.priority === "Emergency";
									const isUrgent = item.priority === "Urgent";
									return (
										<tr
											key={item.id}
											className={`text-[11px] hover:bg-slate-50/50 transition-colors ${
												isEmergency
													? "bg-rose-50/30"
													: isUrgent
														? "bg-amber-50/20"
														: ""
											}`}
										>
											<td className="p-2.5">
												<span
													className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
														isEmergency
															? "bg-rose-100 text-rose-800 border border-rose-200 animate-pulse"
															: isUrgent
																? "bg-amber-100 text-amber-800 border border-amber-200"
																: "bg-slate-100 text-slate-700"
													}`}
												>
													{item.priority}
												</span>
											</td>
											<td className="p-2.5 font-mono font-bold text-[#2A758C]">
												{item.hospital_number}
											</td>
											<td className="p-2.5">
												<p className="font-bold text-slate-800">
													{item.patient_name}
												</p>
												<p className="text-[9px] text-slate-500 mt-0.5">
													{item.gender}, {age} Years
												</p>
											</td>
											<td className="p-2.5 text-slate-600 font-medium">
												{item.visit_type}
											</td>
											<td className="p-2.5 text-slate-600 font-medium">
												{item.destination_clinic}
											</td>
											<td className="p-2.5">
												<span className="flex items-center gap-1.5 text-slate-600">
													<Clock className="h-3 w-3 text-slate-400" />
													{item.status}
												</span>
											</td>
											<td className="p-2.5 text-right space-x-1.5">
												<button
													onClick={() =>
														onOpenVitals(item)
													}
													className="px-2.5 py-1.5 bg-[#A3D1E0] text-slate-900 font-bold rounded-lg text-[10px] transition-all hover:bg-[#82bdcf] cursor-pointer"
												>
													Take Vitals & Route
												</button>
												<button
													onClick={() =>
														onOpenEscalate(item)
													}
													className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-bold rounded-lg text-[10px] transition-all cursor-pointer"
												>
													Escalate Priority
												</button>
											</td>
										</tr>
									);
								})
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
