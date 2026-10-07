import { Flame, ShieldAlert } from "lucide-react";
import type { EnrichedDirectoryPatient } from "../directory-types";

export interface EmergencySectionProps {
	patient: EnrichedDirectoryPatient;
	currentUserName?: string;
}

export default function EmergencySection({
	patient,
	currentUserName,
}: EmergencySectionProps) {
	const cashCollected = Number(
		patient.cashCollected ||
			patient.emergencyDetails?.cashCollected ||
			0,
	);
	const totalBill = Number(
		patient.totalBillAmount ||
			patient.emergencyDetails?.totalBillAmount ||
			0,
	);

	return (
		<div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-200/70 space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-xs font-black text-rose-900 uppercase tracking-wider font-mono flex items-center gap-2">
					<Flame className="h-4 w-4 text-rose-600 animate-pulse" />
					Accurate Emergency Triage & Incident Intake Protocol
				</span>
				<span className="text-[10px] font-black px-2 py-0.5 bg-rose-600 text-white rounded-md uppercase font-mono">
					Priority Red
				</span>
			</div>

			{/* Emergency Incident Nature */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<div className="bg-white p-3 rounded-xl border border-rose-100">
					<p className="text-[10px] font-bold text-slate-400 font-mono">
						Emergency Category
					</p>
					<p className="text-xs font-black text-rose-700 uppercase font-mono mt-0.5">
						{patient.emergencyDetails?.isAccident
							? "Road Traffic Accident (RTA)"
							: patient.emergencyDetails?.isUnbookedLabour
								? "Unbooked Labour"
								: patient.emergencyDetails?.isSickEmergency
									? "Acute Sick Emergency"
									: "Acute Emergency Intake"}
					</p>
				</div>

				<div className="bg-white p-3 rounded-xl border border-rose-100">
					<p className="text-[10px] font-bold text-slate-400 font-mono">
						Doctor on Call
					</p>
					<p className="text-xs font-black text-slate-900 font-mono mt-0.5">
						{patient.doctorOnCallName ||
							patient.doctor_on_call_name ||
							currentUserName ||
							"On-Call Medical Officer"}
					</p>
				</div>

				<div className="bg-white p-3 rounded-xl border border-rose-100">
					<p className="text-[10px] font-bold text-slate-400 font-mono">
						Emergency Deposit / Bill
					</p>
					<p className="text-xs font-black text-emerald-700 font-mono mt-0.5">
						Cash: ₦{cashCollected.toLocaleString()}
						{totalBill > 0 &&
							` / Total: ₦${totalBill.toLocaleString()}`}
					</p>
				</div>
			</div>

			{/* Informant / Brought In By */}
			<div className="bg-white p-3 rounded-xl border border-rose-100 text-xs text-slate-700 space-y-1">
				<p className="font-extrabold text-slate-900 flex items-center gap-1.5">
					<ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
					<span>Brought In By (Informant / Escort):</span>
					<span className="font-bold text-[#2A758C]">
						{patient.broughtInByName ||
							patient.brought_in_by_name ||
							"Unaccompanied / Self"}
					</span>
				</p>
				<div className="flex flex-wrap items-center gap-4 text-slate-500 font-mono text-[11px] pt-0.5">
					<span>
						Phone:{" "}
						{patient.broughtInByPhone ||
							patient.brought_in_by_phone ||
							"—"}
					</span>
					<span>•</span>
					<span>
						Rel:{" "}
						{patient.broughtInByRelationship ||
							patient.brought_in_by_relationship ||
							"Good Samaritan"}
					</span>
					<span>•</span>
					<span>
						ID: {patient.broughtInByIdType || "National ID"} (
						{patient.broughtInByIdNumber || "—"})
					</span>
				</div>
			</div>

			{/* Custom Details / Incident Notes */}
			{(patient.emergencyDetails?.customDetails ||
				patient.custom_details) && (
				<div className="bg-white p-3 rounded-xl border border-rose-100 text-xs">
					<p className="text-[10px] font-bold text-slate-400 font-mono uppercase">
						Arrival Incident Notes:
					</p>
					<p className="text-slate-800 font-mono text-xs mt-1 bg-slate-50 p-2 rounded-lg">
						{patient.emergencyDetails?.customDetails ||
							patient.custom_details}
					</p>
				</div>
			)}
		</div>
	);
}
