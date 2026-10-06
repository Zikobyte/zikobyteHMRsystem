/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx.
 *
 * Queue hook: owns outpatient/admitted queue state, fetchDbQueue
 * (GET /patients/opd/queue + dedupe/merge), the socketManager
 * subscription + 10s poll, queue selection, search filtering, and the
 * read-only consultation totals (GET /patients/dashboard/stats).
 * apiFetch paths, methods, mapping, and merge semantics preserved verbatim.
 */

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { apiFetch, socketManager } from "../../../utils/api";
import type {
	AdmittedPatient,
	CurrentUserLike,
	DoctorConsultTotals,
	DoctorOutpatient,
	OrderedLabTest,
	PrescribedMed,
} from "../_utils/doctor-types";

/** Raw GET /patients/opd/queue row (snake_case, fields optional). */
export interface DoctorQueueApiRow {
	id?: string;
	patient_id: string;
	encounter_id?: string;
	queue_type?: string;
	status?: string;
	clinical_status?: string;
	patient_name?: string;
	hospital_number?: string;
	gender?: string;
	phone_number?: string;
	email?: string;
	address?: string;
	marital_status?: string;
	card_type?: string;
	patient_category?: string;
	date_of_birth?: string;
	registered_at?: string;
	doctor_on_call_name?: string;
	next_of_kin_name?: string;
	next_of_kin_phone?: string;
	next_of_kin_relationship?: string;
	blood_pressure?: string;
	pulse_rate?: string;
	temperature?: string;
	weight?: string;
	respiratory_rate?: string;
	spo2?: string;
	height?: string;
	gravida?: string;
	para?: string;
	lmp?: string;
	edd?: string;
	gestational_age?: string;
	tribe?: string;
	occupation?: string;
	abortion?: string;
	premature?: string;
	is_sick_emergency?: boolean;
	is_unbooked_labour?: boolean;
	is_accident?: boolean;
	total_bill_amount?: number;
	cash_collected?: number;
	custom_details?: string;
	brought_in_by_name?: string;
	brought_in_by_phone?: string;
	brought_in_by_relationship?: string;
	brought_in_by_id_type?: string;
	brought_in_by_id_number?: string;
	priority?: string;
	destination_clinic?: string;
	processed_by?: string;
	doctor_notes?: string;
	treatment_plan?: string;
	doctor_diagnosis?: string;
}

