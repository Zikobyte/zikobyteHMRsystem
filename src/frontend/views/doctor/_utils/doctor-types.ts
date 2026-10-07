/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx.
 *
 * Shared doctor-module domain types. These mirror the shape built by
 * fetchDbQueue (GET /patients/opd/queue mapping) and the admitted-patient
 * record shape used across the admitted sub-tabs. Fields are optional
 * where the backend may omit them; tabs and hooks compose these instead
 * of `any`.
 */

export type DoctorNotify = (msg: string, type?: "success" | "error") => void;

export type DoctorTab = "outpatients" | "admitted" | "standard" | "specialized";

/** Phase 1 read-only consultation totals (GET /patients/dashboard/stats). */
export interface DoctorConsultTotals {
	totalPatients: number;
	standardCount: number;
	maternityCount: number;
	emergencyCount: number;
	admissionsCount: number;
	queueCount: number;
}

export interface DoctorVitals {
	bloodPressure?: string | null;
	pulseRate?: string | number | null;
	temperature?: string | number | null;
	weight?: string | number | null;
	respiratoryRate?: string | number | null;
	spo2?: string | number | null;
	height?: string | number | null;
}

export interface DoctorMaternityDetails {
	gravida?: string;
	para?: string;
	lmp?: string;
	edd?: string;
	gestationalAge?: string;
	tribe?: string;
	occupation?: string;
	abortion?: string;
	premature?: string;
}

export interface DoctorEmergencyDetails {
	isSickEmergency?: boolean;
	isUnbookedLabour?: boolean;
	isAccident?: boolean;
	totalBillAmount?: number;
	cashCollected?: number;
	doctorOnCallName?: string;
	customDetails?: string;
	broughtInByName?: string;
	broughtInByPhone?: string;
	broughtInByRelationship?: string;
	broughtInByIdType?: string;
	broughtInByIdNumber?: string;
}

export interface OrderedLabTest {
	category: string;
	code: string;
	name: string;
	price: number;
	timestamp: string;
}

export interface PrescribedMed {
	id: string;
	name: string;
	dose: string;
	frequency: string;
	duration: string;
	timestamp?: string;
}

export interface PrescriptionRow {
	id: string;
	name: string;
	dose: string;
	frequency: string;
	duration: string;
}

/** Outpatient workspace row built by fetchDbQueue. */
export interface DoctorOutpatient {
	id: string;
	encounterId?: string;
	queueId?: string;
	isDbPatient?: boolean;
	name: string;
	hospitalNumber?: string;
	gender?: string;
	phoneNumber?: string;
	email?: string;
	address?: string;
	maritalStatus?: string;
	cardType?: string;
	patientCategory?: string;
	dateOfBirth?: string;
	registeredAt?: string;
	age?: string;
	attendingDoctor?: string;
	nextOfKinName?: string;
	nextOfKinPhone?: string;
	nextOfKinRelationship?: string;
	vitals?: DoctorVitals;
	maternityDetails?: DoctorMaternityDetails | null;
	emergencyDetails?: DoctorEmergencyDetails | null;
	status?: string;
	isLabResultsReady?: boolean;
	isAwaitingPayment?: boolean;
	processedBy?: string | null;
	isEmergency?: boolean;
	department?: string;
	notes?: string;
	orderedTests?: OrderedLabTest[];
	prescribedMedications?: PrescribedMed[];
}

export interface DoctorOrderHistoryEntry {
	id: string;
	orderText: string;
	doctorName: string;
	timestamp: string;
}

export interface AdmittedVitalRecord {
	timestamp?: string;
	recordedBy?: string;
	bp?: string;
	hr?: string;
	temp?: string;
	rr?: string;
	spo2?: string;
}

export interface AdmittedMedRecord {
	id: string;
	orderId?: string;
	name: string;
	dose?: string;
	quantity?: string;
	frequency?: string;
	status?: string;
	orderedBy?: string;
	administeredBy?: string;
	administeredAt?: string;
	timestamp?: string;
	note?: string;
}

