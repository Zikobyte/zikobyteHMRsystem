/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx.
 *
 * Dispensing hook: owns the outpatient prescription queue (localStorage
 * `zmc_pharmacy_queue` cache with seed rows), the queue selection +
 * search, the dispense success/error messaging (shared with the admitted
 * tab via the notify setters), the API queue sync (GET
 * /patients/opd/queue filtered to Waiting Pharmacy rows, 6s poll), the
 * derived pending/filtered/selected values, and the dispense / simulate-
 * payment / HMS-download handlers. Stock deduction on dispense runs
 * through the stock hook's setStockLogs so the mapping stays verbatim.
 * Dispensing JSX lives in _tabs/DispensingTab.
 */

import { useEffect, useState } from 'react';
import type * as React from 'react';
import { apiFetch } from '@/utils/api';
import type { PatientQueueItem, StockItem } from '../_utils/pharmacy-procurement';

export interface UsePharmacyDispensingOptions {
  canActElsewhere: boolean;
  roleGuardMessage: string;
  setStockLogs: React.Dispatch<React.SetStateAction<StockItem[]>>;
}

export interface UsePharmacyDispensingResult {
  patientQueue: PatientQueueItem[];
  setPatientQueue: React.Dispatch<React.SetStateAction<PatientQueueItem[]>>;
  selectedPatientId: string;
  setSelectedPatientId: (value: string) => void;
  dispensingSearch: string;
  setDispensingSearch: (value: string) => void;
  dispenseSuccess: string;
  setDispenseSuccess: (value: string) => void;
  dispenseError: string;
  setDispenseError: (value: string) => void;
  pendingQueue: PatientQueueItem[];
  filteredQueue: PatientQueueItem[];
  selectedPatient: PatientQueueItem | undefined;
  handleDispenseMeds: (patientId: string) => void;
  handleSimulatePayment: (patientId: string) => void;
  handleDownloadHMS: (patient: PatientQueueItem) => void;
}

