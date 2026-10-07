/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx (walk-in lane).
 *
 * Owns walk-in queues (GET /payments/lab/walk-in: pendingPayment +
 * paidReadyForTesting), the walk-in registration form (POST
 * /payments/lab/walk-in), the "sent to cashier" handover (POST
 * /payments/lab/mark-sent-to-cashier), and paid walk-in results
 * finalization (POST /patients/opd/queue/lab-complete). Success/error
 * messaging and the global action modal arrive via shell-provided
 * callbacks so this hook stays decoupled (same pattern as eye hooks).
 * apiFetch paths, payloads, and validation order preserved verbatim.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { apiFetch } from '../../../utils/api';
import type { LabModalApi, LabNotify, WalkInCatalogTest, WalkInSelectedTest } from '../_utils/lab-types';

export interface UseLabWalkInArgs {
  notify: LabNotify;
  modal: LabModalApi;
}

export interface UseLabWalkInResult {
  walkInPendingPayment: any[];
  walkInPaidReady: any[];
  isLoadingWalkIn: boolean;
  selectedPaidWalkIn: any | null;
  setSelectedPaidWalkIn: (patient: any | null) => void;
  walkInResultsInput: string;
  setWalkInResultsInput: (value: string) => void;
  isSubmittingWalkInResults: boolean;
  patientName: string;
  setPatientName: (value: string) => void;
  dob: string;
  setDob: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  maritalStatus: string;
  setMaritalStatus: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  referringDoctor: string;
  setReferringDoctor: (value: string) => void;
  selectedTests: WalkInSelectedTest[];
  isRegisteringWalkIn: boolean;
  totalWalkInPrice: number;
  fetchWalkInQueue: () => Promise<void>;
  handleMarkSentToCashier: (encounterId: string, pName: string) => Promise<void>;
  handleToggleTest: (test: WalkInCatalogTest, category: string) => void;
  handleRegisterWalkIn: (e: FormEvent) => Promise<void>;
  handleProcessPaidWalkIn: (e: FormEvent) => Promise<void>;
}

