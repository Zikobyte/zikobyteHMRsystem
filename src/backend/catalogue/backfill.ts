import { query } from '../database/db.repo';
import { labCodeForLegacyName, labEntryForCode } from './lab-catalogue';
import { queuePricingReview } from './pricing-review';

export interface BackfillRow {
  id: string;
  test_name: string | null;
  test_code: string | null;
  price: unknown;
  patient_id?: string | null;
  encounter_id?: string | null;
}

export interface BackfillUpdate {
  id: string;
  code: string;
  price: number;
}

export interface BackfillUnmatched {
  id: string;
  name: string;
}

export interface BackfillPlan {
  updates: BackfillUpdate[];
  unmatched: BackfillUnmatched[];
  alreadyCorrect: number;
}

function toNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function planLabBackfill(rows: BackfillRow[]): BackfillPlan {
  const plan: BackfillPlan = { updates: [], unmatched: [], alreadyCorrect: 0 };
  for (const row of rows) {
    const code =
      (typeof row.test_code === 'string' && labEntryForCode(row.test_code)
        ? row.test_code.trim().toUpperCase()
        : null) || labCodeForLegacyName(row.test_name || '');
    if (!code) {
      plan.unmatched.push({ id: row.id, name: row.test_name || 'Unnamed test' });
      continue;
    }
    const entry = labEntryForCode(code);
    if (!entry) {
      plan.unmatched.push({ id: row.id, name: row.test_name || code });
      continue;
    }
    const stored = toNumber(row.price);
    const codeMatches =
      typeof row.test_code === 'string' && row.test_code.trim().toUpperCase() === code;
    if (stored === entry.price && codeMatches) {
      plan.alreadyCorrect += 1;
      continue;
    }
    plan.updates.push({ id: row.id, code, price: entry.price });
  }
  return plan;
}

export interface BackfillResult {
  scanned: number;
  updated: number;
  unmatched: number;
  alreadyCorrect: number;
  unmatchedNames: string[];
  affectedInvoiceIds: string[];
  dryRun: boolean;
}

export async function runLabBackfill(options: { dryRun: boolean }): Promise<BackfillResult> {
  const orders = await query(
    `SELECT id, test_name, test_code, price, patient_id, encounter_id FROM zmc_laboratory_orders`,
  );
  const rows = orders.rows as BackfillRow[];
  const plan = planLabBackfill(rows);

  const affectedInvoiceIds: string[] = [];
  if (plan.updates.length > 0 || plan.unmatched.length > 0) {
    const orderIds = [...plan.updates.map((u) => u.id), ...plan.unmatched.map((u) => u.id)];
    const invoices = await query(
      `SELECT DISTINCT invoice_id AS id FROM zmc_lab_payments WHERE encounter_id IN (
         SELECT encounter_id FROM zmc_laboratory_orders WHERE id = ANY($1)
       )`,
      [orderIds],
    ).catch(() => ({ rows: [] }) as { rows: { id: string }[] });
    for (const row of invoices.rows) {
      if (row.id) affectedInvoiceIds.push(row.id);
    }
    const direct = await query(
      `SELECT id FROM zmc_invoices WHERE description LIKE 'Laboratory Investigations Fee:%'`,
    ).catch(() => ({ rows: [] }) as { rows: { id: string }[] });
    for (const row of direct.rows) {
      if (row.id && !affectedInvoiceIds.includes(row.id)) affectedInvoiceIds.push(row.id);
    }
  }

  if (!options.dryRun) {
    for (const update of plan.updates) {
      await query(
        `UPDATE zmc_laboratory_orders SET price = $1, test_code = $2 WHERE id = $3`,
        [update.price, update.code, update.id],
      );
      console.log(`[backfill] order ${update.id} -> ${update.code} @ ₦${update.price}`);
    }
    const byId = new Map(rows.map((row) => [row.id, row]));
    for (const unmatched of plan.unmatched) {
      const row = byId.get(unmatched.id);
      try {
        await queuePricingReview({
          kind: 'lab',
          code: null,
          name: unmatched.name,
          patientId: row?.patient_id || null,
          encounterId: row?.encounter_id || null,
          requestedBy: 'backfill',
        });
      } catch {
        console.log(`[backfill] review queue write failed for ${unmatched.id}`);
      }
      console.log(`[backfill] order ${unmatched.id} unmatched (${unmatched.name}) -> review queue`);
    }
  }

  return {
    scanned: rows.length,
    updated: plan.updates.length,
    unmatched: plan.unmatched.length,
    alreadyCorrect: plan.alreadyCorrect,
    unmatchedNames: [...new Set(plan.unmatched.map((u) => u.name))],
    affectedInvoiceIds,
    dryRun: options.dryRun,
  };
}
