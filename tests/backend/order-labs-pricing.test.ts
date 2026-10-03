import { describe, test, expect } from 'bun:test';
import { resolveLabTestPrice } from '../../src/backend/catalogue/lab-catalogue';

describe('order-labs pricing resolution mirrors catalogue lookup', () => {
  test('known code bills the exact catalogue price with catalogue name', () => {
    expect(resolveLabTestPrice({ code: 'WIDAL' })).toMatchObject({
      code: 'WIDAL',
      price: 5000,
    });
    expect(resolveLabTestPrice({ code: 'HORMONAL' })?.price).toBe(90000);
    expect(resolveLabTestPrice({ code: 'LFT_STD' })?.price).toBe(12000);
  });

  test('legacy display names resolve for transition-period clients', () => {
    expect(resolveLabTestPrice({ name: 'Widal Test' })?.code).toBe('WIDAL');
    expect(resolveLabTestPrice({ name: 'Malaria Parasite (MP)' })).toMatchObject({
      code: 'MP_STD',
      price: 3000,
    });
  });

  test('explicit code wins over name when both are sent', () => {
    expect(resolveLabTestPrice({ code: 'HB', name: 'Widal Test' })).toMatchObject({
      code: 'HB',
      price: 3000,
    });
  });

  test('code lookup is case-insensitive', () => {
    expect(resolveLabTestPrice({ code: 'widal' })?.price).toBe(5000);
  });

  test('unknown code and unknown name resolve to null for review queueing', () => {
    expect(resolveLabTestPrice({ code: 'NOPE' })).toBe(null);
    expect(resolveLabTestPrice({ name: 'Not A Real Test' })).toBe(null);
    expect(resolveLabTestPrice({})).toBe(null);
  });

  test('resolved entries carry their catalogue category', () => {
    expect(resolveLabTestPrice({ code: 'FBC' })?.category).toBe('Hematology');
    expect(resolveLabTestPrice({ code: 'CULTURE_SENS' })?.category).toBe('Microbiology');
  });
});