export interface AdmittedObservation {
	id: string;
	category?: string;
	note?: string;
	timestamp?: string;
	recordedBy?: string;
}

export interface AdmittedCharge {
	orderId?: string;
	item: string;
	amount: number;
	timestamp?: string;
}

export interface AdmittedOrder {
	id: string;
	type: string;
	target: string;
	description: string;
	notes?: string;
	status: string;
	timestamp?: string;
}

export interface AdmittedPatient {
	id: string;
	name: string;
	queueId?: string;
	hospitalNumber?: string;
	gender?: string;
	dateOfBirth?: string;
	ward?: string;
	bed?: string;
	admittedDate?: string;
	dischargeBill?: number;
	totalCharged?: number;
	paymentsMade?: number;
	since?: string;
	department?: string;
	religion?: string;
	edd?: string;
	gravidaPara?: string;
	notes?: string;
	doctorOrders?: string;
	doctorOrdersHistory?: DoctorOrderHistoryEntry[];
	vitalsRecords?: AdmittedVitalRecord[];
	medicationsRecords?: AdmittedMedRecord[];
	observationsRecords?: AdmittedObservation[];
	chargesList?: AdmittedCharge[];
	newOrdersList?: AdmittedOrder[];
}

export interface PatientLabResult {
	id?: string;
	test_name?: string;
	result_details?: string;
	findings?: string;
	date_completed?: string;
	date_ordered?: string;
	doctor_name?: string;
}

export interface PastConsultation {
	id?: string;
	encounter_id?: string;
	doctor_id?: string;
	doctor_name?: string;
	created_at?: string;
	chief_complaint?: string;
	diagnosis?: string;
	clinical_notes?: string;
	treatment_plan?: string;
	notes?: string;
	prescriptions?: string | Record<string, unknown> | unknown[];
}

export interface PatientHistoryData {
	patient?: {
		hospital_number?: string;
		name?: string;
		gender?: string;
		age?: string | number;
		date_of_birth?: string;
	};
	consultations?: PastConsultation[];
	vitals?: {
		id?: string;
		recorded_at?: string;
		nurse_name?: string;
		recorded_by?: string;
		blood_pressure?: string;
		pulse_rate?: string | number;
		temperature?: string | number;
		weight?: string | number;
		height?: string | number;
		respiratory_rate?: string | number;
		spo2?: string | number;
	}[];
	labOrders?: {
		id?: string;
		category?: string;
		test_name?: string;
		status?: string;
		result_value?: string;
		reference_range?: string;
		technician_notes?: string;
	}[];
	labResults?: PatientLabResult[];
	pharmacyOrders?: {
		id?: string;
		status?: string;
		created_at?: string;
		items?: { name?: string; drug_name?: string; dose?: string; dosage?: string; frequency?: string; duration?: string }[];
	}[];
	invoices?: {
		id?: string;
		invoice_number?: string;
		created_at?: string;
		notes?: string;
		total_amount?: number;
		payment_status?: string;
	}[];
}

export type HistoryTabId =
	| "consultations"
	| "vitals"
	| "labs"
	| "prescriptions"
	| "invoices";

export type AdmittedSubTab =
	| "overview"
	| "vitals"
	| "medications"
	| "observations"
	| "charges"
	| "new_orders";

export type InpatientOrderType = "Medication" | "Injection" | "Lab Test";

export interface MedOrderItem {
	name: string;
	dose: string;
	quantity: string;
	frequency: string;
}

export interface InjOrderItem {
	name: string;
	dose: string;
	quantity: string;
}

export interface LabOrderTests {
	CHEMISTRY: string;
	SEROLOGY: string;
	HAEMATOLOGY: string;
	MICROBIOLOGY: string;
	PARASITOLOGY: string;
}

export type MedLogStatus = "Administered" | "Pending" | "Dispensed" | "Cancelled";

export interface CurrentUserLike {
	name?: string;
	username?: string;
}
