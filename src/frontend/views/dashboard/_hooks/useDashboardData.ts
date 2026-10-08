/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx.
 *
 * Owns stats/overview data + db-test/seed handlers (fetchPatients,
 * fetchDbStatus, fetchStats, handleSeedDatabase). Diagnostics calls go
 * through apiFetch; the destructive seed keeps its success/error messages
 * + refetch fan-out verbatim and is backup-first (a full backup download
 * must succeed before the seed POST, otherwise the seed aborts).
 */

import { useEffect, useState } from "react";
import type { Patient } from "@/types";
import { API_BASE, apiFetch, getAuthToken, removeAuthToken } from "../../../utils/api";
import {
	calcEmergencyCount,
	calcMaternityCount,
	calcStandardCount,
	calcTotalPatients,
	calcTotalRevenue,
	defaultDashboardStats,
	resolveGrowthData,
	resolveOverviewData,
	type DashboardStats,
} from "../_utils/dashboardDefaults";

export interface UseDashboardDataResult {
	patients: Patient[];
	isLoading: boolean;
	dbStatus: any;
	isCheckingDb: boolean;
	isSeeding: boolean;
	seedSuccessMessage: string | null;
	stats: DashboardStats;
	isStatsLoading: boolean;
	fetchDbStatus: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchPatients: () => Promise<void>;
	handleSeedDatabase: () => Promise<void>;
	totalPatients: number;
	standardCount: number;
	maternityCount: number;
	emergencyCount: number;
	totalRevenue: number;
	overviewData: DashboardStats["overviewData"];
	growthData: DashboardStats["growthData"];
}

export function useDashboardData(): UseDashboardDataResult {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	// Database Connection Diagnostics State
	const [dbStatus, setDbStatus] = useState<any>(null);
	const [isCheckingDb, setIsCheckingDb] = useState(false);
	const [isSeeding, setIsSeeding] = useState(false);
	const [seedSuccessMessage, setSeedSuccessMessage] = useState<string | null>(
		null,
	);

	// Dashboard Stats State
	const [stats, setStats] = useState<any>({
		...defaultDashboardStats,
	});
	const [isStatsLoading, setIsStatsLoading] = useState(false);

	useEffect(() => {
		fetchPatients();
		fetchDbStatus();
		fetchStats();
	}, []);

	const fetchDbStatus = async () => {
		setIsCheckingDb(true);
		try {
			const data = await apiFetch("/db-test");
			setDbStatus(data);
		} catch (err) {
			console.error("Failed to load database status", err);
		} finally {
			setIsCheckingDb(false);
		}
	};

	const fetchStats = async () => {
		setIsStatsLoading(true);
		try {
			const response = await apiFetch("/patients/dashboard/stats");
			if (response.success) {
				setStats(response.data);
			}
		} catch (err) {
			console.error("Failed to load dashboard statistics", err);
		} finally {
			setIsStatsLoading(false);
		}
	};

	const handleSeedDatabase = async () => {
		setIsSeeding(true);
		setSeedSuccessMessage(null);
		try {
			// Backup-first rule: a destructive re-seed must never run without a
			// fresh downloadable backup. Abort the seed when this fails.
			try {
				const token = getAuthToken();
				const backupResponse = await fetch(
					`${API_BASE}/maintenance/backup`,
					{
						headers: token ? { Authorization: `Bearer ${token}` } : {},
					},
				);
				if (backupResponse.status === 401) {
					// Centralized session handling mirrors apiFetch: clear auth
					// and route through the canonical logout event.
					removeAuthToken();
					localStorage.removeItem("zmc_user");
					window.dispatchEvent(new CustomEvent("zmc-logout"));
					throw new Error("Session expired. Please log in again.");
				}
				if (!backupResponse.ok) {
					throw new Error(
						`Backup download failed (HTTP ${backupResponse.status}).`,
					);
				}
				const blob = await backupResponse.blob();
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `ZMC_HMS_Backup_${new Date().toISOString().split("T")[0]}.json`;
				document.body.appendChild(link);
				link.click();
				link.remove();
				URL.revokeObjectURL(url);
			} catch (backupErr: any) {
				alert(
					"Backup failed: " +
						(backupErr?.message || "Unable to download backup.") +
						" Seed aborted — no changes were made.",
				);
				return;
			}
			const data = await apiFetch("/db-test/seed", { method: "POST" });
			if (data.success) {
				setSeedSuccessMessage(
					"Database successfully seeded with comprehensive clinical records!",
				);
				setTimeout(() => setSeedSuccessMessage(null), 8000);
				fetchDbStatus();
				fetchPatients();
				fetchStats();
			} else {
				alert("Seeding failed: " + (data.message || "Unknown error"));
			}
		} catch (err: any) {
			alert("Seeding error: " + err.message);
		} finally {
			setIsSeeding(false);
		}
	};

	const fetchPatients = async () => {
		setIsLoading(true);
		try {
			const response = await apiFetch("/patients");
			if (response.success) {
				setPatients(response.data);
			}
		} catch (err) {
			console.error("Failed to load patient statistics on dashboard", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Statistics calculation based on existing patients list and dynamic backend stats
	const totalPatients = calcTotalPatients(stats, patients);
	const standardCount = calcStandardCount(stats, patients);
	const maternityCount = calcMaternityCount(stats, patients);
	const emergencyCount = calcEmergencyCount(stats, patients);
	const totalRevenue = calcTotalRevenue(stats, patients);

	const overviewData = resolveOverviewData(stats);
	const growthData = resolveGrowthData(stats);

	return {
		patients,
		isLoading,
		dbStatus,
		isCheckingDb,
		isSeeding,
		seedSuccessMessage,
		stats,
		isStatsLoading,
		fetchDbStatus,
		fetchStats,
		fetchPatients,
		handleSeedDatabase,
		totalPatients,
		standardCount,
		maternityCount,
		emergencyCount,
		totalRevenue,
		overviewData,
		growthData,
	};
}
