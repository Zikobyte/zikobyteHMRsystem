import React, { useState, useEffect } from 'react';
import { API_BASE, apiFetch, getAuthToken } from '../../utils/api';
import { Patient, Vitals, MaternityDetails, EmergencyDetails } from '../../types';
import ExportButton from "../shared/ExportButton";
import {
	User,
	Activity,
	Stethoscope,
	FlaskConical,
	Printer,
	Loader2,
	CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';
import ModalHeader from "./_components/ModalHeader";
import DemographicsSection from "./_components/DemographicsSection";
import VitalsSection from "./_components/VitalsSection";
import ClinicalSection from "./_components/ClinicalSection";
import LabSection from "./_components/LabSection";
import PrescriptionsSection from "./_components/PrescriptionsSection";
import BillingSection from "./_components/BillingSection";

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | any | null;
}

export default function PatientDetailModal({ isOpen, onClose, patient }: PatientDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'demographics' | 'vitals' | 'clinical' | 'pharmacy_lab' | 'billing'>('demographics');
  const [history, setHistory] = useState<any | null>(null);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && patient?.id) {
      fetchPatientHistory(patient.id);
    } else {
      setHistory(null);
    }
  }, [isOpen, patient?.id]);

  const handlePrintEMRSummary = async () => {
    setIsPrinting(true);
    try {
      const pid = patient?.id || patient?.hospital_number || patient?.hospitalNumber;
      if (!pid) {
        window.print();
        return;
      }
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/exports?type=medical-records&format=pdf&patientId=${encodeURIComponent(pid)}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EMR_Summary_${(patient.name || 'Patient').replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        window.print();
      }
    } catch (e) {
      console.warn('Print EMR fallback:', e);
      try { window.print(); } catch (err) {}
    } finally {
      setIsPrinting(false);
    }
  };

  const fetchPatientHistory = async (patientId: string) => {
    setLoadingHistory(true);
    try {
      const res = await apiFetch(`/patients/${patientId}/history`);
      if (res.success) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Error fetching patient history for modal:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isOpen || !patient) return null;

  // Derive display values from patient or history patient record
  const patData = history?.patient || patient;
  const hospitalNum = patData.hospital_number || patData.hospitalNumber || 'ZMC-2026-000';
  const fullName = patData.name || patient.name || 'Outpatient';
  const cardType = patData.card_type || patData.cardType || 'Standard';
  const status = patData.status || patient.status || 'Active';
  const phone = patData.phone_number || patData.phoneNumber || 'N/A';
  const address = patData.address || patient.address || 'N/A';
  const gender = patData.gender || patient.gender || 'Not Specified';
  const dob = patData.date_of_birth || patData.dateOfBirth || 'N/A';
  const marital = patData.marital_status || patData.maritalStatus || 'Single';
  const regDate = patData.registration_date || patData.registrationDate || 'N/A';
  const registeredBy = patData.registered_by || patData.registeredBy || 'Receptionist';

  const balance = parseFloat((patData.outstanding_balance ?? patData.outstandingBalance ?? patData.balance ?? 0).toString());
  const cardFee = parseFloat((patData.card_fee ?? patData.cardFee ?? 3000).toString());

  // Vitals from history or patient object
  const vitalsList = history?.vitals || [];
  const latestVitals = vitalsList.length > 0 ? vitalsList[0] : (patient.vitals || null);

  // Encounters / Consultations
  const encounters = history?.encounters || [];
  const consultations = history?.consultations || [];
  const labOrders = history?.labOrders || [];
  const pharmacyOrders = history?.pharmacyOrders || [];
  const invoices = history?.invoices || [];

  return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 10 }}
					className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
				>
					<ModalHeader
						fullName={fullName}
						hospitalNum={hospitalNum}
						gender={gender}
						dob={dob}
						cardType={cardType}
						status={status}
						balance={balance}
						phone={phone}
						address={address}
						regDate={regDate}
						registeredBy={registeredBy}
						onClose={onClose}
					/>

					{/* Navigation Sub-Tabs */}
					<div className="flex border-b border-slate-100 px-6 pt-3 bg-white gap-2 overflow-x-auto">
						{[
							{
								id: "demographics",
								label: "Patient Profile & Contacts",
								icon: <User className="h-3.5 w-3.5" />,
							},
							{
								id: "vitals",
								label: "Vitals & Triage",
								icon: <Activity className="h-3.5 w-3.5" />,
							},
							{
								id: "clinical",
								label: "Consultations & Encounters",
								icon: <Stethoscope className="h-3.5 w-3.5" />,
							},
							{
								id: "pharmacy_lab",
								label: "Lab & Pharmacy",
								icon: <FlaskConical className="h-3.5 w-3.5" />,
							},
							{
								id: "billing",
								label: "Billing & Ledger",
								icon: <CreditCard className="h-3.5 w-3.5" />,
							},
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as any)}
								className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
									activeTab === tab.id
										? "border-[#2A758C] text-[#2A758C] bg-teal-50/40 font-black"
										: "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
								}`}
							>
								{tab.icon}
								<span>{tab.label}</span>
							</button>
						))}
					</div>

					{/* Modal Content Area */}
					<div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/30">
						{loadingHistory && (
							<div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-[#2A758C] bg-teal-50/50 rounded-2xl border border-teal-100">
								<Loader2 className="h-4 w-4 animate-spin" />
								<span>
									Loading live patient clinical records and historical
									ledgers...
								</span>
							</div>
						)}

						{activeTab === "demographics" && (
							<DemographicsSection
								patData={patData}
								fullName={fullName}
								hospitalNum={hospitalNum}
								gender={gender}
								dob={dob}
								marital={marital}
								cardType={cardType}
								cardFee={cardFee}
								phone={phone}
								address={address}
							/>
						)}

						{activeTab === "vitals" && (
							<VitalsSection latestVitals={latestVitals} vitalsList={vitalsList} />
						)}

						{activeTab === "clinical" && (
							<ClinicalSection consultations={consultations} encounters={encounters} />
						)}

						{activeTab === "pharmacy_lab" && (
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<LabSection labOrders={labOrders} />
									<PrescriptionsSection pharmacyOrders={pharmacyOrders} />
								</div>
							</div>
						)}

						{activeTab === "billing" && (
							<BillingSection invoices={invoices} cardFee={cardFee} balance={balance} />
						)}
					</div>

					{/* Modal Footer Actions */}
					<div className="bg-white p-4 px-6 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3">
						<div className="flex items-center gap-2">
							<button
								type="button"
								disabled={isPrinting}
								onClick={handlePrintEMRSummary}
								className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
							>
								{isPrinting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Printer className="h-4 w-4" />
								)}
								<span>Print EMR Summary</span>
							</button>

							<ExportButton
								exportType="medical-records"
								patientId={
									patData.hospital_number ||
									patData.id ||
									patData.hospitalNumber
								}
								label="Export HMS (PDF/Word/Excel)"
								className="bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 font-extrabold shadow-none"
							/>
						</div>

						<button
							onClick={onClose}
							className="px-6 py-2.5 bg-[#2A758C] hover:bg-[#205b6d] text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-[#2A758C]/20 cursor-pointer"
						>
							Close Patient Record
						</button>
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
  );
}
