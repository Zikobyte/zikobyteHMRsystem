/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B shell for cashier/CashierView.tsx (sliced from 6110 lines).
 * Shell keeps: props (activeTab), hook composition, tab router + modal mounts.
 * Domain state lives in _hooks/, derived sums in _utils/cashier-totals,
 * tab JSX in _tabs/, lookup/form/queues/ledger in _components/, modals in _modals/.
 * MaternitySuppliesCashierView stays lazy-imported via MaternitySuppliesTab
 * (`@/`-aliased, unaffected by this move).
 */

import { useState } from "react";
import CashierHeader from "./_components/CashierHeader";
import ActionFeedbackModal from "./_modals/ActionFeedbackModal";
import BalanceDayModal from "./_modals/BalanceDayModal";
import DiscountModal from "./_modals/DiscountModal";
import ViewTestsModal, {
	type ViewTestsData,
} from "./_modals/ViewTestsModal";
import BillingTab from "./_tabs/BillingTab";
import DiscountsTab from "./_tabs/DiscountsTab";
import EyeRegistrationsTab from "./_tabs/EyeRegistrationsTab";
import LabPaymentsTab from "./_tabs/LabPaymentsTab";
import MaternitySuppliesTab from "./_tabs/MaternitySuppliesTab";
import NoChargeTab from "./_tabs/NoChargeTab";
import OutstandingTab from "./_tabs/OutstandingTab";
import PendingAllTab from "./_tabs/PendingAllTab";
import ProcurementQueueTab from "./_tabs/ProcurementQueueTab";
import VitaeTab from "./_tabs/VitaeTab";
import WalkInVerifyTab, {
	type WalkInVerifyItem,
} from "./_tabs/WalkInVerifyTab";
import { useCashierData } from "./_hooks/useCashierData";
import { useCashierDiscounts } from "./_hooks/useCashierDiscounts";
import {
	useCashierPayments,
	type CashierActionFeedback,
} from "./_hooks/useCashierPayments";
import {
	filterPaymentsByMethod,
	filterPatientsByQuery,
	getBillingQueuePendingItems,
	getCashTotal,
	getDischargeInvoices,
	getFilteredLabItems,
	getLargestPVExpense,
	getNoChargeStaffSelfCount,
	getOutstandingTotalOwed,
	getPendingLabCount,
	getPendingLabQueueItems,
	getPendingPaymentsCount,
	getPendingPaymentsSum,
	getPosTotal,
	getTotalCollected,
	getTotalNoChargeSettle,
	getTotalPVExpensed,
	getTransferTotal,
	getUnpaidInvoices,
} from "./_utils/cashier-totals";

// Keep old deep-imports working during transition.
export {
	type CashierProcurementQueueRow,
	mapCashierProcurementQueueRow,
} from "./_utils/cashier-mapper";

