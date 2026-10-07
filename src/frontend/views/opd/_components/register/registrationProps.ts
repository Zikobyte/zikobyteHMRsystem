/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (shared registration prop types).
 *
 * Single source for the registration-form prop contracts. Every interface below
 * mirrors the corresponding `useRegistrationForm` state/handlers 1:1 (no `any`):
 * React setters are typed as simple callbacks (`(value: T) => void`), which the
 * real `Dispatch<SetStateAction<T>>` setters satisfy. Intake forms compose these
 * bases; `RegistrationModal` re-exports the union via the per-form prop types.
 */

import type { FormEventHandler } from "react";
import type { RegTab } from "../../_hooks/useRegistrationForm";

export type RegCardType = "Standard" | "Maternity" | "Emergency" | "Eye Clinic";
export type RegGender = "Male" | "Female" | "Other";
export type RegistrationFormTheme = "standard" | "maternity" | "emergency";

export type DuplicateCheckFn = (
	nameVal: string,
	phoneVal: string,
) => Promise<void>;
export type CardFeeFn = () => number;
export type RegistrationSubmitHandler = FormEventHandler;

/** Billing-category profile state (1:1 with useRegistrationForm). */
export interface BillingCategoryState {
	patientCategory: "Individual" | "Family" | "Company";
	setPatientCategory: (value: "Individual" | "Family" | "Company") => void;
	selectedFamilyId: string;
	setSelectedFamilyId: (value: string) => void;
	familyRelationship: string;
	setFamilyRelationship: (value: string) => void;
	selectedCompanyId: string;
	setSelectedCompanyId: (value: string) => void;
	employeeId: string;
	setEmployeeId: (value: string) => void;
	designation: string;
	setDesignation: (value: string) => void;
	letterReference: string;
	setLetterReference: (value: string) => void;
	letterVerified: boolean;
	setLetterVerified: (value: boolean) => void;
}

/** 7-field intake vitals state (1:1 with useRegistrationForm). */
export interface RegistrationVitalsState {
	regBP: string;
	setRegBP: (value: string) => void;
	regHR: string;
	setRegHR: (value: string) => void;
	regTemp: string;
	setRegTemp: (value: string) => void;
	regRR: string;
	setRegRR: (value: string) => void;
	regSpo2: string;
	setRegSpo2: (value: string) => void;
	regWeight: string;
	setRegWeight: (value: string) => void;
	regHeight: string;
	setRegHeight: (value: string) => void;
}

/** Shared demographics + card-type state used by all three intake forms. */
export interface RegistrationDemographicsState {
	name: string;
	setName: (value: string) => void;
	dateOfBirth: string;
	setDateOfBirth: (value: string) => void;
	gender: RegGender;
	setGender: (value: RegGender) => void;
	phoneNumber: string;
	setPhoneNumber: (value: string) => void;
	address: string;
	setAddress: (value: string) => void;
	maritalStatus: string;
	setMaritalStatus: (value: string) => void;
	cardType: RegCardType;
	setCardType: (value: RegCardType) => void;
	setRegTab: (value: RegTab) => void;
	triggerDuplicateCheck: DuplicateCheckFn;
}

/** Government ID + next-of-kin state shared by all three intake forms. */
export interface RegistrationIdentityState {
	regIdType: string;
	setRegIdType: (value: string) => void;
	regIdNumber: string;
	setRegIdNumber: (value: string) => void;
	regNextOfKinName: string;
	setRegNextOfKinName: (value: string) => void;
	regNextOfKinPhone: string;
	setRegNextOfKinPhone: (value: string) => void;
	regNextOfKinRelationship: string;
	setRegNextOfKinRelationship: (value: string) => void;
}

/** Optional email field (standard + maternity forms only). */
export interface RegistrationEmailState {
	email: string;
	setEmail: (value: string) => void;
}

/** Maternity clinical / obstetric-history state. */
export interface MaternityClinicalState {
	gravida: string;
	setGravida: (value: string) => void;
	para: string;
	setPara: (value: string) => void;
	lmp: string;
	setLmp: (value: string) => void;
	edd: string;
	setEdd: (value: string) => void;
	gestationalAge: string;
	setGestationalAge: (value: string) => void;
	tribe: string;
	setTribe: (value: string) => void;
	occupation: string;
	setOccupation: (value: string) => void;
	abortion: string;
	setAbortion: (value: string) => void;
	premature: string;
	setPremature: (value: string) => void;
}

/** Emergency intake state (conscious toggle, brought-in-by, multi-charges). */
export interface EmergencyClinicalState {
	patientCanProvideDetails: boolean;
	setPatientCanProvideDetails: (value: boolean) => void;
	setIsIdVerified: (value: boolean) => void;
	setUseIdVerification: (value: boolean) => void;
	emergencyGender: RegGender;
	setEmergencyGender: (value: RegGender) => void;
	emergencyMaritalStatus: string;
	setEmergencyMaritalStatus: (value: string) => void;
	emergencyEmail: string;
	setEmergencyEmail: (value: string) => void;
	broughtInByName: string;
	setBroughtInByName: (value: string) => void;
	broughtInByPhone: string;
	setBroughtInByPhone: (value: string) => void;
	broughtInByRelationship: string;
	setBroughtInByRelationship: (value: string) => void;
	broughtInByIdType: string;
	setBroughtInByIdType: (value: string) => void;
	broughtInByIdNumber: string;
	setBroughtInByIdNumber: (value: string) => void;
	isSickEmergency: boolean;
	setIsSickEmergency: (value: boolean) => void;
	isUnbookedLabour: boolean;
	setIsUnbookedLabour: (value: boolean) => void;
	isAccident: boolean;
	setIsAccident: (value: boolean) => void;
	isDoctorOnCall: boolean;
	setIsDoctorOnCall: (value: boolean) => void;
	isAfterHours: boolean;
	setIsAfterHours: (value: boolean) => void;
	emergencyDoctorName: string;
	setEmergencyDoctorName: (value: string) => void;
	emergencyTotalBill: string;
	setEmergencyTotalBill: (value: string) => void;
	emergencyCashCollected: string;
	setEmergencyCashCollected: (value: string) => void;
}
