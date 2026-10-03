import { describe, test, expect } from 'bun:test';
import { readFile } from 'node:fs/promises';

const pharmacyViewUrl = new URL('../../src/components/PharmacyView.tsx', import.meta.url);

async function readSource(): Promise<string> {
  return await readFile(pharmacyViewUrl, 'utf8');
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
    dispatchEvent: () => true,
    history: { pushState: () => undefined },
  };
}

async function loadHelpers() {
  stubBrowserGlobals();
  const mod = await import('../../src/components/PharmacyView');
  return mod as typeof import('../../src/components/PharmacyView');
}

describe('pharmacy procurement submit (honest failure)', () => {
  test('payload builder preserves POST /hr/procurements contract', async () => {
    const mod = await loadHelpers();
    expect(typeof mod.buildProcurementPayload).toBe('function');
    expect(typeof mod.buildProcurementItems).toBe('function');
    expect(typeof mod.partitionProcurementResults).toBe('function');
    expect(typeof mod.getProcurementValidationError).toBe('function');

    const payload = mod.buildProcurementPayload(
      { name: 'CEFTRIAXONE 1g', quantity: 4, unitPrice: 18000, totalPrice: 72000 },
      'Pharmacy Desk',
    );
    expect(payload).toMatchObject({
      item_name: 'CEFTRIAXONE 1g',
      quantity: 4,
      unit_price: 18000,
      amount: 72000,
      department: 'Pharmacy',
      requested_by: 'Pharmacy Desk',
      status: 'Pending',
      category: 'Pharmacy Procurement',
    });

    const fallback = mod.buildProcurementPayload(
      { name: 'Paracetamol', quantity: 10, unitPrice: 100, totalPrice: 1000 },
      '',
    );
    expect(fallback.requested_by).toBe('Pharmacy Desk');
  });

  test('row builder trims, defaults, and skips blank names', async () => {
    const mod = await loadHelpers();
    const items = mod.buildProcurementItems([
      { id: '1', name: '  CEFTRIAXONE 1g  ', quantity: '4', unitPrice: '18000' },
      { id: '2', name: '   ', quantity: '5', unitPrice: '100' },
      { id: '3', name: 'Paracetamol', quantity: '', unitPrice: '' },
    ]);
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ name: 'CEFTRIAXONE 1g', quantity: 4, unitPrice: 18000, totalPrice: 72000 });
    expect(items[1]).toMatchObject({ name: 'Paracetamol', quantity: 1, unitPrice: 0, totalPrice: 0 });
  });

  test('all-success partitions to the success path (no error)', async () => {
    const mod = await loadHelpers();
    const items = mod.buildProcurementItems([
      { id: '1', name: 'Drug A', quantity: '2', unitPrice: '500' },
      { id: '2', name: 'Drug B', quantity: '1', unitPrice: '1000' },
    ]);
    const results: PromiseSettledResult<unknown>[] = [
      { status: 'fulfilled', value: { success: true } },
      { status: 'fulfilled', value: { success: true } },
    ];
    const out = mod.partitionProcurementResults(items, results);
    expect(out.failed).toHaveLength(0);
    expect(out.succeeded).toHaveLength(2);
    expect(out.errorMessage).toBe(null);
    expect(mod.getProcurementValidationError(items)).toBe(null);
  });

  test('partial failure names failed items and excludes them from the success list', async () => {
    const mod = await loadHelpers();
    const items = mod.buildProcurementItems([
      { id: '1', name: 'Drug A', quantity: '2', unitPrice: '500' },
      { id: '2', name: 'Drug B', quantity: '1', unitPrice: '1000' },
      { id: '3', name: 'Drug C', quantity: '3', unitPrice: '200' },
    ]);
    const results: PromiseSettledResult<unknown>[] = [
      { status: 'fulfilled', value: { success: true } },
      { status: 'rejected', reason: new Error('HTTP error 500') },
      { status: 'rejected', reason: new Error('Network failure') },
    ];
    const out = mod.partitionProcurementResults(items, results);
    expect(out.succeeded).toHaveLength(1);
    expect(out.failed).toHaveLength(2);
    expect(out.succeeded[0].name).toBe('Drug A');
    expect(out.failed[0].name).toBe('Drug B');
    expect(out.failed[1].name).toBe('Drug C');
    // Success list excludes the failed items.
    expect(out.succeeded.map((i) => i.name).includes('Drug B')).toBe(false);
    expect(out.succeeded.map((i) => i.name).includes('Drug C')).toBe(false);
    // Error banner names the failed items.
    expect(out.errorMessage === null).toBe(false);
    expect((out.errorMessage as string).includes('Drug B')).toBe(true);
    expect((out.errorMessage as string).includes('Drug C')).toBe(true);
  });

  test('empty rows produce the validation message', async () => {
    const mod = await loadHelpers();
    const items = mod.buildProcurementItems([
      { id: '1', name: '', quantity: '', unitPrice: '' },
      { id: '2', name: '   ', quantity: '2', unitPrice: '100' },
    ]);
    expect(items).toHaveLength(0);
    const err = mod.getProcurementValidationError(items);
    expect(err === null).toBe(false);
    expect((err as string).includes('at least one medication item')).toBe(true);
    expect(mod.EMPTY_PROCUREMENT_MESSAGE.includes('at least one medication item')).toBe(true);
  });

  test('submit handler is honest: failure sets inline error without card or success', async () => {
    const src = await readSource();
    // Per-item POST structure is preserved with the same endpoint.
    expect(src.includes("Promise.allSettled(validItems.map(item => apiFetch('/hr/procurements'")).toBe(true);
    expect(src.includes('buildProcurementPayload(item, requestedBy')).toBe(true);
    expect(src.includes('partitionProcurementResults(validItems, results)')).toBe(true);
    // Failure path surfaces an inline error and returns before the local card / success text.
    const handlerStart = src.indexOf('const handleSubmitProcurement');
    expect(handlerStart > -1).toBe(true);
    const handlerEnd = src.indexOf('// Handler: Stock Log Submit', handlerStart);
    expect(handlerEnd > handlerStart).toBe(true);
    const handler = src.slice(handlerStart, handlerEnd);
    expect(handler.includes('setProcurementError')).toBe(true);
    expect(handler.includes('setProcurementError(errorMessage')).toBe(true);
    // The old catch-and-continue (console.error then unconditional card insert) is gone.
    expect(handler.includes('console.error')).toBe(false);
    // No success/card code runs on the failure path: every setProcurementRequests /
    // setProcurementSuccess in the handler is dominated by the early failure return.
    const failReturn = handler.indexOf('if (failed.length > 0)');
    expect(failReturn > -1).toBe(true);
    const afterFail = handler.slice(failReturn);
    expect(afterFail.includes('return;')).toBe(true);
    expect(afterFail.includes('setProcurementRequests')).toBe(true);
    expect(afterFail.includes('setProcurementSuccess')).toBe(true);
    // Payload contract unchanged.
    expect(handler.includes("apiFetch('/hr/procurements'")).toBe(true);
    expect(handler.includes("method: 'POST'")).toBe(true);
    expect(src.includes('category:')).toBe(true);
    // Inline error banner exists with dismiss affordance.
    expect(src.includes('role="alert"')).toBe(true);
    expect(src.includes('{procurementError && (')).toBe(true);
  });
});
