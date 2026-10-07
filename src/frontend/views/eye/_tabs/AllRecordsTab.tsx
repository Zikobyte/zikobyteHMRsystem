/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx (PAGE 3: ALL RECORDS).
 *
 * Completed encounter logs table with search. Verbatim JSX — the
 * print/view modal lives in _modals/ and mounts from the shell.
 */

import { ClipboardList, EyeOff, Search } from 'lucide-react';
import EyePaymentBadge from '../_components/EyePaymentBadge';
import type { EyeConsultationRecord } from '../_utils/eye-types';

export interface AllRecordsTabProps {
	records: EyeConsultationRecord[];
	recordsSearch: string;
	onRecordsSearchChange: (value: string) => void;
	onViewRecord: (record: any) => void;
}

export default function AllRecordsTab({
	records: recordsToDisplay,
	recordsSearch,
	onRecordsSearchChange: setRecordsSearch,
	onViewRecord: setSelectedRecordToView
}: AllRecordsTabProps) {
	return (
		<div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-4">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
				<div>
					<h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
						<ClipboardList className="h-5 w-5 text-[#2A758C]" />
						All Eye Clinic Records & Encounters
					</h1>
					<p className="text-xs text-slate-500">View, search, and print completed clinical history files & spectacle cards</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="relative min-w-[240px]">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
						<input
							type="text"
							placeholder="Search records by card #, name, diagnosis..."
							value={recordsSearch}
							onChange={e => setRecordsSearch(e.target.value)}
							className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-[#A3D1E0] outline-none text-slate-900"
						/>
					</div>
					<div className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-mono font-bold text-slate-700 whitespace-nowrap">
						Total Logs: {recordsToDisplay.length}
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse text-xs">
					<thead>
						<tr className="border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase bg-slate-50/80">
							<th className="py-3 px-3">Card number</th>
							<th className="py-3 px-3">Patient</th>
							<th className="py-3 px-3">Date</th>
							<th className="py-3 px-3">Chief complaint</th>
							<th className="py-3 px-3">Diagnosis</th>
							<th className="py-3 px-3">Total bill</th>
							<th className="py-3 px-3">Paid</th>
							<th className="py-3 px-3">Status</th>
							<th className="py-3 px-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-50">
						{recordsToDisplay.length === 0 ? (
							<tr>
								<td colSpan={9} className="text-center py-12 text-slate-400 text-[11px]">
									<EyeOff className="h-8 w-8 text-slate-300 mx-auto mb-2" />
									No completed consultation logs recorded yet matching your search criteria.
								</td>
							</tr>
						) : (
							recordsToDisplay.map(r => {
								const cardNo = r.hospitalNumber || r.patientId || 'EC-100000';
								const name = r.patientName || r.name || 'Patient';
								const phone = r.phoneNumber || '';
								const dateVal = r.date || r.createdAt?.slice(0,10) || '2026-08-24';
								const complaintVal = r.chiefComplaint || 'Ocular Check';
								const diagnosisVal = r.diagnosis || 'Clinical Assessment';
								const totalBillVal = Number(r.totalBill ?? 15000);
								const paidVal = Number(r.totalPaid ?? (r.paidAmount ?? (r.paymentStatus === 'Paid' ? totalBillVal : 0)));

								return (
									<tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
										<td className="py-3 px-3 font-mono font-bold text-[#2A758C]">{cardNo}</td>
										<td className="py-3 px-3">
											<div className="font-bold text-slate-900">{name}</div>
											{phone && <div className="text-[10px] text-slate-400 font-mono">{phone}</div>}
										</td>
										<td className="py-3 px-3 font-mono text-slate-600 text-[11px]">{dateVal}</td>
										<td className="py-3 px-3 text-slate-600 max-w-[150px] truncate" title={complaintVal}>
											{complaintVal}
										</td>
										<td className="py-3 px-3 text-slate-700 font-medium max-w-[170px] truncate" title={diagnosisVal}>
											{diagnosisVal}
										</td>
										<td className="py-3 px-3 font-mono font-bold text-slate-900">
											₦{totalBillVal.toLocaleString()}
										</td>
										<td className="py-3 px-3 font-mono font-bold text-emerald-700">
											₦{paidVal.toLocaleString()}
										</td>
										<td className="py-3 px-3">
											<EyePaymentBadge totalBill={totalBillVal} paid={paidVal} />
										</td>
										<td className="py-3 px-3 text-right whitespace-nowrap">
											<button
												onClick={() => setSelectedRecordToView(r)}
												className="px-2.5 py-1 bg-[#A3D1E0]/20 hover:bg-[#A3D1E0]/30 text-[#2a758c] font-bold rounded-lg text-[10px] transition-all cursor-pointer"
											>
												Print / View Card
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
