/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3B extraction from OPDRegistrationView.tsx.
 *
 * Queue hook: owns the nursing front-desk queue plus the three
 * queue-adjacent workflows (visit encounter, nursing vitals, priority
 * escalation) with their modal visibility flags. apiFetch paths, methods,
 * bodies, validation messages, vitals null-fallbacks, and modal open/close
 * semantics are preserved verbatim from the original component.
 *
 * Refresh wiring (identical to the pre-extraction post-submit calls):
 * - each submit calls this hook's own fetchQueue() wherever the original
 *   called fetchQueue();
 * - onMutated() is called exactly where the original called fetchPatients()
 *   (vitals submit). The shell wires onMutated to the directory refresh.
 */

import { useState } from "react";
import type { FormEvent } from "react";
import { apiFetch } from "../../../utils/api";
import type { Patient } from "@/types";

export interface OpdQueueItem {
	id: string;
	patient_id: string;
	encounter_id: string;
	hospital_number: string;
	patient_name: string;
	gender: string;
	date_of_birth: string;
	visit_type: string;
	destination_clinic: string;
	queue_type: string;
	priority: string;
	status: string;
}

export interface OpdQueueNotify {
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
}

export interface UseOpdQueueParams {
	notify: OpdQueueNotify;
	onMutated: () => void;
}

