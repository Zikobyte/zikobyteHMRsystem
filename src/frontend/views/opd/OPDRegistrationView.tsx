import AdmissionsView from "@/components/AdmissionsView";
import PatientDetailModal from "@/components/patient-detail/PatientDetailModal";
import { Patient } from "@/types";
import { apiFetch } from "@/utils/api";
import React, { useEffect, useState } from "react";
import ReturningPatientView from "../ReturningPatientView";
import OpdAlerts from "./_components/OpdAlerts";
import OpdHeader from "./_components/OpdHeader";
import { useOpdCatalog } from "./_hooks/useOpdCatalog";
import type { OpdDuplicateCandidate } from "./_hooks/useOpdDirectory";
import { useOpdDirectory } from "./_hooks/useOpdDirectory";
import { useOpdDownloads } from "./_hooks/useOpdDownloads";
import { useOpdQueue } from "./_hooks/useOpdQueue";
import {
	canManageCardReplacements,
	useOpdReplacements,
} from "./_hooks/useOpdReplacements";
import { useRegistrationForm } from "./_hooks/useRegistrationForm";
import CardReplacementModal from "./_modals/CardReplacementModal";
import EncounterModal from "./_modals/EncounterModal";
import EscalatePriorityModal from "./_modals/EscalatePriorityModal";
import FamilyDepositModal from "./_modals/FamilyDepositModal";
import PriceEditModal from "./_modals/PriceEditModal";
import RegistrationModal from "./_modals/RegistrationModal";
import SuccessChecklistModal from "./_modals/SuccessChecklistModal";
import VitalsModal from "./_modals/VitalsModal";
import CatalogTab from "./_tabs/CatalogTab";
import NursingQueueTab from "./_tabs/NursingQueueTab";
import ReceptionTab from "./_tabs/ReceptionTab";
import RecordsTab from "./_tabs/RecordsTab";
import ReplacementsTab from "./_tabs/ReplacementsTab";

interface OPDRegistrationViewProps {
	activeTab?: string;
	initialOpenRegister?: boolean;
	onRegisterModalClose?: () => void;
}

