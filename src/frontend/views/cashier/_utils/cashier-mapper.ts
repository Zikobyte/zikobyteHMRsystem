/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from CashierView.tsx.
 * Procurement queue row mapping (mirrors GET /hr/procurements payload shape).
 * Kept pure + exported so bun:test can verify the GET -> row contract.
 * Export names IDENTICAL (tests import them).
 */

// Procurement queue row mapping (mirrors GET /hr/procurements payload shape).
// Kept pure + exported so bun:test can verify the GET -> row contract.
export interface CashierProcurementQueueRow {
	id: string;
	item: string;
	quantity: number;
	amount: number;
	status: string;
	requestedBy: string;
	supplierName: string;
	department: string;
}

export function mapCashierProcurementQueueRow(
	raw: unknown,
): CashierProcurementQueueRow {
	const r = (raw ?? {}) as Record<string, unknown>;
	const str = (v: unknown, fallback: string): string =>
		typeof v === "string" && v.length > 0 ? v : fallback;
	const num = (v: unknown): number => {
		const n = Number(v);
		return Number.isFinite(n) ? n : 0;
	};
	return {
		id: String(r.id ?? ""),
		item: str(r.items, str(r.item_name, "Medical Consumables")),
		quantity: num(r.quantity),
		amount: num(r.amount),
		status: str(r.status, "Pending"),
		requestedBy: str(r.requested_by, str(r.requestedBy, "Not recorded")),
		supplierName: str(r.supplier_name, "Vendor"),
		department: str(r.department, "Hospital General"),
	};
}
