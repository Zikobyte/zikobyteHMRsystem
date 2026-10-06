/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (OUTPATIENTS branch).
 *
 * OutpatientsTab: waiting-patients queue list + consultation workspace
 * (profile, maternity/emergency cards, vitals, lab results, past
 * history, notes, lab selectors, prescription editor, actions).
 * Verbatim JSX — queue rows, workspace state, and handlers arrive via
 * the consultation hook result + props.
 */

import {
	Activity,
	Building2,
	Check,
	CheckCircle2,
	FileText,
	FlaskConical,
	History,
	Layers,
	Loader2,
	Lock,
	LogOut,
	Save,
	Stethoscope,
	Users,
} from "lucide-react";
import ExportButton from "@/components/shared/ExportButton";
import PrescriptionRowsEditor from "../_components/PrescriptionRowsEditor";
import type { UseOutpatientConsultationResult } from "../_hooks/useOutpatientConsultation";
import {
	CHEMISTRY_TESTS,
	HAEMATOLOGY_TESTS,
	MICROBIOLOGY_TESTS,
	PARASITOLOGY_TESTS,
	SEROLOGY_TESTS,
} from "../_utils/doctor-catalog";
import { formatVital } from "../_utils/doctor-format";
import type { DoctorNotify, DoctorOutpatient } from "../_utils/doctor-types";

