/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (`regTab === "standard"`
 * form body). Verbatim JSX: billing-category step, demographics & card info,
 * identification & next of kin, adult vitals section. No behavior change —
 * state/handlers arrive as props; `BillingCategoryStep` and
 * `RegistrationVitalsFields` are composed inside.
 */

import { motion } from "motion/react";
import { Activity } from "lucide-react";
import BillingCategoryStep from "./BillingCategoryStep";
import RegistrationVitalsFields from "./RegistrationVitalsFields";
import type {
	BillingCategoryState,
	RegistrationVitalsState,
	RegistrationDemographicsState,
	RegistrationIdentityState,
	RegistrationEmailState,
	RegGender,
} from "./registrationProps";

export interface StandardIntakeFormProps
	extends BillingCategoryState,
		RegistrationVitalsState,
		RegistrationDemographicsState,
		RegistrationIdentityState,
		RegistrationEmailState {
	gender: RegGender;
	setGender: (value: RegGender) => void;
}

export default function StandardIntakeForm({
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
	regBP,
	setRegBP,
	regHR,
	setRegHR,
	regTemp,
	setRegTemp,
	regRR,
	setRegRR,
	regSpo2,
	setRegSpo2,
	regWeight,
	setRegWeight,
	regHeight,
	setRegHeight,
	name,
	setName,
	dateOfBirth,
	setDateOfBirth,
	gender,
	setGender,
	phoneNumber,
	setPhoneNumber,
	address,
	setAddress,
	maritalStatus,
	setMaritalStatus,
	cardType,
	setCardType,
	setRegTab,
	triggerDuplicateCheck,
	email,
	setEmail,
	regIdType,
	setRegIdType,
	regIdNumber,
	setRegIdNumber,
	regNextOfKinName,
	setRegNextOfKinName,
	regNextOfKinPhone,
	setRegNextOfKinPhone,
	regNextOfKinRelationship,
	setRegNextOfKinRelationship,
}: StandardIntakeFormProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6"
		>
			<BillingCategoryStep
				formTypeTheme="standard"
				patientCategory={patientCategory}
				setPatientCategory={setPatientCategory}
				selectedFamilyId={selectedFamilyId}
				setSelectedFamilyId={setSelectedFamilyId}
				familyRelationship={familyRelationship}
				setFamilyRelationship={setFamilyRelationship}
				selectedCompanyId={selectedCompanyId}
				setSelectedCompanyId={setSelectedCompanyId}
				employeeId={employeeId}
				setEmployeeId={setEmployeeId}
				designation={designation}
				setDesignation={setDesignation}
				letterReference={letterReference}
				setLetterReference={setLetterReference}
				letterVerified={letterVerified}
				setLetterVerified={setLetterVerified}
			/>

			<div className="space-y-4 pt-2">
				<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
					2. Demographics & Card Info
				</h4>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
							Full Name{" "}
							<span className="text-rose-500 font-bold">
								*
							</span>
						</label>
						<input
							type="text"
							required
							placeholder="e.g. John Doe"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								triggerDuplicateCheck(
									e.target.value,
									phoneNumber,
								);
							}}
							className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
						/>
					</div>

					<div>
						<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
							Date of Birth{" "}
							<span className="text-rose-500 font-bold">
								*
							</span>
						</label>
						<input
							type="date"
							required
							max={
								new Date()
									.toISOString()
									.split("T")[0]
							}
							min="1900-01-01"
							value={dateOfBirth}
							onChange={(e) =>
								setDateOfBirth(e.target.value)
							}
							className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
						/>
					</div>

					<div>
						<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
							Phone Number{" "}
							<span className="text-rose-500 font-bold">
								*
							</span>
						</label>
						<input
							type="tel"
							required
							placeholder="e.g. +2348000000"
							value={phoneNumber}
							onChange={(e) => {
								setPhoneNumber(e.target.value);
								triggerDuplicateCheck(
									name,
									e.target.value,
								);
							}}
							className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
						/>
					</div>

					<div>
						<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
							Gender{" "}
							<span className="text-rose-500 font-bold">
								*
							</span>
						</label>
						<select
							value={gender}
							onChange={(e) =>
								setGender(e.target.value as RegGender)
							}
							className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
						>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Other">Other</option>
						</select>
					</div>

					<div className="md:col-span-2">
						<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
							Email Address{" "}
							<span className="text-slate-400 font-normal text-[10px] normal-case">
								(Optional)
							</span>
						</label>
						<input
							type="email"
							placeholder="e.g. patient@gmail.com"
							value={email}
							onChange={(e) =>
								setEmail(e.target.value)
							}
							className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
						/>
					</div>

					<div className="md:col-span-2">
						<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
							Residential Address{" "}
							<span className="text-rose-500 font-bold">
								*
							</span>
						</label>
						<input
							type="text"
							required
							placeholder="e.g. No 12 Wuse II, Abuja"
							value={address}
							onChange={(e) =>
								setAddress(e.target.value)
							}
							className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
						/>
					</div>

					<div>
						<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
							Marital Status{" "}
							<span className="text-rose-500 font-bold">
								*
							</span>
						</label>
						<select
							value={maritalStatus}
							onChange={(e) =>
								setMaritalStatus(e.target.value)
							}
							className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
						>
							<option value="Single">Single</option>
							<option value="Married">
								Married
							</option>
							<option value="Divorced">
								Divorced
							</option>
							<option value="Widowed">
								Widowed
							</option>
						</select>
					</div>

					<div>
						<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
							Card Category Type{" "}
							<span className="text-rose-500 font-bold">
								*
							</span>
						</label>
						<select
							value={cardType}
							onChange={(e) => {
								const val = e.target.value as
									| "Standard"
									| "Maternity"
									| "Emergency"
									| "Eye Clinic";
								setCardType(val);
								if (val === "Maternity") {
									setRegTab("maternity");
									setGender("Female");
									setMaritalStatus("Married");
								} else if (val === "Emergency") {
									setRegTab("emergency");
								} else if (val === "Eye Clinic") {
									setCardType("Eye Clinic");
								} else {
									setRegTab("standard");
									setCardType("Standard");
								}
							}}
							className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-[#2A758C]"
						>
							<option value="Standard">
								Standard Card (₦3,000)
							</option>
							<option value="Maternity">
								Maternity Card (₦5,000)
							</option>
							<option value="Emergency">
								Emergency Card
							</option>
							<option value="Eye Clinic">
								Eye Clinic Card (₦3,000)
							</option>
						</select>
					</div>
				</div>
			</div>

			{/* Identification & Next of Kin */}
			<div className="space-y-4 pt-4 border-t border-slate-100">
				<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
					3. Identification & Next of Kin
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
							Government ID Type
						</label>
						<select
							value={regIdType}
							onChange={(e) =>
								setRegIdType(e.target.value)
							}
							className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium font-sans"
						>
							<option value="">-- None --</option>
							<option value="NIN">
								National Identification Number
								(NIN)
							</option>
							<option value="BVN">
								Bank Verification Number (BVN)
							</option>
							<option value="Drivers License">
								Driver's License
							</option>
							<option value="Passport">
								International Passport
							</option>
						</select>
					</div>

					<div>
						<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
							ID / Document Number
						</label>
						<input
							type="text"
							placeholder="Enter selected ID number"
							value={regIdNumber}
							onChange={(e) =>
								setRegIdNumber(e.target.value)
							}
							className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
						/>
					</div>

					<div>
						<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
							Next of Kin Name
						</label>
						<input
							type="text"
							placeholder="Full name of next of kin"
							value={regNextOfKinName}
							onChange={(e) =>
								setRegNextOfKinName(e.target.value)
							}
							className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
						/>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<div>
							<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
								Relationship
							</label>
							<select
								value={regNextOfKinRelationship}
								onChange={(e) =>
									setRegNextOfKinRelationship(
										e.target.value,
									)
								}
								className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-sans"
							>
								<option value="Spouse">
									Spouse
								</option>
								<option value="Parent">
									Parent
								</option>
								<option value="Sibling">
									Sibling
								</option>
								<option value="Child">
									Child
								</option>
								<option value="Friend">
									Friend
								</option>
								<option value="Other">
									Other
								</option>
							</select>
						</div>
						<div>
							<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
								Next of Kin Phone
							</label>
							<input
								type="tel"
								placeholder="Phone number"
								value={regNextOfKinPhone}
								onChange={(e) =>
									setRegNextOfKinPhone(
										e.target.value,
									)
								}
								className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Vital Signs fields (Adult: T - P - R - BP - W - H - SpO2) */}
			<div className="space-y-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
				<h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
					<Activity className="h-4 w-4 text-[#2A758C]" />{" "}
					3. Vital Signs Record (Adult: T – P – R – BP
					– W)
				</h4>
				<RegistrationVitalsFields
					variant="standard"
					regBP={regBP}
					setRegBP={setRegBP}
					regHR={regHR}
					setRegHR={setRegHR}
					regTemp={regTemp}
					setRegTemp={setRegTemp}
					regRR={regRR}
					setRegRR={setRegRR}
					regSpo2={regSpo2}
					setRegSpo2={setRegSpo2}
					regWeight={regWeight}
					setRegWeight={setRegWeight}
					regHeight={regHeight}
					setRegHeight={setRegHeight}
				/>
			</div>
		</motion.div>
	);
}
