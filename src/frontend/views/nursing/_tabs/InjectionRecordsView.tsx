/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * InjectionRecordsView shell (sliced from ~1203-line tab).
 *
 * Tab composition only: banner KPIs, log-injection form, audit register
 * table, and save-confirmation modal. All fetching, registry state,
 * card-autocomplete selection, search/status filters, and review/delete
 * handlers live in _hooks/useInjectionRecords; presentational pieces live
 * in _components/injection/ (Injection-prefixed) and
 * _modals/InjectionSuccessModal. JSX/handlers preserved verbatim.
 */

import InjectionBanner from '../_components/injection/InjectionBanner';
import InjectionRecordForm from '../_components/injection/InjectionRecordForm';
import InjectionRecordsTable from '../_components/injection/InjectionRecordsTable';
import InjectionSuccessModal from '../_modals/InjectionSuccessModal';
import { useInjectionRecords } from '../_hooks/useInjectionRecords';

export type { InjectionRecord, RegisteredPatientCard } from '../_hooks/useInjectionRecords';

export default function InjectionRecordsView() {
  const injections = useInjectionRecords();

  return (
    <div className="space-y-8">
      {/* Top Banner & Department KPIs */}
      <InjectionBanner
        totalCount={injections.totalCount}
        pendingCount={injections.pendingCount}
        reviewedCount={injections.reviewedCount}
      />

      {/* 1. LOG INJECTION FORM CARD */}
      <InjectionRecordForm
        date={injections.date}
        setDate={injections.setDate}
        cardNumber={injections.cardNumber}
        setCardNumber={injections.setCardNumber}
        patientName={injections.patientName}
        setPatientName={injections.setPatientName}
        selectedInjectionType={injections.selectedInjectionType}
        setSelectedInjectionType={injections.setSelectedInjectionType}
        customInjectionType={injections.customInjectionType}
        setCustomInjectionType={injections.setCustomInjectionType}
        isCustomInjection={injections.isCustomInjection}
        setIsCustomInjection={injections.setIsCustomInjection}
        dose={injections.dose}
        setDose={injections.setDose}
        nurseSign={injections.nurseSign}
        setNurseSign={injections.setNurseSign}
        formErrors={injections.formErrors}
        setFormErrors={injections.setFormErrors}
        saving={injections.saving}
        commonInjections={injections.commonInjections}
        registeredPatients={injections.registeredPatients}
        loadingPatients={injections.loadingPatients}
        showCardSuggestions={injections.showCardSuggestions}
        setShowCardSuggestions={injections.setShowCardSuggestions}
        selectedPatientCard={injections.selectedPatientCard}
        setSelectedPatientCard={injections.setSelectedPatientCard}
        filteredCardSuggestions={injections.filteredCardSuggestions}
        cardInputContainerRef={injections.cardInputContainerRef}
        cardInputRef={injections.cardInputRef}
        onSubmit={injections.handleSaveInjectionRecord}
        onClearForm={injections.handleClearForm}
        onSelectPatient={injections.handleSelectPatient}
        onFetchPatients={() => injections.fetchPatients()}
      />

      {/* 2. ALL INJECTION RECORDS TABLE */}
      <InjectionRecordsTable
        filteredRecords={injections.filteredRecords}
        totalCount={injections.totalCount}
        pendingCount={injections.pendingCount}
        reviewedCount={injections.reviewedCount}
        loading={injections.loading}
        searchQuery={injections.searchQuery}
        setSearchQuery={injections.setSearchQuery}
        statusFilter={injections.statusFilter}
        setStatusFilter={injections.setStatusFilter}
        onRefresh={injections.fetchInjectionData}
        onToggleReview={injections.handleToggleReview}
        onDeleteRecord={injections.handleDeleteRecord}
      />

      {/* 3. SUCCESS / CONFIRMATION MODAL */}
      <InjectionSuccessModal
        successDialog={injections.successDialog}
        onClose={injections.closeSuccessDialog}
      />
    </div>
  );
}
