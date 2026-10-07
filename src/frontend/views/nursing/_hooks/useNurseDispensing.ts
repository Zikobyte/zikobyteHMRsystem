/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/NurseDispensingView.tsx.
 *
 * Data hook: owns dispensing records + common-drugs fetching
 * (GET /api/nursing/dispensing), registered-patient autocomplete
 * (GET /api/nursing/patient-cards with GET /api/patients fallback),
 * the record form state + validation, save (POST /api/nursing/dispensing),
 * review toggle (PATCH /api/nursing/dispensing/:id/toggle-review), delete
 * (DELETE /api/nursing/dispensing/:id), search/status filters, suggestion
 * memos, and department totals. Fetch/handler logic preserved verbatim;
 * presentational pieces live in _components/dispensing/ and _modals/.
 */

import { useEffect, useMemo, useState } from 'react';
import type React from 'react';

export interface DispensingRecord {
  id: string;
  date: string;
  created_at: string;
  patient_name: string;
  card_number: string;
  drug: string;
  quantity: string;
  recorded_by: string;
  reviewed: boolean;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
}

export type DispensingStatusFilter = 'all' | 'pending' | 'reviewed';

export interface RegisteredPatientOption {
  name: string;
  hospital_number: string;
}

export interface DispensingFormErrors {
  patientName?: string;
  cardNumber?: string;
  drugDispensed?: string;
  quantity?: string;
}

export interface DispensingSuccessDialog {
  isOpen: boolean;
  title: string;
  message: string;
  record?: DispensingRecord;
}

