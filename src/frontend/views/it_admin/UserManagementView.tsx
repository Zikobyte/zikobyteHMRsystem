/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 shell (was 2288-line UserManagementView.tsx, now composes
 * it_admin/).
 *
 * Shell keeps: props (activeSubTab, onTabChange, currentUser), internal
 * tab sync effect + handleTabSwitch, hook composition, department header
 * + tab nav, alert banners, patient-import delegate mount, modal mounts.
 * Domain state lives in _hooks/ (useItUsers, useAuditLog,
 * useMaintenanceOps), tab JSX in _tabs/, modals in _modals/, shared
 * chrome in _components/, types in _utils/.
 * Lazy entry unchanged: App.tsx + lib/routing/routes.ts import
 * '@/views/it_admin/UserManagementView' (ORCHESTRATOR rewires — do not
 * touch). The ../PatientDirectoryImportView delegate import stays valid
 * (same directory depth as before).
 */

import { useEffect, useState } from 'react';
import { Activity, Settings, Shield, Upload, Users } from 'lucide-react';
import type { User } from '@/types';
import PatientDirectoryImportView from '../PatientDirectoryImportView';
import ItAdminAlerts from './_components/ItAdminAlerts';
import { useAuditLog } from './_hooks/useAuditLog';
import { useItUsers } from './_hooks/useItUsers';
import { useMaintenanceOps } from './_hooks/useMaintenanceOps';
import ClearLogsModal from './_modals/ClearLogsModal';
import ClearStoreModal from './_modals/ClearStoreModal';
import DeleteUserModal from './_modals/DeleteUserModal';
import PasswordResetModal from './_modals/PasswordResetModal';
import SystemResetModal from './_modals/SystemResetModal';
import UserEditorModal from './_modals/UserEditorModal';
import ActivityLogTab from './_tabs/ActivityLogTab';
import MaintenanceTab from './_tabs/MaintenanceTab';
import UsersTab from './_tabs/UsersTab';
import type { ItAdminTab } from './_utils/it-admin-types';

interface UserManagementViewProps {
  activeSubTab?: string;
  onTabChange?: (tab: string) => void;
  currentUser?: User | null;
}

export default function UserManagementView({
  activeSubTab = 'users',
  onTabChange,
  currentUser
}: UserManagementViewProps) {
  const [activeTab, setActiveTab] = useState<ItAdminTab>('users');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const notify = { setError, setSuccess };

  // ---- Phase 7 hooks (domain state + API handlers live in _hooks/) ----
  // Order matters: directory hooks first, maintenance last — its body reads
  // getUsers()/getAuditLogs() synchronously during render, so usersApi and
  // auditApi must already be initialized (else TDZ crash on mount).
  // Cross-references the other way are deferred closures invoked post-mount.
  const usersApi = useItUsers({
    notify,
    currentUser,
    refreshAudit: () => auditApi.fetchAuditLogs(),
    showUsersTab: () => setActiveTab('users')
  });
  const auditApi = useAuditLog({
    notify,
    setMaintenanceLoading: (v) => maintApi.setMaintenanceLoading(v)
  });
  const maintApi = useMaintenanceOps({
    notify,
    currentUser,
    getUsers: () => usersApi.users,
    getAuditLogs: () => auditApi.auditLogs,
    refreshUsers: () => usersApi.fetchUsers(),
    refreshAudit: () => auditApi.fetchAuditLogs()
  });

  // Sync internal activeTab with activeSubTab prop
  useEffect(() => {
    if (activeSubTab === 'maintenance') {
      setActiveTab('maintenance');
    } else if (activeSubTab === 'activity-log') {
      setActiveTab('activity-log');
    } else {
      setActiveTab('users');
    }
  }, [activeSubTab]);

  useEffect(() => {
    usersApi.fetchUsers();
    auditApi.fetchAuditLogs();
    maintApi.fetchServerStats();
  }, []);

  const handleTabSwitch = (tab: ItAdminTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      if (tab === 'users') onTabChange('users');
      else if (tab === 'maintenance') onTabChange('maintenance');
      else if (tab === 'activity-log') onTabChange('activity-log');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Subtitle */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A758C]/15 border border-[#2A758C]/30 flex items-center justify-center text-[#2A758C]">
                <Shield className="h-5 w-5" />
              </div>
              <span>IT Administration & Systems</span>
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-1">
              Zikora Medical Complex (ZMC) — Access Control, Maintenance & Security Audit
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PostgreSQL Relational DB Active
            </span>
          </div>
        </div>

        {/* Tab Navigation Navigation Strip */}
        <div className="department-page-nav flex items-center gap-2 mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() => handleTabSwitch('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#2A758C] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>User Management</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {usersApi.users.length}
            </span>
          </button>

          <button
            onClick={() => handleTabSwitch('patient-imports')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'patient-imports'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Import Directory</span>
          </button>

          <button
            onClick={() => handleTabSwitch('maintenance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'maintenance'
                ? 'bg-[#2A758C] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Maintenance</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${activeTab === 'maintenance' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {maintApi.dataStores.length} Stores
            </span>
          </button>

          <button
            onClick={() => handleTabSwitch('activity-log')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'activity-log'
                ? 'bg-[#2A758C] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Activity Log</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${activeTab === 'activity-log' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {auditApi.auditLogs.length}
            </span>
          </button>
        </div>
      </div>

      {/* Notifications and Alerts Banner */}
      <ItAdminAlerts
        error={error}
        success={success}
        onClearError={() => setError('')}
        onClearSuccess={() => setSuccess('')}
      />

      {activeTab === 'users' && <UsersTab data={usersApi} />}

      {activeTab === 'patient-imports' && (
        <PatientDirectoryImportView currentUser={currentUser} />
      )}

      {activeTab === 'maintenance' && <MaintenanceTab data={maintApi} />}

      {activeTab === 'activity-log' && <ActivityLogTab data={auditApi} />}

      {/* Modals */}
      <UserEditorModal data={usersApi} />
      <PasswordResetModal data={usersApi} />
      <DeleteUserModal data={usersApi} />
      <ClearStoreModal data={maintApi} />
      <SystemResetModal data={maintApi} />
      <ClearLogsModal audit={auditApi} maintenanceLoading={maintApi.maintenanceLoading} />
    </div>
  );
}
