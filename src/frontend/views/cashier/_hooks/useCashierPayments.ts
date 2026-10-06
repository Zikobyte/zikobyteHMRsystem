/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx.
 * Payments hook: handover / lab payment / row payment / record payment /
 * PV / no-charge / settle outstanding + walk-in verify + eye verification
 * + queue / walk-in selection (all apiFetch verbatim).
 */

import { useState } from "react";
import type { Invoice, Patient, Payment, User } from "@/types";
import { apiFetch } from "@/utils/api";
import type {
	CashierQueueItem,
	CashierWalkInItem,
} from "../_utils/cashier-totals";
import { getPendingBalanceSuggested as getSuggested } from "../_utils/cashier-totals";

export interface CashierActionFeedback {
	isOpen: boolean;
	title: string;
	message: string;
	patientName?: string;
	hospitalNumber?: string;
	amount?: number;
	badgeText?: string;
	details?: { label: string; value: string }[];
}

export interface UseCashierPaymentsParams {
	patients: Patient[];
	payments: Payment[];
	users: User[];
	queueItems: CashierQueueItem[];
	invoices: Invoice[];
	setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
	setQueueItems: React.Dispatch<React.SetStateAction<CashierQueueItem[]>>;
	setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
	setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
	setPaymentVitae: React.Dispatch<
		React.SetStateAction<{ amount: number }[]>
	>;
	setNoChargeRecords: React.Dispatch<
		React.SetStateAction<{ treatmentCost: number; relationship?: string }[]>
	>;
	fetchInitialData: () => Promise<void>;
	setError: (msg: string) => void;
	setSuccess: (msg: string) => void;
	setIsLoading: (v: boolean) => void;
	setActionFeedbackModal: (
		v: CashierActionFeedback | null,
	) => void;
}

