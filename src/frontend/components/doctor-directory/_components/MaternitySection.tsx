import { Baby } from "lucide-react";
import type { EnrichedDirectoryPatient } from "../directory-types";

export interface MaternitySectionProps {
	patient: EnrichedDirectoryPatient;
}

export default function MaternitySection({ patient }: MaternitySectionProps) {
	return (
		<div className="bg-pink-50/50 rounded-2xl p-4 border border-pink-200/70 space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-xs font-black text-pink-900 uppercase tracking-wider font-mono flex items-center gap-2">
					<Baby className="h-4 w-4 text-pink-600" />
					Accurate Obstetric & Antenatal Dossier
				</span>
				<span className="text-[10px] font-bold text-pink-700 font-mono">
					Maternity Protocol Active
				</span>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
				<div className="bg-white p-2.5 rounded-xl border border-pink-100">
					<p className="text-[10px] font-bold text-slate-400 font-mono">
						Gravida (Total)
					</p>
					<p className="text-sm font-black text-pink-950 font-mono mt-0.5">
						{patient.maternityDetails?.gravida || patient.gravida || "0"}
					</p>
				</div>

				<div className="bg-white p-2.5 rounded-xl border border-pink-100">
					<p className="text-[10px] font-bold text-slate-400 font-mono">
						Para (Viable Births)
					</p>
					<p className="text-sm font-black text-pink-950 font-mono mt-0.5">
						{patient.maternityDetails?.para || patient.para || "0"}
					</p>
				</div>

				<div className="bg-white p-2.5 rounded-xl border border-pink-100">
					<p className="text-[10px] font-bold text-slate-400 font-mono">
						Last Menstrual (LMP)
					</p>
					<p className="text-xs font-black text-slate-900 font-mono mt-0.5">
						{patient.maternityDetails?.lmp || patient.lmp || "—"}
					</p>
				</div>

				<div className="bg-white p-2.5 rounded-xl border border-pink-100">
					<p className="text-[10px] font-bold text-slate-400 font-mono">
						Estimated Due (EDD)
					</p>
					<p className="text-xs font-black text-rose-600 font-mono mt-0.5">
						{patient.maternityDetails?.edd || patient.edd || "—"}
					</p>
				</div>

				<div className="bg-white p-2.5 rounded-xl border border-pink-100">
					<p className="text-[10px] font-bold text-slate-400 font-mono">
						Gestational Age
					</p>
					<p className="text-xs font-black text-slate-900 font-mono mt-0.5">
						{patient.maternityDetails?.gestationalAge ||
							patient.gestationalAge ||
							"Calculated at exam"}
					</p>
				</div>

				<div className="bg-white p-2.5 rounded-xl border border-pink-100">
					<p className="text-[10px] font-bold text-slate-400 font-mono">
						Tribe / Ethnicity
					</p>
					<p className="text-xs font-black text-slate-900 font-mono mt-0.5">
						{patient.maternityDetails?.tribe || patient.tribe || "—"}
					</p>
				</div>
			</div>

			{/* Next of Kin / Partner */}
			<div className="bg-white p-3 rounded-xl border border-pink-100 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600">
				<div>
					<span className="font-bold text-slate-700">
						Spouse / Next of Kin:{" "}
					</span>
					<span>
						{patient.nextOfKinName || "—"} (
						{patient.nextOfKinRelationship || "Partner"})
					</span>
				</div>
				<div>
					<span className="font-bold text-slate-700">Phone: </span>
					<span className="font-mono">{patient.nextOfKinPhone || "—"}</span>
				</div>
			</div>
		</div>
	);
}
