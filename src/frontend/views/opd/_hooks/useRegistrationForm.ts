/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3B extraction from OPDRegistrationView.tsx.
 *
 * Registration-form hook: owns ALL patient registration form state
 * (standard / maternity / emergency branches, billing-category profile,
 * identification & next-of-kin, brought-in-by, ID verification, and intake
 * vitals), the reg-tab + register/success modal state, the dynamic
 * emergency-fee effect, and the register open/close/submit handlers.
 * Validation messages, the duplicate-block behavior, the POST /patients
 * bodies per branch, and modal open/close semantics are preserved verbatim
 * from the original component.
 *
 * Coupling decision (documented per the Phase 3B brief): this hook does NOT
 * import useOpdDirectory. The duplicate-check wiring and the patient list
 * arrive as params instead —
 * - `patients` (read-only snapshot for the local duplicate safeguard; the
 *   closure is fresh every render because the shell re-renders on change),
 * - `duplicates` (duplicate state + trigger owned by useOpdDirectory).
 * This keeps the two hooks decoupled; the shell composes them.
 *
 * Refresh wiring: on successful registration this hook calls onRegistered()
 * exactly where the original called fetchPatients()/fetchQueue()/
 * fetchFamilies(). The shell wires onRegistered to those three refetches in
 * order.
 */

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { apiFetch } from "../../../utils/api";
import type { Patient } from "@/types";
import type { OpdDuplicateCandidate } from "./useOpdDirectory";
import { getCalculatedCardFee as getEmergencyCardFee } from "../_utils/opdCardFee";

export interface RegisteredPatient extends Patient {
	maternityNumber?: string;
}

export type RegTab = "standard" | "maternity" | "emergency";

export interface OpdRegistrationNotify {
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
}

export interface OpdDuplicateWire {
	duplicatesFound: OpdDuplicateCandidate[];
	setDuplicatesFound: (duplicates: OpdDuplicateCandidate[]) => void;
	setShowDuplicateWarning: (visible: boolean) => void;
	triggerDuplicateCheck: (name: string, phone: string) => Promise<void>;
}

export interface UseRegistrationFormParams {
	currentUsername: string | undefined;
	notify: OpdRegistrationNotify;
	patients: Patient[];
	duplicates: OpdDuplicateWire;
	onRegistered: () => void;
	onRegisterModalClose?: () => void;
}

type RegistrationPayload = Record<string, unknown>;

