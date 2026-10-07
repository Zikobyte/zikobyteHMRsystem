/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx (PAGE 2: CONSULTATION).
 *
 * Clinical queue list + consultation workspace (chief complaint/history,
 * examinations/diagnosis, bill-services catalog, payment recorder, save).
 * Verbatim JSX — workspace state and handlers arrive via the consultation
 * hook result prop (OutpatientsTab precedent).
 */

import { Activity, CheckCircle2, CreditCard, FileText, Search, Sliders } from 'lucide-react';
import EyePaymentBadge from '../_components/EyePaymentBadge';
import type { UseEyeConsultationResult } from '../_hooks/useEyeConsultation';
import { ACCESSORIES, EYE_TESTS, FRAMES, LENSES, PROCEDURES } from '../_utils/eye-catalog';
import type { EyePatient } from '../_utils/eye-types';

export interface ConsultationTabProps {
	queue: EyePatient[];
	queueSearch: string;
	onQueueSearchChange: (value: string) => void;
	consultation: UseEyeConsultationResult;
}

export default function ConsultationTab({
	queue: filteredQueue,
	queueSearch,
	onQueueSearchChange: setQueueSearch,
	consultation
}: ConsultationTabProps) {
	const {
		selectedPatient,
		setSelectedPatient,
		selectPatientForConsult,
		handleServiceToggle,
		getSelectedServicesTotal,
		handleRecordPayment,
		handleSaveConsultation
	} = consultation;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">

			{/* Waiting Queue List Panel */}
			<div className="lg:col-span-1 bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-4 max-h-[85vh] overflow-y-auto">
				<div className="flex justify-between items-center">
					<div>
						<h3 className="text-xs font-bold text-slate-900">Clinical Queue</h3>
						<p className="text-[10px] text-slate-500">Waiting & Consulted list</p>
					</div>
					<span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold font-mono">
						{filteredQueue.length} total
					</span>
				</div>

				<div className="relative">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
					<input
						type="text"
						placeholder="Search name/ID..."
						value={queueSearch}
						onChange={e => setQueueSearch(e.target.value)}
						className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 pl-8 pr-3 text-[11px] text-slate-900"
					/>
				</div>

				<div className="space-y-1.5">
					{filteredQueue.map(p => {
						const isSelected = selectedPatient?.id === p.id;
						const isAwaiting = p.status === 'Awaiting Consult';
						const totalB = Number(p.totalBill ?? (p.balance ? p.balance + (p.paidAmount || 0) : 3000));
						const paidB = Number(p.paidAmount ?? (p.paymentStatus === 'Paid' ? totalB : 0));

						return (
							<button
								key={p.id}
								onClick={() => selectPatientForConsult(p)}
								className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start ${
									isSelected
										? 'border-[#2A758C] bg-[#A3D1E0]/10 shadow-2xs'
										: 'border-slate-100 hover:bg-slate-50'
								}`}
							>
								<div className="space-y-1">
									<div className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
										{p.name}
										{isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#2A758C]" />}
									</div>
									<div className="text-[9px] text-slate-400 font-mono">ID: {p.hospitalNumber}</div>

									<div className="flex flex-wrap gap-1 mt-1">
										<span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
											isAwaiting ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-800'
										}`}>
											{p.status}
										</span>
										<EyePaymentBadge totalBill={totalB} paid={paidB} />
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Consultation Active Workspace */}
			<div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
				{selectedPatient ? (
					<form onSubmit={handleSaveConsultation} className="space-y-6 text-slate-700 text-xs">

						{/* Workspace Header Card */}
						<div className="border border-slate-200 bg-slate-50/70 p-4 rounded-xl space-y-2">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
								<div>
									<div className="flex items-center gap-2">
										<h2 className="text-base font-extrabold text-slate-900">{selectedPatient.name}</h2>
										<span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
											selectedPatient.status === 'Awaiting Consult'
												? 'bg-amber-100 text-amber-800 border border-amber-300'
												: 'bg-emerald-100 text-emerald-800 border border-emerald-300'
										}`}>
											{selectedPatient.status}
										</span>
										<EyePaymentBadge
											totalBill={getSelectedServicesTotal() || selectedPatient.totalBill || 3000}
											paid={(selectedPatient.recordedPaymentsHistory?.reduce((acc: number, item: any) => acc + item.amount, 0) ?? 0) + (selectedPatient.paidAmount || (selectedPatient.paymentStatus === 'Paid' ? (selectedPatient.totalBill || 3000) : 0))}
										/>
									</div>
									<p className="text-[11px] text-slate-600 font-mono mt-0.5">
										Card ID: <strong className="text-[#2A758C]">{selectedPatient.hospitalNumber}</strong> | Phone: <strong className="text-slate-800">{selectedPatient.phoneNumber}</strong>
									</p>
								</div>

								<div className="text-right text-[11px] text-slate-600">
									<div>Date: <strong className="font-mono text-slate-800">{selectedPatient.dateIssued || selectedPatient.date || new Date().toISOString().split('T')[0]}</strong></div>
									<div>Occupation: <strong className="text-slate-800 capitalize">{selectedPatient.occupation || 'N/A'}</strong></div>
								</div>
							</div>

							{/* Section Switcher Tabs */}
							<div className="flex gap-1.5 pt-1 overflow-x-auto">
								{[
									{ id: 'all', label: 'Full Encounter File' },
									{ id: 'clinical', label: 'Chief Complaint & History' },
									{ id: 'exams', label: 'Examinations & Diagnosis' },
									{ id: 'billing', label: 'Bill Services & Payment' }
								].map((tab) => (
									<button
										key={tab.id}
										type="button"
										onClick={() => setSelectedPatient({ ...selectedPatient, subTab: tab.id })}
										className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
											(selectedPatient.subTab || 'all') === tab.id
												? 'bg-[#2A758C] text-white shadow-2xs'
												: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
										}`}
									>
										{tab.label}
									</button>
								))}
							</div>
						</div>

						{/* SECTION 1: CHIEF COMPLAINT & HISTORY */}
						{((selectedPatient.subTab || 'all') === 'all' || selectedPatient.subTab === 'clinical') && (
							<div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
								<h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#2A758C] flex items-center gap-1.5">
									<FileText className="h-4 w-4" /> Chief Complaint & History
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Chief Complaint *</label>
										<input
											type="text"
											value={selectedPatient.chiefComplaint ?? ''}
											onChange={e => setSelectedPatient({ ...selectedPatient, chiefComplaint: e.target.value })}
											placeholder="e.g. Blurred vision, eye pain, redness..."
											className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-900"
										/>
									</div>

									<div>
										<label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Occupation / Job</label>
										<input
											type="text"
											value={selectedPatient.occupation ?? ''}
											onChange={e => setSelectedPatient({ ...selectedPatient, occupation: e.target.value })}
											placeholder="e.g. Engineer, Student, Teacher..."
											className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900"
										/>
									</div>
								</div>

								<div>
									<label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Patient History Questionnaire / Notes</label>
									<textarea
										rows={2}
										value={selectedPatient.history ?? ''}
										onChange={e => setSelectedPatient({ ...selectedPatient, history: e.target.value })}
										placeholder="Previous eye conditions, glasses, surgeries, systemic diseases (DM, HTN), medications..."
										className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
									/>
								</div>
							</div>
						)}

						{/* SECTION 2: EXAMINATIONS, DIAGNOSIS & TREATMENT PLAN */}
						{((selectedPatient.subTab || 'all') === 'all' || selectedPatient.subTab === 'exams') && (
							<div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
								<h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#2A758C] flex items-center gap-1.5">
									<Activity className="h-4 w-4" /> Clinical Examinations & Treatment Plan
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Routine Examination</label>
										<textarea
											rows={2}
											value={selectedPatient.routineExam ?? ''}
											onChange={e => setSelectedPatient({ ...selectedPatient, routineExam: e.target.value })}
											placeholder="VA OD/OS, refraction, cover test, pupils, motility..."
											className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
										/>
									</div>

									<div>
										<label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">External Examination</label>
										<textarea
											rows={2}
											value={selectedPatient.externalExam ?? ''}
											onChange={e => setSelectedPatient({ ...selectedPatient, externalExam: e.target.value })}
											placeholder="Lids, lashes, conjunctiva, cornea, lens, fundus..."
											className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Clinical Diagnosis *</label>
										<input
											type="text"
											required
											value={selectedPatient.diagnosis ?? ''}
											onChange={e => setSelectedPatient({ ...selectedPatient, diagnosis: e.target.value })}
											placeholder="e.g. Presbyopia, Allergic Conjunctivitis, Myopia..."
											className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-900"
										/>
									</div>

									<div>
										<label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Treatment Plan</label>
										<textarea
											rows={2}
											value={selectedPatient.treatmentPlan ?? ''}
											onChange={e => setSelectedPatient({ ...selectedPatient, treatmentPlan: e.target.value })}
											placeholder="Glasses prescription, medication, follow-up..."
											className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
										/>
									</div>
								</div>
							</div>
						)}

						{/* SECTION 3: BILL SERVICES (5 CATEGORIES) */}
						{((selectedPatient.subTab || 'all') === 'all' || selectedPatient.subTab === 'billing') && (
							<div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
								<div className="flex justify-between items-center border-b border-slate-100 pb-2">
									<div>
										<h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#2A758C] flex items-center gap-1.5">
											<CreditCard className="h-4 w-4" /> Bill Services & Optical Store Catalog
										</h3>
										<p className="text-[10px] text-slate-500">Select required eye tests, procedures, frames, lenses, and accessories</p>
									</div>
									<span className="text-xs font-bold font-mono text-[#2A758C] bg-[#A3D1E0]/20 px-2.5 py-1 rounded-lg">
										Items Total: ₦{(selectedPatient.selectedServices?.reduce((acc: number, s: any) => acc + s.price, 0) || 0).toLocaleString()}
									</span>
								</div>

								{/* 1. Eye Tests */}
								<div className="space-y-1.5 border border-slate-100 p-3 rounded-xl bg-slate-50/50">
									<h4 className="text-[10px] font-extrabold text-[#2A758C] uppercase tracking-wider">Eye Tests</h4>
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
										{EYE_TESTS.map((item) => {
											const isSel = selectedPatient.selectedServices?.some((s: any) => s.name === item.name);
											return (
												<button
													key={item.name}
													type="button"
													onClick={() => handleServiceToggle(item, 'Eye Tests')}
													className={`flex justify-between items-center p-2 rounded-lg text-[11px] border transition-all cursor-pointer ${
														isSel ? 'bg-[#2A758C] text-white border-[#2A758C] font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
													}`}
												>
													<span>{item.name}</span>
													<span className="font-mono text-[10px]">₦{item.price.toLocaleString()}</span>
												</button>
											);
										})}
									</div>
								</div>

								{/* 2. Procedures */}
								<div className="space-y-1.5 border border-slate-100 p-3 rounded-xl bg-slate-50/50">
									<h4 className="text-[10px] font-extrabold text-[#2A758C] uppercase tracking-wider">Procedures</h4>
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
										{PROCEDURES.map((item) => {
											const isSel = selectedPatient.selectedServices?.some((s: any) => s.name === item.name);
											return (
												<button
													key={item.name}
													type="button"
													onClick={() => handleServiceToggle(item, 'Procedures')}
													className={`flex justify-between items-center p-2 rounded-lg text-[11px] border transition-all cursor-pointer ${
														isSel ? 'bg-[#2A758C] text-white border-[#2A758C] font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
													}`}
												>
													<span>{item.name}</span>
													<span className="font-mono text-[10px]">₦{item.price.toLocaleString()}</span>
												</button>
											);
										})}
									</div>
								</div>

								{/* 3. Frames */}
								<div className="space-y-1.5 border border-slate-100 p-3 rounded-xl bg-slate-50/50">
									<h4 className="text-[10px] font-extrabold text-[#2A758C] uppercase tracking-wider">Frames</h4>
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
										{FRAMES.map((item) => {
											const isSel = selectedPatient.selectedServices?.some((s: any) => s.name === item.name);
											return (
												<button
													key={item.name}
													type="button"
													onClick={() => handleServiceToggle(item, 'Frames')}
													className={`flex justify-between items-center p-2 rounded-lg text-[11px] border transition-all cursor-pointer ${
														isSel ? 'bg-[#2A758C] text-white border-[#2A758C] font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
													}`}
												>
													<span>{item.name}</span>
													<span className="font-mono text-[10px]">₦{item.price.toLocaleString()}</span>
												</button>
											);
										})}
									</div>
								</div>

								{/* 4. Lenses */}
								<div className="space-y-1.5 border border-slate-100 p-3 rounded-xl bg-slate-50/50">
									<h4 className="text-[10px] font-extrabold text-[#2A758C] uppercase tracking-wider">Lenses</h4>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
										{LENSES.map((item) => {
											const isSel = selectedPatient.selectedServices?.some((s: any) => s.name === item.name);
											return (
												<button
													key={item.name}
													type="button"
													onClick={() => handleServiceToggle(item, 'Lenses')}
													className={`flex justify-between items-center p-2 rounded-lg text-[11px] border transition-all cursor-pointer ${
														isSel ? 'bg-[#2A758C] text-white border-[#2A758C] font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
													}`}
												>
													<span>{item.name}</span>
													<span className="font-mono text-[10px]">₦{item.price.toLocaleString()}</span>
												</button>
											);
										})}
									</div>
								</div>

								{/* 5. Accessories */}
								<div className="space-y-1.5 border border-slate-100 p-3 rounded-xl bg-slate-50/50">
									<h4 className="text-[10px] font-extrabold text-[#2A758C] uppercase tracking-wider">Accessories</h4>
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
										{ACCESSORIES.map((item) => {
											const isSel = selectedPatient.selectedServices?.some((s: any) => s.name === item.name);
											return (
												<button
													key={item.name}
													type="button"
													onClick={() => handleServiceToggle(item, 'Accessories')}
													className={`flex justify-between items-center p-2 rounded-lg text-[11px] border transition-all cursor-pointer ${
														isSel ? 'bg-[#2A758C] text-white border-[#2A758C] font-bold shadow-2xs' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
													}`}
												>
													<span>{item.name}</span>
													<span className="font-mono text-[10px]">₦{item.price.toLocaleString()}</span>
												</button>
											);
										})}
									</div>
								</div>
							</div>
						)}

						{/* SECTION 4: PAYMENT STATUS & RECORD PAYMENT */}
						<div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 shadow-md">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
								<div>
									<div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Payment Status</div>
									<div className="flex items-center gap-2 mt-0.5">
										<span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
											selectedPatient.paymentStatus === 'Paid'
												? 'bg-emerald-500 text-white'
												: selectedPatient.paymentStatus === 'Part Paid'
												? 'bg-orange-500 text-white'
												: 'bg-rose-500 text-white'
										}`}>
											{selectedPatient.paymentStatus || 'UNPAID'}
										</span>
										<span className="text-xs text-slate-300 font-mono">
											Outstanding Balance: ₦{(typeof selectedPatient.balance === 'number' ? selectedPatient.balance : 3000).toLocaleString()}
										</span>
									</div>
								</div>

								<div className="text-right">
									<div className="text-[10px] text-slate-400 font-mono uppercase">Total Bill Services</div>
									<div className="text-lg font-black font-mono text-[#A3D1E0]">
										₦{getSelectedServicesTotal().toLocaleString()}
									</div>
								</div>
							</div>

							<div className="flex gap-2">
								<input
									type="number"
									placeholder="Amount to record (e.g. 3000)..."
									id="custom-payment-input"
									className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-xs font-mono flex-1 focus:outline-none focus:border-[#A3D1E0]"
								/>
								<button
									type="button"
									onClick={() => {
										const el = document.getElementById('custom-payment-input') as HTMLInputElement;
										if (el && el.value) {
											handleRecordPayment(el.value);
											el.value = '';
										}
									}}
									className="px-4 py-2 bg-[#A3D1E0] text-slate-950 font-bold rounded-lg text-xs hover:bg-[#82bdcf] cursor-pointer transition-all"
								>
									Record Payment
								</button>
							</div>
						</div>

						{/* Primary Action Button */}
						<div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200">
							<span className="text-[11px] text-slate-500 font-mono">
								Encounter Status: <strong className="text-slate-800">{selectedPatient.status}</strong>
							</span>

							<button
								type="submit"
								className="px-6 py-3 bg-[#2A758C] hover:bg-[#205d70] text-white font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs shadow-md transition-all"
							>
								<CheckCircle2 className="h-4 w-4 text-[#A3D1E0]" />
								<span>Save Consultation & Generate Bill</span>
							</button>
						</div>

					</form>
				) : (
					<div className="flex flex-col items-center justify-center py-24 text-slate-400">
						<Sliders className="h-11 w-11 text-slate-200 mb-3" />
						<p className="text-xs font-semibold">Please select a patient file from the left Clinical Queue panel</p>
					</div>
				)}
			</div>

		</div>
	);
}
