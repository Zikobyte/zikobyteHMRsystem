/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx.
 *
 * Admitted-orders hook: admitted notes / doctor-orders, discharge flow,
 * administer / cancel / manual med-log, observations, and sendOrder
 * (pharmacy / nursing / laboratory). Logic preserved verbatim; the two
 * select-value type errors from the original (med status, obs category)
 * are fixed by widening the corresponding unions.
 */

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
	CHEMISTRY_TESTS,
	HAEMATOLOGY_TESTS,
	MICROBIOLOGY_TESTS,
	PARASITOLOGY_TESTS,
	SEROLOGY_TESTS,
} from "../_utils/doctor-catalog";
import type {
	AdmittedMedRecord,
	AdmittedPatient,
	AdmittedSubTab,
	CurrentUserLike,
	DoctorNotify,
	InjOrderItem,
	InpatientOrderType,
	LabOrderTests,
	MedLogStatus,
	MedOrderItem,
} from "../_utils/doctor-types";

export type ObsCategory =
	| "Doctor Round"
	| "Nursing Evaluation"
	| "Surgical / Wound Check"
	| "Dietary / Fluid Charting"
	| "General Progress";

export interface UseAdmittedOrdersParams {
	admittedPatients: AdmittedPatient[];
	setAdmittedPatients: Dispatch<SetStateAction<AdmittedPatient[]>>;
	selectedAdmittedId: string | null;
	setSelectedAdmittedId: Dispatch<SetStateAction<string | null>>;
	currentUser: CurrentUserLike | null;
	notify: DoctorNotify;
}

export interface UseAdmittedOrdersResult {
	selectedAdmitted: AdmittedPatient | undefined;
	admittedSubTab: AdmittedSubTab;
	setAdmittedSubTab: Dispatch<SetStateAction<AdmittedSubTab>>;
	recordDateFilter: string;
	setRecordDateFilter: Dispatch<SetStateAction<string>>;
	admittedNotesInput: string;
	setAdmittedNotesInput: Dispatch<SetStateAction<string>>;
	admittedDoctorOrdersInput: string;
	setAdmittedDoctorOrdersInput: Dispatch<SetStateAction<string>>;
	handleSaveAdmittedNotes: (newNotes: string) => void;
	handleSaveDoctorOrders: (newOrders: string) => void;
	dischargeModalOpen: boolean;
	setDischargeModalOpen: Dispatch<SetStateAction<boolean>>;
	dischargeDiagnosis: string;
	setDischargeDiagnosis: Dispatch<SetStateAction<string>>;
	dischargeCondition: string;
	setDischargeCondition: Dispatch<SetStateAction<string>>;
	dischargeInstructions: string;
	setDischargeInstructions: Dispatch<SetStateAction<string>>;
	dischargeFollowUp: string;
	setDischargeFollowUp: Dispatch<SetStateAction<string>>;
	handleOpenDischargeModal: () => void;
	handleConfirmDischarge: () => void;
	handleUpdateOrderStatus: (orderId: string, newStatus: string) => void;
	administerModalOpen: boolean;
	setAdministerModalOpen: Dispatch<SetStateAction<boolean>>;
	selectedMedToAdminister: AdmittedMedRecord | null;
	setSelectedMedToAdminister: Dispatch<SetStateAction<AdmittedMedRecord | null>>;
	administerNote: string;
	setAdministerNote: Dispatch<SetStateAction<string>>;
	handleAdministerMedication: (medId: string, customNote?: string) => void;
	handleCancelMedication: (medId: string) => void;
	addMedLogModalOpen: boolean;
	setAddMedLogModalOpen: Dispatch<SetStateAction<boolean>>;
	newMedName: string;
	setNewMedName: Dispatch<SetStateAction<string>>;
	newMedDose: string;
	setNewMedDose: Dispatch<SetStateAction<string>>;
	newMedQuantity: string;
	setNewMedQuantity: Dispatch<SetStateAction<string>>;
	newMedFrequency: string;
	setNewMedFrequency: Dispatch<SetStateAction<string>>;
	newMedStatus: MedLogStatus;
	setNewMedStatus: Dispatch<SetStateAction<MedLogStatus>>;
	newMedNote: string;
	setNewMedNote: Dispatch<SetStateAction<string>>;
	handleAddMedicationLog: () => void;
	obsModalOpen: boolean;
	setObsModalOpen: Dispatch<SetStateAction<boolean>>;
	obsCategory: ObsCategory;
	setObsCategory: Dispatch<SetStateAction<ObsCategory>>;
	obsNote: string;
	setObsNote: Dispatch<SetStateAction<string>>;
	handleAddObservation: () => void;
	orderType: InpatientOrderType;
	setOrderType: Dispatch<SetStateAction<InpatientOrderType>>;
	medOrderItems: MedOrderItem[];
	setMedOrderItems: Dispatch<SetStateAction<MedOrderItem[]>>;
	injOrderItems: InjOrderItem[];
	setInjOrderItems: Dispatch<SetStateAction<InjOrderItem[]>>;
	labOrderTests: LabOrderTests;
	setLabOrderTests: Dispatch<SetStateAction<LabOrderTests>>;
	orderNotes: string;
	setOrderNotes: Dispatch<SetStateAction<string>>;
	handleSendOrder: () => void;
}

