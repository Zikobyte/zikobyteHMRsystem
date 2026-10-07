/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (PATIENT MEDICAL HISTORY MODAL).
 * Verbatim chrome: header, 5 inner-tab navigation, loading/empty states,
 * footer. Inner tab bodies live in ./history/ (split: the modal exceeded
 * 400 lines). Visibility and data arrive as props from the shell.
 */

import {
	Activity,
	FlaskConical,
	History,
	Loader2,
	Pill,
	Receipt,
	Stethoscope,
	X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { HistoryTabId, PatientHistoryData } from "../_utils/doctor-types";
import HistoryConsultationsPanel from "./history/HistoryConsultationsPanel";
import HistoryInvoicesPanel from "./history/HistoryInvoicesPanel";
import HistoryLabsPanel from "./history/HistoryLabsPanel";
import HistoryPrescriptionsPanel from "./history/HistoryPrescriptionsPanel";
import HistoryVitalsPanel from "./history/HistoryVitalsPanel";

export interface HistoryModalProps {
	open: boolean;
	loading: boolean;
	data: PatientHistoryData | null;
	activeTab: HistoryTabId;
	onTabChange: (tab: HistoryTabId) => void;
	onClose: () => void;
}

export default function HistoryModal({
	open,
	loading,
	data: patientHistoryData,
	activeTab: activeHistoryTab,
	onTabChange: setActiveHistoryTab,
	onClose,
}: HistoryModalProps) {
	return (
		<AnimatePresence>
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
					<motion.div
						initial={{ opacity: 0, scale: 0.96 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.96 }}
						className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden"
					>
						{/* Modal Header */}
						<div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex justify-between items-center">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/30">
									<History className="h-5 w-5" />
								</div>
								<div>
									<h3 className="text-base font-extrabold flex items-center gap-2">
										<span>
											Central HMS Patient Medical History
										</span>
										{patientHistoryData?.patient
											?.hospital_number && (
											<span className="text-xs bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded font-mono">
												{
													patientHistoryData.patient
														.hospital_number
												}
											</span>
										)}
									</h3>
									<p className="text-xs text-slate-300">
										{patientHistoryData?.patient?.name ||
											"Patient"}{" "}
										• {patientHistoryData?.patient?.gender || "—"}{" "}
										• Age:{" "}
										{patientHistoryData?.patient?.age ||
											patientHistoryData?.patient
												?.date_of_birth ||
											"—"}
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={onClose}
								className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors cursor-pointer"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Navigation Tabs */}
						<div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-2 gap-2 overflow-x-auto text-xs font-bold">
							<button
								type="button"
								onClick={() => setActiveHistoryTab("consultations")}
								className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
									activeHistoryTab === "consultations"
										? "border-[#2A758C] text-[#2A758C]"
										: "border-transparent text-slate-500 hover:text-slate-800"
								}`}
							>
								<Stethoscope className="h-3.5 w-3.5" />
								<span>
									Consultations (
									{patientHistoryData?.consultations?.length || 0})
								</span>
							</button>

							<button
								type="button"
								onClick={() => setActiveHistoryTab("vitals")}
								className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
									activeHistoryTab === "vitals"
										? "border-[#2A758C] text-[#2A758C]"
										: "border-transparent text-slate-500 hover:text-slate-800"
								}`}
							>
								<Activity className="h-3.5 w-3.5" />
								<span>
									Vitals Logs (
									{patientHistoryData?.vitals?.length || 0})
								</span>
							</button>

							<button
								type="button"
								onClick={() => setActiveHistoryTab("labs")}
								className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
									activeHistoryTab === "labs"
										? "border-[#2A758C] text-[#2A758C]"
										: "border-transparent text-slate-500 hover:text-slate-800"
								}`}
							>
								<FlaskConical className="h-3.5 w-3.5" />
								<span>
									Laboratory (
									{patientHistoryData?.labOrders?.length || 0})
								</span>
							</button>

							<button
								type="button"
								onClick={() => setActiveHistoryTab("prescriptions")}
								className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
									activeHistoryTab === "prescriptions"
										? "border-[#2A758C] text-[#2A758C]"
										: "border-transparent text-slate-500 hover:text-slate-800"
								}`}
							>
								<Pill className="h-3.5 w-3.5" />
								<span>
									Prescriptions (
									{patientHistoryData?.pharmacyOrders?.length || 0})
								</span>
							</button>

							<button
								type="button"
								onClick={() => setActiveHistoryTab("invoices")}
								className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
									activeHistoryTab === "invoices"
										? "border-[#2A758C] text-[#2A758C]"
										: "border-transparent text-slate-500 hover:text-slate-800"
								}`}
							>
								<Receipt className="h-3.5 w-3.5" />
								<span>
									Invoices & Payments (
									{patientHistoryData?.invoices?.length || 0})
								</span>
							</button>
						</div>

						{/* Modal Body */}
						<div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
							{loading ? (
								<div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
									<Loader2 className="h-8 w-8 animate-spin text-[#2A758C]" />
									<p className="text-xs font-bold">
										Querying PostgreSQL Central HMS Database...
									</p>
								</div>
							) : !patientHistoryData ? (
								<div className="py-12 text-center text-slate-400 text-xs">
									No medical history records available for this
									patient.
								</div>
							) : (
								<>
									{/* CONSULTATIONS TAB */}
									{activeHistoryTab === "consultations" && (
										<HistoryConsultationsPanel data={patientHistoryData} />
									)}

									{/* VITALS TAB */}
									{activeHistoryTab === "vitals" && (
										<HistoryVitalsPanel data={patientHistoryData} />
									)}

									{/* LAB ORDERS TAB */}
									{activeHistoryTab === "labs" && (
										<HistoryLabsPanel data={patientHistoryData} />
									)}

									{/* PRESCRIPTIONS TAB */}
									{activeHistoryTab === "prescriptions" && (
										<HistoryPrescriptionsPanel data={patientHistoryData} />
									)}

									{/* INVOICES TAB */}
									{activeHistoryTab === "invoices" && (
										<HistoryInvoicesPanel data={patientHistoryData} />
									)}
								</>
							)}
						</div>

						{/* Modal Footer */}
						<div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
							<span className="text-[11px] text-slate-500 font-mono">
								Zikora Central HMS Database Verified
							</span>
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
							>
								Close History
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
