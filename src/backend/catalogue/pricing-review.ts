import { generateUUID, query } from '../database/db.repo';

export interface PricingReviewInput {
  kind: 'lab' | 'medication';
  code: string | null;
  name: string;
  patientId?: string | null;
  encounterId?: string | null;
  requestedBy?: string | null;
}

export async function queuePricingReview(input: PricingReviewInput): Promise<string> {
  const id = generateUUID();
  await query(
    `INSERT INTO zmc_pricing_review (id, kind, code, name, patient_id, encounter_id, requested_by, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending', NOW())`,
    [
      id,
      input.kind,
      input.code,
      input.name,
      input.patientId || null,
      input.encounterId || null,
      input.requestedBy || null,
    ],
  );
  return id;
}

export async function listPendingPricingReviews(): Promise<Record<string, unknown>[]> {
  const result = await query(
    `SELECT * FROM zmc_pricing_review WHERE status = 'Pending' ORDER BY created_at DESC`,
  );
  return result.rows as Record<string, unknown>[];
}
