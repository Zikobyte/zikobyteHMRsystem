/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useState } from "react";
import type { User } from "@/types";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardView from "@/components/DashboardView";
import OPDRegistrationView from "@/components/OPDRegistrationView";
import EyeClinicView from "@/components/EyeClinicView";
import DoctorView from "@/components/DoctorView";
import UserManagementView from "@/components/UserManagementView";
import CashierView from "@/components/CashierView";
import LaboratoryView from "@/components/LaboratoryView";
import PharmacyView from "@/components/PharmacyView";
import HRDashboardView from "@/components/HRDashboardView";
import NursingView from "@/components/NursingView";
import NotificationCenter from "@/components/NotificationCenter";
import PatientDirectoryImportView from "@/components/PatientDirectoryImportView";
import LoginScreen from "@/components/LoginScreen";
import { getAuthToken } from "@/utils/api";
import { useSession } from "@/lib/routing/session";
import { doctorSubTab, resolveViewPlan } from "@/lib/routing/view-plan";
import { SessionProvider } from "@/lib/routing/session";

export default function App() {
	return (
		<SessionProvider>
			<AppShell />
		</SessionProvider>
	);
}

function DeskFallback(): React.JSX.Element {
	return (
		<div className="flex items-center justify-center min-h-screen text-slate-500 text-sm">
			Loading department desk…
		</div>
	);
}

function AppShell(): React.JSX.Element {
	const { user, activeTab, navigate, login, logout } = useSession();
	const [openPatientRegistration, setOpenPatientRegistration] =
		useState(false);

	if (!user) {
		return (
			<>
				<LoginScreen
					onLoginSuccess={(loggedInUser: User) => {
						const token = getAuthToken();
						if (token) {
							login(loggedInUser, token);
						}
					}}
				/>
				<NotificationCenter />
			</>
		);
	}

	const openRegister = () => {
		setOpenPatientRegistration(true);
		navigate("patients");
	};
	const closeRegister = () => setOpenPatientRegistration(false);
	const goReturning = () => navigate("patients-returning");

	const plan = resolveViewPlan(activeTab, user);

	return (
		<>
			<DashboardLayout
				user={user}
				onLogout={logout}
				activeTab={activeTab}
				setActiveTab={navigate}
			>
				<Suspense fallback={<DeskFallback />}>
					{plan?.kind === "dashboard" && (
						<DashboardView
							user={user}
							onNavigateToPatients={() => {
								navigate(
									user.role === "Doctor" ? "consult" : "patients",
								);
							}}
							onNavigateToReturningPatients={goReturning}
							onOpenRegisterPatient={openRegister}
							onNavigateToStandardCards={() =>
								navigate("standard-cards")
							}
							onNavigateToSpecializedCare={() =>
								navigate("specialized-care")
							}
						/>
					)}
					{plan?.kind === "opd" && (
						<OPDRegistrationView
							activeTab={activeTab}
							initialOpenRegister={openPatientRegistration}
							onRegisterModalClose={closeRegister}
						/>
					)}
					{plan?.kind === "nursing" && (
						<NursingView
							activeTab={activeTab}
							onTabChange={navigate}
							onOpenRegisterPatient={openRegister}
							onNavigateToReturningPatients={goReturning}
						/>
					)}
					{plan?.kind === "eye" && (
						<EyeClinicView activeTab={activeTab} onTabChange={navigate} />
					)}
					{plan?.kind === "doctor" && (
						<DoctorView
							activeSubTab={doctorSubTab(activeTab)}
							onNavigateTab={navigate}
						/>
					)}
					{plan?.kind === "lab" && (
						<LaboratoryView activeTab={activeTab} />
					)}
					{plan?.kind === "pharmacy" && (
						<PharmacyView
							activeTab={activeTab}
							onTabChange={navigate}
							currentUser={user}
						/>
					)}
					{plan?.kind === "patient-directory-import" && (
						<PatientDirectoryImportView currentUser={user} />
					)}
					{plan?.kind === "admin" && (
						<UserManagementView
							activeSubTab={activeTab}
							onTabChange={navigate}
							currentUser={user}
						/>
					)}
					{plan?.kind === "hr" && (
						<HRDashboardView
							activeSubTab={activeTab}
							onTabChange={navigate}
							currentUser={user}
						/>
					)}
					{plan?.kind === "cashier" && (
						<CashierView activeTab={activeTab} />
					)}
				</Suspense>
			</DashboardLayout>
			<NotificationCenter />
		</>
	);
}
