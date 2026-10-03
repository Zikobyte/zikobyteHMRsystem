import { describe, test, expect } from 'bun:test';
import { planLabBackfill } from '../../src/backend/catalogue/backfill';

describe('lab backfill planner is exact and idempotent', () => {
  test('mismatched rows produce updates, correct rows are skipped', () => {
    const plan = planLabBackfill([
      { id: 'o-1', test_name: 'Widal Test', test_code: null, price: 7000 },
      { id: 'o-2', test_name: 'Widal Test', test_code: 'WIDAL', price: 5000 },
      { id: 'o-3', test_name: 'MP – Malaria Parasite (Standard)', test_code: null, price: 3000 },
    ]);
    expect(plan.updates).toMatchObject([
      { id: 'o-1', code: 'WIDAL', price: 5000 },
      { id: 'o-3', code: 'MP_STD', price: 3000 },
    ]);
    expect(plan.alreadyCorrect).toBe(1);
    expect(plan.unmatched.length).toBe(0);
  });

  test('stored test codes resolve even when names drift', () => {
    const plan = planLabBackfill([
      { id: 'o-4', test_name: 'Some Renamed Label', test_code: 'FBC', price: 0 },
    ]);
    expect(plan.updates).toMatchObject([{ id: 'o-4', code: 'FBC', price: 7000 }]);
  });

  test('unmatchable names land in the unmatched list, never in updates', () => {
    const plan = planLabBackfill([
      { id: 'o-5', test_name: 'Mystery Panel X', test_code: null, price: 3000 },
      { id: 'o-6', test_name: null, test_code: null, price: 3000 },
    ]);
    expect(plan.updates.length).toBe(0);
    expect(plan.unmatched.map((u) => u.id)).toMatchObject(['o-5', 'o-6']);
  });

  test('applying the plan twice leaves nothing to do', () => {
    const rows = [
      { id: 'o-7', test_name: 'Widal Test', test_code: null, price: 7000 },
      { id: 'o-8', test_name: 'Mystery Panel X', test_code: null, price: 3000 },
    ];
    const first = planLabBackfill(rows);
    expect(first.updates.length).toBe(1);
    const applied = rows.map((row) => {
      const update = first.updates.find((u) => u.id === row.id);
      return update
        ? { ...row, test_code: update.code, price: update.price }
        : row;
    });
    const second = planLabBackfill(applied);
    expect(second.updates.length).toBe(0);
    expect(second.alreadyCorrect).toBe(1);
    expect(second.unmatched.length).toBe(1);
  });

  test('null and non-numeric stored prices are treated as needing correction', () => {
    const plan = planLabBackfill([
      { id: 'o-9', test_name: 'Widal Test', test_code: null, price: null },
    ]);
    expect(plan.updates).toMatchObject([{ id: 'o-9', code: 'WIDAL', price: 5000 }]);
  });
});
