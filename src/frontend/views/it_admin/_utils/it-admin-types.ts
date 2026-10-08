/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (verbatim move).
 *
 * Shared IT-admin domain types, role/department catalogs, and the tab
 * union. No behavior change.
 */

import type { UserRole } from '@/types';

export type ItAdminTab = 'users' | 'patient-imports' | 'maintenance' | 'activity-log';

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  details: string;
  timestamp: string;
  ip_address?: string;
}

export interface DataStoreItem {
  id: string;
  key: string;
  name: string;
  category: 'Clinical' | 'Billing' | 'System' | 'Inventory' | 'Queue';
  description: string;
  count: number;
  sizeBytes: number;
  serverKey?: string;
  isProtected?: boolean;
}

export interface NewlyCreatedCredential {
  name: string;
  username: string;
  role: string;
  department: string;
  password: string;
  createdAt: string;
}

export interface ItNotify {
  setError: (msg: string) => void;
  setSuccess: (msg: string) => void;
}

export const ROLES: UserRole[] = [
  'IT Administrator',
  'OPD Clerk',
  'Cashier',
  'Doctor',
  'Lab Technician',
  'Pharmacist',
  'Nurse',
  'Accountant',
  'HR Manager',
  'Eye Clinic',
  'Administrator',
  'Laboratory Scientist',
  'Management'
];

export const DEPARTMENTS = [
  'IT',
  'OPD',
  'Finance',
  'Medical',
  'Laboratory',
  'Pharmacy',
  'Nursing',
  'Accounts',
  'HR',
  'Eye Clinic',
  'Administration'
];
