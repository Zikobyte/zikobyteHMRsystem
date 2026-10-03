import type { User } from '../types';

export type ViewKind =
  | 'dashboard'
  | 'opd'
  | 'nursing'
  | 'eye'
  | 'doctor'
  | 'lab'
  | 'pharmacy'
  | 'admin'
  | 'hr'
  | 'cashier'
  | 'patient-directory-import'
  | 'none';

export interface ViewPlan {
  kind: ViewKind;
  tab: string;
}

function isHrUser(user: User): boolean {
  return (
    user.role === 'HR Manager' ||
    user.department === 'Human Resources' ||
    user.department === 'HR'
  );
}

export function doctorSubTab(tab: string): 'standard' | 'specialized' | 'outpatients' {
  if (tab === 'standard-cards') return 'standard';
  if (tab === 'specialized-care') return 'specialized';
  return 'outpatients';
}

export function resolveViewPlan(tab: string, user: User): ViewPlan | null {
  const plan = (kind: ViewKind): ViewPlan => ({ kind, tab });

  if (tab === 'dashboard' || tab === 'overview') {
    return plan('dashboard');
  }
  if (tab === 'patients' || tab.startsWith('patients')) {
    return plan('opd');
  }
  if (
    tab === 'admitted-patients' ||
    tab === 'detained-patients' ||
    tab === 'nurse-dispensing' ||
    tab === 'injection-records' ||
    tab === 'nursing'
  ) {
    return plan('nursing');
  }
  if (tab === 'triage') {
    return plan('opd');
  }
  if (
    tab === 'eye-clinic' ||
    tab === 'registered-patients' ||
    tab === 'consultation' ||
    tab === 'all-records'
  ) {
    return plan('eye');
  }
  if (
    tab === 'consult' ||
    tab === 'doctors' ||
    tab === 'standard-cards' ||
    tab === 'specialized-care' ||
    tab === 'doctor-admitted'
  ) {
    return plan('doctor');
  }
  if (tab === 'lab' || tab === 'lab-technicians' || tab === 'lab-walkin') {
    return plan('lab');
  }
  if (
    tab === 'pharmacy' ||
    tab.startsWith('pharmacy') ||
    tab === 'pharmacists' ||
    tab === 'dispensing' ||
    tab === 'admitted' ||
    tab === 'stock'
  ) {
    return plan('pharmacy');
  }
  if (tab === 'procurement') {
    return plan('pharmacy');
  }
  if (tab === 'records' || tab === 'settings') {
    return plan('opd');
  }
  if (tab === 'patient-directory-import') {
    return plan('patient-directory-import');
  }
  if (tab === 'users' || tab === 'maintenance' || tab === 'activity-log' || tab === 'it') {
    return plan('admin');
  }
  if (
    tab.startsWith('hr-') ||
    tab === 'employees' ||
    tab === 'absences' ||
    tab === 'recruitment' ||
    (isHrUser(user) && (tab === 'procurement' || tab === 'discounts'))
  ) {
    return plan('hr');
  }
  if (
    tab === 'cashier' ||
    tab.startsWith('cashier') ||
    tab === 'outstanding' ||
    (tab === 'discounts' && !isHrUser(user))
  ) {
    return plan('cashier');
  }
  return null;
}
