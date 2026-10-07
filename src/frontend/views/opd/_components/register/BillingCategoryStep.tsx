/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx
 * (`renderBillingCategoryProfileStep(formTypeTheme)` render function).
 * Verbatim JSX: billing-category profile cards, family/company conditional
 * panels. No behavior change — everything the function body read arrives as
 * props. Called by all three intake forms with their theme.
 *
 * NOTE: the original body reads family/company names from text inputs
 * (`selectedFamilyId` / `selectedCompanyId` strings), not from the
 * companies/families directory lists, so no list props are required here.
 */

import { motion } from "motion/react";
import { CreditCard, User, Users, Briefcase } from "lucide-react";
import type {
	BillingCategoryState,
	RegistrationFormTheme,
} from "./registrationProps";

export interface BillingCategoryStepProps extends BillingCategoryState {
	formTypeTheme: RegistrationFormTheme;
}

export default function BillingCategoryStep({
	formTypeTheme,
	patientCategory,
	setPatientCategory,
	selectedFamilyId,
	setSelectedFamilyId,
	familyRelationship,
	setFamilyRelationship,
	selectedCompanyId,
	setSelectedCompanyId,
	employeeId,
	setEmployeeId,
	designation,
	setDesignation,
	letterReference,
	setLetterReference,
	letterVerified,
	setLetterVerified,
}: BillingCategoryStepProps) {
	const isMaternity = formTypeTheme === "maternity";
	const isEmergency = formTypeTheme === "emergency";

	const themeBorder = isEmergency
		? "border-rose-200 bg-rose-50/30"
		: isMaternity
			? "border-emerald-200 bg-emerald-50/30"
			: "border-slate-200 bg-slate-50/60";
	const headerColor = isEmergency
		? "text-rose-800"
		: isMaternity
			? "text-emerald-800"
			: "text-slate-800";

	return (
		<div className={`space-y-4 p-4.5 rounded-2xl border ${themeBorder}`}>
			<h4
				className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 ${headerColor}`}
			>
				<CreditCard className="h-4 w-4 text-[#2A758C]" /> 1. Billing
				Category Profile
			</h4>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<label
					className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
						patientCategory === "Individual"
							? "border-[#2A758C] bg-white shadow-2xs ring-2 ring-[#2A758C]/20"
							: "border-slate-200 bg-white/80 hover:bg-white"
					}`}
				>
					<input
						type="radio"
						name={`pCat_${formTypeTheme}`}
						value="Individual"
						checked={patientCategory === "Individual"}
						onChange={() => setPatientCategory("Individual")}
						className="sr-only"
					/>
					<User className="h-5 w-5 text-[#2A758C]" />
					<div className="mt-3">
						<h5 className="text-xs font-bold text-slate-800">
							Individual
						</h5>
						<p className="text-[10px] text-slate-500 mt-0.5">
							Cash / Transfer / POS Direct Payments
						</p>
					</div>
				</label>

				<label
					className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
						patientCategory === "Family"
							? "border-[#2A758C] bg-white shadow-2xs ring-2 ring-[#2A758C]/20"
							: "border-slate-200 bg-white/80 hover:bg-white"
					}`}
				>
					<input
						type="radio"
						name={`pCat_${formTypeTheme}`}
						value="Family"
						checked={patientCategory === "Family"}
						onChange={() => setPatientCategory("Family")}
						className="sr-only"
					/>
					<Users className="h-5 w-5 text-emerald-600" />
					<div className="mt-3">
						<h5 className="text-xs font-bold text-slate-800">
							Family Account
						</h5>
						<p className="text-[10px] text-slate-500 mt-0.5">
							Deduct from Family Deposit Pool
						</p>
					</div>
				</label>

				<label
					className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
						patientCategory === "Company"
							? "border-[#2A758C] bg-white shadow-2xs ring-2 ring-[#2A758C]/20"
							: "border-slate-200 bg-white/80 hover:bg-white"
					}`}
				>
					<input
						type="radio"
						name={`pCat_${formTypeTheme}`}
						value="Company"
						checked={patientCategory === "Company"}
						onChange={() => setPatientCategory("Company")}
						className="sr-only"
					/>
					<Briefcase className="h-5 w-5 text-indigo-600" />
					<div className="mt-3">
						<h5 className="text-xs font-bold text-slate-800">
							Company / HMO Invoice
						</h5>
						<p className="text-[10px] text-slate-500 mt-0.5">
							Corporate Retainership / HMO Coverage
						</p>
					</div>
				</label>
			</div>

			{patientCategory === "Family" && (
				<motion.div
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
								Family Account Name *
							</label>
							<input
								type="text"
								required
								placeholder="e.g. Williams Family"
								value={selectedFamilyId}
								onChange={(e) => setSelectedFamilyId(e.target.value)}
								className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-hidden focus:border-[#2A758C]"
							/>
						</div>
						<div>
							<label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
								Relationship to Head of Family
							</label>
							<select
								value={familyRelationship}
								onChange={(e) =>
									setFamilyRelationship(e.target.value)
								}
								className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-hidden focus:border-[#2A758C]"
							>
								<option value="Spouse">Spouse</option>
								<option value="Child">Child</option>
								<option value="Dependent">Dependent</option>
								<option value="Principal">
									Principal / Head of Family
								</option>
							</select>
						</div>
					</div>
				</motion.div>
			)}

			{patientCategory === "Company" && (
				<motion.div
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs"
				>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<div>
							<label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
								Company / HMO Name *
							</label>
							<input
								type="text"
								required
								placeholder="e.g. Shell Petroleum / Hygeia HMO"
								value={selectedCompanyId}
								onChange={(e) =>
									setSelectedCompanyId(e.target.value)
								}
								className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-hidden focus:border-[#2A758C]"
							/>
						</div>
						<div>
							<label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
								Staff / Policy ID
							</label>
							<input
								type="text"
								placeholder="e.g. EMP-449"
								value={employeeId}
								onChange={(e) => setEmployeeId(e.target.value)}
								className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-hidden focus:border-[#2A758C]"
							/>
						</div>
						<div>
							<label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
								Designation
							</label>
							<input
								type="text"
								placeholder="e.g. Senior Officer"
								value={designation}
								onChange={(e) => setDesignation(e.target.value)}
								className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-hidden focus:border-[#2A758C]"
							/>
						</div>
						<div className="md:col-span-3">
							<label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
								Authorization Ref / HMO Code
							</label>
							<input
								type="text"
								placeholder="e.g. Ref: ZMC-AUTH-882"
								value={letterReference}
								onChange={(e) => setLetterReference(e.target.value)}
								className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-hidden focus:border-[#2A758C]"
							/>
						</div>
						<div className="md:col-span-3">
							<label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-200">
								<input
									type="checkbox"
									checked={letterVerified}
									onChange={(e) =>
										setLetterVerified(e.target.checked)
									}
									className="rounded text-[#2A758C]"
								/>
								<span className="text-[11px] font-bold text-slate-700">
									Corporate authorization / HMO coverage confirmed.
								</span>
							</label>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
