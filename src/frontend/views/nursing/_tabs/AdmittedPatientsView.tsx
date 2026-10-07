/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Admitted-patients tab shell (sliced from the 1450-line view).
 *
 * Composes the census list (left) with the selected patient's clinical file
 * (right). Data + handlers live in _hooks/useAdmittedPatients; panels live
 * in _components/admitted/*; the success dialog lives in
 * _modals/AdmittedSuccessModal. MaternityChecklistView import preserved.
 */

import { RefreshCw, User } from 'lucide-react';
import MaternityChecklistView from '../_components/MaternityChecklistView';
import { useAdmittedPatients } from '../_hooks/useAdmittedPatients';
import AdmittedPatientList from '../_components/admitted/AdmittedPatientList';
import AdmittedPatientProfile from '../_components/admitted/AdmittedPatientProfile';
import AdmittedSubTabs from '../_components/admitted/AdmittedSubTabs';
import AdmittedMedicationsTab from '../_components/admitted/AdmittedMedicationsTab';
import AdmittedObservationsTab from '../_components/admitted/AdmittedObservationsTab';
import AdmittedVitalsTab from '../_components/admitted/AdmittedVitalsTab';
import AdmittedBillingTab from '../_components/admitted/AdmittedBillingTab';
import AdmittedSuccessModal from '../_modals/AdmittedSuccessModal';

