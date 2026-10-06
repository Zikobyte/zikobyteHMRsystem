/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (billing).
 * Composer: PatientLookup + Emergency/WalkIn/Regular queue tabs +
 * RecordPaymentForm + TransactionsLedger. Lookup/form live in _components/
 * (BillingTab would otherwise exceed ~600 lines).
 */

import type { DiscountRequest, Invoice, Patient, Payment } from "@/types";
import type { CashierActiveTab } from "../_hooks/useCashierData";
import type { DiscountTarget } from "../_hooks/useCashierDiscounts";
import type {
	CashierQueueItem,
	CashierWalkInItem,
} from "../_utils/cashier-totals";
import BillingQueuesPanel from "../_components/BillingQueuesPanel";
import DepartmentHandoverPanel from "../_components/DepartmentHandoverPanel";
import PatientLookup from "../_components/PatientLookup";
import RecordPaymentForm from "../_components/RecordPaymentForm";
import TransactionsLedger from "../_components/TransactionsLedger";

export interface BillingTabProps {
	patients: Patient[];
	payments: Payment[];
	queueItems: CashierQueueItem[];
	invoices: Invoice[];
	walkInPending: CashierWalkInItem[];
	discountRequestsList: DiscountRequest[];
	searchQuery: string;
	selectedPatient: Patient | null;
	selectedTotalBill: number;
	payAmount: string;
	payMethod: string;
	payRef: string;
	payPurpose: string;
	filterMethod: string;
	isLoading: boolean;
	isLoadingQueue: boolean;
	pendingQueueTab: "emergency" | "walkin" | "regular";
	filteredPatients: Patient[];
	filteredPayments: Payment[];
	isConfirmingHandover: string | null;
	setSearchQuery: (v: string) => void;
	setSelectedPatient: (p: Patient | null) => void;
	setPayAmount: (v: string) => void;
	setPayMethod: (v: string) => void;
	setPayRef: (v: string) => void;
	setPayPurpose: (v: string) => void;
	setPendingQueueTab: (v: "emergency" | "walkin" | "regular") => void;
	setSelectedTotalBill: (v: number) => void;
	setFilterMethod: (v: string) => void;
	setSuccess: (msg: string) => void;
	setError: (msg: string) => void;
	setActiveTab: (tab: CashierActiveTab) => void;
	handleConfirmHandover: (paymentId: string) => Promise<void>;
	handleSelectPatient: (pat: Patient) => void;
	handleSelectQueueItem: (q: CashierQueueItem) => void;
	handleSelectWalkInForBilling: (item: CashierWalkInItem) => void;
	handleRecordPaymentSubmit: (e: React.FormEvent) => Promise<void>;
	handleOpenDiscountModal: (target: DiscountTarget) => void;
	getPatientDetails: (
		patId: string | undefined,
	) => { name: string; hNum: string };
	getCollectorName: (userId?: string) => string;
}

export default function BillingTab({
	patients,
	payments,
	queueItems,
	invoices,
	walkInPending,
	discountRequestsList,
	searchQuery,
	selectedPatient,
	selectedTotalBill,
	payAmount,
	payMethod,
	payRef,
	payPurpose,
	filterMethod,
	isLoading,
	isLoadingQueue,
	pendingQueueTab,
	filteredPatients,
	filteredPayments,
	isConfirmingHandover,
	setSearchQuery,
	setSelectedPatient,
	setPayAmount,
	setPayMethod,
	setPayRef,
	setPayPurpose,
	setPendingQueueTab,
	setSelectedTotalBill,
	setFilterMethod,
	setSuccess,
	setError,
	setActiveTab,
	handleConfirmHandover,
	handleSelectPatient,
	handleSelectQueueItem,
	handleSelectWalkInForBilling,
	handleRecordPaymentSubmit,
	handleOpenDiscountModal,
	getPatientDetails,
	getCollectorName,
}: BillingTabProps) {
	void setActiveTab;
	return (
		<div className="space-y-6">
			{/* Top Row: Search Lookup & Departmental Handovers */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<PatientLookup
					searchQuery={searchQuery}
					filteredPatients={filteredPatients}
					setSearchQuery={setSearchQuery}
					handleSelectPatient={handleSelectPatient}
				/>
				<DepartmentHandoverPanel
					payments={payments}
					isConfirmingHandover={isConfirmingHandover}
					handleConfirmHandover={handleConfirmHandover}
					getPatientDetails={getPatientDetails}
				/>
			</div>

			{/* SIDE-BY-SIDE INTERACTIVE BILLING WORKSPACE */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<BillingQueuesPanel
					patients={patients}
					payments={payments}
					queueItems={queueItems}
					invoices={invoices}
					walkInPending={walkInPending}
					pendingQueueTab={pendingQueueTab}
					isLoadingQueue={isLoadingQueue}
					setPendingQueueTab={setPendingQueueTab}
					setSelectedPatient={setSelectedPatient}
					setPayAmount={setPayAmount}
					setPayRef={setPayRef}
					setPayPurpose={setPayPurpose}
					setSelectedTotalBill={setSelectedTotalBill}
					handleSelectQueueItem={handleSelectQueueItem}
					handleSelectWalkInForBilling={handleSelectWalkInForBilling}
				/>
				<RecordPaymentForm
					selectedPatient={selectedPatient}
					payAmount={payAmount}
					payMethod={payMethod}
					payRef={payRef}
					payPurpose={payPurpose}
					selectedTotalBill={selectedTotalBill}
					discountRequestsList={discountRequestsList}
					isLoading={isLoading}
					setSelectedPatient={setSelectedPatient}
					setPayAmount={setPayAmount}
					setPayMethod={setPayMethod}
					setPayRef={setPayRef}
					setPayPurpose={setPayPurpose}
					handleRecordPaymentSubmit={handleRecordPaymentSubmit}
					handleOpenDiscountModal={handleOpenDiscountModal}
				/>
			</div>

			<TransactionsLedger
				filteredPayments={filteredPayments}
				filterMethod={filterMethod}
				setFilterMethod={setFilterMethod}
				getPatientDetails={getPatientDetails}
				getCollectorName={getCollectorName}
				setSuccess={setSuccess}
				setError={setError}
			/>
		</div>
	);
}