export function useOpdQueue({ notify, onMutated }: UseOpdQueueParams) {
	const { setError, setSuccess } = notify;

	const [queueItems, setQueueItems] = useState<OpdQueueItem[]>([]);
	const [selectedQueueItem, setSelectedQueueItem] =
		useState<OpdQueueItem | null>(null);

	const [isQueueing, setIsQueueing] = useState(false);
	const [isSavingVitals, setIsSavingVitals] = useState(false);
	const [isEscalating, setIsEscalating] = useState(false);

	const [isEncounterOpen, setIsEncounterOpen] = useState(false);
	const [isVitalsOpen, setIsVitalsOpen] = useState(false);
	const [isEscalateOpen, setIsEscalateOpen] = useState(false);

	// Create Encounter Fields
	const [encounterPatientId, setEncounterPatientId] = useState("");
	const [encounterVisitType, setEncounterVisitType] = useState(
		"New Patient Consultation",
	);
	const [encounterClinic, setEncounterClinic] = useState(
		"General OPD Out-Patient Clinic",
	);
	const [encounterPriority, setEncounterPriority] = useState("Routine");
	const [encounterReason, setEncounterReason] = useState("");

	// Nursing Vitals Form Fields
	const [vitalsBP, setVitalsBP] = useState("");
	const [vitalsTemp, setVitalsTemp] = useState("");
	const [vitalsPulse, setVitalsPulse] = useState("");
	const [vitalsResp, setVitalsResp] = useState("");
	const [vitalsSpo2, setVitalsSpo2] = useState("");
	const [vitalsWeight, setVitalsWeight] = useState("");
	const [vitalsHeight, setVitalsHeight] = useState("");

	// Priority Escalation State
	const [escalatePriority, setEscalatePriority] = useState("Urgent");
	const [escalateReason, setEscalateReason] = useState("");

	const fetchQueue = async () => {
		try {
			const res = await apiFetch("/patients/opd/queue");
			if (res.success) setQueueItems(res.data);
		} catch (err) {
			console.error("Failed to load queue", err);
		}
	};

	const handleOpenEncounter = (patient: Patient) => {
		setEncounterPatientId(patient.id);
		setEncounterVisitType("New Patient Consultation");
		setEncounterClinic("General OPD Out-Patient Clinic");
		setEncounterPriority("Routine");
		setEncounterReason("");
		setError("");
		setSuccess("");
		setIsEncounterOpen(true);
	};

	const handleEncounterSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		try {
			setIsQueueing(true);
			const response = await apiFetch("/patients/opd/encounters", {
				method: "POST",
				body: JSON.stringify({
					patientId: encounterPatientId,
					visitType: encounterVisitType,
					destinationClinic: encounterClinic,
					priority: encounterPriority,
					priorityReason: encounterReason,
				}),
			});

			if (response.success) {
				setSuccess(
					"Visit encounter created successfully! Patient has been placed in the waiting queue.",
				);
				setIsEncounterOpen(false);
				fetchQueue();
			}
		} catch (err) {
			setError(
				(err instanceof Error && err.message) || "Failed to create encounter",
			);
		} finally {
			setIsQueueing(false);
		}
	};

	const handleOpenVitals = (item: OpdQueueItem) => {
		setSelectedQueueItem(item);
		// Leave empty so inputs show placeholders only (no pre-filled defaults)
		setVitalsBP("");
		setVitalsTemp("");
		setVitalsPulse("");
		setVitalsResp("");
		setVitalsSpo2("");
		setVitalsWeight("");
		setVitalsHeight("");
		setError("");
		setSuccess("");
		setIsVitalsOpen(true);
	};

	const handleVitalsSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!selectedQueueItem) return;
		setError("");
		setSuccess("");

		try {
			setIsSavingVitals(true);
			const response = await apiFetch("/patients/opd/queue/vitals", {
				method: "POST",
				body: JSON.stringify({
					patientId: selectedQueueItem.patient_id,
					encounterId: selectedQueueItem.encounter_id,
					vitals: {
						bloodPressure: vitalsBP || null,
						temperature: parseFloat(vitalsTemp) || null,
						pulseRate: parseInt(vitalsPulse, 10) || null,
						respiratoryRate: parseInt(vitalsResp, 10) || null,
						spo2: parseInt(vitalsSpo2, 10) || null,
						weight: parseFloat(vitalsWeight) || null,
						height: parseFloat(vitalsHeight) || null,
					},
				}),
			});

			if (response.success) {
				setSuccess(
					"Nursing vitals recorded! Patient routed to Doctor Consultation queue.",
				);
				setIsVitalsOpen(false);
				fetchQueue();
				onMutated();
			}
		} catch (err) {
			setError(
				(err instanceof Error && err.message) || "Vitals submission failed",
			);
		} finally {
			setIsSavingVitals(false);
		}
	};

	const handleOpenEscalate = (item: OpdQueueItem) => {
		setSelectedQueueItem(item);
		setEscalatePriority("Urgent");
		setEscalateReason("");
		setIsEscalateOpen(true);
	};

	const handleEscalateSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!selectedQueueItem) return;

		try {
			setIsEscalating(true);
			const response = await apiFetch("/patients/opd/queue/priority", {
				method: "POST",
				body: JSON.stringify({
					encounterId: selectedQueueItem.encounter_id,
					priority: escalatePriority,
					reason: escalateReason,
				}),
			});

			if (response.success) {
				setSuccess(
					`Encounter priority successfully escalated to ${escalatePriority}!`,
				);
				setIsEscalateOpen(false);
				fetchQueue();
			}
		} catch (err) {
			setError(
				(err instanceof Error && err.message) || "Failed to update priority",
			);
		} finally {
			setIsEscalating(false);
		}
	};

	return {
		queueItems,
		setQueueItems,
		selectedQueueItem,
		setSelectedQueueItem,
		fetchQueue,
		isQueueing,
		isSavingVitals,
		isEscalating,
		isEncounterOpen,
		setIsEncounterOpen,
		isVitalsOpen,
		setIsVitalsOpen,
		isEscalateOpen,
		setIsEscalateOpen,
		encounterPatientId,
		setEncounterPatientId,
		encounterVisitType,
		setEncounterVisitType,
		encounterClinic,
		setEncounterClinic,
		encounterPriority,
		setEncounterPriority,
		encounterReason,
		setEncounterReason,
		handleOpenEncounter,
		handleEncounterSubmit,
		vitalsBP,
		setVitalsBP,
		vitalsTemp,
		setVitalsTemp,
		vitalsPulse,
		setVitalsPulse,
		vitalsResp,
		setVitalsResp,
		vitalsSpo2,
		setVitalsSpo2,
		vitalsWeight,
		setVitalsWeight,
		vitalsHeight,
		setVitalsHeight,
		handleOpenVitals,
		handleVitalsSubmit,
		escalatePriority,
		setEscalatePriority,
		escalateReason,
		setEscalateReason,
		handleOpenEscalate,
		handleEscalateSubmit,
	};
}

export type UseOpdQueueReturn = ReturnType<typeof useOpdQueue>;
