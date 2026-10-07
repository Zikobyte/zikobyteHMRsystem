import { RefreshCw, Search } from "lucide-react";
import type {
	DirectoryCategory,
	EnrichedDirectoryPatient,
	SpecializedSubFilter,
} from "../directory-types";
import PatientDossierCard from "./PatientDossierCard";

export interface PatientDossierGridProps {
	isLoading: boolean;
	filteredPatients: EnrichedDirectoryPatient[];
	searchQuery: string;
	activeCategory: DirectoryCategory;
	specializedSubFilter: SpecializedSubFilter;
	onClearSearch: () => void;
	onSelectPatientForConsultation?: (patientId: string) => void;
	onViewFullEmr: (patient: EnrichedDirectoryPatient) => void;
	currentUserName?: string;
}

export default function PatientDossierGrid({
	isLoading,
	filteredPatients,
	searchQuery,
	activeCategory,
	specializedSubFilter,
	onClearSearch,
	onSelectPatientForConsultation,
	onViewFullEmr,
	currentUserName,
}: PatientDossierGridProps) {
	if (isLoading) {
		return (
			<div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-2xs space-y-3">
				<RefreshCw className="h-8 w-8 text-[#2A758C] animate-spin mx-auto" />
				<p className="text-sm font-bold text-slate-700">
					Loading authoritative patient records...
				</p>
				<p className="text-xs text-slate-400">
					Verifying relational database models and clinical queues
				</p>
			</div>
		);
	}

	if (filteredPatients.length === 0) {
		return (
			<div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-2xs space-y-3">
				<div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
					<Search className="h-6 w-6" />
				</div>
				<h3 className="text-base font-extrabold text-slate-800">
					No Patient Records Found
				</h3>
				<p className="text-xs text-slate-500 max-w-md mx-auto">
					{searchQuery
						? `No matches found for query "${searchQuery}". Try searching with a different term.`
						: `There are currently no patients categorized under ${
								activeCategory === "standard"
									? "Standard Cards"
									: specializedSubFilter.toUpperCase()
							}.`}
				</p>
				{searchQuery && (
					<button
						onClick={onClearSearch}
						className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
					>
						Clear Search
					</button>
				)}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-5">
			{filteredPatients.map((patient) => (
				<PatientDossierCard
					key={patient.id}
					patient={patient}
					onSelectPatientForConsultation={
						onSelectPatientForConsultation
					}
					onViewFullEmr={onViewFullEmr}
					currentUserName={currentUserName}
				/>
			))}
		</div>
	);
}