// Initial Admitted Patients list
const INITIAL_ADMITTED: AdmittedPatient[] = [
  {
    id: 'MAT-4003',
    name: 'Adaeze Onyema',
    hospitalNumber: 'MAT-4003',
    gender: 'Female',
    dateOfBirth: '2000-02-14',
    ward: 'Maternity Ward',
    bed: 'M-3',
    admittedDate: '12/07/2026, 14:00:00',
    dischargeBill: 18000,
    totalCharged: 18000,
    paymentsMade: 15000,
    since: '12/07/2026',
    department: 'Maternity',
    religion: 'Christianity',
    edd: '2026-06-17',
    gravidaPara: 'G1 P0',
    notes: 'G1P0 in active phase of labour at 40 weeks gestation. Monitoring with partograph. Mild pre-eclampsia watch – BP elevated.',
    doctorOrders: '1. Strict 4-hourly blood pressure and maternal pulse charting.\n2. Continue IV Magnesium Sulphate maintenance infusion.\n3. Continuous fetal heart rate auscultation every 30 minutes.\n4. Call Obstetrician on-call if diastolic BP exceeds 100 mmHg.',
    doctorOrdersHistory: [
      {
        id: 'DORD-001',
        orderText: 'Loading dose of IV Magnesium Sulphate 4g slowly over 15 mins. Check deep tendon reflexes before maintenance.',
        doctorName: 'Dr. Emeka Eze',
        timestamp: '12/07/2026, 16:30:00'
      },
      {
        id: 'DORD-002',
        orderText: 'Maintain strict fluid balance chart. Monitor urinary output hourly (>30ml/hr).',
        doctorName: 'Dr. Emeka Eze',
        timestamp: '13/07/2026, 04:15:00'
      }
    ],
    vitalsRecords: [
      {
        timestamp: '13/07/2026, 04:00:00',
        recordedBy: 'Nurse Faith',
        bp: '142/94',
        hr: '88',
        temp: '37.2°C',
        rr: '20',
        spo2: '97%'
      },
      {
        timestamp: '12/07/2026, 14:30:00',
        recordedBy: 'Nurse Chioma',
        bp: '140/92',
        hr: '86',
        temp: '37.1°C',
        rr: '19',
        spo2: '98%'
      }
    ],
    medicationsRecords: [
      {
        id: 'MED-401',
        name: 'LABETALOL 100mg',
        dose: '100mg',
        quantity: '1 tab',
        frequency: 'BD',
        status: 'Administered',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: 'Nurse Faith',
        administeredAt: '13/07/2026, 04:10:00',
        timestamp: '13/07/2026, 04:00:00',
        note: 'BP 142/94 – administered orally with water'
      },
      {
        id: 'MED-402',
        name: 'MAGNESIUM SULPHATE',
        dose: '4g IV in 20ml',
        quantity: '1 vial',
        frequency: 'STAT',
        status: 'Administered',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: 'Nurse Chioma',
        administeredAt: '12/07/2026, 17:05:00',
        timestamp: '12/07/2026, 17:00:00',
        note: 'Loading dose given slow IV'
      },
      {
        id: 'MED-403',
        name: 'LABETALOL 100mg',
        dose: '100mg',
        quantity: '1 tab',
        frequency: 'BD',
        status: 'Administered',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: 'Nurse Chioma',
        administeredAt: '12/07/2026, 16:15:00',
        timestamp: '12/07/2026, 16:00:00',
        note: 'BP was 138/90 before dose'
      }
    ],
    observationsRecords: [
      {
        id: 'OBS-401',
        category: 'Complaint',
        timestamp: '13/07/2026, 04:30:00',
        note: 'Patient reports increasing lower back pain. Cervical dilation now 7cm. Contractions every 3 minutes.',
        recordedBy: 'Nurse Faith'
      },
      {
        id: 'OBS-402',
        category: 'General',
        timestamp: '12/07/2026, 16:30:00',
        note: 'Patient anxious. Explained procedure and provided reassurance. Fetal heart rate 142 bpm, regular.',
        recordedBy: 'Nurse Chioma'
      }
    ],
    chargesList: [
      { item: 'Maternity Ward Admission & Bed Fee (2 Nights)', amount: 12000, timestamp: '12/07/2026, 14:00:00' },
      { item: 'Nursing Care & Delivery Suite Monitoring', amount: 3500, timestamp: '12/07/2026, 14:00:00' },
      { item: 'Med: Magnesium Sulphate IV Loading', amount: 2500, timestamp: '12/07/2026, 17:00:00' }
    ],
    newOrdersList: [
      {
        id: 'ORD-901',
        type: 'Medication',
        target: 'PHARMACY',
        description: 'Medications: LABETALOL 100mg (100mg) - Qty: 6 tabs, Freq: BD. Notes: Maternal antihypertensive cover',
        notes: 'Maternal antihypertensive cover',
        status: 'Accepted',
        timestamp: '12/07/2026, 15:30:00'
      }
    ]
  },
  {
    id: 'ADM-5001',
    name: 'Victor Okoye',
    hospitalNumber: 'ADM-5001',
    gender: 'Male',
    dateOfBirth: '1982-11-10',
    ward: 'General Ward',
    bed: 'G-5',
    admittedDate: '10/07/2026, 10:30:00',
    dischargeBill: 25000,
    totalCharged: 25000,
    paymentsMade: 20000,
    since: '10/07/2026',
    department: 'General Medicine',
    religion: 'Christianity',
    edd: '—',
    gravidaPara: '—',
    notes: 'Severe acute Plasmodium falciparum malaria under treatment with IV Artesunate. General symptoms improving, afebrile.',
    doctorOrders: '1. Complete full 3-dose course of IV Artesunate (0h, 12h, 24h).\n2. Switch to oral ACT (Artemether/Lumefantrine) when tolerating orally.\n3. Repeat blood film for malaria parasites in 48 hours.\n4. Encourage high fluid intake and light diet.',
    doctorOrdersHistory: [
      {
        id: 'DORD-011',
        orderText: 'Start IV Artesunate 60mg STAT then at 12h and 24h. Rehydrate with 1L Normal Saline.',
        doctorName: 'Dr. Emeka Eze',
        timestamp: '10/07/2026, 10:45:00'
      }
    ],
    vitalsRecords: [
      {
        timestamp: '13/07/2026, 08:00:00',
        recordedBy: 'Nurse Faith',
        bp: '120/80',
        hr: '76',
        temp: '36.9°C',
        rr: '18',
        spo2: '99%'
      },
      {
        timestamp: '11/07/2026, 08:00:00',
        recordedBy: 'Nurse Chioma',
        bp: '122/82',
        hr: '84',
        temp: '38.4°C',
        rr: '20',
        spo2: '97%'
      }
    ],
    medicationsRecords: [
      {
        id: 'MED-501',
        name: 'Artesunate IV 60mg',
        dose: '60mg',
        quantity: '1 vial',
        frequency: 'STAT',
        status: 'Administered',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: 'Nurse Chioma',
        administeredAt: '10/07/2026, 11:15:00',
        timestamp: '10/07/2026, 11:00:00',
        note: 'First dose administered STAT'
      },
      {
        id: 'MED-502',
        name: 'Paracetamol IV 1g',
        dose: '1g',
        quantity: '1 bottle',
        frequency: 'TDS',
        status: 'Administered',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: 'Nurse Chioma',
        administeredAt: '10/07/2026, 11:30:00',
        timestamp: '10/07/2026, 11:15:00',
        note: 'For high grade pyrexia'
      }
    ],
    observationsRecords: [
      {
        id: 'OBS-501',
        category: 'General',
        timestamp: '11/07/2026, 09:00:00',
        note: 'Patient sleeping comfortably. Fever settled.',
        recordedBy: 'Nurse Chioma'
      },
      {
        id: 'OBS-502',
        category: 'Doctor Round',
        timestamp: '12/07/2026, 11:00:00',
        note: 'Jaundice regressing, appetite improving. Patient ambulating well without dizziness.',
        recordedBy: 'Dr. Emeka Eze'
      }
    ],
    chargesList: [
      { item: 'General Ward Bed Fee (3 Nights)', amount: 15000, timestamp: '10/07/2026, 10:30:00' },
      { item: 'Nursing Care & Daily Rounds', amount: 4500, timestamp: '10/07/2026, 10:30:00' },
      { item: 'Lab Test: Malaria MP & Full Blood Count', amount: 5500, timestamp: '10/07/2026, 11:00:00' }
    ],
    newOrdersList: [
      {
        id: 'ORD-902',
        type: 'Medication',
        target: 'PHARMACY',
        description: 'Medications: Artemether/Lumefantrine (20/120mg) - Qty: 24 tabs, Freq: BD for 3 days.',
        notes: 'Transition to oral therapy',
        status: 'Processing',
        timestamp: '12/07/2026, 14:00:00'
      }
    ]
  },
  {
    id: 'ADM-5002',
    name: 'Blessing Nwosu',
    hospitalNumber: 'ADM-5002',
    gender: 'Female',
    dateOfBirth: '1995-04-04',
    ward: 'General Ward',
    bed: 'G-8',
    admittedDate: '11/07/2026, 11:15:00',
    dischargeBill: 15000,
    totalCharged: 15000,
    paymentsMade: 15000,
    since: '11/07/2026',
    department: 'Surgery',
    religion: 'Christianity',
    edd: '—',
    gravidaPara: '—',
    notes: 'Post-appendectomy Day 2. Patient tolerating sips of water and light porridge. Surgical wound is clean, dry, and healing well.',
    doctorOrders: '1. Continue post-op IV Ceftriaxone 1g daily.\n2. Oral Tramadol 50mg PRN for pain.\n3. Mobilize out of bed with nursing assistance.\n4. Check wound site daily for erythema or discharge.',
    doctorOrdersHistory: [
      {
        id: 'DORD-021',
        orderText: 'Strict NPO until bowel sounds return. Maintain IV 5% Dextrose Saline 1L 8-hourly.',
        doctorName: 'Dr. Emeka Eze',
        timestamp: '11/07/2026, 12:00:00'
      }
    ],
    vitalsRecords: [
      {
        timestamp: '13/07/2026, 06:00:00',
        recordedBy: 'Nurse Faith',
        bp: '115/75',
        hr: '72',
        temp: '36.7°C',
        rr: '16',
        spo2: '98%'
      },
      {
        timestamp: '12/07/2026, 06:00:00',
        recordedBy: 'Nurse Chioma',
        bp: '118/78',
        hr: '76',
        temp: '36.8°C',
        rr: '18',
        spo2: '99%'
      }
    ],
    medicationsRecords: [
      {
        id: 'MED-601',
        name: 'Ceftriaxone IV 1g',
        dose: '1g',
        quantity: '1 vial',
        frequency: 'OD',
        status: 'Administered',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: 'Nurse Chioma',
        administeredAt: '12/07/2026, 08:30:00',
        timestamp: '12/07/2026, 08:00:00',
        note: 'Post-op antibiotic cover'
      },
      {
        id: 'MED-602',
        name: 'Metronidazole IV 500mg',
        dose: '500mg',
        quantity: '1 bottle',
        frequency: 'TDS',
        status: 'Administered',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: 'Nurse Chioma',
        administeredAt: '12/07/2026, 09:00:00',
        timestamp: '12/07/2026, 08:00:00',
        note: 'Anaerobic prophylaxis cover'
      }
    ],
    observationsRecords: [
      {
        id: 'OBS-601',
        category: 'Complaint',
        timestamp: '12/07/2026, 18:00:00',
        note: 'Complains of mild surgical site pain on movement. Administered oral analgesics.',
        recordedBy: 'Nurse Chioma'
      },
      {
        id: 'OBS-602',
        category: 'Nursing Round',
        timestamp: '13/07/2026, 07:00:00',
        note: 'Dressing intact, no soakage. Passed flatus this morning. Bowel sounds present and active.',
        recordedBy: 'Nurse Faith'
      }
    ],
    chargesList: [
      { item: 'Surgical Ward Bed Fee (2 Nights)', amount: 10000, timestamp: '11/07/2026, 11:15:00' },
      { item: 'Post-Operative Nursing Care & Dressing', amount: 3000, timestamp: '11/07/2026, 11:15:00' },
      { item: 'Med: Ceftriaxone & Metronidazole Infusions', amount: 2000, timestamp: '11/07/2026, 12:00:00' }
    ],
    newOrdersList: [
      {
        id: 'ORD-903',
        type: 'Injection',
        target: 'NURSING',
        description: 'Injections: Diclofenac 75mg (75mg) - Qty: 1 ampoule. Notes: Give deep IM for acute pain relief',
        notes: 'Give deep IM for acute pain relief',
        status: 'Completed',
        timestamp: '12/07/2026, 18:15:00'
      }
    ]
  },
  {
    id: 'ADM-8019',
    name: 'Paschal Iroegbu',
    hospitalNumber: 'ADM-8019',
    gender: 'Male',
    dateOfBirth: '1974-08-28',
    ward: 'General Ward',
    bed: 'G-11',
    admittedDate: '13/07/2026, 16:30:00',
    dischargeBill: 30000,
    totalCharged: 30000,
    paymentsMade: 10000,
    since: '13/07/2026',
    department: 'General Medicine',
    religion: 'Christianity',
    edd: '—',
    gravidaPara: '—',
    notes: 'Hypertensive Emergency with severe throbbing headache and grade II hypertensive retinopathy. Blood pressure monitored hourly.',
    doctorOrders: '1. Strict hourly BP and HR chart. Target reduction of MAP by no more than 20% in first 24 hours.\n2. Hydralazine IV 10mg slow bolus PRN if systolic BP > 190 mmHg.\n3. Request urgent Serum Electrolytes, Urea, Creatinine, and 12-lead ECG.\n4. Low salt, cardiac diet.',
    doctorOrdersHistory: [
      {
        id: 'DORD-031',
        orderText: 'Administer IV Labetalol 20mg over 2 mins. Recheck BP in 10 mins. Repeat 40mg if needed.',
        doctorName: 'Dr. Emeka Eze',
        timestamp: '13/07/2026, 16:45:00'
      }
    ],
    vitalsRecords: [
      {
        timestamp: '13/07/2026, 17:00:00',
        recordedBy: 'Nurse Faith',
        bp: '180/110',
        hr: '94',
        temp: '36.8°C',
        rr: '22',
        spo2: '96%'
      },
      {
        timestamp: '13/07/2026, 18:00:00',
        recordedBy: 'Nurse Faith',
        bp: '165/100',
        hr: '88',
        temp: '36.7°C',
        rr: '20',
        spo2: '97%'
      }
    ],
    medicationsRecords: [
      {
        id: 'MED-801',
        name: 'Labetalol IV 20mg',
        dose: '20mg',
        quantity: '1 ampoule',
        frequency: 'STAT',
        status: 'Administered',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: 'Nurse Faith',
        administeredAt: '13/07/2026, 17:10:00',
        timestamp: '13/07/2026, 17:00:00',
        note: 'Administered slow IV push. BP dropped to 165/100.'
      },
      {
        id: 'MED-802',
        name: 'Amlodipine 10mg',
        dose: '10mg',
        quantity: '1 tab',
        frequency: 'Daily (Nocte)',
        status: 'Pending',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: '',
        administeredAt: '',
        timestamp: '13/07/2026, 17:30:00',
        note: 'To start tonight at 20:00'
      }
    ],
    observationsRecords: [
      {
        id: 'OBS-801',
        category: 'Doctor Round',
        timestamp: '13/07/2026, 17:15:00',
        note: 'Headache settling following IV Labetalol. No focal neurological deficit detected.',
        recordedBy: 'Dr. Emeka Eze'
      }
    ],
    chargesList: [
      { item: 'High Dependency Admission & Bed Fee (1 Night)', amount: 20000, timestamp: '13/07/2026, 16:30:00' },
      { item: 'Critical Care Nursing & Hourly Monitoring', amount: 6000, timestamp: '13/07/2026, 16:30:00' },
      { item: 'Med: Emergency IV Antihypertensive Ampoules', amount: 4000, timestamp: '13/07/2026, 17:00:00' }
    ],
    newOrdersList: [
      {
        id: 'ORD-904',
        type: 'Lab Test',
        target: 'LABORATORY',
        description: 'Labs Ordered: CHEMISTRY: Electrolytes, Urea & Creatinine, HAEMATOLOGY: Full Blood Count. Notes: Urgent emergency workup',
        notes: 'Urgent emergency workup',
        status: 'Pending',
        timestamp: '13/07/2026, 17:05:00'
      }
    ]
  },
  {
    id: 'ADM-8020',
    name: 'Adaobi Igwe',
    hospitalNumber: 'ADM-8020',
    gender: 'Female',
    dateOfBirth: '1989-12-12',
    ward: 'General Ward',
    bed: 'G-2',
    admittedDate: '09/07/2026, 09:00:00',
    dischargeBill: 12000,
    totalCharged: 12000,
    paymentsMade: 12000,
    since: '09/07/2026',
    department: 'General Medicine',
    religion: 'Islam',
    edd: '—',
    gravidaPara: '—',
    notes: 'Acute Gastroenteritis with moderate dehydration. Successfully rehydrated with IV fluids, vomiting and diarrhea resolved.',
    doctorOrders: '1. Continue Oral Rehydration Salts (ORS) 200ml after each loose stool.\n2. Bland diet (pap, rice water, toast).\n3. Discharge on oral Ciprofloxacin 500mg BD for 5 days.',
    doctorOrdersHistory: [
      {
        id: 'DORD-041',
        orderText: 'Start 2L IV Ringer Lactate over 4 hours. IV Ondansetron 4mg STAT for emesis.',
        doctorName: 'Dr. Emeka Eze',
        timestamp: '09/07/2026, 09:15:00'
      }
    ],
    vitalsRecords: [
      {
        timestamp: '12/07/2026, 08:00:00',
        recordedBy: 'Nurse Chioma',
        bp: '110/70',
        hr: '68',
        temp: '36.5°C',
        rr: '16',
        spo2: '100%'
      },
      {
        timestamp: '09/07/2026, 09:00:00',
        recordedBy: 'Nurse Chioma',
        bp: '95/60',
        hr: '104',
        temp: '37.8°C',
        rr: '20',
        spo2: '98%'
      }
    ],
    medicationsRecords: [
      {
        id: 'MED-901',
        name: 'Ringer Lactate 1L IV',
        dose: '1L',
        quantity: '2 bags',
        frequency: 'STAT Infusion',
        status: 'Administered',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: 'Nurse Chioma',
        administeredAt: '09/07/2026, 09:30:00',
        timestamp: '09/07/2026, 09:15:00',
        note: 'Rehydration bolus'
      },
      {
        id: 'MED-902',
        name: 'Ondansetron IV 4mg',
        dose: '4mg',
        quantity: '1 ampoule',
        frequency: 'STAT',
        status: 'Administered',
        orderedBy: 'Dr. Emeka Eze',
        administeredBy: 'Nurse Chioma',
        administeredAt: '09/07/2026, 09:20:00',
        timestamp: '09/07/2026, 09:15:00',
        note: 'Given for severe nausea and vomiting'
      }
    ],
    observationsRecords: [
      {
        id: 'OBS-901',
        category: 'Nursing Round',
        timestamp: '12/07/2026, 09:00:00',
        note: 'Skin turgor restored, moist mucous membranes. Patient cheerful and tolerating oral fluids.',
        recordedBy: 'Nurse Chioma'
      }
    ],
    chargesList: [
      { item: 'Ward Bed Fee (3 Nights)', amount: 8000, timestamp: '09/07/2026, 09:00:00' },
      { item: 'Nursing Care & IV Therapy Administration', amount: 2500, timestamp: '09/07/2026, 09:00:00' },
      { item: 'Med: IV Fluids & Antiemetic therapy', amount: 1500, timestamp: '09/07/2026, 09:30:00' }
    ],
    newOrdersList: []
  }
];

