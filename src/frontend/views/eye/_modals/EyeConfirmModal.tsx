/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx (REGISTRATION CONFIRMATION &
 * CASHIER ROUTING MODAL). Verbatim JSX — the patient, close, and verify
 * handlers arrive as props; the shell wires verify to the data hook.
 */

import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface EyeConfirmModalProps {
	patient: any | null;
	onClose: () => void;
	onVerify: (patientId: string) => void;
}

export default function EyeConfirmModal({ patient: regConfirmModalPatient, onClose, onVerify }: EyeConfirmModalProps) {
	return (
		<AnimatePresence>
			{regConfirmModalPatient && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
					<motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-slate-800 text-xs">
						<button
							onClick={onClose}
							className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
						>
							<X className="h-5 w-5" />
						</button>

						<div className="flex items-center gap-3">
							<div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
								<CheckCircle2 className="h-6 w-6" />
							</div>
							<div>
								<h3 className="text-base font-bold text-slate-900">I-Clinic Patient Registered</h3>
								<p className="text-[11px] text-slate-500">Registration details and card fee invoice generated</p>
							</div>
						</div>

						<div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
							<div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
								<span className="text-slate-500 font-medium">Patient Name:</span>
								<span className="font-bold text-slate-900">{regConfirmModalPatient.name}</span>
							</div>
							<div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
								<span className="text-slate-500 font-medium">Assigned Card Number:</span>
								<span className="font-mono font-bold text-[#2A758C]">{regConfirmModalPatient.hospitalNumber}</span>
							</div>
							<div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
								<span className="text-slate-500 font-medium">New Patient Card Fee:</span>
								<span className="font-mono font-bold text-emerald-700">₦3,000</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-slate-500 font-medium">Billing Destination:</span>
								<span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
									Cashier &rarr; I Clinic Registrations
								</span>
							</div>
						</div>

						<div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
							<p className="font-bold flex items-center gap-1.5">
								<AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
								Cashier Verification Required
							</p>
							<p className="text-[10px] text-amber-800 leading-relaxed">
								The I-Clinic patient has been registered and routed to the Cashier desk under <strong>I Clinic Registrations</strong>. Once verified, the patient moves immediately into the consultation queue.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-2 pt-2">
							<button
								onClick={onClose}
								className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
							>
								Close Modal
							</button>
							<button
								onClick={() => onVerify(regConfirmModalPatient.id)}
								className="flex-1 py-2.5 bg-[#2A758C] hover:bg-[#1f5869] text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
							>
								<CheckCircle2 className="h-4 w-4 text-[#A3D1E0]" />
								<span>Verify Payment & Send to Consult</span>
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
