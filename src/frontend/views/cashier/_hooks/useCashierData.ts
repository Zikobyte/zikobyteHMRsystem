/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx.
 * Data hook: owns the initial fetch fan-out (patients/payments/invoices/
 * queue/outstanding/PV/no-charge/discounts) + maternity + procurement
 * fetches + propActiveTab sync effect + realtime ledger refresh.
 * apiFetch paths, response wiring, and eye-registration fallback are
 * preserved verbatim from the original component.
 */

import { useEffect, useRef, useState } from "react";
import type {
	DiscountRequest,
	Invoice,
	LabPayment,
	OutstandingBalance,
	Patient,
	Payment,
	User,
} from "@/types";
import { apiFetch, socketManager } from "@/utils/api";
import type { MaternityHandoverRecord } from "../MaternitySuppliesCashierView";
import type {
	CashierNoChargeRecord,
	CashierQueueItem,
	CashierVitaeRecord,
	CashierWalkInItem,
} from "../_utils/cashier-totals";

export type CashierActiveTab =
	| "billing"
	| "lab-payments"
	| "iclinic-registrations"
	| "walkin-verify"
	| "outstanding"
	| "vitae"
	| "no-charge"
	| "discounts"
	| "maternity-supplies"
	| "procurement-queue"
	| "pending-payments-all";

export type MaternitySupplyRow = MaternityHandoverRecord;

export interface EyeRegistrationRow {
	id: string;
	name?: string;
	hospitalNumber?: string;
	balance?: number;
	status?: string;
	paymentStatus?: string;
	phoneNumber?: string;
	dateOfBirth?: string;
	chiefComplaint?: string;
	nextOfKin?: string;
	address?: string;
}

function resolveInitialTab(propActiveTab: string | undefined): CashierActiveTab {
	if (
		propActiveTab === "cashier-outstanding" ||
		propActiveTab === "outstanding"
	)
		return "outstanding";
	if (propActiveTab === "cashier-discounts" || propActiveTab === "discounts")
		return "discounts";
	if (propActiveTab === "cashier-lab-payments") return "lab-payments";
	if (
		propActiveTab === "cashier-iclinic-registrations" ||
		propActiveTab === "iclinic-registrations"
	)
		return "iclinic-registrations";
	if (propActiveTab === "cashier-walkin-verify") return "walkin-verify";
	if (propActiveTab === "cashier-vitae" || propActiveTab === "cashier-pv")
		return "vitae";
	if (propActiveTab === "cashier-no-charge") return "no-charge";
	if (
		propActiveTab === "cashier-maternity-supplies" ||
		propActiveTab === "maternity-supplies"
	)
		return "maternity-supplies";
	if (
		propActiveTab === "cashier-procurement-queue" ||
		propActiveTab === "procurement-queue"
	)
		return "procurement-queue";
	return "billing";
}

export interface UseCashierDataParams {
	propActiveTab?: string;
}

