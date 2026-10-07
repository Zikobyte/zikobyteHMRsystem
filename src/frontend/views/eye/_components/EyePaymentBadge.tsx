/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx (renderPaymentStatusBadge).
 *
 * Shared payment-status badge used by the registered-patients directory,
 * the consultation queue, and the all-records table. Verbatim JSX.
 */

export interface EyePaymentBadgeProps {
	totalBill: number;
	paid: number;
}

export default function EyePaymentBadge({ totalBill, paid }: EyePaymentBadgeProps) {
	const safeTotal = Math.max(0, totalBill || 0);
	const safePaid = Math.max(0, paid || 0);

	if (!safeTotal || safePaid <= 0) {
		return (
			<span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1 shadow-2xs">
				<span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse"></span>
				Unpaid
			</span>
		);
	}

	if (safePaid >= safeTotal) {
		return (
			<span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1 shadow-2xs">
				<span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
				Paid
			</span>
		);
	}

	const pct = Math.round((safePaid / safeTotal) * 100);
	return (
		<span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-yellow-100 text-amber-900 border border-yellow-300 inline-flex items-center gap-1 shadow-2xs">
			<span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
			Partial ({pct}%)
		</span>
	);
}
