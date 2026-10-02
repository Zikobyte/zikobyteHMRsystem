import { describe, test, expect } from 'bun:test';
import type { User } from '../../../src/types';
import {
  getAllowedTabs,
  isTabAllowed,
  getDefaultTab,
  resolveInitialTab,
} from '../../../src/config/routes';

const baseUser: User = {
  id: 'u-1',
  username: 'tester',
  name: 'Test User',
  role: 'Nurse',
  department: 'Nursing',
  status: 'Active',
};

const user = (overrides: Partial<User>): User => ({ ...baseUser, ...overrides });

describe('route registry policy mirrors src/config/routes', () => {
  test('nurse sees nursing desks but not admin desks', () => {
    const nurse = user({ role: 'Nurse', department: 'Nursing' });
    expect(isTabAllowed(nurse, 'admitted-patients')).toBe(true);
    expect(isTabAllowed(nurse, 'users')).toBe(false);
    expect(getAllowedTabs(nurse).has('admitted-patients')).toBe(true);
    expect(getAllowedTabs(nurse).has('users')).toBe(false);
  });

  test('information technology sees admin desks', () => {
    const it = user({ role: 'IT Administrator', department: 'IT', username: 'admin' });
    expect(isTabAllowed(it, 'users')).toBe(true);
    expect(isTabAllowed(it, 'maintenance')).toBe(true);
  });

  test('unknown tab is never allowed', () => {
    expect(isTabAllowed(user({}), 'no-such-tab')).toBe(false);
  });

  test('default desk matches role landing matrix', () => {
    expect(getDefaultTab(user({ role: 'Laboratory Scientist', department: 'Laboratory' }))).toBe(
      'lab',
    );
    expect(getDefaultTab(user({ role: 'Doctor', department: 'Medical' }))).toBe('consult');
    expect(getDefaultTab(user({ role: 'Doctor', department: 'Eye Clinic' }))).toBe(
      'registered-patients',
    );
    expect(getDefaultTab(user({ role: 'Cashier', department: 'Finance' }))).toBe('cashier');
    expect(getDefaultTab(user({ role: 'Pharmacist', department: 'Pharmacy' }))).toBe('pharmacy');
    expect(getDefaultTab(user({ role: 'Nurse', department: 'Nursing' }))).toBe('admitted-patients');
    expect(getDefaultTab(user({ role: 'OPD Clerk', department: 'OPD' }))).toBe('dashboard');
    expect(getDefaultTab(user({ role: 'HR Manager', department: 'Human Resources' }))).toBe(
      'hr-dashboard',
    );
    expect(getDefaultTab(user({ role: 'Eye Clinic', department: 'Eye Clinic' }))).toBe(
      'registered-patients',
    );
    expect(
      getDefaultTab(user({ role: 'IT Administrator', department: 'IT', username: 'admin' })),
    ).toBe('users');
  });

  test('initial tab resolves path then falls back to default desk when denied', () => {
    const nurse = user({ role: 'Nurse', department: 'Nursing' });
    expect(resolveInitialTab('/nursing/admitted', nurse)).toBe('admitted-patients');
    expect(resolveInitialTab('/users', nurse)).toBe('admitted-patients');
    expect(resolveInitialTab('/no-such-path', nurse)).toBe('dashboard');
    expect(resolveInitialTab('/no-such-path', null)).toBe('dashboard');
    expect(resolveInitialTab('/lab/?token=abc', null)).toBe('lab');
  });
});
