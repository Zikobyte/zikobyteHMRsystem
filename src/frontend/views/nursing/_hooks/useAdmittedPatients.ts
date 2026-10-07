/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/AdmittedPatientsView.tsx.
 *
 * Data hook: owns the admitted census (GET /nursing/admissions with search +
 * ward filter), ward/bed selection, the selected-patient clinical file
 * (GET /nursing/admissions/:id with records date filter), the sub-link tab
 * state, the medication-administration / observation / vitals form states +
 * submit handlers (POST .../medications/administer, .../observations,
 * .../vitals), and the success-modal message. apiFetch paths, methods, and
 * selection semantics preserved verbatim. Tab JSX stays in the shell and in
 * _components/admitted/*.
 */

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { apiFetch } from '@/utils/api';

export interface AdmittedPatient {
  id: string;
  patient_id: string;
  hospital_number: string;
  name: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  category: string;
  department: string;
  edd?: string;
  gestational_age?: string;
  gravida_para?: string;
  status: string;
  ward: string;
  bed: string;
  admitted_date: string;
  doctor_notes?: string;
  total_charged: number;
  payments_made: number;
  outstanding_balance: number;
}

export interface PrescribedMedication {
  id: string;
  medication_name: string;
  quantity: string;
  frequency: string;
  ordered_by?: string;
  status?: string;
}

export interface AdministrationRecord {
  id: string;
  prescription_id?: string;
  medication_name: string;
  dose?: string;
  administered_by: string;
  notes?: string;
  administered_at: string;
}

export type ObservationType = 'General' | 'Wound' | 'Patient complaint' | 'Other';

export interface ObservationRecord {
  id: string;
  observation_type: 'General' | 'Wound' | 'Patient complaint' | 'Other' | string;
  details: string;
  recorded_by: string;
  recorded_at: string;
}

export interface VitalRecord {
  id: string;
  blood_pressure?: string;
  heart_rate?: string;
  temperature?: string;
  respiratory_rate?: string;
  spo2?: string;
  recorded_by: string;
  recorded_at: string;
  is_initial?: boolean;
}

export interface BillingItem {
  id: string;
  item: string;
  amount: number;
  type: 'Charge' | 'Payment';
  recorded_at: string;
}

export interface PatientDetailsResponse {
  patient: AdmittedPatient;
  prescriptions: PrescribedMedication[];
  administrationHistory: AdministrationRecord[];
  observations: ObservationRecord[];
  vitals: {
    initialVitals: VitalRecord | null;
    vitalHistory: VitalRecord[];
  };
  billing: {
    totalCharged: number;
    totalPaid: number;
    outstandingBalance: number;
    items: BillingItem[];
  };
}

export type AdmittedSubLink = 'medications' | 'observations' | 'vitals' | 'billing' | 'maternity-checklist';

export interface UseAdmittedPatientsResult {
  patients: AdmittedPatient[];
  totalAdmittedCount: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedWardFilter: string;
  setSelectedWardFilter: (value: string) => void;
  selectedPatientId: string;
  setSelectedPatientId: (value: string) => void;
  isLoadingPatients: boolean;
  activeSubLink: AdmittedSubLink;
  setActiveSubLink: (value: AdmittedSubLink) => void;
  recordsDateFilter: string;
  setRecordsDateFilter: (value: string) => void;
  patientDetails: PatientDetailsResponse | null;
  isLoadingDetails: boolean;
  selectedPrescription: PrescribedMedication | null;
  setSelectedPrescription: (value: PrescribedMedication | null) => void;
  adminNotes: string;
  setAdminNotes: (value: string) => void;
  isAdministering: boolean;
  observationType: ObservationType;
  setObservationType: (value: ObservationType) => void;
  observationDetails: string;
  setObservationDetails: (value: string) => void;
  isRecordingObservation: boolean;
  vitalBP: string;
  setVitalBP: (value: string) => void;
  vitalHR: string;
  setVitalHR: (value: string) => void;
  vitalTemp: string;
  setVitalTemp: (value: string) => void;
  vitalRR: string;
  setVitalRR: (value: string) => void;
  vitalSPO2: string;
  setVitalSPO2: (value: string) => void;
  isRecordingVitals: boolean;
  modalMessage: string | null;
  setModalMessage: (value: string | null) => void;
  selectedPatient: AdmittedPatient | undefined;
  fetchAdmissions: (keepSelection?: boolean) => Promise<void>;
  fetchPatientDetails: (patientId: string, dateFilter?: string) => Promise<void>;
  handleSelectPrescription: (med: PrescribedMedication) => void;
  handleConfirmAdministration: (e: FormEvent) => Promise<void>;
  handleRecordObservation: (e: FormEvent) => Promise<void>;
  handleRecordVitals: (e: FormEvent) => Promise<void>;
}

