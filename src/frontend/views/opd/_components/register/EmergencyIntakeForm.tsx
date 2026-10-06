/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (`regTab === "emergency"`
 * form body). Verbatim JSX: critical-protocol banner, billing-category step,
 * trauma case profile (conscious toggle), patient ID / brought-in-by panels,
 * emergency multi-charges & doctor-on-call, fast triage vitals. No behavior
 * change — state/handlers arrive as props; `BillingCategoryStep` and
 * `RegistrationVitalsFields` are composed inside.
 */

import { motion } from "motion/react";
import {
	AlertCircle,
	User,
	UserPlus,
	Users,
	CreditCard,
	Activity,
} from "lucide-react";
import BillingCategoryStep from "./BillingCategoryStep";
import RegistrationVitalsFields from "./RegistrationVitalsFields";
import type {
	BillingCategoryState,
	RegistrationVitalsState,
	RegistrationDemographicsState,
	RegistrationIdentityState,
	EmergencyClinicalState,
	RegGender,
} from "./registrationProps";

export interface EmergencyIntakeFormProps
	extends BillingCategoryState,
		RegistrationVitalsState,
		RegistrationDemographicsState,
		RegistrationIdentityState,
		EmergencyClinicalState {
	setGender: (value: RegGender) => void;
}

export default function EmergencyIntakeForm({
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
	setGender,
	phoneNumber,
	setPhoneNumber,
	address,
	setAddress,
	setMaritalStatus,
	cardType,
	setCardType,
	setRegTab,
	triggerDuplicateCheck,
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
	patientCanProvideDetails,
	setPatientCanProvideDetails,
	setIsIdVerified,
	setUseIdVerification,
	emergencyGender,
	setEmergencyGender,
	emergencyMaritalStatus,
	setEmergencyMaritalStatus,
	emergencyEmail,
	setEmergencyEmail,
	broughtInByName,
	setBroughtInByName,
	broughtInByPhone,
	setBroughtInByPhone,
	broughtInByRelationship,
	setBroughtInByRelationship,
	broughtInByIdType,
	setBroughtInByIdType,
	broughtInByIdNumber,
	setBroughtInByIdNumber,
	isSickEmergency,
	setIsSickEmergency,
	isUnbookedLabour,
	setIsUnbookedLabour,
	isAccident,
	setIsAccident,
	isDoctorOnCall,
	setIsDoctorOnCall,
	isAfterHours,
	setIsAfterHours,
	emergencyDoctorName,
	setEmergencyDoctorName,
	emergencyTotalBill,
	setEmergencyTotalBill,
	emergencyCashCollected,
	setEmergencyCashCollected,
}: EmergencyIntakeFormProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6"
		>
			<div className="p-4 bg-rose-50 border border-rose-100 text-rose-900 rounded-2xl flex items-start gap-3">
				<AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
				<div className="text-xs">
					<span className="font-bold">
						CRITICAL PROTOCOL:
					</span>{" "}
					Register and immediately collect cash or
					process. Dispatch patient IMMEDIATELY to the
					doctor on-call. Do not keep emergency
					patients waiting at the reception lobby!
				</div>
			</div>

			<BillingCategoryStep
				formTypeTheme="emergency"
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
				<h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
					<User className="h-4 w-4" /> 2. Emergency
					Trauma Case Profile
				</h4>

				{/* Conscious / Personal Details Provider Toggle */}
				<div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center gap-3">
					<input
						type="checkbox"
						id="patientCanProvideDetails"
						checked={patientCanProvideDetails}
						onChange={(e) => {
							const conscious = e.target.checked;
							setPatientCanProvideDetails(
								conscious,
							);
							setIsIdVerified(false);
							setUseIdVerification(false);
							setRegIdType("");
							setRegIdNumber("");
							if (!conscious) {
								setName(
									"Unidentified Emergency Patient",
								);
								setPhoneNumber("Unknown");
								setAddress(
									"Emergency Trauma Scene",
								);
							} else {
								setName("");
								setPhoneNumber("");
								setAddress("");
							}
						}}
						className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer h-4 w-4"
					/>
					<label
						htmlFor="patientCanProvideDetails"
						className="text-xs font-bold text-rose-900 cursor-pointer select-none"
					>
						Patient is conscious and able to provide
						their own personal/identification details
					</label>
				</div>

				{patientCanProvideDetails ? (
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
									Patient Full Name (or
									Unidentified alias){" "}
									<span className="text-rose-500 font-bold">
										*
									</span>
								</label>
								<input
									type="text"
									required
									placeholder="e.g. John Doe or Trauma Male 1"
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
									Approx Date of Birth{" "}
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
										setDateOfBirth(
											e.target.value,
										)
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
									placeholder="e.g. +23480..."
									value={phoneNumber}
									onChange={(e) => {
										setPhoneNumber(
											e.target.value,
										);
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
									value={emergencyGender}
									onChange={(e) =>
										setEmergencyGender(
											e.target.value as RegGender,
										)
									}
									className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
								>
									<option value="Male">
										Male
									</option>
									<option value="Female">
										Female
									</option>
									<option value="Other">
										Other
									</option>
								</select>
							</div>

							<div>
								<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
									Marital Status{" "}
									<span className="text-rose-500 font-bold">
										*
									</span>
								</label>
								<select
									value={emergencyMaritalStatus}
									onChange={(e) =>
										setEmergencyMaritalStatus(
											e.target.value,
										)
									}
									className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
								>
									<option value="Single">
										Single
									</option>
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
								<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
									Email Address{" "}
									<span className="text-slate-400 font-normal text-[10px] normal-case">
										(Optional)
									</span>
								</label>
								<input
									type="email"
									placeholder="e.g. unknown@gmail.com"
									value={emergencyEmail}
									onChange={(e) =>
										setEmergencyEmail(
											e.target.value,
										)
									}
									className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
								/>
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
										const val = e.target
											.value as
											| "Standard"
											| "Maternity"
											| "Emergency"
											| "Eye Clinic";
										setCardType(val);
										if (val === "Standard") {
											setRegTab("standard");
										} else if (
											val === "Maternity"
										) {
											setRegTab("maternity");
											setGender("Female");
											setMaritalStatus(
												"Married",
											);
										} else if (
											val === "Eye Clinic"
										) {
											setRegTab("standard");
											setCardType("Eye Clinic");
										} else {
											setRegTab("emergency");
										}
									}}
									className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-rose-600"
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

							<div className="md:col-span-2">
								<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
									Residential / Scene Address{" "}
									<span className="text-rose-500 font-bold">
										*
									</span>
								</label>
								<input
									type="text"
									required
									placeholder="e.g. Accident spot, Airport road"
									value={address}
									onChange={(e) =>
										setAddress(e.target.value)
									}
									className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800"
								/>
							</div>
						</div>
					</div>
				) : (
					<div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
						<div className="flex gap-2 items-center text-rose-700 font-bold text-xs">
							<span className="inline-block w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
							<span>
								Patient Unconscious /
								Identification Unavailable
							</span>
						</div>
						<p className="text-[11px] text-slate-600 font-medium">
							The patient's personal profile will be
							registered as{" "}
							<strong className="font-semibold text-slate-900">
								Unidentified Emergency Patient
							</strong>
							. You may update their details later
							from their folder once conscious.
							Please verify the details of the
							bystander or person who brought them
							in below.
						</p>
					</div>
				)}
			</div>

			{/* DYNAMIC: PATIENT ID & NEXT OF KIN OR BROUGHT IN BY DETAILS */}
			{patientCanProvideDetails ? (
				<div className="space-y-4 pt-4 border-t border-slate-100">
					<h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
						<UserPlus className="h-4 w-4" /> 3.
						Patient Identification & Next of Kin
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
								<option value="">
									-- None --
								</option>
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
								placeholder="Enter patient ID number"
								value={regIdNumber}
								onChange={(e) =>
									setRegIdNumber(e.target.value)
								}
								className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
							/>
						</div>

						<div>
							<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
								Next of Kin Full Name
							</label>
							<input
								type="text"
								placeholder="Full name of next of kin"
								value={regNextOfKinName}
								onChange={(e) =>
									setRegNextOfKinName(
										e.target.value,
									)
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
			) : (
				<div className="space-y-4 pt-4 border-t border-slate-100 bg-rose-50/10 p-4 rounded-2xl border border-rose-100/40">
					<h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
						<Users className="h-4 w-4" /> 3. Details
						of Person Who Brought Patient In
					</h4>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
						<div>
							<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
								Brought In By (Full Name){" "}
								<span className="text-rose-500 font-bold">
									*
								</span>
							</label>
							<input
								type="text"
								required
								placeholder="Full name of person who brought them in"
								value={broughtInByName}
								onChange={(e) => {
									setBroughtInByName(
										e.target.value,
									);
									if (
										broughtInByRelationship ===
										"Next of Kin"
									) {
										setRegNextOfKinName(
											e.target.value,
										);
									}
								}}
								className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
							/>
						</div>

						<div>
							<label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
								Brought In By Phone Number{" "}
								<span className="text-rose-500 font-bold">
									*
								</span>
							</label>
							<input
								type="tel"
								required
								placeholder="Phone number of person bringing them in"
								value={broughtInByPhone}
								onChange={(e) => {
									setBroughtInByPhone(
										e.target.value,
									);
									if (
										broughtInByRelationship ===
										"Next of Kin"
									) {
										setRegNextOfKinPhone(
											e.target.value,
										);
									}
								}}
								className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
							/>
						</div>

						<div>
							<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
								Relationship to Patient
							</label>
							<select
								value={broughtInByRelationship}
								onChange={(e) => {
									setBroughtInByRelationship(
										e.target.value,
									);
									setRegNextOfKinRelationship(
										e.target.value,
									);
									if (
										e.target.value ===
										"Next of Kin"
									) {
										setRegNextOfKinName(
											broughtInByName,
										);
										setRegNextOfKinPhone(
											broughtInByPhone,
										);
									}
								}}
								className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-sans"
							>
								<option value="Next of Kin">
									Next of Kin
								</option>
								<option value="Good Samaritan">
									Good Samaritan
								</option>
								<option value="Friend">
									Friend / Colleague
								</option>
								<option value="Police Officer">
									Police Officer
								</option>
								<option value="Paramedic">
									Paramedic / EMT
								</option>
								<option value="Other">
									Other Bystander
								</option>
							</select>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<div>
								<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
									ID Type of Person
								</label>
								<select
									value={broughtInByIdType}
									onChange={(e) =>
										setBroughtInByIdType(
											e.target.value,
										)
									}
									className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-sans"
								>
									<option value="">
										-- None --
									</option>
									<option value="NIN">NIN</option>
									<option value="BVN">BVN</option>
									<option value="Drivers License">
										Driver's License
									</option>
									<option value="Passport">
										Passport
									</option>
								</select>
							</div>

							<div>
								<label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
									ID / Document Number
								</label>
								<input
									type="text"
									placeholder="ID format (Id number)"
									value={broughtInByIdNumber}
									onChange={(e) =>
										setBroughtInByIdNumber(
											e.target.value,
										)
									}
									className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Multi-charges checkboxes */}
			<div className="space-y-4 bg-rose-50/40 p-4.5 rounded-2xl border border-rose-100">
				<h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
					<CreditCard className="h-4 w-4" /> 4.
					Emergency Incident Multi-Charges & Doctor
					on-Call
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
					<label className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 cursor-pointer text-xs font-semibold">
						<input
							type="checkbox"
							checked={isSickEmergency}
							onChange={(e) =>
								setIsSickEmergency(
									e.target.checked,
								)
							}
							className="rounded"
						/>
						<span>
							Sick Emergency Care (+₦25,000)
						</span>
					</label>
					<label className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 cursor-pointer text-xs font-semibold">
						<input
							type="checkbox"
							checked={isUnbookedLabour}
							onChange={(e) =>
								setIsUnbookedLabour(
									e.target.checked,
								)
							}
							className="rounded"
						/>
						<span>
							Unbooked cases / Labour (+₦50,000)
						</span>
					</label>
					<label className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 cursor-pointer text-xs font-semibold col-span-1">
						<input
							type="checkbox"
							checked={isAccident}
							onChange={(e) =>
								setIsAccident(e.target.checked)
							}
							className="rounded"
						/>
						<span>Accident Case (+₦50,000)</span>
					</label>
					<label className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 cursor-pointer text-xs font-semibold col-span-1">
						<input
							type="checkbox"
							checked={
								isDoctorOnCall || isAfterHours
							}
							onChange={(e) => {
								const val = e.target.checked;
								setIsDoctorOnCall(val);
								setIsAfterHours(val);
							}}
							className="rounded"
						/>
						<span>Doctor On-Call (+₦5,000)</span>
					</label>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-rose-100/60 text-slate-700">
					<div>
						<label className="block text-[10px] font-bold text-slate-500 mb-1">
							Assigned Doctor On-Call Name
						</label>
						<input
							type="text"
							required
							placeholder="e.g. Dr. Okafor"
							value={emergencyDoctorName}
							onChange={(e) =>
								setEmergencyDoctorName(
									e.target.value,
								)
							}
							className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-semibold"
						/>
					</div>
					<div>
						<label className="block text-[10px] font-bold text-slate-500 mb-1">
							Total Bill (₦)
						</label>
						<input
							type="text"
							required
							value={emergencyTotalBill}
							onChange={(e) =>
								setEmergencyTotalBill(
									e.target.value,
								)
							}
							className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-bold text-slate-800"
						/>
					</div>
					<div>
						<label className="block text-[10px] font-bold text-slate-500 mb-1">
							Cash Collected (₦)
						</label>
						<input
							type="text"
							required
							placeholder="Minimum ₦5,000"
							value={emergencyCashCollected}
							onChange={(e) =>
								setEmergencyCashCollected(
									e.target.value,
								)
							}
							className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-bold text-emerald-800"
						/>
					</div>
				</div>
			</div>

			{/* Vitals fields */}
			<div className="space-y-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
				<h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono flex items-center gap-1.5">
					<Activity className="h-4 w-4" /> 5. Fast
					Triage Vitals Check
				</h4>
				<RegistrationVitalsFields
					variant="intake"
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
