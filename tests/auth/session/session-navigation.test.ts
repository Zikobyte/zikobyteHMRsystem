import { createSessionController, memoryStorage } from '@/lib/routing/session';
import { User } from '@/types';
import { describe, test, expect } from 'bun:test';

function makeToken(payload: Record<string, unknown>): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'HS256' })}.${encode(payload)}.sig`;
}

const nurse: User = {
  id: 'u-nurse',
  username: 'nurse1',
  name: 'Head Nurse',
  role: 'Nurse',
  department: 'Nursing',
  status: 'Active',
};

describe('session navigation mirrors src/auth/session', () => {
  test('allowed tab navigates without redirect', () => {
    const storage = memoryStorage();
    const controller = createSessionController({ storage, initialPath: '/' });
    controller.login(nurse, makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 }));
    controller.navigate('detained-patients');
    expect(controller.getSnapshot().activeTab).toBe('detained-patients');
  });

  test('denied tab redirects to role default desk', () => {
    const storage = memoryStorage();
    const controller = createSessionController({ storage, initialPath: '/' });
    controller.login(nurse, makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 }));
    controller.navigate('users');
    expect(controller.getSnapshot().activeTab).toBe('admitted-patients');
  });

  test('unknown tab redirects to role default desk for signed-in users', () => {
    const storage = memoryStorage();
    const controller = createSessionController({ storage, initialPath: '/' });
    controller.login(nurse, makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 }));
    controller.navigate('no-such-tab');
    expect(controller.getSnapshot().activeTab).toBe('admitted-patients');
  });

  test('anonymous navigation sets tab without guard, matching root behavior', () => {
    const controller = createSessionController({ storage: memoryStorage(), initialPath: '/' });
    controller.navigate('dashboard');
    expect(controller.getSnapshot().activeTab).toBe('dashboard');
  });

  test('subscribers are notified on navigation', () => {
    const storage = memoryStorage();
    const controller = createSessionController({ storage, initialPath: '/' });
    controller.login(nurse, makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 }));
    let notifications = 0;
    const unsubscribe = controller.subscribe(() => {
      notifications += 1;
    });
    controller.navigate('detained-patients');
    expect(notifications).toBe(1);
    unsubscribe();
    controller.navigate('admitted-patients');
    expect(notifications).toBe(1);
  });
});
