/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx.
 *
 * Outpatient consultation hook: start/exit consultation, notes save,
 * prescription rows, lab order + send-to-cashier, and
 * complete-consultation. All apiFetch paths, methods, and bodies are
 * preserved verbatim from the original component.
 */

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { apiFetch } from "../../../utils/api";
import { resolveLabTestPrice } from "@backend/catalogue/lab-catalogue";
import {
	CHEMISTRY_TESTS,
	HAEMATOLOGY_TESTS,
	MICROBIOLOGY_TESTS,
	PARASITOLOGY_TESTS,
	SEROLOGY_TESTS,
	getMedicationPrice,
} from "../_utils/doctor-catalog";
import type {
	AdmittedPatient,
	CurrentUserLike,
	DoctorNotify,
	DoctorOutpatient,
	PastConsultation,
	PatientLabResult,
	PrescriptionRow,
} from "../_utils/doctor-types";

export interface UseOutpatientConsultationParams {
	outpatients: DoctorOutpatient[];
	setOutpatients: Dispatch<SetStateAction<DoctorOutpatient[]>>;
	selectedOutpatientId: string | null;
	setSelectedOutpatientId: Dispatch<SetStateAction<string | null>>;
	setAdmittedPatients: Dispatch<SetStateAction<AdmittedPatient[]>>;
	currentUser: CurrentUserLike | null;
	notify: DoctorNotify;
	refreshQueue: () => void;
}

export interface UseOutpatientConsultationResult {
	selectedOutpatient: DoctorOutpatient | undefined;
	selectedPatientLabResults: PatientLabResult[];
	isLoadingLabResults: boolean;
	patientPastConsultations: PastConsultation[];
	isLoadingPastHistory: boolean;
	isStartingConsultation: boolean;
	isExitingConsultation: boolean;
	handleStartConsultation: (patient: DoctorOutpatient) => Promise<void>;
	handleExitConsultation: (patient: DoctorOutpatient) => Promise<void>;
	handleSendLabsToCashierDb: () => Promise<void>;
	handleSendMedsToCashierDb: () => Promise<void>;
	handleCompleteConsultationDb: (routeTo: 'lab' | 'pharmacy') => Promise<void>;
	handleCompleteConsultation: () => void;
	handleAdmitOutpatient: () => void;
	prescriptionRows: PrescriptionRow[];
	handleAddMedicationRow: () => void;
	handleRemoveMedicationRow: (id: string) => void;
	handleUpdateMedicationRow: (id: string, field: 'name' | 'dose' | 'frequency' | 'duration', value: string) => void;
	handleRemoveOutpatientPrescription: (prescId: string) => void;
	handleOrderOutpatientLabTest: (category: string, testName: string, testCode: string) => void;
	handleRemoveOutpatientLabTest: (testName: string) => void;
	handleOutpatientNotesChange: (id: string, text: string) => void;
	handleSaveOutpatientNotes: (patientId: string, encounterId?: string, notesText?: string) => Promise<void>;
	isCompleting: boolean;
	isSavingNote: boolean;
	isNoteSaved: boolean;
}

