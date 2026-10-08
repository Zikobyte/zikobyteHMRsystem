/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard shell (was 1447-line views/DashboardOverview.tsx, now composes
 * dashboard/).
 *
 * Shell keeps: props (onNavigateToPatients, onNavigateToReturningPatients?,
 * onOpenRegisterPatient?, onNavigateToStandardCards?,
 * onNavigateToSpecializedCare?, user?), patient/revenue modal mounts,
 * hook composition, section mounts. Domain state + db-test/seed handlers
 * live in _hooks/useDashboardData, section JSX in _components/, fallback
 * datasets + pure helpers in _utils/dashboardDefaults.
 * Lazy entry: App.tsx + lib/routing/routes.ts import
 * '@/views/dashboard/DashboardOverview' (ORCHESTRATOR rewires — do not touch).
 */

import { useState } from "react";
import PatientDetailModal from "@/components/patient-detail/PatientDetailModal";
import RevenueVerificationModal from "@/components/RevenueVerificationModal";
import type { Patient, User } from "@/types";
import ClinicIntensityCard from "./_components/ClinicIntensityCard";
import DiagnosticsHub from "./_components/DiagnosticsHub";
import GrowthChartCard from "./_components/GrowthChartCard";
import IntakeOverviewChart from "./_components/IntakeOverviewChart";
import KpiCards from "./_components/KpiCards";
import RecentActivityTable from "./_components/RecentActivityTable";
import RevenueLedgerCard from "./_components/RevenueLedgerCard";
import SessionsDeviceCard from "./_components/SessionsDeviceCard";
import WelcomeBanner from "./_components/WelcomeBanner";
import { useDashboardData } from "./_hooks/useDashboardData";

interface DashboardOverviewProps {
	onNavigateToPatients: () => void;
	onNavigateToReturningPatients?: () => void;
	onOpenRegisterPatient?: () => void;
	onNavigateToStandardCards?: () => void;
	onNavigateToSpecializedCare?: () => void;
	user?: User | null;
}

export default function DashboardOverview({
	onNavigateToPatients,
	onNavigateToReturningPatients,
	onOpenRegisterPatient,
	onNavigateToStandardCards,
	onNavigateToSpecializedCare,
	user,
}: DashboardOverviewProps) {
	// ---- Dashboard slice hooks (stats/overview + db-test/seed live in _hooks/) ----
	const data = useDashboardData();

	// Revenue Verification Audit Modal State
	const [isRevenueModalOpen, setIsRevenueModalOpen] = useState<boolean>(false);

	// Patient Detail Modal State
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [isPatientModalOpen, setIsPatientModalOpen] = useState<boolean>(false);

	const handlePatientClick = (patientItem: Patient | any) => {
		setSelectedPatient(patientItem);
		setIsPatientModalOpen(true);
	};

	const openRevenueModal = () => setIsRevenueModalOpen(true);

	return (
		<div className="space-y-6">
			{/* Top Welcome Action Banner */}
			<WelcomeBanner
				dbStatus={data.dbStatus}
				isCheckingDb={data.isCheckingDb}
				user={user}
				onNavigateToPatients={onNavigateToPatients}
				onNavigateToReturningPatients={onNavigateToReturningPatients}
				onOpenRegisterPatient={onOpenRegisterPatient}
			/>

			{/* TOP KPI METRICS GRID */}
			<KpiCards
				totalPatients={data.totalPatients}
				standardCount={data.standardCount}
				maternityCount={data.maternityCount}
				emergencyCount={data.emergencyCount}
				totalRevenue={data.totalRevenue}
				isLoading={data.isLoading}
				isStatsLoading={data.isStatsLoading}
				onNavigateToPatients={onNavigateToPatients}
				onNavigateToStandardCards={onNavigateToStandardCards}
				onNavigateToSpecializedCare={onNavigateToSpecializedCare}
				onOpenRevenueModal={openRevenueModal}
			/>

			{/* CARD: Recent Activity Directory */}
			<RecentActivityTable
				patients={data.patients}
				totalPatients={data.totalPatients}
				onNavigateToPatients={onNavigateToPatients}
				onPatientClick={handlePatientClick}
			/>

			{/* Grid Layout conforming to Power BI dashboard exactly */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* CARD 1: Monthly Overview Bar Chart (Takes 2 columns on desktop) */}
				<IntakeOverviewChart overviewData={data.overviewData} />

				{/* CARD 2: Impressions Sparkline (1 column bg solid blue gradient) */}
				<ClinicIntensityCard
					clinicIntensity={data.stats.clinicIntensity}
					totalPatients={data.totalPatients}
					isLoading={data.isLoading}
					isStatsLoading={data.isStatsLoading}
				/>

				{/* CARD 3: Revenue Overview (1 column dark rounded card) */}
				<RevenueLedgerCard
					totalRevenue={data.totalRevenue}
					isLoading={data.isLoading}
					onOpenRevenueModal={openRevenueModal}
				/>

				{/* CARD 4: Total Growth (1 column with smooth multi-line chart) */}
				<GrowthChartCard growthData={data.growthData} />

				{/* CARD 5: Sessions Device (1 column with colorful Doughnut Chart) */}
				<SessionsDeviceCard
					standardCount={data.standardCount}
					maternityCount={data.maternityCount}
					emergencyCount={data.emergencyCount}
					totalPatients={data.totalPatients}
					onNavigateToStandardCards={onNavigateToStandardCards}
					onNavigateToSpecializedCare={onNavigateToSpecializedCare}
				/>
			</div>

			{/* DATABASE DIAGNOSTICS & SYNC CENTER */}
			<DiagnosticsHub
				dbStatus={data.dbStatus}
				isCheckingDb={data.isCheckingDb}
				isSeeding={data.isSeeding}
				seedSuccessMessage={data.seedSuccessMessage}
				totalPatients={data.totalPatients}
				onVerifyLink={data.fetchDbStatus}
				onSeed={data.handleSeedDatabase}
			/>

			{/* Comprehensive Patient Information Modal */}
			<PatientDetailModal
				isOpen={isPatientModalOpen}
				onClose={() => setIsPatientModalOpen(false)}
				patient={selectedPatient}
			/>

			{/* Revenue Collections Independent Verification & Audit Modal */}
			<RevenueVerificationModal
				isOpen={isRevenueModalOpen}
				onClose={() => setIsRevenueModalOpen(false)}
				dashboardRevenue={data.totalRevenue}
			/>
		</div>
	);
}
