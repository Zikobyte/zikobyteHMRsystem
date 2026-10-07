/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (catalogue price
 * modification modal). Verbatim JSX: item code/name display, new-price
 * input, cancel/save footer. No behavior change — price-edit state and
 * submit wiring arrive as props.
 */

import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import type { OpdPriceItem } from "../_hooks/useOpdCatalog";
import type { RegistrationSubmitHandler } from "../_components/register/registrationProps";

export interface PriceEditModalProps {
	open: boolean;
	priceItem: OpdPriceItem | null;
	editPriceVal: string;
	setEditPriceVal: (value: string) => void;
	isSavingPrice: boolean;
	onClose: () => void;
	onSubmit: RegistrationSubmitHandler;
}

export default function PriceEditModal({
	open,
	priceItem,
	editPriceVal,
	setEditPriceVal,
	isSavingPrice,
	onClose,
	onSubmit,
}: PriceEditModalProps) {
	return (
		<AnimatePresence>
			{open && priceItem && (
				<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100 shadow-xl space-y-6"
					>
						<div className="flex justify-between items-center pb-4 border-b border-slate-100">
							<h3 className="text-base font-bold text-slate-900">
								Modify Catalogue Price
							</h3>
							<button
								onClick={onClose}
								className="text-slate-400 hover:text-slate-600"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<form
							onSubmit={onSubmit}
							className="space-y-4"
						>
							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
									Item Code / Name
								</label>
								<input
									type="text"
									disabled
									value={`${priceItem.item_code} - ${priceItem.item_name}`}
									className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500"
								/>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
									New Standard Price (₦)
								</label>
								<input
									type="number"
									required
									value={editPriceVal}
									onChange={(e) => setEditPriceVal(e.target.value)}
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold"
								/>
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
								<button
									type="button"
									onClick={onClose}
									className="px-4.5 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isSavingPrice}
									className="px-5 py-2 bg-[#A3D1E0] hover:bg-[#82bdcf] disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
								>
									{isSavingPrice && (
										<Loader2 className="h-3 w-3 animate-spin" />
									)}
									{isSavingPrice ? "Saving..." : "Save New Price"}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
