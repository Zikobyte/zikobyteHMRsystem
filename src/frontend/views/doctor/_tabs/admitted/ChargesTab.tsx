/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (admitted CHARGES sub-tab).
 * Verbatim JSX — financial summary cards + detailed invoice breakdown.
 * State arrives as props.
 */

import type { AdmittedPatient } from "../../_utils/doctor-types";
import { matchesDateFilter } from "../../_utils/doctor-format";
import type { AdmittedSubTabProps } from "./VitalsTab";

export default function ChargesTab({
	patient: selectedAdmitted,
	dateFilter: recordDateFilter,
	onClearDateFilter,
}: AdmittedSubTabProps) {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
				<div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
					<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
						Total Charged
					</span>
					<span className="text-lg font-black text-slate-800 font-mono">
						₦
						{Number(
							selectedAdmitted.totalCharged || 0,
						).toLocaleString()}
					</span>
				</div>
				<div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
					<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
						Payments Made
					</span>
					<span className="text-lg font-black text-emerald-700 font-mono">
						₦
						{Number(
							selectedAdmitted.paymentsMade || 0,
						).toLocaleString()}
					</span>
				</div>
				<div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
					<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
						Outstanding Balance
					</span>
					<span
						className={`text-lg font-black font-mono ${Number(selectedAdmitted.totalCharged || 0) - Number(selectedAdmitted.paymentsMade || 0) > 0 ? "text-rose-600" : "text-slate-700"}`}
					>
						₦
						{Math.max(
							0,
							Number(
								selectedAdmitted.totalCharged ||
									0,
							) -
								Number(
									selectedAdmitted.paymentsMade ||
										0,
								),
						).toLocaleString()}
					</span>
				</div>
				<div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
					<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
						Discharge Bill
					</span>
					<span className="text-lg font-black text-indigo-700 font-mono">
						₦
						{Number(
							selectedAdmitted.dischargeBill ||
								selectedAdmitted.totalCharged ||
								0,
						).toLocaleString()}
					</span>
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
						Detailed Invoice Breakdown
					</h5>
					{recordDateFilter && (
						<span className="text-[10px] text-slate-400 font-mono">
							Filtered for: {recordDateFilter}
						</span>
					)}
				</div>

				{(() => {
					const filteredCharges = (
						selectedAdmitted.chargesList || []
					).filter((charge) =>
						matchesDateFilter(
							charge.timestamp ?? '',
							recordDateFilter,
						),
					);

					if (
						selectedAdmitted.chargesList
							?.length === 0
					) {
						return (
							<div className="text-center p-8 border border-dashed border-slate-200 rounded-xl">
								<p className="text-xs text-slate-400 font-medium">
									No specific secondary charges
									recorded yet.
								</p>
								<p className="text-[10px] text-slate-400 mt-1">
									Core room fee applies at
									discharge.
								</p>
							</div>
						);
					}

					if (filteredCharges.length === 0) {
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
									View all charges
								</button>
							</div>
						);
					}

					return (
						<div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden">
							{filteredCharges.map(
								(charge, idx) => (
									<div
										key={idx}
										className="flex justify-between items-center p-3 bg-slate-50/50 text-xs"
									>
										<div>
											<p className="font-bold text-slate-800">
												{charge.item}
											</p>
											<p className="text-[10px] text-slate-400 font-mono mt-0.5">
												{charge.timestamp}
											</p>
										</div>
										<span className="font-bold text-slate-700 font-mono">
											₦
											{Number(
												charge.amount || 0,
											).toLocaleString()}
										</span>
									</div>
								),
							)}
						</div>
					);
				})()}
			</div>
		</div>
	);
}
