import { describe, test, expect } from 'bun:test';
import type { User } from '@/types';
import {
  createSessionController,
  memoryStorage,
} from '@/lib/routing/session';

function makeToken(payload: Record<string, unknown>): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'HS256' })}.${encode(payload)}.sig`;
}

const liveToken = () => makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
const deadToken = () => makeToken({ exp: Math.floor(Date.now() / 1000) - 3600 });

const nurse: User = {
  id: 'u-nurse',
  username: 'nurse1',
  name: 'Head Nurse',
  role: 'Nurse',
  department: 'Nursing',
  status: 'Active',
};

function socketSpy() {
  const calls = { reconnect: 0, close: 0 };
  return {
    calls,
    socket: {
      reconnect: () => {
        calls.reconnect += 1;
      },
      close: () => {
        calls.close += 1;
      },
    },
  };
}

describe('session login and logout mirrors src/auth/session', () => {
  test('valid login persists, lands on default desk, and reconnects once', () => {
    const storage = memoryStorage();
    const { calls, socket } = socketSpy();
    const controller = createSessionController({ storage, socket, initialPath: '/' });
    expect(controller.login(nurse, liveToken())).toBe(true);
    expect(controller.getSnapshot()).toMatchObject({
      status: 'authenticated',
      activeTab: 'admitted-patients',
    });
    expect(storage.get('zmc_token')?.split('.')).toHaveLength(3);
    expect(JSON.parse(storage.get('zmc_user') as string).username).toBe('nurse1');
    expect(calls.reconnect).toBe(1);
  });

  test('expired token login is rejected with nothing persisted', () => {
    const storage = memoryStorage();
    const { calls, socket } = socketSpy();
    const controller = createSessionController({ storage, socket, initialPath: '/' });
    expect(controller.login(nurse, deadToken())).toBe(false);
    expect(controller.getSnapshot().status).toBe('anonymous');
    expect(storage.get('zmc_token')).toBe(null);
    expect(calls.reconnect).toBe(0);
  });

  test('malformed token and malformed user are rejected', () => {
    const storage = memoryStorage();
    const controller = createSessionController({ storage, initialPath: '/' });
    expect(controller.login(nurse, 'garbage')).toBe(false);
    expect(
      controller.login({ ...nurse, username: 42 } as unknown as User, liveToken()),
    ).toBe(false);
    expect(controller.getSnapshot().status).toBe('anonymous');
  });

  test('logout clears storage, resets desk, and closes instead of reconnecting', () => {
    const storage = memoryStorage();
    const { calls, socket } = socketSpy();
    const controller = createSessionController({ storage, socket, initialPath: '/' });
    controller.login(nurse, liveToken());
    controller.logout();
    expect(controller.getSnapshot()).toMatchObject({
      status: 'anonymous',
      activeTab: 'dashboard',
    });
    expect(storage.get('zmc_user')).toBe(null);
    expect(storage.get('zmc_token')).toBe(null);
    expect(calls.close).toBe(1);
    expect(calls.reconnect).toBe(1);
  });
});
