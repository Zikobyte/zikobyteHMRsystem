/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx (PRINT / VIEW RECORD MODAL).
 * Verbatim JSX — the record and close handler arrive as props; selection
 * state stays in the consultation hook and the modal mounts from the shell.
 */

import { motion, AnimatePresence } from 'motion/react';
import { Eye, Printer, X } from 'lucide-react';

export interface EyeRecordViewModalProps {
	record: any | null;
	onClose: () => void;
}

export default function EyeRecordViewModal({ record: selectedRecordToView, onClose }: EyeRecordViewModalProps) {
	return (
		<AnimatePresence>
			{selectedRecordToView && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
					<motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative text-slate-800 text-xs">

						<button
							onClick={onClose}
							className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
						>
							<X className="h-5 w-5" />
						</button>

						<div className="border-b-2 border-slate-200 pb-3 flex justify-between items-start">
							<div>
								<h2 className="text-base font-black text-slate-950 flex items-center gap-1.5 uppercase font-sans">
									<Eye className="h-5 w-5 text-[#2A758C]" />
									Zikora Specialised Eye Services Card
								</h2>
								<p className="text-[9px] font-mono text-slate-400 tracking-wider">OFFICIAL CLINICAL ENCOUNTER LOG</p>
							</div>
							<div className="text-right">
								<span className="text-xs font-mono font-black text-[#2A758C] bg-[#A3D1E0]/20 px-3 py-1 rounded">
									ID: {selectedRecordToView.hospitalNumber}
								</span>
								<p className="text-[10px] font-mono text-slate-400 mt-1">Record Ref: {selectedRecordToView.id}</p>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-y-2 gap-x-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
							<div>
								<p className="text-[8px] font-bold text-slate-400 uppercase">Patient Name</p>
								<p className="font-bold text-slate-900">{selectedRecordToView.patientName}</p>
							</div>
							<div>
								<p className="text-[8px] font-bold text-slate-400 uppercase">Date of Encounter</p>
								<p className="font-bold font-mono">{selectedRecordToView.date}</p>
							</div>
							<div>
								<p className="text-[8px] font-bold text-slate-400 uppercase">Vitals BP / Glucose</p>
								<p className="font-bold font-mono text-slate-900">{selectedRecordToView.vitals?.bp || '120/80'} mmHg | {selectedRecordToView.vitals?.sugar || '5.4'} mmol/L</p>
							</div>
						</div>

						<div className="space-y-3">
							<h4 className="text-[10px] font-black text-[#2A758C] uppercase tracking-wider border-b border-slate-100 pb-1">1. Chief Complaint & History</h4>
							<div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 space-y-1.5 text-xs">
								<div>
									<span className="text-[9px] font-bold text-slate-400 uppercase block">Chief Complaint:</span>
									<p className="font-semibold text-slate-800">{selectedRecordToView.chiefComplaint || 'None recorded'}</p>
								</div>
								{selectedRecordToView.history && (
									<div>
										<span className="text-[9px] font-bold text-slate-400 uppercase block">Medical/Ocular History:</span>
										<p className="text-slate-700">{selectedRecordToView.history}</p>
									</div>
								)}
							</div>
						</div>

						<div className="space-y-3">
							<h4 className="text-[10px] font-black text-[#2A758C] uppercase tracking-wider border-b border-slate-100 pb-1">2. Clinical Assessment & Plan</h4>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<span className="text-[8px] font-bold text-slate-400 uppercase">Clinical Diagnosis</span>
									<p className="font-bold text-slate-900">{selectedRecordToView.diagnosis}</p>
								</div>
								<div>
									<span className="text-[8px] font-bold text-slate-400 uppercase">Treatment Plan / Prescription</span>
									<p className="font-bold text-slate-800">{selectedRecordToView.treatmentPlan || selectedRecordToView.planMeds || 'Prescription provided'}</p>
								</div>
							</div>

							{selectedRecordToView.services && selectedRecordToView.services.length > 0 && (
								<div className="pt-2 border-t border-dashed border-slate-200">
									<span className="text-[8px] font-bold text-slate-400 uppercase">Services, Frames & Lenses Ordered</span>
									<div className="space-y-1 mt-1 font-mono">
										{selectedRecordToView.services.map((s: any, index: number) => (
											<div key={index} className="flex justify-between text-[11px] text-slate-600">
												<span>• {s.name} ({s.category || 'Eye Service'})</span>
												<span className="font-bold">₦{Number(s.price).toLocaleString()}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						<div className="border-t-2 border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
							<span>Issued by Zikora Eye Clinic Department</span>
							<button
								onClick={() => window.print()}
								className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
							>
								<Printer className="h-3.5 w-3.5" /> Print / PDF Receipt
							</button>
						</div>

					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