export default function CashierView({
	activeTab: propActiveTab,
}: { activeTab?: string } = {}) {
	const [viewTestsModal, setViewTestsModal] = useState<ViewTestsData | null>(
		null,
	);
	const [actionFeedbackModal, setActionFeedbackModal] =
		useState<CashierActionFeedback | null>(null);
	const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

	const data = useCashierData({ propActiveTab });

	const pay = useCashierPayments({
		patients: data.patients,
		payments: data.payments,
		users: data.users,
		queueItems: data.queueItems,
		invoices: data.invoices,
		setPatients: data.setPatients,
		setQueueItems: data.setQueueItems,
		setInvoices: data.setInvoices,
		setPayments: data.setPayments,
		setPaymentVitae: data.setPaymentVitae,
		setNoChargeRecords: data.setNoChargeRecords,
		fetchInitialData: data.fetchInitialData,
		setError: data.setError,
		setSuccess: data.setSuccess,
		setIsLoading: data.setIsLoading,
		setActionFeedbackModal,
	});

	const disc = useCashierDiscounts({
		fetchInitialData: data.fetchInitialData,
		setError: data.setError,
		setSuccess: data.setSuccess,
		setIsLoading: data.setIsLoading,
		setActionFeedbackModal,
	});

	// Derived sums (pure, via _utils/cashier-totals).
	const filteredPatients = filterPatientsByQuery(
		data.patients,
		data.searchQuery,
	);
	const filteredPayments = filterPaymentsByMethod(
		data.payments,
		data.filterMethod,
	);
	const totalCollected = getTotalCollected(data.payments);
	const cashTotal = getCashTotal(data.payments);
	const posTotal = getPosTotal(data.payments);
	const transferTotal = getTransferTotal(data.payments);
	const pendingLabQueueItems = getPendingLabQueueItems(data.queueItems);
	const filteredLabItems = getFilteredLabItems(
		pendingLabQueueItems,
		data.patients,
		pay.labCategoryFilter,
		data.searchQuery,
	);
	const pendingLabCount = getPendingLabCount(
		data.queueItems,
		data.walkInPending,
	);
	const billingQueuePendingItems = getBillingQueuePendingItems(data.queueItems);
	const billingQueueCount = billingQueuePendingItems.length;
	const unpaidInvoices = getUnpaidInvoices(data.invoices);
	const pendingPaymentsCount = getPendingPaymentsCount(
		data.queueItems,
		data.walkInPending,
		data.invoices,
	);
	const pendingPaymentsSum = getPendingPaymentsSum(data.invoices);
	const dischargeInvoices = getDischargeInvoices(data.invoices);
	const dischargeBillsCount = dischargeInvoices.length;
	const dischargeBillsSum = dischargeInvoices.reduce(
		(acc, i) =>
			acc +
			(Number(i.amount) || Number((i as { total?: unknown }).total) || 0),
		0,
	);
	const outstandingBalancesCount = data.outstandingList.length;
	const outstandingTotalOwed = getOutstandingTotalOwed(data.outstandingList);
	const totalPatientsCount = data.patients.length;
	const totalPVExpensed = getTotalPVExpensed(data.paymentVitae);
	const largestPVExpense = getLargestPVExpense(data.paymentVitae);
	const totalPVCount = data.paymentVitae.length;
	const totalNoChargeSettle = getTotalNoChargeSettle(data.noChargeRecords);
	const totalNoChargeCount = data.noChargeRecords.length;
	const noChargeStaffSelfCount = getNoChargeStaffSelfCount(
		data.noChargeRecords,
	);

	return (
		<div className="space-y-6">
			<CashierHeader
				activeTab={data.activeTab}
				error={data.error}
				success={data.success}
				maternitySupplies={data.maternitySupplies}
				pendingPaymentsCount={pendingPaymentsCount}
				pendingPaymentsSum={pendingPaymentsSum}
				dischargeBillsCount={dischargeBillsCount}
				dischargeBillsSum={dischargeBillsSum}
				outstandingBalancesCount={outstandingBalancesCount}
				outstandingTotalOwed={outstandingTotalOwed}
				totalPatientsCount={totalPatientsCount}
				totalCollected={totalCollected}
				cashTotal={cashTotal}
				pendingLabQueueItems={pendingLabQueueItems}
				invoices={data.invoices}
				totalPVExpensed={totalPVExpensed}
				largestPVExpense={largestPVExpense}
				totalPVCount={totalPVCount}
				totalNoChargeSettle={totalNoChargeSettle}
				totalNoChargeCount={totalNoChargeCount}
				noChargeStaffSelfCount={noChargeStaffSelfCount}
				setActiveTab={data.setActiveTab}
				setIsBalanceModalOpen={setIsBalanceModalOpen}
			/>

			{data.activeTab === "billing" && (
				<BillingTab
					patients={data.patients}
					payments={data.payments}
					queueItems={data.queueItems}
					invoices={data.invoices}
					walkInPending={data.walkInPending}
					discountRequestsList={data.discountRequestsList}
					searchQuery={data.searchQuery}
					selectedPatient={pay.selectedPatient}
					selectedTotalBill={pay.selectedTotalBill}
					payAmount={pay.payAmount}
					payMethod={pay.payMethod}
					payRef={pay.payRef}
					payPurpose={pay.payPurpose}
					filterMethod={data.filterMethod}
					isLoading={data.isLoading}
					isLoadingQueue={data.isLoadingQueue}
					pendingQueueTab={pay.pendingQueueTab}
					filteredPatients={filteredPatients}
					filteredPayments={filteredPayments}
					isConfirmingHandover={pay.isConfirmingHandover}
					setSearchQuery={data.setSearchQuery}
					setSelectedPatient={pay.setSelectedPatient}
					setPayAmount={pay.setPayAmount}
					setPayMethod={pay.setPayMethod}
					setPayRef={pay.setPayRef}
					setPayPurpose={pay.setPayPurpose}
					setPendingQueueTab={pay.setPendingQueueTab}
					setSelectedTotalBill={pay.setSelectedTotalBill}
					setFilterMethod={data.setFilterMethod}
					setSuccess={data.setSuccess}
					setError={data.setError}
					setActiveTab={data.setActiveTab}
					handleConfirmHandover={pay.handleConfirmHandover}
					handleSelectPatient={pay.handleSelectPatient}
					handleSelectQueueItem={pay.handleSelectQueueItem}
					handleSelectWalkInForBilling={pay.handleSelectWalkInForBilling}
					handleRecordPaymentSubmit={pay.handleRecordPaymentSubmit}
					handleOpenDiscountModal={disc.handleOpenDiscountModal}
					getPatientDetails={pay.getPatientDetails}
					getCollectorName={pay.getCollectorName}
				/>
			)}

			{data.activeTab === "lab-payments" && (
				<LabPaymentsTab
					patients={data.patients}
					payments={data.payments}
					invoices={data.invoices}
					pendingLabQueueItems={pendingLabQueueItems}
					filteredLabItems={filteredLabItems}
					labHistoryRecords={data.labHistoryRecords}
					labSubTab={pay.labSubTab}
					labPayMethods={pay.labPayMethods}
					labCategoryFilter={pay.labCategoryFilter}
					labCustomAmounts={pay.labCustomAmounts}
					searchQuery={data.searchQuery}
					isLoading={data.isLoading}
					setLabSubTab={pay.setLabSubTab}
					setLabPayMethods={pay.setLabPayMethods}
					setLabCategoryFilter={pay.setLabCategoryFilter}
					setLabCustomAmounts={pay.setLabCustomAmounts}
					handleConfirmLabPayment={pay.handleConfirmLabPayment}
				/>
			)}

			{data.activeTab === "pending-payments-all" && (
				<PendingAllTab
					patients={data.patients}
					payments={data.payments}
					invoices={data.invoices}
					walkInPending={data.walkInPending}
					pendingLabCount={pendingLabCount}
					pendingLabQueueItems={pendingLabQueueItems}
					billingQueuePendingItems={billingQueuePendingItems}
					billingQueueCount={billingQueueCount}
					unpaidInvoices={unpaidInvoices}
					pendingPaymentsCount={pendingPaymentsCount}
					pendingPaymentsSum={pendingPaymentsSum}
					setActiveTab={data.setActiveTab}
				/>
			)}

			{data.activeTab === "iclinic-registrations" && (
				<EyeRegistrationsTab
					patients={data.patients}
					eyeRegistrationsList={data.eyeRegistrationsList}
					eyePayMethods={pay.eyePayMethods}
					eyePayAmounts={pay.eyePayAmounts}
					setEyePayMethods={pay.setEyePayMethods}
					setEyePayAmounts={pay.setEyePayAmounts}
					handleVerifyEyeRegistration={pay.handleVerifyEyeRegistration}
				/>
			)}

			{data.activeTab === "walkin-verify" && (
				<WalkInVerifyTab
					patients={data.patients}
					payments={data.payments}
					walkInPending={data.walkInPending}
					walkInPaid={data.walkInPaid}
					selectedWalkInVerify={
						pay.selectedWalkInVerify as WalkInVerifyItem | null
					}
					walkInVerifyPayMethod={pay.walkInVerifyPayMethod}
					walkInCustomAmounts={pay.walkInCustomAmounts}
					isVerifyingWalkIn={pay.isVerifyingWalkIn}
					searchQuery={data.searchQuery}
					setSearchQuery={data.setSearchQuery}
					setSelectedWalkInVerify={pay.setSelectedWalkInVerify}
					setWalkInVerifyPayMethod={pay.setWalkInVerifyPayMethod}
					setWalkInCustomAmounts={pay.setWalkInCustomAmounts}
					setViewTestsModal={setViewTestsModal}
					handleConfirmWalkInVerification={
						pay.handleConfirmWalkInVerification
					}
				/>
			)}

			{data.activeTab === "vitae" && (
				<VitaeTab
					paymentVitae={data.paymentVitae}
					isLoading={data.isLoading}
					pvPersonName={pay.pvPersonName}
					pvDescription={pay.pvDescription}
					pvAmount={pay.pvAmount}
					pvApprovedByDoctor={pay.pvApprovedByDoctor}
					setPvPersonName={pay.setPvPersonName}
					setPvDescription={pay.setPvDescription}
					setPvAmount={pay.setPvAmount}
					setPvApprovedByDoctor={pay.setPvApprovedByDoctor}
					handleRecordPVSubmit={pay.handleRecordPVSubmit}
				/>
			)}

			{data.activeTab === "no-charge" && (
				<NoChargeTab
					patients={data.patients}
					noChargeRecords={data.noChargeRecords}
					isLoading={data.isLoading}
					ncStaffName={pay.ncStaffName}
					ncRelationship={pay.ncRelationship}
					ncPatientId={pay.ncPatientId}
					ncTreatmentCost={pay.ncTreatmentCost}
					ncTreatmentDescription={pay.ncTreatmentDescription}
					ncApprovedByDoctor={pay.ncApprovedByDoctor}
					setNcStaffName={pay.setNcStaffName}
					setNcRelationship={pay.setNcRelationship}
					setNcPatientId={pay.setNcPatientId}
					setNcTreatmentCost={pay.setNcTreatmentCost}
					setNcTreatmentDescription={pay.setNcTreatmentDescription}
					setNcApprovedByDoctor={pay.setNcApprovedByDoctor}
					handleRecordNoChargeSubmit={pay.handleRecordNoChargeSubmit}
				/>
			)}

			{data.activeTab === "outstanding" && (
				<OutstandingTab
					outstandingList={data.outstandingList}
					payments={data.payments}
					rowPaymentAmounts={pay.rowPaymentAmounts}
					rowPaymentMethods={pay.rowPaymentMethods}
					recordingRowId={pay.recordingRowId}
					setRowPaymentAmounts={pay.setRowPaymentAmounts}
					setRowPaymentMethods={pay.setRowPaymentMethods}
					handleRecordRowPayment={pay.handleRecordRowPayment}
				/>
			)}

			{data.activeTab === "discounts" && (
				<DiscountsTab
					discountRequestsList={data.discountRequestsList}
					handleApproveDiscount={disc.handleApproveDiscount}
					handleRejectDiscount={disc.handleRejectDiscount}
				/>
			)}

			{data.activeTab === "maternity-supplies" && (
				<MaternitySuppliesTab
					records={data.maternitySupplies}
					isLoading={data.isLoadingMaternitySupplies}
					onRefresh={data.fetchMaternitySupplies}
					onBalanceSuccess={() => {
						void data.fetchInitialData();
					}}
				/>
			)}

			{data.activeTab === "procurement-queue" && (
				<ProcurementQueueTab
					procurementQueue={data.procurementQueue}
					isLoadingProcurementQueue={data.isLoadingProcurementQueue}
					fetchProcurementQueue={data.fetchProcurementQueue}
				/>
			)}

			<DiscountModal
				discountModalOpen={disc.discountModalOpen}
				discountTarget={disc.discountTarget}
				discountType={disc.discountType}
				discountValue={disc.discountValue}
				discountReason={disc.discountReason}
				isSubmittingDiscount={disc.isSubmittingDiscount}
				setDiscountModalOpen={disc.setDiscountModalOpen}
				setDiscountType={disc.setDiscountType}
				setDiscountValue={disc.setDiscountValue}
				setDiscountReason={disc.setDiscountReason}
				handleDiscountSubmit={disc.handleDiscountSubmit}
			/>

			<BalanceDayModal
				isBalanceModalOpen={isBalanceModalOpen}
				payments={data.payments}
				cashTotal={cashTotal}
				posTotal={posTotal}
				transferTotal={transferTotal}
				totalCollected={totalCollected}
				totalPVExpensed={totalPVExpensed}
				totalPVCount={totalPVCount}
				setIsBalanceModalOpen={setIsBalanceModalOpen}
				setSuccess={data.setSuccess}
			/>

			<ViewTestsModal
				viewTestsModal={viewTestsModal}
				setViewTestsModal={setViewTestsModal}
			/>

			<ActionFeedbackModal
				actionFeedbackModal={actionFeedbackModal}
				setActionFeedbackModal={setActionFeedbackModal}
			/>
		</div>
	);
}