export interface UseNurseDispensingResult {
  records: DispensingRecord[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: DispensingStatusFilter;
  setStatusFilter: (value: DispensingStatusFilter) => void;
  patientName: string;
  setPatientName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  drugDispensed: string;
  setDrugDispensed: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  recordedBy: string;
  setRecordedBy: (value: string) => void;
  formErrors: DispensingFormErrors;
  setFormErrors: React.Dispatch<React.SetStateAction<DispensingFormErrors>>;
  successDialog: DispensingSuccessDialog;
  showPatientSuggestions: boolean;
  setShowPatientSuggestions: (value: boolean) => void;
  showDrugSuggestions: boolean;
  setShowDrugSuggestions: (value: boolean) => void;
  filteredPatientSuggestions: RegisteredPatientOption[];
  filteredDrugSuggestions: string[];
  filteredRecords: DispensingRecord[];
  totalCount: number;
  pendingCount: number;
  reviewedCount: number;
  fetchDispensingData: () => Promise<void>;
  handleSaveDispensingRecord: (e: React.FormEvent) => Promise<void>;
  handleToggleReview: (recordId: string) => Promise<void>;
  handleDeleteRecord: (recordId: string, name: string) => Promise<void>;
  handleClearForm: () => void;
  closeSuccessDialog: () => void;
}

export function useNurseDispensing(): UseNurseDispensingResult {
  const [records, setRecords] = useState<DispensingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<DispensingStatusFilter>('all');
  const [commonDrugs, setCommonDrugs] = useState<string[]>([]);

  // Registered patients for autocomplete
  const [registeredPatients, setRegisteredPatients] = useState<RegisteredPatientOption[]>([]);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState<boolean>(false);
  const [showDrugSuggestions, setShowDrugSuggestions] = useState<boolean>(false);

  // Form State
  const [patientName, setPatientName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [drugDispensed, setDrugDispensed] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [recordedBy, setRecordedBy] = useState<string>('nurse1');

  // Form validation errors
  const [formErrors, setFormErrors] = useState<DispensingFormErrors>({});

  // Success Feedback Modal
  const [successDialog, setSuccessDialog] = useState<DispensingSuccessDialog>({
    isOpen: false,
    title: '',
    message: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('zmc_token') || localStorage.getItem('token') || localStorage.getItem('zmc_auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  // Fetch initial dispensing records and common drugs
  const fetchDispensingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/nursing/dispensing', {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        if (data.commonDrugs) {
          setCommonDrugs(data.commonDrugs);
        }
      }
    } catch (err: any) {
      console.error('Error fetching dispensing data:', err);
      setError('Could not load dispensing records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch registered patients for smart autocomplete
  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/nursing/patient-cards', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.patients)) {
          setRegisteredPatients(data.patients);
          return;
        }
      }

      const fallbackRes = await fetch('/api/patients', {
        headers: getAuthHeaders()
      });
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        const pts = (data.patients || data || []).map((p: any) => ({
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.name || 'Patient',
          hospital_number: p.hospital_number || p.patient_id || p.card_number || p.id || ''
        }));
        setRegisteredPatients(pts);
      }
    } catch (err) {
      // Non-blocking
    }
  };

  useEffect(() => {
    fetchDispensingData();
    fetchPatients();

    // Check logged in user to default recordedBy if available
    const savedUser = localStorage.getItem('zmc_user') || localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.username) {
          setRecordedBy(parsed.username);
        }
      } catch (e) {
        // keep default 'nurse1'
      }
    }
  }, []);

  // Form submission handler
  const handleSaveDispensingRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const errors: DispensingFormErrors = {};
    if (!patientName.trim()) {
      errors.patientName = 'Patient Name is required';
    }
    if (!cardNumber.trim()) {
      errors.cardNumber = 'Card Number is required';
    }
    if (!drugDispensed.trim()) {
      errors.drugDispensed = 'Drug Dispensed is required';
    }
    if (!quantity.trim()) {
      errors.quantity = 'Quantity is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSaving(true);

    try {
      const payload = {
        patientName: patientName.trim(),
        cardNumber: cardNumber.trim(),
        drug: drugDispensed.trim(),
        quantity: quantity.trim(),
        recordedBy: recordedBy.trim() || 'nurse1'
      };

      const res = await fetch('/api/nursing/dispensing', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save dispensing record');
      }

      // Update table state
      if (data.records) {
        setRecords(data.records);
      } else if (data.record) {
        setRecords(prev => [data.record, ...prev]);
      }

      // Open success dialog
      setSuccessDialog({
        isOpen: true,
        title: 'Dispensing Record Saved',
        message: `Drug dispensing record for patient "${payload.patientName}" (${payload.drug}, Qty: ${payload.quantity}) has been saved to the database.`,
        record: data.record
      });

      // Clear input fields (keep recordedBy as nurse1)
      setPatientName('');
      setCardNumber('');
      setDrugDispensed('');
      setQuantity('');
      setShowPatientSuggestions(false);
      setShowDrugSuggestions(false);
    } catch (err: any) {
      console.error('Error saving dispensing record:', err);
      alert(`Error saving record: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Toggle review status
  const handleToggleReview = async (recordId: string) => {
    try {
      const res = await fetch(`/api/nursing/dispensing/${recordId}/toggle-review`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && data.record) {
        setRecords(prev => prev.map(r => r.id === recordId ? data.record : r));
      }
    } catch (err) {
      console.error('Error toggling review:', err);
    }
  };

  // Delete record
  const handleDeleteRecord = async (recordId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove the dispensing entry for ${name}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/nursing/dispensing/${recordId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setRecords(prev => prev.filter(r => r.id !== recordId));
      }
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  const handleClearForm = () => {
    setPatientName('');
    setCardNumber('');
    setDrugDispensed('');
    setQuantity('');
    setFormErrors({});
    setShowPatientSuggestions(false);
    setShowDrugSuggestions(false);
  };

  const closeSuccessDialog = () => {
    setSuccessDialog({ isOpen: false, title: '', message: '' });
  };

  // Filtered patients for dropdown suggestions
  const filteredPatientSuggestions = useMemo(() => {
    if (!patientName.trim()) return [];
    const q = patientName.toLowerCase();
    return registeredPatients
      .filter(p => p.name.toLowerCase().includes(q) || p.hospital_number.toLowerCase().includes(q))
      .slice(0, 5);
  }, [patientName, registeredPatients]);

  // Filtered drugs for dropdown suggestions
  const filteredDrugSuggestions = useMemo(() => {
    if (!drugDispensed.trim()) return commonDrugs.slice(0, 6);
    const q = drugDispensed.toLowerCase();
    return commonDrugs
      .filter(d => d.toLowerCase().includes(q))
      .slice(0, 6);
  }, [drugDispensed, commonDrugs]);

  // Filtered records for table
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      const matchesSearch =
        (rec.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.card_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.drug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.recorded_by || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.date || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'reviewed') return rec.reviewed === true;
      if (statusFilter === 'pending') return !rec.reviewed;
      return true;
    });
  }, [records, searchQuery, statusFilter]);

  // Metrics
  const totalCount = records.length;
  const pendingCount = records.filter(r => !r.reviewed).length;
  const reviewedCount = records.filter(r => r.reviewed).length;

  return {
    records,
    loading,
    saving,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    patientName,
    setPatientName,
    cardNumber,
    setCardNumber,
    drugDispensed,
    setDrugDispensed,
    quantity,
    setQuantity,
    recordedBy,
    setRecordedBy,
    formErrors,
    setFormErrors,
    successDialog,
    showPatientSuggestions,
    setShowPatientSuggestions,
    showDrugSuggestions,
    setShowDrugSuggestions,
    filteredPatientSuggestions,
    filteredDrugSuggestions,
    filteredRecords,
    totalCount,
    pendingCount,
    reviewedCount,
    fetchDispensingData,
    handleSaveDispensingRecord,
    handleToggleReview,
    handleDeleteRecord,
    handleClearForm,
    closeSuccessDialog
  };
}
