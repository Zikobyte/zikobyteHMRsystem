/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A shell for DoctorView.tsx (was 6788 lines).
 *
 * The shell keeps: props (activeSubTab, onNavigateTab), currentUser,
 * tab routing (currentTab incl. standard/specialized delegates), hook
 * composition, modal mounts, and toast. All domain state and handlers
 * live in _hooks/; all tab JSX lives in _tabs/ (+ _tabs/admitted/) and
 * _components/; all modals live in _modals/; catalogs, formatting, and
 * the HMS download live in _utils/. DoctorSpecializedDirectory
 * delegation is unchanged.
 */

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import DoctorSpecializedDirectory from '@/components/DoctorSpecializedDirectory';
import type { User } from "@/types";
import DoctorTabs from "./_components/DoctorTabs";
import { useAdmittedOrders } from "./_hooks/useAdmittedOrders";
import { useDoctorQueue } from "./_hooks/useDoctorQueue";
import { useOutpatientConsultation } from "./_hooks/useOutpatientConsultation";
import { usePatientHistory } from "./_hooks/usePatientHistory";
import AddMedLogModal from "./_modals/AddMedLogModal";
import AddObservationModal from "./_modals/AddObservationModal";
import AdministerMedicationModal from "./_modals/AdministerMedicationModal";
import DischargeModal from "./_modals/DischargeModal";
import HistoryModal from "./_modals/HistoryModal";
import AdmittedTab from "./_tabs/AdmittedTab";
import OutpatientsTab from "./_tabs/OutpatientsTab";
import type { DoctorTab } from "./_utils/doctor-types";

interface DoctorViewProps {
  activeSubTab?: DoctorTab;
  onNavigateTab?: (tab: string) => void;
}

