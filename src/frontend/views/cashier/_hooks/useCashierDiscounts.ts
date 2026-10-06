/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx.
 * Discounts hook: discount modal/type/value/reason/target +
 * request/submit/approve/reject (apiFetch verbatim).
 */

import { useState } from "react";
import { apiFetch } from "@/utils/api";
import type { CashierActionFeedback } from "./useCashierPayments";

export interface DiscountTarget {
	patientId: string;
	patientName: string;
	hospitalNumber?: string;
	invoiceId?: string;
	encounterId?: string;
	originalAmount: number;
}

export interface UseCashierDiscountsParams {
	fetchInitialData: () => Promise<void>;
	setError: (msg: string) => void;
	setSuccess: (msg: string) => void;
	setIsLoading: (v: boolean) => void;
	setActionFeedbackModal: (
		v: CashierActionFeedback | null,
	) => void;
}

export function useCashierDiscounts({
	fetchInitialData,
	setError,
	setSuccess,
	setIsLoading,
	setActionFeedbackModal,
}: UseCashierDiscountsParams) {
	const [discountModalOpen, setDiscountModalOpen] = useState(false);
	const [discountType, setDiscountType] = useState<"Percentage" | "Fixed">(
		"Percentage",
	);
	const [discountValue, setDiscountValue] = useState<string>("");
	const [discountReason, setDiscountReason] = useState<string>("");
	const [discountTarget, setDiscountTarget] = useState<DiscountTarget | null>(
		null,
	);
	const [isSubmittingDiscount, setIsSubmittingDiscount] = useState(false);

	const handleOpenDiscountModal = (target: {
		patientId: string;
		patientName: string;
		hospitalNumber?: string;
		invoiceId?: string;
		encounterId?: string;
		originalAmount: number;
	}) => {
		setDiscountTarget(target);
		setDiscountType("Percentage");
		setDiscountValue("");
		setDiscountReason("");
		setDiscountModalOpen(true);
	};

	const handleDiscountSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!discountTarget || !discountValue || !discountReason) return;
		const discountNumeric = parseFloat(discountValue);
		if (isNaN(discountNumeric) || discountNumeric <= 0) {
			setError("Please enter a valid discount value greater than zero.");
			return;
		}
		if (discountType === "Percentage" && discountNumeric > 100) {
			setError("Discount percentage cannot exceed 100%.");
			return;
		}
		if (
			discountType === "Fixed" &&
			discountNumeric > discountTarget.originalAmount
		) {
			setError(
				`Fixed discount (₦${discountNumeric.toLocaleString()}) cannot exceed the original bill (₦${discountTarget.originalAmount.toLocaleString()}).`,
			);
			return;
		}

		setIsSubmittingDiscount(true);
		setError("");
		setSuccess("");

		try {
			const res = await apiFetch("/payments/discount-request", {
				method: "POST",
				body: JSON.stringify({
					patientId: discountTarget.patientId,
					patientName: discountTarget.patientName,
					hospitalNumber: discountTarget.hospitalNumber,
					invoiceId: discountTarget.invoiceId,
					encounterId: discountTarget.encounterId,
					originalAmount: discountTarget.originalAmount,
					discountType,
					discountValue: parseFloat(discountValue),
					reason: discountReason,
				}),
			});

			if (res.success) {
				setSuccess(
					`Discount request submitted for ${discountTarget.patientName}! HR approval is now required.`,
				);
				setDiscountModalOpen(false);

				setActionFeedbackModal({
					isOpen: true,
					title: "Discount Request Sent to HR",
					message: `Discount request for ${discountTarget.patientName} has been transmitted to Human Resources & Management for formal authorization.`,
					patientName: discountTarget.patientName,
					hospitalNumber: discountTarget.hospitalNumber,
					amount: res.finalAmount,
					badgeText: "HR Approval Pending",
					details: [
						{ label: "Discount Type", value: discountType },
						{
							label: "Value Requested",
							value:
								discountType === "Percentage"
									? `${discountValue}%`
									: `₦${parseFloat(discountValue).toLocaleString()}`,
						},
						{
							label: "Calculated Discount",
							value: `₦${(res.calculatedDiscount || 0).toLocaleString()}`,
						},
						{
							label: "Final Payable After Approval",
							value: `₦${(res.finalAmount || 0).toLocaleString()}`,
						},
						{ label: "Reason", value: discountReason },
					],
				});

				await fetchInitialData();
			} else {
				setError(res.error || "Failed to submit discount request");
			}
		} catch (err: any) {
			setError(err.message || "Error submitting discount request");
		} finally {
			setIsSubmittingDiscount(false);
		}
	};

	const handleApproveDiscount = async (requestId: string) => {
		setIsLoading(true);
		setError("");
		try {
			const res = await apiFetch(
				`/payments/discount-requests/${requestId}/approve`,
				{
					method: "POST",
				},
			);
			if (res.success) {
				setSuccess(`Discount request approved by HR! Final bill updated.`);
				await fetchInitialData();
			} else {
				setError(res.error || "Failed to approve discount request");
			}
		} catch (err: any) {
			setError(err.message || "Error approving discount request");
		} finally {
			setIsLoading(false);
		}
	};

	const handleRejectDiscount = async (requestId: string) => {
		setIsLoading(true);
		setError("");
		try {
			const res = await apiFetch(
				`/payments/discount-requests/${requestId}/reject`,
				{
					method: "POST",
					body: JSON.stringify({
						rejectionReason: "Declined by HR/Management",
					}),
				},
			);
			if (res.success) {
				setSuccess(`Discount request rejected.`);
				await fetchInitialData();
			} else {
				setError(res.error || "Failed to reject discount request");
			}
		} catch (err: any) {
			setError(err.message || "Error rejecting discount request");
		} finally {
			setIsLoading(false);
		}
	};

	return {
		discountModalOpen,
		setDiscountModalOpen,
		discountType,
		setDiscountType,
		discountValue,
		setDiscountValue,
		discountReason,
		setDiscountReason,
		discountTarget,
		setDiscountTarget,
		isSubmittingDiscount,
		handleOpenDiscountModal,
		handleDiscountSubmit,
		handleApproveDiscount,
		handleRejectDiscount,
	};
}

export type UseCashierDiscountsReturn = ReturnType<typeof useCashierDiscounts>;