export interface UseDoctorQueueParams {
	currentTab: string;
	currentUser: CurrentUserLike | null;
}

export interface UseDoctorQueueResult {
	consultTotals: DoctorConsultTotals | null;
	isTotalsLoading: boolean;
	totalsFailed: boolean;
	outpatients: DoctorOutpatient[];
	setOutpatients: Dispatch<SetStateAction<DoctorOutpatient[]>>;
	admittedPatients: AdmittedPatient[];
	setAdmittedPatients: Dispatch<SetStateAction<AdmittedPatient[]>>;
	selectedOutpatientId: string | null;
	setSelectedOutpatientId: Dispatch<SetStateAction<string | null>>;
	selectedAdmittedId: string | null;
	setSelectedAdmittedId: Dispatch<SetStateAction<string | null>>;
	isRefreshingQueue: boolean;
	fetchDbQueue: () => Promise<void>;
	searchQuery: string;
	setSearchQuery: Dispatch<SetStateAction<string>>;
	filteredOutpatients: DoctorOutpatient[];
	filteredAdmittedPatients: AdmittedPatient[];
}

export function useDoctorQueue({ currentTab, currentUser }: UseDoctorQueueParams): UseDoctorQueueResult {
  // Phase 1: READ-ONLY consultation totals fed by GET /patients/dashboard/stats.
  // Intentionally excludes totalRevenue (minimum-necessary for Doctor role).
  const [consultTotals, setConsultTotals] = useState<DoctorConsultTotals | null>(null);
  const [isTotalsLoading, setIsTotalsLoading] = useState(false);
  const [totalsFailed, setTotalsFailed] = useState(false);

  useEffect(() => {
    const fetchConsultTotals = async () => {
      setIsTotalsLoading(true);
      setTotalsFailed(false);
      try {
        const response = await apiFetch('/patients/dashboard/stats');
        if (response.success && response.data) {
          const d = response.data;
          setConsultTotals({
            totalPatients: Number(d.totalPatients ?? 0),
            standardCount: Number(d.standardCount ?? 0),
            maternityCount: Number(d.maternityCount ?? 0),
            emergencyCount: Number(d.emergencyCount ?? 0),
            admissionsCount: Number(d.admissionsCount ?? 0),
            queueCount: Number(d.queueCount ?? 0),
          });
        } else {
          setTotalsFailed(true);
        }
      } catch (err) {
        console.error('Failed to load consultation totals', err);
        setTotalsFailed(true);
      } finally {
        setIsTotalsLoading(false);
      }
    };
    fetchConsultTotals();
  }, []);

  // State for outpatients
  const [outpatients, setOutpatients] = useState<DoctorOutpatient[]>([]);
  const [selectedOutpatientId, setSelectedOutpatientId] = useState<string | null>(null);

  // State for admitted patients
  const [admittedPatients, setAdmittedPatients] = useState<AdmittedPatient[]>(() => {
    const saved = localStorage.getItem('zmc_doc_admitted');
    return saved ? JSON.parse(saved) : INITIAL_ADMITTED;
  });

  // Sync admitted patients to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zmc_doc_admitted', JSON.stringify(admittedPatients));
    } catch (e) {
      console.error('Failed to sync admitted patients to localStorage:', e);
    }
  }, [admittedPatients]);

  const [selectedAdmittedId, setSelectedAdmittedId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [isRefreshingQueue, setIsRefreshingQueue] = useState(false);

  const fetchDbQueue = async () => {
    setIsRefreshingQueue(true);
    try {
      const response = await apiFetch('/patients/opd/queue');
      if (response.success) {
        const rawFiltered = response.data.filter(
				(q: DoctorQueueApiRow) =>
					(q.queue_type === "Doctor Consultation" ||
						q.queue_type === "Cashier Consultation Payment" ||
						q.queue_type === "Nursing Front-Desk" ||
						q.queue_type === "Eye Clinic Consultation") &&
					(q.status === "Waiting" || q.status === "Processing"),
			);

        // Deduplicate items by patient_id, prioritizing Doctor Consultation > Processing
        const getPriorityScore = (q: DoctorQueueApiRow) => {
          let score = 0;
          if (q.queue_type === 'Doctor Consultation' || q.queue_type === 'Eye Clinic Consultation') score += 10;
          if (q.status === 'Processing') score += 5;
          return score;
        };

        const uniqueByPatientMap = new Map<string, DoctorQueueApiRow>();
        for (const item of rawFiltered) {
          const pid = item.patient_id;
          if (!uniqueByPatientMap.has(pid)) {
            uniqueByPatientMap.set(pid, item);
          } else {
            const existing = uniqueByPatientMap.get(pid);
            if (existing && getPriorityScore(item) > getPriorityScore(existing)) {
              uniqueByPatientMap.set(pid, item);
            }
          }
        }
        const deduplicatedQueue = Array.from(uniqueByPatientMap.values());

        const dbOutpatients: DoctorOutpatient[] = deduplicatedQueue.map((q: DoctorQueueApiRow) => {
            let age = '';
            if (q.date_of_birth) {
              const birth = new Date(q.date_of_birth);
              const ageDiff = Date.now() - birth.getTime();
              const ageDate = new Date(ageDiff);
              age = String(Math.abs(ageDate.getUTCFullYear() - 1970));
            }

            const isAwaitingPayment = q.queue_type === 'Cashier Consultation Payment';
            const isNursingQueue = q.queue_type === 'Nursing Front-Desk';

            return {
					id: q.patient_id,
					encounterId: q.encounter_id,
					queueId: q.id,
					isDbPatient: true,
					name: q.patient_name ?? '',
					hospitalNumber: q.hospital_number,
					gender: q.gender || "Unknown",
					phoneNumber: q.phone_number || "—",
					email: q.email || "—",
					address: q.address || "—",
					maritalStatus: q.marital_status || "—",
					cardType: q.card_type || "Standard",
					patientCategory: q.patient_category || "Individual",
					dateOfBirth: q.date_of_birth
						? new Date(q.date_of_birth).toISOString().split("T")[0]
						: "—",
					registeredAt: q.registered_at
						? new Date(q.registered_at).toLocaleString()
						: "—",
					age: age || "—",
					attendingDoctor:
						q.doctor_on_call_name ||
						currentUser?.username ||
						"Consulting Doctor",
					nextOfKinName: q.next_of_kin_name || "—",
					nextOfKinPhone: q.next_of_kin_phone || "—",
					nextOfKinRelationship: q.next_of_kin_relationship || "—",
					vitals: {
						bloodPressure: q.blood_pressure || null,
						pulseRate: q.pulse_rate || null,
						temperature: q.temperature || null,
						weight: q.weight || null,
						respiratoryRate: q.respiratory_rate || null,
						spo2: q.spo2 || null,
						height: q.height || null,
					},
					maternityDetails:
						q.card_type === "Maternity" || q.gravida
							? {
									gravida: q.gravida || "0",
									para: q.para || "0",
									lmp: q.lmp
										? new Date(q.lmp).toISOString().split("T")[0]
										: "—",
									edd: q.edd
										? new Date(q.edd).toISOString().split("T")[0]
										: "—",
									gestationalAge: q.gestational_age || "—",
									tribe: q.tribe || "—",
									occupation: q.occupation || "—",
									abortion: q.abortion || "0",
									premature: q.premature || "0",
								}
							: null,
					emergencyDetails:
						q.card_type === "Emergency" || q.is_sick_emergency
							? {
									isSickEmergency: q.is_sick_emergency,
									isUnbookedLabour: q.is_unbooked_labour,
									isAccident: q.is_accident,
									totalBillAmount: q.total_bill_amount,
									cashCollected: q.cash_collected,
									doctorOnCallName: q.doctor_on_call_name,
									customDetails: q.custom_details,
									broughtInByName: q.brought_in_by_name || "—",
									broughtInByPhone: q.brought_in_by_phone || "—",
									broughtInByRelationship:
										q.brought_in_by_relationship || "—",
									broughtInByIdType: q.brought_in_by_id_type || "—",
									broughtInByIdNumber:
										q.brought_in_by_id_number || "—",
								}
							: null,
					status: isAwaitingPayment
						? "IN CASHIER DEPT"
						: isNursingQueue
							? "AWAITING CONSULTATION (Vitals Pending)"
							: q.clinical_status?.includes("Lab Results Ready") ||
								  q.status === "Lab Results Ready"
								? "LAB RESULTS READY"
								: q.status === "Processing"
									? "IN CONSULTATION"
									: "AWAITING CONSULTATION",
					isLabResultsReady: Boolean(
						q.clinical_status?.includes("Lab Results Ready") ||
						q.status === "Lab Results Ready",
					),
					isAwaitingPayment,
					processedBy: q.processed_by || null,
					isEmergency:
						q.priority === "Emergency" || q.card_type === "Emergency",
					department:
						q.destination_clinic ||
						(isAwaitingPayment
							? "Cashier Dept (Payment Pending)"
							: "General Outpatient"),
					notes:
						q.doctor_notes ||
						q.treatment_plan ||
						q.doctor_diagnosis ||
						"",
					orderedTests: [] as OrderedLabTest[],
					prescribedMedications: [] as PrescribedMed[],
				};
          });

        setOutpatients(prevOutpatients => {
          const prevMap = new Map<string, DoctorOutpatient>(prevOutpatients.map(p => [p.id, p]));
          return dbOutpatients.map(dbP => {
            const existing: DoctorOutpatient | undefined = prevMap.get(dbP.id);
            const locallySavedNotes = localStorage.getItem(`zmc_doc_notes_${dbP.id}`);
            // Note priority: in-memory local edits > DB persisted notes > localStorage
            const notesToUse = (existing?.notes !== undefined && existing?.notes !== '')
              ? existing.notes
              : (dbP.notes || locallySavedNotes || '');

            if (existing) {
              return {
                ...dbP,
                // Preserve doctor notes typed locally or loaded from DB
                notes: notesToUse,
                // Preserve ordered lab tests selected locally
                orderedTests: existing.orderedTests && existing.orderedTests.length > 0 ? existing.orderedTests : dbP.orderedTests,
                // Preserve prescribed medications added locally
                prescribedMedications: existing.prescribedMedications && existing.prescribedMedications.length > 0 ? existing.prescribedMedications : dbP.prescribedMedications,
              };
            }
            return {
              ...dbP,
              notes: notesToUse
            };
          });
        });
      }
    } catch (err) {
      console.error('Failed to load DB queue in DoctorView:', err);
    } finally {
      setIsRefreshingQueue(false);
    }
  };

  useEffect(() => {
    fetchDbQueue();

    // Poll every 10 seconds for real-time queue updates
    const timer = setInterval(fetchDbQueue, 10000);

    // Subscribe to WebSocket events for real-time queue transitions
    const unsubscribe = socketManager.subscribe((msg: { type?: string }) => {
      if ([
        'PAYMENT_HANDOVER_CONFIRMED',
        'PATIENT_PAYMENT_COMPLETED',
        'PATIENT_REGISTERED',
        'PATIENT_ROUTED_TO_DOCTOR',
        'LAB_RESULTS_READY'
      ].includes(msg.type ?? '')) {
        fetchDbQueue();
      }
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  // Persistent storage hooks
  useEffect(() => {
    localStorage.setItem('zmc_doc_outpatients', JSON.stringify(outpatients));
  }, [outpatients]);

  // Set default selection when switching tab
  useEffect(() => {
    if (currentTab === 'outpatients' && outpatients.length > 0 && !selectedOutpatientId) {
      setSelectedOutpatientId(outpatients[0].id);
    } else if (currentTab === 'admitted' && admittedPatients.length > 0 && !selectedAdmittedId) {
      setSelectedAdmittedId(admittedPatients[0].id);
    }
  }, [currentTab]);

  // Filters patients list based on search bar
  const filteredOutpatients = outpatients.filter(
		(p) =>
			p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			p.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredAdmittedPatients = admittedPatients.filter(
		(p) =>
			p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			p.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    consultTotals,
    isTotalsLoading,
    totalsFailed,
    outpatients,
    setOutpatients,
    admittedPatients,
    setAdmittedPatients,
    selectedOutpatientId,
    setSelectedOutpatientId,
    selectedAdmittedId,
    setSelectedAdmittedId,
    isRefreshingQueue,
    fetchDbQueue,
    searchQuery,
    setSearchQuery,
    filteredOutpatients,
    filteredAdmittedPatients,
  };
}
