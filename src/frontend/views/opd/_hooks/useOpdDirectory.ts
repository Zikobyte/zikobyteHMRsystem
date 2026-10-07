/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3B extraction from OPDRegistrationView.tsx.
 *
 * Directory hook: owns the patient/company/family directory data, the
 * registry search + filtered list, the duplicate-check warning state, and
 * the today-count derivations. Fetch failures are silent (console log
 * only) to match the pre-extraction behavior — `notify` is accepted for
 * API symmetry but no error state is written here.
 */

import { useState } from "react";
import { apiFetch } from "../../../utils/api";
import type { Patient } from "@/types";

export interface OpdDuplicateCandidate extends Patient {
	hospital_number?: string;
	phone_number?: string;
}

export interface OpdCompany {
	id: string;
	name: string;
	code: string;
}

export interface OpdFamilyAccount {
	id: string;
	name: string;
	balance: string;
}

export interface OpdDirectoryNotify {
	setError: (message: string) => void;
}

export interface UseOpdDirectoryParams {
	notify: OpdDirectoryNotify;
}

export function useOpdDirectory({ notify }: UseOpdDirectoryParams) {
	void notify;
	const [patients, setPatients] = useState<Patient[]>([]);
	const [companies, setCompanies] = useState<OpdCompany[]>([]);
	const [families, setFamilies] = useState<OpdFamilyAccount[]>([]);

	const [search, setSearch] = useState("");

	const [duplicatesFound, setDuplicatesFound] = useState<
		OpdDuplicateCandidate[]
	>([]);
	const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

	const fetchPatients = async () => {
		try {
			const res = await apiFetch("/patients");
			if (res.success) setPatients(res.data);
		} catch (err) {
			console.error("Failed to load patients", err);
		}
	};

	const fetchCompanies = async () => {
		try {
			const res = await apiFetch("/patients/opd/companies");
			if (res.success) setCompanies(res.data);
		} catch (err) {
			console.error("Failed to load companies", err);
		}
	};

	const fetchFamilies = async () => {
		try {
			const res = await apiFetch("/patients/opd/families");
			if (res.success) setFamilies(res.data);
		} catch (err) {
			console.error("Failed to load families", err);
		}
	};

	// Duplicate Check Handler
	const triggerDuplicateCheck = async (
		nameVal: string,
		phoneVal: string,
	) => {
		if (!nameVal || nameVal.trim().length < 4) return;
		try {
			const res = await apiFetch(
				`/patients/opd/duplicates?name=${encodeURIComponent(nameVal)}&phoneNumber=${encodeURIComponent(phoneVal)}`,
			);
			if (res.success && res.duplicateCount > 0) {
				setDuplicatesFound(res.duplicates);
				setShowDuplicateWarning(true);
			} else {
				setShowDuplicateWarning(false);
			}
		} catch (err) {
			// ignore
		}
	};

	// Filter Patients List based on Search bar
	const filteredPatients = patients.filter((p) => {
		const q = search.toLowerCase();
		return (
			p.name.toLowerCase().includes(q) ||
			p.hospitalNumber.toLowerCase().includes(q) ||
			p.phoneNumber.includes(q) ||
			p.cardType.toLowerCase().includes(q)
		);
	});

	// Daily registration statistics (Today)
	const todayStr = new Date().toISOString().split("T")[0];
	const todaysRegistrations = patients.filter((p) => {
		if (!p.registrationDate) return false;
		return p.registrationDate.split("T")[0] === todayStr;
	});
	const totalToday = todaysRegistrations.length;
	const standardToday = todaysRegistrations.filter(
		(p) => p.cardType === "Standard",
	).length;
	const maternityToday = todaysRegistrations.filter(
		(p) => p.cardType === "Maternity",
	).length;
	const emergencyToday = todaysRegistrations.filter(
		(p) => p.cardType === "Emergency",
	).length;

	return {
		patients,
		setPatients,
		companies,
		setCompanies,
		families,
		setFamilies,
		fetchPatients,
		fetchCompanies,
		fetchFamilies,
		search,
		setSearch,
		filteredPatients,
		duplicatesFound,
		setDuplicatesFound,
		showDuplicateWarning,
		setShowDuplicateWarning,
		triggerDuplicateCheck,
		todaysRegistrations,
		totalToday,
		standardToday,
		maternityToday,
		emergencyToday,
	};
}

export type UseOpdDirectoryReturn = ReturnType<typeof useOpdDirectory>;