export function useLabWalkIn({ notify, modal }: UseLabWalkInArgs): UseLabWalkInResult {
  const { setError, setSuccess } = notify;
  const { setActionModal } = modal;

  // Walk-In state
  const [walkInPendingPayment, setWalkInPendingPayment] = useState<any[]>([]);
  const [walkInPaidReady, setWalkInPaidReady] = useState<any[]>([]);
  const [isLoadingWalkIn, setIsLoadingWalkIn] = useState(false);
  const [selectedPaidWalkIn, setSelectedPaidWalkIn] = useState<any | null>(null);
  const [walkInResultsInput, setWalkInResultsInput] = useState('');
  const [isSubmittingWalkInResults, setIsSubmittingWalkInResults] = useState(false);

  // Walk-In Registration Form state
  const [patientName, setPatientName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [referringDoctor, setReferringDoctor] = useState('');
  const [selectedTests, setSelectedTests] = useState<{ id: string; name: string; price: number; category: string }[]>([]);
  const [isRegisteringWalkIn, setIsRegisteringWalkIn] = useState(false);

  // Mark walk-in patient as sent to cashier
  const handleMarkSentToCashier = async (encounterId: string, pName: string) => {
    try {
      const res = await apiFetch('/payments/lab/mark-sent-to-cashier', {
        method: 'POST',
        body: JSON.stringify({ encounterId })
      });
      if (res.success) {
        setSuccess(`Walk-in patient ${pName} marked as "Sent to Cashier"! Awaiting payment confirmation.`);
        fetchWalkInQueue();
      } else {
        setError(res.error || 'Failed to mark as sent to cashier.');
      }
    } catch (err: any) {
      setError(err.message || 'Error marking as sent to cashier.');
    }
  };

  // Fetch Walk-In Queue (Pending Payment & Paid - Ready for Testing)
  const fetchWalkInQueue = async () => {
    setIsLoadingWalkIn(true);
    try {
      const res = await apiFetch('/payments/lab/walk-in');
      if (res.success && res.data) {
        setWalkInPendingPayment(res.data.pendingPayment || []);
        setWalkInPaidReady(res.data.paidReadyForTesting || []);
      } else {
        setWalkInPendingPayment([]);
        setWalkInPaidReady([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch walk-in queue:', err);
      setWalkInPendingPayment([]);
      setWalkInPaidReady([]);
    } finally {
      setIsLoadingWalkIn(false);
    }
  };

  // Toggle test selection in Walk-In Form
  const handleToggleTest = (test: { id: string; name: string; price: number }, category: string) => {
    setSelectedTests(prev => {
      const exists = prev.some(t => t.id === test.id);
      if (exists) {
        return prev.filter(t => t.id !== test.id);
      } else {
        return [...prev, { ...test, category }];
      }
    });
  };

  // Calculate total price of walk-in selected tests
  const totalWalkInPrice = selectedTests.reduce((sum, t) => sum + t.price, 0);

  // Register Walk-In Patient
  const handleRegisterWalkIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Please enter Patient Name.');
      return;
    }
    if (!dob.trim()) {
      setError('Please enter Date of Birth.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please enter Phone Number.');
      return;
    }
    if (selectedTests.length === 0) {
      setError('Please select at least 1 laboratory test.');
      return;
    }

    setIsRegisteringWalkIn(true);
    setError('');
    setSuccess('');

    try {
      const res = await apiFetch('/payments/lab/walk-in', {
        method: 'POST',
        body: JSON.stringify({
          patientName,
          dob,
          gender,
          maritalStatus,
          phoneNumber,
          address,
          referringDoctor,
          tests: selectedTests,
          totalAmount: totalWalkInPrice,
          paymentMethod: 'Cash'
        })
      });

      if (res.success) {
        const registeredName = patientName;
        const totalFee = totalWalkInPrice;
        const testCount = selectedTests.length;

        setSuccess(`Walk-in patient ${patientName} registered! Info sent to Cashier for payment processing (₦${totalWalkInPrice.toLocaleString()}).`);

        // Reset form
        setPatientName('');
        setDob('');
        setGender('Male');
        setMaritalStatus('Single');
        setPhoneNumber('');
        setAddress('');
        setReferringDoctor('');
        setSelectedTests([]);
        setError('');

        // Refresh lists
        fetchWalkInQueue();

        setActionModal({
          isOpen: true,
          title: 'Walk-In Patient Registered Successfully',
          message: `Walk-in patient ${registeredName} registered for ${testCount} lab test(s). Order details sent directly to Cashier Desk for payment verification.`,
          patientName: registeredName,
          hospitalNumber: 'Walk-In Patient',
          badgeText: 'Awaiting Cashier Payment Verification',
          details: [
            { label: 'Total Payable Fee', value: `₦${totalFee.toLocaleString()}` },
            { label: 'Selected Tests', value: `${testCount} Investigation(s)` },
            { label: 'Routing Department', value: 'Cashier Department (Awaiting Cash Payment)' }
          ]
        });
      } else {
        setError(res.error || 'Failed to register walk-in patient.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register walk-in patient on database.');
    } finally {
      setIsRegisteringWalkIn(false);
    }
  };

  // Submit results for Paid Walk-In Patient
  const handleProcessPaidWalkIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPaidWalkIn) return;
    if (!walkInResultsInput.trim()) {
      setError('Please enter test results.');
      return;
    }

    setIsSubmittingWalkInResults(true);
    setError('');
    setSuccess('');

    try {
      const res = await apiFetch('/patients/opd/queue/lab-complete', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedPaidWalkIn.patientId,
          encounterId: selectedPaidWalkIn.encounterId,
          testResults: [{ name: selectedPaidWalkIn.testsSummary || 'Walk-In Lab Test', result: walkInResultsInput, findings: 'Completed' }]
        })
      });

      if (res.success) {
        const pName = selectedPaidWalkIn.patientName;

        setSuccess(`Laboratory results for walk-in patient ${pName} processed and finalized!`);
        fetchWalkInQueue();
        setSelectedPaidWalkIn(null);
        setWalkInResultsInput('');

        setActionModal({
          isOpen: true,
          title: 'Walk-In Laboratory Results Published',
          message: `Laboratory test results for walk-in patient ${pName} have been finalized and printed/archived.`,
          patientName: pName,
          hospitalNumber: 'Walk-In Patient',
          badgeText: 'Investigation Completed & Finalized',
          details: [
            { label: 'Status', value: 'Completed & Printed' },
            { label: 'Investigation Summary', value: selectedPaidWalkIn.testsSummary || 'Lab Tests' }
          ]
        });
      } else {
        setError(res.error || 'Failed to process laboratory results.');
      }
    } catch (err: any) {
      setError('Failed to process laboratory results. Please check database connection.');
    } finally {
      setIsSubmittingWalkInResults(false);
    }
  };

  return {
    walkInPendingPayment,
    walkInPaidReady,
    isLoadingWalkIn,
    selectedPaidWalkIn,
    setSelectedPaidWalkIn,
    walkInResultsInput,
    setWalkInResultsInput,
    isSubmittingWalkInResults,
    patientName,
    setPatientName,
    dob,
    setDob,
    gender,
    setGender,
    maritalStatus,
    setMaritalStatus,
    phoneNumber,
    setPhoneNumber,
    address,
    setAddress,
    referringDoctor,
    setReferringDoctor,
    selectedTests,
    isRegisteringWalkIn,
    totalWalkInPrice,
    fetchWalkInQueue,
    handleMarkSentToCashier,
    handleToggleTest,
    handleRegisterWalkIn,
    handleProcessPaidWalkIn,
  };
}
