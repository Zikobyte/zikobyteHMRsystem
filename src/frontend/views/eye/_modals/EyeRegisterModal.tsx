/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx (REGISTER NEW EYE PATIENT
 * MODAL). Verbatim JSX — form state and handlers arrive via the
 * registration hook result prop; only the open flag is lifted to the
 * shell. New-patient form and returning-card retrieval both preserved.
 */

import { motion, AnimatePresence } from 'motion/react';
import { UserCheck, X } from 'lucide-react';
import type { UseEyeRegistrationResult } from '../_hooks/useEyeRegistration';

export interface EyeRegisterModalProps {
	open: boolean;
	registration: UseEyeRegistrationResult;
	onClose: () => void;
}

export default function EyeRegisterModal({ open, registration, onClose }: EyeRegisterModalProps) {
	const {
		regName,
		setRegName,
		regPhone,
		setRegPhone,
		regDOB,
		setRegDOB,
		regOccupation,
		setRegOccupation,
		regAddress,
		setRegAddress,
		regNextOfKin,
		setRegNextOfKin,
		regComplaint,
		setRegComplaint,
		regHistory,
		setRegHistory,
		regErrors,
		setRegErrors,
		isSubmittingReg,
		cardType,
		setCardType,
		cardCategoryType,
		setCardCategoryType,
		searchQuery,
		setSearchQuery,
		handleRegister,
		handleSearchReturning
	} = registration;

	return (
		<AnimatePresence>
			{open && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
					<motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative text-slate-800 text-xs">

						<button
							onClick={onClose}
							className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
						>
							<X className="h-5 w-5" />
						</button>

						<div>
							<h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
								<UserCheck className="h-5 w-5 text-[#2A758C]" />
								Register Eye Patient
							</h3>
							<p className="text-[11px] text-slate-500">Create new ocular patient file or retrieve returning card</p>
						</div>

						{/* Card Mode Tabs */}
						<div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
							<button
								type="button"
								onClick={() => setCardType('new')}
								className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
									cardType === 'new' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
								}`}
							>
								New Patient (₦3,000 Card)
							</button>
							<button
								type="button"
								onClick={() => setCardType('returning')}
								className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
									cardType === 'returning' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
								}`}
							>
								Retrieve Returning Card
							</button>
						</div>

						{cardType === 'new' ? (
							<form onSubmit={handleRegister} className="space-y-3">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="block text-[10px] font-bold text-slate-600 mb-1">Full Name *</label>
										<input
											type="text"
											value={regName}
											onChange={e => {
												setRegName(e.target.value);
												if (regErrors.name) setRegErrors({ ...regErrors, name: '' });
											}}
											placeholder="e.g. Chioma Okafor"
											className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 ${
												regErrors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
											}`}
										/>
										{regErrors.name && <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.name}</p>}
									</div>

									<div>
										<label className="block text-[10px] font-bold text-slate-600 mb-1">Phone Number *</label>
										<input
											type="text"
											value={regPhone}
											onChange={e => {
												setRegPhone(e.target.value);
												if (regErrors.phone) setRegErrors({ ...regErrors, phone: '' });
											}}
											placeholder="08031000001"
											className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 ${
												regErrors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
											}`}
										/>
										{regErrors.phone && <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.phone}</p>}
									</div>

									<div>
										<label className="block text-[10px] font-bold text-slate-600 mb-1">Date of Birth *</label>
										<input
											type="date"
											value={regDOB}
											onChange={e => {
												setRegDOB(e.target.value);
												if (regErrors.dob) setRegErrors({ ...regErrors, dob: '' });
											}}
											className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 ${
												regErrors.dob ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
											}`}
										/>
										{regErrors.dob && <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.dob}</p>}
									</div>

									<div>
										<label className="block text-[10px] font-bold text-slate-600 mb-1">Occupation</label>
										<input
											type="text"
											value={regOccupation}
											onChange={e => setRegOccupation(e.target.value)}
											placeholder="Teacher, Engineer..."
											className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
										/>
									</div>

									<div>
										<label className="block text-[10px] font-bold text-slate-600 mb-1">
											Card Category Type <span className="text-rose-500">*</span>
										</label>
										<select
											value={cardCategoryType}
											onChange={e => setCardCategoryType(e.target.value)}
											className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-[#2A758C]"
										>
											<option value="Eye Clinic">Eye Clinic Card (₦3,000)</option>
											<option value="Standard">Standard Card (₦3,000)</option>
											<option value="Maternity">Maternity Card (₦5,000)</option>
											<option value="Emergency">Emergency Card</option>
										</select>
									</div>

									<div className="md:col-span-2">
										<label className="block text-[10px] font-bold text-slate-600 mb-1">Next of Kin *</label>
										<input
											type="text"
											value={regNextOfKin}
											onChange={e => {
												setRegNextOfKin(e.target.value);
												if (regErrors.nextOfKin) setRegErrors({ ...regErrors, nextOfKin: '' });
											}}
											placeholder="e.g. Spouse / Sibling name and relationship"
											className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 ${
												regErrors.nextOfKin ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
											}`}
										/>
										{regErrors.nextOfKin && <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.nextOfKin}</p>}
									</div>

									<div className="md:col-span-2">
										<label className="block text-[10px] font-bold text-slate-600 mb-1">Residential Address *</label>
										<input
											type="text"
											value={regAddress}
											onChange={e => {
												setRegAddress(e.target.value);
												if (regErrors.address) setRegErrors({ ...regErrors, address: '' });
											}}
											placeholder="Residential address (Street, City)"
											className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 ${
												regErrors.address ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
											}`}
										/>
										{regErrors.address && <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.address}</p>}
									</div>

									<div className="md:col-span-2">
										<label className="block text-[10px] font-bold text-slate-600 mb-1">Chief Complaint *</label>
										<input
											type="text"
											value={regComplaint}
											onChange={e => {
												setRegComplaint(e.target.value);
												if (regErrors.complaint) setRegErrors({ ...regErrors, complaint: '' });
											}}
											placeholder="e.g. Blurred vision, eye pain, redness, irritation..."
											className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 ${
												regErrors.complaint ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
											}`}
										/>
										{regErrors.complaint && <p className="text-[10px] text-rose-600 font-bold mt-0.5">{regErrors.complaint}</p>}
									</div>

									<div className="md:col-span-2">
										<label className="block text-[10px] font-bold text-slate-600 mb-1">Patient History Questionnaire</label>
										<textarea
											rows={2}
											value={regHistory}
											onChange={e => setRegHistory(e.target.value)}
											placeholder="Previous eye conditions, glasses, surgeries, systemic diseases (DM, HTN), medications..."
											className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
										/>
									</div>
								</div>

								<div className="flex justify-end pt-3">
									<button
										type="submit"
										disabled={isSubmittingReg}
										className="px-5 py-2.5 bg-[#2A758C] hover:bg-[#1f5869] disabled:opacity-50 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-2"
									>
										<UserCheck className="h-4 w-4 text-[#A3D1E0]" />
										<span>{isSubmittingReg ? 'Registering...' : 'Register & Proceed to Consultation'}</span>
									</button>
								</div>
							</form>
						) : (
							<div className="space-y-3 py-2">
								<label className="block text-xs font-bold text-slate-700">Hospital Card ID or Phone</label>
								<div className="flex gap-2">
									<input
										type="text"
										placeholder="e.g. EC-100001 or 08031..."
										value={searchQuery}
										onChange={e => setSearchQuery(e.target.value)}
										className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
									/>
									<button
										type="button"
										onClick={handleSearchReturning}
										className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 cursor-pointer"
									>
										Retrieve Card
									</button>
								</div>
							</div>
						)}

					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