export default function DoctorView({ activeSubTab, onNavigateTab }: DoctorViewProps = {}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('zmc_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing logged in user:", err);
      }
    }
  }, []);

  const [currentTab, setCurrentTab] = useState<DoctorTab>(() => {
    return activeSubTab || 'outpatients';
  });

  useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // ---- Phase 4A data hooks (domain state + API handlers live in _hooks/) ----
  const queue = useDoctorQueue({ currentTab, currentUser });

  const consultation = useOutpatientConsultation({
    outpatients: queue.outpatients,
    setOutpatients: queue.setOutpatients,
    selectedOutpatientId: queue.selectedOutpatientId,
    setSelectedOutpatientId: queue.setSelectedOutpatientId,
    setAdmittedPatients: queue.setAdmittedPatients,
    currentUser,
    notify: showToast,
    refreshQueue: queue.fetchDbQueue,
  });

  const admitted = useAdmittedOrders({
    admittedPatients: queue.admittedPatients,
    setAdmittedPatients: queue.setAdmittedPatients,
    selectedAdmittedId: queue.selectedAdmittedId,
    setSelectedAdmittedId: queue.setSelectedAdmittedId,
    currentUser,
    notify: showToast,
  });

  const history = usePatientHistory();

  return (
		<div className="flex flex-col h-full bg-[#F8FAFC]">
			{/* Toast Alert Header */}
			<AnimatePresence>
				{toastMessage && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border text-white flex items-center gap-2.5 max-w-md ${
							toastType === "success"
								? "bg-[#2A758C] border-[#1f596b]"
								: "bg-rose-600 border-rose-500"
						}`}
					>
						{toastType === "success" ? (
							<CheckCircle2 className="h-5 w-5 text-[#A3D1E0]" />
						) : (
							<AlertCircle className="h-5 w-5" />
						)}
						<span className="text-xs font-bold font-sans">
							{toastMessage}
						</span>
					</motion.div>
				)}
			</AnimatePresence>

			<DoctorTabs
				currentTab={currentTab}
				onTabChange={setCurrentTab}
				onNavigateTab={onNavigateTab}
				searchQuery={queue.searchQuery}
				onSearchChange={queue.setSearchQuery}
				consultTotals={queue.consultTotals}
				isTotalsLoading={queue.isTotalsLoading}
				totalsFailed={queue.totalsFailed}
			/>

			{currentTab === "standard" || currentTab === "specialized" ? (
				<div className="flex-1 overflow-hidden">
					<DoctorSpecializedDirectory
						initialCategory={
							currentTab === "standard" ? "standard" : "specialized"
						}
						currentUser={currentUser}
						onSelectPatientForConsultation={(patientId) => {
							queue.setSelectedOutpatientId(patientId);
							setCurrentTab("outpatients");
							if (onNavigateTab) onNavigateTab("consult");
						}}
						onBackToQueue={() => {
							setCurrentTab("outpatients");
							if (onNavigateTab) onNavigateTab("consult");
						}}
					/>
				</div>
			) : currentTab === "outpatients" ? (
				<OutpatientsTab
					queue={queue.filteredOutpatients}
					selectedId={queue.selectedOutpatientId}
					onSelect={queue.setSelectedOutpatientId}
					consultation={consultation}
					onOpenHistory={history.handleOpenPatientHistory}
					notify={showToast}
				/>
			) : (
				<AdmittedTab
					queue={queue.filteredAdmittedPatients}
					selectedId={queue.selectedAdmittedId}
					onSelect={queue.setSelectedAdmittedId}
					admitted={admitted}
					onOpenHistory={history.handleOpenPatientHistory}
					notify={showToast}
				/>
			)}

			{/* PATIENT MEDICAL HISTORY MODAL */}
			<HistoryModal
				open={history.historyModalOpen}
				loading={history.historyLoading}
				data={history.patientHistoryData}
				activeTab={history.activeHistoryTab}
				onTabChange={history.setActiveHistoryTab}
				onClose={() => history.setHistoryModalOpen(false)}
			/>

			{/* DISCHARGE PATIENT MODAL */}
			<DischargeModal
				open={admitted.dischargeModalOpen}
				patient={admitted.selectedAdmitted}
				diagnosis={admitted.dischargeDiagnosis}
				condition={admitted.dischargeCondition}
				instructions={admitted.dischargeInstructions}
				followUp={admitted.dischargeFollowUp}
				onDiagnosisChange={admitted.setDischargeDiagnosis}
				onConditionChange={admitted.setDischargeCondition}
				onInstructionsChange={admitted.setDischargeInstructions}
				onFollowUpChange={admitted.setDischargeFollowUp}
				onClose={() => admitted.setDischargeModalOpen(false)}
				onConfirm={admitted.handleConfirmDischarge}
			/>

			{/* ADMINISTER MEDICATION MODAL */}
			<AdministerMedicationModal
				open={admitted.administerModalOpen}
				medication={admitted.selectedMedToAdminister}
				note={admitted.administerNote}
				onNoteChange={admitted.setAdministerNote}
				onClose={() => admitted.setAdministerModalOpen(false)}
				onConfirm={admitted.handleAdministerMedication}
			/>

			{/* ADD MEDICATION LOG MODAL */}
			<AddMedLogModal
				open={admitted.addMedLogModalOpen}
				medName={admitted.newMedName}
				medDose={admitted.newMedDose}
				medQuantity={admitted.newMedQuantity}
				medFrequency={admitted.newMedFrequency}
				medStatus={admitted.newMedStatus}
				medNote={admitted.newMedNote}
				onMedNameChange={admitted.setNewMedName}
				onMedDoseChange={admitted.setNewMedDose}
				onMedQuantityChange={admitted.setNewMedQuantity}
				onMedFrequencyChange={admitted.setNewMedFrequency}
				onMedStatusChange={admitted.setNewMedStatus}
				onMedNoteChange={admitted.setNewMedNote}
				onClose={() => admitted.setAddMedLogModalOpen(false)}
				onSave={admitted.handleAddMedicationLog}
			/>

			{/* ADD OBSERVATION MODAL */}
			<AddObservationModal
				open={admitted.obsModalOpen}
				category={admitted.obsCategory}
				note={admitted.obsNote}
				onCategoryChange={admitted.setObsCategory}
				onNoteChange={admitted.setObsNote}
				onClose={() => admitted.setObsModalOpen(false)}
				onSave={admitted.handleAddObservation}
			/>
		</div>
  );
}
