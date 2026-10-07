/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx.
 *
 * Consultation hook: owns the consultation workspace patient (with the
 * verbatim clinical-defaults initializer), the service toggles, the
 * payment recorder, the save handler (POST
 * /patients/eye-clinic/consultations), and the record-view selection.
 * Messaging and the post-save refresh arrive via params — the shell wires
 * them. apiFetch path and billing math preserved verbatim.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { apiFetch } from '../../../utils/api';
import type { EyeConsultationRecord, EyeNotify } from '../_utils/eye-types';

export interface UseEyeConsultationParams {
	notify: EyeNotify;
	refresh: () => Promise<void>;
}

export interface UseEyeConsultationResult {
	selectedPatient: any | null;
	setSelectedPatient: (patient: any | null) => void;
	selectPatientForConsult: (pat: any) => void;
	handleServiceToggle: (item: any, category: string) => void;
	getSelectedServicesTotal: () => number;
	handleRecordPayment: (amountStr: string) => void;
	handleSaveConsultation: (e: FormEvent) => Promise<void>;
	selectedRecordToView: EyeConsultationRecord | null;
	setSelectedRecordToView: (record: EyeConsultationRecord | null) => void;
}

export function useEyeConsultation({ notify, refresh }: UseEyeConsultationParams): UseEyeConsultationResult {
	const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
	const [selectedRecordToView, setSelectedRecordToView] = useState<any | null>(null);

	// Selection of patient
	const selectPatientForConsult = (pat: any) => {
		const initializedPatient = {
			...pat,
			bloodPressure: pat.bloodPressure || '120/80',
			bloodGlucose: pat.bloodGlucose || '5.4',
			onset: pat.onset || 'Gradual',
			duration: pat.duration || '3 months',
			laterality: pat.laterality || 'Both',
			pain: pat.pain || 'No',
			visionChanges: pat.visionChanges || 'Blurred',
			redness: pat.redness || 'No',
			discharge: pat.discharge || 'No',
			photophobia: pat.photophobia || 'No',
			trauma: pat.trauma || 'No',
			previousEyeSurgery: pat.previousEyeSurgery || 'No',
			aggravatingFactors: pat.aggravatingFactors || 'Bright lights, reading',
			associatedSymptoms: pat.associatedSymptoms || 'None',

			pastOcularRefractive: pat.pastOcularRefractive || 'None',
			pastOcularCataract: pat.pastOcularCataract || 'None',
			pastOcularGlaucoma: pat.pastOcularGlaucoma || 'None',
			pastOcularDiabetic: pat.pastOcularDiabetic || 'None',
			pastOcularTrauma: pat.pastOcularTrauma || 'None',
			pastOcularSurgery: pat.pastOcularSurgery || '',

			medDiabetes: pat.medDiabetes || 'No',
			medHypertension: pat.medHypertension || 'No',
			medAsthma: pat.medAsthma || 'No',
			medOthers: pat.medOthers || '',

			allergiesNone: pat.allergiesNone !== undefined ? pat.allergiesNone : true,
			allergiesDrug: pat.allergiesDrug || '',

			famGlaucoma: pat.famGlaucoma || 'No',
			famBlindness: pat.famBlindness || 'No',
			famDiabetes: pat.famDiabetes || 'No',
			famHypertension: pat.famHypertension || 'No',

			socSmoking: pat.socSmoking || 'No',
			socAlcohol: pat.socAlcohol || 'No',

			vaUnaidedOD: pat.vaUnaidedOD || '6/6',
			vaUnaidedOS: pat.vaUnaidedOS || '6/9',
			vaPinholeOD: pat.vaPinholeOD || '6/6',
			vaPinholeOS: pat.vaPinholeOS || '6/6',
			vaAidedOD: pat.vaAidedOD || '6/6',
			vaAidedOS: pat.vaAidedOS || '6/6',
			vaNvaOu: pat.vaNvaOu || 'N6',

			iopOD: pat.iopOD || '14',
			iopOS: pat.iopOS || '15',
			iopMethod: pat.iopMethod || 'Non-contact',

			pupilEquality: pat.pupilEquality || 'Equal',
			pupilReaction: pat.pupilReaction || 'Brisk',
			pupilRAPD: pat.pupilRAPD || 'Absent',

			lidOD: pat.lidOD || 'Normal',
			lidOS: pat.lidOS || 'Normal',
			conjunctivaOD: pat.conjunctivaOD || 'Clear',
			conjunctivaOS: pat.conjunctivaOS || 'Clear',
			corneaOD: pat.corneaOD || 'Clear and smooth',
			corneaOS: pat.corneaOS || 'Clear and smooth',
			chamberOD: pat.chamberOD || 'Deep and quiet',
			chamberOS: pat.chamberOS || 'Deep and quiet',
			lensOD: pat.lensOD || 'Clear',
			lensOS: pat.lensOS || 'Clear',

			vitreousOD: pat.vitreousOD || 'Clear',
			vitreousOS: pat.vitreousOS || 'Clear',
			discOD: pat.discOD || 'Pink, well defined',
			discOS: pat.discOS || 'Pink, well defined',
			cupOD: pat.cupOD || '0.3',
			cupOS: pat.cupOS || '0.3',
			maculaOD: pat.maculaOD || 'Healthy foveal reflex',
			maculaOS: pat.maculaOS || 'Healthy foveal reflex',
			vesselsOD: pat.vesselsOD || 'A/V ratio 2:3, normal calibre',
			vesselsOS: pat.vesselsOS || 'A/V ratio 2:3, normal calibre',
			peripheryOD: pat.peripheryOD || 'Flat, no tears',
			peripheryOS: pat.peripheryOS || 'Flat, no tears',

			specRefractionOD: pat.specRefractionOD || 'Sph: 0.00, Cyl: 0.00, Axis: 0',
			specRefractionOS: pat.specRefractionOS || 'Sph: 0.00, Cyl: 0.00, Axis: 0',
			specRefractionAdd: pat.specRefractionAdd || '+1.50 D',
			specVisualField: pat.specVisualField || 'Not ordered',
			specOCT: pat.specOCT || 'Not ordered',
			specFundusPhoto: pat.specFundusPhoto || 'Not ordered',
			specFluorescein: pat.specFluorescein || 'Not ordered',

			chiefComplaint: pat.chiefComplaint || '',
			history: pat.history || '',
			routineExam: pat.routineExam || '',
			externalExam: pat.externalExam || '',
			diagnosis: pat.diagnosis || '',
			treatmentPlan: pat.treatmentPlan || '',

			planMeds: pat.planMeds || 'Lubricating Eye Drops BID OU',
			planProcedures: pat.planProcedures || 'None',
			planInvestigations: pat.planInvestigations || 'None',
			planCounseling: pat.planCounseling || 'Avoid prolonged blue screen time without rest',
			planFollowUp: pat.planFollowUp || '1 month',
			planPrognosis: pat.planPrognosis || 'Good',

			selectedServices: pat.selectedServices || [],
			recordedPaymentsHistory: pat.recordedPaymentsHistory || [],
			subTab: pat.subTab || 'all'
		};
		setSelectedPatient(initializedPatient);
	};

	const handleServiceToggle = (item: any, category: string) => {
		if (!selectedPatient) return;
		const isAlreadySelected = selectedPatient.selectedServices?.some((s: any) => s.name === item.name);
		let updatedServices = [];
		if (isAlreadySelected) {
			updatedServices = selectedPatient.selectedServices.filter((s: any) => s.name !== item.name);
		} else {
			updatedServices = [...(selectedPatient.selectedServices || []), { ...item, category }];
		}

		const updatedPatient = { ...selectedPatient, selectedServices: updatedServices };
		setSelectedPatient(updatedPatient);
	};

	const getSelectedServicesTotal = () => {
		if (!selectedPatient) return 0;
		const servicesSum = selectedPatient.selectedServices?.reduce((acc: number, item: any) => acc + item.price, 0) || 0;
		const cardFee = selectedPatient.cardFee || 0;
		return servicesSum + cardFee;
	};

	const handleRecordPayment = (amountStr: string) => {
		if (!selectedPatient) return;
		const amount = parseFloat(amountStr);
		const total = getSelectedServicesTotal() || selectedPatient.totalBill || 3000;
		const alreadyPaid = selectedPatient.recordedPaymentsHistory?.reduce((acc: number, p: any) => acc + p.amount, 0) || (selectedPatient.paidAmount || 0);
		const remaining = Math.max(0, total - alreadyPaid);

		if (isNaN(amount) || amount <= 0) {
			notify.showError('Please specify a valid payment amount.');
			return;
		}
		if (amount > remaining) {
			notify.showError(`Amount exceeds remaining outstanding balance of ₦${remaining.toLocaleString()}.`);
			return;
		}

		const newPayment = {
			amount,
			date: new Date().toISOString().split('T')[0],
			reference: `PAY-${Math.floor(100000 + Math.random() * 900000)}`
		};

		const updatedPayments = [...(selectedPatient.recordedPaymentsHistory || []), newPayment];
		const totalPaidNow = alreadyPaid + amount;

		let newPaymentStatus = 'UNPAID';
		if (totalPaidNow >= total) {
			newPaymentStatus = 'Paid';
		} else if (totalPaidNow > 0) {
			newPaymentStatus = 'Part Paid';
		}

		const newBalance = Math.max(0, total - totalPaidNow);

		const updatedPatient = {
			...selectedPatient,
			recordedPaymentsHistory: updatedPayments,
			paidAmount: totalPaidNow,
			paymentStatus: newPaymentStatus,
			balance: newBalance
		};

		setSelectedPatient(updatedPatient);
		notify.showSuccess(`Payment of ₦${amount.toLocaleString()} recorded! Ref: ${newPayment.reference}`);
	};

	const handleSaveConsultation = async (e: FormEvent) => {
		e.preventDefault();
		if (!selectedPatient) return;

		if (!selectedPatient.diagnosis || !selectedPatient.diagnosis.trim()) {
			notify.showError('Assessment / Clinical Diagnosis is required to complete consultation!');
			setSelectedPatient({ ...selectedPatient, subTab: 'exams' });
			return;
		}

		const total = getSelectedServicesTotal() || selectedPatient.totalBill || 3000;
		const paidSum = selectedPatient.recordedPaymentsHistory?.reduce((acc: number, p: any) => acc + p.amount, 0) || (selectedPatient.paidAmount || 0);
		const currentBalance = Math.max(0, total - paidSum);

		try {
			const res = await apiFetch('/patients/eye-clinic/consultations', {
				method: 'POST',
				body: JSON.stringify({
					patientId: selectedPatient.id,
					patientName: selectedPatient.name,
					hospitalNumber: selectedPatient.hospitalNumber,
					phoneNumber: selectedPatient.phoneNumber,
					occupation: selectedPatient.occupation || '',
					chiefComplaint: selectedPatient.chiefComplaint || '',
					history: selectedPatient.history || '',
					routineExam: selectedPatient.routineExam || '',
					externalExam: selectedPatient.externalExam || '',
					diagnosis: selectedPatient.diagnosis.trim(),
					treatmentPlan: selectedPatient.treatmentPlan || selectedPatient.planMeds || '',
					vitals: {
						bp: selectedPatient.bloodPressure,
						sugar: selectedPatient.bloodGlucose
					},
					services: selectedPatient.selectedServices || [],
					totalBill: total,
					totalPaid: paidSum,
					balance: currentBalance,
					paymentStatus: selectedPatient.paymentStatus || (currentBalance === 0 ? 'Paid' : 'UNPAID')
				})
			});

			if (res && res.success) {
				notify.showSuccess(res.message || `Consultation saved and bill of ₦${total.toLocaleString()} logged for Cashier!`);
				setSelectedPatient({ ...selectedPatient, status: 'Consulted', totalBill: total, paidAmount: paidSum, balance: currentBalance });
				await refresh();
			} else {
				notify.showError(res.error || 'Failed to save consultation.');
			}
		} catch (err: any) {
			notify.showError(err.message || 'Error connecting to database to save encounter.');
		}
	};

	return {
		selectedPatient,
		setSelectedPatient,
		selectPatientForConsult,
		handleServiceToggle,
		getSelectedServicesTotal,
		handleRecordPayment,
		handleSaveConsultation,
		selectedRecordToView,
		setSelectedRecordToView
	};
}