export function useAdmittedPatients(): UseAdmittedPatientsResult {
  // Left Container State
  const [patients, setPatients] = useState<AdmittedPatient[]>([]);
  const [totalAdmittedCount, setTotalAdmittedCount] = useState<number>(0);
  const [wardStats, setWardStats] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWardFilter, setSelectedWardFilter] = useState('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('MAT-4003');
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  // Right Container State
  const [activeSubLink, setActiveSubLink] = useState<AdmittedSubLink>('medications');
  const [recordsDateFilter, setRecordsDateFilter] = useState<string>('');
  const [patientDetails, setPatientDetails] = useState<PatientDetailsResponse | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Medications Administration Form State
  const [selectedPrescription, setSelectedPrescription] = useState<PrescribedMedication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isAdministering, setIsAdministering] = useState(false);

  // Observation Form State
  const [observationType, setObservationType] = useState<ObservationType>('General');
  const [observationDetails, setObservationDetails] = useState('');
  const [isRecordingObservation, setIsRecordingObservation] = useState(false);

  // Vitals Form State
  const [vitalBP, setVitalBP] = useState('');
  const [vitalHR, setVitalHR] = useState('');
  const [vitalTemp, setVitalTemp] = useState('');
  const [vitalRR, setVitalRR] = useState('');
  const [vitalSPO2, setVitalSPO2] = useState('');
  const [isRecordingVitals, setIsRecordingVitals] = useState(false);

  // Success Modal Dialog State
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  // 1. Fetch Admitted Patients List
  const fetchAdmissions = async (keepSelection = true) => {
    try {
      setIsLoadingPatients(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (selectedWardFilter !== 'all') queryParams.append('ward', selectedWardFilter);

      const res = await apiFetch(`/nursing/admissions?${queryParams.toString()}`);
      if (res && res.success) {
        setPatients(res.data || []);
        setTotalAdmittedCount(res.totalAdmitted || res.data?.length || 0);
        setWardStats(res.stats || {});

        // If no patient is selected or current selected patient not in list, select first
        if ((!selectedPatientId || !keepSelection) && res.data && res.data.length > 0) {
          setSelectedPatientId(res.data[0].id);
        } else if (res.data && res.data.length > 0 && !res.data.some((p: any) => p.id === selectedPatientId)) {
          // If MAT-4003 exists in data, prefer MAT-4003
          const defaultP = res.data.find((p: any) => p.id === 'MAT-4003') || res.data[0];
          setSelectedPatientId(defaultP.id);
        }
      }
    } catch (err) {
      console.error('Failed to load admitted patients:', err);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchAdmissions(true);
  }, [searchQuery, selectedWardFilter]);

  // 2. Fetch Selected Patient Full Details
  const fetchPatientDetails = async (patientId: string, dateFilter = recordsDateFilter) => {
    if (!patientId) return;
    try {
      setIsLoadingDetails(true);
      const queryParams = new URLSearchParams();
      if (dateFilter) queryParams.append('dateFilter', dateFilter);

      const res = await apiFetch(`/nursing/admissions/${patientId}?${queryParams.toString()}`);
      if (res && res.success) {
        setPatientDetails(res.data);
      }
    } catch (err) {
      console.error('Failed to load patient details:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (selectedPatientId) {
      fetchPatientDetails(selectedPatientId, recordsDateFilter);
      setSelectedPrescription(null);
      setAdminNotes('');

      const p = patients.find((x) => x.id === selectedPatientId);
      const isMat = p && ((p.ward || '').toLowerCase().includes('maternity') || (p.category || '').toLowerCase().includes('maternity'));
      if (!isMat && activeSubLink === 'maternity-checklist') {
        setActiveSubLink('medications');
      }
    }
  }, [selectedPatientId, recordsDateFilter, patients]);

  // Handle Medication Selection
  const handleSelectPrescription = (med: PrescribedMedication) => {
    setSelectedPrescription(med);
    // Scroll or focus to confirmation area smoothly
  };

  // Handle Confirm Medication Administration
  const handleConfirmAdministration = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPrescription || !selectedPatientId) return;

    try {
      setIsAdministering(true);
      const userRaw = localStorage.getItem('zmc_user');
      const currentUser = userRaw ? JSON.parse(userRaw) : null;
      const nurseName = currentUser?.name || currentUser?.username || 'Nurse Staff';

      const res = await apiFetch(`/nursing/admissions/${selectedPatientId}/medications/administer`, {
        method: 'POST',
        body: JSON.stringify({
          prescriptionId: selectedPrescription.id,
          medicationName: selectedPrescription.medication_name,
          dose: selectedPrescription.frequency,
          notes: adminNotes,
          administeredBy: nurseName
        })
      });

      if (res && res.success) {
        setModalMessage(`Medication ${selectedPrescription.medication_name} has been administered successfully.`);
        setSelectedPrescription(null);
        setAdminNotes('');
        // Refresh details
        await fetchPatientDetails(selectedPatientId);
      } else {
        alert(res?.error || 'Failed to record medication administration.');
      }
    } catch (err: any) {
      alert('Error administering medication: ' + err.message);
    } finally {
      setIsAdministering(false);
    }
  };

  // Handle Record Observation
  const handleRecordObservation = async (e: FormEvent) => {
    e.preventDefault();
    if (!observationDetails.trim() || !selectedPatientId) return;

    try {
      setIsRecordingObservation(true);
      const userRaw = localStorage.getItem('zmc_user');
      const currentUser = userRaw ? JSON.parse(userRaw) : null;
      const nurseName = currentUser?.name || currentUser?.username || 'Nurse Staff';

      const res = await apiFetch(`/nursing/admissions/${selectedPatientId}/observations`, {
        method: 'POST',
        body: JSON.stringify({
          observationType,
          details: observationDetails,
          recordedBy: nurseName
        })
      });

      if (res && res.success) {
        setModalMessage('Observation has been recorded successfully.');
        setObservationDetails('');
        setObservationType('General');
        // Refresh details
        await fetchPatientDetails(selectedPatientId);
      } else {
        alert(res?.error || 'Failed to record observation.');
      }
    } catch (err: any) {
      alert('Error recording observation: ' + err.message);
    } finally {
      setIsRecordingObservation(false);
    }
  };

  // Handle Record Vitals
  const handleRecordVitals = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    if (!vitalBP && !vitalHR && !vitalTemp && !vitalRR && !vitalSPO2) {
      alert('Please provide at least one vital sign value before submitting.');
      return;
    }

    try {
      setIsRecordingVitals(true);
      const userRaw = localStorage.getItem('zmc_user');
      const currentUser = userRaw ? JSON.parse(userRaw) : null;
      const nurseName = currentUser?.name || currentUser?.username || 'Nurse Staff';

      const res = await apiFetch(`/nursing/admissions/${selectedPatientId}/vitals`, {
        method: 'POST',
        body: JSON.stringify({
          bloodPressure: vitalBP,
          heartRate: vitalHR,
          temperature: vitalTemp,
          respiratoryRate: vitalRR,
          oxygenSaturation: vitalSPO2,
          recordedBy: nurseName
        })
      });

      if (res && res.success) {
        setModalMessage('Vitals recorded successfully.');
        setVitalBP('');
        setVitalHR('');
        setVitalTemp('');
        setVitalRR('');
        setVitalSPO2('');
        // Refresh details
        await fetchPatientDetails(selectedPatientId);
      } else {
        alert(res?.error || 'Failed to record vitals.');
      }
    } catch (err: any) {
      alert('Error recording vitals: ' + err.message);
    } finally {
      setIsRecordingVitals(false);
    }
  };

  const selectedPatient = patientDetails?.patient || patients.find(p => p.id === selectedPatientId);

  return {
    patients,
    totalAdmittedCount,
    searchQuery,
    setSearchQuery,
    selectedWardFilter,
    setSelectedWardFilter,
    selectedPatientId,
    setSelectedPatientId,
    isLoadingPatients,
    activeSubLink,
    setActiveSubLink,
    recordsDateFilter,
    setRecordsDateFilter,
    patientDetails,
    isLoadingDetails,
    selectedPrescription,
    setSelectedPrescription,
    adminNotes,
    setAdminNotes,
    isAdministering,
    observationType,
    setObservationType,
    observationDetails,
    setObservationDetails,
    isRecordingObservation,
    vitalBP,
    setVitalBP,
    vitalHR,
    setVitalHR,
    vitalTemp,
    setVitalTemp,
    vitalRR,
    setVitalRR,
    vitalSPO2,
    setVitalSPO2,
    isRecordingVitals,
    modalMessage,
    setModalMessage,
    selectedPatient,
    fetchAdmissions,
    fetchPatientDetails,
    handleSelectPrescription,
    handleConfirmAdministration,
    handleRecordObservation,
    handleRecordVitals,
  };
}

export default useAdmittedPatients;