export function useCashierData({ propActiveTab }: UseCashierDataParams = {}) {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [queueItems, setQueueItems] = useState<CashierQueueItem[]>([]);
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [isLoadingQueue, setIsLoadingQueue] = useState(false);

	const [activeTab, setActiveTab] =
		useState<CashierActiveTab>(() => resolveInitialTab(propActiveTab));

	const [maternitySupplies, setMaternitySupplies] = useState<
		MaternityHandoverRecord[]
	>([]);
	const [isLoadingMaternitySupplies, setIsLoadingMaternitySupplies] =
		useState(false);
	const [eyeRegistrationsList, setEyeRegistrationsList] = useState<
		EyeRegistrationRow[]
	>([]);
	const [outstandingList, setOutstandingList] = useState<OutstandingBalance[]>(
		[],
	);
	const [labHistoryRecords, setLabHistoryRecords] = useState<LabPayment[]>([]);
	const [walkInPending, setWalkInPending] = useState<CashierWalkInItem[]>([]);
	const [walkInPaid, setWalkInPaid] = useState<CashierWalkInItem[]>([]);
	const [paymentVitae, setPaymentVitae] = useState<CashierVitaeRecord[]>([]);
	const [noChargeRecords, setNoChargeRecords] = useState<
		CashierNoChargeRecord[]
	>([]);
	const [procurementQueue, setProcurementQueue] = useState<
		Record<string, unknown>[]
	>([]);
	const [isLoadingProcurementQueue, setIsLoadingProcurementQueue] =
		useState(false);
	const [discountRequestsList, setDiscountRequestsList] = useState<
		DiscountRequest[]
	>([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [filterMethod, setFilterMethod] = useState<string>("ALL");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		if (propActiveTab) {
			if (propActiveTab === "cashier-lab-payments")
				setActiveTab("lab-payments");
			else if (
				propActiveTab === "cashier-iclinic-registrations" ||
				propActiveTab === "iclinic-registrations"
			)
				setActiveTab("iclinic-registrations");
			else if (propActiveTab === "cashier-walkin-verify")
				setActiveTab("walkin-verify");
			else if (
				propActiveTab === "cashier-outstanding" ||
				propActiveTab === "outstanding"
			)
				setActiveTab("outstanding");
			else if (
				propActiveTab === "cashier-discounts" ||
				propActiveTab === "discounts"
			)
				setActiveTab("discounts");
			else if (
				propActiveTab === "cashier-vitae" ||
				propActiveTab === "cashier-pv"
			)
				setActiveTab("vitae");
			else if (propActiveTab === "cashier-no-charge")
				setActiveTab("no-charge");
			else if (
				propActiveTab === "cashier-maternity-supplies" ||
				propActiveTab === "maternity-supplies"
			)
				setActiveTab("maternity-supplies");
			else if (
				propActiveTab === "cashier-procurement-queue" ||
				propActiveTab === "procurement-queue"
			)
				setActiveTab("procurement-queue");
			else if (
				propActiveTab === "cashier-billing" ||
				propActiveTab === "cashier"
			)
				setActiveTab("billing");
		}
	}, [propActiveTab]);

	const fetchInitialData = async () => {
		setIsLoading(true);
		setIsLoadingQueue(true);
		setError("");
		try {
			const [
				patientsRes,
				paymentsRes,
				usersRes,
				queueRes,
				vitaeRes,
				noChargeRes,
				invoicesRes,
				labHistRes,
				walkInRes,
				outstandingRes,
				discRes,
				matSuppliesRes,
			] = await Promise.all([
				apiFetch("/patients"),
				apiFetch("/payments"),
				apiFetch("/users").catch(() => ({ success: true, data: [] })),
				apiFetch("/patients/opd/queue").catch(() => ({
					success: true,
					data: [],
				})),
				apiFetch("/payments/vitae").catch(() => ({
					success: true,
					data: [],
				})),
				apiFetch("/payments/no-charge").catch(() => ({
					success: true,
					data: [],
				})),
				apiFetch("/patients/opd/invoices").catch(() => ({
					success: true,
					data: [],
				})),
				apiFetch("/payments/lab-history").catch(() => ({
					success: true,
					data: [],
				})),
				apiFetch("/payments/lab/walk-in").catch(() => ({
					success: true,
					data: { pendingPayment: [], paidReadyForTesting: [] },
				})),
				apiFetch("/payments/outstanding").catch(() => ({
					success: true,
					data: [],
				})),
				apiFetch("/payments/discount-requests").catch(() => ({
					success: true,
					discountRequests: [],
				})),
				apiFetch("/nursing/maternity-supplies").catch(() => ({
					success: true,
					data: [],
				})),
			]);

			if (patientsRes.success) setPatients(patientsRes.data);
			if (paymentsRes.success) setPayments(paymentsRes.data);
			if (usersRes.success) setUsers(usersRes.data);
			if (queueRes.success) setQueueItems(queueRes.data);
			if (vitaeRes.success) setPaymentVitae(vitaeRes.data);
			if (noChargeRes.success) setNoChargeRecords(noChargeRes.data);
			if (invoicesRes.success) setInvoices(invoicesRes.data);
			if (labHistRes.success) setLabHistoryRecords(labHistRes.data);
			if (outstandingRes.success)
				setOutstandingList(outstandingRes.data || []);
			if (discRes?.success)
				setDiscountRequestsList(discRes.discountRequests || []);
			if (matSuppliesRes?.success && Array.isArray(matSuppliesRes.data)) {
				setMaternitySupplies(matSuppliesRes.data);
			}
			if (walkInRes.success && walkInRes.data) {
				setWalkInPending(walkInRes.data.pendingPayment || []);
				setWalkInPaid(walkInRes.data.paidReadyForTesting || []);
			}

			// Sync Eye Clinic Registration queue items from backend DB
			try {
				const eyeRes = await apiFetch("/patients/eye-clinic/patients");
				if (eyeRes && eyeRes.success && Array.isArray(eyeRes.data)) {
					const pendingEye = eyeRes.data.filter(
						(p: EyeRegistrationRow) =>
							p.status === "Awaiting Cashier Verification" ||
							p.paymentStatus === "UNPAID" ||
							(p.balance != null && p.balance > 0),
					);
					setEyeRegistrationsList(pendingEye);
				} else {
					const eyePats = JSON.parse(
						localStorage.getItem("zmc_eye_patients_new") || "[]",
					) as EyeRegistrationRow[];
					const pendingEye = eyePats.filter(
						(p) =>
							p.status === "Awaiting Cashier Verification" ||
							p.paymentStatus === "UNPAID",
					);
					setEyeRegistrationsList(pendingEye);
				}
			} catch (e) {
				console.error("Error loading eye registrations in cashier", e);
			}
		} catch (err) {
			console.error("Failed to load cashier data", err);
			setError(
				err instanceof Error
					? err.message
					: "Error loading cashier dashboard data.",
			);
		} finally {
			setIsLoading(false);
			setIsLoadingQueue(false);
		}
	};

	const fetchMaternitySupplies = async () => {
		try {
			setIsLoadingMaternitySupplies(true);
			const res = await apiFetch("/nursing/maternity-supplies");
			if (res && res.success && Array.isArray(res.data)) {
				setMaternitySupplies(res.data);
			}
		} catch (err) {
			console.error("Failed to load maternity supplies:", err);
		} finally {
			setIsLoadingMaternitySupplies(false);
		}
	};

	// Read-only procurement queue for cashiers. GET only — no POST/PATCH/DELETE.
	// HR / Management own every write path; this desk renders item, quantity,
	// amount, status, and requested_by for visibility.
	const fetchProcurementQueue = async () => {
		try {
			setIsLoadingProcurementQueue(true);
			const res = await apiFetch("/hr/procurements");
			if (res && res.success && Array.isArray(res.data)) {
				setProcurementQueue(res.data);
			}
		} catch (err) {
			console.error("Failed to load procurement queue:", err);
		} finally {
			setIsLoadingProcurementQueue(false);
		}
	};

	const initialDataLoaded = useRef(false);

	useEffect(() => {
		if (initialDataLoaded.current) return;
		initialDataLoaded.current = true;
		void fetchInitialData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (activeTab === "procurement-queue") {
			void fetchProcurementQueue();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	// Realtime: refresh the cashier ledger when the backend broadcasts
	// payment/billing events. Single shared socketManager subscription
	// (never a second WebSocket); a ref keeps the fetch callback fresh.
	const fetchInitialDataRef = useRef(fetchInitialData);
	fetchInitialDataRef.current = fetchInitialData;

	useEffect(() => {
		const cashierEventTypes = new Set([
			"DEPARTMENTAL_CASH_COLLECTED",
			"PAYMENT_HANDOVER_CONFIRMED",
			"DISCOUNT_REQUEST_SUBMITTED",
			"DISCOUNT_APPROVED",
			"DISCOUNT_REJECTED",
			"OUTSTANDING_BALANCE_SETTLED",
			"BILLING_QUEUE_UPDATED",
			"PATIENT_PAYMENT_COMPLETED",
			"PATIENT_ROUTED_TO_LAB",
			"LAB_ORDER_CREATED",
			"LAB_WALK_IN_REGISTERED",
			"LAB_WALK_IN_PAID",
		]);
		const unsubscribe = socketManager.subscribe((msg: { type?: string }) => {
			if (msg && cashierEventTypes.has(msg.type ?? "")) {
				void fetchInitialDataRef.current();
			}
		});
		return () => unsubscribe();
	}, []);

	return {
		patients,
		setPatients,
		payments,
		setPayments,
		users,
		queueItems,
		setQueueItems,
		invoices,
		setInvoices,
		isLoadingQueue,
		activeTab,
		setActiveTab,
		maternitySupplies,
		isLoadingMaternitySupplies,
		eyeRegistrationsList,
		setEyeRegistrationsList,
		outstandingList,
		setOutstandingList,
		labHistoryRecords,
		walkInPending,
		setWalkInPending,
		walkInPaid,
		setWalkInPaid,
		paymentVitae,
		setPaymentVitae,
		noChargeRecords,
		setNoChargeRecords,
		procurementQueue,
		isLoadingProcurementQueue,
		discountRequestsList,
		setDiscountRequestsList,
		searchQuery,
		setSearchQuery,
		filterMethod,
		setFilterMethod,
		isLoading,
		setIsLoading,
		error,
		setError,
		success,
		setSuccess,
		fetchInitialData,
		fetchMaternitySupplies,
		fetchProcurementQueue,
	};
}

export type UseCashierDataReturn = ReturnType<typeof useCashierData>;
