/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from nursing/_tabs/DetainedPatientsView.tsx.
 *
 * Data hook: owns pending/detained observation-unit state, search filter,
 * detain/admit modal selection + forms, confirmation dialog, the detained
 * fetch fan-out (GET /api/nursing/detained?search=) + detain/release/admit
 * handlers (POST detain/release/admit). fetch paths, bodies, and messages
 * preserved verbatim from the original component.
 */

import { useEffect, useState } from 'react';
import { apiFetch } from '@/utils/api';

export interface PendingPatient {
  id: string;
  patient_id: string;
  hospital_number: string;
  name: string;
  gender: string;
  age: string;
  phone_number?: string;
  category?: string;
  department?: string;
  referred_by?: string;
  reason?: string;
  pending_since?: string;
  created_at?: string;
}

export interface DetainedPatient {
  id: string;
  patient_id: string;
  hospital_number: string;
  name: string;
  gender: string;
  age: string;
  phone_number?: string;
  department?: string;
  reason_for_detention: string;
  initial_observation: string;
  last_nurse_notes: string;
  detained_at: string;
  detained_by: string;
  status: string;
}

export interface DetainedAdmissionForm {
  ward: string;
  bedNumber: string;
  provisionalDiagnosis: string;
  nextOfKin: string;
  region: string;
  religion: string;
  doctorOrders: string;
}

export interface DetainedConfirmationDialog {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'detained' | 'admitted' | 'released' | 'info';
}

export interface UseDetainedPatientsResult {
  pendingPatients: PendingPatient[];
  detainedPatients: DetainedPatient[];
  totalDetainedCount: number;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedForDetention: PendingPatient | null;
  setSelectedForDetention: (value: PendingPatient | null) => void;
  detentionReason: string;
  setDetentionReason: (value: string) => void;
  clinicalCardObservation: string;
  setClinicalCardObservation: (value: string) => void;
  isSubmittingDetention: boolean;
  selectedForAdmission: PendingPatient | DetainedPatient | null;
  setSelectedForAdmission: (value: PendingPatient | DetainedPatient | null) => void;
  admissionForm: DetainedAdmissionForm;
  setAdmissionForm: (value: DetainedAdmissionForm) => void;
  isSubmittingAdmission: boolean;
  confirmationDialog: DetainedConfirmationDialog;
  setConfirmationDialog: (value: DetainedConfirmationDialog) => void;
  fetchDetainedData: () => Promise<void>;
  handleOpenDetainModal: (patient: PendingPatient) => void;
  handleConfirmDetain: (e: React.FormEvent) => Promise<void>;
  handleReleasePatient: (patient: DetainedPatient) => Promise<void>;
  handleOpenAdmitModal: (patient: PendingPatient | DetainedPatient) => void;
  handleConfirmAdmission: (e: React.FormEvent) => Promise<void>;
}

