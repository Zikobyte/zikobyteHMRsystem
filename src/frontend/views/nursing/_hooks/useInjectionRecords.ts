/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Extraction from _tabs/InjectionRecordsView.tsx.
 *
 * Data hook: owns injection records + common-injections fetching
 * (GET /api/nursing/injections), registered-patient autocomplete
 * (GET /api/nursing/patient-cards with GET /api/patients fallback),
 * the log-injection form state + validation, save
 * (POST /api/nursing/injections), review toggle
 * (PATCH /api/nursing/injections/:id/toggle-review), delete
 * (DELETE /api/nursing/injections/:id), search/status filters, suggestion
 * memos, card-dropdown refs + outside-click handling, and department
 * totals. Fetch/handler logic preserved verbatim; presentational pieces
 * live in _components/injection/ and _modals/.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';

export interface InjectionRecord {
  id: string;
  date: string;
  created_at: string;
  card_number: string;
  patient_name: string;
  injection_type: string;
  dose: string;
  nurse_sign: string;
  reviewed: boolean;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
}

export interface RegisteredPatientCard {
  hospital_number: string;
  name: string;
  phone_number?: string;
  category?: string;
  gender?: string;
}

export type InjectionStatusFilter = 'all' | 'pending' | 'reviewed';

export interface InjectionFormErrors {
  date?: string;
  cardNumber?: string;
  patientName?: string;
  injectionType?: string;
  dose?: string;
}

export interface InjectionSuccessDialog {
  isOpen: boolean;
  title: string;
  message: string;
  record?: InjectionRecord;
}

export interface UseInjectionRecordsResult {
  records: InjectionRecord[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: InjectionStatusFilter;
  setStatusFilter: (value: InjectionStatusFilter) => void;
  commonInjections: string[];
  registeredPatients: RegisteredPatientCard[];
  loadingPatients: boolean;
  showCardSuggestions: boolean;
  setShowCardSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPatientCard: RegisteredPatientCard | null;
  setSelectedPatientCard: (value: RegisteredPatientCard | null) => void;
  cardInputContainerRef: React.RefObject<HTMLDivElement | null>;
  cardInputRef: React.RefObject<HTMLInputElement | null>;
  date: string;
  setDate: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  patientName: string;
  setPatientName: (value: string) => void;
  selectedInjectionType: string;
  setSelectedInjectionType: (value: string) => void;
  customInjectionType: string;
  setCustomInjectionType: (value: string) => void;
  isCustomInjection: boolean;
  setIsCustomInjection: (value: boolean) => void;
  dose: string;
  setDose: (value: string) => void;
  nurseSign: string;
  setNurseSign: (value: string) => void;
  formErrors: InjectionFormErrors;
  setFormErrors: React.Dispatch<React.SetStateAction<InjectionFormErrors>>;
  successDialog: InjectionSuccessDialog;
  filteredCardSuggestions: RegisteredPatientCard[];
  filteredRecords: InjectionRecord[];
  totalCount: number;
  pendingCount: number;
  reviewedCount: number;
  fetchInjectionData: () => Promise<void>;
  fetchPatients: (query?: string) => Promise<void>;
  handleSaveInjectionRecord: (e: React.FormEvent) => Promise<void>;
  handleToggleReview: (recordId: string) => Promise<void>;
  handleDeleteRecord: (recordId: string, name: string) => Promise<void>;
  handleSelectPatient: (p: RegisteredPatientCard) => void;
  handleClearForm: () => void;
  closeSuccessDialog: () => void;
}

export function useInjectionRecords(): UseInjectionRecordsResult {
  const [records, setRecords] = useState<InjectionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<InjectionStatusFilter>('all');
  const [commonInjections, setCommonInjections] = useState<string[]>([]);

  // Registered patients from database for card number lookup & autocomplete
  const [registeredPatients, setRegisteredPatients] = useState<RegisteredPatientCard[]>([]);
  const [loadingPatients, setLoadingPatients] = useState<boolean>(false);
  const [showCardSuggestions, setShowCardSuggestions] = useState<boolean>(false);
  const [selectedPatientCard, setSelectedPatientCard] = useState<RegisteredPatientCard | null>(null);

  // References for card number input and dropdown handling
  const cardInputContainerRef = useRef<HTMLDivElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);

