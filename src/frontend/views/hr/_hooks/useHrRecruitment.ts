/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx.
 *
 * Recruitment hook: owns job openings + candidates state (GET
 * /hr/recruitment/jobs + GET /hr/recruitment/candidates via a single
 * Promise.all fan-out), the job/candidate forms + status filter +
 * modal flags, and the vacancy/candidate flows (POST
 * /hr/recruitment/jobs, PATCH /hr/recruitment/jobs/:id status toggle,
 * DELETE /hr/recruitment/jobs/:id, POST /hr/recruitment/candidates,
 * PATCH /hr/recruitment/candidates/:id/stage). Board + pipeline JSX
 * lives in _tabs/RecruitmentTab, the posters in _modals/JobModal +
 * _modals/CandidateModal. apiFetch paths and payloads preserved verbatim.
 */

import type * as React from 'react';
import { useState } from 'react';
import { apiFetch } from '../../../utils/api';
import type { Candidate, JobOpening } from '../../../types';
import type { HrNotify } from '../_utils/hr-types';

export interface UseHrRecruitmentOptions {
  notify: HrNotify;
  refreshStats?: () => Promise<void>;
}

export interface UseHrRecruitmentResult {
  jobOpenings: JobOpening[];
  candidates: Candidate[];
  fetchRecruitment: () => Promise<void>;
  jobStatusFilter: 'All' | 'Open' | 'Closed';
  setJobStatusFilter: (value: 'All' | 'Open' | 'Closed') => void;
  jobForm: {
    title: string;
    department: string;
    openings_count: number;
    employment_type: string;
    status: string;
    experience_required: string;
    description: string;
  };
  setJobForm: (form: UseHrRecruitmentResult['jobForm']) => void;
  candidateForm: {
    job_id: string;
    job_title: string;
    candidate_name: string;
    email: string;
    phone: string;
    role_applied: string;
    stage: string;
    experience_years: number;
    notes: string;
    rating: number;
  };
  setCandidateForm: (form: UseHrRecruitmentResult['candidateForm']) => void;
  showAddJobModal: boolean;
  setShowAddJobModal: (value: boolean) => void;
  showAddCandidateModal: boolean;
  setShowAddCandidateModal: (value: boolean) => void;
  handleToggleJobStatus: (job: JobOpening) => Promise<void>;
  handleDeleteJob: (id: string, title: string) => Promise<void>;
  handleSaveJob: (e: React.FormEvent) => Promise<void>;
  handleSaveCandidate: (e: React.FormEvent) => Promise<void>;
  handleUpdateCandidateStage: (id: string, stage: string, candidateName: string) => Promise<void>;
}

export function useHrRecruitment({ notify, refreshStats }: UseHrRecruitmentOptions): UseHrRecruitmentResult {
  const { showNotification, setError } = notify;

  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [jobStatusFilter, setJobStatusFilter] = useState<'All' | 'Open' | 'Closed'>('All');
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Medical',
    openings_count: 1,
    employment_type: 'Full-time',
    status: 'Open',
    experience_required: '2+ years',
    description: ''
  });

  const [candidateForm, setCandidateForm] = useState({
    job_id: '',
    job_title: '',
    candidate_name: '',
    email: '',
    phone: '',
    role_applied: 'Doctor',
    stage: 'Applied',
    experience_years: 3,
    notes: '',
    rating: 4
  });

  // Modals
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);

  const fetchRecruitment = async () => {
    try {
      const [jobsRes, candsRes] = await Promise.all([
        apiFetch('/hr/recruitment/jobs'),
        apiFetch('/hr/recruitment/candidates')
      ]);
      if (jobsRes.success && Array.isArray(jobsRes.data)) setJobOpenings(jobsRes.data);
      if (candsRes.success && Array.isArray(candsRes.data)) setCandidates(candsRes.data);
    } catch (err) {
      console.error('Failed to load recruitment data:', err);
    }
  };

  // Handlers for Job Openings & Candidates
  const handleToggleJobStatus = async (job: JobOpening) => {
    const newStatus = job.status === 'Open' ? 'Closed' : 'Open';
    try {
      const res = await apiFetch(`/hr/recruitment/jobs/${job.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.success) {
        showNotification(`Job vacancy "${job.title}" has been ${newStatus === 'Open' ? 'opened' : 'closed'}`);
        await fetchRecruitment();
        await refreshStats?.();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update job status');
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the job vacancy for "${title}"?`)) return;
    try {
      const res = await apiFetch(`/hr/recruitment/jobs/${id}`, { method: 'DELETE' });
      if (res.success) {
        showNotification(`Deleted job opening "${title}"`);
        await fetchRecruitment();
        await refreshStats?.();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete job opening');
    }
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/hr/recruitment/jobs', {
        method: 'POST',
        body: JSON.stringify(jobForm)
      });
      if (res.success) {
        showNotification(`Job opening "${jobForm.title}" published`);
        setShowAddJobModal(false);
        setJobForm({
          title: '',
          department: 'Medical',
          openings_count: 1,
          employment_type: 'Full-time',
          status: 'Open',
          experience_required: '2+ years',
          description: ''
        });
        await fetchRecruitment();
        await refreshStats?.();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create job opening');
    }
  };

  const handleSaveCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/hr/recruitment/candidates', {
        method: 'POST',
        body: JSON.stringify(candidateForm)
      });
      if (res.success) {
        showNotification(`Candidate "${candidateForm.candidate_name}" recorded`);
        setShowAddCandidateModal(false);
        setCandidateForm({
          job_id: '',
          job_title: '',
          candidate_name: '',
          email: '',
          phone: '',
          role_applied: 'Doctor',
          stage: 'Applied',
          experience_years: 3,
          notes: '',
          rating: 4
        });
        await fetchRecruitment();
        await refreshStats?.();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add candidate');
    }
  };

  const handleUpdateCandidateStage = async (id: string, stage: string, candidateName: string) => {
    try {
      const res = await apiFetch(`/hr/recruitment/candidates/${id}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stage })
      });
      if (res.success) {
        showNotification(`Candidate ${candidateName} moved to ${stage}`);
        await fetchRecruitment();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update candidate stage');
    }
  };

  return {
    jobOpenings,
    candidates,
    fetchRecruitment,
    jobStatusFilter,
    setJobStatusFilter,
    jobForm,
    setJobForm,
    candidateForm,
    setCandidateForm,
    showAddJobModal,
    setShowAddJobModal,
    showAddCandidateModal,
    setShowAddCandidateModal,
    handleToggleJobStatus,
    handleDeleteJob,
    handleSaveJob,
    handleSaveCandidate,
    handleUpdateCandidateStage
  };
}
