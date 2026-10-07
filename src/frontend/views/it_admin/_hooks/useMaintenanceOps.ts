/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (verbatim move).
 *
 * Maintenance hook: owns server stats (POST /maintenance/vacuum), the
 * browser/client info memo, the data-stores directory memo + storage
 * totals, the full-backup download, the per-store clear flow (POST
 * /maintenance/clear-store), and the double-confirmed full system reset
 * (POST /maintenance/system-reset). Live user/audit collections arrive
 * via getters so the shell can create this hook before the directory
 * hooks while keeping every destructive confirmation, confirm string,
 * and alert message verbatim.
 */

import { useMemo, useState } from 'react';
import type { User } from '@/types';
import { apiFetch } from '@/utils/api';
import { formatBytes } from '../_utils/it-admin-format';
import type { AuditLog, DataStoreItem, ItNotify } from '../_utils/it-admin-types';

export interface UseMaintenanceOpsOptions {
  notify: ItNotify;
  currentUser?: User | null;
  getUsers: () => User[];
  getAuditLogs: () => AuditLog[];
  refreshUsers: () => Promise<void>;
  refreshAudit: () => Promise<void>;
}

export interface UseMaintenanceOpsResult {
  maintenanceLoading: string | null;
  setMaintenanceLoading: (value: string | null) => void;
  serverStats: any;
  storeToClear: DataStoreItem | null;
  setStoreToClear: (store: DataStoreItem | null) => void;
  isResetModalOpen: boolean;
  setIsResetModalOpen: (value: boolean) => void;
  resetConfirmText: string;
  setResetConfirmText: (value: string) => void;
  browserInfo: { browser: string; os: string; engine: string };
  dataStores: DataStoreItem[];
  totalStorageBytes: number;
  fetchServerStats: () => Promise<void>;
  handleDownloadFullBackup: () => Promise<void>;
  handleConfirmClearStore: () => Promise<void>;
  handleExecuteSystemReset: () => Promise<void>;
  formatBytes: (bytes: number) => string;
}

