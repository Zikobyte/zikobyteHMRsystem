/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx.
 *
 * Data hook: owns patients/consultations (savedRecords) domain data, the
 * fetchers (GET /patients/eye-clinic/patients + GET
 * /patients/eye-clinic/consultations with localStorage cache fallback and
 * the 5s poll), the verify-payment handler (POST
 * /patients/eye-clinic/verify-payment), the success/error messaging, the
 * search/filter states, and the derived filtered lists + department totals.
 * Tab routing stays in the shell; cross-hook effects (confirm-modal close,
 * consult selection, tab switch) arrive via the `onVerified` callback so
 * this hook stays decoupled. apiFetch paths and mapping preserved verbatim.
 */

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../utils/api';
import type { EyeConsultationRecord, EyeNotify, EyePatient, EyeStatusFilter } from '../_utils/eye-types';

export interface VerifyPaymentOptions {
	onVerified?: (patient: any) => void;
}

export interface UseEyeClinicDataResult {
	patients: EyePatient[];
	savedRecords: EyeConsultationRecord[];
	isLoading: boolean;
	fetchEyeClinicData: () => Promise<void>;
	handleVerifyCashierPayment: (patientId: string, opts?: VerifyPaymentOptions) => Promise<void>;
	successMsg: string;
	errorMsg: string;
	showSuccess: (msg: string) => void;
	showError: (msg: string) => void;
	notify: EyeNotify;
	registeredSearch: string;
	setRegisteredSearch: (value: string) => void;
	statusFilter: EyeStatusFilter;
	setStatusFilter: (value: EyeStatusFilter) => void;
	queueSearch: string;
	setQueueSearch: (value: string) => void;
	recordsSearch: string;
	setRecordsSearch: (value: string) => void;
	filteredQueue: EyePatient[];
	registeredFilteredPatients: EyePatient[];
	recordsToDisplay: EyeConsultationRecord[];
	totalRecords: number;
	waitingConsultations: number;
	paymentPending: number;
	completedToday: number;
}