export interface OutpatientsTabProps {
	queue: DoctorOutpatient[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	consultation: UseOutpatientConsultationResult;
	onOpenHistory: (patientId: string) => void;
	notify: DoctorNotify;
}

export default function OutpatientsTab({
	queue: filteredOutpatients,
	selectedId: selectedOutpatientId,
	onSelect,
	consultation,
	onOpenHistory: handleOpenPatientHistory,
	notify: showToast,
}: OutpatientsTabProps) {
	const {
		selectedOutpatient,
		selectedPatientLabResults,
		patientPastConsultations,
		isStartingConsultation,
		isExitingConsultation,
		handleStartConsultation,
		handleExitConsultation,
		handleSendLabsToCashierDb,
		handleCompleteConsultationDb,
		handleCompleteConsultation,
		handleAdmitOutpatient,
		prescriptionRows,
		handleAddMedicationRow,
		handleRemoveMedicationRow,
		handleUpdateMedicationRow,
		handleRemoveOutpatientPrescription,
		handleOrderOutpatientLabTest,
		handleRemoveOutpatientLabTest,
		handleOutpatientNotesChange,
		handleSaveOutpatientNotes,
		handleSendMedsToCashierDb,
		isCompleting,
		isSavingNote,
		isNoteSaved,
	} = consultation;

	return (
		/* Main Grid View */
		<div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
			{/* Left Side: Patient Queue/List */}
			<div className="w-full lg:w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 h-64 lg:h-auto overflow-y-auto">
				<div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
					<span className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
						Waiting Patients
					</span>
					<span className="px-2 py-0.5 bg-slate-200/60 rounded-full text-[10px] font-bold text-slate-600">
						{filteredOutpatients.length}{" "}
						Active
					</span>
				</div>

				<div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
					{filteredOutpatients.length === 0 ? (
						<div className="p-8 text-center text-slate-400 text-xs">
							No waiting patients found.
						</div>
					) : (
						filteredOutpatients.map((p, idx) => {
							const isSelected = selectedOutpatientId === p.id;
							return (
								<div
									key={
										p.queueId
											? `q-${p.queueId}`
											: `outpatient-${p.id}-${idx}`
									}
									onClick={() => {
										onSelect(p.id);
									}}
									className={`p-4 cursor-pointer transition-all hover:bg-slate-50/80 relative ${
										isSelected
											? "bg-slate-50 border-l-4 border-[#2A758C]"
											: "border-l-4 border-transparent"
									}`}
								>
									<div className="flex justify-between items-start">
										<div>
											<p className="font-extrabold text-slate-900 text-sm">
												{p.name}
											</p>
											<p className="text-[11px] text-slate-500 font-mono mt-0.5">
												{p.id}
											</p>
										</div>
										<div className="flex flex-col items-end gap-1.5">
											{p.isAwaitingPayment ? (
												<span className="px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider bg-amber-100 text-amber-900 border border-amber-300 font-mono flex items-center gap-1">
													<Lock className="h-2.5 w-2.5 text-amber-700" />{" "}
													IN CASHIER DEPT
												</span>
											) : (
												<span
													className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider font-mono ${
														p.status ===
														"IN CONSULTATION"
															? "bg-amber-100 text-amber-800 border border-amber-200/50"
															: "bg-emerald-100 text-emerald-800 border border-emerald-200/50"
													}`}
												>
													{p.status ===
														"IN CONSULTATION" &&
													p.processedBy
														? `IN CONSULTATION (${p.processedBy})`
														: p.status}
												</span>
											)}
											{p.isEmergency && (
												<span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-rose-100 text-rose-800 border border-rose-200 font-mono uppercase">
													EMERGENCY
												</span>
											)}
										</div>
									</div>

									<div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
										<span className="bg-slate-100 px-1.5 py-0.5 rounded">
											{p.department}
										</span>
										<span>
											BP: {p.vitals?.bloodPressure || "—"}
										</span>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			{/* Right Side: Active Patient File View */}
			<div className="flex-1 overflow-y-auto bg-slate-50 p-6">
				{selectedOutpatient ? (
					<div className="max-w-4xl mx-auto space-y-6">
						{/* Header Profile Info card */}
						<div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
							<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
								<div>
									<div className="flex flex-wrap items-center gap-2.5">
										<h3 className="text-xl font-black text-slate-900">
											{selectedOutpatient.name}
										</h3>
										{selectedOutpatient.cardType && (
											<span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-blue-50 text-blue-800 border border-blue-200 font-mono uppercase">
												{selectedOutpatient.cardType} Card
											</span>
										)}
										{selectedOutpatient.patientCategory && (
											<span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono uppercase">
												{
													selectedOutpatient.patientCategory
												}
											</span>
										)}
										{selectedOutpatient.isEmergency && (
											<span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-rose-100 text-rose-800 border border-rose-200 font-mono uppercase animate-pulse">
												EMERGENCY
											</span>
										)}
									</div>
									<div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1.5">
										<span>
											Hospital ID:{" "}
											<strong className="text-slate-800">
												{selectedOutpatient.hospitalNumber ||
													selectedOutpatient.id}
											</strong>
										</span>
										<span>•</span>
										<span>
											Queue Dept:{" "}
											<strong className="text-slate-800">
												{selectedOutpatient.department}
											</strong>
										</span>
									</div>
								</div>

								<div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
									{/* Active Consultation Action Buttons */}
									{selectedOutpatient.isDbPatient &&
										!selectedOutpatient.isAwaitingPayment &&
										(selectedOutpatient.status ===
										"IN CONSULTATION" ? (
											<div className="flex items-center gap-2">
												<span className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-black font-mono">
													<span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
													IN CONSULTATION (
													{selectedOutpatient.processedBy ||
														"YOU"}
													)
												</span>
												<button
													type="button"
													disabled={isExitingConsultation}
													onClick={() =>
														handleExitConsultation(
															selectedOutpatient,
														)
													}
													className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
													title="Pause consultation and return patient to queue"
												>
													{isExitingConsultation ? (
														<Loader2 className="h-3.5 w-3.5 animate-spin" />
													) : (
														<LogOut className="h-3.5 w-3.5" />
													)}
													<span>Hold / Exit</span>
												</button>
											</div>
										) : (
											<button
												type="button"
												disabled={isStartingConsultation}
												onClick={() =>
													handleStartConsultation(
														selectedOutpatient,
													)
												}
												className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2A758C] hover:bg-[#1f5869] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs disabled:opacity-50"
												title="Start consultation with this patient"
											>
												{isStartingConsultation ? (
													<Loader2 className="h-3.5 w-3.5 animate-spin" />
												) : (
													<Stethoscope className="h-3.5 w-3.5" />
												)}
												<span>Start Consultation</span>
											</button>
										))}

									<button
										type="button"
										onClick={() =>
											handleOpenPatientHistory(
												selectedOutpatient.id,
											)
										}
										className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs"
										title="View patient history, previous consultations, vitals & lab records"
									>
										<History className="h-3.5 w-3.5 text-indigo-600" />
										<span>Patient History</span>
									</button>
									<ExportButton
										exportType="medical-records"
										patientId={selectedOutpatient.id}
										label="Download HMS"
										className="bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 font-extrabold"
										onSuccess={(msg) => showToast(msg)}
										onFailure={(msg) => showToast(msg)}
									/>
								</div>
							</div>

							{/* Profile Details Grid */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
								<div>
									<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										DOB & Age
									</span>
									<span className="text-xs font-bold text-slate-800">
										{selectedOutpatient.dateOfBirth} (
										{selectedOutpatient.age} yrs)
									</span>
								</div>
								<div>
									<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										Gender
									</span>
									<span className="text-xs font-bold text-slate-800">
										{selectedOutpatient.gender}
									</span>
								</div>
								<div>
									<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										Marital Status
									</span>
									<span className="text-xs font-bold text-slate-800">
										{selectedOutpatient.maritalStatus}
									</span>
								</div>
								<div>
									<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										Phone Number
									</span>
									<span className="text-xs font-bold text-slate-800">
										{selectedOutpatient.phoneNumber}
									</span>
								</div>
								<div>
									<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										Email Address
									</span>
									<span className="text-xs font-bold text-slate-800 truncate block">
										{selectedOutpatient.email || "—"}
									</span>
								</div>
								<div className="col-span-2">
									<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										Home Address
									</span>
									<span className="text-xs font-bold text-slate-800">
										{selectedOutpatient.address}
									</span>
								</div>
								<div>
									<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										Attending Doctor
									</span>
									<span className="text-xs font-bold text-[#2A758C] font-mono">
										@{selectedOutpatient.attendingDoctor}
									</span>
								</div>
								<div className="col-span-2">
									<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										Next of Kin
									</span>
									<span className="text-xs font-bold text-slate-800">
										{selectedOutpatient.nextOfKinName} (
										{
											selectedOutpatient.nextOfKinRelationship
										}
										) • {selectedOutpatient.nextOfKinPhone}
									</span>
								</div>
								<div className="col-span-2">
									<span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										Registered Date & Time
									</span>
									<span className="text-xs font-bold text-slate-800 font-mono">
										{selectedOutpatient.registeredAt || "—"}
									</span>
								</div>
							</div>
						</div>

						{/* Maternity Profile Details (If Maternity Card) */}
						{(selectedOutpatient.cardType === "Maternity" ||
							selectedOutpatient.maternityDetails) && (
							<div className="bg-emerald-50/40 rounded-2xl border border-emerald-200/80 p-6 shadow-sm">
								<h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5">
									<Users className="h-4 w-4 text-emerald-700" />
									Maternity & Obstetric Profile
								</h4>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
									<div className="bg-white p-3 rounded-xl border border-emerald-100">
										<span className="block text-[10px] font-bold text-emerald-600 uppercase font-mono">
											Gravida / Para
										</span>
										<span className="font-extrabold text-slate-800">
											G
											{selectedOutpatient.maternityDetails
												?.gravida || "0"}{" "}
											P
											{selectedOutpatient.maternityDetails
												?.para || "0"}
										</span>
									</div>
									<div className="bg-white p-3 rounded-xl border border-emerald-100">
										<span className="block text-[10px] font-bold text-emerald-600 uppercase font-mono">
											LMP
										</span>
										<span className="font-extrabold text-slate-800">
											{selectedOutpatient.maternityDetails
												?.lmp || "—"}
										</span>
									</div>
									<div className="bg-white p-3 rounded-xl border border-emerald-100">
										<span className="block text-[10px] font-bold text-emerald-600 uppercase font-mono">
											EDD
										</span>
										<span className="font-extrabold text-slate-800">
											{selectedOutpatient.maternityDetails
												?.edd || "—"}
										</span>
									</div>
									<div className="bg-white p-3 rounded-xl border border-emerald-100">
										<span className="block text-[10px] font-bold text-emerald-600 uppercase font-mono">
											Gestational Age
										</span>
										<span className="font-extrabold text-slate-800">
											{selectedOutpatient.maternityDetails
												?.gestationalAge || "—"}
										</span>
									</div>
									<div className="bg-white p-3 rounded-xl border border-emerald-100">
										<span className="block text-[10px] font-bold text-emerald-600 uppercase font-mono">
											Tribe
										</span>
										<span className="font-extrabold text-slate-800">
											{selectedOutpatient.maternityDetails
												?.tribe || "—"}
										</span>
									</div>
									<div className="bg-white p-3 rounded-xl border border-emerald-100">
										<span className="block text-[10px] font-bold text-emerald-600 uppercase font-mono">
											Occupation
										</span>
										<span className="font-extrabold text-slate-800">
											{selectedOutpatient.maternityDetails
												?.occupation || "—"}
										</span>
									</div>
									<div className="bg-white p-3 rounded-xl border border-emerald-100 col-span-2">
										<span className="block text-[10px] font-bold text-emerald-600 uppercase font-mono">
											Abortion / Premature History
										</span>
										<span className="font-extrabold text-slate-800">
											Abortion:{" "}
											{selectedOutpatient.maternityDetails
												?.abortion || "0"}{" "}
											| Premature:{" "}
											{selectedOutpatient.maternityDetails
												?.premature || "0"}
										</span>
									</div>
								</div>
							</div>
						)}

						{/* Emergency Intake Details (If Emergency Card) */}
						{(selectedOutpatient.cardType === "Emergency" ||
							selectedOutpatient.emergencyDetails) && (
							<div className="bg-rose-50/40 rounded-2xl border border-rose-200/80 p-6 shadow-sm">
								<h4 className="text-xs font-black text-rose-900 uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5">
									<Activity className="h-4 w-4 text-rose-700" />
									Emergency Trauma Intake Protocols
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
									<div className="bg-white p-3.5 rounded-xl border border-rose-100">
										<span className="block text-[10px] font-bold text-rose-600 uppercase font-mono">
											Brought In By
										</span>
										<span className="font-extrabold text-slate-800 block mt-0.5">
											{selectedOutpatient.emergencyDetails
												?.broughtInByName ||
												"Self Presenting"}
										</span>
										<span className="text-[11px] text-slate-500 block">
											{selectedOutpatient.emergencyDetails
												?.broughtInByRelationship ||
												""}{" "}
											•{" "}
											{selectedOutpatient.emergencyDetails
												?.broughtInByPhone || ""}
										</span>
									</div>
									<div className="bg-white p-3.5 rounded-xl border border-rose-100">
										<span className="block text-[10px] font-bold text-rose-600 uppercase font-mono">
											Brought In ID
										</span>
										<span className="font-extrabold text-slate-800 block mt-0.5">
											{selectedOutpatient.emergencyDetails
												?.broughtInByIdType || "N/A"}
											:{" "}
											{selectedOutpatient.emergencyDetails
												?.broughtInByIdNumber || "—"}
										</span>
									</div>
									<div className="bg-white p-3.5 rounded-xl border border-rose-100">
										<span className="block text-[10px] font-bold text-rose-600 uppercase font-mono">
											Doctor on Call / Cash
										</span>
										<span className="font-extrabold text-slate-800 block mt-0.5">
											{selectedOutpatient.emergencyDetails
												?.doctorOnCallName ||
												selectedOutpatient.attendingDoctor ||
												"—"}
										</span>
										<span className="text-[11px] text-emerald-700 font-bold block mt-0.5 font-mono">
											Collected: ₦
											{Number(
												selectedOutpatient.emergencyDetails
													?.cashCollected || 0,
											).toLocaleString()}
										</span>
									</div>
									{selectedOutpatient.emergencyDetails
										?.customDetails && (
										<div className="bg-white p-3.5 rounded-xl border border-rose-100 md:col-span-3">
											<span className="block text-[10px] font-bold text-rose-600 uppercase font-mono">
												Incident Intake Note
											</span>
											<p className="text-slate-700 font-medium text-xs mt-1">
												{
													selectedOutpatient
														.emergencyDetails
														.customDetails
												}
											</p>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Patient Vitals Card (Adult: T - P - R - BP - W - H - SpO2) */}
						<div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
							<h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono mb-4 flex items-center justify-between">
								<span className="flex items-center gap-1.5">
									<Activity className="h-4 w-4 text-[#2A758C]" />
									Vital Signs Records (Adult: T – P – R – BP –
									W)
								</span>
								<span className="text-[10px] font-mono text-slate-400 font-medium uppercase">
									Recorded at Intake/Triage
								</span>
							</h4>
							<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
								<div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
									<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
										BP (mmHg)
									</span>
									<span className="text-xs font-extrabold text-slate-800 font-mono mt-0.5 block">
										{formatVital(
											selectedOutpatient.vitals
												?.bloodPressure,
										)}
									</span>
								</div>
								<div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
									<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
										Temp (°C)
									</span>
									<span className="text-xs font-extrabold text-slate-800 font-mono mt-0.5 block">
										{formatVital(
											selectedOutpatient.vitals
												?.temperature,
											"°C",
										)}
									</span>
								</div>
								<div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
									<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
										Pulse (bpm)
									</span>
									<span className="text-xs font-extrabold text-slate-800 font-mono mt-0.5 block">
										{formatVital(
											selectedOutpatient.vitals?.pulseRate,
											"bpm",
										)}
									</span>
								</div>
								<div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
									<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
										Resp (/min)
									</span>
									<span className="text-xs font-extrabold text-slate-800 font-mono mt-0.5 block">
										{formatVital(
											selectedOutpatient.vitals
												?.respiratoryRate,
											"/min",
										)}
									</span>
								</div>
								<div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
									<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
										Weight (kg)
									</span>
									<span className="text-xs font-extrabold text-slate-800 font-mono mt-0.5 block">
										{formatVital(
											selectedOutpatient.vitals?.weight,
											"kg",
										)}
									</span>
								</div>
								<div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
									<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
										Height (cm)
									</span>
									<span className="text-xs font-extrabold text-slate-800 font-mono mt-0.5 block">
										{formatVital(
											selectedOutpatient.vitals?.height,
											"cm",
										)}
									</span>
								</div>
								<div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
									<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
										SpO2 (%)
									</span>
									<span className="text-xs font-extrabold text-slate-800 font-mono mt-0.5 block">
										{formatVital(
											selectedOutpatient.vitals?.spo2,
											"%",
										)}
									</span>
								</div>
							</div>
						</div>

						{/* Laboratory Results Section */}
						{selectedPatientLabResults.length > 0 && (
							<div className="bg-white rounded-2xl border border-emerald-200/80 bg-emerald-50/10 p-6 shadow-sm">
								<h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider font-mono mb-4 flex items-center gap-1.5">
									<FlaskConical className="h-4 w-4 text-emerald-600 animate-pulse" />
									Laboratory Test Results (READY)
								</h4>
								<div className="space-y-3">
									{selectedPatientLabResults.map(
										(result, idx) => (
											<div
												key={result.id || idx}
												className="bg-white p-4 rounded-xl border border-emerald-100/80 shadow-xs"
											>
												<div className="flex justify-between items-center mb-2">
													<span className="text-xs font-black text-slate-800">
														{result.test_name}
													</span>
													<span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
														Validated
													</span>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-2">
													<div className="bg-slate-50 p-2 rounded-lg">
														<span className="block text-[10px] text-slate-400 font-mono font-bold uppercase">
															Result Value
														</span>
														<p className="font-mono font-bold text-slate-800 mt-0.5">
															{result.result_details}
														</p>
													</div>
													<div className="bg-slate-50 p-2 rounded-lg">
														<span className="block text-[10px] text-slate-400 font-mono font-bold uppercase">
															Reference / Findings
														</span>
														<p className="text-slate-700 mt-0.5">
															{result.findings}
														</p>
													</div>
												</div>
												<p className="text-[9px] text-slate-400 font-mono mt-2">
													Tested on:{" "}
													{result.date_completed
														? new Date(
																result.date_completed,
															).toLocaleString()
														: "—"}
												</p>
											</div>
										),
									)}
								</div>
							</div>
						)}

						{/* Doctor Clinical Notes or Lock Box */}
						{selectedOutpatient.isAwaitingPayment ? (
							<div className="bg-amber-50/80 border-2 border-dashed border-amber-300 p-8 rounded-3xl text-center space-y-4 my-6 shadow-xs">
								<div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto">
									<Lock className="h-7 w-7" />
								</div>
								<div className="space-y-1">
									<h3 className="text-lg font-black text-amber-950">
										Consultation Locked: Payment Verification
										Pending
									</h3>
									<p className="text-xs text-amber-800 max-w-lg mx-auto font-medium leading-relaxed">
										<strong>
											{selectedOutpatient.name}
										</strong>{" "}
										({selectedOutpatient.id}) has been
										registered at the OPD and sent to the{" "}
										<strong>Cashier Department</strong> for
										card/consultation fee payment
										verification.
									</p>
								</div>
								<div className="p-4 bg-white rounded-2xl border border-amber-200/80 max-w-md mx-auto text-left text-xs space-y-2">
									<div className="flex justify-between items-center text-slate-600">
										<span className="font-medium">
											Current Location:
										</span>
										<span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-mono text-[10px]">
											CASHIER DEPARTMENT
										</span>
									</div>
									<div className="flex justify-between items-center text-slate-600">
										<span className="font-medium">
											Doctor Access:
										</span>
										<span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-mono text-[10px]">
											LOCKED UNTIL PAYMENT CONFIRMED
										</span>
									</div>
								</div>
								<p className="text-[11px] text-amber-700 font-mono italic">
									⚡ This consultation workspace will
									automatically unlock as soon as the Cashier
									verifies or collects payment.
								</p>
							</div>
						) : (
							<>
								{/* Previous Patient Clinical History & Doctor Notes */}
								{patientPastConsultations.length > 0 && (
									<div className="bg-white rounded-2xl border border-indigo-100 bg-indigo-50/20 p-6 shadow-sm space-y-4">
										<div className="flex justify-between items-center border-b border-indigo-100/80 pb-3">
											<h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider font-mono flex items-center gap-2">
												<History className="h-4 w-4 text-indigo-600" />
												Previous Medical History & Doctor's
												Notes (
												{patientPastConsultations.length})
											</h4>
											<span className="text-[10px] font-bold text-indigo-600 font-mono bg-indigo-100/60 px-2 py-0.5 rounded-full">
												Patient HMS History
											</span>
										</div>

										<div className="space-y-3">
											{patientPastConsultations.map(
												(past, idx) => (
													<div
														key={idx}
														className="bg-white rounded-xl p-4 border border-indigo-100 shadow-2xs space-y-2 text-xs"
													>
														<div className="flex justify-between items-center border-b border-slate-100 pb-2 text-[11px]">
															<span className="font-extrabold text-slate-800 flex items-center gap-1.5">
																<Stethoscope className="h-3.5 w-3.5 text-[#2A758C]" />
																<span>
																	Dr.{" "}
																	{past.doctor_name ||
																		"Attending Physician"}
																</span>
															</span>
															<span className="font-mono text-slate-400 text-[10px]">
																{past.created_at
																	? new Date(
																			past.created_at,
																		).toLocaleString()
																	: "Previous Visit"}
															</span>
														</div>
														<div className="space-y-1 text-slate-700">
															{past.chief_complaint && (
																<p>
																	<strong className="text-slate-900 font-mono text-[11px]">
																		Chief Complaint:
																	</strong>{" "}
																	{
																		past.chief_complaint
																	}
																</p>
															)}
															<p>
																<strong className="text-[#2A758C] font-mono text-[11px]">
																	Diagnosis:
																</strong>{" "}
																<span className="font-bold text-slate-900">
																	{past.diagnosis ||
																		"Clinical evaluation"}
																</span>
															</p>
															<p>
																<strong className="text-slate-900 font-mono text-[11px]">
																	Doctor's Notes &
																	Plan:
																</strong>{" "}
																{past.clinical_notes ||
																	past.treatment_plan ||
																	past.notes ||
																	"Routine consultation"}
															</p>
															{past.prescriptions && (
																<p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
																	<strong>
																		Prescriptions:
																	</strong>{" "}
																	{typeof past.prescriptions ===
																	"string"
																		? past.prescriptions
																		: JSON.stringify(
																				past.prescriptions,
																			)}
																</p>
															)}
														</div>
													</div>
												),
											)}
										</div>
									</div>
								)}

								{/* Doctor Clinical Notes */}
								<div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
									<div className="flex items-center justify-between mb-3">
										<h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
											<FileText className="h-4 w-4 text-[#2A758C]" />
											Doctor's Notes
										</h4>
										{isNoteSaved && (
											<span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
												<Check className="w-3.5 h-3.5" />{" "}
												Saved to HMS
											</span>
										)}
									</div>
									<textarea
										rows={4}
										value={selectedOutpatient.notes || ""}
										onChange={(e) =>
											handleOutpatientNotesChange(
												selectedOutpatient.id,
												e.target.value,
											)
										}
										onBlur={() =>
											handleSaveOutpatientNotes(
												selectedOutpatient.id,
												selectedOutpatient.encounterId,
												selectedOutpatient.notes,
											)
										}
										placeholder="Diagnosis, observations, treatment plan..."
										className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2A758C] font-mono leading-relaxed"
									/>
									<div className="flex items-center justify-between mt-3">
										<span className="text-[10px] text-slate-400 font-mono">
											{isSavingNote
												? "Saving notes to medical record..."
												: "Auto-saves on blur or click Save Notes"}
										</span>
										<button
											type="button"
											disabled={isSavingNote}
											onClick={() =>
												handleSaveOutpatientNotes(
													selectedOutpatient.id,
													selectedOutpatient.encounterId,
													selectedOutpatient.notes,
												)
											}
											className="px-3.5 py-1.5 bg-[#2A758C] hover:bg-[#205d70] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
										>
											{isSavingNote ? (
												<Loader2 className="w-3.5 h-3.5 animate-spin" />
											) : (
												<Save className="w-3.5 h-3.5" />
											)}
											<span>
												{isSavingNote
													? "Saving..."
													: "Save Notes"}
											</span>
										</button>
									</div>
								</div>

								{/* Order Lab Tests Section */}
								<div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
									<h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
										<Layers className="h-4 w-4 text-[#2A758C]" />
										Order Lab Tests
									</h4>

									<div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
										{/* Chemistry */}
										<div className="space-y-1.5">
											<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
												CHEMISTRY
											</span>
											<select
												onChange={(e) => {
													const test =
														CHEMISTRY_TESTS.find(
															(t) =>
																t.name ===
																e.target.value,
														);
													if (test)
														handleOrderOutpatientLabTest(
															"CHEMISTRY",
															test.name,
															test.code,
														);
													e.target.value = "";
												}}
												className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
											>
												<option value="">
													Select test...
												</option>
												{CHEMISTRY_TESTS.map((t) => (
													<option
														key={t.name}
														value={t.name}
													>
														{t.name} - ₦
														{t.price.toLocaleString()}
													</option>
												))}
											</select>
										</div>

										{/* Serology */}
										<div className="space-y-1.5">
											<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
												SEROLOGY
											</span>
											<select
												onChange={(e) => {
													const test =
														SEROLOGY_TESTS.find(
															(t) =>
																t.name ===
																e.target.value,
														);
													if (test)
														handleOrderOutpatientLabTest(
															"SEROLOGY",
															test.name,
															test.code,
														);
													e.target.value = "";
												}}
												className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
											>
												<option value="">
													Select test...
												</option>
												{SEROLOGY_TESTS.map((t) => (
													<option
														key={t.name}
														value={t.name}
													>
														{t.name} - ₦
														{t.price.toLocaleString()}
													</option>
												))}
											</select>
										</div>

										{/* Haematology */}
										<div className="space-y-1.5">
											<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
												HAEMATOLOGY
											</span>
											<select
												onChange={(e) => {
													const test =
														HAEMATOLOGY_TESTS.find(
															(t) =>
																t.name ===
																e.target.value,
														);
													if (test)
														handleOrderOutpatientLabTest(
															"HAEMATOLOGY",
															test.name,
															test.code,
														);
													e.target.value = "";
												}}
												className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
											>
												<option value="">
													Select test...
												</option>
												{HAEMATOLOGY_TESTS.map((t) => (
													<option
														key={t.name}
														value={t.name}
													>
														{t.name} - ₦
														{t.price.toLocaleString()}
													</option>
												))}
											</select>
										</div>

										{/* Microbiology */}
										<div className="space-y-1.5">
											<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
												MICROBIOLOGY
											</span>
											<select
												onChange={(e) => {
													const test =
														MICROBIOLOGY_TESTS.find(
															(t) =>
																t.name ===
																e.target.value,
														);
													if (test)
														handleOrderOutpatientLabTest(
															"MICROBIOLOGY",
															test.name,
															test.code,
														);
													e.target.value = "";
												}}
												className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
											>
												<option value="">
													Select test...
												</option>
												{MICROBIOLOGY_TESTS.map((t) => (
													<option
														key={t.name}
														value={t.name}
													>
														{t.name} - ₦
														{t.price.toLocaleString()}
													</option>
												))}
											</select>
										</div>

										{/* Parasitology */}
										<div className="space-y-1.5">
											<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
												PARASITOLOGY
											</span>
											<select
												onChange={(e) => {
													const test =
														PARASITOLOGY_TESTS.find(
															(t) =>
																t.name ===
																e.target.value,
														);
													if (test)
														handleOrderOutpatientLabTest(
															"PARASITOLOGY",
															test.name,
															test.code,
														);
													e.target.value = "";
												}}
												className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
											>
												<option value="">
													Select test...
												</option>
												{PARASITOLOGY_TESTS.map((t) => (
													<option
														key={t.name}
														value={t.name}
													>
														{t.name} - ₦
														{t.price.toLocaleString()}
													</option>
												))}
											</select>
										</div>
									</div>

									{/* Active orders view */}
									{selectedOutpatient.orderedTests &&
										selectedOutpatient.orderedTests.length >
											0 && (
											<div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mt-4 space-y-3">
												<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
													Selected Lab Orders
												</span>
												<div className="flex flex-wrap gap-2">
													{selectedOutpatient.orderedTests.map(
														(t, idx) => (
															<div
																key={t.name || idx}
																className="flex items-center gap-1.5 bg-[#A3D1E0]/20 border border-[#A3D1E0]/40 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800"
															>
																<span>
																	[{t.category}]{" "}
																	{t.name} – ₦
																	{Number(
																		t.price || 0,
																	).toLocaleString()}
																</span>
																<button
																	type="button"
																	onClick={() =>
																		handleRemoveOutpatientLabTest(
																			t.name,
																		)
																	}
																	className="text-rose-500 hover:text-rose-700 font-extrabold ml-1 cursor-pointer"
																>
																	×
																</button>
															</div>
														),
													)}
												</div>

												<div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
													<div className="text-sm font-black text-slate-800 font-mono">
														Total:{" "}
														<span className="text-[#2A758C]">
															₦
															{selectedOutpatient.orderedTests
																.reduce(
																	(
																		sum: number,
																		item,
																	) =>
																		sum +
																		Number(
																			item.price ||
																				0,
																		),
																	0,
																)
																.toLocaleString()}
														</span>
													</div>
													<button
														type="button"
														disabled={isCompleting}
														onClick={
															handleSendLabsToCashierDb
														}
														className="flex items-center justify-center gap-2 bg-[#2A758C] hover:bg-[#1f5869] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
													>
														{isCompleting ? (
															<Loader2 className="w-4 h-4 animate-spin" />
														) : (
															<FlaskConical className="w-4 h-4" />
														)}
														<span>
															Send to Cashier for Lab
															Payment
														</span>
													</button>
												</div>
											</div>
										)}
								</div>

								{/* Prescribe Medications Section */}
								<PrescriptionRowsEditor
									rows={prescriptionRows}
									prescribedMedications={selectedOutpatient.prescribedMedications || []}
									isCompleting={isCompleting}
									onAddRow={handleAddMedicationRow}
									onRemoveRow={handleRemoveMedicationRow}
									onUpdateRow={handleUpdateMedicationRow}
									onRemovePrescription={handleRemoveOutpatientPrescription}
									onSendMeds={handleSendMedsToCashierDb}
								/>

								{/* Consultation Actions Section */}
								<div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
									<h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
										Consultation Actions
									</h4>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{/* Admit Patient to Ward Card */}
										<div className="border border-amber-200 bg-amber-50/30 p-5 rounded-2xl flex flex-col justify-between space-y-3">
											<div>
												<h5 className="text-xs font-extrabold text-amber-900 uppercase tracking-wide font-mono flex items-center gap-1.5">
													<Building2 className="h-4 w-4" />
													Admit Patient to Ward
												</h5>
												<p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
													Use when patient requires
													inpatient care. OPD overview and
													Nursing will be notified to
													assign a ward and bed.
												</p>
											</div>
											<button
												type="button"
												onClick={handleAdmitOutpatient}
												className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
											>
												Admit Patient → Nursing
											</button>
										</div>

										{/* Complete Consultation Card */}
										<div className="border border-slate-200 bg-slate-50/50 p-5 rounded-2xl flex flex-col justify-between space-y-3">
											<div>
												<h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide font-mono flex items-center gap-1.5">
													<Check className="h-4 w-4" />
													Complete Consultation
												</h5>
												<p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
													Saves clinical consultation
													notes, orders, and diagnostic
													data to the central HMS
													(Hospital Management System).
													Discharges patient from waiting
													list.
												</p>
											</div>

											{selectedOutpatient.isDbPatient ? (
												<div className="space-y-2">
													<button
														type="button"
														disabled={isCompleting}
														onClick={() =>
															handleCompleteConsultationDb(
																"lab",
															)
														}
														className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
													>
														{isCompleting ? (
															<Loader2 className="animate-spin h-4 w-4 text-white" />
														) : (
															<CheckCircle2 className="h-4 w-4 text-white" />
														)}
														Order Labs & Route to Cashier
														(YES)
													</button>

													<button
														type="button"
														disabled={isCompleting}
														onClick={() =>
															handleCompleteConsultationDb(
																"pharmacy",
															)
														}
														className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
													>
														{isCompleting ? (
															<Loader2 className="animate-spin h-4 w-4 text-white" />
														) : (
															<CheckCircle2 className="h-4 w-4 text-[#A3D1E0]" />
														)}
														Prescribe & Route to Cashier
														(NO)
													</button>
												</div>
											) : (
												<button
													type="button"
													onClick={
														handleCompleteConsultation
													}
													className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
												>
													<CheckCircle2 className="h-4 w-4 text-[#A3D1E0]" />
													Complete Consultation
												</button>
											)}
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				) : (
					<div className="h-full flex items-center justify-center text-slate-400 text-xs">
						Select an outpatient from the queue to start clinical
						consultations.
					</div>
				)}
			</div>
		</div>
	);
}