export default function OPDRegistrationView({
	activeTab,
	initialOpenRegister,
	onRegisterModalClose,
}: OPDRegistrationViewProps) {
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [activeSubTab, setActiveSubTab] = useState<
		| "reception"
		| "returning"
		| "admissions"
		| "nursing"
		| "catalog"
		| "records"
		| "replacements"
	>("reception");
	const [selectedDetailPatient, setSelectedDetailPatient] = useState<
		any | null
	>(null);

	// Shell-owned state: global messaging, deposit workflow, and shared
	// modal-context selections stay in this component. Download handlers +
	// dropdown chrome live in _hooks/useOpdDownloads. All other domain
	// state lives in _hooks/ and is composed below.
	const [isSavingDeposit, setIsSavingDeposit] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Deposit modal
	const [isDepositOpen, setIsDepositOpen] = useState(false);

	// Shared modal-context selections (encounter + replacement modals)
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
	const [selectedFamily, setSelectedFamily] = useState<any | null>(null);

	// Deposit Form State
	const [depositAmount, setDepositAmount] = useState("");
	const [depositDescription, setDepositDescription] = useState(
		"Family account top up",
	);

	// Registration form, queue, catalog, and replacement state lives in _hooks/
	// (composed below); only shell chrome remains declared in this file.

	// ---- Phase 3B data hooks (domain state + API handlers live in _hooks/) ----
	// onMutated/onRegistered re-trigger exactly the post-submit refetches the
	// original handlers performed (fetchPatients/fetchQueue/fetchFamilies).
	const {
		patients,
		companies,
		families,
		fetchPatients,
		fetchCompanies,
		fetchFamilies,
		search,
		setSearch,
		filteredPatients,
		duplicatesFound,
		setDuplicatesFound,
		showDuplicateWarning,
		setShowDuplicateWarning,
		triggerDuplicateCheck,
		totalToday,
		standardToday,
		maternityToday,
		emergencyToday,
	} = useOpdDirectory({ notify: { setError } });

	const {
		queueItems,
		fetchQueue,
		selectedQueueItem,
		isQueueing,
		isSavingVitals,
		isEscalating,
		isEncounterOpen,
		setIsEncounterOpen,
		isVitalsOpen,
		setIsVitalsOpen,
		isEscalateOpen,
		setIsEscalateOpen,
		encounterVisitType,
		setEncounterVisitType,
		encounterClinic,
		setEncounterClinic,
		encounterPriority,
		setEncounterPriority,
		encounterReason,
		setEncounterReason,
		handleOpenEncounter: openEncounterQueue,
		handleEncounterSubmit,
		vitalsBP,
		setVitalsBP,
		vitalsTemp,
		setVitalsTemp,
		vitalsPulse,
		setVitalsPulse,
		vitalsResp,
		setVitalsResp,
		vitalsSpo2,
		setVitalsSpo2,
		vitalsWeight,
		setVitalsWeight,
		vitalsHeight,
		setVitalsHeight,
		handleOpenVitals,
		handleVitalsSubmit,
		escalatePriority,
		setEscalatePriority,
		escalateReason,
		setEscalateReason,
		handleOpenEscalate,
		handleEscalateSubmit,
	} = useOpdQueue({
		notify: { setError, setSuccess },
		onMutated: () => fetchPatients(),
	});

	const {
		prices,
		fetchPrices,
		selectedPriceItem,
		editPriceVal,
		setEditPriceVal,
		isPriceEditOpen,
		setIsPriceEditOpen,
		isSavingPrice,
		handleOpenPriceEdit,
		handlePriceEditSubmit,
	} = useOpdCatalog({ notify: { setError, setSuccess } });

	const {
		replacements,
		fetchReplacements,
		isReplacementOpen,
		setIsReplacementOpen,
		isSavingReplacement,
		replacementOldCard,
		replacementNewCard,
		setReplacementNewCard,
		replacementOffice,
		setReplacementOffice,
		replacementReason,
		setReplacementReason,
		handleOpenReplacement: openReplacementLog,
		handleReplacementSubmit,
	} = useOpdReplacements({
		notify: { setError, setSuccess },
		onMutated: () => fetchPatients(),
	});

	const {
		isRegistering,
		regTab,
		setRegTab,
		isRegisterOpen,
		isSuccessModalOpen,
		setIsSuccessModalOpen,
		registeredPatient,
		setRegisteredPatient,
		successCheckedFolder,
		setSuccessCheckedFolder,
		successCheckedCards,
		setSuccessCheckedCards,
		successCheckedReceipt,
		setSuccessCheckedReceipt,
		successCheckedTriage,
		setSuccessCheckedTriage,
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
		abortion,
		setAbortion,
		premature,
		setPremature,
		email,
		setEmail,
		emergencyGender,
		setEmergencyGender,
		emergencyMaritalStatus,
		setEmergencyMaritalStatus,
		emergencyEmail,
		setEmergencyEmail,
		emergencyTotalBill,
		setEmergencyTotalBill,
		emergencyCashCollected,
		setEmergencyCashCollected,
		emergencyDoctorName,
		setEmergencyDoctorName,
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
		isIdVerified,
		setIsIdVerified,
		verifiedFirstName,
		setVerifiedFirstName,
		verifiedLastName,
		setVerifiedLastName,
		verifiedDob,
		setVerifiedDob,
		useIdVerification,
		setUseIdVerification,
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
		getCalculatedCardFee,
		handleOpenRegister,
		handleCloseRegisterModal,
		handleRegisterSubmit,
	} = useRegistrationForm({
		currentUsername: currentUser?.username,
		notify: { setError, setSuccess },
		patients,
		duplicates: {
			duplicatesFound,
			setDuplicatesFound,
			setShowDuplicateWarning,
			triggerDuplicateCheck,
		},
		onRegistered: () => {
			fetchPatients();
			fetchQueue();
			fetchFamilies();
		},
		onRegisterModalClose,
	});

	// Shared-selection wrappers: the encounter/replacement modals render from
	// the shell-owned selectedPatient, so the shell sets it and then delegates
	// to the hook open-handlers. JSX call sites are unchanged.
	const handleOpenEncounter = (patient: Patient) => {
		setSelectedPatient(patient);
		openEncounterQueue(patient);
	};

	const handleOpenReplacement = (patient: Patient) => {
		setSelectedPatient(patient);
		openReplacementLog(patient);
	};

	// Duplicate-banner action: close the intake modal and open the existing
	// patient file (previously inline in RegistrationModal's banner button).
	const handleSelectDuplicate = (duplicate: OpdDuplicateCandidate) => {
		handleCloseRegisterModal();
		setSelectedDetailPatient(duplicate);
	};

	// Sync activeSubTab when parent activeTab changes
	useEffect(() => {
		if (activeTab) {
			if (activeTab === "patients" || activeTab === "patients-reception") {
				setActiveSubTab("reception");
			} else if (activeTab === "patients-returning") {
				setActiveSubTab("returning");
			} else if (activeTab === "patients-admissions") {
				setActiveSubTab("admissions");
			} else if (activeTab === "triage") {
				setActiveSubTab("nursing");
			} else if (
				activeTab === "records" ||
				activeTab === "medical-reports"
			) {
				setActiveSubTab("records");
			} else if (activeTab === "settings") {
				setActiveSubTab("catalog");
			}
		}
	}, [activeTab]);

	useEffect(() => {
		// 1. Get Logged in User
		const saved = localStorage.getItem("zmc_user");
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setCurrentUser(parsed);
				// Set default view based on role
				if (parsed.role === "Nurse" && !activeTab?.startsWith("patients")) {
					setActiveSubTab("nursing");
				} else if (
					parsed.role === "Receptionist" ||
					parsed.role === "Records Officer"
				) {
					setActiveSubTab("reception");
				} else {
					setActiveSubTab("reception");
				}
			} catch (e) {
				// Fallback
			}
		}

		// 2. Load data
		fetchPatients();
		fetchQueue();
		fetchPrices();
		fetchCompanies();
		fetchFamilies();
		// 403-avoidance: GET /opd/cards/replacements allows OPD-group + Cashier only.
		// Skip the fetch for other roles so they never see an unactionable 403.
		try {
			const savedRole = localStorage.getItem("zmc_user");
			const parsedRole = savedRole ? JSON.parse(savedRole)?.role : null;
			if (canManageCardReplacements(parsedRole)) {
				fetchReplacements();
			}
		} catch {
			// If user context is unreachable, stay silent (fetchReplacements itself is 403-tolerant).
		}
	}, []);

	useEffect(() => {
		if (initialOpenRegister) {
			handleOpenRegister("standard");
		}
	}, [initialOpenRegister]);

	const handleOpenDeposit = (family: any) => {
		setSelectedFamily(family);
		setDepositAmount("");
		setDepositDescription("Family account top up");
		setError("");
		setSuccess("");
		setIsDepositOpen(true);
	};

	const handleDepositSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedFamily) return;

		try {
			setIsSavingDeposit(true);
			const response = await apiFetch("/patients/opd/families/deposit", {
				method: "POST",
				body: JSON.stringify({
					familyId: selectedFamily.id,
					amount: parseFloat(depositAmount),
					description: depositDescription,
				}),
			});

			if (response.success) {
				setSuccess("Deposit completed successfully! Balance updated.");
				setIsDepositOpen(false);
				fetchFamilies();
			}
		} catch (err: any) {
			setError(err.message || "Deposit failed");
		} finally {
			setIsSavingDeposit(false);
		}
	};

	// ---- Download handlers (single + bulk excel/doc/pdf) live in _hooks/ ----
	// useOpdDownloads owns the handler bodies plus their dropdown/selection
	// chrome; the shell only composes the hook and threads the callbacks to
	// OpdHeader, tabs, and modals.
	const {
		isHeaderDownloadOpen,
		setIsHeaderDownloadOpen,
		activeDownloadPatientId,
		setActiveDownloadPatientId,
		handleDownloadSingleExcel,
		handleDownloadSingleDoc,
		handleDownloadSinglePdf,
		handleDownloadExcel,
		handleDownloadDoc,
		handleDownloadPdf,
	} = useOpdDownloads({
		filteredPatients,
		search,
		notify: { setError, setSuccess },
	});

	return (
		<div className="p-6 space-y-6 max-w-7xl mx-auto" id="opd-workflow-panel">
			{/* 1. HEADER SECTION */}
			<OpdHeader
				activeSubTab={activeSubTab}
				userRole={currentUser?.role}
				onSubTabChange={(tab) => setActiveSubTab(tab)}
				onOpenRegister={handleOpenRegister}
				onGoReturning={() => setActiveSubTab("returning")}
				isHeaderDownloadOpen={isHeaderDownloadOpen}
				onToggleHeaderDownload={() =>
					setIsHeaderDownloadOpen(!isHeaderDownloadOpen)
				}
				onCloseHeaderDownload={() => setIsHeaderDownloadOpen(false)}
				filteredCount={filteredPatients.length}
				onDownloadExcel={handleDownloadExcel}
				onDownloadDoc={handleDownloadDoc}
				onDownloadPdf={handleDownloadPdf}
			/>

			{/* Dynamic Alerts */}
			<OpdAlerts
				success={success}
				error={error}
				onClearSuccess={() => setSuccess("")}
				onClearError={() => setError("")}
			/>

			{/* ==========================================
          SUBTAB 1: RECEPTION WORKSPACE
          ========================================== */}
			{activeSubTab === "reception" && (
				<ReceptionTab
					totalToday={totalToday}
					standardToday={standardToday}
					maternityToday={maternityToday}
					emergencyToday={emergencyToday}
					search={search}
					onSearchChange={setSearch}
					filteredPatients={filteredPatients}
					userRole={currentUser?.role}
					onOpenRegister={handleOpenRegister}
					onOpenEncounter={handleOpenEncounter}
					onOpenReplacement={handleOpenReplacement}
					onSelectDetail={setSelectedDetailPatient}
					activeDownloadPatientId={activeDownloadPatientId}
					onSetActiveDownloadPatientId={setActiveDownloadPatientId}
					onDownloadSingleExcel={handleDownloadSingleExcel}
					onDownloadSingleDoc={handleDownloadSingleDoc}
					onDownloadSinglePdf={handleDownloadSinglePdf}
					families={families}
					companies={companies}
					onOpenDeposit={handleOpenDeposit}
					onExportSuccess={setSuccess}
					onExportFailure={setError}
				/>
			)}

			{/* ==========================================
          SUBTAB: RETURNING PATIENTS DIRECTORY
          ========================================== */}
			{activeSubTab === "returning" && (
				<ReturningPatientView
					userRole={currentUser?.role}
					onReQueueSuccess={() => {
						fetchQueue();
					}}
				/>
			)}

			{/* ==========================================
          SUBTAB: ADMISSIONS & BALANCE MANAGEMENT
          ========================================== */}
			{activeSubTab === "admissions" && (
				<AdmissionsView userRole={currentUser?.role} />
			)}

			{/* ==========================================
          SUBTAB 2: NURSING FRONT-DESK WORKSPACE (QUEUE)
          ========================================== */}
			{activeSubTab === "nursing" && (
				<NursingQueueTab
					queueItems={queueItems}
					onOpenVitals={handleOpenVitals}
					onOpenEscalate={handleOpenEscalate}
				/>
			)}

			{/* ==========================================
          SUBTAB 3: PRICE CATALOGUE PANEL
          ========================================== */}
			{activeSubTab === "catalog" && (
				<CatalogTab
					prices={prices}
					userRole={currentUser?.role}
					onRefreshPrices={fetchPrices}
					onOpenPriceEdit={handleOpenPriceEdit}
				/>
			)}

			{/* ==========================================
          SUBTAB: MEDICAL REPORTS & HMS ARCHIVE
          ========================================== */}
			{activeSubTab === "records" && (
				<RecordsTab
					search={search}
					onSearchChange={setSearch}
					filteredPatients={filteredPatients}
					onSelectDetail={setSelectedDetailPatient}
				/>
			)}

			{/* ==========================================
          SUBTAB 4: CARD REPLACEMENTS LOG
          ========================================== */}
			{activeSubTab === "replacements" &&
				canManageCardReplacements(currentUser?.role) && (
					<ReplacementsTab replacements={replacements} />
				)}

			{/* Registration modal + intake forms (see _components/register/) */}
			<RegistrationModal
				open={isRegisterOpen}
				regTab={regTab}
				setRegTab={setRegTab}
				showDuplicateWarning={showDuplicateWarning}
				duplicatesFound={duplicatesFound}
				isRegistering={isRegistering}
				getCalculatedCardFee={getCalculatedCardFee}
				onClose={handleCloseRegisterModal}
				onSelectDuplicate={handleSelectDuplicate}
				onSubmit={handleRegisterSubmit}
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
				setRegNextOfKinRelationship={setRegNextOfKinRelationship}
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
				patientCanProvideDetails={patientCanProvideDetails}
				setPatientCanProvideDetails={setPatientCanProvideDetails}
				setIsIdVerified={setIsIdVerified}
				setUseIdVerification={setUseIdVerification}
				emergencyGender={emergencyGender}
				setEmergencyGender={setEmergencyGender}
				emergencyMaritalStatus={emergencyMaritalStatus}
				setEmergencyMaritalStatus={setEmergencyMaritalStatus}
				emergencyEmail={emergencyEmail}
				setEmergencyEmail={setEmergencyEmail}
				broughtInByName={broughtInByName}
				setBroughtInByName={setBroughtInByName}
				broughtInByPhone={broughtInByPhone}
				setBroughtInByPhone={setBroughtInByPhone}
				broughtInByRelationship={broughtInByRelationship}
				setBroughtInByRelationship={setBroughtInByRelationship}
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
				setEmergencyCashCollected={setEmergencyCashCollected}
			/>

			{/* Registration success checklist */}
			<SuccessChecklistModal
				open={isSuccessModalOpen}
				registeredPatient={registeredPatient}
				successCheckedFolder={successCheckedFolder}
				setSuccessCheckedFolder={setSuccessCheckedFolder}
				successCheckedCards={successCheckedCards}
				setSuccessCheckedCards={setSuccessCheckedCards}
				successCheckedReceipt={successCheckedReceipt}
				setSuccessCheckedReceipt={setSuccessCheckedReceipt}
				successCheckedTriage={successCheckedTriage}
				setSuccessCheckedTriage={setSuccessCheckedTriage}
				onRequestClose={() => setIsSuccessModalOpen(false)}
				onCompleted={(patientName) =>
					setSuccess(
						`OPD registration completed! ${patientName} moved to Cashier queue.`,
					)
				}
				onDownloadPdf={handleDownloadSinglePdf}
				onDownloadDoc={handleDownloadSingleDoc}
				onDownloadExcel={handleDownloadSingleExcel}
			/>

			{/* Visit encounter & queueing */}
			<EncounterModal
				open={isEncounterOpen}
				patient={selectedPatient}
				encounterVisitType={encounterVisitType}
				setEncounterVisitType={setEncounterVisitType}
				encounterClinic={encounterClinic}
				setEncounterClinic={setEncounterClinic}
				encounterPriority={encounterPriority}
				setEncounterPriority={setEncounterPriority}
				encounterReason={encounterReason}
				setEncounterReason={setEncounterReason}
				isQueueing={isQueueing}
				onClose={() => setIsEncounterOpen(false)}
				onSubmit={handleEncounterSubmit}
			/>

			{/* Sickness-appropriate vitals */}
			<VitalsModal
				open={isVitalsOpen}
				queueItem={selectedQueueItem}
				vitalsBP={vitalsBP}
				setVitalsBP={setVitalsBP}
				vitalsTemp={vitalsTemp}
				setVitalsTemp={setVitalsTemp}
				vitalsPulse={vitalsPulse}
				setVitalsPulse={setVitalsPulse}
				vitalsResp={vitalsResp}
				setVitalsResp={setVitalsResp}
				vitalsSpo2={vitalsSpo2}
				setVitalsSpo2={setVitalsSpo2}
				vitalsWeight={vitalsWeight}
				setVitalsWeight={setVitalsWeight}
				vitalsHeight={vitalsHeight}
				setVitalsHeight={setVitalsHeight}
				isSavingVitals={isSavingVitals}
				onClose={() => setIsVitalsOpen(false)}
				onSubmit={handleVitalsSubmit}
			/>

			{/* Escalate queue priority */}
			<EscalatePriorityModal
				open={isEscalateOpen && selectedQueueItem !== null}
				escalatePriority={escalatePriority}
				setEscalatePriority={setEscalatePriority}
				escalateReason={escalateReason}
				setEscalateReason={setEscalateReason}
				isEscalating={isEscalating}
				onClose={() => setIsEscalateOpen(false)}
				onSubmit={handleEscalateSubmit}
			/>

			{/* Replace lost clinical card */}
			<CardReplacementModal
				open={isReplacementOpen}
				patient={selectedPatient}
				replacementOldCard={replacementOldCard}
				replacementNewCard={replacementNewCard}
				setReplacementNewCard={setReplacementNewCard}
				replacementOffice={replacementOffice}
				setReplacementOffice={setReplacementOffice}
				replacementReason={replacementReason}
				setReplacementReason={setReplacementReason}
				isSavingReplacement={isSavingReplacement}
				canManageReplacements={canManageCardReplacements(currentUser?.role)}
				onClose={() => setIsReplacementOpen(false)}
				onSubmit={handleReplacementSubmit}
			/>

			{/* Family account deposit top-up */}
			<FamilyDepositModal
				open={isDepositOpen}
				family={selectedFamily}
				depositAmount={depositAmount}
				setDepositAmount={setDepositAmount}
				depositDescription={depositDescription}
				setDepositDescription={setDepositDescription}
				isSavingDeposit={isSavingDeposit}
				onClose={() => setIsDepositOpen(false)}
				onSubmit={handleDepositSubmit}
			/>

			{/* Catalogue price modification */}
			<PriceEditModal
				open={isPriceEditOpen}
				priceItem={selectedPriceItem}
				editPriceVal={editPriceVal}
				setEditPriceVal={setEditPriceVal}
				isSavingPrice={isSavingPrice}
				onClose={() => setIsPriceEditOpen(false)}
				onSubmit={handlePriceEditSubmit}
			/>

			{/* Patient Detailed Medical Record Modal */}
			<PatientDetailModal
				isOpen={!!selectedDetailPatient}
				onClose={() => setSelectedDetailPatient(null)}
				patient={selectedDetailPatient}
			/>
		</div>
	);
}
