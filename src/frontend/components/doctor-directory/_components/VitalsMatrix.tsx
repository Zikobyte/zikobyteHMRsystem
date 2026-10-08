import { Activity } from "lucide-react";
import type { ResolvedVitals } from "../directory-types";
import { calculateBMI, getBPCategory } from "../_hooks/useClinicalHelpers";

export interface VitalsMatrixProps {
	vitals?: ResolvedVitals;
}

export default function VitalsMatrix({ vitals }: VitalsMatrixProps) {
	const bpCategory = getBPCategory(vitals?.bloodPressure);
	const bmi = calculateBMI(vitals?.weight, vitals?.height);

	return (
		<div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70">
			<div className="flex items-center justify-between mb-3">
				<span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
					<Activity className="h-4 w-4 text-[#2A758C]" />
					Clinical Vital Signs Matrix
				</span>
				{bpCategory && (
					<span
						className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${bpCategory.color}`}
					>
						{bpCategory.label}
					</span>
				)}
			</div>

			{vitals &&
			(vitals.bloodPressure ||
				vitals.pulseRate ||
				vitals.temperature ||
				vitals.weight) ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
					{/* BP */}
					<div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
						<p className="text-[10px] font-bold text-slate-400 uppercase font-mono">
							Blood Pressure
						</p>
						<p className="text-sm font-black text-slate-900 font-mono mt-0.5">
							{vitals.bloodPressure || "—"}
						</p>
						<p className="text-[9px] text-slate-400 font-medium">mmHg</p>
					</div>

					{/* Heart Rate / Pulse */}
					<div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
						<p className="text-[10px] font-bold text-slate-400 uppercase font-mono">
							Pulse Rate
						</p>
						<p className="text-sm font-black text-slate-900 font-mono mt-0.5">
							{vitals.pulseRate ? `${vitals.pulseRate} bpm` : "—"}
						</p>
						<p className="text-[9px] text-slate-400 font-medium">
							Resting HR
						</p>
					</div>

					{/* Temperature */}
					<div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
						<p className="text-[10px] font-bold text-slate-400 uppercase font-mono">
							Temperature
						</p>
						<p
							className={`text-sm font-black font-mono mt-0.5 ${
								vitals.temperature && vitals.temperature >= 38
									? "text-rose-600"
									: "text-slate-900"
							}`}
						>
							{vitals.temperature ? `${vitals.temperature} °C` : "—"}
						</p>
						<p className="text-[9px] text-slate-400 font-medium">
							Axillary / Core
						</p>
					</div>

					{/* Respiratory Rate */}
					<div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
						<p className="text-[10px] font-bold text-slate-400 uppercase font-mono">
							Resp. Rate
						</p>
						<p className="text-sm font-black text-slate-900 font-mono mt-0.5">
							{vitals.respiratoryRate
								? `${vitals.respiratoryRate} /min`
								: "—"}
						</p>
						<p className="text-[9px] text-slate-400 font-medium">
							Cycles / min
						</p>
					</div>

					{/* SpO2 */}
					<div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
						<p className="text-[10px] font-bold text-slate-400 uppercase font-mono">
							Oxygen (SpO₂)
						</p>
						<p
							className={`text-sm font-black font-mono mt-0.5 ${
								vitals.spo2 && vitals.spo2 < 95
									? "text-amber-600"
									: "text-slate-900"
							}`}
						>
							{vitals.spo2 ? `${vitals.spo2} %` : "—"}
						</p>
						<p className="text-[9px] text-slate-400 font-medium">
							Pulse Oximetry
						</p>
					</div>

					{/* Weight & BMI */}
					<div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
						<p className="text-[10px] font-bold text-slate-400 uppercase font-mono">
							Weight / BMI
						</p>
						<p className="text-sm font-black text-slate-900 font-mono mt-0.5">
							{vitals.weight ? `${vitals.weight} kg` : "—"}
						</p>
						<p className="text-[9px] text-slate-400 font-medium">
							{bmi ? `BMI: ${bmi}` : "No height recorded"}
						</p>
					</div>
				</div>
			) : (
				<div className="text-center py-4 bg-white rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
					Vital signs not yet recorded for this patient. Ready for nursing
					intake triage.
				</div>
			)}
		</div>
	);
}
