import { describe, test, expect } from 'bun:test';
import type { User } from '@/types';
import { doctorSubTab, resolveViewPlan } from '@/lib/routing/view-plan';

const baseUser: User = {
  id: 'u-1',
  username: 'tester',
  name: 'Test User',
  role: 'Doctor',
  department: 'Medical',
  status: 'Active',
};

const user = (overrides: Partial<User>): User => ({ ...baseUser, ...overrides });
const hrUser = () =>
  user({ role: 'HR Manager', department: 'Human Resources', username: 'hr.manager' });

describe('view plan mirrors src/app-shell/view-plan', () => {
  test('dashboard and overview resolve to dashboard desk', () => {
    expect(resolveViewPlan('dashboard', user({}))?.kind).toBe('dashboard');
    expect(resolveViewPlan('overview', user({}))?.kind).toBe('dashboard');
  });

  test('outpatient, triage, records, and settings resolve to outpatient desk', () => {
    for (const tab of ['patients', 'patients-reception', 'triage', 'records', 'settings']) {
      expect(resolveViewPlan(tab, user({}))?.kind).toBe('opd');
    }
  });

  test('nursing family resolves to nursing desk', () => {
    for (const tab of [
      'admitted-patients',
      'detained-patients',
      'nurse-dispensing',
      'injection-records',
      'nursing',
    ]) {
      expect(resolveViewPlan(tab, user({}))?.kind).toBe('nursing');
    }
  });

  test('eye family resolves to eye desk', () => {
    for (const tab of ['eye-clinic', 'registered-patients', 'consultation', 'all-records']) {
      expect(resolveViewPlan(tab, user({}))?.kind).toBe('eye');
    }
  });

  test('doctor family resolves to doctor desk with sub-tab mapping', () => {
    for (const tab of [
      'consult',
      'doctors',
      'standard-cards',
      'specialized-care',
      'doctor-admitted',
    ]) {
      expect(resolveViewPlan(tab, user({}))?.kind).toBe('doctor');
    }
    expect(doctorSubTab('standard-cards')).toBe('standard');
    expect(doctorSubTab('specialized-care')).toBe('specialized');
    expect(doctorSubTab('consult')).toBe('outpatients');
    expect(doctorSubTab('doctor-admitted')).toBe('outpatients');
  });

  test('laboratory family resolves to laboratory desk', () => {
    for (const tab of ['lab', 'lab-technicians', 'lab-walkin']) {
      expect(resolveViewPlan(tab, user({}))?.kind).toBe('lab');
    }
  });

  test('pharmacy family and procurement resolve to pharmacy desk', () => {
    for (const tab of [
      'pharmacy',
      'pharmacists',
      'procurement',
      'dispensing',
      'admitted',
      'stock',
      'pharmacy-stock',
    ]) {
      expect(resolveViewPlan(tab, user({}))?.kind).toBe('pharmacy');
    }
  });

  test('admin family and directory import resolve correctly', () => {
    for (const tab of ['users', 'maintenance', 'activity-log', 'it']) {
      expect(resolveViewPlan(tab, user({}))?.kind).toBe('admin');
    }
    expect(resolveViewPlan('patient-directory-import', user({}))?.kind).toBe(
      'patient-directory-import',
    );
  });

  test('human resources owns discounts; procurement stays on pharmacy desk per root order', () => {
    expect(resolveViewPlan('hr-dashboard', hrUser())?.kind).toBe('hr');
    expect(resolveViewPlan('employees', hrUser())?.kind).toBe('hr');
    expect(resolveViewPlan('discounts', hrUser())?.kind).toBe('hr');
    expect(resolveViewPlan('procurement', hrUser())?.kind).toBe('pharmacy');
  });

  test('cashier owns billing desks and discounts for non-human-resources users', () => {
    const cashier = user({ role: 'Cashier', department: 'Finance' });
    for (const tab of ['cashier', 'cashier-outstanding', 'outstanding', 'discounts']) {
      expect(resolveViewPlan(tab, cashier)?.kind).toBe('cashier');
    }
  });

  test('unknown tab resolves to null and renders nothing', () => {
    expect(resolveViewPlan('no-such-tab', user({}))).toBe(null);
  });
});
