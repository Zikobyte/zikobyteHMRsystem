/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (new-patient registration
 * modal shell). Verbatim JSX: overlay, header, duplicate-warning banner
 * (inlined here — small), mandatory-fields banner, regTab switcher, the
 * `<form onSubmit>` wrapper, and the fee footer with submit/cancel.
 * No behavior change — the three intake forms are composed inside by regTab.
 */

import { motion, AnimatePresence } from "motion/react";
import { UserPlus, X, AlertTriangle, Loader2 } from "lucide-react";
import type { RegTab } from "../_hooks/useRegistrationForm";
import type { OpdDuplicateCandidate } from "../_hooks/useOpdDirectory";
import StandardIntakeForm, {
	type StandardIntakeFormProps,
} from "../_components/register/StandardIntakeForm";
import MaternityIntakeForm, {
	type MaternityIntakeFormProps,
} from "../_components/register/MaternityIntakeForm";
import EmergencyIntakeForm, {
	type EmergencyIntakeFormProps,
} from "../_components/register/EmergencyIntakeForm";
import type {
	CardFeeFn,
	RegistrationSubmitHandler,
} from "../_components/register/registrationProps";

export interface RegistrationModalProps
	extends StandardIntakeFormProps,
		MaternityIntakeFormProps,
		EmergencyIntakeFormProps {
	open: boolean;
	regTab: RegTab;
	showDuplicateWarning: boolean;
	duplicatesFound: OpdDuplicateCandidate[];
	isRegistering: boolean;
	getCalculatedCardFee: CardFeeFn;
	onClose: () => void;
	onSelectDuplicate: (duplicate: OpdDuplicateCandidate) => void;
	onSubmit: RegistrationSubmitHandler;
}

