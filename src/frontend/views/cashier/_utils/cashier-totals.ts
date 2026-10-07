/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from CashierView.tsx.
 * All derived reduce-sums as pure functions (no hooks, no JSX).
 * Logic verbatim from the original inline calculations.
 */

import type {
	Invoice,
	LabPayment,
	OutstandingBalance,
	Patient,
	Payment,
} from "@/types";

export interface CashierQueueItem {
	id: string;
	patient_id: string;
	encounter_id: string;
	hospital_number?: string;
	patient_name?: string;
	queue_type?: string;
	status?: string;
	priority?: string;
	card_type?: string;
	cardType?: string;
	patientCategory?: string;
	processed_by?: string;
	arrival_time?: string;
}

export interface CashierWalkInItem {
	id?: string;
	encounterId?: string;
	encounter_id?: string;
	patientId?: string;
	patient_id?: string;
	invoiceId?: string;
	invoice_id?: string;
	totalAmount?: number | string;
	patientName?: string;
	patient_name?: string;
	name?: string;
	hospitalNumber?: string;
	hospital_number?: string;
	phoneNumber?: string;
	registrationDate?: string;
	testsSummary?: string;
	referringDoctor?: string;
	address?: string;
}

export interface CashierVitaeRecord {
	id?: string;
	amount: number;
	personName?: string;
	description?: string;
	approvedByDoctor?: string;
	createdAt?: string;
}

export interface CashierNoChargeRecord {
	id?: string;
	treatmentCost: number;
	relationship?: string;
	staffName?: string;
	patientName?: string;
	hospitalNumber?: string;
	treatmentDescription?: string;
	approvedByDoctor?: string;
	createdAt?: string;
}

export type LabCategoryFilter = "ALL" | "Standard" | "Maternity" | "Emergency";

export function getCompletedPayments(payments: Payment[]): Payment[] {
	return payments.filter(
		(p) => p.status === "Completed" || p.status === "Paid" || !p.status,
	);
}

export function getTotalCollected(payments: Payment[]): number {
	return getCompletedPayments(payments).reduce(
		(acc, p) => acc + (Number(p.amount) || 0),
		0,
	);
}

export function getCashTotal(payments: Payment[]): number {
	return getCompletedPayments(payments)
		.filter((p) => p.paymentMethod === "Cash")
		.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
}

export function getPosTotal(payments: Payment[]): number {
	return getCompletedPayments(payments)
		.filter((p) => p.paymentMethod === "POS")
		.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
}

export function getTransferTotal(payments: Payment[]): number {
	return getCompletedPayments(payments)
		.filter((p) => p.paymentMethod === "Transfer")
		.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
}

export function getPendingLabQueueItems(
	queueItems: CashierQueueItem[],
): CashierQueueItem[] {
	return queueItems.filter(
		(q) =>
			q.queue_type === "Cashier Lab Payment" &&
			(q.status === "Waiting" || q.status === "Processing"),
	);
}

export function getPendingLabCount(
	queueItems: CashierQueueItem[],
	walkInPending: CashierWalkInItem[],
): number {
	return getPendingLabQueueItems(queueItems).length + walkInPending.length;
}

export function getBillingQueuePendingItems(
	queueItems: CashierQueueItem[],
): CashierQueueItem[] {
	return queueItems.filter(
		(q) =>
			q.queue_type === "Billing" &&
			(q.status === "Waiting" || q.status === "Processing"),
	);
}

export function getUnpaidInvoices(invoices: Invoice[]): Invoice[] {
	return invoices.filter(
		(i) => i.status === "Unpaid" || i.status === "Pending",
	);
}

export function getPendingPaymentsCount(
	queueItems: CashierQueueItem[],
	walkInPending: CashierWalkInItem[],
	invoices: Invoice[],
): number {
	return (
		getPendingLabCount(queueItems, walkInPending) +
		getBillingQueuePendingItems(queueItems).length +
		getUnpaidInvoices(invoices).length
	);
}

export function getPendingPaymentsSum(invoices: Invoice[]): number {
	return getUnpaidInvoices(invoices).reduce(
		(acc, i) =>
			acc + (Number(i.amount) || Number((i as { total?: unknown }).total) || 0),
		0,
	);
}

function invoiceMentionsDischarge(i: Invoice): boolean {
	const desc = (i.description ?? "").toLowerCase();
	const svc = ((i as { service_type?: string }).service_type ?? "").toLowerCase();
	const pur = ((i as { purpose?: string }).purpose ?? "").toLowerCase();
	return (
		desc.includes("discharge") ||
		svc.includes("discharge") ||
		pur.includes("discharge")
	);
}