export function useEyeClinicData(): UseEyeClinicDataResult {
	const [patients, setPatients] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [registeredSearch, setRegisteredSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<EyeStatusFilter>('all');
	const [queueSearch, setQueueSearch] = useState('');
	const [savedRecords, setSavedRecords] = useState<any[]>([]);
	const [recordsSearch, setRecordsSearch] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const showSuccess = (msg: string) => {
		setSuccessMsg(msg);
		setTimeout(() => setSuccessMsg(''), 5000);
	};

	const showError = (msg: string) => {
		setErrorMsg(msg);
		setTimeout(() => setErrorMsg(''), 5000);
	};

	const notify: EyeNotify = { showSuccess, showError };

	// Fetch from database API
	const fetchEyeClinicData = async () => {
		setIsLoading(true);
		try {
			// 1. Fetch Patients
			const pRes = await apiFetch('/patients/eye-clinic/patients');
			if (pRes && pRes.success && Array.isArray(pRes.data)) {
				setPatients(pRes.data);
				localStorage.setItem('zmc_eye_patients_new', JSON.stringify(pRes.data));
			} else {
				const saved = localStorage.getItem('zmc_eye_patients_new');
				if (saved) setPatients(JSON.parse(saved));
			}

			// 2. Fetch Consultations
			const cRes = await apiFetch('/patients/eye-clinic/consultations');
			if (cRes && cRes.success && Array.isArray(cRes.data)) {
				setSavedRecords(cRes.data);
				localStorage.setItem('zmc_eye_consultations_new', JSON.stringify(cRes.data));
			} else {
				const savedRecs = localStorage.getItem('zmc_eye_consultations_new');
				if (savedRecs) setSavedRecords(JSON.parse(savedRecs));
			}
		} catch (err: any) {
			console.warn('Could not fetch from backend API, using cached data:', err);
			const saved = localStorage.getItem('zmc_eye_patients_new');
			if (saved) {
				try { setPatients(JSON.parse(saved)); } catch (e) {}
			}
			const savedRecs = localStorage.getItem('zmc_eye_consultations_new');
			if (savedRecs) {
				try { setSavedRecords(JSON.parse(savedRecs)); } catch (e) {}
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchEyeClinicData();
		const interval = setInterval(fetchEyeClinicData, 5000);
		return () => clearInterval(interval);
	}, []);

	const handleVerifyCashierPayment = async (patientId: string, opts?: VerifyPaymentOptions) => {
		try {
			const res = await apiFetch('/patients/eye-clinic/verify-payment', {
				method: 'POST',
				body: JSON.stringify({ patientId })
			});

			if (res && res.success) {
				showSuccess(res.message || 'Payment verified! Patient sent to Eye Clinic Consultations.');
				await fetchEyeClinicData();

				const updatedPat = res.data;
				if (updatedPat) {
					opts?.onVerified?.(updatedPat);
				}
			} else {
				showError(res.error || 'Failed to verify payment');
			}
		} catch (err: any) {
			showError(err.message || 'Error processing payment verification');
		}
	};

	// Filtered lists
	const filteredQueue = patients.filter(p => {
		const q = queueSearch.toLowerCase();
		return (
			(p.name || '').toLowerCase().includes(q) ||
			(p.hospitalNumber || '').toLowerCase().includes(q) ||
			(p.phoneNumber || '').includes(q)
		);
	});

	const registeredFilteredPatients = patients.filter(p => {
		const q = registeredSearch.toLowerCase();
		const matchesSearch = (p.name || '').toLowerCase().includes(q) ||
			(p.hospitalNumber || '').toLowerCase().includes(q) ||
			(p.phoneNumber || '').includes(q) ||
			(p.occupation && p.occupation.toLowerCase().includes(q)) ||
			(p.chiefComplaint && p.chiefComplaint.toLowerCase().includes(q)) ||
			(p.diagnosis && p.diagnosis.toLowerCase().includes(q));

		if (!matchesSearch) return false;
		if (statusFilter === 'all') return true;

		const totalBillVal = Number(p.totalBill ?? (p.balance ? p.balance + (p.paidAmount || 0) : 3000));
		const paidVal = Number(p.paidAmount ?? (p.paymentStatus === 'Paid' ? totalBillVal : 0));

		if (statusFilter === 'Paid') return totalBillVal > 0 && paidVal >= totalBillVal;
		if (statusFilter === 'Unpaid') return !totalBillVal || paidVal <= 0;
		if (statusFilter === 'Partial') return paidVal > 0 && paidVal < totalBillVal;

		return p.status === statusFilter;
	});

	const recordsToDisplay = savedRecords.filter(r => {
		const q = recordsSearch.toLowerCase();
		return (
			(r.patientName || r.name || '').toLowerCase().includes(q) ||
			(r.hospitalNumber || r.patientId || '').toLowerCase().includes(q) ||
			(r.diagnosis || '').toLowerCase().includes(q) ||
			(r.chiefComplaint || '').toLowerCase().includes(q)
		);
	});

	const totalRecords = patients.length;
	const waitingConsultations = patients.filter(p => p.status === 'Awaiting Consult' || p.status === 'Awaiting Cashier Verification').length;
	const paymentPending = patients.filter(p => p.paymentStatus === 'UNPAID' || p.paymentStatus === 'Part Paid' || (typeof p.balance === 'number' && p.balance > 0)).length;
	const completedToday = patients.filter(p => p.status === 'Consulted').length;

	return {
		patients,
		savedRecords,
		isLoading,
		fetchEyeClinicData,
		handleVerifyCashierPayment,
		successMsg,
		errorMsg,
		showSuccess,
		showError,
		notify,
		registeredSearch,
		setRegisteredSearch,
		statusFilter,
		setStatusFilter,
		queueSearch,
		setQueueSearch,
		recordsSearch,
		setRecordsSearch,
		filteredQueue,
		registeredFilteredPatients,
		recordsToDisplay,
		totalRecords,
		waitingConsultations,
		paymentPending,
		completedToday
	};
}
