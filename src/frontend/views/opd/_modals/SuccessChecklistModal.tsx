/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (registration success
 * checklist modal). Verbatim JSX: cashier-dispatch alert card, registered
 * profile summary, standard/maternity card download panels, automated
 * pipeline steps, Done action. No behavior change — checklist state,
 * download handlers, and close/done wiring arrive as props.
 *
 * NOTE: the four `successChecked*` values are accepted for contract symmetry
 * (checklist state is owned by `useRegistrationForm`); the original body only
 * ever wrote them (OK acknowledgement + close reset), never read them.
 */

import { motion, AnimatePresence } from "motion/react";
import { Check, CreditCard, User, Sparkles, X } from "lucide-react";
import type { RegisteredPatient } from "../_hooks/useRegistrationForm";

export interface SuccessChecklistModalProps {
	open: boolean;
	registeredPatient: RegisteredPatient | null;
	successCheckedFolder: boolean;
	setSuccessCheckedFolder: (value: boolean) => void;
	successCheckedCards: boolean;
	setSuccessCheckedCards: (value: boolean) => void;
	successCheckedReceipt: boolean;
	setSuccessCheckedReceipt: (value: boolean) => void;
	successCheckedTriage: boolean;
	setSuccessCheckedTriage: (value: boolean) => void;
	onRequestClose: () => void;
	onCompleted: (patientName: string) => void;
	onDownloadPdf: (patient: RegisteredPatient) => void;
	onDownloadDoc: (patient: RegisteredPatient) => void;
	onDownloadExcel: (patient: RegisteredPatient) => void;
}

