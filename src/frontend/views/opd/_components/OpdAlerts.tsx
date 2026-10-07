/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3C extraction from OPDRegistrationView.tsx (alerts block).
 * Verbatim JSX: AnimatePresence success/error banners. No behavior change.
 */

import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export interface OpdAlertsProps {
	success: string;
	error: string;
	onClearSuccess: () => void;
	onClearError: () => void;
}

export default function OpdAlerts({
	success,
	error,
	onClearSuccess,
	onClearError,
}: OpdAlertsProps) {
	return (
		<AnimatePresence>
			{success && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0 }}
					className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-medium"
				>
					<CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
					<div className="flex-1">{success}</div>
					<button
						onClick={onClearSuccess}
						className="text-emerald-400 hover:text-emerald-600"
					>
						<X className="h-4 w-4" />
					</button>
				</motion.div>
			)}

			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0 }}
					className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl flex items-center gap-3 text-sm font-medium"
				>
					<AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
					<div className="flex-1">{error}</div>
					<button
						onClick={onClearError}
						className="text-rose-400 hover:text-rose-600"
					>
						<X className="h-4 w-4" />
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
