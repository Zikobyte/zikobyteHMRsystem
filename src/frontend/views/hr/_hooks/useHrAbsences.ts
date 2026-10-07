/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx.
 *
 * Absences hook: owns the leave/absence log (GET /hr/absences), the record
 * form + timeframe filter + add-modal flag, and the record/status flows
 * (POST /hr/absences with the leave_type/start_date/end_date mapping,
 * DELETE /hr/absences/:id, PATCH /hr/absences/:id/status with the
 * reviewer-comments payload). Table JSX lives in _tabs/AbsencesTab, the
 * record form in _modals/AbsenceModal. apiFetch paths and payloads
 * preserved verbatim.
 */

import type * as React from 'react';
import { useState } from 'react';
import { apiFetch } from '../../../utils/api';
import type { Absence, User } from '../../../types';
import type { HrNotify } from '../_utils/hr-types';

export interface UseHrAbsencesOptions {
  notify: HrNotify;
  currentUser?: User | null;
}

export interface UseHrAbsencesResult {
  absences: Absence[];
  fetchAbsences: () => Promise<void>;
  absenceTimeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  setAbsenceTimeframe: (value: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly') => void;
  absenceForm: {
    employee_name: string;
    employee_id: string;
    department: string;
    date: string;
    status: string;
    reason: string;
  };
  setAbsenceForm: (form: UseHrAbsencesResult['absenceForm']) => void;
  showAddAbsenceModal: boolean;
  setShowAddAbsenceModal: (value: boolean) => void;
  handleSaveAbsence: (e: React.FormEvent) => Promise<void>;
  handleDeleteAbsence: (id: string, name: string) => Promise<void>;
  handleUpdateAbsenceStatus: (id: string, status: 'Approved' | 'Rejected', employeeName: string) => Promise<void>;
}

export function useHrAbsences({ notify, currentUser }: UseHrAbsencesOptions): UseHrAbsencesResult {
  const { showNotification, setError } = notify;

  const [absences, setAbsences] = useState<Absence[]>([]);

  const [absenceTimeframe, setAbsenceTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [absenceForm, setAbsenceForm] = useState({
    employee_name: '',
    employee_id: '',
    department: 'Medical',
    date: '2026-08-18',
    status: 'Sick Leave',
    reason: ''
  });

  // Modals
  const [showAddAbsenceModal, setShowAddAbsenceModal] = useState(false);

  const fetchAbsences = async () => {
    try {
      const res = await apiFetch('/hr/absences');
      if (res.success && Array.isArray(res.data)) {
        setAbsences(res.data);
      }
    } catch (err) {
      console.error('Failed to load absences:', err);
    }
  };

  // Handlers for Absence
  const handleSaveAbsence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!absenceForm.employee_name) {
      setError('Please select an employee');
      return;
    }
    try {
      const res = await apiFetch('/hr/absences', {
        method: 'POST',
        body: JSON.stringify({
          ...absenceForm,
          leave_type: absenceForm.status,
          start_date: absenceForm.date,
          end_date: absenceForm.date
        })
      });
      if (res.success) {
        showNotification(`Absence recorded for ${absenceForm.employee_name}`);
        setShowAddAbsenceModal(false);
        setAbsenceForm({
          employee_name: '',
          employee_id: '',
          department: 'Medical',
          date: '2026-08-18',
          status: 'Sick Leave',
          reason: ''
        });
        await fetchAbsences();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to record absence');
    }
  };

  const handleDeleteAbsence = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove the absence record for ${name}?`)) return;
    try {
      const res = await apiFetch(`/hr/absences/${id}`, { method: 'DELETE' });
      if (res.success) {
        showNotification(`Deleted absence record for ${name}`);
        await fetchAbsences();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete absence record');
    }
  };

  const handleUpdateAbsenceStatus = async (id: string, status: 'Approved' | 'Rejected', employeeName: string) => {
    try {
      const res = await apiFetch(`/hr/absences/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, comments: `${status} by ${currentUser?.name || 'HR Manager'}` })
      });
      if (res.success) {
        showNotification(`Leave request ${status.toLowerCase()} for ${employeeName}`);
        await fetchAbsences();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update leave status');
    }
  };

  return {
    absences,
    fetchAbsences,
    absenceTimeframe,
    setAbsenceTimeframe,
    absenceForm,
    setAbsenceForm,
    showAddAbsenceModal,
    setShowAddAbsenceModal,
    handleSaveAbsence,
    handleDeleteAbsence,
    handleUpdateAbsenceStatus
  };
}
