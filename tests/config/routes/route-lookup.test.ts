import { describe, test, expect } from 'bun:test';
import {
  findRouteByTab,
  findRouteByPath,
  normalizePathname,
  listRouteEntries,
} from '../../../src/config/routes';

describe('route registry lookup mirrors src/config/routes', () => {
  test('every entry resolves by tab; shared desks resolve to first canonical tab', () => {
    const firstTabForPath = new Map<string, string>();
    for (const entry of listRouteEntries()) {
      expect(findRouteByTab(entry.tab)?.path).toBe(entry.path);
      if (!firstTabForPath.has(entry.path)) {
        firstTabForPath.set(entry.path, entry.tab);
      }
      expect(findRouteByPath(entry.path)?.tab).toBe(firstTabForPath.get(entry.path));
    }
  });

  test('triage has its own canonical path and legacy alias', () => {
    expect(findRouteByTab('triage')?.path).toBe('/nursing/triage');
    expect(findRouteByPath('/triage')).toMatchObject({
      tab: 'triage',
      redirectedFromAlias: true,
    });
  });

  test('consult and doctors share the doctors desk without tab collision', () => {
    expect(findRouteByTab('consult')?.path).toBe('/doctors');
    expect(findRouteByPath('/consult')).toMatchObject({
      tab: 'consult',
      redirectedFromAlias: true,
    });
    expect(findRouteByPath('/doctors')?.tab).toBe('consult');
  });

  test('laboratory technician legacy path resolves without clobbering lab home', () => {
    expect(findRouteByTab('lab-technicians')?.path).toBe('/lab/technicians');
    expect(findRouteByPath('/lab-technicians')).toMatchObject({
      tab: 'lab-technicians',
      redirectedFromAlias: true,
    });
    expect(findRouteByPath('/lab')?.tab).toBe('lab');
  });

  test('legacy nursing home resolves to admitted patients', () => {
    expect(findRouteByPath('/nursing')).toMatchObject({
      tab: 'admitted-patients',
      redirectedFromAlias: true,
    });
  });

  test('path normalization tolerates trailing slash, query, and hash', () => {
    expect(normalizePathname('/lab/')).toBe('/lab');
    expect(findRouteByPath('/lab/?token=abc')?.tab).toBe('lab');
    expect(findRouteByPath('/cashier#desk')?.tab).toBe('cashier');
  });

  test('unknown tab and path return undefined instead of defaulting', () => {
    expect(findRouteByTab('no-such-tab')).toBeUndefined();
    expect(findRouteByPath('/no-such-path')).toBeUndefined();
  });
});
