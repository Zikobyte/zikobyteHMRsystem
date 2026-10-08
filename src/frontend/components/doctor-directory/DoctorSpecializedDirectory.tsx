import { useState } from "react";
import type { User } from "../../types";
import PatientDetailModal from "../patient-detail/PatientDetailModal";
import DirectoryFilterBar from "./_components/DirectoryFilterBar";
import DirectoryHeader from "./_components/DirectoryHeader";
import DirectorySearchBar from "./_components/DirectorySearchBar";
import PatientDossierGrid from "./_components/PatientDossierGrid";
import { useDoctorDirectoryData } from "./_hooks/useDoctorDirectoryData";
import type { EnrichedDirectoryPatient } from "./directory-types";

interface DoctorSpecializedDirectoryProps {
	initialCategory?: "standard" | "specialized" | "maternity" | "emergency";
	onSelectPatientForConsultation?: (patientId: string) => void;
	onBackToQueue?: () => void;
	currentUser?: User | null;
}

export default function DoctorSpecializedDirectory({
	initialCategory = "standard",
	onSelectPatientForConsultation,
	onBackToQueue,
	currentUser,
}: DoctorSpecializedDirectoryProps) {
	const {
		activeCategory,
		setActiveCategory,
		specializedSubFilter,
		setSpecializedSubFilter,
		isLoading,
		isRefreshing,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		fetchData,
		standardPatients,
		maternityPatients,
		emergencyPatients,
		specializedPatients,
		currentPool,
		filteredPatients,
	} = useDoctorDirectoryData(initialCategory);

	const [selectedPatientForModal, setSelectedPatientForModal] =
		useState<EnrichedDirectoryPatient | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="flex flex-col h-full bg-[#F8FAFC] overflow-y-auto">
			{/* Top Banner & Context Header */}
			<DirectoryHeader
				activeCategory={activeCategory}
				standardCount={standardPatients.length}
				specializedCount={specializedPatients.length}
				onBackToQueue={onBackToQueue}
				onSelectStandard={() => {
					setActiveCategory("standard");
					setSearchQuery("");
				}}
				onSelectSpecialized={() => {
					setActiveCategory("specialized");
					setSearchQuery("");
				}}
			/>

			{/* Main Content Area */}
			<div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
				{/* Sub-Filters / Metric Ribbons */}
				<DirectoryFilterBar
					activeCategory={activeCategory}
					specializedSubFilter={specializedSubFilter}
					onSubFilterChange={setSpecializedSubFilter}
					standardCount={standardPatients.length}
					specializedCount={specializedPatients.length}
					maternityCount={maternityPatients.length}
					emergencyCount={emergencyPatients.length}
					isRefreshing={isRefreshing}
					onRefresh={fetchData}
				/>

				{/* Search & Quick Status Filters */}
				<DirectorySearchBar
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					statusFilter={statusFilter}
					onStatusChange={setStatusFilter}
					currentCount={currentPool.length}
					activeCategory={activeCategory}
				/>

				{/* Patient Dossiers Grid */}
				<PatientDossierGrid
					isLoading={isLoading}
					filteredPatients={filteredPatients}
					searchQuery={searchQuery}
					activeCategory={activeCategory}
					specializedSubFilter={specializedSubFilter}
					onClearSearch={() => setSearchQuery("")}
					onSelectPatientForConsultation={
						onSelectPatientForConsultation
					}
					onViewFullEmr={(patient) => {
						setSelectedPatientForModal(patient);
						setIsModalOpen(true);
					}}
					currentUserName={currentUser?.name}
				/>
			</div>

			{/* Patient Detail Modal for full EMR view */}
			{selectedPatientForModal && (
				<PatientDetailModal
					isOpen={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
						setSelectedPatientForModal(null);
					}}
					patient={selectedPatientForModal}
				/>
			)}
		</div>
	);
}

export type { DoctorSpecializedDirectoryProps };
