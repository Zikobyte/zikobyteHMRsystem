/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx (regular queue + results entry).
 *
 * Owns the doctor-referred lab queue (GET /patients/opd/queue filtered to
 * Laboratory Waiting/Processing), patient selection with ordered-tests
 * lookup (GET /patients/opd/queue/lab-orders), and results submission
 * (POST /patients/opd/queue/lab-complete). Success/error messaging and the
 * global action modal arrive via shell-provided callbacks so this hook
 * stays decoupled (same pattern as eye hooks). apiFetch paths, payloads,
 * and auto-select behavior preserved verbatim.
 *
 * NOTE: fetchRegularQueue reads the current selection through a ref mirror
 * so the shell's 4s-poll/socket effect (mounted once, same as the original
 * mount effect) auto-selects only when nothing is selected — identical to
 * the original render-scope closure.
 */

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { apiFetch } from '../../../utils/api';
import type { LabModalApi, LabNotify } from '../_utils/lab-types';

export interface UseLabRegularArgs {
  notify: LabNotify;
  modal: LabModalApi;
}

export interface UseLabRegularResult {
  regularQueue: any[];
  selectedRegularPatient: any | null;
  isLoadingRegular: boolean;
  isSubmittingRegular: boolean;
  regularResultsInput: string;
  setRegularResultsInput: (value: string) => void;
  orderedLabTests: any[];
  doctorNotes: string;
  totalRegularCost: number;
  groupedOrderedByCategory: Record<string, any[]>;
  fetchRegularQueue: () => Promise<void>;
  handleSelectRegularPatient: (patient: any) => Promise<void>;
  handleSubmitResultsToDoctor: (e: FormEvent) => Promise<void>;
}

export function useLabRegular({ notify, modal }: UseLabRegularArgs): UseLabRegularResult {
  const { setError, setSuccess } = notify;
  const { setActionModal } = modal;

  // Regular Queue state
  const [regularQueue, setRegularQueue] = useState<any[]>([]);
  const [selectedRegularPatient, setSelectedRegularPatient] = useState<any | null>(null);
  const [isLoadingRegular, setIsLoadingRegular] = useState(false);
  const [isSubmittingRegular, setIsSubmittingRegular] = useState(false);
  const [regularResultsInput, setRegularResultsInput] = useState('');
  const [orderedLabTests, setOrderedLabTests] = useState<any[]>([]);
  const [doctorNotes, setDoctorNotes] = useState('');

  // Ref mirror of the selection for the shell-mounted poll/socket effect.
  const selectedRef = useRef<any | null>(null);
  selectedRef.current = selectedRegularPatient;

  // Fetch Regular Lab Queue (patients sent from Doctor)
  const fetchRegularQueue = async () => {
    setIsLoadingRegular(true);
    try {
      const res = await apiFetch('/patients/opd/queue');
      if (res.success) {
        const labItems = (res.data || []).filter((q: any) => q.queue_type === 'Laboratory' && (q.status === 'Waiting' || q.status === 'Processing'));
        setRegularQueue(labItems);
        if (!selectedRef.current && labItems.length > 0) {
          handleSelectRegularPatient(labItems[0]);
        } else if (labItems.length === 0) {
          setSelectedRegularPatient(null);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch regular lab queue:', err);
      setRegularQueue([]);
      setSelectedRegularPatient(null);
    } finally {
      setIsLoadingRegular(false);
    }
  };

  // Select patient from Regular Lab Queue
  const handleSelectRegularPatient = async (patient: any) => {
    setSelectedRegularPatient(patient);
    setRegularResultsInput('');
    setError('');
    setSuccess('');

    setDoctorNotes(patient.doctor_notes || '');

    if (patient.ordered_tests && patient.ordered_tests.length > 0) {
      setOrderedLabTests(patient.ordered_tests);
    } else {
      try {
        const res = await apiFetch(`/patients/opd/queue/lab-orders?encounterId=${patient.encounter_id}`);
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((t: any) => {
            const storedPrice = Number(t.price);
            return {
              category: t.category || null,
              code: t.test_code || null,
              name: t.test_name,
              price: Number.isFinite(storedPrice) && storedPrice > 0 ? storedPrice : 0,
              needsPricing: !(Number.isFinite(storedPrice) && storedPrice > 0),
            };
          });
          setOrderedLabTests(mapped);
        } else {
          setOrderedLabTests([]);
        }
      } catch (e) {
        setOrderedLabTests([]);
      }
    }
  };

  // Submit results for Regular Lab Queue patient
  const handleSubmitResultsToDoctor = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRegularPatient) return;
    if (!regularResultsInput.trim()) {
      setError('Please enter detailed lab test results.');
      return;
    }

    setIsSubmittingRegular(true);
    setError('');
    setSuccess('');

    try {
      const testResults = orderedLabTests.length > 0
        ? orderedLabTests.map(t => ({ name: t.name, result: regularResultsInput, findings: 'Completed' }))
        : [{ name: 'Pathology Panel', result: regularResultsInput, findings: 'Completed' }];

      const res = await apiFetch('/patients/opd/queue/lab-complete', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedRegularPatient.patient_id || selectedRegularPatient.hospital_number,
          encounterId: selectedRegularPatient.encounter_id,
          testResults
        })
      });

      if (res.success) {
        const pName = selectedRegularPatient.patient_name || selectedRegularPatient.name;
        const hNum = selectedRegularPatient.hospital_number || '—';

        setSuccess(`Laboratory results for ${pName} submitted successfully! Patient routed back to Doctor Consultation department.`);

        fetchRegularQueue();
        setSelectedRegularPatient(null);
        setRegularResultsInput('');

        setActionModal({
          isOpen: true,
          title: 'Laboratory Results Published & Sent to Doctor',
          message: `Test results for ${pName} have been finalized and published. Patient file updated and routed to Clinical Doctor Consultation.`,
          patientName: pName,
          hospitalNumber: hNum,
          badgeText: 'Routed to Doctor Consultation Queue',
          details: [
            { label: 'Status', value: 'Completed & Published' },
            { label: 'Routing', value: 'Doctor / Clinical Department' }
          ]
        });
      } else {
        setError(res.error || 'Failed to submit laboratory results to doctor.');
      }
    } catch (err: any) {
      setError('Failed to submit laboratory results. Please check database connection.');
    } finally {
      setIsSubmittingRegular(false);
    }
  };

  // Calculate total costs for selected regular patient
  const totalRegularCost = orderedLabTests.reduce((sum, item) => sum + (item.price || 0), 0);

  // Group ordered tests by category
  const groupedOrderedByCategory = orderedLabTests.reduce((acc: any, item: any) => {
    const cat = item.category || 'General Laboratory';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return {
    regularQueue,
    selectedRegularPatient,
    isLoadingRegular,
    isSubmittingRegular,
    regularResultsInput,
    setRegularResultsInput,
    orderedLabTests,
    doctorNotes,
    totalRegularCost,
    groupedOrderedByCategory,
    fetchRegularQueue,
    handleSelectRegularPatient,
    handleSubmitResultsToDoctor,
  };
}
