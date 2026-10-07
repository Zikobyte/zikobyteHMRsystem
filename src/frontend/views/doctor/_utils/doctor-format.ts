/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx.
 *
 * Pure formatting helpers: formatVital (vitals display without stray
 * minus/dash values) and matchesDateFilter (admitted-record date filter).
 * No component state, no API calls.
 */

// Utility function to format vitals cleanly without showing minus signs on empty/dash values
export function formatVital(value: unknown, unit: string = ''): string {
  if (value === null || value === undefined) return '—';
  const str = String(value).trim();
  if (str === '' || str === '—' || str === '-' || str === '-/-' || str === '--') return '—';
  return unit ? `${str} ${unit}` : str;
}

// Date filter matcher helper
export function matchesDateFilter(timestampStr: string, filterDateStr: string): boolean {
  if (!filterDateStr) return true;
  if (!timestampStr) return false;
  const parts = filterDateStr.split('-');
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    const dd_mm_yyyy = `${dd}/${mm}/${yyyy}`;
    const yyyy_mm_dd = `${yyyy}-${mm}-${dd}`;
    const dd_mm = `${dd}/${mm}`;
    return timestampStr.includes(dd_mm_yyyy) || timestampStr.includes(yyyy_mm_dd) || timestampStr.includes(dd_mm);
  }
  return timestampStr.includes(filterDateStr);
}