export function getDischargeInvoices(invoices: Invoice[]): Invoice[] {
	return invoices.filter(
		(i) =>
			(i.status === "Unpaid" || i.status === "Pending") &&
			invoiceMentionsDischarge(i),
	);
}

export function getDischargeBillsSum(invoices: Invoice[]): number {
	return getDischargeInvoices(invoices).reduce(
		(acc, i) =>
			acc + (Number(i.amount) || Number((i as { total?: unknown }).total) || 0),
		0,
	);
}

export function getOutstandingTotalOwed(
	outstandingList: OutstandingBalance[],
): number {
	return outstandingList.reduce(
		(acc, item) => acc + (Number(item.balance) || 0),
		0,
	);
}

export function getTotalPVExpensed(paymentVitae: CashierVitaeRecord[]): number {
	return paymentVitae.reduce((acc, v) => acc + (Number(v.amount) || 0), 0);
}

export function getLargestPVExpense(
	paymentVitae: CashierVitaeRecord[],
): number {
	return paymentVitae.reduce(
		(max, v) => (Number(v.amount) > max ? Number(v.amount) : max),
		0,
	);
}

export function getTotalNoChargeSettle(
	noChargeRecords: CashierNoChargeRecord[],
): number {
	return noChargeRecords.reduce(
		(acc, r) => acc + (Number(r.treatmentCost) || 0),
		0,
	);
}

export function getNoChargeStaffSelfCount(
	noChargeRecords: CashierNoChargeRecord[],
): number {
	return noChargeRecords.filter((r) => r.relationship === "Self").length;
}

export function getPendingLabFeeSum(
	pendingLabQueueItems: CashierQueueItem[],
	invoices: Invoice[],
): number {
	return pendingLabQueueItems.reduce((acc, q) => {
		const inv = invoices.find(
			(i) => i.patient_id === q.patient_id && i.status === "Unpaid",
		);
		return acc + (inv ? Number(inv.amount || 0) : 0);
	}, 0);
}

export function filterPatientsByQuery(
	patients: Patient[],
	searchQuery: string,
): Patient[] {
	if (searchQuery.trim() === "") return [];
	const q = searchQuery.toLowerCase();
	return patients.filter(
		(p) =>
			p.name.toLowerCase().includes(q) ||
			p.hospitalNumber.toLowerCase().includes(q) ||
			(p.phoneNumber != null && p.phoneNumber.includes(searchQuery)),
	);
}

export function filterPaymentsByMethod(
	payments: Payment[],
	filterMethod: string,
): Payment[] {
	if (filterMethod === "ALL") return payments;
	return payments.filter(
		(p) => p.paymentMethod.toUpperCase() === filterMethod,
	);
}

export function getFilteredLabItems(
	pendingLabQueueItems: CashierQueueItem[],
	patients: Patient[],
	labCategoryFilter: LabCategoryFilter,
	searchQuery: string,
): CashierQueueItem[] {
	return pendingLabQueueItems.filter((q) => {
		const pat: Patient | undefined = patients.find(
			(p) => p.id === q.patient_id,
		);
		const cardType =
			pat?.cardType ?? q.card_type ?? q.cardType ?? "Standard";

		if (labCategoryFilter !== "ALL") {
			if (
				labCategoryFilter === "Standard" &&
				cardType !== "Standard" &&
				cardType !== "Regular"
			)
				return false;
			if (labCategoryFilter === "Maternity" && cardType !== "Maternity")
				return false;
			if (
				labCategoryFilter === "Emergency" &&
				cardType !== "Emergency" &&
				q.priority !== "Emergency"
			)
				return false;
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			const nameMatch = (q.patient_name ?? pat?.name ?? "")
				.toLowerCase()
				.includes(query);
			const hNumMatch = (q.hospital_number ?? pat?.hospitalNumber ?? "")
				.toLowerCase()
				.includes(query);
			return nameMatch || hNumMatch;
		}
		return true;
	});
}

export function getPendingBalanceSuggested(pat: Patient): number {
	if (pat.cardType === "Maternity" && pat.status === "Triage Pending") {
		return 5000;
	}
	if (pat.cardType === "Emergency" && pat.status === "Emergency Dispatched") {
		return pat.cardFee || 5000;
	}
	if (pat.balance !== undefined && pat.balance > 0) {
		return pat.balance;
	}
	return pat.cardFee || 2000;
}

export type { Invoice, LabPayment, OutstandingBalance, Patient, Payment };