export function usePharmacyDispensing({ canActElsewhere, roleGuardMessage, setStockLogs }: UsePharmacyDispensingOptions): UsePharmacyDispensingResult {
  // State: Dispensing
  const [patientQueue, setPatientQueue] = useState<PatientQueueItem[]>(() => {
    const saved = localStorage.getItem('zmc_pharmacy_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: 'DISP-101',
        patientId: 'PAT-2011',
        patientName: 'Chinwe Onwuka',
        hospitalNumber: 'PAT-2011',
        phoneNumber: '08091234567',
        prescribedMeds: [
          { name: 'OMEPRAZOLE 20mg', quantity: 28, price: 4200 },
          { name: 'ANTACID SUSPENSION', quantity: 1, price: 1250 }
        ],
        totalBill: 5450,
        paymentStatus: 'PAID',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'DISP-102',
        patientId: 'PAT-2012',
        patientName: 'Emeka Adeleke',
        hospitalNumber: 'PAT-2012',
        phoneNumber: '08031122334',
        prescribedMeds: [
          { name: 'CEFTRIAXONE 1g Injection', quantity: 2, price: 6000 },
          { name: 'PARACETAMOL 500mg', quantity: 20, price: 1000 }
        ],
        totalBill: 7000,
        paymentStatus: 'PAID',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'DISP-103',
        patientId: 'PAT-2015',
        patientName: 'Amina Bello',
        hospitalNumber: 'PAT-2015',
        phoneNumber: '07055443322',
        prescribedMeds: [
          { name: 'CIPROFLOXACIN 500mg', quantity: 14, price: 3800 }
        ],
        totalBill: 3800,
        paymentStatus: 'UNPAID',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      }
    ];
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string>('DISP-101');
  const [dispensingSearch, setDispensingSearch] = useState('');
  const [dispenseSuccess, setDispenseSuccess] = useState('');
  const [dispenseError, setDispenseError] = useState('');

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('zmc_pharmacy_queue', JSON.stringify(patientQueue));
  }, [patientQueue]);

  // Sync API queue if available
  useEffect(() => {
    const fetchApiQueue = async () => {
      try {
        const res = await apiFetch('/patients/opd/queue');
        if (res.success && Array.isArray(res.data)) {
          const pharmItems = res.data.filter((q: any) => q.queue_type === 'Pharmacy' && q.status === 'Waiting');
          if (pharmItems.length > 0) {
            setPatientQueue(prev => {
              const existingIds = new Set(prev.map(p => p.id));
              const newItems: PatientQueueItem[] = pharmItems
                .filter((q: any) => !existingIds.has(q.id))
                .map((q: any) => ({
                  id: q.id || `DISP-${Math.floor(100 + Math.random() * 900)}`,
                  patientId: q.patient_id || 'PAT-000',
                  patientName: q.patient_name || 'Patient',
                  hospitalNumber: q.hospital_number || 'PAT-000',
                  phoneNumber: q.phone_number || '08000000000',
                  prescribedMeds: [
                    { name: 'PARACETAMOL 500mg', quantity: 20, price: 1000 },
                    { name: 'AMOXICILLIN 500mg', quantity: 21, price: 2500 }
                  ],
                  totalBill: 3500,
                  paymentStatus: 'PAID',
                  status: 'Pending',
                  date: new Date().toISOString().split('T')[0]
                }));
              return [...prev, ...newItems];
            });
          }
        }
      } catch (err) {
        // Fallback to local state seamlessly
      }
    };

    fetchApiQueue();
    const interval = setInterval(fetchApiQueue, 6000);
    return () => clearInterval(interval);
  }, []);

  // Filtered Queues
  const pendingQueue = patientQueue.filter(p => p.status === 'Pending');
  const filteredQueue = pendingQueue.filter(p => {
    const q = dispensingSearch.toLowerCase();
    return p.patientName.toLowerCase().includes(q) ||
           p.hospitalNumber.toLowerCase().includes(q) ||
           p.phoneNumber.includes(q);
  });

  const selectedPatient = patientQueue.find(p => p.id === selectedPatientId) || filteredQueue[0] || pendingQueue[0];

  // Handler: Dispense Medications
  const handleDispenseMeds = (patientId: string) => {
    if (!canActElsewhere) {
      setDispenseError(roleGuardMessage);
      return;
    }
    const patient = patientQueue.find(p => p.id === patientId);
    if (!patient) return;

    if (patient.paymentStatus !== 'PAID') {
      setDispenseError(`Payment status is ${patient.paymentStatus}. Only paid prescriptions can be dispensed.`);
      return;
    }

    setDispenseError('');
    setDispenseSuccess(`Medications successfully dispensed to ${patient.patientName}! HMS status updated.`);

    // Deduct stock levels for prescribed meds
    setStockLogs(prev => prev.map(stock => {
      const matchedMed = patient.prescribedMeds.find(m => m.name.toLowerCase().includes(stock.drugName.toLowerCase()));
      if (matchedMed) {
        return {
          ...stock,
          quantity: Math.max(0, stock.quantity - matchedMed.quantity)
        };
      }
      return stock;
    }));

    // Update patient status to Dispensed
    setPatientQueue(prev => prev.map(p => p.id === patientId ? { ...p, status: 'Dispensed' } : p));

    setTimeout(() => setDispenseSuccess(''), 5000);
  };

  // Handler: Simulate Payment for testing
  const handleSimulatePayment = (patientId: string) => {
    if (!canActElsewhere) {
      setDispenseError(roleGuardMessage);
      return;
    }
    setPatientQueue(prev => prev.map(p => p.id === patientId ? { ...p, paymentStatus: 'PAID' } : p));
    setDispenseSuccess(`Payment clearance confirmed for patient! Prescriptions now unlocked.`);
    setTimeout(() => setDispenseSuccess(''), 4000);
  };

  // Handler: Download HMS Transcript
  const handleDownloadHMS = (patient: PatientQueueItem) => {
    const lines = [
      '==========================================================',
      '        ZIKORA MEDICAL CENTER - PHARMACY HMS RECORD       ',
      '==========================================================',
      `Date: ${new Date().toLocaleString()}`,
      `Patient Name: ${patient.patientName}`,
      `Hospital ID: ${patient.hospitalNumber}`,
      `Phone Number: ${patient.phoneNumber}`,
      `Payment Status: ${patient.paymentStatus}`,
      '----------------------------------------------------------',
      'PRESCRIBED MEDICATIONS:',
      'Medication Name                   Qty      Price (NGN)',
      '----------------------------------------------------------',
      ...patient.prescribedMeds.map(m =>
        `${m.name.padEnd(32)} ${m.quantity.toString().padEnd(8)} ₦${m.price.toLocaleString()}`
      ),
      '----------------------------------------------------------',
      `TOTAL BILL: ₦${patient.totalBill.toLocaleString()}`,
      `DISPENSING STATUS: ${patient.status === 'Dispensed' ? 'FULFILLED & DISPENSED' : 'CLEARED FOR DISPENSING'}`,
      '----------------------------------------------------------',
      'Dispensed By: Resident Clinical Pharmacist',
      'Zikora HMS Intranet Portal Verification Code: ZMC-HMS-' + Math.floor(100000 + Math.random() * 900000),
      '=========================================================='
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HMS_Prescription_${patient.patientName.replace(/\s+/g, '_')}_${patient.hospitalNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    patientQueue,
    setPatientQueue,
    selectedPatientId,
    setSelectedPatientId,
    dispensingSearch,
    setDispensingSearch,
    dispenseSuccess,
    setDispenseSuccess,
    dispenseError,
    setDispenseError,
    pendingQueue,
    filteredQueue,
    selectedPatient,
    handleDispenseMeds,
    handleSimulatePayment,
    handleDownloadHMS
  };
}
