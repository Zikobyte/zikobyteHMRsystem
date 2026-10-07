/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (ViewTestsModal).
 */

import { FlaskConical, X } from "lucide-react";

export interface ViewTestsData {
  patientName: string;
  hospitalNumber?: string;
  testsList?: string[];
  testsSummary?: string;
  totalAmount?: number;
}

export interface ViewTestsModalProps {
  viewTestsModal: ViewTestsData | null;
  setViewTestsModal: (v: ViewTestsData | null) => void;
}

export default function ViewTestsModal({
  viewTestsModal,
  setViewTestsModal,
}: ViewTestsModalProps) {
  return (
    <>
			{/* MODAL: View Ordered Lab Tests Breakdown */}
			{viewTestsModal && (
				<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
						<div className="flex items-start justify-between border-b border-slate-100 pb-4">
							<div>
								<h3 className="text-base font-black text-slate-800 flex items-center gap-2">
									<FlaskConical className="h-5 w-5 text-[#2A758C]" />{" "}
									Ordered Laboratory Tests
								</h3>
								<p className="text-xs text-slate-500 mt-1">
									Patient:{" "}
									<span className="font-extrabold text-slate-800">
										{viewTestsModal.patientName}
									</span>{" "}
									({viewTestsModal.hospitalNumber || "Walk-In"})
								</p>
							</div>
							<button
								type="button"
								onClick={() => setViewTestsModal(null)}
								className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Tests List Table */}
						<div className="space-y-3 max-h-72 overflow-y-auto pr-1">
							<p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
								Ordered Investigations Breakdown
							</p>
							<div className="divide-y divide-slate-100 bg-slate-50/70 rounded-2xl border border-slate-100 p-3">
								{viewTestsModal.testsList &&
								viewTestsModal.testsList.length > 0 ? (
									viewTestsModal.testsList.map(
										(testName: string, tIdx: number) => (
											<div
												key={tIdx}
												className="py-2.5 flex items-center justify-between text-xs"
											>
												<span className="font-extrabold text-slate-800 flex items-center gap-2">
													<span className="h-2 w-2 rounded-full bg-[#2A758C]"></span>
													{testName}
												</span>
												<span className="font-mono font-bold text-slate-600">
													Included in Order
												</span>
											</div>
										),
									)
								) : viewTestsModal.testsSummary ? (
									viewTestsModal.testsSummary
										.split("; ")
										.map((testStr: string, tIdx: number) => (
											<div
												key={tIdx}
												className="py-2.5 flex items-center justify-between text-xs"
											>
												<span className="font-extrabold text-slate-800 flex items-center gap-2">
													<span className="h-2 w-2 rounded-full bg-[#2A758C]"></span>
													{testStr}
												</span>
												<span className="font-mono font-bold text-slate-600">
													Ordered
												</span>
											</div>
										))
								) : (
									<div className="py-3 text-xs font-bold text-slate-700">
										Laboratory Investigations Package
									</div>
								)}
							</div>
						</div>

						{/* Total Payable Fee Summary Bar */}
						<div className="bg-[#2A758C]/10 p-4 rounded-2xl border border-[#2A758C]/20 flex items-center justify-between">
							<span className="text-xs font-black text-slate-600 uppercase tracking-wider font-mono">
								Total Payable Fee:
							</span>
							<span className="text-xl font-black text-[#2A758C] font-mono">
								₦{(viewTestsModal.totalAmount || 0).toLocaleString()}
							</span>
						</div>

						<div className="pt-2 flex justify-end">
							<button
								type="button"
								onClick={() => setViewTestsModal(null)}
								className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
    </>
  );
}
