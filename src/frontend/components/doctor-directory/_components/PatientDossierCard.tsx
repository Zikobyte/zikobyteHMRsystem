import {
	Baby,
	Calendar,
	CheckCircle2,
	Eye,
	Flame,
	HeartHandshake,
	MapPin,
	Phone,
	Stethoscope,
	User as UserIcon,
} from "lucide-react";
import type { EnrichedDirectoryPatient } from "../directory-types";
import { calculateAge } from "../_hooks/useClinicalHelpers";
import EmergencySection from "./EmergencySection";
import MaternitySection from "./MaternitySection";
import VitalsMatrix from "./VitalsMatrix";

export interface PatientDossierCardProps {
	patient: EnrichedDirectoryPatient;
	onSelectPatientForConsultation?: (patientId: string) => void;
	onViewFullEmr: (patient: EnrichedDirectoryPatient) => void;
	currentUserName?: string;
}

export default function PatientDossierCard({
	patient,
	onSelectPatientForConsultation,
	onViewFullEmr,
	currentUserName,
}: PatientDossierCardProps) {
	const vitals = patient.effectiveVitals;
	const isMaternity =
		patient.cardType === "Maternity" || Boolean(patient.maternityDetails);
	const isEmergency =
		patient.cardType === "Emergency" || Boolean(patient.emergencyDetails);
	const isStandard = !isMaternity && !isEmergency;

	return (
		<div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden">
			{/* Card Header Bar */}
			<div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-3">
					{/* Monospace Hospital ID badge */}
					<span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-black font-mono tracking-wider shadow-2xs">
						{patient.hospitalNumber || patient.id}
					</span>

					{/* Maternity Number if applicable */}
					{patient.maternityNumber && (
						<span className="px-2.5 py-1 bg-pink-100 text-pink-800 border border-pink-200 rounded-xl text-xs font-black font-mono flex items-center gap-1">
							<Baby className="h-3.5 w-3.5 text-pink-600" />
							{patient.maternityNumber}
						</span>
					)}

					{/* Card Type Tag */}
					{isEmergency ? (
						<span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-black font-mono flex items-center gap-1">
							<Flame className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
							EMERGENCY CARE
						</span>
					) : isMaternity ? (
						<span className="px-2.5 py-1 bg-pink-50 text-pink-700 border border-pink-200 rounded-xl text-xs font-black font-mono flex items-center gap-1">
							<Baby className="h-3.5 w-3.5 text-pink-600" />
							MATERNITY
						</span>
					) : (
						<span className="px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-black font-mono flex items-center gap-1">
							<HeartHandshake className="h-3.5 w-3.5 text-sky-600" />
							STANDARD CARD
						</span>
					)}

					{/* Real-time Status Badge */}
					<span
						className={`px-3 py-1 rounded-xl text-xs font-extrabold font-mono tracking-wider flex items-center gap-1.5 ${
							patient.effectiveStatus?.includes("IN CONSULTATION")
								? "bg-amber-100 text-amber-900 border border-amber-300"
								: patient.effectiveStatus?.includes("LAB")
									? "bg-purple-100 text-purple-900 border border-purple-200"
									: patient.effectiveStatus?.includes("WAITING") ||
										  patient.effectiveStatus?.includes("PENDING")
										? "bg-emerald-100 text-emerald-900 border border-emerald-300"
										: "bg-slate-100 text-slate-700 border border-slate-200"
						}`}
					>
						<span className="w-2 h-2 rounded-full bg-current" />
						{patient.effectiveStatus}
					</span>
				</div>

				{/* Action Controls */}
				<div className="flex items-center gap-2.5">
					{onSelectPatientForConsultation && (
						<button
							onClick={() =>
								onSelectPatientForConsultation(patient.id)
							}
							className="flex items-center gap-2 bg-[#2A758C] hover:bg-[#205b6d] active:scale-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer"
						>
							<Stethoscope className="h-4 w-4" />
							<span>Consult Patient</span>
						</button>
					)}

					<button
						onClick={() => onViewFullEmr(patient)}
						className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 text-xs font-extrabold px-3.5 py-2.5 rounded-2xl transition-all shadow-2xs"
					>
						<Eye className="h-3.5 w-3.5 text-[#2A758C]" />
						<span>Full EMR File</span>
					</button>
				</div>
			</div>

			{/* Card Main Body */}
			<div className="p-5 sm:p-6 space-y-6">
				{/* Patient Basic Identity & Demographics Row */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<p className="text-[11px] font-extrabold uppercase text-slate-400 font-mono tracking-wider">
							Patient Name & Profile
						</p>
						<h2 className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
							<span>{patient.name}</span>
							<span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
								{patient.gender}
							</span>
						</h2>
						<div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
							<span>DOB: {patient.dateOfBirth || "—"}</span>
							<span>•</span>
							<span>Age: {calculateAge(patient.dateOfBirth)}</span>
							<span>•</span>
							<span>
								Marital: {patient.maritalStatus || "Single"}
							</span>
						</div>
					</div>

					<div>
						<p className="text-[11px] font-extrabold uppercase text-slate-400 font-mono tracking-wider">
							Contact & Address
						</p>
						<div className="mt-1 space-y-1 text-xs text-slate-700">
							<p className="flex items-center gap-1.5 font-bold font-mono">
								<Phone className="h-3.5 w-3.5 text-slate-400" />
								{patient.phoneNumber ? (
									<a
										href={`tel:${patient.phoneNumber}`}
										className="hover:text-[#2A758C] hover:underline"
									>
										{patient.phoneNumber}
									</a>
								) : (
									"No phone provided"
								)}
							</p>
							<p className="flex items-center gap-1.5 text-slate-500 truncate">
								<MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
								<span className="truncate">
									{patient.address || "Address unrecorded"}
								</span>
							</p>
						</div>
					</div>

					<div>
						<p className="text-[11px] font-extrabold uppercase text-slate-400 font-mono tracking-wider">
							Registration & Department
						</p>
						<div className="mt-1 space-y-1 text-xs text-slate-600">
							<p className="flex items-center gap-1.5 font-medium">
								<Calendar className="h-3.5 w-3.5 text-slate-400" />
								Registered:{" "}
								{patient.registrationDate
									? new Date(
											patient.registrationDate,
										).toLocaleDateString()
									: "—"}
							</p>
							<p className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
								<UserIcon className="h-3 w-3 text-slate-400" />
								By: {patient.registeredBy || "Clinical Staff"}
							</p>
						</div>
					</div>
				</div>

				{/* Vitals Matrix Section (Real-Time Accurate) */}
				<VitalsMatrix vitals={vitals} />

				{/* Specialized Clinical Data: Maternity Details (if Maternity) */}
				{isMaternity && <MaternitySection patient={patient} />}

				{/* Specialized Clinical Data: Emergency Details (if Emergency) */}
				{isEmergency && (
					<EmergencySection
						patient={patient}
						currentUserName={currentUserName}
					/>
				)}

				{/* Standard Clinical Directives & Notes (if Standard) */}
				{isStandard && (
					<div className="bg-sky-50/40 rounded-2xl p-4 border border-sky-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
						<div>
							<p className="font-extrabold text-slate-800 flex items-center gap-1.5">
								<CheckCircle2 className="h-3.5 w-3.5 text-sky-600" />
								<span>
									General Outpatient Consultation Protocol
								</span>
							</p>
							<p className="text-slate-500 text-[11px] mt-0.5">
								Patient eligible for standard specialist review,
								routine diagnostic orders, and pharmacy
								prescriptions.
							</p>
						</div>
						<div className="flex items-center gap-2">
							<span className="px-2.5 py-1 bg-white border border-sky-200 rounded-xl text-sky-900 font-mono font-bold text-[11px]">
								Account Balance: ₦
								{Number(patient.balance || 0).toLocaleString()}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