export function useAdmittedOrders({
	admittedPatients,
	setAdmittedPatients,
	selectedAdmittedId,
	setSelectedAdmittedId,
	currentUser,
	notify: showToast,
}: UseAdmittedOrdersParams): UseAdmittedOrdersResult {
  // Active admitted patient
  const selectedAdmitted = admittedPatients.find(p => p.id === selectedAdmittedId);

  // Tabs for active Admitted Patient
  const [admittedSubTab, setAdmittedSubTab] = useState<AdmittedSubTab>('overview');
  // Filters and values for Admitted record view
  const [recordDateFilter, setRecordDateFilter] = useState('');

  // Synchronized inputs for Notes and Doctor Orders
  const [admittedNotesInput, setAdmittedNotesInput] = useState('');
  const [admittedDoctorOrdersInput, setAdmittedDoctorOrdersInput] = useState('');

  useEffect(() => {
    if (selectedAdmitted) {
      setAdmittedNotesInput(selectedAdmitted.notes || '');
      setAdmittedDoctorOrdersInput(selectedAdmitted.doctorOrders || '');
    } else {
      setAdmittedNotesInput('');
      setAdmittedDoctorOrdersInput('');
    }
  }, [selectedAdmittedId, selectedAdmitted?.notes, selectedAdmitted?.doctorOrders]);

  // Observations Modal & Error States
  const [obsModalOpen, setObsModalOpen] = useState(false);
  const [obsCategory, setObsCategory] = useState<ObsCategory>('Doctor Round');
  const [obsNote, setObsNote] = useState('');
  const [obsLoading, setObsLoading] = useState(false);
  const [obsError, setObsError] = useState<string | null>(null);

  // Administer Medication Modal State
  const [administerModalOpen, setAdministerModalOpen] = useState(false);
  const [selectedMedToAdminister, setSelectedMedToAdminister] = useState<AdmittedMedRecord | null>(null);
  const [administerNote, setAdministerNote] = useState('');

  // Add Medication Log Modal State
  const [addMedLogModalOpen, setAddMedLogModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedQuantity, setNewMedQuantity] = useState('1');
  const [newMedFrequency, setNewMedFrequency] = useState('OD');
  const [newMedStatus, setNewMedStatus] = useState<MedLogStatus>('Administered');
  const [newMedNote, setNewMedNote] = useState('');

  // Discharge Patient Modal State
  const [dischargeModalOpen, setDischargeModalOpen] = useState(false);
  const [dischargeDiagnosis, setDischargeDiagnosis] = useState('');
  const [dischargeCondition, setDischargeCondition] = useState('Clinically Improved');
  const [dischargeInstructions, setDischargeInstructions] = useState('');
  const [dischargeFollowUp, setDischargeFollowUp] = useState('');

  // New Orders inputs
  const [orderType, setOrderType] = useState<InpatientOrderType>('Medication');
  const [medOrderItems, setMedOrderItems] = useState<MedOrderItem[]>([
    { name: '', dose: '', quantity: '', frequency: '' }
  ]);
  const [injOrderItems, setInjOrderItems] = useState<InjOrderItem[]>([
    { name: '', dose: '', quantity: '' }
  ]);
  const [labOrderTests, setLabOrderTests] = useState<LabOrderTests>({
    CHEMISTRY: '',
    SEROLOGY: '',
    HAEMATOLOGY: '',
    MICROBIOLOGY: '',
    PARASITOLOGY: ''
  });
  const [orderNotes, setOrderNotes] = useState('');

  // Save Notes for Admitted patient (Current Notes / Diagnosis only)
  const handleSaveAdmittedNotes = (newNotes: string) => {
    if (!selectedAdmittedId) return;
    const finalNotes = newNotes !== undefined ? newNotes : admittedNotesInput;
    setAdmittedPatients(prev => prev.map(p => p.id === selectedAdmittedId ? { ...p, notes: finalNotes } : p));
    setAdmittedNotesInput(finalNotes);
    showToast('Current Notes & Diagnosis saved successfully.');
  };

  // Save Doctor's Orders for Admitted patient (Separate from Notes)
  const handleSaveDoctorOrders = (newOrders: string) => {
    if (!selectedAdmittedId) return;
    const finalOrders = newOrders !== undefined ? newOrders : admittedDoctorOrdersInput;
    const newHistoryEntry = {
      id: `DORD-${Date.now().toString().slice(-4)}`,
      orderText: finalOrders,
      doctorName: currentUser?.name || 'Doctor on duty',
      timestamp: new Date().toLocaleString()
    };

    setAdmittedPatients(prev => prev.map(p => {
      if (p.id === selectedAdmittedId) {
        return {
          ...p,
          doctorOrders: finalOrders,
          doctorOrdersHistory: [newHistoryEntry, ...(p.doctorOrdersHistory || [])]
        };
      }
      return p;
    }));
    setAdmittedDoctorOrdersInput(finalOrders);
    showToast("Doctor's Orders updated and appended to clinical history.");
  };

  // Open Discharge Modal
  const handleOpenDischargeModal = () => {
    if (!selectedAdmitted) return;
    setDischargeDiagnosis(selectedAdmitted.notes || '');
    setDischargeCondition('Clinically Improved');
    setDischargeInstructions('Continue prescribed discharge medications. Rest and adequate hydration.');
    setDischargeFollowUp('In 2 weeks at Outpatient Clinic');
    setDischargeModalOpen(true);
  };

  // Confirm Discharge Patient
  const handleConfirmDischarge = () => {
    if (!selectedAdmitted) return;
    const outstanding = Math.max(0, Number(selectedAdmitted.totalCharged || 0) - Number(selectedAdmitted.paymentsMade || 0));

    if (outstanding > 0) {
      showToast(`Warning: Outstanding balance of ₦${outstanding.toLocaleString()}. Billing clearance advised before exit.`, 'error');
    }

    const dischargeRecord = {
      ...selectedAdmitted,
      status: 'Discharged',
      dischargedAt: new Date().toLocaleString(),
      dischargedBy: currentUser?.name || 'Attending Physician',
      dischargeDiagnosis,
      dischargeCondition,
      dischargeInstructions,
      dischargeFollowUp
    };

    // Store in discharged history if needed
    try {
      const existingDischarged = JSON.parse(localStorage.getItem('zmc_doc_discharged_history') || '[]');
      localStorage.setItem('zmc_doc_discharged_history', JSON.stringify([dischargeRecord, ...existingDischarged]));
    } catch (e) {}

    // Remove from active admitted list
    setAdmittedPatients(prev => prev.filter(p => p.id !== selectedAdmittedId));
    setSelectedAdmittedId(null);
    setDischargeModalOpen(false);
    showToast(`${selectedAdmitted.name} has been successfully discharged from ${selectedAdmitted.ward}. Bed ${selectedAdmitted.bed} is now vacant.`);
  };

  // Update Status of Sent Order
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    if (!selectedAdmittedId) return;

    setAdmittedPatients(prev => prev.map(p => {
      if (p.id === selectedAdmittedId) {
        const targetOrder = (p.newOrdersList || []).find((o) => o.id === orderId);
        const updatedOrders = (p.newOrdersList || []).map((o) => o.id === orderId ? { ...o, status: newStatus } : o);

        let updatedMeds = [...(p.medicationsRecords || [])];
        let updatedCharges = p.totalCharged;
        let updatedChargesList = [...(p.chargesList || [])];

        // If completed and was medication/injection, update med record to Administered or Dispensed
        if (newStatus === 'Completed') {
          updatedMeds = updatedMeds.map((m) => {
            if (m.orderId === orderId || (targetOrder && targetOrder.description.includes(m.name))) {
              return {
                ...m,
                status: targetOrder?.type === 'Injection' ? 'Administered' : 'Dispensed',
                administeredBy: currentUser?.name || 'Staff Nurse',
                administeredAt: new Date().toLocaleString()
              };
            }
            return m;
          });
        }

        // If cancelled, update med record to Cancelled and reverse charge
        if (newStatus === 'Cancelled') {
          updatedMeds = updatedMeds.map((m) => {
            if (m.orderId === orderId || (targetOrder && targetOrder.description.includes(m.name))) {
              return { ...m, status: 'Cancelled' };
            }
            return m;
          });

          // Remove charge item
          const chargeIdx = updatedChargesList.findIndex((c) => c.orderId === orderId);
          if (chargeIdx !== -1) {
            const removedAmount = updatedChargesList[chargeIdx].amount || 0;
            updatedCharges = Math.max(0, (updatedCharges ?? 0) - removedAmount);
            updatedChargesList.splice(chargeIdx, 1);
          }
        }

        return {
          ...p,
          newOrdersList: updatedOrders,
          medicationsRecords: updatedMeds,
          chargesList: updatedChargesList,
          totalCharged: updatedCharges,
          dischargeBill: updatedCharges
        };
      }
      return p;
    }));

    showToast(`Order ${orderId} updated to ${newStatus}.`);
  };

  // Mark Medication Administered
  const handleAdministerMedication = (medId: string, customNote?: string) => {
    if (!selectedAdmittedId) return;

    setAdmittedPatients(prev => prev.map(p => {
      if (p.id === selectedAdmittedId) {
        const updatedMeds = (p.medicationsRecords || []).map((m) => {
          if (m.id === medId) {
            return {
              ...m,
              status: 'Administered',
              administeredBy: currentUser?.name || 'Nurse on Duty',
              administeredAt: new Date().toLocaleString(),
              note: customNote ? `${m.note ? m.note + ' | ' : ''}${customNote}` : m.note
            };
          }
          return m;
        });
        return { ...p, medicationsRecords: updatedMeds };
      }
      return p;
    }));

    setAdministerModalOpen(false);
    setSelectedMedToAdminister(null);
    setAdministerNote('');
    showToast('Medication marked as administered.');
  };

  // Cancel Medication
  const handleCancelMedication = (medId: string) => {
    if (!selectedAdmittedId) return;

    setAdmittedPatients(prev => prev.map(p => {
      if (p.id === selectedAdmittedId) {
        const updatedMeds = (p.medicationsRecords || []).map((m) => {
          if (m.id === medId) {
            return { ...m, status: 'Cancelled' };
          }
          return m;
        });
        return { ...p, medicationsRecords: updatedMeds };
      }
      return p;
    }));

    showToast('Medication cancelled.');
  };

  // Add Manual Medication Log
  const handleAddMedicationLog = () => {
    if (!selectedAdmittedId || !newMedName.trim()) {
      showToast('Please specify a medication name', 'error');
      return;
    }

    const newMedRecord = {
      id: `MED-${Date.now().toString().slice(-4)}`,
      name: newMedName.trim(),
      dose: newMedDose.trim() || 'Standard Dose',
      quantity: newMedQuantity || '1',
      frequency: newMedFrequency || 'OD',
      status: newMedStatus,
      orderedBy: currentUser?.name || 'Dr. Emeka Eze',
      administeredBy: newMedStatus === 'Administered' ? (currentUser?.name || 'Staff Nurse') : '',
      administeredAt: newMedStatus === 'Administered' ? new Date().toLocaleString() : '',
      timestamp: new Date().toLocaleString(),
      note: newMedNote.trim()
    };

    setAdmittedPatients(prev => prev.map(p => {
      if (p.id === selectedAdmittedId) {
        return {
          ...p,
          medicationsRecords: [newMedRecord, ...(p.medicationsRecords || [])]
        };
      }
      return p;
    }));

    setNewMedName('');
    setNewMedDose('');
    setNewMedQuantity('1');
    setNewMedFrequency('OD');
    setNewMedStatus('Administered');
    setNewMedNote('');
    setAddMedLogModalOpen(false);
    showToast('Medication log recorded successfully.');
  };

  // Add Clinical Observation
  const handleAddObservation = () => {
    if (!selectedAdmittedId || !obsNote.trim()) {
      showToast('Please enter clinical observation notes', 'error');
      return;
    }

    const newObs = {
      id: `OBS-${Date.now().toString().slice(-4)}`,
      category: obsCategory,
      note: obsNote.trim(),
      timestamp: new Date().toLocaleString(),
      recordedBy: currentUser?.name || 'Dr. Emeka Eze'
    };

    setAdmittedPatients(prev => prev.map(p => {
      if (p.id === selectedAdmittedId) {
        return {
          ...p,
          observationsRecords: [newObs, ...(p.observationsRecords || [])]
        };
      }
      return p;
    }));

    setObsNote('');
    setObsCategory('Doctor Round');
    setObsModalOpen(false);
    showToast('Clinical observation saved.');
  };

  // Send Order to Pharmacy/Nursing/Laboratory for Admitted Patient
  const handleSendOrder = () => {
    if (!selectedAdmitted) return;

    let targetDept = '';
    let description = '';
    const orderId = `ORD-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toLocaleString();
    let orderTotalPrice = 0;
    const newMedRecordsToAdd: AdmittedMedRecord[] = [];
    const newChargeItemsToAdd: { orderId: string; item: string; amount: number; timestamp: string }[] = [];

    if (orderType === 'Medication') {
      targetDept = 'PHARMACY';
      const validItems = medOrderItems.filter(item => item.name && item.name.trim() !== '');

      if (validItems.length === 0) {
        showToast('Please add at least one medication item', 'error');
        return;
      }

      description = `Medications: ${validItems.map(i => `${i.name} (${i.dose || 'std'}) - Qty: ${i.quantity || 1}, Freq: ${i.frequency || 'OD'}`).join(', ')}. ${orderNotes ? 'Notes: ' + orderNotes : ''}`;

      validItems.forEach((item, i) => {
        const qtyNum = parseInt(item.quantity || '1', 10) || 1;
        const itemPrice = 1500 * qtyNum;
        orderTotalPrice += itemPrice;

        newMedRecordsToAdd.push({
          id: `MED-ORD-${Date.now().toString().slice(-3)}-${i}`,
          orderId,
          name: item.name,
          dose: item.dose || 'As directed',
          quantity: item.quantity || '1',
          frequency: item.frequency || 'OD',
          status: 'Pending',
          orderedBy: currentUser?.name || 'Dr. Emeka Eze',
          administeredBy: '',
          administeredAt: '',
          timestamp: nowStr,
          note: orderNotes || 'Inpatient prescription order'
        });

        newChargeItemsToAdd.push({
          orderId,
          item: `Medication: ${item.name} (${item.dose || 'std'}) x${qtyNum}`,
          amount: itemPrice,
          timestamp: nowStr
        });
      });

    } else if (orderType === 'Injection') {
      targetDept = 'NURSING';
      const validItems = injOrderItems.filter(item => item.name && item.name.trim() !== '');

      if (validItems.length === 0) {
        showToast('Please add at least one injection item', 'error');
        return;
      }

      description = `Injections: ${validItems.map(i => `${i.name} (${i.dose || 'std'}) - Qty: ${i.quantity || 1}`).join(', ')}. ${orderNotes ? 'Notes: ' + orderNotes : ''}`;

      validItems.forEach((item, i) => {
        const qtyNum = parseInt(item.quantity || '1', 10) || 1;
        const itemPrice = 2000 * qtyNum;
        orderTotalPrice += itemPrice;

        newMedRecordsToAdd.push({
          id: `INJ-ORD-${Date.now().toString().slice(-3)}-${i}`,
          orderId,
          name: item.name,
          dose: item.dose || 'STAT',
          quantity: item.quantity || '1',
          frequency: 'STAT / As Ordered',
          status: 'Pending',
          orderedBy: currentUser?.name || 'Dr. Emeka Eze',
          administeredBy: '',
          administeredAt: '',
          timestamp: nowStr,
          note: `Injection order: ${orderNotes || 'Administer per protocol'}`
        });

        newChargeItemsToAdd.push({
          orderId,
          item: `Injection: ${item.name} (${item.dose || 'std'}) x${qtyNum}`,
          amount: itemPrice,
          timestamp: nowStr
        });
      });

    } else {
      targetDept = 'LABORATORY';
      const activeLabs = (Object.entries(labOrderTests) as [string, string][]).filter(([category, testName]) => testName && testName.trim() !== '');

      if (activeLabs.length === 0) {
        showToast('Please select at least one laboratory test', 'error');
        return;
      }

      description = `Labs Ordered: ${activeLabs.map(([cat, tName]) => `${cat}: ${tName}`).join(', ')}. ${orderNotes ? 'Notes: ' + orderNotes : ''}`;

      activeLabs.forEach(([cat, testName]) => {
        // Price lookup from test catalogs
        let testPrice = 2500;
        const foundTest = [...CHEMISTRY_TESTS, ...SEROLOGY_TESTS, ...HAEMATOLOGY_TESTS, ...MICROBIOLOGY_TESTS, ...PARASITOLOGY_TESTS].find(t => t.name === testName);
        if (foundTest && foundTest.price) {
          testPrice = foundTest.price;
        }
        orderTotalPrice += testPrice;

        newChargeItemsToAdd.push({
          orderId,
          item: `Lab Test (${cat}): ${testName}`,
          amount: testPrice,
          timestamp: nowStr
        });
      });
    }

    const newOrder = {
      id: orderId,
      type: orderType,
      target: targetDept,
      description,
      notes: orderNotes,
      status: 'Pending',
      timestamp: nowStr
    };

    setAdmittedPatients(prev => prev.map(p => {
      if (p.id === selectedAdmittedId) {
        const updatedOrdersList = [newOrder, ...(p.newOrdersList || [])];
        const updatedMeds = [...newMedRecordsToAdd, ...(p.medicationsRecords || [])];
        const updatedChargesList = [...newChargeItemsToAdd, ...(p.chargesList || [])];
        const newTotalCharged = (Number(p.totalCharged) || 0) + orderTotalPrice;

        return {
          ...p,
          newOrdersList: updatedOrdersList,
          medicationsRecords: updatedMeds,
          chargesList: updatedChargesList,
          totalCharged: newTotalCharged,
          dischargeBill: newTotalCharged
        };
      }
      return p;
    }));

    // Reset inputs
    setMedOrderItems([{ name: '', dose: '', quantity: '', frequency: '' }]);
    setInjOrderItems([{ name: '', dose: '', quantity: '' }]);
    setLabOrderTests({
      CHEMISTRY: '',
      SEROLOGY: '',
      HAEMATOLOGY: '',
      MICROBIOLOGY: '',
      PARASITOLOGY: ''
    });
    setOrderNotes('');

    showToast(`Order ${orderId} sent successfully to ${targetDept}!`);
  };

  // Keep obsLoading/obsError parity with the original component (reserved for
  // async observation persistence); referenced to avoid dead-code drift.
  void obsLoading;
  void obsError;
  void setObsLoading;
  void setObsError;

  return {
    selectedAdmitted,
    admittedSubTab,
    setAdmittedSubTab,
    recordDateFilter,
    setRecordDateFilter,
    admittedNotesInput,
    setAdmittedNotesInput,
    admittedDoctorOrdersInput,
    setAdmittedDoctorOrdersInput,
    handleSaveAdmittedNotes,
    handleSaveDoctorOrders,
    dischargeModalOpen,
    setDischargeModalOpen,
    dischargeDiagnosis,
    setDischargeDiagnosis,
    dischargeCondition,
    setDischargeCondition,
    dischargeInstructions,
    setDischargeInstructions,
    dischargeFollowUp,
    setDischargeFollowUp,
    handleOpenDischargeModal,
    handleConfirmDischarge,
    handleUpdateOrderStatus,
    administerModalOpen,
    setAdministerModalOpen,
    selectedMedToAdminister,
    setSelectedMedToAdminister,
    administerNote,
    setAdministerNote,
    handleAdministerMedication,
    handleCancelMedication,
    addMedLogModalOpen,
    setAddMedLogModalOpen,
    newMedName,
    setNewMedName,
    newMedDose,
    setNewMedDose,
    newMedQuantity,
    setNewMedQuantity,
    newMedFrequency,
    setNewMedFrequency,
    newMedStatus,
    setNewMedStatus,
    newMedNote,
    setNewMedNote,
    handleAddMedicationLog,
    obsModalOpen,
    setObsModalOpen,
    obsCategory,
    setObsCategory,
    obsNote,
    setObsNote,
    handleAddObservation,
    orderType,
    setOrderType,
    medOrderItems,
    setMedOrderItems,
    injOrderItems,
    setInjOrderItems,
    labOrderTests,
    setLabOrderTests,
    orderNotes,
    setOrderNotes,
    handleSendOrder,
  };
}
