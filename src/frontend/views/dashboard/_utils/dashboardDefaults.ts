/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx (1447 lines).
 *
 * Pure helpers + fallback datasets (verbatim values). No hooks, no JSX,
 * no API calls. Consumed by _hooks/useDashboardData and _components/.
 */

import type { Patient } from "@/types";

export interface OverviewPoint {
	month: string;
	newV: number;
	unique: number;
}

export interface GrowthPoint {
	month: string;
	value1: number;
	value2: number;
}

export interface DashboardStats {
	totalPatients: number;
	standardCount: number;
	maternityCount: number;
	emergencyCount: number;
	totalRevenue: number;
	clinicIntensity: number;
	admissionsCount: number;
	queueCount: number;
	overviewData: OverviewPoint[];
	growthData: GrowthPoint[];
}

export const defaultDashboardStats: DashboardStats = {
	totalPatients: 0,
	standardCount: 0,
	maternityCount: 0,
	emergencyCount: 0,
	totalRevenue: 0,
	clinicIntensity: 0,
	admissionsCount: 0,
	queueCount: 0,
	overviewData: [],
	growthData: [],
};

// Fallback lists if empty (verbatim from DashboardOverview.tsx)
export const defaultRecentPatients = [
	{
		id: "1",
		name: "Amara Nwosu",
		cardType: "Maternity",
		registeredBy: "nurse_jane",
		status: "Waiting for Doctor",
		cardFee: 5000,
		date: "2026-06-29",
	},
	{
		id: "2",
		name: "Chinedu Okafor",
		cardType: "Standard",
		registeredBy: "opd_registrar",
		status: "Triage Pending",
		cardFee: 3000,
		date: "2026-06-29",
	},
	{
		id: "3",
		name: "Olumide Bakare",
		cardType: "Emergency",
		registeredBy: "admin",
		status: "Waiting for Doctor",
		cardFee: 20000,
		date: "2026-06-29",
	},
	{
		id: "4",
		name: "Fatima Musa",
		cardType: "Maternity",
		registeredBy: "nurse_jane",
		status: "Discharged",
		cardFee: 5000,
		date: "2026-06-28",
	},
	{
		id: "5",
		name: "Emeka Obi",
		cardType: "Standard",
		registeredBy: "opd_registrar",
		status: "Discharged",
		cardFee: 3000,
		date: "2026-06-28",
	},
];

// Monthly Overview stats (New vs Unique visitors) — verbatim fallback
export const defaultOverviewData: OverviewPoint[] = [
	{ month: "Jan", newV: 65, unique: 45 },
	{ month: "Feb", newV: 59, unique: 41 },
	{ month: "Mar", newV: 80, unique: 55 },
	{ month: "Apr", newV: 81, unique: 58 },
	{ month: "May", newV: 56, unique: 40 },
	{ month: "Jun", newV: 55, unique: 38 },
	{ month: "Jul", newV: 40, unique: 30 },
	{ month: "Aug", newV: 72, unique: 50 },
	{ month: "Sep", newV: 84, unique: 62 },
	{ month: "Oct", newV: 60, unique: 42 },
];

// Total Growth dynamic points — verbatim fallback
export const defaultGrowthData: GrowthPoint[] = [
	{ month: "Feb '00", value1: 18, value2: 12 },
	{ month: "May '00", value1: 30, value2: 18 },
	{ month: "Aug '00", value1: 14, value2: 24 },
	{ month: "Nov '00", value1: 22, value2: 15 },
	{ month: "Feb '01", value1: 10, value2: 29 },
	{ month: "May '01", value1: 25, value2: 19 },
];

// Statistics calculation based on existing patients list and dynamic backend stats (verbatim logic)
export function calcTotalPatients(
	stats: DashboardStats,
	patients: Patient[],
): number {
	return stats.totalPatients || patients.length;
}

export function calcStandardCount(
	stats: DashboardStats,
	patients: Patient[],
): number {
	return (
		stats.standardCount ||
		patients.filter((p) => p.cardType === "Standard").length
	);
}

export function calcMaternityCount(
	stats: DashboardStats,
	patients: Patient[],
): number {
	return (
		stats.maternityCount ||
		patients.filter((p) => p.cardType === "Maternity").length
	);
}

export function calcEmergencyCount(
	stats: DashboardStats,
	patients: Patient[],
): number {
	return (
		stats.emergencyCount ||
		patients.filter((p) => p.cardType === "Emergency").length
	);
}

export function calcTotalRevenue(
	stats: DashboardStats,
	patients: Patient[],
): number {
	return (
		stats.totalRevenue ||
		patients.reduce((acc, curr) => acc + (curr.cardFee || 0), 0)
	);
}

export function resolveOverviewData(
	stats: DashboardStats,
): OverviewPoint[] {
	return stats.overviewData?.length > 0
		? stats.overviewData
		: defaultOverviewData;
}

export function resolveGrowthData(stats: DashboardStats): GrowthPoint[] {
	return stats.growthData?.length > 0 ? stats.growthData : defaultGrowthData;
}

export function filterRecentList(
	patientDirectory: Array<Patient | any>,
	patientSearchQuery: string,
): Array<Patient | any> {
	if (!patientSearchQuery.trim()) {
		return patientDirectory.slice(0, 5);
	}
	const query = patientSearchQuery.trim().toLowerCase();
	return patientDirectory.filter((patient) => {
		return [
			patient.name,
			(patient as any).hospitalNumber,
			(patient as any).phoneNumber,
			(patient as any).cardType,
			(patient as any).status,
		].some((value) =>
			String(value || "")
				.toLowerCase()
				.includes(query),
		);
	});
}
