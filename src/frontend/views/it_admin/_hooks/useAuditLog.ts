/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (verbatim move).
 *
 * Audit-log hook: owns the security audit trail state (GET /audit-logs),
 * the log search + action filter, the login/logout/user-created/
 * password-reset summary counters, the normalized action badge helper,
 * and the clear-logs flow (POST /audit-logs/clear). The clear operation
 * shares the maintenance loading flag owned by useMaintenanceOps, passed
 * in via options. apiFetch paths, payloads, and messaging preserved
 * verbatim.
 */

import { useMemo, useState } from 'react';
import { apiFetch } from '@/utils/api';
import { formatDate } from '../_utils/it-admin-format';
import type { AuditLog, ItNotify } from '../_utils/it-admin-types';

export interface AuditBadge {
  label: string;
  bg: string;
  text: string;
  border: string;
}

export interface UseAuditLogOptions {
  notify: ItNotify;
  setMaintenanceLoading: (value: string | null) => void;
}

export interface UseAuditLogResult {
  auditLogs: AuditLog[];
  setAuditLogs: (logs: AuditLog[]) => void;
  fetchAuditLogs: () => Promise<void>;
  logSearch: string;
  setLogSearch: (value: string) => void;
  actionFilter: string;
  setActionFilter: (value: string) => void;
  actionOptions: string[];
  filteredLogs: AuditLog[];
  logCounts: { login: number; logout: number; userCreated: number; passwordReset: number };
  getNormalizedAction: (rawAction: string) => AuditBadge;
  isClearLogsModalOpen: boolean;
  setIsClearLogsModalOpen: (value: boolean) => void;
  handleConfirmClearLogs: () => Promise<void>;
  formatDate: (dateStr?: string | null) => string;
}

// Action Filter Options
const ACTION_OPTIONS = [
  'All Actions',
  'Login',
  'Logout',
  'User Created',
  'Password Reset',
  'User Reactivated',
  'User Deactivated',
  'Data Export',
  'Data Clear',
  'System Reset',
  'User Deleted'
];

export function useAuditLog({
  notify,
  setMaintenanceLoading
}: UseAuditLogOptions): UseAuditLogResult {
  const { setError, setSuccess } = notify;

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [isClearLogsModalOpen, setIsClearLogsModalOpen] = useState(false);

  const fetchAuditLogs = async () => {
    try {
      const res = await apiFetch('/audit-logs');
      if (res.success && Array.isArray(res.data)) {
        setAuditLogs(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch audit logs:', err);
    }
  };

  // Activity Log Summary Counts
  const logCounts = useMemo(() => {
    let login = 0;
    let logout = 0;
    let userCreated = 0;
    let passwordReset = 0;

    auditLogs.forEach(l => {
      const act = (l.action || '').toLowerCase();
      if (act.includes('login') || act === 'user_login') login++;
      else if (act.includes('logout') || act === 'user_logout') logout++;
      else if (act.includes('user created') || act.includes('user_created') || act.includes('registered')) userCreated++;
      else if (act.includes('password reset') || act.includes('password_reset') || act.includes('password')) passwordReset++;
    });

    return { login, logout, userCreated, passwordReset };
  }, [auditLogs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((l) => {
      const q = logSearch.toLowerCase();
      const matchesSearch =
        (l.user_name || '').toLowerCase().includes(q) ||
        (l.user_id || '').toLowerCase().includes(q) ||
        (l.user_role || '').toLowerCase().includes(q) ||
        (l.action || '').toLowerCase().includes(q) ||
        (l.details || '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (actionFilter === 'All Actions') return true;

      const act = (l.action || '').toLowerCase();
      const target = actionFilter.toLowerCase();

      if (target === 'login') return act.includes('login');
      if (target === 'logout') return act.includes('logout');
      if (target === 'user created') return act.includes('user created') || act.includes('user_created');
      if (target === 'password reset') return act.includes('password reset') || act.includes('password');
      if (target === 'user reactivated') return act.includes('reactivated');
      if (target === 'user deactivated') return act.includes('deactivated');
      if (target === 'data export') return act.includes('export');
      if (target === 'data clear') return act.includes('clear');
      if (target === 'system reset') return act.includes('reset');
      if (target === 'user deleted') return act.includes('deleted');

      return act === target;
    });
  }, [auditLogs, logSearch, actionFilter]);

  // Normalize Action for Badge Display
  const getNormalizedAction = (rawAction: string): AuditBadge => {
    const act = (rawAction || '').toLowerCase();

    if (act.includes('reactivated')) {
      return { label: 'User Reactivated', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    }
    if (act.includes('deactivated')) {
      return { label: 'User Deactivated', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    }
    if (act.includes('login')) {
      return { label: 'Login', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
    }
    if (act.includes('logout')) {
      return { label: 'Logout', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
    }
    if (act.includes('user created') || act.includes('user_created')) {
      return { label: 'User Created', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    }
    if (act.includes('password')) {
      return { label: 'Password Reset', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    }
    if (act.includes('export')) {
      return { label: 'Data Export', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
    }
    if (act.includes('clear')) {
      return { label: 'Data Clear', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    }
    if (act.includes('reset')) {
      return { label: 'System Reset', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    }
    if (act.includes('deleted')) {
      return { label: 'User Deleted', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    }

    return { label: rawAction || 'System Event', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  };

  // Clear Activity Logs
  const handleConfirmClearLogs = async () => {
    setMaintenanceLoading('clear-logs');
    try {
      await apiFetch('/audit-logs/clear', { method: 'POST' });
      setAuditLogs([]);
      setIsClearLogsModalOpen(false);
      setSuccess('All activity logs have been cleared successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(`Failed to clear activity logs: ${err.message}`);
      setIsClearLogsModalOpen(false);
      setTimeout(() => setError(''), 4000);
    } finally {
      setMaintenanceLoading(null);
    }
  };

  return {
    auditLogs,
    setAuditLogs,
    fetchAuditLogs,
    logSearch,
    setLogSearch,
    actionFilter,
    setActionFilter,
    actionOptions: ACTION_OPTIONS,
    filteredLogs,
    logCounts,
    getNormalizedAction,
    isClearLogsModalOpen,
    setIsClearLogsModalOpen,
    handleConfirmClearLogs,
    formatDate
  };
}
