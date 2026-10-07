import type { EmergencyDetails, Patient, Vitals } from "@/types";

export type DirectoryCategory = "standard" | "specialized";
export type SpecializedSubFilter = "all" | "maternity" | "emergency";
export type InitialCategory =
	| "standard"
	| "specialized"
	| "maternity"
	| "emergency";

export interface DirectoryEmergencyDetails extends EmergencyDetails {
	cashCollected?: number | string | null;
	totalBillAmount?: number | string | null;
}

export interface DirectoryQueueItem {
	patient_id: string;
	status?: string | null;
	blood_pressure?: string | null;
	temperature?: string | number | null;
	pulse_rate?: string | number | null;
	respiratory_rate?: string | number | null;
	spo2?: string | number | null;
	weight?: string | number | null;
	height?: string | number | null;
}

export interface EffectiveVitals {
	bloodPressure: string | null;
	temperature: number | null;
	pulseRate: number | null;
	respiratoryRate: number | null;
	spo2: number | null;
	weight: number | null;
	height: number | null;
}

export type ResolvedVitals = Vitals | EffectiveVitals | null | undefined;

/**
 * Local extension of the canonical Patient — covers snake_case and
 * legacy top-level extras returned by the backend that are not part of
 * the canonical type. Canonical types.ts is intentionally untouched.
 */
export interface DirectoryPatient extends Patient {
	maternityNumber?: string | null;
	gravida?: string | null;
	para?: string | null;
	lmp?: string | null;
	edd?: string | null;
	gestationalAge?: string | null;
	tribe?: string | null;
	doctorOnCallName?: string | null;
	doctor_on_call_name?: string | null;
	cashCollected?: number | string | null;
	totalBillAmount?: number | string | null;
	brought_in_by_name?: string | null;
	brought_in_by_phone?: string | null;
	brought_in_by_relationship?: string | null;
	custom_details?: string | null;
	emergencyDetails?: DirectoryEmergencyDetails | null;
}

export interface EnrichedDirectoryPatient extends DirectoryPatient {
	queueItem?: DirectoryQueueItem | undefined;
	effectiveStatus: string;
	effectiveVitals?: ResolvedVitals;
}

export interface BpCategory {
	label: string;
	color: string;
}