export function useDetainedPatients(): UseDetainedPatientsResult {
  const [pendingPatients, setPendingPatients] = useState<PendingPatient[]>([]);
  const [detainedPatients, setDetainedPatients] = useState<DetainedPatient[]>([]);
  const [totalDetainedCount, setTotalDetainedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedForDetention, setSelectedForDetention] = useState<PendingPatient | null>(null);
  const [detentionReason, setDetentionReason] = useState<string>('');
  const [clinicalCardObservation, setClinicalCardObservation] = useState<string>('');
  const [isSubmittingDetention, setIsSubmittingDetention] = useState<boolean>(false);

  // Admission Modal State
  const [selectedForAdmission, setSelectedForAdmission] = useState<PendingPatient | DetainedPatient | null>(null);
  const [admissionForm, setAdmissionForm] = useState<DetainedAdmissionForm>({
    ward: 'General Ward Abuja',
    bedNumber: '',
    provisionalDiagnosis: '',
    nextOfKin: '',
    region: 'South West',
    religion: 'Christianity',
    doctorOrders: ''
  });
  const [isSubmittingAdmission, setIsSubmittingAdmission] = useState<boolean>(false);

  // Confirmation / Success Feedback Modal
  const [confirmationDialog, setConfirmationDialog] = useState<DetainedConfirmationDialog>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const fetchDetainedData = async () => {
    try {
      setIsLoading(true);
      const data = await apiFetch(`/nursing/detained?search=${encodeURIComponent(searchQuery)}`);
      if (data.success) {
        setPendingPatients(data.pendingAdmissions || []);
        setDetainedPatients(data.currentlyDetained || []);
        setTotalDetainedCount(data.totalDetained ?? (data.currentlyDetained || []).length);
      }
    } catch (err) {
      console.error('Failed to fetch detained patients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetainedData();
  }, [searchQuery]);

  // Open Detain Modal
  const handleOpenDetainModal = (patient: PendingPatient) => {
    setSelectedForDetention(patient);
    setDetentionReason('BP check after medication');
    setClinicalCardObservation(`Patient conscious and alert. Initial vitals checked: BP 145/95 mmHg, HR 82 bpm, SpO2 98%. Commencing close bedside observation.`);
  };

  // Submit Detain Patient
  const handleConfirmDetain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForDetention) return;
    if (!detentionReason.trim()) {
      alert('Please provide the reason for detention.');
      return;
    }
    if (!clinicalCardObservation.trim()) {
      alert('Please record the initial observation on the clinical card.');
      return;
    }

    try {
      setIsSubmittingDetention(true);
      const data = await apiFetch('/nursing/detained/detain', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedForDetention.id || selectedForDetention.hospital_number,
          reason: detentionReason.trim(),
          initialObservation: clinicalCardObservation.trim(),
          nurseName: 'Nurse On-Duty'
        })
      });

      if (data.success) {
        // Success dialog with exact message requested
        setConfirmationDialog({
          isOpen: true,
          title: 'Patient Marked as Detained',
          message: `Patient ${selectedForDetention.name} marked as detained. Reason: ${detentionReason.trim()}. Initial observation recorded on clinical card: ${clinicalCardObservation.trim()}.`,
          type: 'detained'
        });

        setSelectedForDetention(null);
        setDetentionReason('');
        setClinicalCardObservation('');
        fetchDetainedData();
      } else {
        alert(data.error || 'Failed to mark patient as detained');
      }
    } catch (err: any) {
      console.error('Error detaining patient:', err);
      alert(err?.message || 'Network error while detaining patient');
    } finally {
      setIsSubmittingDetention(false);
    }
  };

  // Release Detained Patient
  const handleReleasePatient = async (patient: DetainedPatient) => {
    if (!window.confirm(`Are you sure you want to release ${patient.name} from observation? The patient will no longer be detained.`)) {
      return;
    }

    try {
      const data = await apiFetch(`/nursing/detained/${encodeURIComponent(patient.id)}/release`, {
        method: 'POST'
      });
      if (data.success) {
        setConfirmationDialog({
          isOpen: true,
          title: 'Patient Released from Observation',
          message: data.message || `Patient ${patient.name} has been released from observation.`,
          type: 'released'
        });
        fetchDetainedData();
      } else {
        alert(data.error || 'Failed to release patient');
      }
    } catch (err: any) {
      console.error('Error releasing patient:', err);
      alert(err?.message || 'Network error while releasing patient');
    }
  };

  // Open Admission Modal
  const handleOpenAdmitModal = (patient: PendingPatient | DetainedPatient) => {
    setSelectedForAdmission(patient);
    setAdmissionForm({
      ward: 'General Ward Abuja',
      bedNumber: 'Bed 847',
      provisionalDiagnosis: (patient as any).reason || (patient as any).reason_for_detention || 'Observation and medical stabilization',
      nextOfKin: 'Immediate Relative (Contact verified)',
      region: 'South West',
      religion: 'Christianity',
      doctorOrders: 'Full bed rest, continuous vital monitoring, intake/output charting, and medication as charted.'
    });
  };

  // Submit Admission
  const handleConfirmAdmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForAdmission) return;
    if (!admissionForm.bedNumber.trim()) {
      alert('Please specify a bed number.');
      return;
    }

    try {
      setIsSubmittingAdmission(true);
      const data = await apiFetch(`/nursing/detained/${encodeURIComponent(selectedForAdmission.id)}/admit`, {
        method: 'POST',
        body: JSON.stringify({
          ward: admissionForm.ward,
          bedNumber: admissionForm.bedNumber.trim(),
          provisionalDiagnosis: admissionForm.provisionalDiagnosis.trim(),
          nextOfKin: admissionForm.nextOfKin.trim(),
          region: admissionForm.region,
          religion: admissionForm.religion,
          doctorOrders: admissionForm.doctorOrders.trim(),
          nurseName: 'Nurse On-Duty'
        })
      });

      if (data.success) {
        // Confirmation dialogue:
        // "Once you click on complete admission, it will say patient has been admitted to private room bed 847 or whatever information that was filled in on the form."
        setConfirmationDialog({
          isOpen: true,
          title: 'Admission Completed Successfully',
          message: data.message || `Patient ${selectedForAdmission.name} has been admitted to ${admissionForm.ward} ${admissionForm.bedNumber.trim().toLowerCase().startsWith('bed') ? admissionForm.bedNumber.trim() : `Bed ${admissionForm.bedNumber.trim()}`}.`,
          type: 'admitted'
        });

        setSelectedForAdmission(null);
        fetchDetainedData();
      } else {
        alert(data.error || 'Failed to complete patient admission');
      }
    } catch (err: any) {
      console.error('Error admitting patient:', err);
      alert(err?.message || 'Network error while completing admission');
    } finally {
      setIsSubmittingAdmission(false);
    }
  };

  return {
    pendingPatients,
    detainedPatients,
    totalDetainedCount,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedForDetention,
    setSelectedForDetention,
    detentionReason,
    setDetentionReason,
    clinicalCardObservation,
    setClinicalCardObservation,
    isSubmittingDetention,
    selectedForAdmission,
    setSelectedForAdmission,
    admissionForm,
    setAdmissionForm,
    isSubmittingAdmission,
    confirmationDialog,
    setConfirmationDialog,
    fetchDetainedData,
    handleOpenDetainModal,
    handleConfirmDetain,
    handleReleasePatient,
    handleOpenAdmitModal,
    handleConfirmAdmission
  };
}