export default function AdmittedPatientsView() {
  const {
    patients,
    totalAdmittedCount,
    searchQuery,
    setSearchQuery,
    selectedWardFilter,
    setSelectedWardFilter,
    selectedPatientId,
    setSelectedPatientId,
    isLoadingPatients,
    activeSubLink,
    setActiveSubLink,
    recordsDateFilter,
    setRecordsDateFilter,
    patientDetails,
    isLoadingDetails,
    selectedPrescription,
    setSelectedPrescription,
    adminNotes,
    setAdminNotes,
    isAdministering,
    observationType,
    setObservationType,
    observationDetails,
    setObservationDetails,
    isRecordingObservation,
    vitalBP,
    setVitalBP,
    vitalHR,
    setVitalHR,
    vitalTemp,
    setVitalTemp,
    vitalRR,
    setVitalRR,
    vitalSPO2,
    setVitalSPO2,
    isRecordingVitals,
    modalMessage,
    setModalMessage,
    selectedPatient,
    fetchAdmissions,
    fetchPatientDetails,
    handleSelectPrescription,
    handleConfirmAdministration,
    handleRecordObservation,
    handleRecordVitals,
  } = useAdmittedPatients();

  const isMaternityPatient =
    (selectedPatient?.ward || '').toLowerCase().includes('maternity') ||
    (selectedPatient?.category || '').toLowerCase().includes('maternity');

  return (
    <div className="space-y-6">
      {/* TWO-CONTAINER SPLIT LAYOUT: LEFT CONTAINER & RIGHT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT CONTAINER: TOTAL AMOUNT OF ADMITTED PATIENTS & PATIENT SELECTION LIST */}
        <AdmittedPatientList
          patients={patients}
          totalAdmittedCount={totalAdmittedCount}
          isLoadingPatients={isLoadingPatients}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedWardFilter={selectedWardFilter}
          onSelectedWardFilterChange={setSelectedWardFilter}
          selectedPatientId={selectedPatientId}
          onSelectPatient={setSelectedPatientId}
          onRefresh={() => fetchAdmissions(true)}
        />

        {/* RIGHT CONTAINER: COMPLETE INFORMATION OF THE SELECTED ADMITTED PATIENT */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col space-y-6">

          {isLoadingDetails && !patientDetails ? (
            <div className="py-24 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
              <RefreshCw className="h-6 w-6 animate-spin text-[#2A758C]" />
              <span>Loading patient clinical file...</span>
            </div>
          ) : !selectedPatient ? (
            <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-8">
              <User className="h-10 w-10 mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Patient Selected</h3>
              <p className="text-xs text-slate-500 mt-1">Please select an admitted patient from the left container to view clinical records.</p>
            </div>
          ) : (
            <>
              {/* 1. PATIENT DEMOGRAPHIC & ADMISSION PROFILE CARD */}
              <AdmittedPatientProfile
                patient={selectedPatient}
                recordsDateFilter={recordsDateFilter}
                onRecordsDateFilterChange={setRecordsDateFilter}
              />

              {/* 2. CLINICAL RECORD LINKS / TABS */}
              <AdmittedSubTabs
                activeSubLink={activeSubLink}
                onActiveSubLinkChange={setActiveSubLink}
                prescriptionsCount={patientDetails?.prescriptions?.length || 0}
                observationsCount={patientDetails?.observations?.length || 0}
                vitalsCount={(patientDetails?.vitals?.vitalHistory?.length || 0) + (patientDetails?.vitals?.initialVitals ? 1 : 0)}
                billingCount={patientDetails?.billing?.items?.length || 0}
                isMaternity={isMaternityPatient}
              />

              {/* TAB 1: MEDICATIONS (Prescribed Medications & Administration History) */}
              {activeSubLink === 'medications' && (
                <AdmittedMedicationsTab
                  patientName={selectedPatient.name}
                  prescriptions={patientDetails?.prescriptions || []}
                  administrationHistory={patientDetails?.administrationHistory || []}
                  selectedPrescription={selectedPrescription}
                  onSelectPrescription={handleSelectPrescription}
                  onClearPrescription={() => setSelectedPrescription(null)}
                  adminNotes={adminNotes}
                  onAdminNotesChange={setAdminNotes}
                  isAdministering={isAdministering}
                  onConfirmAdministration={handleConfirmAdministration}
                />
              )}

              {/* TAB 2: OBSERVATIONS (Record New Observation & Previous Observations) */}
              {activeSubLink === 'observations' && (
                <AdmittedObservationsTab
                  observations={patientDetails?.observations || []}
                  observationType={observationType}
                  onObservationTypeChange={setObservationType}
                  observationDetails={observationDetails}
                  onObservationDetailsChange={setObservationDetails}
                  isRecordingObservation={isRecordingObservation}
                  onRecordObservation={handleRecordObservation}
                />
              )}

              {/* TAB 3: VITALS (Record Current Vitals, Initial Vitals & Vital History) */}
              {activeSubLink === 'vitals' && (
                <AdmittedVitalsTab
                  patientName={selectedPatient.name}
                  initialVitals={patientDetails?.vitals?.initialVitals || null}
                  vitalHistory={patientDetails?.vitals?.vitalHistory || []}
                  vitalBP={vitalBP}
                  onVitalBPChange={setVitalBP}
                  vitalHR={vitalHR}
                  onVitalHRChange={setVitalHR}
                  vitalTemp={vitalTemp}
                  onVitalTempChange={setVitalTemp}
                  vitalRR={vitalRR}
                  onVitalRRChange={setVitalRR}
                  vitalSPO2={vitalSPO2}
                  onVitalSPO2Change={setVitalSPO2}
                  isRecordingVitals={isRecordingVitals}
                  onRecordVitals={handleRecordVitals}
                />
              )}

              {/* TAB 4: BILLING (Total Charged, Total Paid, Outstanding Balance & Ledger) */}
              {activeSubLink === 'billing' && (
                <AdmittedBillingTab
                  patientName={selectedPatient.name}
                  totalCharged={patientDetails?.billing?.totalCharged || selectedPatient.total_charged || 0}
                  totalPaid={patientDetails?.billing?.totalPaid || selectedPatient.payments_made || 0}
                  outstandingBalance={patientDetails?.billing?.outstandingBalance !== undefined ? patientDetails.billing.outstandingBalance : selectedPatient.outstanding_balance || 0}
                  items={patientDetails?.billing?.items || []}
                />
              )}

              {/* TAB 5: MATERNITY CHECKLIST (FOR MOTHER & BABY, FOR DELIVERY, CHARGES) */}
              {activeSubLink === 'maternity-checklist' && selectedPatient && (
                <div className="space-y-6 animate-fade-in">
                  <MaternityChecklistView
                    patient={selectedPatient}
                    onBillingUpdated={() => {
                      fetchPatientDetails(selectedPatientId);
                    }}
                  />
                </div>
              )}

            </>
          )}

        </div>

      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      <AdmittedSuccessModal message={modalMessage} onClose={() => setModalMessage(null)} />

    </div>
  );
}
