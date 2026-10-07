/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx.
 *
 * Registration hook: owns the reg* form state (~10 fields), validation
 * (regErrors), handleRegister (POST /patients/eye-clinic/patients), the
 * returning-patient search, and the register + confirm modal state.
 * Messaging, the patient list refresh, and the found-patient effect
 * (consult selection + tab switch) arrive via params so hooks stay
 * decoupled — the shell wires them. apiFetch path and validation rules
 * preserved verbatim.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { apiFetch } from '../../../utils/api';
import type { EyeNotify, EyePatient } from '../_utils/eye-types';

export interface UseEyeRegistrationParams {
	notify: EyeNotify;
	patients: EyePatient[];
	refresh: () => Promise<void>;
	onPatientFound: (patient: any) => void;
}

export interface UseEyeRegistrationResult {
	regName: string;
	setRegName: (value: string) => void;
	regPhone: string;
	setRegPhone: (value: string) => void;
	regDOB: string;
	setRegDOB: (value: string) => void;
	regOccupation: string;
	setRegOccupation: (value: string) => void;
	regAddress: string;
	setRegAddress: (value: string) => void;
	regNextOfKin: string;
	setRegNextOfKin: (value: string) => void;
	regComplaint: string;
	setRegComplaint: (value: string) => void;
	regHistory: string;
	setRegHistory: (value: string) => void;
	regErrors: Record<string, string>;
	setRegErrors: (errors: Record<string, string>) => void;
	isSubmittingReg: boolean;
	cardType: 'new' | 'returning';
	setCardType: (value: 'new' | 'returning') => void;
	cardCategoryType: string;
	setCardCategoryType: (value: string) => void;
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	isRegisterModalOpen: boolean;
	setIsRegisterModalOpen: (open: boolean) => void;
	regConfirmModalPatient: any | null;
	setRegConfirmModalPatient: (patient: any | null) => void;
	handleRegister: (e: FormEvent) => Promise<void>;
	handleSearchReturning: () => void;
}

export function useEyeRegistration({ notify, patients, refresh, onPatientFound }: UseEyeRegistrationParams): UseEyeRegistrationResult {
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
	const [regConfirmModalPatient, setRegConfirmModalPatient] = useState<any | null>(null);

	const [regName, setRegName] = useState('');
	const [regPhone, setRegPhone] = useState('');
	const [regDOB, setRegDOB] = useState('');
	const [regOccupation, setRegOccupation] = useState('');
	const [regAddress, setRegAddress] = useState('');
	const [regNextOfKin, setRegNextOfKin] = useState('');
	const [regComplaint, setRegComplaint] = useState('');
	const [regHistory, setRegHistory] = useState('');
	const [regErrors, setRegErrors] = useState<Record<string, string>>({});
	const [isSubmittingReg, setIsSubmittingReg] = useState(false);

	const [cardType, setCardType] = useState<'new' | 'returning'>('new');
	const [cardCategoryType, setCardCategoryType] = useState('Eye Clinic');
	const [searchQuery, setSearchQuery] = useState('');

	// Registering logic with full validation & duplicate protection
	const handleRegister = async (e: FormEvent) => {
		e.preventDefault();
		const errors: Record<string, string> = {};

		if (!regName || !regName.trim()) {
			errors.name = 'Full Name is required.';
		} else if (regName.trim().length < 3) {
			errors.name = 'Full Name must be at least 3 characters.';
		}

		const cleanPhone = (regPhone || '').trim().replace(/[^0-9+]/g, '');
		if (!cleanPhone || cleanPhone.length < 7) {
			errors.phone = 'Valid Phone Number (at least 7 digits) is required.';
		}

		if (!regDOB || !regDOB.trim()) {
			errors.dob = 'Date of Birth is required.';
		} else {
			const dobDate = new Date(regDOB);
			if (isNaN(dobDate.getTime()) || dobDate > new Date()) {
				errors.dob = 'Valid Date of Birth is required (cannot be future date).';
			}
		}

		if (!regAddress || !regAddress.trim()) {
			errors.address = 'Residential Address is required.';
		}

		if (!regNextOfKin || !regNextOfKin.trim()) {
			errors.nextOfKin = 'Next of Kin name and relationship are required.';
		}

		if (!regComplaint || !regComplaint.trim()) {
			errors.complaint = 'Chief Complaint is required for clinical ocular intake.';
		}

		if (Object.keys(errors).length > 0) {
			setRegErrors(errors);
			notify.showError('Please complete all required fields highlighted in red.');
			return;
		}

		setRegErrors({});
		setIsSubmittingReg(true);

		try {
			const res = await apiFetch('/patients/eye-clinic/patients', {
				method: 'POST',
				body: JSON.stringify({
					name: regName.trim(),
					phoneNumber: cleanPhone,
					dateOfBirth: regDOB,
					occupation: regOccupation.trim(),
					address: regAddress.trim(),
					nextOfKin: regNextOfKin.trim(),
					chiefComplaint: regComplaint.trim(),
					history: regHistory.trim(),
					cardType,
					cardCategoryType
				})
			});

			if (res && res.success) {
				const createdPatient = res.data;
				notify.showSuccess(res.message || `Successfully registered ${regName}! Assigned Card ID: ${createdPatient.hospitalNumber}.`);

				// Clear fields
				setRegName('');
				setRegPhone('');
				setRegDOB('');
				setRegOccupation('');
				setRegAddress('');
				setRegNextOfKin('');
				setRegComplaint('');
				setRegHistory('');
				setIsRegisterModalOpen(false);

				// Open Cashier Routing modal
				setRegConfirmModalPatient(createdPatient);

				// Refresh live list
				await refresh();
			} else {
				notify.showError(res.error || 'Failed to register patient.');
			}
		} catch (err: any) {
			console.error('Registration error:', err);
			notify.showError(err.message || 'Error communicating with database server.');
		} finally {
			setIsSubmittingReg(false);
		}
	};

	// Search returning patient
	const handleSearchReturning = () => {
		if (!searchQuery) return;
		const match = patients.find(
			p => (p.hospitalNumber && p.hospitalNumber.toLowerCase() === searchQuery.trim().toLowerCase()) ||
				(p.phoneNumber && p.phoneNumber.includes(searchQuery.trim())) ||
				(p.name && p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
		);

		if (match) {
			notify.showSuccess(`Retrieved clinical file for ${match.name} (${match.hospitalNumber})!`);
			onPatientFound(match);
			setIsRegisterModalOpen(false);
		} else {
			notify.showError('No registered eye patient found matching this ID, Name or Phone.');
		}
	};

	return {
		regName,
		setRegName,
		regPhone,
		setRegPhone,
		regDOB,
		setRegDOB,
		regOccupation,
		setRegOccupation,
		regAddress,
		setRegAddress,
		regNextOfKin,
		setRegNextOfKin,
		regComplaint,
		setRegComplaint,
		regHistory,
		setRegHistory,
		regErrors,
		setRegErrors,
		isSubmittingReg,
		cardType,
		setCardType,
		cardCategoryType,
		setCardCategoryType,
		searchQuery,
		setSearchQuery,
		isRegisterModalOpen,
		setIsRegisterModalOpen,
		regConfirmModalPatient,
		setRegConfirmModalPatient,
		handleRegister,
		handleSearchReturning
	};
}
