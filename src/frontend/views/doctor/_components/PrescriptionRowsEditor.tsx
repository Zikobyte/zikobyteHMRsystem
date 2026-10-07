/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx (Prescribe Medications section).
 * Verbatim JSX — dynamic drug rows, priced total, send-to-cashier, and
 * prescribed-medicines summary. Rows and callbacks arrive as props.
 * (The original Lucide `title` prop on the add-row icon — a tsc error —
 * is now aria-label; no visual change.)
 */

import {
	Loader2,
	Pill,
	Plus,
	PlusCircle,
	Trash2,
} from "lucide-react";
import {
	MEDICATIONS_CATALOG,
	getMedicationPrice,
} from "../_utils/doctor-catalog";
import type { PrescribedMed, PrescriptionRow } from "../_utils/doctor-types";

export interface PrescriptionRowsEditorProps {
	rows: PrescriptionRow[];
	prescribedMedications: PrescribedMed[];
	isCompleting: boolean;
	onAddRow: () => void;
	onRemoveRow: (id: string) => void;
	onUpdateRow: (id: string, field: 'name' | 'dose' | 'frequency' | 'duration', value: string) => void;
	onRemovePrescription: (prescId: string) => void;
	onSendMeds: () => void;
}

export default function PrescriptionRowsEditor({
	rows: prescriptionRows,
	prescribedMedications,
	isCompleting,
	onAddRow: handleAddMedicationRow,
	onRemoveRow: handleRemoveMedicationRow,
	onUpdateRow: handleUpdateMedicationRow,
	onRemovePrescription: handleRemoveOutpatientPrescription,
	onSendMeds: handleSendMedsToCashierDb,
}: PrescriptionRowsEditorProps) {
	return (
		<div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
			<div className="flex items-center justify-between">
				<h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
					<PlusCircle
						className="h-4.5 w-4.5 text-[#2A758C] cursor-pointer hover:scale-110 active:scale-95 transition-all"
						onClick={handleAddMedicationRow}
						aria-label="Add medication row"
					/>
					Prescribe Medications
				</h4>
				<button
					type="button"
					onClick={handleAddMedicationRow}
					className="text-xs font-bold text-[#2A758C] hover:text-[#1f596b] flex items-center gap-1 bg-[#2A758C]/5 px-2.5 py-1 rounded-lg border border-[#2A758C]/10 hover:bg-[#2A758C]/10 transition-all cursor-pointer"
				>
					<Plus className="h-3.5 w-3.5" /> Add
					Drug Row
				</button>
			</div>

			<div className="space-y-3">
				{prescriptionRows.map((row, index) => (
					<div
						key={row.id}
						className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
					>
						<div className="space-y-1">
							{index === 0 && (
								<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
									Drug Name
								</label>
							)}
							<input
								type="text"
								list="meds-list"
								value={row.name}
								onChange={(e) =>
									handleUpdateMedicationRow(
										row.id,
										"name",
										e.target.value,
									)
								}
								placeholder="e.g. Paracetamol"
								className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
							/>
							{index === 0 && (
								<datalist id="meds-list">
									{MEDICATIONS_CATALOG.map(
										(m) => (
											<option
												key={m}
												value={m}
											/>
										),
									)}
								</datalist>
							)}
						</div>

						<div className="space-y-1">
							{index === 0 && (
								<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
									Dosage
								</label>
							)}
							<input
								type="text"
								placeholder="e.g. 500mg, 1g"
								value={row.dose}
								onChange={(e) =>
									handleUpdateMedicationRow(
										row.id,
										"dose",
										e.target.value,
									)
								}
								className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
							/>
						</div>

						<div className="space-y-1">
							{index === 0 && (
								<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
									Frequency
								</label>
							)}
							<select
								value={row.frequency}
								onChange={(e) =>
									handleUpdateMedicationRow(
										row.id,
										"frequency",
										e.target.value,
									)
								}
								className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2A758C] cursor-pointer"
							>
								<option value="">
									Select frequency...
								</option>
								<option value="OD (Once Daily)">
									OD (Once Daily)
								</option>
								<option value="BD (Twice Daily)">
									BD (Twice Daily)
								</option>
								<option value="TDS (Three Times Daily)">
									TDS (Three Times Daily)
								</option>
								<option value="QDS (Four Times Daily)">
									QDS (Four Times Daily)
								</option>
								<option value="STAT (Immediately)">
									STAT (Immediately)
								</option>
								<option value="PRN (As Needed)">
									PRN (As Needed)
								</option>
								<option value="Nocte (At Bedtime)">
									Nocte (At Bedtime)
								</option>
								<option value="q4h (Every 4 Hours)">
									q4h (Every 4 Hours)
								</option>
								<option value="q6h (Every 6 Hours)">
									q6h (Every 6 Hours)
								</option>
								<option value="q8h (Every 8 Hours)">
									q8h (Every 8 Hours)
								</option>
								<option value="q12h (Every 12 Hours)">
									q12h (Every 12 Hours)
								</option>
								<option value="Weekly">
									Weekly
								</option>
								{row.frequency &&
									![
										"OD (Once Daily)",
										"BD (Twice Daily)",
										"TDS (Three Times Daily)",
										"QDS (Four Times Daily)",
										"STAT (Immediately)",
										"PRN (As Needed)",
										"Nocte (At Bedtime)",
										"q4h (Every 4 Hours)",
										"q6h (Every 6 Hours)",
										"q8h (Every 8 Hours)",
										"q12h (Every 12 Hours)",
										"Weekly",
									].includes(
										row.frequency,
									) && (
										<option
											value={
												row.frequency
											}
										>
											{row.frequency}
										</option>
									)}
							</select>
						</div>

						<div className="space-y-1">
							{index === 0 && (
								<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
									Duration
								</label>
							)}
							<div className="flex gap-2">
								<input
									type="text"
									placeholder="e.g. 5 days, 1 week"
									value={row.duration}
									onChange={(e) =>
										handleUpdateMedicationRow(
											row.id,
											"duration",
											e.target.value,
										)
									}
									className="w-full bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl text-slate-800 focus:outline-none"
								/>
								<div className="flex gap-1 shrink-0">
									{prescriptionRows.length >
										1 && (
										<button
											type="button"
											onClick={() =>
												handleRemoveMedicationRow(
													row.id,
												)
											}
											className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl font-bold cursor-pointer border border-rose-100 flex items-center justify-center transition-all"
											title="Remove medication"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									)}
									{index ===
										prescriptionRows.length -
											1 && (
										<button
											type="button"
											onClick={
												handleAddMedicationRow
											}
											className="bg-[#2A758C] hover:bg-[#1f596b] text-white p-2 rounded-xl font-bold cursor-pointer flex items-center justify-center transition-all"
											title="Add another medication"
										>
											<Plus className="h-4 w-4" />
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Real-time calculated price total & Send to Cashier button for prescribed medications */}
			{prescriptionRows.some(
				(r) => r.name && r.name.trim() !== "",
			) && (
				<div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<div className="text-sm font-black text-slate-800 font-mono">
						Total:{" "}
						<span className="text-[#2A758C]">
							₦
							{prescriptionRows
								.filter(
									(r) =>
										r.name &&
										r.name.trim() !== "",
								)
								.reduce(
									(sum, r) =>
										sum +
										getMedicationPrice(
											r.name.trim(),
										),
									0,
								)
								.toLocaleString()}
						</span>
						<span className="text-[10px] text-slate-400 font-normal ml-2">
							(
							{
								prescriptionRows.filter(
									(r) =>
										r.name &&
										r.name.trim() !== "",
								).length
							}{" "}
							drug
							{prescriptionRows.filter(
								(r) =>
									r.name &&
									r.name.trim() !== "",
							).length > 1
								? "s"
								: ""}
							)
						</span>
					</div>
					<button
						type="button"
						disabled={isCompleting}
						onClick={handleSendMedsToCashierDb}
						className="flex items-center justify-center gap-2 bg-[#2A758C] hover:bg-[#1f5869] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isCompleting ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Pill className="w-4 h-4" />
						)}
						<span>
							Send to Cashier for Pharmacy
							Payment
						</span>
					</button>
				</div>
			)}

			{/* Active prescriptions summary view */}
			{prescribedMedications &&
				prescribedMedications
					.length > 0 && (
					<div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
						<span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-2">
							Prescribed Medicines Summary
						</span>
						<div className="space-y-2">
							{prescribedMedications.map(
								(m) => (
									<div
										key={m.id}
										className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-slate-150"
									>
										<div>
											<p className="text-xs font-bold text-slate-800">
												{m.name}
											</p>
											<p className="text-[10px] text-slate-400 font-mono mt-0.5">
												{m.dose} —{" "}
												{m.frequency} —
												for {m.duration}
											</p>
										</div>
										<button
											type="button"
											onClick={() =>
												handleRemoveOutpatientPrescription(
													m.id,
												)
											}
											className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									</div>
								),
							)}
						</div>
					</div>
				)}
		</div>
	);
}