  // Form State matching user instructions:
  // Date * (07/09/2026)
  // Card Number * (Search by card ID, name or phone…)
  // Patient Name * (Auto-filled when card selected, or type manually)
  // Injection Type * (-- Select injection -- / Type injection name...)
  // Dose * (e.g. 500mg, 1 ampoule)
  // Nurse Sign (nurse1)
  const [date, setDate] = useState<string>('07/09/2026');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [selectedInjectionType, setSelectedInjectionType] = useState<string>('');
  const [customInjectionType, setCustomInjectionType] = useState<string>('');
  const [isCustomInjection, setIsCustomInjection] = useState<boolean>(false);
  const [dose, setDose] = useState<string>('');
  const [nurseSign, setNurseSign] = useState<string>('nurse1');

  // Form validation errors
  const [formErrors, setFormErrors] = useState<InjectionFormErrors>({});

  // Success Feedback Modal
  const [successDialog, setSuccessDialog] = useState<InjectionSuccessDialog>({
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

  // Fetch initial injection records & suggestions
  const fetchInjectionData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/nursing/injections', {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        if (data.commonInjections) {
          setCommonInjections(data.commonInjections);
        }
      }
    } catch (err: any) {
      console.error('Error fetching injection records:', err);
      setError('Could not load injection records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch registered patients for lookup
  const fetchPatients = async (query = '') => {
    setLoadingPatients(true);
    try {
      const url = query
        ? `/api/nursing/patient-cards?search=${encodeURIComponent(query)}`
        : '/api/nursing/patient-cards';
      const res = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.patients)) {
          setRegisteredPatients(data.patients);
          return;
        }
      }

      // Fallback to /api/patients if needed
      const fallbackRes = await fetch('/api/patients', {
        headers: getAuthHeaders()
      });
      if (fallbackRes.ok) {
        const fbData = await fallbackRes.json();
        const pts: RegisteredPatientCard[] = (fbData.patients || fbData || []).map((p: any) => ({
          name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.name || 'Patient',
          hospital_number: p.hospital_number || p.patient_id || p.card_number || p.id || '',
          phone_number: p.phone_number || p.phone || '',
          category: p.card_type || p.category || 'Outpatient',
          gender: p.gender || ''
        }));
        setRegisteredPatients(pts);
      }
    } catch (err) {
      console.warn('Could not load patient cards from database:', err);
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchInjectionData();
    fetchPatients();

    // Set today's date formatted if available
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    if (today) {
      setDate(today);
    }

    // Default nurse sign from saved user if available
    const savedUser = localStorage.getItem('zmc_user') || localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.username) {
          setNurseSign(parsed.username);
        }
      } catch (e) {
        // keep default 'nurse1'
      }
    }

    // Outside click & escape listener to close suggestions dropdown
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (cardInputContainerRef.current && !cardInputContainerRef.current.contains(e.target as Node)) {
        setShowCardSuggestions(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCardSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Form submit handler
  const handleSaveInjectionRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    const activeInjectionType = isCustomInjection ? customInjectionType.trim() : selectedInjectionType.trim();

    // Validate required fields
    const errors: InjectionFormErrors = {};
    if (!date.trim()) {
      errors.date = 'Date is required';
    }
    if (!cardNumber.trim()) {
      errors.cardNumber = 'Card Number is required';
    }
    if (!patientName.trim()) {
      errors.patientName = 'Patient Name is required';
    }
    if (!activeInjectionType) {
      errors.injectionType = 'Injection Type is required';
    }
    if (!dose.trim()) {
      errors.dose = 'Dose is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSaving(true);

    try {
      const payload = {
        date: date.trim(),
        cardNumber: cardNumber.trim(),
        patientName: patientName.trim(),
        injectionType: activeInjectionType,
        dose: dose.trim(),
        nurseSign: nurseSign.trim() || 'nurse1'
      };

      const res = await fetch('/api/nursing/injections', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save injection record');
      }

      // Update state
      if (data.records) {
        setRecords(data.records);
      } else if (data.record) {
        setRecords(prev => [data.record, ...prev]);
      }

      // Open confirmation dialog
      setSuccessDialog({
        isOpen: true,
        title: 'Injection Record Saved',
        message: `Injection administration for "${payload.patientName}" (${payload.injectionType}, Dose: ${payload.dose}) has been recorded in the database.`,
        record: data.record
      });

      // Reset form fields
      setCardNumber('');
      setPatientName('');
      setSelectedPatientCard(null);
      setSelectedInjectionType('');
      setCustomInjectionType('');
      setIsCustomInjection(false);
      setDose('');
      setShowCardSuggestions(false);
    } catch (err: any) {
      console.error('Error saving injection record:', err);
      alert(`Error saving record: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Toggle review/verify status
  const handleToggleReview = async (recordId: string) => {
    try {
      const res = await fetch(`/api/nursing/injections/${recordId}/toggle-review`, {
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
    if (!window.confirm(`Are you sure you want to remove the injection record for ${name}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/nursing/injections/${recordId}`, {
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

  // Filtered card/patient suggestions from database
  const filteredCardSuggestions = useMemo(() => {
    if (!cardNumber.trim()) {
      // When input is selected/focused without typing, show all available patients from the database
      return registeredPatients;
    }
    const q = cardNumber.toLowerCase().trim();
    return registeredPatients.filter(p =>
      (p.hospital_number || '').toLowerCase().includes(q) ||
      (p.name || '').toLowerCase().includes(q) ||
      (p.phone_number && p.phone_number.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  }, [cardNumber, registeredPatients]);

  // Handle patient selection from dropdown: auto-fills card number and patient name
  const handleSelectPatient = (p: RegisteredPatientCard) => {
    setCardNumber(p.hospital_number);
    setPatientName(p.name);
    setSelectedPatientCard(p);
    setShowCardSuggestions(false);
    setFormErrors(prev => ({
      ...prev,
      cardNumber: undefined,
      patientName: undefined
    }));
  };

  // Filtered table records
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      const matchesSearch =
        (rec.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.card_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.injection_type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.dose || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.nurse_sign || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.date || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'reviewed') return rec.reviewed === true;
      if (statusFilter === 'pending') return !rec.reviewed;
      return true;
    });
  }, [records, searchQuery, statusFilter]);

  const handleClearForm = () => {
    setCardNumber('');
    setPatientName('');
    setSelectedInjectionType('');
    setCustomInjectionType('');
    setIsCustomInjection(false);
    setDose('');
    setFormErrors({});
    setShowCardSuggestions(false);
  };

  const closeSuccessDialog = () => {
    setSuccessDialog({ isOpen: false, title: '', message: '' });
  };

  // Quick stats
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
    commonInjections,
    registeredPatients,
    loadingPatients,
    showCardSuggestions,
    setShowCardSuggestions,
    selectedPatientCard,
    setSelectedPatientCard,
    cardInputContainerRef,
    cardInputRef,
    date,
    setDate,
    cardNumber,
    setCardNumber,
    patientName,
    setPatientName,
    selectedInjectionType,
    setSelectedInjectionType,
    customInjectionType,
    setCustomInjectionType,
    isCustomInjection,
    setIsCustomInjection,
    dose,
    setDose,
    nurseSign,
    setNurseSign,
    formErrors,
    setFormErrors,
    successDialog,
    filteredCardSuggestions,
    filteredRecords,
    totalCount,
    pendingCount,
    reviewedCount,
    fetchInjectionData,
    fetchPatients,
    handleSaveInjectionRecord,
    handleToggleReview,
    handleDeleteRecord,
    handleSelectPatient,
    handleClearForm,
    closeSuccessDialog
  };
}
