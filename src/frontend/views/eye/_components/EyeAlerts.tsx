/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 5 extraction from EyeClinicView.tsx (success/error banners).
 *
 * Shell-level notification banners. Verbatim JSX.
 */

import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface EyeAlertsProps {
	successMsg: string;
	errorMsg: string;
	onClearSuccess: () => void;
	onClearError: () => void;
}

export default function EyeAlerts({ successMsg, errorMsg, onClearSuccess, onClearError }: EyeAlertsProps) {
	return (
		<AnimatePresence>
			{successMsg && (
				<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center gap-3 text-xs font-semibold shadow-xs">
					<CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
					<div className="flex-1">{successMsg}</div>
					<button onClick={onClearSuccess} className="text-emerald-400 hover:text-emerald-600">
						<X className="h-3.5 w-3.5" />
					</button>
				</motion.div>
			)}

			{errorMsg && (
				<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-center gap-3 text-xs font-semibold shadow-xs">
					<AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
					<div className="flex-1">{errorMsg}</div>
					<button onClick={onClearError} className="text-rose-400 hover:text-rose-600">
						<X className="h-3.5 w-3.5" />
					</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
