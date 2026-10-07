/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3B extraction from OPDRegistrationView.tsx.
 *
 * Replacements hook: owns the card-replacement role gate (pure, module
 * scope), the replacement audit log, and the replace-lost-card modal
 * workflow. The fetch stays 403-tolerant and silent, exactly as before.
 *
 * Refresh wiring (identical to the pre-extraction post-submit calls):
 * - submit calls this hook's own fetchReplacements() wherever the original
 *   called fetchReplacements();
 * - onMutated() is called exactly where the original called fetchPatients().
 *   The shell wires onMutated to the directory refresh. The role-gated
 *   initial fetch decision stays in the shell component.
 */

import { useState } from "react";
import type { FormEvent } from "react";
import { apiFetch } from "../../../utils/api";
import type { Patient } from "@/types";

// 403-avoidance gate: GET/POST /opd/cards/replace* allows OPD-group + Cashier-group only
// (+ admin bypass via backend authorizeRoles). Matches patients.routes.ts:416-417 +
// ROLE_EQUIVALENTS in auth.middleware.ts. Presentation-only: no backend change.
export const CARD_REPLACEMENT_ROLES = [
	"OPD Clerk",
	"Receptionist",
	"Records Officer",
	"Cashier",
	"Account Officer",
	"Accountant",
];

export const CARD_REPLACEMENT_ADMIN_BYPASS = [
	"Administrator",
	"IT Administrator",
	"Management",
	"Super Administrator",
];

export const canManageCardReplacements = (role?: string | null): boolean =>
	!!role &&
	(
		[...CARD_REPLACEMENT_ROLES, ...CARD_REPLACEMENT_ADMIN_BYPASS] as string[]
	).includes(role);

export interface OpdReplacementRecord {
	id: string;
	patient_name: string;
	old_card_number: string;
	new_card_number: string;
	approved_by: string;
	last_office_seen: string;
	history_refreshed: boolean;
	reason: string;
}

export interface OpdReplacementsNotify {
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
}

export interface UseOpdReplacementsParams {
	notify: OpdReplacementsNotify;
	onMutated: () => void;
}

export function useOpdReplacements({
	notify,
	onMutated,
}: UseOpdReplacementsParams) {
	const { setError, setSuccess } = notify;

	const [replacements, setReplacements] = useState<OpdReplacementRecord[]>(
		[],
	);
	const [isReplacementOpen, setIsReplacementOpen] = useState(false);
	const [isSavingReplacement, setIsSavingReplacement] = useState(false);

	// Card Replacement State
	const [replacementPatientId, setReplacementPatientId] = useState("");
	const [replacementOldCard, setReplacementOldCard] = useState("");
	const [replacementNewCard, setReplacementNewCard] = useState("");
	const [replacementOffice, setReplacementOffice] = useState(
		"Nursing Front-Desk",
	);
	const [replacementReason, setReplacementReason] = useState("Lost Card");

	const fetchReplacements = async () => {
		try {
			const res = await apiFetch("/patients/opd/cards/replacements");
			if (res.success) setReplacements(res.data);
		} catch (err) {
			// 403-tolerant: unauthorized roles never call this (gated above), but stay
			// silent on 403/forbidden so no console spam and no error state is set.
			const msg = String(err instanceof Error ? err.message : err);
			if (msg.includes("403") || msg.toLowerCase().includes("forbidden"))
				return;
			console.error("Failed to load card replacements", err);
		}
	};

	const handleOpenReplacement = (patient: Patient) => {
		setReplacementPatientId(patient.id);
		setReplacementOldCard(patient.hospitalNumber); // assuming hospital number has historical card link
		setReplacementNewCard(
			`ZMC-CARD-${Math.floor(1000 + Math.random() * 9000)}`,
		);
		setReplacementOffice("Nursing Front-Desk");
		setReplacementReason("Lost Card");
		setError("");
		setSuccess("");
		setIsReplacementOpen(true);
	};

	const handleReplacementSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		try {
			setIsSavingReplacement(true);
			const response = await apiFetch("/patients/opd/cards/replace", {
				method: "POST",
				body: JSON.stringify({
					patientId: replacementPatientId,
					oldCardNumber: replacementOldCard,
					newCardNumber: replacementNewCard,
					lastOfficeSeen: replacementOffice,
					reason: replacementReason,
				}),
			});

			if (response.success) {
				setSuccess(
					"Lost card replacement approved! Medical history refreshed successfully.",
				);
				setIsReplacementOpen(false);
				fetchReplacements();
				onMutated();
			}
		} catch (err) {
			setError(
				(err instanceof Error && err.message) || "Replacement logging failed",
			);
		} finally {
			setIsSavingReplacement(false);
		}
	};

	return {
		replacements,
		setReplacements,
		fetchReplacements,
		isReplacementOpen,
		setIsReplacementOpen,
		isSavingReplacement,
		replacementPatientId,
		setReplacementPatientId,
		replacementOldCard,
		setReplacementOldCard,
		replacementNewCard,
		setReplacementNewCard,
		replacementOffice,
		setReplacementOffice,
		replacementReason,
		setReplacementReason,
		handleOpenReplacement,
		handleReplacementSubmit,
	};
}

export type UseOpdReplacementsReturn = ReturnType<typeof useOpdReplacements>;
