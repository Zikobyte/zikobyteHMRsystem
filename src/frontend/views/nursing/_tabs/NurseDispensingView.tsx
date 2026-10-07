/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NurseDispensingView shell — composes the useNurseDispensing data hook
 * with the Dispensing* presentational pieces (banner, record form,
 * records table, success modal). Same default export; no logic moved
 * except composition.
 */

import DispensingBanner from '../_components/dispensing/DispensingBanner';
import DispensingRecordForm from '../_components/dispensing/DispensingRecordForm';
import DispensingRecordsTable from '../_components/dispensing/DispensingRecordsTable';
import { useNurseDispensing } from '../_hooks/useNurseDispensing';
import type { DispensingRecord } from '../_hooks/useNurseDispensing';
import DispensingSuccessModal from '../_modals/DispensingSuccessModal';

export type { DispensingRecord };

export default function NurseDispensingView() {
  const {
    loading,
    saving,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    patientName,
    setPatientName,
    cardNumber,
    setCardNumber,
    drugDispensed,
    setDrugDispensed,
    quantity,
    setQuantity,
    recordedBy,
    setRecordedBy,
    formErrors,
    setFormErrors,
    successDialog,
    showPatientSuggestions,
    setShowPatientSuggestions,
    showDrugSuggestions,
    setShowDrugSuggestions,
    filteredPatientSuggestions,
    filteredDrugSuggestions,
    filteredRecords,
    totalCount,
    pendingCount,
    reviewedCount,
    fetchDispensingData,
    handleSaveDispensingRecord,
    handleToggleReview,
    handleDeleteRecord,
    handleClearForm,
    closeSuccessDialog
  } = useNurseDispensing();

  return (
    <div className="space-y-8">
      {/* Top Banner & Department KPIs */}
      <DispensingBanner
        totalCount={totalCount}
        pendingCount={pendingCount}
        reviewedCount={reviewedCount}
      />

      {/* 1. RECORD DRUG DISPENSED FORM CARD */}
      <DispensingRecordForm
        patientName={patientName}
        setPatientName={setPatientName}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        drugDispensed={drugDispensed}
        setDrugDispensed={setDrugDispensed}
        quantity={quantity}
        setQuantity={setQuantity}
        recordedBy={recordedBy}
        setRecordedBy={setRecordedBy}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        saving={saving}
        showPatientSuggestions={showPatientSuggestions}
        setShowPatientSuggestions={setShowPatientSuggestions}
        showDrugSuggestions={showDrugSuggestions}
        setShowDrugSuggestions={setShowDrugSuggestions}
        filteredPatientSuggestions={filteredPatientSuggestions}
        filteredDrugSuggestions={filteredDrugSuggestions}
        onSubmit={handleSaveDispensingRecord}
        onClearForm={handleClearForm}
      />

      {/* 2. ALL DISPENSING RECORDS TABLE */}
      <DispensingRecordsTable
        filteredRecords={filteredRecords}
        isEmpty={totalCount === 0}
        totalCount={totalCount}
        pendingCount={pendingCount}
        reviewedCount={reviewedCount}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRefresh={fetchDispensingData}
        onToggleReview={handleToggleReview}
        onDeleteRecord={handleDeleteRecord}
      />

      {/* 3. SUCCESS / CONFIRMATION MODAL */}
      <DispensingSuccessModal
        successDialog={successDialog}
        onClose={closeSuccessDialog}
      />
    </div>
  );
}
