/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (ADMITTED branch).
 *
 * AdmittedTab: admitted-patients queue list + header profile card,
 * record date filter, sub-tab bar, and sub-tab content (overview,
 * vitals, medications, observations, charges, new orders — each a
 * separate file under ./admitted/). Verbatim JSX — state and handlers
 * arrive via the admitted-orders hook result + props.
 */

import { Calendar, History, LogOut, X } from "lucide-react";
import ExportButton from "@/components/shared/ExportButton";
import type { UseAdmittedOrdersResult } from "../_hooks/useAdmittedOrders";
import type {
	AdmittedPatient,
	AdmittedSubTab,
	DoctorNotify,
} from "../_utils/doctor-types";
import ChargesTab from "./admitted/ChargesTab";
import MedicationsTab from "./admitted/MedicationsTab";
import NewOrdersTab from "./admitted/NewOrdersTab";
import ObservationsTab from "./admitted/ObservationsTab";
import OverviewTab from "./admitted/OverviewTab";
import VitalsTab from "./admitted/VitalsTab";

export interface AdmittedTabProps {
	queue: AdmittedPatient[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	admitted: UseAdmittedOrdersResult;
	onOpenHistory: (patientId: string) => void;
	notify: DoctorNotify;
}

const ADMITTED_SUB_TABS: { id: AdmittedSubTab; label: string }[] = [
	{ id: "overview", label: "Overview & Notes" },
	{ id: "vitals", label: "Vitals" },
	{ id: "medications", label: "Medications" },
	{ id: "observations", label: "Observations" },
	{ id: "charges", label: "Charges" },
	{ id: "new_orders", label: "New Orders" },
];

export default function AdmittedTab({
	queue: filteredAdmittedPatients,
	selectedId: selectedAdmittedId,
	onSelect,
	admitted,
	onOpenHistory: handleOpenPatientHistory,
	notify: showToast,
}: AdmittedTabProps) {
	const {
		selectedAdmitted,
		admittedSubTab,
		setAdmittedSubTab,
		recordDateFilter,
		setRecordDateFilter,
		admittedNotesInput,
		setAdmittedNotesInput,
		admittedDoctorOrdersInput,
		setAdmittedDoctorOrdersInput,
		handleSaveAdmittedNotes,
		handleSaveDoctorOrders,
		handleOpenDischargeModal,
		handleUpdateOrderStatus,
		setAdministerModalOpen,
		setSelectedMedToAdminister,
		handleCancelMedication,
		setAddMedLogModalOpen,
		setObsModalOpen,
		orderType,
		setOrderType,
		medOrderItems,
		setMedOrderItems,
		injOrderItems,
		setInjOrderItems,
		labOrderTests,
		setLabOrderTests,
		orderNotes,
		setOrderNotes,
		handleSendOrder,
	} = admitted;

	return (
		/* Main Grid View */
		<div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
			{/* Left Side: Patient Queue/List */}
			<div className="w-full lg:w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 h-64 lg:h-auto overflow-y-auto">
				<div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
					<span className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
						Admitted Patients
					</span>
					<span className="px-2 py-0.5 bg-slate-200/60 rounded-full text-[10px] font-bold text-slate-600">
						{filteredAdmittedPatients.length}{" "}
						Active
					</span>
				</div>

				<div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
					{filteredAdmittedPatients.length === 0 ? (
						<div className="p-8 text-center text-slate-400 text-xs">
							No admitted patients found.
						</div>
					) : (
						filteredAdmittedPatients.map((p, idx) => {
							const isSelected = selectedAdmittedId === p.id;
							return (
								<div
									key={
										p.queueId
											? `admitted-q-${p.queueId}`
											: `admitted-${p.id}-${idx}`
									}
									onClick={() => onSelect(p.id)}
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
										<span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[9px] font-bold rounded uppercase tracking-wider font-mono">
											{p.department || "General"}
										</span>
									</div>

									<p className="text-xs text-slate-600 mt-2 font-medium">
										{p.ward} – Bed {p.bed}
									</p>

									<div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
										<span>Since {p.since}</span>
										<span className="text-[#2A758C] font-bold">
											₦
											{Number(
												p.dischargeBill || 0,
											).toLocaleString()}
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
				{selectedAdmitted ? (
					<div className="max-w-4xl mx-auto space-y-6">
						{/* Header Profile Info card for Admitted Patients */}
						<div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
							<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
								<div>
									<div className="flex items-center gap-2.5">
										<h3 className="text-xl font-black text-slate-900">
											{selectedAdmitted.name}
										</h3>
										<span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest bg-sky-100 text-sky-800 border border-sky-200 font-mono uppercase">
											ADMITTED
										</span>
									</div>
									<p className="text-xs text-slate-500 font-mono mt-1">
										{selectedAdmitted.id} |{" "}
										{selectedAdmitted.gender} | DOB:{" "}
										{selectedAdmitted.dateOfBirth}
									</p>
									<p className="text-xs text-[#2A758C] font-semibold mt-2">
										{selectedAdmitted.ward} – Bed{" "}
										{selectedAdmitted.bed}
									</p>
									<p className="text-[11px] text-slate-400 font-mono mt-1">
										Admitted: {selectedAdmitted.admittedDate}
									</p>
								</div>

								<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
									<div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3.5 text-right justify-between sm:justify-end">
										<div>
											<span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
												Discharge bill
											</span>
											<span className="text-sm font-extrabold text-slate-800">
												₦
												{Number(
													selectedAdmitted.dischargeBill ||
														0,
												).toLocaleString()}
											</span>
										</div>
									</div>

									<button
										type="button"
										onClick={() =>
											handleOpenPatientHistory(
												selectedAdmitted.hospitalNumber ||
													selectedAdmitted.id,
											)
										}
										className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs"
										title="View patient history, previous consultations, vitals & lab records"
									>
										<History className="h-3.5 w-3.5 text-indigo-600" />
										<span>History</span>
									</button>

									<button
										type="button"
										onClick={() =>
											handleOpenPatientHistory(
												selectedAdmitted.hospitalNumber ||
													selectedAdmitted.id,
											)
										}
										className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs"
										title="View patient history, previous consultations, vitals & lab records"
									>
										<History className="h-3.5 w-3.5 text-indigo-600" />
										<span>History</span>
									</button>

									<ExportButton
										exportType="medical-records"
										patientId={
											selectedAdmitted.hospitalNumber ||
											selectedAdmitted.id
										}
										label="Download HMS"
										className="bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 font-extrabold shadow-xs"
										onSuccess={(msg) => showToast(msg)}
										onFailure={(msg) => showToast(msg)}
									/>

									<button
										type="button"
										onClick={handleOpenDischargeModal}
										className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
									>
										<LogOut className="h-3.5 w-3.5 text-white" />
										<span>Discharge Patient</span>
									</button>
								</div>
							</div>

							{/* Filter records for specific date */}
							<div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
								<div className="flex items-center gap-3">
									<span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
										<Calendar className="h-3.5 w-3.5 text-[#2A758C]" />
										View records for:
									</span>
									<div className="relative">
										<input
											type="date"
											value={recordDateFilter}
											onChange={(e) =>
												setRecordDateFilter(e.target.value)
											}
											className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2A758C]"
										/>
									</div>
									{recordDateFilter && (
										<button
											type="button"
											onClick={() => setRecordDateFilter("")}
											className="text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer flex items-center gap-1"
										>
											<X className="h-3 w-3" /> Clear Filter
										</button>
									)}
								</div>
								{recordDateFilter && (
									<span className="text-[11px] font-mono text-[#2A758C] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 font-semibold">
										Filtering records for: {recordDateFilter}
									</span>
								)}
							</div>
						</div>

						{/* Sub Tab selection for Admitted Patient details */}
						<div className="flex border-b border-slate-200 bg-white p-1 rounded-xl border">
							{ADMITTED_SUB_TABS.map((subTab) => (
								<button
									key={subTab.id}
									onClick={() =>
										setAdmittedSubTab(subTab.id)
									}
									className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
										admittedSubTab === subTab.id
											? "bg-[#A3D1E0] text-slate-950 font-black shadow-xs"
											: "text-slate-400 hover:text-slate-700"
									}`}
								>
									{subTab.label}
								</button>
							))}
						</div>

						{/* Inner tab contents */}
						<div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm min-h-[300px]">
							{/* OVERVIEW TAB */}
							{admittedSubTab === "overview" && (
								<OverviewTab
									patient={selectedAdmitted}
									notesInput={admittedNotesInput}
									ordersInput={admittedDoctorOrdersInput}
									onNotesChange={setAdmittedNotesInput}
									onOrdersChange={setAdmittedDoctorOrdersInput}
									onSaveNotes={handleSaveAdmittedNotes}
									onSaveOrders={handleSaveDoctorOrders}
								/>
							)}

							{/* VITALS TAB */}
							{admittedSubTab === "vitals" && (
								<VitalsTab
									patient={selectedAdmitted}
									dateFilter={recordDateFilter}
									onClearDateFilter={() => setRecordDateFilter("")}
								/>
							)}

							{/* MEDICATIONS TAB */}
							{admittedSubTab === "medications" && (
								<MedicationsTab
									patient={selectedAdmitted}
									dateFilter={recordDateFilter}
									onClearDateFilter={() => setRecordDateFilter("")}
									onAddLog={() => setAddMedLogModalOpen(true)}
									onAdminister={(med) => {
										setSelectedMedToAdminister(med);
										setAdministerModalOpen(true);
									}}
									onCancel={handleCancelMedication}
								/>
							)}

							{/* OBSERVATIONS TAB */}
							{admittedSubTab === "observations" && (
								<ObservationsTab
									patient={selectedAdmitted}
									dateFilter={recordDateFilter}
									onClearDateFilter={() => setRecordDateFilter("")}
									onAdd={() => setObsModalOpen(true)}
								/>
							)}

							{/* CHARGES TAB */}
							{admittedSubTab === "charges" && (
								<ChargesTab
									patient={selectedAdmitted}
									dateFilter={recordDateFilter}
									onClearDateFilter={() => setRecordDateFilter("")}
								/>
							)}

							{/* NEW ORDERS TAB */}
							{admittedSubTab === "new_orders" && (
								<NewOrdersTab
									patient={selectedAdmitted}
									orderType={orderType}
									onOrderTypeChange={setOrderType}
									medItems={medOrderItems}
									onMedItemsChange={setMedOrderItems}
									injItems={injOrderItems}
									onInjItemsChange={setInjOrderItems}
									labTests={labOrderTests}
									onLabTestsChange={setLabOrderTests}
									orderNotes={orderNotes}
									onOrderNotesChange={setOrderNotes}
									onSendOrder={handleSendOrder}
									onUpdateOrderStatus={handleUpdateOrderStatus}
								/>
							)}
						</div>
					</div>
				) : (
					<div className="h-full flex items-center justify-center text-slate-400 text-xs">
						Select an admitted patient to review history logs and
						place orders.
					</div>
				)}
			</div>
		</div>
	);
}
