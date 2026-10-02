import { describe, test, expect } from 'bun:test';
import type { User } from '../../../src/types';
import {
  createSessionController,
  isTokenExpiredValue,
  memoryStorage,
  readStoredSession,
} from '../../../src/auth/session';

function makeToken(payload: Record<string, unknown>): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'HS256' })}.${encode(payload)}.sig`;
}

const futureToken = () => makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
const pastToken = () => makeToken({ exp: Math.floor(Date.now() / 1000) - 3600 });

const nurse: User = {
  id: 'u-nurse',
  username: 'nurse1',
  name: 'Head Nurse',
  role: 'Nurse',
  department: 'Nursing',
  status: 'Active',
};

describe('session boot mirrors src/auth/session', () => {
  test('token expiry helper accepts live tokens and rejects the rest', () => {
    expect(isTokenExpiredValue(futureToken())).toBe(false);
    expect(isTokenExpiredValue(pastToken())).toBe(true);
    expect(isTokenExpiredValue('not-a-token')).toBe(true);
    expect(isTokenExpiredValue(makeToken({ noExp: true }))).toBe(false);
  });

  test('valid stored session restores authenticated state and resolves path', () => {
    const storage = memoryStorage();
    storage.set('zmc_user', JSON.stringify(nurse));
    storage.set('zmc_token', futureToken());
    const controller = createSessionController({ storage, initialPath: '/nursing/admitted' });
    expect(controller.getSnapshot()).toMatchObject({
      status: 'authenticated',
      activeTab: 'admitted-patients',
    });
    expect(controller.getSnapshot().user?.username).toBe('nurse1');
  });

  test('expired stored token is cleared and boots anonymous', () => {
    const storage = memoryStorage();
    storage.set('zmc_user', JSON.stringify(nurse));
    storage.set('zmc_token', pastToken());
    const controller = createSessionController({ storage, initialPath: '/nursing/admitted' });
    expect(controller.getSnapshot().status).toBe('anonymous');
    expect(storage.get('zmc_user')).toBe(null);
    expect(storage.get('zmc_token')).toBe(null);
  });

  test('malformed stored user is cleared and boots anonymous', () => {
    const storage = memoryStorage();
    storage.set('zmc_user', '{broken-json');
    storage.set('zmc_token', futureToken());
    const { user } = readStoredSession(storage);
    expect(user).toBe(null);
    expect(storage.get('zmc_user')).toBe(null);
  });

  test('empty storage boots anonymous on dashboard', () => {
    const controller = createSessionController({ storage: memoryStorage(), initialPath: '/' });
    expect(controller.getSnapshot()).toMatchObject({
      status: 'anonymous',
      activeTab: 'dashboard',
    });
  });

  test('denied initial path falls back to role default desk', () => {
    const storage = memoryStorage();
    storage.set('zmc_user', JSON.stringify(nurse));
    storage.set('zmc_token', futureToken());
    const controller = createSessionController({ storage, initialPath: '/users' });
    expect(controller.getSnapshot().activeTab).toBe('admitted-patients');
  });
});