export function useRegistrationForm({
	currentUsername,
	notify,
	patients,
	duplicates,
	onRegistered,
	onRegisterModalClose,
}: UseRegistrationFormParams) {
	const { setError, setSuccess } = notify;
	const {
		duplicatesFound,
		setDuplicatesFound,
		setShowDuplicateWarning,
		triggerDuplicateCheck,
	} = duplicates;

	const [isRegistering, setIsRegistering] = useState(false);

	// Registration modal sub-tabs and success modal
	const [regTab, setRegTab] = useState<RegTab>("standard");
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const [registeredPatient, setRegisteredPatient] =
		useState<RegisteredPatient | null>(null);
	const [successCheckedFolder, setSuccessCheckedFolder] = useState(false);
	const [successCheckedCards, setSuccessCheckedCards] = useState(false);
	const [successCheckedReceipt, setSuccessCheckedReceipt] = useState(false);
	const [successCheckedTriage, setSuccessCheckedTriage] = useState(false);

	// New Registration Vitals fields (Standard/Maternity/Emergency)
	const [regBP, setRegBP] = useState("");
	const [regHR, setRegHR] = useState("");
	const [regTemp, setRegTemp] = useState("");
	const [regRR, setRegRR] = useState("");
	const [regSpo2, setRegSpo2] = useState("");
	const [regWeight, setRegWeight] = useState("");
	const [regHeight, setRegHeight] = useState("");

	// New fields for Maternity
	const [abortion, setAbortion] = useState("0");
	const [premature, setPremature] = useState("0");
	const [email, setEmail] = useState("");

	// New fields for Emergency
	const [emergencyGender, setEmergencyGender] = useState<
		"Male" | "Female" | "Other"
	>("Male");
	const [emergencyMaritalStatus, setEmergencyMaritalStatus] =
		useState("Single");
	const [emergencyEmail, setEmergencyEmail] = useState("");
	const [emergencyTotalBill, setEmergencyTotalBill] = useState("25000");
	const [emergencyCashCollected, setEmergencyCashCollected] =
		useState("25000");
	const [emergencyDoctorName, setEmergencyDoctorName] = useState("");

	// Identification & Next of Kin states
	const [regIdType, setRegIdType] = useState("");
	const [regIdNumber, setRegIdNumber] = useState("");
	const [regNextOfKinName, setRegNextOfKinName] = useState("");
	const [regNextOfKinPhone, setRegNextOfKinPhone] = useState("");
	const [regNextOfKinRelationship, setRegNextOfKinRelationship] =
		useState("Spouse");

	// Emergency "Brought In By" states
	const [patientCanProvideDetails, setPatientCanProvideDetails] =
		useState(true);
	const [broughtInByName, setBroughtInByName] = useState("");
	const [broughtInByPhone, setBroughtInByPhone] = useState("");
	const [broughtInByRelationship, setBroughtInByRelationship] =
		useState("Good Samaritan");
	const [broughtInByIdType, setBroughtInByIdType] = useState("");
	const [broughtInByIdNumber, setBroughtInByIdNumber] = useState("");

	// ID Biometric Verification states
	const [isIdVerified, setIsIdVerified] = useState(false);
	const [verifiedFirstName, setVerifiedFirstName] = useState("");
	const [verifiedLastName, setVerifiedLastName] = useState("");
	const [verifiedDob, setVerifiedDob] = useState("");
	const [useIdVerification, setUseIdVerification] = useState(false);

	// Patient Registration Form Fields
	const [name, setName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [address, setAddress] = useState("");
	const [maritalStatus, setMaritalStatus] = useState("Single");
	const [cardType, setCardType] = useState<
		"Standard" | "Maternity" | "Emergency" | "Eye Clinic"
	>("Standard");

	// Account Categories for Registration
	const [patientCategory, setPatientCategory] = useState<
		"Individual" | "Family" | "Company"
	>("Individual");
	const [selectedFamilyId, setSelectedFamilyId] = useState("");
	const [familyRelationship, setFamilyRelationship] = useState("Spouse");
	const [selectedCompanyId, setSelectedCompanyId] = useState("");
	const [employeeId, setEmployeeId] = useState("");
	const [designation, setDesignation] = useState("");
	const [letterReference, setLetterReference] = useState("");
	const [letterVerified, setLetterVerified] = useState(false);

	// Maternity Specific Fields (Reception)
	const [gravida, setGravida] = useState("");
	const [para, setPara] = useState("");
	const [lmp, setLmp] = useState("");
	const [edd, setEdd] = useState("");
	const [gestationalAge, setGestationalAge] = useState("");
	const [tribe, setTribe] = useState("");
	const [occupation, setOccupation] = useState("");

	// Emergency Specific Fields (Reception)
	const [isSickEmergency, setIsSickEmergency] = useState(false);
	const [isUnbookedLabour, setIsUnbookedLabour] = useState(false);
	const [isAccident, setIsAccident] = useState(false);
	const [isDoctorOnCall, setIsDoctorOnCall] = useState(false);
	const [isAfterHours, setIsAfterHours] = useState(false);

	// Dynamic Emergency Charge calculation effect
	useEffect(() => {
		if (regTab === "emergency") {
			const total = getEmergencyCardFee({
				isSickEmergency,
				isUnbookedLabour,
				isAccident,
				isDoctorOnCall,
				isAfterHours,
			});
			setEmergencyTotalBill(String(total));
			setEmergencyCashCollected(String(total));
		}
	}, [
		isSickEmergency,
		isUnbookedLabour,
		isAccident,
		isDoctorOnCall,
		isAfterHours,
		regTab,
	]);

	// Helper to calculate total dynamic card fee
	const getCalculatedCardFee = (): number => {
		if (cardType === "Standard" || cardType === "Eye Clinic") return 3000;
		if (cardType === "Maternity") return 5000;

		return getEmergencyCardFee({
			isSickEmergency,
			isUnbookedLabour,
			isAccident,
			isDoctorOnCall,
			isAfterHours,
		});
	};

	const handleOpenRegister = (
		initialTab: "standard" | "maternity" | "emergency" = "standard",
	) => {
		setRegTab(initialTab);
		setCardType(
			initialTab === "standard"
				? "Standard"
				: initialTab === "maternity"
					? "Maternity"
					: "Emergency",
		);
		setName("");
		setDateOfBirth("");
		setGender(initialTab === "maternity" ? "Female" : "Male");
		setPhoneNumber("");
		setEmail("");
		setAddress("");
		setMaritalStatus(initialTab === "maternity" ? "Married" : "Single");
		setPatientCategory("Individual");
		setSelectedFamilyId("");
		setSelectedCompanyId("");
		setEmployeeId("");
		setDesignation("");
		setLetterReference("");
		setLetterVerified(false);

		// Maternity reset
		setGravida("");
		setPara("");
		setLmp("");
		setEdd("");
		setGestationalAge("");
		setTribe("");
		setOccupation("");
		setAbortion("0");
		setPremature("0");

		// Emergency reset
		setIsSickEmergency(initialTab === "emergency");
		setIsUnbookedLabour(false);
		setIsAccident(false);
		setIsDoctorOnCall(false);
		setIsAfterHours(false);
		setEmergencyGender("Male");
		setEmergencyMaritalStatus("Single");
		setEmergencyEmail("");
		setEmergencyTotalBill("25000");
		setEmergencyCashCollected("25000");
		setEmergencyDoctorName("");

		// Vitals reset — leave empty so inputs show placeholders only
		setRegBP("");
		setRegHR("");
		setRegTemp("");
		setRegRR("");
		setRegSpo2("");
		setRegWeight("");
		setRegHeight("");

		// Identification & Next of Kin reset
		setRegIdType("");
		setRegIdNumber("");
		setRegNextOfKinName("");
		setRegNextOfKinPhone("");
		setRegNextOfKinRelationship("Spouse");

		// Emergency "Brought in by" reset
		setPatientCanProvideDetails(true);
		setBroughtInByName("");
		setBroughtInByPhone("");
		setBroughtInByRelationship("Good Samaritan");
		setBroughtInByIdType("");
		setBroughtInByIdNumber("");

		// ID verification reset
		setIsIdVerified(false);
		setVerifiedFirstName("");
		setVerifiedLastName("");
		setVerifiedDob("");
		setUseIdVerification(false);

		setError("");
		setSuccess("");
		setDuplicatesFound([]);
		setShowDuplicateWarning(false);
		setIsRegisterOpen(true);
	};

	const handleCloseRegisterModal = () => {
		setIsRegisterOpen(false);
		setShowDuplicateWarning(false);
		setDuplicatesFound([]);
		onRegisterModalClose?.();
	};

	const handleRegisterSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		// Strict duplicate check block: If duplicate warning is displayed or duplicates were found, strictly block submission
		if (duplicatesFound.length > 0) {
			const existing = duplicatesFound[0];
			const hospNum =
				existing.hospital_number || existing.hospitalNumber || "Existing";
			setError(
				`REGISTRATION BLOCKED: Patient record already exists for "${existing.name}" (Hospital Number: ${hospNum}). Duplicate registration is strictly prohibited.`,
			);
			return;
		}

		// Strict Validation for Standard and Maternity registrations, and emergency when details provided
		if (regTab !== "emergency" || patientCanProvideDetails) {
			const trimmedName = (name || "").trim();
			if (!trimmedName || trimmedName.length < 2) {
				setError(
					"Please enter a valid, complete patient name (minimum 2 characters).",
				);
				return;
			}

			// Check duplicate against active patients list immediately as an extra hard safeguard
			const localDup = patients.find(
				(p) =>
					(p.name &&
						p.name.trim().toLowerCase() === trimmedName.toLowerCase()) ||
					(phoneNumber &&
						p.phoneNumber &&
						p.phoneNumber.trim() !== "" &&
						p.phoneNumber.trim() !== "Unknown" &&
						p.phoneNumber.replace(/\D/g, "") ===
							phoneNumber.replace(/\D/g, "")),
			);
			if (localDup) {
				setDuplicatesFound([localDup]);
				setShowDuplicateWarning(true);
				setError(
					`REGISTRATION BLOCKED: Patient file already exists for "${localDup.name}" (Hospital Number: ${localDup.hospitalNumber}). Duplicate registration is not permitted. Please open their existing file.`,
				);
				return;
			}
			if (!dateOfBirth) {
				setError("Please select a valid Date of Birth.");
				return;
			}
			const dobDate = new Date(dateOfBirth);
			const today = new Date();
			today.setHours(23, 59, 59, 999);
			if (dobDate > today) {
				setError(
					"Date of Birth cannot be in the future. Please select a valid birth date.",
				);
				return;
			}
			if (dobDate < new Date("1900-01-01")) {
				setError("Date of Birth cannot be earlier than year 1900.");
				return;
			}
			const phoneDigits = (phoneNumber || "").replace(/\D/g, "");
			if (
				!phoneNumber ||
				phoneDigits.length < 7 ||
				phoneDigits.length > 15
			) {
				setError(
					"Please enter a valid, complete phone number (7 to 15 digits).",
				);
				return;
			}
		}

		let calculatedFee = 0;
		let body: RegistrationPayload = {
			registeredBy: currentUsername || "Receptionist",
		};

		const finalName = name;
		const finalDob = dateOfBirth;

		if (regTab === "standard") {
			calculatedFee = 3000;
			body = {
				...body,
				name: finalName,
				dateOfBirth: finalDob,
				gender,
				phoneNumber,
				email,
				address,
				maritalStatus,
				cardType: cardType === "Eye Clinic" ? "Eye Clinic" : "Standard",
				cardFee: calculatedFee,
				status: "Triage Pending",
				idType: regIdType || null,
				idNumber: regIdNumber || null,
				nextOfKinName: regNextOfKinName || null,
				nextOfKinPhone: regNextOfKinPhone || null,
				nextOfKinRelationship: regNextOfKinRelationship || null,
				patientCategory,
				...(patientCategory === "Family" && {
					familyName: selectedFamilyId,
					familyRelationship,
				}),
				...(patientCategory === "Company" && {
					companyName: selectedCompanyId,
					employeeId: employeeId || null,
					designation: designation || null,
					letterReference: letterReference || null,
					letterVerified,
				}),
				vitals: {
					bloodPressure: regBP,
					temperature: parseFloat(regTemp) || null,
					pulseRate: parseInt(regHR, 10) || null,
					respiratoryRate: parseInt(regRR, 10) || null,
					spo2: parseInt(regSpo2, 10) || null,
					weight: parseFloat(regWeight) || null,
					height: parseFloat(regHeight) || null,
				},
			};
		} else if (regTab === "maternity") {
			calculatedFee = 5000;
			body = {
				...body,
				name: finalName,
				dateOfBirth: finalDob,
				gender: "Female", // Expectant mothers are female
				phoneNumber,
				email,
				address,
				maritalStatus,
				cardType: "Maternity",
				cardFee: calculatedFee,
				status: "Triage Pending",
				idType: regIdType || null,
				idNumber: regIdNumber || null,
				nextOfKinName: regNextOfKinName || null,
				nextOfKinPhone: regNextOfKinPhone || null,
				nextOfKinRelationship: regNextOfKinRelationship || null,
				maternityDetails: {
					gravida,
					para,
					lmp: lmp || null,
					edd: edd || null,
					gestationalAge,
					tribe,
					occupation,
					abortion,
					premature,
				},
				vitals: {
					bloodPressure: regBP,
					temperature: parseFloat(regTemp) || null,
					pulseRate: parseInt(regHR) || null,
					respiratoryRate: parseInt(regRR) || null,
					spo2: parseInt(regSpo2) || null,
					weight: parseFloat(regWeight) || null,
					height: parseFloat(regHeight) || null,
				},
			};
		} else if (regTab === "emergency") {
			calculatedFee = getCalculatedCardFee(); // calculated dynamic fee based on checkboxes
			const cashCol = parseFloat(emergencyCashCollected) || 0;
			if (cashCol < 5000) {
				setError(
					"Minimum cash collected at OPD registration for emergency must be ₦5,000.",
				);
				return;
			}

			const finalBroughtInName = broughtInByName;

			body = {
				...body,
				name: patientCanProvideDetails
					? finalName
					: name || "Unidentified Emergency Patient",
				dateOfBirth: patientCanProvideDetails
					? finalDob
					: dateOfBirth || new Date().toISOString().split("T")[0],
				gender: emergencyGender,
				phoneNumber: patientCanProvideDetails
					? phoneNumber
					: phoneNumber || "Unknown",
				email: emergencyEmail,
				address: patientCanProvideDetails
					? address
					: address || "Emergency Trauma Scene",
				maritalStatus: emergencyMaritalStatus,
				cardType: "Emergency",
				cardFee: calculatedFee,
				status: "Emergency Dispatched",
				idType: patientCanProvideDetails ? regIdType || null : null,
				idNumber: patientCanProvideDetails ? regIdNumber || null : null,
				nextOfKinName: regNextOfKinName || null,
				nextOfKinPhone: regNextOfKinPhone || null,
				nextOfKinRelationship: regNextOfKinRelationship || null,
				patientCanProvideDetails,
				broughtInByName: !patientCanProvideDetails
					? finalBroughtInName
					: broughtInByName || null,
				broughtInByPhone: !patientCanProvideDetails
					? broughtInByPhone
					: broughtInByPhone || null,
				broughtInByRelationship: !patientCanProvideDetails
					? broughtInByRelationship
					: broughtInByRelationship || null,
				broughtInByIdType: !patientCanProvideDetails
					? broughtInByIdType || null
					: null,
				broughtInByIdNumber: !patientCanProvideDetails
					? broughtInByIdNumber || null
					: null,
				emergencyDetails: {
					isSickEmergency,
					isUnbookedLabour,
					isAccident,
					isDoctorOnCall,
					isAfterHours,
					totalBillAmount: parseFloat(emergencyTotalBill) || calculatedFee,
					cashCollected: cashCol,
					doctorOnCallName: emergencyDoctorName,
					customDetails: `Emergency incident intake. Total dynamic fee: ₦${calculatedFee}. Doctor on Call: ${emergencyDoctorName}.${
						!patientCanProvideDetails
							? ` Brought in by: ${finalBroughtInName} (${broughtInByRelationship}, Phone: ${broughtInByPhone}).`
							: ""
					}`,
				},
				vitals: {
					bloodPressure: regBP,
					temperature: parseFloat(regTemp) || null,
					pulseRate: parseInt(regHR) || null,
					respiratoryRate: parseInt(regRR) || null,
					spo2: parseInt(regSpo2) || null,
					weight: parseFloat(regWeight) || null,
					height: parseFloat(regHeight) || null,
				},
			};
		}

		try {
			setIsRegistering(true);
			const response = await apiFetch("/patients", {
				method: "POST",
				body: JSON.stringify(body),
			});

			if (response && response.success) {
				const patientData = response.data;
				setSuccess(
					`${regTab.toUpperCase()} Patient registered successfully!`,
				);
				setIsRegisterOpen(false);
				onRegisterModalClose?.();
				setRegisteredPatient(patientData);
				setIsSuccessModalOpen(true); // Open success modal with card & receipt
				onRegistered();
			} else {
				setError(
					response?.error ||
						response?.message ||
						"Registration failed. Please check form details.",
				);
			}
		} catch (err) {
			setError(
				(err instanceof Error && err.message) ||
					"Registration failed. Please check all fields.",
			);
		} finally {
			setIsRegistering(false);
		}
	};

	return {
		isRegistering,
		regTab,
		setRegTab,
		isRegisterOpen,
		setIsRegisterOpen,
		isSuccessModalOpen,
		setIsSuccessModalOpen,
		registeredPatient,
		setRegisteredPatient,
		successCheckedFolder,
		setSuccessCheckedFolder,
		successCheckedCards,
		setSuccessCheckedCards,
		successCheckedReceipt,
		setSuccessCheckedReceipt,
		successCheckedTriage,
		setSuccessCheckedTriage,
		regBP,
		setRegBP,
		regHR,
		setRegHR,
		regTemp,
		setRegTemp,
		regRR,
		setRegRR,
		regSpo2,
		setRegSpo2,
		regWeight,
		setRegWeight,
		regHeight,
		setRegHeight,
		abortion,
		setAbortion,
		premature,
		setPremature,
		email,
		setEmail,
		emergencyGender,
		setEmergencyGender,
		emergencyMaritalStatus,
		setEmergencyMaritalStatus,
		emergencyEmail,
		setEmergencyEmail,
		emergencyTotalBill,
		setEmergencyTotalBill,
		emergencyCashCollected,
		setEmergencyCashCollected,
		emergencyDoctorName,
		setEmergencyDoctorName,
		regIdType,
		setRegIdType,
		regIdNumber,
		setRegIdNumber,
		regNextOfKinName,
		setRegNextOfKinName,
		regNextOfKinPhone,
		setRegNextOfKinPhone,
		regNextOfKinRelationship,
		setRegNextOfKinRelationship,
		patientCanProvideDetails,
		setPatientCanProvideDetails,
		broughtInByName,
		setBroughtInByName,
		broughtInByPhone,
		setBroughtInByPhone,
		broughtInByRelationship,
		setBroughtInByRelationship,
		broughtInByIdType,
		setBroughtInByIdType,
		broughtInByIdNumber,
		setBroughtInByIdNumber,
		isIdVerified,
		setIsIdVerified,
		verifiedFirstName,
		setVerifiedFirstName,
		verifiedLastName,
		setVerifiedLastName,
		verifiedDob,
		setVerifiedDob,
		useIdVerification,
		setUseIdVerification,
		name,
		setName,
		dateOfBirth,
		setDateOfBirth,
		gender,
		setGender,
		phoneNumber,
		setPhoneNumber,
		address,
		setAddress,
		maritalStatus,
		setMaritalStatus,
		cardType,
		setCardType,
		patientCategory,
		setPatientCategory,
		selectedFamilyId,
		setSelectedFamilyId,
		familyRelationship,
		setFamilyRelationship,
		selectedCompanyId,
		setSelectedCompanyId,
		employeeId,
		setEmployeeId,
		designation,
		setDesignation,
		letterReference,
		setLetterReference,
		letterVerified,
		setLetterVerified,
		gravida,
		setGravida,
		para,
		setPara,
		lmp,
		setLmp,
		edd,
		setEdd,
		gestationalAge,
		setGestationalAge,
		tribe,
		setTribe,
		occupation,
		setOccupation,
		isSickEmergency,
		setIsSickEmergency,
		isUnbookedLabour,
		setIsUnbookedLabour,
		isAccident,
		setIsAccident,
		isDoctorOnCall,
		setIsDoctorOnCall,
		isAfterHours,
		setIsAfterHours,
		getCalculatedCardFee,
		handleOpenRegister,
		handleCloseRegisterModal,
		handleRegisterSubmit,
		triggerDuplicateCheck,
	};
}

export type UseRegistrationFormReturn = ReturnType<typeof useRegistrationForm>;
