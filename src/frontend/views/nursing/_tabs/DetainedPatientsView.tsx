/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Nursing observation-unit tab shell: composes useDetainedPatients state
 * with Detained* banner/table/cards/modals. State + fetch + handlers live
 * in the hook; JSX lives in the extracted pieces (verbatim).
 */

import DetainedCurrentList from '../_components/detained/DetainedCurrentList';
import DetainedNoticeBanner from '../_components/detained/DetainedNoticeBanner';
import DetainedPendingTable from '../_components/detained/DetainedPendingTable';
import { useDetainedPatients } from '../_hooks/useDetainedPatients';
import type { DetainedPatient, PendingPatient } from '../_hooks/useDetainedPatients';
import DetainedAdmissionModal from '../_modals/DetainedAdmissionModal';
import DetainedConfirmationModal from '../_modals/DetainedConfirmationModal';
import DetainedDetainModal from '../_modals/DetainedDetainModal';

export type { DetainedPatient, PendingPatient };

export default function DetainedPatientsView() {
  const {
    pendingPatients,
    detainedPatients,
    totalDetainedCount,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedForDetention,
    setSelectedForDetention,
    detentionReason,
    setDetentionReason,
    clinicalCardObservation,
    setClinicalCardObservation,
    isSubmittingDetention,
    selectedForAdmission,
    setSelectedForAdmission,
    admissionForm,
    setAdmissionForm,
    isSubmittingAdmission,
    confirmationDialog,
    setConfirmationDialog,
    fetchDetainedData,
    handleOpenDetainModal,
    handleConfirmDetain,
    handleReleasePatient,
    handleOpenAdmitModal,
    handleConfirmAdmission
  } = useDetainedPatients();

  return (
    <div className="space-y-6 pb-10">
      {/* 1. TOP NOTICE / INFORMATION BANNER */}
      {/* Exact required text: "These patients are held for observation only. No formal admission sheet required. Observations recorded on clinical card." */}
      <DetainedNoticeBanner />

      {/* 2. TABLE CONTAINER: "Mark patient as detained from pending admissions" */}
      <DetainedPendingTable
        pendingPatients={pendingPatients}
        totalDetainedCount={totalDetainedCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        onRefresh={fetchDetainedData}
        onDetain={handleOpenDetainModal}
        onAdmit={handleOpenAdmitModal}
      />

      {/* 3. CURRENTLY DETAINED SECTION */}
      {/* "Once you do that, there will be an automatic section that will be created underneath or by the side that will say currently detained. It will have the patient's information and the reason for the detainment and the last notes that was written by the nurse while the patient was detained. There will be a release button by the side. If you click on that release button, it will release the patient from that section. The patient will no longer be detained." */}
      <DetainedCurrentList
        detainedPatients={detainedPatients}
        onAdmit={handleOpenAdmitModal}
        onRelease={handleReleasePatient}
      />

      {/* 4. MODAL: DETAIN PATIENT FOR OBSERVATION */}
      {/*
        "If you click on the detain button, it will say detain patient for observation.
        It will write out the name of the patient, the patient's ID number, and reason for detention.
        You write the reason for detention, e.g., BP check after medication, IV fluid monitoring, or any other thing.
        When you fill it in, you also fill in the initial observation recorded on clinical card.
        Then there is a mark as detained button or cancel button.
        If you click as mark as detained, it will say patient marked as detained, the reason, and the observation recorded on clinical card."
      */}
      <DetainedDetainModal
        patient={selectedForDetention}
        detentionReason={detentionReason}
        setDetentionReason={setDetentionReason}
        clinicalCardObservation={clinicalCardObservation}
        setClinicalCardObservation={setClinicalCardObservation}
        isSubmitting={isSubmittingDetention}
        onClose={() => setSelectedForDetention(null)}
        onSubmit={handleConfirmDetain}
      />

      {/* 5. MODAL: COMPLETE PATIENT ADMISSION */}
      {/*
        "If you click on the admit button, there will be a form that will open, and that form will say complete patient admission.
        The patient's name will be there, patient ID will be there, then the ward.
        You will select the ward, whether General Ward Abuja, Maternity Ward Lagos, ICU, Pediatric Ward, or Private Room.
        Then you put the bed number, then provisional diagnosis, next of kin, region, religion, whether Christianity, Islam, Traditional, or Other,
        then the doctor's orders or standing orders. You type in that, then click on complete admission.
        Once you click on complete admission, it will say patient has been admitted to private room bed 847 or whatever information that was filled in on the form."
      */}
      <DetainedAdmissionModal
        patient={selectedForAdmission}
        admissionForm={admissionForm}
        setAdmissionForm={setAdmissionForm}
        isSubmitting={isSubmittingAdmission}
        onClose={() => setSelectedForAdmission(null)}
        onSubmit={handleConfirmAdmission}
      />

      {/* 6. SUCCESS CONFIRMATION MODAL */}
      <DetainedConfirmationModal
        dialog={confirmationDialog}
        onDismiss={() => setConfirmationDialog({ ...confirmationDialog, isOpen: false })}
      />
    </div>
  );
}