export function useMaintenanceOps({
  notify,
  currentUser,
  getUsers,
  getAuditLogs,
  refreshUsers,
  refreshAudit
}: UseMaintenanceOpsOptions): UseMaintenanceOpsResult {
  const { setError, setSuccess } = notify;

  const users = getUsers();
  const auditLogs = getAuditLogs();

  // Maintenance State
  const [maintenanceLoading, setMaintenanceLoading] = useState<string | null>(null);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [serverStats, setServerStats] = useState<any>({});

  // Store Clear & System Reset Modals
  const [storeToClear, setStoreToClear] = useState<DataStoreItem | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');

  const fetchServerStats = async () => {
    try {
      const res = await apiFetch('/maintenance/vacuum', { method: 'POST' }).catch(() => null);
      if (res && res.stats) {
        setServerStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err);
    }
  };

  // Browser Information
  const browserInfo = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return { browser: 'Web Browser', os: 'Cloud Container', engine: 'Standard Engine' };
    }
    const ua = navigator.userAgent;
    let browser = 'Chrome';
    let os = 'Linux / Web';
    let engine = 'Blink / V8';

    if (ua.includes('Firefox')) {
      browser = 'Mozilla Firefox';
      engine = 'Gecko';
    } else if (ua.includes('Edg/')) {
      browser = 'Microsoft Edge';
      engine = 'Blink / Chromium';
    } else if (ua.includes('Chrome')) {
      const match = ua.match(/Chrome\/([0-9.]+)/);
      browser = match ? `Google Chrome ${match[1].split('.')[0]}` : 'Google Chrome';
      engine = 'Blink / V8';
    } else if (ua.includes('Safari')) {
      browser = 'Apple Safari';
      engine = 'WebKit';
    }

    if (ua.includes('Win')) os = 'Windows NT';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux x86_64';
    else if (ua.includes('Android')) os = 'Android OS';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS Safari';

    return { browser, os, engine };
  }, []);

  // System Data Stores List with live counts & byte calculations
  const dataStores = useMemo<DataStoreItem[]>(() => {
    const calcStorage = (key: string, defaultItems: number = 0): { count: number; bytes: number } => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return { count: defaultItems, bytes: defaultItems > 0 ? defaultItems * 420 : 0 };
        const bytes = new Blob([item]).size;
        let count = defaultItems;
        try {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed)) count = parsed.length;
          else if (typeof parsed === 'object' && parsed !== null) count = Object.keys(parsed).length;
          else count = 1;
        } catch {
          count = 1;
        }
        return { count, bytes };
      } catch {
        return { count: defaultItems, bytes: defaultItems > 0 ? defaultItems * 420 : 0 };
      }
    };

    const patientsCalc = calcStorage('zmc_patients', serverStats.patients || 0);
    const encountersCalc = calcStorage('zmc_encounters', serverStats.encounters || 0);
    const vitalsCalc = calcStorage('zmc_patient_vitals', 0);
    const queueCalc = calcStorage('zmc_patient_queue', 0);
    const consultCalc = calcStorage('zmc_consultations', 0);
    const maternityCalc = calcStorage('zmc_maternity_records', 0);
    const emergencyCalc = calcStorage('zmc_emergency_records', 0);
    const labCalc = calcStorage('zmc_laboratory_orders', 0);
    const pharmacyCalc = calcStorage('zmc_pharmacy_orders', 0);
    const inventoryCalc = calcStorage('zmc_inventory', 42);
    const invoicesCalc = calcStorage('zmc_invoices', 0);
    const paymentsCalc = calcStorage('zmc_payments', serverStats.payments || 0);
    const outstandingCalc = calcStorage('zmc_outstanding_balances', 0);
    const auditCalc = {
      count: auditLogs.length,
      bytes: new Blob([JSON.stringify(auditLogs)]).size
    };
    const notificationsCalc = calcStorage('zmc_notifications', 0);
    const usersCalc = {
      count: users.length,
      bytes: new Blob([JSON.stringify(users)]).size
    };
    const tokenCalc = calcStorage('zmc_token', 1);

    return [
      {
        id: 'patients',
        key: 'zmc_patients',
        serverKey: 'patients',
        name: 'Patient Demographics',
        category: 'Clinical',
        description: 'Hospital folder numbers, names, contact details, card types, and registrations',
        count: patientsCalc.count,
        sizeBytes: patientsCalc.bytes
      },
      {
        id: 'encounters',
        key: 'zmc_encounters',
        serverKey: 'encounters',
        name: 'Clinical Encounters',
        category: 'Clinical',
        description: 'Hospital visits, triage timestamps, destination clinics, and visit statuses',
        count: encountersCalc.count,
        sizeBytes: encountersCalc.bytes
      },
      {
        id: 'vitals',
        key: 'zmc_patient_vitals',
        serverKey: 'vitals',
        name: 'Triage & Vital Signs',
        category: 'Clinical',
        description: 'Blood pressure, pulse, temperature, SPO2, weight, and respiratory records',
        count: vitalsCalc.count,
        sizeBytes: vitalsCalc.bytes
      },
      {
        id: 'queue',
        key: 'zmc_patient_queue',
        serverKey: 'queue',
        name: 'Departmental Routing Queue',
        category: 'Queue',
        description: 'Live patient queues for Nurse Desk, Doctor Clinics, Eye Clinic, Lab, and Pharmacy',
        count: queueCalc.count,
        sizeBytes: queueCalc.bytes
      },
      {
        id: 'consultations',
        key: 'zmc_consultations',
        serverKey: 'consultations',
        name: 'Doctor Consultations',
        category: 'Clinical',
        description: 'Clinical examination notes, provisional diagnoses, and physician treatment plans',
        count: consultCalc.count,
        sizeBytes: consultCalc.bytes
      },
      {
        id: 'maternity',
        key: 'zmc_maternity_records',
        serverKey: 'maternity',
        name: 'Maternity & ANC Records',
        category: 'Clinical',
        description: 'Gravida, Para, LMP, EDD, gestational age, and antenatal booking profiles',
        count: maternityCalc.count,
        sizeBytes: maternityCalc.bytes
      },
      {
        id: 'emergency',
        key: 'zmc_emergency_records',
        serverKey: 'emergency',
        name: 'Accident & Emergency Records',
        category: 'Clinical',
        description: 'Trauma intake, sick emergencies, unbooked labour, and doctor-on-call logs',
        count: emergencyCalc.count,
        sizeBytes: emergencyCalc.bytes
      },
      {
        id: 'lab_orders',
        key: 'zmc_laboratory_orders',
        serverKey: 'lab_orders',
        name: 'Laboratory Orders & Results',
        category: 'Clinical',
        description: 'Diagnostic investigation orders, specimen status, and lab pathology reports',
        count: labCalc.count,
        sizeBytes: labCalc.bytes
      },
      {
        id: 'pharmacy',
        key: 'zmc_pharmacy_orders',
        serverKey: 'pharmacy',
        name: 'Pharmacy Prescriptions',
        category: 'Inventory',
        description: 'Prescription orders, dispensing statuses, and medication regimens',
        count: pharmacyCalc.count,
        sizeBytes: pharmacyCalc.bytes
      },
      {
        id: 'inventory',
        key: 'zmc_inventory',
        serverKey: 'inventory',
        name: 'Pharmacy Stock & Inventory',
        category: 'Inventory',
        description: 'Hospital medication catalog, unit pricing, batch tracking, and stock levels',
        count: inventoryCalc.count,
        sizeBytes: inventoryCalc.bytes
      },
      {
        id: 'invoices',
        key: 'zmc_invoices',
        serverKey: 'invoices',
        name: 'Invoices & Billing Accounts',
        category: 'Billing',
        description: 'Hospital fees, service charges, lab/pharmacy billing, and outstanding accounts',
        count: invoicesCalc.count,
        sizeBytes: invoicesCalc.bytes
      },
      {
        id: 'payments',
        key: 'zmc_payments',
        serverKey: 'payments',
        name: 'Cashier Receipts & Payments',
        category: 'Billing',
        description: 'Validated payment receipts, cashier reconciliation, and payment methods',
        count: paymentsCalc.count,
        sizeBytes: paymentsCalc.bytes
      },
      {
        id: 'outstanding',
        key: 'zmc_outstanding_balances',
        serverKey: 'outstanding',
        name: 'Outstanding Balances Ledger',
        category: 'Billing',
        description: 'Accounts receivable tracking, patient owed balances, and credit clearance',
        count: outstandingCalc.count,
        sizeBytes: outstandingCalc.bytes
      },
      {
        id: 'audit_logs',
        key: 'zmc_audit_logs',
        serverKey: 'audit_logs',
        name: 'Security Audit Trail',
        category: 'System',
        description: 'Authentication events, administrative modifications, and security actions',
        count: auditCalc.count,
        sizeBytes: auditCalc.bytes
      },
      {
        id: 'notifications',
        key: 'zmc_notifications',
        serverKey: 'notifications',
        name: 'System Notifications',
        category: 'System',
        description: 'Inter-departmental patient alerts, order routing, and system status updates',
        count: notificationsCalc.count,
        sizeBytes: notificationsCalc.bytes
      },
      {
        id: 'users',
        key: 'zmc_users',
        serverKey: 'users',
        name: 'Staff Accounts & Credentials',
        category: 'System',
        description: 'Hospital user accounts, department assignments, and bcrypt-hashed keys',
        count: usersCalc.count,
        sizeBytes: usersCalc.bytes,
        isProtected: true
      },
      {
        id: 'token',
        key: 'zmc_token',
        name: 'Active Session Token',
        category: 'System',
        description: 'Authenticated JSON Web Token (JWT) authorizing intranet access',
        count: tokenCalc.count,
        sizeBytes: tokenCalc.bytes,
        isProtected: true
      }
    ];
  }, [auditLogs, users, serverStats]);

  // Storage Used calculation
  const totalStorageBytes = useMemo(() => {
    return dataStores.reduce((sum, item) => sum + item.sizeBytes, 0);
  }, [dataStores]);

  // Download Full Backup logic
  const handleDownloadFullBackup = async () => {
    setMaintenanceLoading('backup');
    try {
      // Gather all client localStorage keys
      const clientStorage: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            clientStorage[key] = JSON.parse(localStorage.getItem(key) || '""');
          } catch {
            clientStorage[key] = localStorage.getItem(key);
          }
        }
      }

      // Fetch server snapshot as well
      let serverDatabase: any = {};
      try {
        const res = await fetch('/api/maintenance/backup');
        if (res.ok) {
          serverDatabase = await res.json();
        }
      } catch (e) {
        console.warn('Could not fetch server db for backup:', e);
      }

      const now = new Date();
      const dateString = now.toISOString().split('T')[0];
      const filename = `ZMC_HMS_Backup_${dateString}.json`;

      const fullBackupPayload = {
        metadata: {
          system: 'Zikora Medical Complex (ZMC) HMS (Hospital Management System)',
          exportType: 'Full System Backup',
          exportedAt: now.toISOString(),
          exportedBy: currentUser?.username || 'admin',
          recordCount: {
            users: users.length,
            auditLogs: auditLogs.length,
            dataStores: dataStores.length
          }
        },
        localStorage: clientStorage,
        database: serverDatabase
      };

      const jsonStr = JSON.stringify(fullBackupPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Log Data Export in audit logs
      await apiFetch('/audit-logs', {
        method: 'POST',
        body: JSON.stringify({
          action: 'Data Export',
          details: `Exported full backup ${filename}`,
          userId: currentUser?.id || 'it-admin',
          userName: currentUser?.name || 'IT Administrator',
          userRole: currentUser?.role || 'IT Administrator'
        })
      }).catch(() => {});

      await refreshAudit();
      setSuccess(`Backup ${filename} downloaded successfully.`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(`Failed to download full backup: ${err.message}`);
      setTimeout(() => setError(''), 4000);
    } finally {
      setMaintenanceLoading(null);
    }
  };

  // Clear Individual Data Store
  const handleConfirmClearStore = async () => {
    if (!storeToClear) return;
    setMaintenanceLoading(`clear-${storeToClear.id}`);
    setError('');
    setSuccess('');

    try {
      // Clear client storage
      localStorage.removeItem(storeToClear.key);

      // Clear server tables if mapped
      if (storeToClear.serverKey) {
        await apiFetch('/maintenance/clear-store', {
          method: 'POST',
          body: JSON.stringify({
            storeKey: storeToClear.serverKey,
            storeName: storeToClear.name,
            actorName: currentUser?.name || 'IT Administrator',
            actorRole: currentUser?.role || 'IT Administrator'
          })
        });
      } else {
        // Record audit log for local store clear
        await apiFetch('/audit-logs', {
          method: 'POST',
          body: JSON.stringify({
            action: 'Data Clear',
            details: `Cleared data store: ${storeToClear.name}`,
            userId: currentUser?.id || 'it-admin',
            userName: currentUser?.name || 'IT Administrator',
            userRole: currentUser?.role || 'IT Administrator'
          })
        }).catch(() => {});
      }

      setSuccess(`Data store "${storeToClear.name}" has been cleared.`);
      setStoreToClear(null);
      await refreshUsers();
      await refreshAudit();
      await fetchServerStats();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(`Failed to clear store: ${err.message}`);
      setStoreToClear(null);
      setTimeout(() => setError(''), 4000);
    } finally {
      setMaintenanceLoading(null);
    }
  };

  // Full System Reset execution (Double confirmed)
  const handleExecuteSystemReset = async () => {
    if (resetConfirmText.trim().toUpperCase() !== 'RESET') {
      setError('Please type "RESET" in capital letters to confirm full system reset.');
      return;
    }

    setMaintenanceLoading('reset');
    setError('');
    setSuccess('');

    try {
      // Clear operational localStorage keys
      const operationalKeys = [
        'zmc_patients',
        'zmc_encounters',
        'zmc_patient_vitals',
        'zmc_patient_queue',
        'zmc_consultations',
        'zmc_maternity_records',
        'zmc_emergency_records',
        'zmc_laboratory_orders',
        'zmc_pharmacy_orders',
        'zmc_invoices',
        'zmc_payments',
        'zmc_outstanding_balances',
        'zmc_notifications'
      ];

      operationalKeys.forEach(k => localStorage.removeItem(k));

      // Call backend system-reset endpoint
      const res = await apiFetch('/maintenance/system-reset', {
        method: 'POST',
        body: JSON.stringify({
          actorName: currentUser?.name || 'IT Administrator',
          actorRole: currentUser?.role || 'IT Administrator'
        })
      });

      setIsResetModalOpen(false);
      setResetConfirmText('');
      setSuccess('Full system reset completed. Operational data stores cleared.');
      await refreshUsers();
      await refreshAudit();
      await fetchServerStats();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(`System reset error: ${err.message}`);
      setIsResetModalOpen(false);
      setTimeout(() => setError(''), 5000);
    } finally {
      setMaintenanceLoading(null);
    }
  };

  return {
    maintenanceLoading,
    setMaintenanceLoading,
    serverStats,
    storeToClear,
    setStoreToClear,
    isResetModalOpen,
    setIsResetModalOpen,
    resetConfirmText,
    setResetConfirmText,
    browserInfo,
    dataStores,
    totalStorageBytes,
    fetchServerStats,
    handleDownloadFullBackup,
    handleConfirmClearStore,
    handleExecuteSystemReset,
    formatBytes
  };
}