export default function SuccessChecklistModal({
	open,
	registeredPatient,
	setSuccessCheckedFolder,
	setSuccessCheckedCards,
	setSuccessCheckedReceipt,
	setSuccessCheckedTriage,
	onRequestClose,
	onCompleted,
	onDownloadPdf,
	onDownloadDoc,
	onDownloadExcel,
}: SuccessChecklistModalProps) {
	const resetChecklist = () => {
		setSuccessCheckedFolder(false);
		setSuccessCheckedCards(false);
		setSuccessCheckedReceipt(false);
		setSuccessCheckedTriage(false);
	};

	const handleClose = () => {
		resetChecklist();
		onRequestClose();
	};

	const handleDone = () => {
		resetChecklist();
		onRequestClose();
		if (registeredPatient) {
			onCompleted(registeredPatient.name);
		}
	};
	return (
		<AnimatePresence>
			{open && registeredPatient && (
				<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-4xl w-full p-6 text-slate-800"
					>
						{/* Header */}
						<div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-5">
							<div>
								<span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold font-mono text-[10px] rounded-full uppercase tracking-wider">
									Registration Completed Successfully
								</span>
								<h3 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
									OPD Clerk Checklist & File Setup
								</h3>
							</div>
							<button
								onClick={handleClose}
								className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Grid content */}
						<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
							{/* Left Column: Patient Profile & Card Downloads */}
							<div className="md:col-span-7 space-y-4">
								{/* Image-Style Alert Card */}
								<div className="bg-[#1C1613] text-[#F3E8E2] p-5 rounded-2xl shadow-lg border border-neutral-800 space-y-3 font-sans">
									<p className="text-sm font-bold tracking-wide">
										Patient registered! ID:{" "}
										<span className="text-[#E6C5B3] font-mono select-all">
											{registeredPatient.hospitalNumber}
										</span>
									</p>
									<p className="text-sm font-bold">
										Consultation Fee:{" "}
										<span className="text-[#E6C5B3]">₦5,000</span>
									</p>
									<p className="text-xs text-neutral-300 font-medium leading-relaxed">
										Please direct patient to{" "}
										<strong className="text-white underline decoration-wavy decoration-[#E6C5B3] underline-offset-4">
											CASHIER
										</strong>{" "}
										for payment.
									</p>
									<div className="flex justify-end pt-1">
										<span
											onClick={() => {
												setSuccessCheckedReceipt(true);
											}}
											className="px-3 py-1 bg-[#F3E8E2] text-neutral-950 text-[10px] font-black rounded-lg uppercase tracking-wider shadow-xs hover:bg-neutral-200 transition-colors cursor-pointer select-none"
										>
											OK
										</span>
									</div>
								</div>

								<div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
										Registered Profile Summary
									</h4>

									<div className="space-y-2">
										<div className="flex justify-between text-xs">
											<span className="text-slate-500">
												Patient Name:
											</span>
											<span className="font-bold text-slate-900">
												{registeredPatient.name}
											</span>
										</div>
										<div className="flex justify-between text-xs">
											<span className="text-slate-500">
												Date of Birth:
											</span>
											<span className="font-mono text-slate-800">
												{registeredPatient.dateOfBirth
													? registeredPatient.dateOfBirth.split(
															"T",
														)[0]
													: "N/A"}
											</span>
										</div>
										<div className="flex justify-between text-xs">
											<span className="text-slate-500">
												Gender / Sex:
											</span>
											<span className="font-semibold text-slate-800">
												{registeredPatient.gender || "N/A"}
											</span>
										</div>
										<div className="flex justify-between text-xs">
											<span className="text-slate-500">
												Card Category:
											</span>
											<span className="font-bold text-sky-700">
												{registeredPatient.cardType ||
													"Standard"}
											</span>
										</div>
									</div>
								</div>

								{/* Card 1: Standard ID details */}
								<div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
									<div className="flex justify-between items-center mb-3">
										<div>
											<span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
												CARD TYPE 1
											</span>
											<span className="text-xs font-bold text-slate-900">
												Standard Clinical Card
											</span>
										</div>
										<span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono text-[10px] font-bold rounded-lg border border-blue-100">
											{registeredPatient.hospitalNumber}
										</span>
									</div>

									<p className="text-[11px] text-slate-500 mb-4">
										Permanent clinical folder ID for non-maternity
										outpatient visits. Cost:{" "}
										<strong>₦3,000 NGN</strong>.
									</p>

									<div className="grid grid-cols-3 gap-2">
										<button
											onClick={() =>
												onDownloadPdf(
													registeredPatient,
												)
											}
											className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
											title="Download standard card PDF"
										>
											<img
												src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/pdf1.png"
												className="h-3.5 w-3.5 object-contain"
												referrerPolicy="no-referrer"
												alt="PDF"
											/>
											<span>PDF</span>
										</button>
										<button
											onClick={() =>
												onDownloadDoc(
													registeredPatient,
												)
											}
											className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
											title="Download standard card Word Doc"
										>
											<img
												src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/google.png"
												className="h-3.5 w-3.5 object-contain"
												referrerPolicy="no-referrer"
												alt="Google Doc"
											/>
											<span>Word</span>
										</button>
										<button
											onClick={() =>
												onDownloadExcel(
													registeredPatient,
												)
											}
											className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
											title="Download standard card Excel CSV"
										>
											<img
												src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/excel.png"
												className="h-3.5 w-3.5 object-contain"
												referrerPolicy="no-referrer"
												alt="Excel"
											/>
											<span>Excel</span>
										</button>
									</div>
								</div>

								{/* Card 2: Maternity Card (if applicable) */}
								{registeredPatient.cardType === "Maternity" && (
									<div className="bg-pink-50/50 border border-pink-100 rounded-xl p-4 shadow-2xs">
										<div className="flex justify-between items-center mb-3">
											<div>
												<span className="text-[9px] font-bold text-pink-400 uppercase tracking-wider font-mono block">
													CARD TYPE 2
												</span>
												<span className="text-xs font-bold text-pink-900 font-sans">
													Temporary Maternity ID
												</span>
											</div>
											<span className="px-2 py-0.5 bg-pink-100 text-pink-700 font-mono text-[10px] font-bold rounded-lg border border-pink-200">
												{registeredPatient.maternityNumber ||
													registeredPatient.hospitalNumber?.replace(
														"ZMC",
														"MAT",
													)}
											</span>
										</div>

										<p className="text-[11px] text-pink-700/80 mb-3 leading-relaxed">
											Temporary Obstetric/Antenatal file card.
											Cost: <strong>₦2,000 NGN</strong>. Expires
											immediately upon delivery. Non-maternity
											clinical visits require Standard ID card.
										</p>

										<div className="grid grid-cols-3 gap-2">
											<button
												onClick={() => {
													onDownloadPdf(
														registeredPatient,
													);
												}}
												className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-white hover:bg-pink-50 border border-pink-200 text-pink-700 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
												title="Download both cards in a 2-page PDF document"
											>
												<img
													src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/pdf1.png"
													className="h-3.5 w-3.5 object-contain"
													referrerPolicy="no-referrer"
													alt="PDF"
												/>
												<span>PDF (Both)</span>
											</button>
											<button
												onClick={() =>
													onDownloadDoc(
														registeredPatient,
													)
												}
												className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-white hover:bg-pink-50 border border-pink-200 text-pink-700 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
												title="Download word document with both cards formatted"
											>
												<img
													src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/google.png"
													className="h-3.5 w-3.5 object-contain"
													referrerPolicy="no-referrer"
													alt="Google Doc"
												/>
												<span>Word</span>
											</button>
											<button
												onClick={() =>
													onDownloadExcel(
														registeredPatient,
													)
												}
												className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-white hover:bg-pink-50 border border-pink-200 text-pink-700 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
												title="Download Excel CSV with dual rows"
											>
												<img
													src="https://kelechieze.wordpress.com/wp-content/uploads/2026/07/excel.png"
													className="h-3.5 w-3.5 object-contain"
													referrerPolicy="no-referrer"
													alt="Excel"
												/>
												<span>Excel</span>
											</button>
										</div>
									</div>
								)}
							</div>

							{/* Right Column: Automated System Routing Pipeline */}
							<div className="md:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between space-y-4">
								<div className="space-y-4">
									<div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
										<div>
											<span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
												AUTOMATED PIPELINE
											</span>
											<h4 className="text-xs font-bold text-slate-900">
												System Workflow & Patient Dispatch
											</h4>
										</div>
										<span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-200 shadow-2xs">
											<span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
											Transferred to Cashier
										</span>
									</div>

									{/* Step-by-step Automated Pipeline */}
									<div className="space-y-3 pt-1">
										{/* Step 1: OPD Registration (Done) */}
										<div className="flex items-start gap-3 p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
											<div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
												<Check className="h-3.5 w-3.5 stroke-[3]" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between">
													<p className="text-xs font-bold text-slate-900">
														1. OPD Registration Completed
													</p>
													<span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
														DONE
													</span>
												</div>
												<p className="text-[10px] text-slate-500 font-medium mt-0.5">
													Profile & Hospital ID{" "}
													<span className="font-mono font-bold text-slate-700">
														{registeredPatient.hospitalNumber}
													</span>{" "}
													stored in PostgreSQL EMR.
												</p>
											</div>
										</div>

										{/* Step 2: Cashier Verification (Active Queue) */}
										<div className="flex items-start gap-3 p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/80 shadow-2xs">
											<div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
												<CreditCard className="h-3.5 w-3.5" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between">
													<p className="text-xs font-bold text-amber-950">
														2. Cashier Department Queue
													</p>
													<span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded animate-pulse">
														AWAITING PAYMENT
													</span>
												</div>
												<p className="text-[10px] text-amber-900/80 font-medium mt-0.5">
													Information sent to Cashier. Awaiting
													payment verification (Cash, POS, or
													Transfer) for ₦
													{registeredPatient.cardFee
														? registeredPatient.cardFee.toLocaleString()
														: "5,000"}
													.
												</p>
											</div>
										</div>

										{/* Step 3: Doctor Consultation (Next Step) */}
										<div className="flex items-start gap-3 p-2.5 bg-white/60 rounded-xl border border-slate-200/60 opacity-75">
											<div className="h-6 w-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
												<User className="h-3.5 w-3.5" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between">
													<p className="text-xs font-bold text-slate-700">
														3. Doctor's Waiting Room
													</p>
													<span className="text-[9px] font-mono font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
														NEXT STEP
													</span>
												</div>
												<p className="text-[10px] text-slate-500 font-medium mt-0.5">
													The system will automatically forward
													the patient to the Doctor's clinic
													queue as soon as Cashier confirms
													payment.
												</p>
											</div>
										</div>
									</div>

									<div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 font-medium leading-relaxed flex items-start gap-2">
										<Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
										<span>
											<strong>
												No manual clerk action required:
											</strong>{" "}
											The Cashier will see{" "}
											{registeredPatient.name} under pending
											registration payments.
										</span>
									</div>
								</div>

								<button
									onClick={handleDone}
									className="w-full mt-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-white transition-colors text-xs font-bold rounded-xl shadow-xs cursor-pointer text-center flex items-center justify-center gap-1.5"
								>
									<span>Done & Return to Registry</span>
								</button>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
