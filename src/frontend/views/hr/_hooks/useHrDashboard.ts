/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx.
 *
 * Overview hook: owns dashboard stats (GET /hr/dashboard) plus the shared
 * shell messaging state (loading/refreshing/error/successMsg +
 * showNotification). Refresh fan-out and tab routing stay in the shell;
 * domain hooks receive `notify` from this hook. apiFetch path preserved
 * verbatim.
 */

import { useState } from 'react';
import { apiFetch } from '../../../utils/api';
import type { HRDashboardStats } from '../../../types';

export interface UseHrDashboardResult {
  stats: HRDashboardStats | null;
  fetchDashboardStats: () => Promise<void>;
  loading: boolean;
  setLoading: (value: boolean) => void;
  refreshing: boolean;
  setRefreshing: (value: boolean) => void;
  error: string | null;
  setError: (msg: string | null) => void;
  successMsg: string | null;
  showNotification: (msg: string) => void;
}

export function useHrDashboard(): UseHrDashboardResult {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Dashboard Stats
  const [stats, setStats] = useState<HRDashboardStats | null>(null);

  // Fetch HR Dashboard data
  const fetchDashboardStats = async () => {
    try {
      setError(null);
      const res = await apiFetch('/hr/dashboard');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load HR dashboard:', err);
      setError(err.message || 'Failed to load HR metrics from database');
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return {
    stats,
    fetchDashboardStats,
    loading,
    setLoading,
    refreshing,
    setRefreshing,
    error,
    setError,
    successMsg,
    showNotification
  };
}