export function useCashierPayments({
	patients,
	payments,
	users,
	invoices,
	setPatients,
	setQueueItems,
	setInvoices,
	setPayments,
	setPaymentVitae,
	setNoChargeRecords,
	fetchInitialData,
	setError,
	setSuccess,
	setIsLoading,
	setActionFeedbackModal,
}: UseCashierPaymentsParams) {
	const [eyePayMethods, setEyePayMethods] = useState<Record<string, string>>(
		{},
	);
	const [eyePayAmounts, setEyePayAmounts] = useState<Record<string, string>>(
		{},
	);
	const [settleItemId, setSettleItemId] = useState<string | null>(null);
	const [settlePayAmount, setSettlePayAmount] = useState<string>("");
	const [settlePayMethod, setSettlePayMethod] = useState<string>("Cash");
	const [isSettling, setIsSettling] = useState<boolean>(false);
	const [rowPaymentAmounts, setRowPaymentAmounts] = useState<
		Record<string, string>
	>({});
	const [rowPaymentMethods, setRowPaymentMethods] = useState<
		Record<string, string>
	>({});
	const [recordingRowId, setRecordingRowId] = useState<string | null>(null);
	const [labSubTab, setLabSubTab] = useState<"pending" | "history">("pending");
	const [labPayMethods, setLabPayMethods] = useState<Record<string, string>>(
		{},
	);
	const [labCategoryFilter, setLabCategoryFilter] = useState<
		"ALL" | "Standard" | "Maternity" | "Emergency"
	>("ALL");
	const [selectedTotalBill, setSelectedTotalBill] = useState<number>(0);
	const [labCustomAmounts, setLabCustomAmounts] = useState<
		Record<string, string>
	>({});
	const [walkInCustomAmounts, setWalkInCustomAmounts] = useState<
		Record<string, string>
	>({});
	const [walkInPending_unused] = useState<CashierWalkInItem[]>([]);
	const [selectedWalkInVerify, setSelectedWalkInVerify] = useState<any | null>(
		null,
	);
	const [walkInVerifyPayMethod, setWalkInVerifyPayMethod] =
		useState<string>("Cash");
	const [isVerifyingWalkIn, setIsVerifyingWalkIn] = useState<boolean>(false);
	const [pendingQueueTab, setPendingQueueTab] = useState<
		"emergency" | "walkin" | "regular"
	>("emergency");
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [payAmount, setPayAmount] = useState("");
	const [payMethod, setPayMethod] = useState("Cash");
	const [payRef, setPayRef] = useState("");
	const [payPurpose, setPayPurpose] = useState("Registration Fee");
	const [pvPersonName, setPvPersonName] = useState("");
	const [pvDescription, setPvDescription] = useState("");
	const [pvAmount, setPvAmount] = useState("");
	const [pvApprovedByDoctor, setPvApprovedByDoctor] =
		useState("Dr. Alan Smith");
	const [ncStaffName, setNcStaffName] = useState("");
	const [ncRelationship, setNcRelationship] = useState("Self");
	const [ncPatientId, setNcPatientId] = useState("");
	const [ncTreatmentCost, setNcTreatmentCost] = useState("");
	const [ncTreatmentDescription, setNcTreatmentDescription] = useState("");
	const [ncApprovedByDoctor, setNcApprovedByDoctor] =
		useState("Dr. Alan Smith");
	const [isConfirmingHandover, setIsConfirmingHandover] = useState<
		string | null
	>(null);

	void walkInPending_unused;

	const handleConfirmHandover = async (paymentId: string) => {
		setIsConfirmingHandover(paymentId);
		setError("");
		setSuccess("");
		try {
			const res = await apiFetch(`/payments/${paymentId}/confirm`, {
				method: "POST",
			});
			if (res.success) {
				setSuccess(
					"Departmental cash handover successfully confirmed & balanced! Patient payment completed.",
				);
				// Instantly update local state to remove patient from pending queues and unconfirmed handovers
				const targetPayment = payments.find((p) => p.id === paymentId);
				if (targetPayment) {
					const pid = targetPayment.patientId;
					setQueueItems((prev) =>
						prev.filter((q) => q.patient_id !== pid),
					);
					setInvoices((prev) =>
						prev.map((inv) =>
							inv.patient_id === pid ? { ...inv, status: "Paid" } : inv,
						),
					);
					setPayments((prev) =>
						prev.map((p) =>
							p.id === paymentId ? { ...p, status: "Completed" } : p,
						),
					);
				}
				await fetchInitialData();

				setActionFeedbackModal({
					isOpen: true,
					title: "Departmental Handover Confirmed",
					message:
						"Departmental cash collection has been successfully verified and balanced into the Cashier ledger.",
					amount: Number(targetPayment?.amount) || 0,
					badgeText: "Handover Completed",
					details: [
						{
							label: "Payment Method",
							value:
								(targetPayment?.paymentMethod as string) || "Cash",
						},
						{ label: "Ledger Status", value: "Completed & Balanced" },
					],
				});
			}
		} catch (err: any) {
			setError(err.message || "Failed to confirm cash handover.");
		} finally {
			setIsConfirmingHandover(null);
		}
	};

	const handleConfirmLabPayment = async (
		qItem: any,
		totalAmount: number,
		invoiceId?: string,
	) => {
		setIsLoading(true);
		setError("");
		setSuccess("");
		try {
			const enteredStr = labCustomAmounts[qItem.id];
			const collectedAmount =
				enteredStr !== undefined && enteredStr !== ""
					? parseFloat(enteredStr)
					: totalAmount;
			const totalB = totalAmount > 0 ? totalAmount : collectedAmount;
			if (isNaN(collectedAmount) || collectedAmount <= 0) {
				setError(
					"Please enter a valid lab payment amount greater than zero.",
				);
				setIsLoading(false);
				return;
			}

			let response;
			if (collectedAmount < totalB) {
				response = await apiFetch("/payments/partial", {
					method: "POST",
					body: JSON.stringify({
						patientId: qItem.patient_id,
						encounterId: qItem.encounter_id,
						invoiceId: invoiceId || undefined, // leave null-id to backend sanitizer; never fabricate INV- ids client-side
						totalBill: totalB,
						amountPaid: collectedAmount,
						paymentMethod: labPayMethods[qItem.id] || "Cash",
						purpose: "Doctor Lab Request Investigation",
						department: "Laboratory",
					}),
				});
				// Route queue item to Laboratory
				await apiFetch(`/patients/opd/queue/${qItem.id}/route`, {
					method: "POST",
					body: JSON.stringify({
						targetQueueType: "Laboratory",
						status: "Waiting",
					}),
				}).catch(() => {});
			} else {
				response = await apiFetch("/payments", {
					method: "POST",
					body: JSON.stringify({
						patientId: qItem.patient_id,
						amount: collectedAmount,
						paymentMethod: labPayMethods[qItem.id] || "Cash",
						status: "Completed",
						invoiceId: invoiceId || undefined, // leave null-id to backend sanitizer; never fabricate INV- ids client-side
					}),
				});
			}

			if (response.success) {
				const remainingBal = Math.max(0, totalB - collectedAmount);
				if (remainingBal > 0) {
					setSuccess(
						`Lab payment of ₦${collectedAmount.toLocaleString()} confirmed for ${qItem.patient_name || "Patient"}! Remaining ₦${remainingBal.toLocaleString()} sent to Outstanding Balances.`,
					);
				} else {
					setSuccess(
						`Lab payment of ₦${collectedAmount.toLocaleString()} confirmed for ${qItem.patient_name || "Patient"}! Patient routed to Laboratory.`,
					);
				}
				// Instantly remove patient from queue state
				setQueueItems((prev) => prev.filter((q) => q.id !== qItem.id));
				setInvoices((prev) =>
					prev.map((inv) =>
						inv.patient_id === qItem.patient_id
							? { ...inv, status: "Paid" }
							: inv,
					),
				);
				fetchInitialData();

				setActionFeedbackModal({
					isOpen: true,
					title:
						remainingBal > 0
							? "Partial Lab Payment Collected"
							: "Laboratory Fee Collected & Settled",
					message: `Laboratory investigation payment of ₦${collectedAmount.toLocaleString()} was confirmed for ${qItem.patient_name || "Patient"}.${remainingBal > 0 ? ` Unpaid balance of ₦${remainingBal.toLocaleString()} sent to Outstanding Balances.` : ""}`,
					patientName: qItem.patient_name || "Patient",
					hospitalNumber: qItem.hospital_number || "—",
					amount: collectedAmount,
					badgeText: "Routed to Laboratory Workstation",
					details: [
						{
							label: "Payment Method",
							value: labPayMethods[qItem.id] || "Cash",
						},
						{
							label: "Amount Collected Now",
							value: `₦${collectedAmount.toLocaleString()}`,
						},
						{
							label: "Total Payable Bill",
							value: `₦${totalB.toLocaleString()}`,
						},
						{
							label: "Remaining Balance",
							value:
								remainingBal > 0
									? `₦${remainingBal.toLocaleString()} (Logged)`
									: "Cleared",
						},
						{
							label: "Destination Queue",
							value: "Laboratory Testing Workstation",
						},
					],
				});
			} else {
				setError(response.error || "Failed to process lab payment");
			}
		} catch (err: any) {
			setError(err.message || "Error processing lab payment");
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyEyeRegistration = async (patient: any) => {
		try {
			const payMethodStr = eyePayMethods[patient.id] || "Cash";
			const amtStr = eyePayAmounts[patient.id];
			const paidAmount =
				amtStr && !isNaN(parseFloat(amtStr))
					? parseFloat(amtStr)
					: patient.balance || 3000;

			// 1. Call Backend API to verify payment in PostgreSQL
			try {
				await apiFetch("/patients/eye-clinic/verify-payment", {
					method: "POST",
					body: JSON.stringify({
						patientId: patient.id || patient.hospitalNumber,
						amount: paidAmount,
						paymentMethod: payMethodStr,
					}),
				});
			} catch (apiErr) {
				console.warn(
					"Could not update eye patient via backend API, falling back to local store:",
					apiErr,
				);
			}

			const eyePats = JSON.parse(
				localStorage.getItem("zmc_eye_patients_new") || "[]",
			);
			const updatedEyePats = eyePats.map((p: any) => {
				if (p.id === patient.id) {
					const currentBal =
						typeof p.balance === "number" ? p.balance : 3000;
					const newBal = Math.max(0, currentBal - paidAmount);
					return {
						...p,
						status: "Awaiting Consult",
						paymentStatus: newBal === 0 ? "Paid" : "Part Paid",
						balance: newBal,
					};
				}
				return p;
			});
			localStorage.setItem(
				"zmc_eye_patients_new",
				JSON.stringify(updatedEyePats),
			);

			const eyeQueue = JSON.parse(
				localStorage.getItem("zmc_eye_registrations_queue") || "[]",
			);
			const updatedQueue = eyeQueue.filter((q: any) => q.id !== patient.id);
			localStorage.setItem(
				"zmc_eye_registrations_queue",
				JSON.stringify(updatedQueue),
			);

			const newPayment: Payment = {
				id: `PAY-EYE-${Date.now()}`,
				patientId: patient.id,
				amount: paidAmount,
				status: "Completed",
				datePaid: new Date().toISOString(),
				paymentMethod: payMethodStr,
				purpose: "New Patient - Eye Clinic Card ₦3,000",
				collectedBy: "Cashier Desk",
			};
			setPayments((prev) => [newPayment, ...prev]);

			setSuccess(
				`Verified payment of ₦${paidAmount.toLocaleString()} for ${patient.name} (${patient.hospitalNumber}). Patient routed to I-Clinic Consultations!`,
			);

			await fetchInitialData();
		} catch (e: any) {
			setError(
				`Error processing Eye Clinic registration payment: ${e.message}`,
			);
		}
	};

	const handleSettleOutstanding = async (item: any) => {
		const pAmt = parseFloat(settlePayAmount);
		if (isNaN(pAmt) || pAmt <= 0) {
			setError("Please specify a valid payment amount.");
			return;
		}
		const balanceOwed = parseFloat(item.balance);
		if (!isNaN(balanceOwed) && pAmt > balanceOwed) {
			setError(
				`Amount typed (₦${pAmt.toLocaleString()}) exceeds remaining balance owed (₦${balanceOwed.toLocaleString()}).`,
			);
			return;
		}
		setIsSettling(true);
		setError("");
		setSuccess("");
		try {
			const response = await apiFetch("/payments/outstanding/settle", {
				method: "POST",
				body: JSON.stringify({
					id: item.id,
					patientId: item.patient_id,
					paymentAmount: pAmt,
					paymentMethod: settlePayMethod || "Cash",
				}),
			});

			if (response.success) {
				setSuccess(
					response.message ||
						"Outstanding balance payment processed successfully!",
				);
				setSettleItemId(null);
				setSettlePayAmount("");
				await fetchInitialData();

				setActionFeedbackModal({
					isOpen: true,
					title: "Outstanding Balance Payment Received",
					message: `Successfully received ₦${pAmt.toLocaleString()} via ${settlePayMethod} for ${item.patient_name || "Patient"}!`,
					patientName: item.patient_name,
					hospitalNumber: item.hospital_number,
					amount: pAmt,
					badgeText: "Balance Cleared / Reduced",
					details: [
						{ label: "Payment Method", value: settlePayMethod },
						{
							label: "Debt Purpose",
							value: item.purpose || "Hospital Services",
						},
						{
							label: "Original Total",
							value: `₦${parseFloat(item.total_bill).toLocaleString()}`,
						},
						{
							label: "New Outstanding Balance",
							value: `₦${Math.max(0, parseFloat(item.balance) - pAmt).toLocaleString()}`,
						},
					],
				});
			} else {
				setError(response.error || "Failed to settle balance");
			}
		} catch (err: any) {
			setError(err.message || "Error settling outstanding balance");
		} finally {
			setIsSettling(false);
		}
	};

	const handleRecordRowPayment = async (item: any) => {
		const rawAmt = rowPaymentAmounts[item.id];
		const pAmt =
			rawAmt !== undefined && rawAmt !== ""
				? parseFloat(rawAmt)
				: parseFloat(item.balance);
		const payMethod = rowPaymentMethods[item.id] || "Cash";

		if (isNaN(pAmt) || pAmt <= 0) {
			setError("Please enter a valid payment amount to record.");
			return;
		}

		if (pAmt > parseFloat(item.balance)) {
			setError(
				`Amount typed (₦${pAmt.toLocaleString()}) exceeds remaining balance owed (₦${parseFloat(item.balance).toLocaleString()}).`,
			);
			return;
		}

		setRecordingRowId(item.id);
		setError("");
		setSuccess("");
		try {
			const response = await apiFetch("/payments/outstanding/settle", {
				method: "POST",
				body: JSON.stringify({
					id: item.id,
					patientId: item.patient_id,
					paymentAmount: pAmt,
					paymentMethod: payMethod,
				}),
			});

			if (response.success) {
				setSuccess(
					`Payment of ₦${pAmt.toLocaleString()} recorded via ${payMethod} for ${item.patient_name || "Patient"}!`,
				);
				setRowPaymentAmounts((prev) => ({ ...prev, [item.id]: "" }));
				await fetchInitialData();

				setActionFeedbackModal({
					isOpen: true,
					title: "Payment Recorded",
					message: `Successfully recorded ₦${pAmt.toLocaleString()} payment via ${payMethod} for ${item.patient_name || "Patient"}.`,
					patientName: item.patient_name,
					hospitalNumber: item.hospital_number,
					amount: pAmt,
					badgeText:
						pAmt >= parseFloat(item.balance)
							? "Debt Fully Cleared"
							: "Partial Payment Recorded",
					details: [
						{
							label: "Department Owed",
							value:
								item.department_owed ||
								item.department ||
								"Hospital Services",
						},
						{ label: "Payment Method", value: payMethod },
						{
							label: "Original Total Owed",
							value: `₦${parseFloat(item.total_bill).toLocaleString()}`,
						},
						{
							label: "New Remaining Owed",
							value: `₦${Math.max(0, parseFloat(item.balance) - pAmt).toLocaleString()}`,
						},
					],
				});
			} else {
				setError(response.error || "Failed to record payment");
			}
		} catch (err: any) {
			setError(
				err.message || "Error recording payment for outstanding balance",
			);
		} finally {
			setRecordingRowId(null);
		}
	};

	const handleConfirmWalkInVerification = async (patient: any) => {
		setIsVerifyingWalkIn(true);
		setError("");
		setSuccess("");

		try {
			const totalAmount = Number(patient.totalAmount) || 0;
			const enteredStr = walkInCustomAmounts[patient.encounterId];
			const collectedAmount =
				enteredStr !== undefined && enteredStr !== ""
					? parseFloat(enteredStr)
					: totalAmount;
			if (isNaN(collectedAmount) || collectedAmount <= 0) {
				setError(
					"Please enter a valid walk-in payment amount greater than zero.",
				);
				setIsVerifyingWalkIn(false);
				return;
			}

			const response = await apiFetch("/payments/lab/confirm-walk-in", {
				method: "POST",
				body: JSON.stringify({
					patientId: patient.patientId,
					encounterId: patient.encounterId,
					invoiceId: patient.invoiceId,
					totalBill: totalAmount > 0 ? totalAmount : collectedAmount,
					amount: collectedAmount,
					paymentMethod: walkInVerifyPayMethod || "Cash",
				}),
			});

			if (response.success) {
				const remainingBal = Math.max(0, totalAmount - collectedAmount);
				setSuccess(
					`Walk-in Lab Payment of ₦${collectedAmount.toLocaleString()} for ${patient.patientName} verified! ${remainingBal > 0 ? `Remaining balance of ₦${remainingBal.toLocaleString()} logged to Outstanding Balances.` : "Patient ready for testing."}`,
				);
				setSelectedWalkInVerify(null);
				await fetchInitialData();

				setActionFeedbackModal({
					isOpen: true,
					title:
						remainingBal > 0
							? "Partial Walk-In Payment Verified"
							: "Walk-In Payment Verified & Confirmed",
					message: `Walk-in Lab Payment of ₦${collectedAmount.toLocaleString()} for ${patient.patientName} was verified!${remainingBal > 0 ? ` Remaining ₦${remainingBal.toLocaleString()} recorded in Outstanding Balances.` : ""}`,
					patientName: patient.patientName,
					hospitalNumber: patient.hospitalNumber || "Walk-In Outpatient",
					amount: collectedAmount,
					badgeText: "Updated: Ready for Laboratory Testing",
					details: [
						{
							label: "Payment Method",
							value: walkInVerifyPayMethod || "Cash",
						},
						{
							label: "Amount Collected Now",
							value: `₦${collectedAmount.toLocaleString()}`,
						},
						{
							label: "Total Payable Bill",
							value: `₦${totalAmount.toLocaleString()}`,
						},
						{
							label: "Outstanding Balance",
							value:
								remainingBal > 0
									? `₦${remainingBal.toLocaleString()} (Logged)`
									: "Cleared",
						},
						{
							label: "Department Routing",
							value: "Laboratory Department (Active Queue)",
						},
					],
				});
			} else {
				setError(response.error || "Failed to confirm walk-in payment");
			}
		} catch (err: any) {
			setError(err.message || "Error confirming walk-in payment");
		} finally {
			setIsVerifyingWalkIn(false);
		}
	};

	const handleSelectQueueItem = (q: any) => {
		const pat = patients.find((p) => p.id === q.patient_id);
		if (!pat) return;

		setSelectedPatient(pat);

		// Check if there is an active/unpaid invoice for this encounter in the database!
		const activeInvoice = invoices.find(
			(inv) =>
				inv.encounter_id === q.encounter_id && inv.status === "Unpaid",
		);

		let totalB = 0;
		if (activeInvoice) {
			totalB = Number(activeInvoice.amount) || 0;
			setPayAmount(String(activeInvoice.amount));
			setPayPurpose(activeInvoice.description ?? "");
			setPayRef(activeInvoice.id);
		} else {
			if (q.queue_type === "Cashier Consultation Payment") {
				totalB = 5000;
				setPayAmount("5000");
				setPayPurpose("Consultation Fee");
				setPayRef("");
			} else if (q.queue_type === "Cashier Lab Payment") {
				totalB = 8500;
				setPayAmount("8500"); // Seed a high fidelity suggested lab package fee
				setPayPurpose("Laboratory Investigations Fee");
				setPayRef("");
			} else if (q.queue_type === "Cashier Pharmacy Payment") {
				totalB = 5000;
				setPayAmount("5000"); // Seed a high fidelity suggested pharmacy fee
				setPayPurpose("Prescribed Pharmacy Dispensing Fee");
				setPayRef("");
			} else {
				totalB = getSuggested(pat);
				setPayAmount(String(totalB));
				setPayPurpose("Registration Card Fee");
				setPayRef("");
			}
		}
		setSelectedTotalBill(totalB);
	};

	const handleSelectWalkInForBilling = (item: any) => {
		const totalB = Number(item.totalAmount) || 0;
		setSelectedPatient({
			id: item.patientId || item.encounterId || `WALKIN-${Date.now()}`,
			name: item.patientName,
			hospitalNumber: item.hospitalNumber || "Walk-In Patient",
			cardType: "Standard",
			patientCategory: "Walk-In Diagnostic",
			phoneNumber: item.phoneNumber,
			dateOfBirth: item.registrationDate,
		} as Patient);
		setPayAmount(String(totalB));
		setSelectedTotalBill(totalB);
		setPayPurpose(
			item.testsSummary
				? `Walk-in Lab: ${item.testsSummary}`
				: "Walk-in Laboratory Request",
		);
		setPayRef(item.encounterId || item.invoiceId || "");
	};

	const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedPatient) {
			setError("Please select a patient first.");
			return;
		}

		const amt = parseFloat(payAmount);
		if (isNaN(amt) || amt <= 0) {
			setError("Please specify a valid payment amount.");
			return;
		}

		const totalB = selectedTotalBill > 0 ? selectedTotalBill : amt;

		setIsLoading(true);
		setError("");
		setSuccess("");

		try {
			let response;
			const isWalkIn =
				selectedPatient.patientCategory === "Walk-In Diagnostic" ||
				payPurpose.toLowerCase().includes("walk-in");

			if (amt < totalB) {
				response = await apiFetch("/payments/partial", {
					method: "POST",
					body: JSON.stringify({
						patientId: selectedPatient.id,
						encounterId: payRef || null,
						invoiceId: payRef || null,
						totalBill: totalB,
						amountPaid: amt,
						paymentMethod: payMethod,
						purpose: payPurpose || "Outpatient Services",
						department: isWalkIn
							? "Laboratory"
							: selectedPatient.cardType === "Emergency"
								? "Emergency Desk"
								: "OPD Reception",
					}),
				});
			} else if (isWalkIn && payRef) {
				response = await apiFetch("/payments/lab/confirm-walk-in", {
					method: "POST",
					body: JSON.stringify({
						encounterId: payRef,
						amount: amt,
						totalAmount: totalB,
						paymentMethod: payMethod,
					}),
				});
			} else {
				response = await apiFetch("/payments", {
					method: "POST",
					body: JSON.stringify({
						patientId: selectedPatient.id,
						amount: amt,
						paymentMethod: payMethod,
						status: "Completed",
						invoiceId: payRef || undefined, // pass the real invoice id only; backend sanitizer handles the rest
					}),
				});
			}

			if (response.success) {
				const remainingBal = Math.max(0, totalB - amt);
				if (remainingBal > 0) {
					setSuccess(
						`Partial payment of ₦${amt.toLocaleString()} processed for ${selectedPatient.name}! Remaining balance of ₦${remainingBal.toLocaleString()} sent to Outstanding Balances.`,
					);
				} else {
					setSuccess(
						`Successfully processed payment of ₦${amt.toLocaleString()} via ${payMethod} for ${selectedPatient.name}! Patient has been automatically routed to the queue.`,
					);
				}
				setPayAmount("");
				setPayRef("");
				setSelectedTotalBill(0);

				// Optimistically remove patient's queue items & mark unpaid invoices as Paid
				const pid = selectedPatient.id;
				setQueueItems((prev) => prev.filter((q) => q.patient_id !== pid));
				setInvoices((prev) =>
					prev.map((inv) =>
						inv.patient_id === pid ? { ...inv, status: "Paid" } : inv,
					),
				);

				await fetchInitialData();

				const targetPatName = selectedPatient.name;
				const targetHnum = selectedPatient.hospitalNumber;
				setSelectedPatient(null);

				setActionFeedbackModal({
					isOpen: true,
					title:
						remainingBal > 0
							? "Partial Payment Processed"
							: "Payment Settlement Processed",
					message:
						remainingBal > 0
							? `Partial payment of ₦${amt.toLocaleString()} via ${payMethod} processed for ${targetPatName}. Unpaid balance of ₦${remainingBal.toLocaleString()} sent to Outstanding Balances!`
							: `Successfully processed payment of ₦${amt.toLocaleString()} via ${payMethod} for ${targetPatName}!`,
					patientName: targetPatName,
					hospitalNumber: targetHnum,
					amount: amt,
					badgeText:
						remainingBal > 0
							? "Logged to Outstanding Balances"
							: "Routed to Clinical Queue",
					details: [
						{ label: "Payment Method", value: payMethod },
						{
							label: "Amount Collected Now",
							value: `₦${amt.toLocaleString()}`,
						},
						{
							label: "Total Payable Bill",
							value: `₦${totalB.toLocaleString()}`,
						},
						{
							label: "Remaining Balance",
							value:
								remainingBal > 0
									? `₦${remainingBal.toLocaleString()} (Logged to Debt Table)`
									: "Cleared",
						},
						{
							label: "Purpose",
							value: payPurpose || "Consultation / Registration",
						},
					],
				});
			}
		} catch (err: any) {
			setError(err.message || "Failed to record payment transaction.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRecordPVSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const amt = parseFloat(pvAmount);
		if (isNaN(amt) || amt <= 0) {
			setError("Please specify a valid expense amount.");
			return;
		}
		setIsLoading(true);
		setError("");
		setSuccess("");
		try {
			const response = await apiFetch("/payments/vitae", {
				method: "POST",
				body: JSON.stringify({
					personName: pvPersonName,
					description: pvDescription,
					amount: amt,
					approvedByDoctor: pvApprovedByDoctor,
				}),
			});
			if (response.success) {
				setSuccess(
					`Payment Vitae recorded! ₦${amt.toLocaleString()} dispensed to ${pvPersonName} for ${pvDescription}.`,
				);
				setPvPersonName("");
				setPvDescription("");
				setPvAmount("");
				// Refresh vitae list
				const vitaeRes = await apiFetch("/payments/vitae");
				if (vitaeRes.success)
					setPaymentVitae(vitaeRes.data as { amount: number }[]);

				setActionFeedbackModal({
					isOpen: true,
					title: "Payment Vitae (PV) Recorded",
					message: `Payment Vitae voucher of ₦${amt.toLocaleString()} recorded and dispensed to ${pvPersonName}.`,
					amount: amt,
					badgeText: "PV Expense Recorded",
					details: [
						{ label: "Recipient Name", value: pvPersonName },
						{ label: "Expense Reason", value: pvDescription },
						{
							label: "Approved By",
							value: pvApprovedByDoctor || "Management",
						},
					],
				});
			}
		} catch (err: any) {
			setError(err.message || "Failed to record Payment Vitae.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRecordNoChargeSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const cost = parseFloat(ncTreatmentCost);
		if (isNaN(cost) || cost < 0) {
			setError("Please specify a valid treatment cost.");
			return;
		}
		setIsLoading(true);
		setError("");
		setSuccess("");
		try {
			const response = await apiFetch("/payments/no-charge", {
				method: "POST",
				body: JSON.stringify({
					staffName: ncStaffName,
					relationship: ncRelationship,
					patientId: ncPatientId || null,
					treatmentCost: cost,
					treatmentDescription: ncTreatmentDescription,
					approvedByDoctor: ncApprovedByDoctor,
				}),
			});
			if (response.success) {
				setSuccess(
					`No-Charge patient treatment logged successfully! Approved by ${ncApprovedByDoctor}.`,
				);
				setNcStaffName("");
				setNcRelationship("Self");
				setNcPatientId("");
				setNcTreatmentCost("");
				setNcTreatmentDescription("");
				// Refresh lists
				const [noChargeRes, queueRes, patientsRes] = await Promise.all([
					apiFetch("/payments/no-charge"),
					apiFetch("/patients/opd/queue").catch(() => ({
						success: true,
						data: [],
					})),
					apiFetch("/patients").catch(() => ({ success: true, data: [] })),
				]);
				if (noChargeRes.success)
					setNoChargeRecords(
						noChargeRes.data as {
							treatmentCost: number;
							relationship?: string;
						}[],
					);
				if (queueRes.success) setQueueItems(queueRes.data);
				if (patientsRes.success) setPatients(patientsRes.data);

				setActionFeedbackModal({
					isOpen: true,
					title: "No-Charge Treatment Exemption Logged",
					message: `No-Charge exemption of ₦${cost.toLocaleString()} logged for ${ncStaffName}.`,
					amount: cost,
					badgeText: "Staff Exemption Active",
					details: [
						{ label: "Staff / Beneficiary", value: ncStaffName },
						{ label: "Relationship", value: ncRelationship },
						{ label: "Treatment Details", value: ncTreatmentDescription },
						{ label: "Approved By", value: ncApprovedByDoctor },
					],
				});
			}
		} catch (err: any) {
			setError(err.message || "Failed to record No-Charge patient.");
		} finally {
			setIsLoading(false);
		}
	};

	// Helper to map patientId to name & hospital number
	const getPatientDetails = (patId: string | undefined) => {
		const pat = patients.find((p) => p.id === patId);
		if (pat) return { name: pat.name, hNum: pat.hospitalNumber };
		const payRec = payments.find(
			(p) =>
				p.patientId === patId &&
				(p as unknown as Record<string, unknown>).patientName,
		);
		if (
			payRec &&
			(payRec as unknown as Record<string, unknown>).patientName
		) {
			const rec = payRec as unknown as Record<string, unknown>;
			return {
				name: String(rec.patientName),
				hNum: String(rec.hospitalNumber ?? "—"),
			};
		}
		return { name: "Walk-In Outpatient", hNum: "—" };
	};

	// Helper to get staff member username
	const getCollectorName = (userId?: string) => {
		if (!userId) return "System / Auto";
		const found = users.find((u) => u.id === userId);
		return found ? found.name || found.username : "Cashier Desk";
	};

	const getPendingBalanceSuggested = (pat: Patient) => getSuggested(pat);

	const handleSelectPatient = (pat: Patient) => {
		setSelectedPatient(pat);
		const suggested = getSuggested(pat);
		setPayAmount(String(suggested));

		// Set appropriate purpose based on status
		if (pat.cardType === "Maternity") {
			setPayPurpose("Maternity Card Registration");
		} else if (pat.cardType === "Emergency") {
			setPayPurpose("Emergency Trauma Care Ticket");
		} else {
			setPayPurpose("OPD Registration & Card Fee");
		}
	};

	return {
		eyePayMethods,
		setEyePayMethods,
		eyePayAmounts,
		setEyePayAmounts,
		settleItemId,
		setSettleItemId,
		settlePayAmount,
		setSettlePayAmount,
		settlePayMethod,
		setSettlePayMethod,
		isSettling,
		rowPaymentAmounts,
		setRowPaymentAmounts,
		rowPaymentMethods,
		setRowPaymentMethods,
		recordingRowId,
		labSubTab,
		setLabSubTab,
		labPayMethods,
		setLabPayMethods,
		labCategoryFilter,
		setLabCategoryFilter,
		selectedTotalBill,
		setSelectedTotalBill,
		labCustomAmounts,
		setLabCustomAmounts,
		walkInCustomAmounts,
		setWalkInCustomAmounts,
		selectedWalkInVerify,
		setSelectedWalkInVerify,
		walkInVerifyPayMethod,
		setWalkInVerifyPayMethod,
		isVerifyingWalkIn,
		pendingQueueTab,
		setPendingQueueTab,
		selectedPatient,
		setSelectedPatient,
		payAmount,
		setPayAmount,
		payMethod,
		setPayMethod,
		payRef,
		setPayRef,
		payPurpose,
		setPayPurpose,
		pvPersonName,
		setPvPersonName,
		pvDescription,
		setPvDescription,
		pvAmount,
		setPvAmount,
		pvApprovedByDoctor,
		setPvApprovedByDoctor,
		ncStaffName,
		setNcStaffName,
		ncRelationship,
		setNcRelationship,
		ncPatientId,
		setNcPatientId,
		ncTreatmentCost,
		setNcTreatmentCost,
		ncTreatmentDescription,
		setNcTreatmentDescription,
		ncApprovedByDoctor,
		setNcApprovedByDoctor,
		isConfirmingHandover,
		handleConfirmHandover,
		handleConfirmLabPayment,
		handleVerifyEyeRegistration,
		handleSettleOutstanding,
		handleRecordRowPayment,
		handleConfirmWalkInVerification,
		handleSelectQueueItem,
		handleSelectWalkInForBilling,
		handleRecordPaymentSubmit,
		handleRecordPVSubmit,
		handleRecordNoChargeSubmit,
		getPatientDetails,
		getCollectorName,
		getPendingBalanceSuggested,
		handleSelectPatient,
	};
}

export type UseCashierPaymentsReturn = ReturnType<typeof useCashierPayments>;
