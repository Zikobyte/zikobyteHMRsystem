/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (Billing: PatientLookup).
 */

import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import type { Patient } from "@/types";

export interface PatientLookupProps {
  searchQuery: string;
  filteredPatients: Patient[];
  setSearchQuery: (v: string) => void;
  handleSelectPatient: (pat: Patient) => void;
}

export default function PatientLookup({
  searchQuery,
  filteredPatients,
  setSearchQuery,
  handleSelectPatient,
}: PatientLookupProps) {
  return (
    <>
						{/* Section A: Search & Lookup */}
						<div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
								1. Patient Account Lookup
							</h3>
							<div className="relative">
								<Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
								<input
									type="text"
									placeholder="Search Name, Hospital # or Phone..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 font-medium placeholder-slate-400"
								/>
							</div>

							{/* Live Search dropdown results */}
							<AnimatePresence>
								{searchQuery && filteredPatients.length > 0 && (
									<motion.div
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										className="mt-3 max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50 bg-white"
									>
										{filteredPatients.map((pat) => (
											<button
												key={pat.id}
												onClick={() => {
													handleSelectPatient(pat);
													setSearchQuery("");
												}}
												className="w-full p-2.5 text-left text-xs hover:bg-slate-50 flex items-center justify-between transition-all"
											>
												<div>
													<p className="font-bold text-slate-800">
														{pat.name}
													</p>
													<p className="text-[10px] text-[#2A758C] font-mono mt-0.5">
														{pat.hospitalNumber}
													</p>
												</div>
												<span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase">
													{pat.cardType || "Patient"}
												</span>
											</button>
										))}
									</motion.div>
								)}

								{searchQuery && filteredPatients.length === 0 && (
									<div className="p-3 text-center text-xs text-slate-400 mt-2">
										No matching patients found.
									</div>
								)}
							</AnimatePresence>
						</div>
    </>
  );
}
