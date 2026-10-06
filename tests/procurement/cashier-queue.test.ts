import { describe, test, expect } from 'bun:test';
import { readFile } from 'node:fs/promises';

const cashierHookUrl = new URL('../../src/frontend/views/cashier/_hooks/useCashierData.ts', import.meta.url);
const cashierShellUrl = new URL('../../src/frontend/views/cashier/CashierView.tsx', import.meta.url);
const dashboardSidebarUrl = new URL('../../src/frontend/components/shared/dashboard/DashboardSidebar.tsx', import.meta.url);

async function readSource(url: URL): Promise<string> {
  return await readFile(url, 'utf8');
}

function stubBrowserGlobals(): void {
  const store = new Map<string, string>();
  (globalThis as Record<string, unknown>).localStorage = {
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
  (globalThis as Record<string, unknown>).window = {
    location: { hostname: 'localhost', origin: 'http://localhost:3000', pathname: '/' },
    atob: (value: string) => Buffer.from(value, 'base64').toString('binary'),
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    history: { pushState: () => undefined },
  };
}

describe('cashier procurement queue (read-only)', () => {
  test('procurement-queue tab key is registered in CashierView', async () => {
    const hook = await readSource(cashierHookUrl);
    const shell = await readSource(cashierShellUrl);
    expect(hook.includes('| "procurement-queue"')).toBe(true);
    expect(hook.includes('propActiveTab === "cashier-procurement-queue"')).toBe(true);
    expect(hook.includes('propActiveTab === "procurement-queue"')).toBe(true);
    expect(hook.includes('setActiveTab("procurement-queue")')).toBe(true);
    expect(shell.includes('activeTab === "procurement-queue"') || hook.includes('activeTab === "procurement-queue"')).toBe(true);
  });

  test('cashier menu group gains exactly one procurement queue entry; other departments untouched', async () => {
    const src = await readSource(dashboardSidebarUrl);
    const occurrences = src.split('"cashier-procurement-queue"').length - 1;
    expect(occurrences).toBe(1);
    expect(src.includes('label: "Procurement Queue"')).toBe(true);
    // Pre-existing pharmacy procurement entry is preserved.
    expect(src.includes('id: "procurement"')).toBe(true);
    // The new cashier key must not leak into the pharmacy menu group block.
    const pharmacyBlockStart = src.indexOf('const pharmacyMenuGroups');
    const groupsEnd = src.indexOf('const effectiveMenuGroups');
    expect(pharmacyBlockStart > -1).toBe(true);
    expect(groupsEnd > pharmacyBlockStart).toBe(true);
    const pharmacyBlock = src.slice(pharmacyBlockStart, groupsEnd);
    expect(pharmacyBlock.includes('cashier-procurement-queue')).toBe(false);
    expect(pharmacyBlock.includes('id: "procurement"')).toBe(true);
  });

  test('row mapping mirrors the GET /hr/procurements payload', async () => {
    stubBrowserGlobals();
    const cashier = await import('@/views/cashier/_utils/cashier-mapper');
    const map = cashier.mapCashierProcurementQueueRow as (raw: unknown) => {
      id: string;
      item: string;
      quantity: number;
      amount: number;
      status: string;
      requestedBy: string;
    };
    expect(typeof map).toBe('function');

    const row = map({
      id: 'proc-1',
      items: 'Surgical Gloves (Box)',
      item_name: 'Surgical Gloves',
      quantity: 50,
      unit_price: 1200,
      amount: 60000,
      status: 'Ordered',
      department: 'Pharmacy',
      supplier_name: 'MedSupply Ltd',
      requested_by: 'Pharmacist Ada',
      category: 'Medical Supplies',
    });
    expect(row.item).toBe('Surgical Gloves (Box)');
    expect(row.quantity).toBe(50);
    expect(row.amount).toBe(60000);
    expect(row.status).toBe('Ordered');
    expect(row.requestedBy).toBe('Pharmacist Ada');

    const fallback = map({
      id: 'proc-2',
      item_name: 'Syringes 5ml',
      quantity: '10',
      amount: '5000',
      status: '',
      requested_by: '',
    });
    expect(fallback.item).toBe('Syringes 5ml');
    expect(fallback.quantity).toBe(10);
    expect(fallback.amount).toBe(5000);
    expect(fallback.status).toBe('Pending');
    expect(fallback.requestedBy).toBe('Not recorded');
  });

  test('new code path performs no mutations', async () => {
    const hook = await readSource(cashierHookUrl);
    const tab = await readSource(
      new URL('../../src/frontend/views/cashier/_tabs/ProcurementQueueTab.tsx', import.meta.url),
    );
    const fetchStart = hook.indexOf('// Read-only procurement queue for cashiers');
    expect(fetchStart > -1).toBe(true);
    const fetchEnd = hook.indexOf('}, [activeTab]);', fetchStart);
    expect(fetchEnd > fetchStart).toBe(true);
    const scope = `${hook.slice(fetchStart, fetchEnd)}\n${tab}`;

    // The queue loads through a single GET with no request body overrides.
    expect(scope.includes('apiFetch("/hr/procurements")')).toBe(true);
    for (const method of [
      "method: 'POST'",
      'method: "POST"',
      "method: 'PATCH'",
      'method: "PATCH"',
      "method: 'PUT'",
      'method: "PUT"',
      "method: 'DELETE'",
      'method: "DELETE"',
    ]) {
      expect(scope.includes(method)).toBe(false);
    }
    // No mutation affordances in the read-only block.
    expect(scope.includes('Approve')).toBe(false);
    expect(scope.includes('Delete')).toBe(false);
    expect(scope.includes('handleApprove')).toBe(false);
  });
});
