/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx (PAGE 1: REGISTERED PATIENTS).
 *
 * Patient directory table with search + status filter. Verbatim JSX.
 * The patient-card details modal (~59 lines) is inlined here per the
 * slice plan (modals under 60 lines stay in their tab); the register and
 * confirm modals live in _modals/.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EyeOff, Filter, Plus, Search, Users, X } from 'lucide-react';
import EyePaymentBadge from '../_components/EyePaymentBadge';
import type { EyePatient, EyeStatusFilter } from '../_utils/eye-types';

export interface RegisteredPatientsTabProps {
	allCount: number;
	filteredPatients: EyePatient[];
	registeredSearch: string;
	onRegisteredSearchChange: (value: string) => void;
	statusFilter: EyeStatusFilter;
	onStatusFilterChange: (value: EyeStatusFilter) => void;
	onOpenRegister: () => void;
	onSendToCashier: (patient: any) => void;
	onProceedToConsultation: (patient: any) => void;
}

export default function RegisteredPatientsTab({
	allCount,
	filteredPatients: registeredFilteredPatients,
	registeredSearch,
	onRegisteredSearchChange: setRegisteredSearch,
	statusFilter,
	onStatusFilterChange: setStatusFilter,
	onOpenRegister,
	onSendToCashier: setRegConfirmModalPatient,
	onProceedToConsultation
}: RegisteredPatientsTabProps) {
	const [selectedPatientForView, setSelectedPatientForView] = useState<any | null>(null);

	const proceedToConsultation = (p: any) => {
		onProceedToConsultation(p);
	};

	return (
		<div className="space-y-5">

			{/* Top Bar Header */}
			<div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
						<Users className="h-5 w-5 text-[#2A758C]" />
						Registered Eye Patients Directory
					</h1>
					<p className="text-xs text-slate-500 mt-0.5">
						Manage registered eye care cards, search records, and assign patients to consultation
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={onOpenRegister}
						className="px-4 py-2.5 bg-[#A3D1E0] hover:bg-[#8bc3d4] text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
					>
						<Plus className="h-4 w-4" />
						<span>Register Eye Patient</span>
					</button>
				</div>
			</div>

			{/* Patient Search & Filter Section */}
			<div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
					<input
						type="text"
						placeholder="Search by name, Hospital ID (EC-100...), phone number..."
						value={registeredSearch}
						onChange={e => setRegisteredSearch(e.target.value)}
						className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-2 focus:ring-[#A3D1E0] outline-none text-slate-900"
					/>
				</div>

				<div className="flex items-center gap-2">
					<Filter className="h-4 w-4 text-slate-400" />
					<span className="text-xs font-bold text-slate-600">Status:</span>
					<select
						value={statusFilter}
						onChange={(e: any) => setStatusFilter(e.target.value)}
						className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
					>
						<option value="all">All Patients ({allCount})</option>
						<option value="Paid">Paid</option>
						<option value="Partial">Partial</option>
						<option value="Unpaid">Unpaid</option>
						<option value="Awaiting Consult">Awaiting Consult</option>
						<option value="Consulted">Consulted</option>
					</select>
				</div>
			</div>

			{/* Patients Directory Table */}
			<div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
				<div className="p-4 border-b border-slate-100 flex justify-between items-center">
					<h3 className="text-sm font-bold text-slate-900">Patient Directory Table</h3>
					<span className="text-xs text-slate-500 font-mono">
						Showing {registeredFilteredPatients.length} of {allCount} entries
					</span>
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
							{registeredFilteredPatients.length === 0 ? (
								<tr>
									<td colSpan={9} className="text-center py-12 text-slate-400">
										<EyeOff className="h-8 w-8 text-slate-300 mx-auto mb-2" />
										<p className="text-xs font-semibold">No registered eye patients found matching your search criteria.</p>
									</td>
								</tr>
							) : (
								registeredFilteredPatients.map(p => {
									const cardNo = p.hospitalNumber || p.id;
									const patientName = p.name;
									const phone = p.phoneNumber;
									const dateVal = p.dateIssued || p.date || p.createdAt?.slice(0,10) || '2026-08-24';
									const complaintVal = p.chiefComplaint || 'Routine Eye Examination';
									const diagnosisVal = p.diagnosis || (p.status === 'Consulted' ? 'Presbyopia / Refractive Error' : 'Awaiting Examination');
									const totalBillVal = Number(p.totalBill ?? (p.balance ? p.balance + (p.paidAmount || 0) : 3000));
									const paidVal = Number(p.paidAmount ?? (p.paymentStatus === 'Paid' ? totalBillVal : 0));

									return (
										<tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
											<td className="py-3 px-3 font-mono font-bold text-[#2A758C]">{cardNo}</td>
											<td className="py-3 px-3">
												<div className="font-bold text-slate-900">{patientName}</div>
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
											<td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
												<button
													onClick={() => setSelectedPatientForView(p)}
													className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[10px] transition-all cursor-pointer"
												>
													Details
												</button>
												{p.status === 'Awaiting Cashier Verification' || p.paymentStatus === 'UNPAID' ? (
													<button
														onClick={() => setRegConfirmModalPatient(p)}
														className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[10px] transition-all cursor-pointer shadow-2xs"
													>
														Send to Cashier
													</button>
												) : (
													<button
														onClick={() => proceedToConsultation(p)}
														className="px-3 py-1 bg-[#A3D1E0] hover:bg-[#82bdcf] text-slate-950 font-bold rounded-lg text-[10px] transition-all cursor-pointer shadow-2xs"
													>
														Proceed for Consultation
													</button>
												)}
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* =========================================================
			    PATIENT CARD / DETAILS MODAL (inlined: <60 lines)
			   ========================================================= */}
			<AnimatePresence>
				{selectedPatientForView && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
						<motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-800 text-xs">
							<button
								onClick={() => setSelectedPatientForView(null)}
								className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
							>
								<X className="h-5 w-5" />
							</button>

							<div className="border-b border-slate-100 pb-3">
								<span className="text-[10px] font-mono text-[#2A758C] font-bold uppercase">{selectedPatientForView.hospitalNumber}</span>
								<h3 className="text-base font-bold text-slate-900">{selectedPatientForView.name}</h3>
								<p className="text-xs text-slate-500">Registered Ocular Health File</p>
							</div>

							<div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
								<div>
									<span className="text-[9px] font-bold text-slate-400 uppercase">Phone</span>
									<p className="font-semibold text-slate-800">{selectedPatientForView.phoneNumber}</p>
								</div>
								<div>
									<span className="text-[9px] font-bold text-slate-400 uppercase">DOB</span>
									<p className="font-semibold text-slate-800">{selectedPatientForView.dateOfBirth || 'N/A'}</p>
								</div>
								<div>
									<span className="text-[9px] font-bold text-slate-400 uppercase">Occupation</span>
									<p className="font-semibold text-slate-800">{selectedPatientForView.occupation || 'N/A'}</p>
								</div>
								<div>
									<span className="text-[9px] font-bold text-slate-400 uppercase">Address</span>
									<p className="font-semibold text-slate-800">{selectedPatientForView.address || 'N/A'}</p>
								</div>
							</div>

							<div>
								<span className="text-[9px] font-bold text-slate-400 uppercase">Chief Complaint</span>
								<p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
									{selectedPatientForView.chiefComplaint}
								</p>
							</div>

							<div className="flex justify-end gap-2 pt-2">
								<button
									onClick={() => {
										const pat = selectedPatientForView;
										setSelectedPatientForView(null);
										proceedToConsultation(pat);
									}}
									className="px-4 py-2 bg-[#A3D1E0] hover:bg-[#82bdcf] text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer"
								>
									Proceed to Consultation
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

		</div>
	);
}
