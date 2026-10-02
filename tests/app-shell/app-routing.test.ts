import { describe, test, expect } from 'bun:test';
import type { User } from '../../src/types';
import { findRouteByPath } from '../../src/config/routes';
import { createSessionController, memoryStorage } from '../../src/auth/session';

function makeToken(expInSeconds: number): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'HS256' })}.${encode({
    exp: Math.floor(Date.now() / 1000) + expInSeconds,
  })}.sig`;
}

const nurse: User = {
  id: 'u-nurse',
  username: 'nurse1',
  name: 'Head Nurse',
  role: 'Nurse',
  department: 'Nursing',
  status: 'Active',
};

const itAdmin: User = {
  id: 'u-admin',
  username: 'admin',
  name: 'IT Administrator',
  role: 'IT Administrator',
  department: 'IT',
  status: 'Active',
};

function goToPath(controller: ReturnType<typeof createSessionController>, path: string): void {
  const match = findRouteByPath(path);
  controller.navigate(match ? match.tab : 'dashboard');
}

describe('app shell dry run mirrors registry plus session integration', () => {
  test('stored nurse refresh keeps the same desk', () => {
    const storage = memoryStorage();
    storage.set('zmc_user', JSON.stringify(nurse));
    storage.set('zmc_token', makeToken(3600));
    const first = createSessionController({ storage, initialPath: '/nursing/admitted' });
    expect(first.getSnapshot().activeTab).toBe('admitted-patients');
    const refresh = createSessionController({ storage, initialPath: '/nursing/admitted' });
    expect(refresh.getSnapshot().activeTab).toBe(first.getSnapshot().activeTab);
  });

  test('forward then back navigation lands on the right desks', () => {
    const storage = memoryStorage();
    const controller = createSessionController({ storage, initialPath: '/' });
    controller.login(nurse, makeToken(3600));
    goToPath(controller, '/nursing/detained');
    expect(controller.getSnapshot().activeTab).toBe('detained-patients');
    goToPath(controller, '/nursing/admitted');
    expect(controller.getSnapshot().activeTab).toBe('admitted-patients');
  });

  test('legacy alias path resolves through redirect flag to the same desk', () => {
    const match = findRouteByPath('/nursing');
    expect(match?.tab).toBe('admitted-patients');
    expect(match?.redirectedFromAlias).toBe(true);
    const storage = memoryStorage();
    const controller = createSessionController({ storage, initialPath: '/' });
    controller.login(nurse, makeToken(3600));
    if (match) controller.navigate(match.tab);
    expect(controller.getSnapshot().activeTab).toBe('admitted-patients');
  });

  test('information technology login lands on users desk', () => {
    const controller = createSessionController({
      storage: memoryStorage(),
      initialPath: '/',
    });
    controller.login(itAdmin, makeToken(3600));
    expect(controller.getSnapshot().activeTab).toBe('users');
    controller.navigate('maintenance');
    expect(controller.getSnapshot().activeTab).toBe('maintenance');
  });

  test('denied deep link falls back to role default desk', () => {
    const storage = memoryStorage();
    storage.set('zmc_user', JSON.stringify(nurse));
    storage.set('zmc_token', makeToken(3600));
    const controller = createSessionController({ storage, initialPath: '/users' });
    expect(controller.getSnapshot().activeTab).toBe('admitted-patients');
  });

  test('full journey from anonymous to login to logout ends clean', () => {
    const storage = memoryStorage();
    const controller = createSessionController({ storage, initialPath: '/no-such-path' });
    expect(controller.getSnapshot()).toMatchObject({
      status: 'anonymous',
      activeTab: 'dashboard',
    });
    controller.login(nurse, makeToken(3600));
    expect(controller.getSnapshot().status).toBe('authenticated');
    controller.navigate('nurse-dispensing');
    expect(controller.getSnapshot().activeTab).toBe('nurse-dispensing');
    controller.logout();
    expect(controller.getSnapshot()).toMatchObject({
      status: 'anonymous',
      activeTab: 'dashboard',
    });
    expect(storage.get('zmc_user')).toBe(null);
    expect(storage.get('zmc_token')).toBe(null);
  });
});