export function useOutpatientConsultation({
	outpatients,
	setOutpatients,
	selectedOutpatientId,
	setSelectedOutpatientId,
	setAdmittedPatients,
	currentUser,
	notify: showToast,
	refreshQueue: fetchDbQueue,
}: UseOutpatientConsultationParams): UseOutpatientConsultationResult {
  const [selectedPatientLabResults, setSelectedPatientLabResults] = useState<PatientLabResult[]>([]);
  const [isLoadingLabResults, setIsLoadingLabResults] = useState(false);
  const [patientPastConsultations, setPatientPastConsultations] = useState<PastConsultation[]>([]);
  const [isLoadingPastHistory, setIsLoadingPastHistory] = useState(false);
  const [isStartingConsultation, setIsStartingConsultation] = useState(false);
  const [isExitingConsultation, setIsExitingConsultation] = useState(false);

  // Active outpatient
  const selectedOutpatient = outpatients.find(p => p.id === selectedOutpatientId);

  // Outpatient prescription inputs as dynamic rows
  const [prescriptionRows, setPrescriptionRows] = useState<Array<{
    id: string;
    name: string;
    dose: string;
    frequency: string;
    duration: string;
  }>>([
    { id: 'initial-1', name: '', dose: '', frequency: '', duration: '' }
  ]);

  useEffect(() => {
    if (selectedOutpatientId) {
      const p = outpatients.find(pat => pat.id === selectedOutpatientId);
      if (p && p.prescribedMedications && p.prescribedMedications.length > 0) {
        setPrescriptionRows(p.prescribedMedications.map((m) => ({
          id: m.id || Math.random().toString(),
          name: m.name || '',
          dose: m.dose || '',
          frequency: m.frequency || '',
          duration: m.duration || ''
        })));
      } else {
        setPrescriptionRows([{ id: Math.random().toString(), name: '', dose: '', frequency: '', duration: '' }]);
      }
    } else {
      setPrescriptionRows([{ id: Math.random().toString(), name: '', dose: '', frequency: '', duration: '' }]);
    }
  }, [selectedOutpatientId]);

  const handleAddMedicationRow = () => {
    setPrescriptionRows(prev => [
      ...prev,
      { id: Math.random().toString(), name: '', dose: '', frequency: '', duration: '' }
    ]);
  };

  const handleRemoveMedicationRow = (id: string) => {
    setPrescriptionRows(prev => {
      const updated = prev.filter(row => row.id !== id);
      const final = updated.length > 0 ? updated : [{ id: Math.random().toString(), name: '', dose: '', frequency: '', duration: '' }];

      if (selectedOutpatientId) {
        const validMeds = final
          .filter(row => row.name.trim() !== '')
          .map(row => ({
            id: row.id,
            name: row.name,
            dose: row.dose || '',
            frequency: row.frequency || '',
            duration: row.duration || '',
            timestamp: new Date().toLocaleString()
          }));

        setOutpatients(old => old.map(p => {
          if (p.id === selectedOutpatientId) {
            return {
              ...p,
              prescribedMedications: validMeds
            };
          }
          return p;
        }));
      }

      return final;
    });
  };

  const handleUpdateMedicationRow = (id: string, field: 'name' | 'dose' | 'frequency' | 'duration', value: string) => {
    setPrescriptionRows(prev => {
      const updated = prev.map(row => row.id === id ? { ...row, [field]: value } : row);

      if (selectedOutpatientId) {
        const validMeds = updated
          .filter(row => row.name.trim() !== '')
          .map(row => ({
            id: row.id,
            name: row.name,
            dose: row.dose || '',
            frequency: row.frequency || '',
            duration: row.duration || '',
            timestamp: new Date().toLocaleString()
          }));

        setOutpatients(old => old.map(p => {
          if (p.id === selectedOutpatientId) {
            return {
              ...p,
              prescribedMedications: validMeds
            };
          }
          return p;
        }));
      }

      return updated;
    });
  };

  const [isCompleting, setIsCompleting] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  useEffect(() => {
    if (selectedOutpatient && selectedOutpatient.id) {
      const currentPatId = selectedOutpatient.id;
      setPatientPastConsultations([]);
      setSelectedPatientLabResults([]);
      setIsLoadingLabResults(true);
      setIsLoadingPastHistory(true);

      // Check if local storage or current state has notes for this patient
      const cachedLocalNote = localStorage.getItem(`zmc_doc_notes_${currentPatId}`);
      if (cachedLocalNote && (!selectedOutpatient.notes || selectedOutpatient.notes.trim() === '')) {
        setOutpatients(prev => prev.map(p => p.id === currentPatId && (!p.notes || p.notes.trim() === '') ? { ...p, notes: cachedLocalNote } : p));
      }

      // 1. Fetch patient previous history and doctor notes
      apiFetch(`/patients/${currentPatId}/history`)
        .then(res => {
          if (selectedOutpatientId !== currentPatId) return;
          if (res.success && res.data) {
            const pastConsults = res.data.consultations || [];
            setPatientPastConsultations(pastConsults);

            // If active outpatient notes is currently empty, initialize from latest consultation
            if (pastConsults.length > 0) {
              const latestConsult = pastConsults[0];
              const latestSavedNote = latestConsult.clinical_notes || latestConsult.treatment_plan || latestConsult.notes || '';
              if (latestSavedNote) {
                setOutpatients(prev => prev.map(p => {
                  if (p.id === currentPatId && (!p.notes || p.notes.trim() === '')) {
                    return { ...p, notes: latestSavedNote };
                  }
                  return p;
                }));
              }
            }

            // Also collect any completed lab results from history
            const orders = res.data.labOrders || [];
            const results = orders.filter((o: { findings?: string; result_details?: string; status?: string }) => o.findings || o.result_details || o.status === 'Completed');
            if (results.length > 0) {
              setSelectedPatientLabResults(results.map((r: { id?: string; test_name?: string; result_details?: string; findings?: string; date_completed?: string; date_ordered?: string; doctor_name?: string }) => ({
                id: r.id,
                test_name: r.test_name,
                result_details: r.result_details || 'Completed',
                findings: r.findings || 'Report issued',
                date_completed: r.date_completed || r.date_ordered,
                doctor_name: r.doctor_name
              })));
            } else {
              setSelectedPatientLabResults([]);
            }
          } else {
            setPatientPastConsultations([]);
            setSelectedPatientLabResults([]);
          }
        })
        .catch(err => {
          console.error("Error loading patient history:", err);
          if (selectedOutpatientId === currentPatId) {
            setPatientPastConsultations([]);
            setSelectedPatientLabResults([]);
          }
        })
        .finally(() => {
          if (selectedOutpatientId === currentPatId) {
            setIsLoadingPastHistory(false);
            setIsLoadingLabResults(false);
          }
        });
    } else {
      setPatientPastConsultations([]);
      setSelectedPatientLabResults([]);
    }
  }, [selectedOutpatientId]);

  const handleStartConsultation = async (patient: DoctorOutpatient) => {
    if (!patient || !patient.queueId) return;
    setIsStartingConsultation(true);
    const docName = currentUser?.name || currentUser?.username || 'Doctor';
    try {
      const res = await apiFetch(`/patients/opd/queue/${patient.queueId}/select`, {
        method: 'POST',
        body: JSON.stringify({ doctorName: docName })
      });
      if (res.success) {
        showToast(`Active consultation started with ${patient.name}.`, 'success');
        fetchDbQueue();
      } else {
        showToast(res.error || res.message || 'Failed to start consultation.', 'error');
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error starting consultation', 'error');
    } finally {
      setIsStartingConsultation(false);
    }
  };

  const handleExitConsultation = async (patient: DoctorOutpatient) => {
    if (!patient || !patient.queueId) return;
    setIsExitingConsultation(true);
    const docName = currentUser?.name || currentUser?.username || 'Doctor';
    try {
      // Auto-save any notes entered before pausing consultation
      if (patient.notes && patient.notes.trim() !== '') {
        await apiFetch('/patients/opd/consultations/save-notes', {
          method: 'POST',
          body: JSON.stringify({
            patientId: patient.id,
            encounterId: patient.encounterId,
            notes: patient.notes,
            doctorName: docName
          })
        }).catch(() => {});
      }

      const res = await apiFetch(`/patients/opd/queue/${patient.queueId}/exit`, {
        method: 'POST',
        body: JSON.stringify({ doctorName: docName })
      });
      if (res.success) {
        showToast(`Consultation for ${patient.name} paused and returned to queue.`, 'success');
        fetchDbQueue();
      } else {
        showToast(res.error || 'Failed to exit consultation', 'error');
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error exiting consultation', 'error');
    } finally {
      setIsExitingConsultation(false);
    }
  };

  const handleSendLabsToCashierDb = async () => {
    if (!selectedOutpatient) return;
    if (!selectedOutpatient.orderedTests || selectedOutpatient.orderedTests.length === 0) {
      showToast('Please select at least one laboratory test to send to Cashier.', 'error');
      return;
    }

    setIsCompleting(true);
    try {
      const response = await apiFetch('/patients/opd/queue/order-labs', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedOutpatient.id,
          encounterId: selectedOutpatient.encounterId,
          orderedTests: selectedOutpatient.orderedTests || [],
          doctorName: currentUser?.name || currentUser?.username || 'Doctor'
        })
      });

      if (response.success) {
        showToast(`Laboratory tests successfully sent to Cashier for payment verification. Consultation remains active.`, 'success');
        // Refresh queue status without clearing selected patient
        fetchDbQueue();
      } else {
        showToast(response.error || 'Failed to route laboratory orders', 'error');
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error routing lab orders to cashier', 'error');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSendMedsToCashierDb = async () => {
    if (!selectedOutpatient) return;
    const validMeds = prescriptionRows
      .filter(row => row.name && row.name.trim() !== '')
      .map(row => ({
        name: row.name.trim(),
        dose: row.dose?.trim() || 'Standard Dose',
        frequency: row.frequency?.trim() || 'Daily',
        duration: row.duration?.trim() || '5 days',
        price: getMedicationPrice(row.name.trim())
      }));

    if (validMeds.length === 0) {
      showToast('Please specify at least one medication drug name to send to Cashier.', 'error');
      return;
    }

    setIsCompleting(true);
    try {
      const response = await apiFetch('/patients/opd/queue/order-medications', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedOutpatient.id,
          encounterId: selectedOutpatient.encounterId,
          prescribedMedications: validMeds,
          doctorName: currentUser?.name || currentUser?.username || 'Doctor'
        })
      });

      if (response.success) {
        showToast(`Prescriptions (₦${(response.totalAmount || 0).toLocaleString()}) successfully sent to Cashier for payment. Consultation remains active.`, 'success');
        fetchDbQueue();
      } else {
        showToast(response.error || 'Failed to route medication orders', 'error');
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error routing medication orders to cashier', 'error');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCompleteConsultationDb = async (routeTo: 'lab' | 'pharmacy') => {
    if (!selectedOutpatient) return;

    setIsCompleting(true);
    try {
      // Map prescriptionRows to prescribedMedications format
      const validMeds = prescriptionRows
        .filter(row => row.name.trim() !== '')
        .map(row => ({
          name: row.name,
          dose: row.dose,
          frequency: row.frequency,
          duration: row.duration
        }));

      const response = await apiFetch('/patients/opd/queue/consultation-complete', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedOutpatient.id,
          encounterId: selectedOutpatient.encounterId,
          notes: selectedOutpatient.notes || 'Routine consultation',
          orderedTests: selectedOutpatient.orderedTests || [],
          prescribedMedications: validMeds,
          routeTo: routeTo
        })
      });

      if (response.success) {
        showToast(`Consultation completed for ${selectedOutpatient.name}. Routed to Cashier for ${routeTo === 'lab' ? 'Laboratory' : 'Pharmacy'} Payment.`, 'success');

        // Remove from list
        setOutpatients(prev => prev.filter(p => p.id !== selectedOutpatientId));
        setSelectedOutpatientId(null);

        // Refresh
        fetchDbQueue();
      } else {
        showToast(response.error || 'Failed to complete consultation', 'error');
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error completing consultation', 'error');
    } finally {
      setIsCompleting(false);
    }
  };

  // Handle outpatient notes update
  const handleOutpatientNotesChange = (id: string, text: string) => {
    localStorage.setItem(`zmc_doc_notes_${id}`, text);
    setOutpatients(prev => prev.map(p => p.id === id ? { ...p, notes: text } : p));
  };

  const handleSaveOutpatientNotes = async (patientId: string, encounterId?: string, notesText?: string) => {
    if (!patientId) return;
    const pat = outpatients.find(p => p.id === patientId);
    const currentNotes = notesText !== undefined ? notesText : (pat?.notes || '');
    const encId = encounterId || pat?.encounterId;
    setIsSavingNote(true);
    try {
      localStorage.setItem(`zmc_doc_notes_${patientId}`, currentNotes);
      const res = await apiFetch('/patients/opd/consultations/save-notes', {
        method: 'POST',
        body: JSON.stringify({
          patientId,
          encounterId: encId,
          notes: currentNotes,
          doctorName: currentUser?.name || currentUser?.username || 'Doctor'
        })
      });
      if (res.success) {
        setIsNoteSaved(true);
        showToast('Doctor consultation notes saved successfully.');
        setTimeout(() => setIsNoteSaved(false), 3000);
      } else {
        showToast(res.error || 'Failed to save notes', 'error');
      }
    } catch (err: unknown) {
      console.error('Error saving doctor notes:', err);
      showToast(err instanceof Error ? err.message : 'Error saving notes', 'error');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleRemoveOutpatientPrescription = (prescId: string) => {
    setOutpatients(prev => prev.map(p => {
      if (p.id === selectedOutpatientId) {
        return {
          ...p,
          prescribedMedications: (p.prescribedMedications || []).filter((pr) => pr.id !== prescId)
        };
      }
      return p;
    }));
    setPrescriptionRows(prev => {
      const updated = prev.filter(row => row.id !== prescId);
      return updated.length > 0 ? updated : [{ id: Math.random().toString(), name: '', dose: '', frequency: '', duration: '' }];
    });
  };

  // Order Lab Test for Outpatient — resolves catalogue price so chips/total render correctly
  const handleOrderOutpatientLabTest = (category: string, testName: string, testCode: string) => {
    if (!selectedOutpatientId || !testName) return;

    // Check if test is already ordered
    const currentOrders = selectedOutpatient?.orderedTests || [];
    if (currentOrders.some((t) => t.name === testName || (testCode && t.code === testCode))) {
      showToast('This lab test is already ordered', 'error');
      return;
    }

    let price = 0;
    try {
      const byCode = testCode && typeof resolveLabTestPrice === 'function'
        ? resolveLabTestPrice({ code: testCode })
        : null;
      const byName = !byCode && testName && typeof resolveLabTestPrice === 'function'
        ? resolveLabTestPrice({ name: testName })
        : null;
      const resolved = byCode ?? byName;
      if (resolved && typeof resolved.price === 'number') {
        price = resolved.price;
      } else {
        const localCatalogue = [
          ...CHEMISTRY_TESTS,
          ...SEROLOGY_TESTS,
          ...HAEMATOLOGY_TESTS,
          ...MICROBIOLOGY_TESTS,
          ...PARASITOLOGY_TESTS,
        ];
        const localMatch =
          localCatalogue.find((t) => t.name === testName) ??
          (testCode ? localCatalogue.find((t) => t.code === testCode) : undefined);
        if (localMatch && typeof localMatch.price === 'number') {
          price = localMatch.price;
        } else {
          console.warn(`[DoctorView] Lab price not found for code="${testCode}" name="${testName}" — defaulting to 0`);
          price = 0;
        }
      }
    } catch {
      console.warn(`[DoctorView] Lab catalogue unavailable for code="${testCode}" name="${testName}" — defaulting to 0`);
      price = 0;
    }

    const newTest = {
      category,
      code: testCode,
      name: testName,
      price,
      timestamp: new Date().toLocaleString()
    };

    setOutpatients(prev => prev.map(p => {
      if (p.id === selectedOutpatientId) {
        return {
          ...p,
          orderedTests: [...(p.orderedTests || []), newTest]
        };
      }
      return p;
    }));

    showToast(`Ordered lab test: ${testName}`);
  };

  const handleRemoveOutpatientLabTest = (testName: string) => {
    setOutpatients(prev => prev.map(p => {
      if (p.id === selectedOutpatientId) {
        return {
          ...p,
          orderedTests: (p.orderedTests || []).filter((t) => t.name !== testName)
        };
      }
      return p;
    }));
  };

  // Admit Outpatient to ward
  const handleAdmitOutpatient = () => {
    if (!selectedOutpatient) return;

    // Create new admitted patient record
    const newAdmission: AdmittedPatient = {
      id: `ADM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: selectedOutpatient.name,
      hospitalNumber: selectedOutpatient.id,
      gender: selectedOutpatient.gender,
      dateOfBirth: selectedOutpatient.dateOfBirth,
      ward: selectedOutpatient.department === 'Maternity Clinic' ? 'Maternity Ward' : 'General Ward',
      bed: selectedOutpatient.department === 'Maternity Clinic' ? 'M-TBD' : 'G-TBD',
      admittedDate: new Date().toLocaleString(),
      dischargeBill: 15000,
      totalCharged: 15000,
      paymentsMade: 0,
      since: new Date().toLocaleDateString('en-GB'),
      department: selectedOutpatient.department === 'Maternity Clinic' ? 'Maternity' : 'General Medicine',
      religion: '—',
      edd: selectedOutpatient.department === 'Maternity Clinic' ? '2026-06-17' : '—',
      gravidaPara: selectedOutpatient.department === 'Maternity Clinic' ? 'G1 P0' : '—',
      notes: selectedOutpatient.notes || 'Admitted from Outpatient Clinic.',
      vitalsRecords: [
        {
          timestamp: new Date().toLocaleString(),
          recordedBy: `Dr. ${selectedOutpatient.attendingDoctor}`,
          bp: selectedOutpatient.vitals?.bloodPressure || '—',
          hr: selectedOutpatient.vitals?.pulseRate?.toString() || '—',
          temp: selectedOutpatient.vitals?.temperature?.toString() + '°F' || '—',
          rr: '18',
          spo2: '98%'
        }
      ],
      medicationsRecords: [],
      observationsRecords: [],
      chargesList: [],
      newOrdersList: []
    };

    // Add to admitted list
    setAdmittedPatients(prev => [newAdmission, ...prev]);

    // Remove or update status of outpatient
    setOutpatients(prev => prev.filter(p => p.id !== selectedOutpatientId));

    // De-select
    setSelectedOutpatientId(null);

    // Socket alert logic simulation
    try {
      const event = new CustomEvent('zmc-notification', {
        detail: {
          type: 'PATIENT_UPDATED',
          message: `${selectedOutpatient.name} has been admitted. OPD Overview & Nursing notified.`
        }
      });
      window.dispatchEvent(event);
    } catch(e) {}

    showToast(`Admitted ${selectedOutpatient.name} successfully. OPD Overview and Nursing have been notified.`);
  };

  // Complete Consultation
  const handleCompleteConsultation = () => {
    if (!selectedOutpatient) return;
    showToast(`Consultation for ${selectedOutpatient.name} completed successfully. HMS updated.`);
    setOutpatients(prev => prev.filter(p => p.id !== selectedOutpatientId));
    setSelectedOutpatientId(null);
  };

  return {
    selectedOutpatient,
    selectedPatientLabResults,
    isLoadingLabResults,
    patientPastConsultations,
    isLoadingPastHistory,
    isStartingConsultation,
    isExitingConsultation,
    handleStartConsultation,
    handleExitConsultation,
    handleSendLabsToCashierDb,
    handleSendMedsToCashierDb,
    handleCompleteConsultationDb,
    handleCompleteConsultation,
    handleAdmitOutpatient,
    prescriptionRows,
    handleAddMedicationRow,
    handleRemoveMedicationRow,
    handleUpdateMedicationRow,
    handleRemoveOutpatientPrescription,
    handleOrderOutpatientLabTest,
    handleRemoveOutpatientLabTest,
    handleOutpatientNotesChange,
    handleSaveOutpatientNotes,
    isCompleting,
    isSavingNote,
    isNoteSaved,
  };
}
