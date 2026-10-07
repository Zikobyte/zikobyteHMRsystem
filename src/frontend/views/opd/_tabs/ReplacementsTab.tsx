/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3C extraction from OPDRegistrationView.tsx (SUBTAB 4: REPLACEMENTS).
 * Verbatim JSX: Card Replacement Log table. The role gate stays in the
 * SHELL (canManageCardReplacements check at the call site) — only log
 * data arrives here as props.
 */

import type { OpdReplacementRecord } from "../_hooks/useOpdReplacements";

export interface ReplacementsTabProps {
	replacements: OpdReplacementRecord[];
}

export default function ReplacementsTab({
	replacements,
}: ReplacementsTabProps) {
	return (
		<div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
			<div>
				<h2 className="text-base font-bold text-slate-900">
					Card Replacement & History Refresh Logs
				</h2>
				<p className="text-xs text-slate-500 font-medium">
					Audit records of reissued cards and automated clinical
					cleanup events
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
							<th className="p-3">Patient Name</th>
							<th className="p-3">Old Number</th>
							<th className="p-3">New Reissue</th>
							<th className="p-3">Approved By</th>
							<th className="p-3">Office Claimed</th>
							<th className="p-3">History Reset?</th>
							<th className="p-3">Reason</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-50">
						{replacements.length === 0 ? (
							<tr>
								<td
									colSpan={7}
									className="text-center p-8 text-xs text-slate-400 font-medium"
								>
									No card replacement records recorded yet.
								</td>
							</tr>
						) : (
							replacements.map((r) => (
								<tr
									key={r.id}
									className="text-xs hover:bg-slate-50/50 transition-colors"
								>
									<td className="p-3 font-bold text-slate-800">
										{r.patient_name}
									</td>
									<td className="p-3 font-mono text-slate-500">
										{r.old_card_number}
									</td>
									<td className="p-3 font-mono font-bold text-[#2A758C]">
										{r.new_card_number}
									</td>
									<td className="p-3 text-slate-600 font-medium">
										{r.approved_by}
									</td>
									<td className="p-3 text-slate-600 font-medium">
										{r.last_office_seen}
									</td>
									<td className="p-3">
										<span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded border border-emerald-100">
											{r.history_refreshed
												? "YES (RESET)"
												: "NO"}
										</span>
									</td>
									<td className="p-3 text-slate-500">
										{r.reason}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
