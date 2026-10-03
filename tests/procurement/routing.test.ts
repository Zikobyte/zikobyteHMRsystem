import { describe, test, expect } from 'bun:test';
import type { User } from '@/types';
import { getAllowedNavigationIds, isNavigationAllowed } from '@/lib/routing/navigation';
import {
  findRouteByPath,
  findRouteByTab,
  isTabAllowed,
  resolveInitialTab,
} from '@/lib/routing/routes';
import { resolveViewPlan } from '@/lib/routing/view-plan';
import { createSessionController, memoryStorage } from '@/lib/routing/session';

const cashier: User = {
  id: 'u-cashier',
  username: 'cashier1',
  name: 'Desk Cashier',
  role: 'Cashier',
  department: 'Cashier',
  status: 'Active',
};

describe('cashier procurement queue routing', () => {
  test('allow-list contains the key for a cashier user', () => {
    expect(getAllowedNavigationIds(cashier).has('cashier-procurement-queue')).toBe(true);
    expect(isNavigationAllowed(cashier, 'cashier-procurement-queue')).toBe(true);
    expect(isTabAllowed(cashier, 'cashier-procurement-queue')).toBe(true);
  });

  test('canonical path resolves without redirect flag confusion', () => {
    expect(findRouteByTab('cashier-procurement-queue')?.path).toBe(
      '/cashier/procurement-queue',
    );
    expect(findRouteByPath('/cashier/procurement-queue')).toMatchObject({
      tab: 'cashier-procurement-queue',
      redirectedFromAlias: false,
    });
    // Guard keeps the tab instead of falling back to billing.
    expect(resolveInitialTab('/cashier/procurement-queue', cashier)).toBe(
      'cashier-procurement-queue',
    );
    const controller = createSessionController({ storage: memoryStorage(), initialPath: '/' });
    controller.login(cashier, makeToken());
    controller.navigate('cashier-procurement-queue');
    expect(controller.getSnapshot().activeTab).toBe('cashier-procurement-queue');
  });

  test('view plan resolves the tab to the cashier desk', () => {
    expect(resolveViewPlan('cashier-procurement-queue', cashier)).toMatchObject({
      kind: 'cashier',
      tab: 'cashier-procurement-queue',
    });
  });
});

function makeToken(): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'HS256' })}.${encode({
    exp: Math.floor(Date.now() / 1000) + 3600,
  })}.sig`;
}