export default function RegistrationModal({
	open,
	regTab,
	setRegTab,
	showDuplicateWarning,
	duplicatesFound,
	isRegistering,
	getCalculatedCardFee,
	onClose,
	onSelectDuplicate,
	onSubmit,
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
	gravida,
	setGravida,
	para,
	setPara,
	lmp,
	setLmp,
	edd,
	setEdd,
	gestationalAge,
	setGestationalAge,
	tribe,
	setTribe,
	occupation,
	setOccupation,
	abortion,
	setAbortion,
	premature,
	setPremature,
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
}: RegistrationModalProps) {
	return (
		<AnimatePresence>
			{open && (
				<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-100 max-h-[90vh] overflow-y-auto shadow-xl space-y-6"
					>
						<div className="flex justify-between items-center pb-4 border-b border-slate-100">
							<div className="flex items-center gap-3">
								<UserPlus className="h-5 w-5 text-[#2A758C]" />
								<h3 className="text-base font-bold text-slate-900">
									ZMC OPD Patient File Intake
								</h3>
							</div>
							<button
								onClick={onClose}
								className="text-slate-400 hover:text-slate-600 cursor-pointer"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Duplicate warnings inside registration modal */}
						{showDuplicateWarning && duplicatesFound.length > 0 && (
							<div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl space-y-3 shadow-xs">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 font-bold text-xs text-rose-800 uppercase tracking-wide">
										<AlertTriangle className="h-4.5 w-4.5 text-rose-600" />
										DUPLICATE PATIENT FILE DETECTED — REGISTRATION
										BLOCKED
									</div>
									<span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-800 font-mono">
										Existing File Exists
									</span>
								</div>
								<p className="text-[11px] leading-relaxed text-rose-800">
									The system found {duplicatesFound.length} existing
									patient record(s) matching this Name or Phone
									Number.
									<strong>
										Duplicate patient registration is blocked
									</strong>{" "}
									to avoid splitting medical records. Please click
									below to open the existing file.
								</p>
								<div className="space-y-2 bg-white/90 p-3 rounded-xl border border-rose-200">
									{duplicatesFound.map((dup) => (
										<div
											key={dup.id}
											className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
										>
											<div className="font-mono">
												<span className="font-bold text-[#2A758C] bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded mr-2">
													{dup.hospital_number ||
														dup.hospitalNumber}
												</span>
												<span className="font-bold text-slate-800">
													{dup.name}
												</span>
												<span className="text-slate-500 text-[11px] ml-2 font-sans">
													({dup.phone_number || dup.phoneNumber}
													)
												</span>
											</div>
											<button
												type="button"
												onClick={() => {
													onSelectDuplicate(dup);
												}}
												className="px-3 py-1.5 bg-[#2A758C] hover:bg-[#205b6d] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
											>
												Open Existing Patient File →
											</button>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Mandatory fields indication banner */}
						<div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 rounded-xl text-slate-700">
							<span className="flex items-center gap-1.5">
								<span className="text-rose-600 font-black text-sm leading-none">
									*
								</span>
								<span>
									Fields marked with a red asterisk are{" "}
									<strong>mandatory</strong> for patient file
									creation.
								</span>
							</span>
							<span className="text-[10px] font-mono uppercase bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded font-bold">
								EMR Requirement
							</span>
						</div>

						{/* Dynamic Registration Tabs at the top */}
						<div
							className="flex bg-slate-100/80 border border-slate-200/80 p-1.5 rounded-2xl gap-1.5"
							id="intake-form-tabs"
						>
							<button
								id="intake-tab-regular"
								type="button"
								onClick={() => {
									setRegTab("standard");
									setCardType("Standard");
									setGender("Male");
								}}
								className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
									regTab === "standard"
										? "bg-[#2A758C] text-white shadow-sm font-black"
										: "bg-white/90 text-slate-700 hover:bg-white border border-slate-200/60 shadow-2xs"
								}`}
							>
								Regular Intake Form
							</button>
							<button
								type="button"
								onClick={() => {
									setRegTab("maternity");
									setCardType("Maternity");
									setGender("Female");
									setMaritalStatus("Married");
								}}
								className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
									regTab === "maternity"
										? "bg-emerald-600 text-white shadow-sm font-black"
										: "bg-white/90 text-emerald-800 hover:bg-white border border-emerald-200/60 shadow-2xs"
								}`}
							>
								Maternity Form
							</button>
							<button
								type="button"
								onClick={() => {
									setRegTab("emergency");
									setCardType("Emergency");
								}}
								className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
									regTab === "emergency"
										? "bg-rose-600 text-white shadow-sm font-black"
										: "bg-white/90 text-rose-800 hover:bg-white border border-rose-200/60 shadow-2xs"
								}`}
							>
								Emergency Intake
							</button>
						</div>

						<form
							onSubmit={onSubmit}
							className="space-y-6 text-slate-700"
						>
							{/* 1. STANDARD REGISTRATION FORM */}
							{regTab === "standard" && (
								<StandardIntakeForm
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
									name={name}
									setName={setName}
									dateOfBirth={dateOfBirth}
									setDateOfBirth={setDateOfBirth}
									gender={gender}
									setGender={setGender}
									phoneNumber={phoneNumber}
									setPhoneNumber={setPhoneNumber}
									address={address}
									setAddress={setAddress}
									maritalStatus={maritalStatus}
									setMaritalStatus={setMaritalStatus}
									cardType={cardType}
									setCardType={setCardType}
									setRegTab={setRegTab}
									triggerDuplicateCheck={triggerDuplicateCheck}
									email={email}
									setEmail={setEmail}
									regIdType={regIdType}
									setRegIdType={setRegIdType}
									regIdNumber={regIdNumber}
									setRegIdNumber={setRegIdNumber}
									regNextOfKinName={regNextOfKinName}
									setRegNextOfKinName={setRegNextOfKinName}
									regNextOfKinPhone={regNextOfKinPhone}
									setRegNextOfKinPhone={setRegNextOfKinPhone}
									regNextOfKinRelationship={regNextOfKinRelationship}
									setRegNextOfKinRelationship={
										setRegNextOfKinRelationship
									}
								/>
							)}

							{/* 2. MATERNITY PATIENT REGISTRATION FORM */}
							{regTab === "maternity" && (
								<MaternityIntakeForm
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
									name={name}
									setName={setName}
									dateOfBirth={dateOfBirth}
									setDateOfBirth={setDateOfBirth}
									gender={gender}
									setGender={setGender}
									phoneNumber={phoneNumber}
									setPhoneNumber={setPhoneNumber}
									address={address}
									setAddress={setAddress}
									maritalStatus={maritalStatus}
									setMaritalStatus={setMaritalStatus}
									cardType={cardType}
									setCardType={setCardType}
									setRegTab={setRegTab}
									triggerDuplicateCheck={triggerDuplicateCheck}
									email={email}
									setEmail={setEmail}
									regIdType={regIdType}
									setRegIdType={setRegIdType}
									regIdNumber={regIdNumber}
									setRegIdNumber={setRegIdNumber}
									regNextOfKinName={regNextOfKinName}
									setRegNextOfKinName={setRegNextOfKinName}
									regNextOfKinPhone={regNextOfKinPhone}
									setRegNextOfKinPhone={setRegNextOfKinPhone}
									regNextOfKinRelationship={regNextOfKinRelationship}
									setRegNextOfKinRelationship={
										setRegNextOfKinRelationship
									}
									gravida={gravida}
									setGravida={setGravida}
									para={para}
									setPara={setPara}
									lmp={lmp}
									setLmp={setLmp}
									edd={edd}
									setEdd={setEdd}
									gestationalAge={gestationalAge}
									setGestationalAge={setGestationalAge}
									tribe={tribe}
									setTribe={setTribe}
									occupation={occupation}
									setOccupation={setOccupation}
									abortion={abortion}
									setAbortion={setAbortion}
									premature={premature}
									setPremature={setPremature}
								/>
							)}

							{/* 3. EMERGENCY INTENSIVE INTAKE FORM */}
							{regTab === "emergency" && (
								<EmergencyIntakeForm
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
									name={name}
									setName={setName}
									dateOfBirth={dateOfBirth}
									setDateOfBirth={setDateOfBirth}
									gender={gender}
									setGender={setGender}
									phoneNumber={phoneNumber}
									setPhoneNumber={setPhoneNumber}
									address={address}
									setAddress={setAddress}
									maritalStatus={maritalStatus}
									setMaritalStatus={setMaritalStatus}
									cardType={cardType}
									setCardType={setCardType}
									setRegTab={setRegTab}
									triggerDuplicateCheck={triggerDuplicateCheck}
									regIdType={regIdType}
									setRegIdType={setRegIdType}
									regIdNumber={regIdNumber}
									setRegIdNumber={setRegIdNumber}
									regNextOfKinName={regNextOfKinName}
									setRegNextOfKinName={setRegNextOfKinName}
									regNextOfKinPhone={regNextOfKinPhone}
									setRegNextOfKinPhone={setRegNextOfKinPhone}
									regNextOfKinRelationship={regNextOfKinRelationship}
									setRegNextOfKinRelationship={
										setRegNextOfKinRelationship
									}
									patientCanProvideDetails={patientCanProvideDetails}
									setPatientCanProvideDetails={
										setPatientCanProvideDetails
									}
									setIsIdVerified={setIsIdVerified}
									setUseIdVerification={setUseIdVerification}
									emergencyGender={emergencyGender}
									setEmergencyGender={setEmergencyGender}
									emergencyMaritalStatus={emergencyMaritalStatus}
									setEmergencyMaritalStatus={
										setEmergencyMaritalStatus
									}
									emergencyEmail={emergencyEmail}
									setEmergencyEmail={setEmergencyEmail}
									broughtInByName={broughtInByName}
									setBroughtInByName={setBroughtInByName}
									broughtInByPhone={broughtInByPhone}
									setBroughtInByPhone={setBroughtInByPhone}
									broughtInByRelationship={broughtInByRelationship}
									setBroughtInByRelationship={
										setBroughtInByRelationship
									}
									broughtInByIdType={broughtInByIdType}
									setBroughtInByIdType={setBroughtInByIdType}
									broughtInByIdNumber={broughtInByIdNumber}
									setBroughtInByIdNumber={setBroughtInByIdNumber}
									isSickEmergency={isSickEmergency}
									setIsSickEmergency={setIsSickEmergency}
									isUnbookedLabour={isUnbookedLabour}
									setIsUnbookedLabour={setIsUnbookedLabour}
									isAccident={isAccident}
									setIsAccident={setIsAccident}
									isDoctorOnCall={isDoctorOnCall}
									setIsDoctorOnCall={setIsDoctorOnCall}
									isAfterHours={isAfterHours}
									setIsAfterHours={setIsAfterHours}
									emergencyDoctorName={emergencyDoctorName}
									setEmergencyDoctorName={setEmergencyDoctorName}
									emergencyTotalBill={emergencyTotalBill}
									setEmergencyTotalBill={setEmergencyTotalBill}
									emergencyCashCollected={emergencyCashCollected}
									setEmergencyCashCollected={
										setEmergencyCashCollected
									}
								/>
							)}

							{/* Footer and Submit Area */}
							<div className="pt-4 border-t border-slate-100 flex justify-between items-center">
								<div className="text-left">
									<p className="text-[10px] text-slate-400 font-bold uppercase font-mono">
										Assigned Registration Fee
									</p>
									<p className="text-base font-mono font-black text-slate-900">
										₦{getCalculatedCardFee().toLocaleString()}
									</p>
								</div>

								<div className="flex gap-3">
									<button
										type="button"
										onClick={onClose}
										className="px-4.5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={
											isRegistering ||
											(showDuplicateWarning &&
												duplicatesFound.length > 0)
										}
										className="px-5 py-2.5 bg-[#A3D1E0] hover:bg-[#82bdcf] disabled:bg-rose-100 disabled:text-rose-700 text-slate-900 font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2"
									>
										{isRegistering && (
											<Loader2 className="h-3 w-3 animate-spin" />
										)}
										{isRegistering
											? "Registering..."
											: showDuplicateWarning &&
												  duplicatesFound.length > 0
												? "Blocked: Duplicate File Exists"
												: "Register Patient Profile"}
									</button>
								</div>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
