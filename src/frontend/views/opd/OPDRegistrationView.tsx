import AdmissionsView from "@/components/AdmissionsView";
import PatientDetailModal from "@/components/PatientDetailModal";
import { Patient } from "@/types";
import { apiFetch } from "@/utils/api";
import React, { useEffect, useState } from "react";
import ReturningPatientView from "../ReturningPatientView";
import OpdAlerts from "./_components/OpdAlerts";
import OpdHeader from "./_components/OpdHeader";
import { useOpdCatalog } from "./_hooks/useOpdCatalog";
import type { OpdDuplicateCandidate } from "./_hooks/useOpdDirectory";
import { useOpdDirectory } from "./_hooks/useOpdDirectory";
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
import { getAge } from "./_utils/opdDates";

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

	// Shell-owned state: global messaging, deposit workflow, download chrome,
	// and shared modal-context selections stay in this component (3C/3D moves
	// the remaining tab JSX, modals, and download handlers). All other domain
	// state lives in _hooks/ and is composed below.
	const [isSavingDeposit, setIsSavingDeposit] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Deposit modal + download chrome
	const [isDepositOpen, setIsDepositOpen] = useState(false);
	const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
	const [isHeaderDownloadOpen, setIsHeaderDownloadOpen] = useState(false);
	const [activeDownloadPatientId, setActiveDownloadPatientId] = useState<
		string | null
	>(null);

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

	const handleDownloadSingleExcel = (p: any) => {
		const headers = [
			"Card / Hospital ID",
			"Patient Name",
			"Gender",
			"Date of Birth",
			"Age",
			"Card Category",
			"Card Category Type",
			"Card Fee (NGN)",
			"Phone Number",
			"Status",
			"Registration Date",
			"Maternity/Expiry Note",
		];
		const rowsToExport: any[][] = [];

		const dobStr = p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "N/A";
		const ageVal = getAge(p.dateOfBirth);
		const regStr = p.registrationDate
			? p.registrationDate.split("T")[0]
			: "N/A";

		if (p.cardType === "Maternity") {
			// Row 1: Standard card details (₦3000)
			rowsToExport.push([
				p.hospitalNumber,
				p.name,
				p.gender,
				dobStr,
				ageVal,
				"Standard",
				"Standard Card (₦3,000)",
				3000,
				p.phoneNumber || "N/A",
				p.status,
				regStr,
				"Permanent hospital card for non-maternity clinical visits.",
			]);
			// Row 2: Maternity card details (₦2000)
			rowsToExport.push([
				p.maternityNumber || p.hospitalNumber.replace("ZMC", "MAT"),
				p.name,
				p.gender,
				dobStr,
				ageVal,
				"Maternity",
				"Maternity Card (₦2,000)",
				2000,
				p.phoneNumber || "N/A",
				p.status,
				regStr,
				"Temporary maternity card. Expires as soon as the baby is born.",
			]);
		} else {
			const cardCatType =
				p.cardType === "Emergency"
					? "Emergency Card"
					: p.cardType === "Maternity"
						? "Maternity Card (₦5,000)"
						: p.cardType === "Eye Clinic"
							? "Eye Clinic Card (₦3,000)"
							: "Standard Card (₦3,000)";

			const expiryNote =
				p.cardType === "Emergency"
					? "Emergency clinical card."
					: p.cardType === "Eye Clinic"
						? "Specialized ocular services card."
						: "Permanent hospital card for non-maternity clinical visits.";

			rowsToExport.push([
				p.hospitalNumber,
				p.name,
				p.gender,
				dobStr,
				ageVal,
				p.cardType || "Standard",
				cardCatType,
				p.cardFee ||
					(p.cardType === "Standard" || p.cardType === "Eye Clinic"
						? 3000
						: 0),
				p.phoneNumber || "N/A",
				p.status,
				regStr,
				expiryNote,
			]);
		}

		const csvRows = [headers.join(",")];
		rowsToExport.forEach((row) => {
			const escaped = row.map((val) => {
				const cleaned = String(val).replace(/"/g, '""');
				return `"${cleaned}"`;
			});
			csvRows.push(escaped.join(","));
		});

		const csvContent = "\uFEFF" + csvRows.join("\n");
		const blob = new Blob([csvContent], { type: "application/octet-stream" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`ZMC_Patient_Card_${p.hospitalNumber}_${p.name.replace(/\s+/g, "_")}.csv`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		setSuccess(`Downloaded Excel CSV for ${p.name}`);
	};

	const handleDownloadSingleDoc = (p: any) => {
		const isMaternity = p.cardType === "Maternity";
		const matId =
			p.maternityNumber ||
			(p.hospitalNumber ? p.hospitalNumber.replace("ZMC", "MAT") : "N/A");

		const card1Html = `
      <div class="card-container">
        <div class="card-title">Card 1: Permanent Hospital Clinical Card</div>
        <table class="info-table">
          <tr>
            <td class="label">Hospital ID / Number:</td>
            <td><span class="hospital-id">${p.hospitalNumber}</span></td>
          </tr>
          <tr>
            <td class="label">Patient Name:</td>
            <td class="value">${p.name}</td>
          </tr>
          <tr>
            <td class="label">Gender / Sex:</td>
            <td class="value">${p.gender}</td>
          </tr>
          <tr>
            <td class="label">Date of Birth:</td>
            <td class="value">${p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "N/A"}</td>
          </tr>
          <tr>
            <td class="label">Current Age:</td>
            <td class="value">${getAge(p.dateOfBirth)} Years</td>
          </tr>
          <tr>
            <td class="label">Card Category:</td>
            <td class="value" style="color: #0369a1;">Standard</td>
          </tr>
          <tr>
            <td class="label">Card Fee Paid:</td>
            <td class="value">₦3,000 NGN</td>
          </tr>
          <tr>
            <td class="label">Phone Number:</td>
            <td class="value">${p.phoneNumber || "N/A"}</td>
          </tr>
          <tr>
            <td class="label">Usage & Validity:</td>
            <td class="value" style="color: #16a34a; font-weight: bold;">PERMANENT - Use this card for all regular, non-maternity clinic visits.</td>
          </tr>
        </table>
      </div>
    `;

		const card2Html = isMaternity
			? `
      <div class="card-container" style="margin-top: 30px; border-color: #ec4899; background-color: #fdf2f8;">
        <div class="card-title" style="color: #db2777; border-bottom-color: #fbcfe8;">Card 2: Temporary Maternity ID Card</div>
        <table class="info-table">
          <tr>
            <td class="label" style="color: #db2777;">Maternity ID / Number:</td>
            <td><span class="hospital-id" style="background-color: #fce7f3; color: #db2777; border-color: #fbcfe8;">${matId}</span></td>
          </tr>
          <tr>
            <td class="label">Patient Name:</td>
            <td class="value">${p.name}</td>
          </tr>
          <tr>
            <td class="label">Gender / Sex:</td>
            <td class="value">${p.gender}</td>
          </tr>
          <tr>
            <td class="label">Card Category:</td>
            <td class="value" style="color: #db2777;">Maternity</td>
          </tr>
          <tr>
            <td class="label">Card Fee Paid:</td>
            <td class="value">₦2,000 NGN</td>
          </tr>
          <tr>
            <td class="label">LMP Date:</td>
            <td class="value">${p.maternityDetails?.lmp || "N/A"}</td>
          </tr>
          <tr>
            <td class="label">EDD Date:</td>
            <td class="value">${p.maternityDetails?.edd || "N/A"}</td>
          </tr>
          <tr>
            <td class="label">Usage & Validity:</td>
            <td class="value" style="color: #be185d; font-weight: bold;">TEMPORARY - This ID expires as soon as the baby is born. Non-maternity visits require the Standard Hospital ID.</td>
          </tr>
        </table>
      </div>
    `
			: "";

		const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Patient Medical Registry Card - ${p.name}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #334155; margin: 40px; }
          .header { text-align: center; border-bottom: 3px double #2A758C; padding-bottom: 15px; margin-bottom: 30px; }
          .title { font-size: 26px; font-weight: bold; color: #2A758C; text-transform: uppercase; margin: 0; }
          .subtitle { font-size: 13px; color: #64748b; margin: 5px 0 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
          .card-container { border: 2px solid #2A758C; padding: 25px; border-radius: 15px; background-color: #f8fafc; margin-top: 20px; }
          .card-title { font-size: 18px; font-weight: bold; color: #2A758C; margin-bottom: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
          .info-table { width: 100%; border-collapse: collapse; }
          .info-table td { padding: 10px; font-size: 12px; }
          .label { font-weight: bold; color: #64748b; width: 30%; text-transform: uppercase; font-size: 10px; }
          .value { color: #0f172a; font-size: 13px; font-weight: 600; }
          .hospital-id { font-family: Courier, monospace; font-size: 18px; font-weight: bold; color: #2A758C; background-color: #e0f2fe; padding: 5px 10px; border-radius: 5px; display: inline-block; }
          .footer { margin-top: 40px; font-size: 10px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <p class="title">Zikora Medical Center</p>
          <p class="subtitle">Official Patient Registry Card / Demographics Record</p>
        </div>

        ${card1Html}
        ${card2Html}

        <p class="footer">
          This is an official document generated from the Zikora Medical Center Out-Patient Department. Confidentiality of patient medical records is protected by clinical policy.
        </p>
      </body>
      </html>
    `;

		const blob = new Blob(["\ufeff" + docHtml], {
			type: "application/octet-stream",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`ZMC_Patient_Card_${p.hospitalNumber}_${p.name.replace(/\s+/g, "_")}.doc`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		setSuccess(`Downloaded Word document for ${p.name}`);
	};

	const handleDownloadSinglePdf = async (p: any) => {
		const { jsPDF } = await import("jspdf");
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "a4",
		});

		const isMaternity = p.cardType === "Maternity";
		const matId =
			p.maternityNumber ||
			(p.hospitalNumber ? p.hospitalNumber.replace("ZMC", "MAT") : "N/A");

		const drawCardPage = (
			cardNumber: string,
			category: string,
			isMatPage: boolean,
		) => {
			// Background light slate color for the page
			doc.setFillColor(
				isMatPage ? 253 : 248,
				isMatPage ? 244 : 250,
				isMatPage ? 245 : 252,
			);
			doc.rect(0, 0, 210, 297, "F");

			// Draw card container in the center
			const cardX = 30;
			const cardY = 40;
			const cardW = 150;
			const cardH = 200;

			// Draw card border
			doc.setFillColor(255, 255, 255);
			doc.setDrawColor(
				isMatPage ? 244 : 226,
				isMatPage ? 180 : 232,
				isMatPage ? 200 : 240,
			);
			doc.roundedRect(cardX, cardY, cardW, cardH, 5, 5, "FD");

			// Draw colored card header bar (Pink for maternity, Teal for standard)
			if (isMatPage) {
				doc.setFillColor(219, 39, 119); // Pink #db2777
			} else {
				doc.setFillColor(42, 117, 140); // Teal #2A758C
			}
			doc.rect(cardX, cardY, cardW, 25, "F");

			// Header Title
			doc.setTextColor(255, 255, 255);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(16);
			doc.text("ZIKORA MEDICAL CENTER", cardX + cardW / 2, cardY + 11, {
				align: "center",
			});

			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);
			doc.text(
				isMatPage
					? "OFFICIAL MATERNITY CLINICAL CARD"
					: "OFFICIAL PATIENT REGISTRY CARD",
				cardX + cardW / 2,
				cardY + 18,
				{ align: "center" },
			);

			// Draw dynamic initial circle avatar
			doc.setFillColor(
				isMatPage ? 253 : 241,
				isMatPage ? 242 : 245,
				isMatPage ? 248 : 249,
			);
			if (isMatPage) {
				doc.setDrawColor(219, 39, 119);
			} else {
				doc.setDrawColor(42, 117, 140);
			}
			doc.setLineWidth(1);
			doc.circle(cardX + cardW / 2, cardY + 50, 18, "FD");

			// Avatar initial letter
			if (isMatPage) {
				doc.setTextColor(219, 39, 119);
			} else {
				doc.setTextColor(42, 117, 140);
			}
			doc.setFont("helvetica", "bold");
			doc.setFontSize(22);
			doc.text(
				(p.name || "P").charAt(0).toUpperCase(),
				cardX + cardW / 2,
				cardY + 52,
				{ align: "center" },
			);

			// Patient Name
			doc.setTextColor(15, 23, 42);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(18);
			doc.text(p.name || "N/A", cardX + cardW / 2, cardY + 78, {
				align: "center",
			});

			// Card category badge
			if (isMatPage) {
				doc.setFillColor(252, 231, 243); // pink-100
				doc.roundedRect(
					cardX + cardW / 2 - 25,
					cardY + 84,
					50,
					7,
					3,
					3,
					"F",
				);
				doc.setTextColor(190, 24, 74); // pink-700
			} else {
				doc.setFillColor(224, 242, 254); // blue-100
				doc.roundedRect(
					cardX + cardW / 2 - 25,
					cardY + 84,
					50,
					7,
					3,
					3,
					"F",
				);
				doc.setTextColor(3, 105, 161); // blue-700
			}
			doc.setFont("helvetica", "bold");
			doc.setFontSize(8);
			doc.text(
				`${category} Access`.toUpperCase(),
				cardX + cardW / 2,
				cardY + 89,
				{ align: "center" },
			);

			// Hospital Number Container
			if (isMatPage) {
				doc.setFillColor(253, 242, 248);
				doc.setDrawColor(244, 180, 200);
			} else {
				doc.setFillColor(240, 249, 255);
				doc.setDrawColor(186, 230, 253);
			}
			doc.roundedRect(cardX + 15, cardY + 100, cardW - 30, 22, 4, 4, "FD");

			doc.setTextColor(
				isMatPage ? 190 : 3,
				isMatPage ? 24 : 105,
				isMatPage ? 74 : 161,
			);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(9);
			doc.text(
				isMatPage ? "TEMPORARY MATERNITY FILE ID" : "HOSPITAL FILE NUMBER",
				cardX + cardW / 2,
				cardY + 106,
				{ align: "center" },
			);

			doc.setTextColor(
				isMatPage ? 219 : 42,
				isMatPage ? 39 : 117,
				isMatPage ? 119 : 140,
			);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(18);
			doc.text(cardNumber, cardX + cardW / 2, cardY + 117, {
				align: "center",
			});

			// Detail fields
			const startFieldY = cardY + 132;
			const colW = (cardW - 30) / 2;
			const leftColX = cardX + 15;
			const rightColX = cardX + 15 + colW;

			const drawField = (
				x: number,
				y: number,
				label: string,
				value: string,
			) => {
				doc.setTextColor(100, 116, 139);
				doc.setFont("helvetica", "bold");
				doc.setFontSize(8);
				doc.text(label.toUpperCase(), x, y);

				doc.setTextColor(30, 41, 59);
				doc.setFont("helvetica", "bold");
				doc.setFontSize(11);
				doc.text(value, x, y + 6);
			};

			const age = getAge(p.dateOfBirth);
			const dobFormatted = p.dateOfBirth
				? p.dateOfBirth.split("T")[0]
				: "N/A";

			if (isMatPage) {
				drawField(
					leftColX,
					startFieldY,
					"LMP Date",
					p.maternityDetails?.lmp || "Not Recorded",
				);
				drawField(
					rightColX,
					startFieldY,
					"Estimated EDD",
					p.maternityDetails?.edd || "Not Calculated",
				);

				drawField(
					leftColX,
					startFieldY + 16,
					"Gravida / Para",
					`G: ${p.maternityDetails?.gravida || "0"} / P: ${p.maternityDetails?.para || "0"}`,
				);
				drawField(
					rightColX,
					startFieldY + 16,
					"Obstetric Status",
					p.maternityDetails?.gestationalAge || "Antenatal Client",
				);
			} else {
				drawField(leftColX, startFieldY, "Gender", p.gender || "N/A");
				drawField(
					rightColX,
					startFieldY,
					"Age / DOB",
					`${age} Yrs (${dobFormatted})`,
				);

				drawField(
					leftColX,
					startFieldY + 16,
					"Contact Phone",
					p.phoneNumber || "N/A",
				);
				const regFormatted = p.registrationDate
					? p.registrationDate.split("T")[0]
					: "N/A";
				drawField(
					rightColX,
					startFieldY + 16,
					"Registration Date",
					regFormatted,
				);
			}

			// Status block across full width
			doc.setFillColor(
				isMatPage ? 253 : 248,
				isMatPage ? 242 : 250,
				isMatPage ? 248 : 252,
			);
			doc.roundedRect(
				cardX + 15,
				startFieldY + 28,
				cardW - 30,
				12,
				2,
				2,
				"F",
			);

			doc.setTextColor(100, 116, 139);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(8);
			doc.text(
				isMatPage
					? "MATERNITY ID VALIDITY NOTICE:"
					: "CURRENT CLINICAL STATUS:",
				cardX + 20,
				startFieldY + 36,
			);

			doc.setTextColor(
				isMatPage ? 190 : 42,
				isMatPage ? 24 : 117,
				isMatPage ? 74 : 140,
			);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(9);
			doc.text(
				isMatPage
					? "EXPIRES PROMPTLY ON BIRTH"
					: p.status || "Active Registry",
				cardX + 75,
				startFieldY + 36,
			);

			// Card Footer
			doc.setDrawColor(241, 245, 249);
			doc.line(cardX + 10, cardY + 185, cardX + cardW - 10, cardY + 185);

			doc.setTextColor(148, 163, 184);
			doc.setFont("helvetica", "normal");
			doc.setFontSize(7.5);
			if (isMatPage) {
				doc.text(
					"Temporary maternity ID. Expires post-delivery. Regular visits require Standard ID card.",
					cardX + cardW / 2,
					cardY + 192,
					{ align: "center" },
				);
			} else {
				doc.text(
					"Confidential medical ID. If found, return to Zikora Medical Center OPD Reception.",
					cardX + cardW / 2,
					cardY + 192,
					{ align: "center" },
				);
			}
		};

		// Draw Standard card on page 1
		drawCardPage(
			p.hospitalNumber,
			isMaternity ? "Standard" : p.cardType || "Standard",
			false,
		);

		// If Maternity, add page 2 and draw Maternity card
		if (isMaternity) {
			doc.addPage();
			drawCardPage(matId, "Maternity", true);
		}

		doc.save(
			`ZMC_Patient_Card_${p.hospitalNumber}_${p.name.replace(/\s+/g, "_")}.pdf`,
		);
		setSuccess(`Downloaded PDF card for ${p.name}`);
	};

	const handleDownloadExcel = () => {
		const headers = [
			"Hospital Number",
			"Patient Name",
			"Gender",
			"Date of Birth",
			"Age",
			"Card Category",
			"Phone Number",
			"Status",
			"Registration Date",
		];
		const rows = filteredPatients.map((p) => [
			p.hospitalNumber,
			p.name,
			p.gender,
			p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "N/A",
			getAge(p.dateOfBirth),
			p.cardType,
			p.phoneNumber,
			p.status,
			p.registrationDate ? p.registrationDate.split("T")[0] : "N/A",
		]);

		const csvContent =
			"\uFEFF" +
			[
				headers.join(","),
				...rows.map((row) =>
					row
						.map((val) => {
							const cleaned = String(val).replace(/"/g, '""');
							return `"${cleaned}"`;
						})
						.join(","),
				),
			].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `ZMC_Patients_List_${new Date().toISOString().split("T")[0]}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.setTimeout(() => URL.revokeObjectURL(url), 0);
		setIsDownloadDropdownOpen(false);
		setSuccess("Downloaded Excel CSV registry successfully.");
	};

	const handleDownloadDoc = () => {
		const rowsHtml = filteredPatients
			.map(
				(p, idx) => `
      <tr style="${idx % 2 === 0 ? "background-color: #fcfcfc;" : ""}">
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: Courier, monospace; font-weight: bold; color: #2A758C;">${p.hospitalNumber}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e293b;">${p.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #475569;">${p.gender}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #475569;">${getAge(p.dateOfBirth)} yrs</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #475569;">${p.cardType}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #475569;">${p.phoneNumber}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #475569;">${p.status}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #475569;">${p.registrationDate ? p.registrationDate.split("T")[0] : "N/A"}</td>
      </tr>
    `,
			)
			.join("");

		const docHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Zikora Medical Center Patient Registry</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #334155; margin: 40px; }
          .header { text-align: center; border-bottom: 3px double #2A758C; padding-bottom: 15px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #2A758C; text-transform: uppercase; margin: 0; }
          .subtitle { font-size: 12px; color: #64748b; margin: 5px 0 0 0; font-weight: 600; }
          .meta-info { font-size: 11px; color: #64748b; margin-bottom: 20px; }
          .stats-grid { width: 100%; margin-bottom: 25px; border-collapse: collapse; }
          .stats-cell { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; text-align: center; width: 25%; }
          .stats-label { font-size: 9px; font-weight: bold; text-transform: uppercase; color: #64748b; }
          .stats-value { font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 2px; }
          .table-container { width: 100%; }
          table { width: 100%; border-collapse: collapse; }
          th { background-color: #2A758C; color: #ffffff; padding: 12px 10px; text-align: left; font-size: 11px; font-weight: bold; text-transform: uppercase; border: 1px solid #2A758C; }
          td { font-size: 11px; border: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="header">
          <p class="title">Zikora Medical Center</p>
          <p class="subtitle">Official Patient Registry Database Report</p>
        </div>

        <table class="meta-info" style="width: 100%; margin-bottom: 15px;">
          <tr>
            <td><strong>Export Date:</strong> ${new Date().toLocaleString()}</td>
            <td style="text-align: right;"><strong>Filtered Search:</strong> ${search ? search : "None (All Records)"}</td>
          </tr>
        </table>

        <table class="stats-grid">
          <tr>
            <td class="stats-cell"><div class="stats-label">Total Selected</div><div class="stats-value">${filteredPatients.length}</div></td>
            <td class="stats-cell"><div class="stats-label">Standard Card</div><div class="stats-value">${filteredPatients.filter((p) => p.cardType === "Standard").length}</div></td>
            <td class="stats-cell"><div class="stats-label">Maternity Card</div><div class="stats-value">${filteredPatients.filter((p) => p.cardType === "Maternity").length}</div></td>
            <td class="stats-cell"><div class="stats-label">Emergency Card</div><div class="stats-value">${filteredPatients.filter((p) => p.cardType === "Emergency").length}</div></td>
          </tr>
        </table>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Hospital No</th>
                <th>Patient Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Card Category</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Reg Date</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <p style="margin-top: 40px; font-size: 10px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px;">
          This is an official document generated from the Zikora Medical Center Out-Patient Department. Confidentiality of patient medical records is protected by clinical policy.
        </p>
      </body>
      </html>
    `;

		const blob = new Blob(["\ufeff" + docHtml], {
			type: "application/msword",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `ZMC_Patients_Registry_${new Date().toISOString().split("T")[0]}.doc`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.setTimeout(() => URL.revokeObjectURL(url), 0);
		setIsDownloadDropdownOpen(false);
		setSuccess("Downloaded Google Doc registry report successfully.");
	};

	const handleDownloadPdf = async () => {
		const { jsPDF } = await import("jspdf");
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "a4",
		});

		// Header Title
		doc.setTextColor(42, 117, 140);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(20);
		doc.text("ZIKORA MEDICAL CENTER", 15, 20);

		doc.setTextColor(100, 116, 139);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(10);
		doc.text("OFFICIAL PATIENT REGISTRY DATABASE REPORT", 15, 26);

		// Divider
		doc.setDrawColor(226, 232, 240);
		doc.setLineWidth(0.5);
		doc.line(15, 30, 195, 30);

		// Metadata block
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8.5);
		doc.setTextColor(100, 116, 139);
		doc.text(`Export Date: ${new Date().toLocaleString()}`, 15, 36);
		const searchTxt = search ? search : "None (All Records)";
		doc.text(`Filtered Search: ${searchTxt}`, 195, 36, { align: "right" });

		// Stats cards strip
		const statsW = 41;
		const statsH = 14;
		const statsY = 41;
		const statsX = [15, 60, 105, 150];

		const drawStatBox = (x: number, label: string, value: string) => {
			doc.setFillColor(248, 250, 252);
			doc.setDrawColor(226, 232, 240);
			doc.roundedRect(x, statsY, statsW, statsH, 2, 2, "FD");

			doc.setTextColor(100, 116, 139);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(7.5);
			doc.text(label.toUpperCase(), x + statsW / 2, statsY + 5, {
				align: "center",
			});

			doc.setTextColor(15, 23, 42);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(11);
			doc.text(value, x + statsW / 2, statsY + 11, { align: "center" });
		};

		drawStatBox(statsX[0], "Total Selected", String(filteredPatients.length));
		drawStatBox(
			statsX[1],
			"Standard Card",
			String(
				filteredPatients.filter((p) => p.cardType === "Standard").length,
			),
		);
		drawStatBox(
			statsX[2],
			"Maternity Card",
			String(
				filteredPatients.filter((p) => p.cardType === "Maternity").length,
			),
		);
		drawStatBox(
			statsX[3],
			"Emergency Card",
			String(
				filteredPatients.filter((p) => p.cardType === "Emergency").length,
			),
		);

		// Table Headers
		const tableY = 62;
		doc.setFillColor(42, 117, 140);
		doc.rect(15, tableY, 180, 8, "F");

		doc.setTextColor(255, 255, 255);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(8);

		const colX = {
			hNo: 17,
			name: 45,
			gender: 95,
			age: 110,
			card: 122,
			phone: 150,
			status: 175,
		};

		doc.text("HOSPITAL NO", colX.hNo, tableY + 5.5);
		doc.text("PATIENT NAME", colX.name, tableY + 5.5);
		doc.text("GENDER", colX.gender, tableY + 5.5);
		doc.text("AGE", colX.age, tableY + 5.5);
		doc.text("CARD CATEGORY", colX.card, tableY + 5.5);
		doc.text("PHONE NUMBER", colX.phone, tableY + 5.5);
		doc.text("STATUS", colX.status, tableY + 5.5);

		// Draw rows
		let currentY = tableY + 8;
		const rowH = 8;
		const pageHeight = 297;

		filteredPatients.forEach((p, idx) => {
			// Check pagination
			if (currentY + rowH > pageHeight - 20) {
				doc.addPage();
				currentY = 20;

				// Draw minimal header on new page
				doc.setFillColor(42, 117, 140);
				doc.rect(15, currentY, 180, 8, "F");

				doc.setTextColor(255, 255, 255);
				doc.setFont("helvetica", "bold");
				doc.setFontSize(8);
				doc.text("HOSPITAL NO", colX.hNo, currentY + 5.5);
				doc.text("PATIENT NAME", colX.name, currentY + 5.5);
				doc.text("GENDER", colX.gender, currentY + 5.5);
				doc.text("AGE", colX.age, currentY + 5.5);
				doc.text("CARD CATEGORY", colX.card, currentY + 5.5);
				doc.text("PHONE NUMBER", colX.phone, currentY + 5.5);
				doc.text("STATUS", colX.status, currentY + 5.5);

				currentY += 8;
			}

			// Row zebra background
			if (idx % 2 === 0) {
				doc.setFillColor(248, 250, 252);
				doc.rect(15, currentY, 180, rowH, "F");
			}

			// Border line at bottom
			doc.setDrawColor(241, 245, 249);
			doc.setLineWidth(0.3);
			doc.line(15, currentY + rowH, 195, currentY + rowH);

			// Text cells
			doc.setTextColor(42, 117, 140);
			doc.setFont("helvetica", "bold");
			doc.setFontSize(8);
			doc.text(p.hospitalNumber || "N/A", colX.hNo, currentY + 5);

			doc.setTextColor(30, 41, 59);
			doc.text(p.name || "N/A", colX.name, currentY + 5);

			doc.setTextColor(71, 85, 105);
			doc.setFont("helvetica", "normal");
			doc.text(p.gender || "N/A", colX.gender, currentY + 5);
			doc.text(`${getAge(p.dateOfBirth)} yrs`, colX.age, currentY + 5);

			doc.setTextColor(30, 41, 59);
			doc.setFont("helvetica", "bold");
			doc.text(p.cardType || "N/A", colX.card, currentY + 5);

			doc.setTextColor(71, 85, 105);
			doc.setFont("helvetica", "normal");
			doc.text(p.phoneNumber || "N/A", colX.phone, currentY + 5);

			doc.text(p.status || "Active", colX.status, currentY + 5);

			currentY += rowH;
		});

		// Footer at the end of report
		if (currentY + 25 > pageHeight) {
			doc.addPage();
			currentY = 20;
		}
		doc.setDrawColor(226, 232, 240);
		doc.setLineWidth(0.5);
		doc.line(15, currentY + 10, 195, currentY + 10);

		doc.setTextColor(148, 163, 184);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(7.5);
		doc.text(
			"This is an official document generated from the Zikora Medical Center Out-Patient Department.",
			15,
			currentY + 16,
		);
		doc.text(
			"Confidentiality of patient medical records is protected by clinical policy.",
			15,
			currentY + 20,
		);

		doc.save(
			`ZMC_Patients_Registry_${new Date().toISOString().split("T")[0]}.pdf`,
		);
		setIsDownloadDropdownOpen(false);
		setSuccess("Downloaded PDF registry database report.");
	};

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
