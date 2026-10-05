export type UserRole =
  | 'Administrator'
  | 'IT Administrator'
  | 'OPD Clerk'
  | 'Doctor'
  | 'Nurse'
  | 'Pharmacist'
  | 'Laboratory Scientist'
  | 'Lab Technician'
  | 'Cashier'
  | 'Receptionist'
  | 'Records Officer'
  | 'Account Officer'
  | 'Accountant'
  | 'HR Manager'
  | 'Eye Clinic'
  | 'Management'
  | string;

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  department: string;
  email?: string;
  status: 'Active' | 'Inactive';
  last_login?: string | null;
  created_at?: string;
  created_by?: string;
}

export interface Vitals {
  bloodPressure: string;
  temperature: number; // °C
  pulseRate: number; // bpm
  respiratoryRate?: number; // cpm
  spo2?: number; // %
  weight: number; // kg
  height?: number; // cm
}

export interface MaternityDetails {
  gravida: string;
  para: string;
  lmp: string;
  edd: string;
  gestationalAge: string;
  tribe?: string;
  occupation?: string;
}

export interface EmergencyDetails {
  isSickEmergency?: boolean;
  isUnbookedLabour?: boolean;
  isAccident?: boolean;
  isDoctorOnCall?: boolean;
  isAfterHours?: boolean;
  customDetails?: string;
}

export interface Patient {
  id: string;
  hospitalNumber: string;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phoneNumber: string;
  address: string;
  maritalStatus: string;
  cardType: 'Standard' | 'Maternity' | 'Emergency';
  cardFee: number;
  status: string;
  registeredBy: string;
  registrationDate: string;
  idType?: string | null;
  idNumber?: string | null;
  nextOfKinName?: string | null;
  nextOfKinPhone?: string | null;
  nextOfKinRelationship?: string | null;
  patientCanProvideDetails?: boolean;
  broughtInByName?: string | null;
  broughtInByPhone?: string | null;
  broughtInByRelationship?: string | null;
  broughtInByIdType?: string | null;
  broughtInByIdNumber?: string | null;
  vitals?: Vitals | null;
  maternityDetails?: MaternityDetails | null;
  emergencyDetails?: EmergencyDetails | null;
  balance?: number;
  patientCategory?: string;
  recordedPaymentsHistory?: any[];
}

export interface NotificationMsg {
  id: string;
  type: string;
  targetRole?: string;
  message: string;
  patientId?: string;
  sender?: string;
  timestamp: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  phone?: string;
  shift: 'Day' | 'Night' | 'Rotational' | string;
  status: 'Active' | 'On Leave' | 'Suspended' | 'Inactive' | string;
  salary?: number;
  hire_date?: string;
  date_joined?: string;
  documents_count?: number;
  created_at?: string;
}

export interface Absence {
  id: string;
  employee_id: string;
  employee_name: string;
  department?: string;
  leave_type?: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  days_count?: number;
  reason?: string;
  status: 'Sick Leave' | 'Personal Leave' | 'Unauthorized' | 'Vacation' | 'Pending' | 'Approved' | 'Rejected' | string;
  applied_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  comments?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  openings_count: number;
  employment_type: string;
  status: 'Open' | 'Closed' | 'Filled' | 'Draft';
  experience_required?: string;
  description?: string;
  posted_date: string;
}

export interface Candidate {
  id: string;
  job_id?: string;
  job_title?: string;
  candidate_name: string;
  email?: string;
  phone?: string;
  role_applied?: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Hired' | 'Rejected';
  experience_years: number;
  applied_date: string;
  notes?: string;
  rating?: number;
}

export interface Procurement {
  id: string;
  item_name: string;
  items?: string;
  quantity?: number;
  unit_price?: number;
  amount: number;
  department?: string;
  supplier_name?: string;
  requested_by?: string;
  status: 'Pending' | 'Approved' | 'Ordered' | 'Delivered' | 'Cancelled' | string;
  date_ordered?: string;
  date: string;
  category?: string;
}

export interface DiscountPolicy {
  id: string;
  title: string;
  discount_code?: string;
  category: string;
  percentage?: number;
  fixed_amount?: number;
  applicable_service?: string;
  authorized_by?: string;
  status: 'Active' | 'Suspended' | 'Expired';
  description?: string;
  created_at?: string;
}

export interface HRDashboardStats {
  totalEmployees: number;
  openPositions: number;
  totalCandidates: number;
  totalProcurements: number;
  roleDistribution: {
    doctors: number;
    nurses: number;
    pharmacists: number;
    security: number;
    dayWorkers: number;
    nightWorkers: number;
  };
  recentProcurements: Procurement[];
}

/**
 * Cashier / billing domain types.
 * Backend returns camelCase-mapped rows on most endpoints but raw
 * snake_case rows on others (e.g. SELECT * discount/outstanding lists),
 * so both spellings are accepted; writers should prefer camelCase.
 */

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  patientId?: string;
  patientName?: string;
  encounterId?: string;
  amount: number | string;
  total?: number | string;
  amountPaid?: number | string;
  balance?: number | string;
  description?: string;
  serviceType?: string;
  purpose?: string;
  cardType?: string;
  status: string;
  dateIssued?: string;
  // Raw snake_case fallbacks (joined queue/invoice rows)
  invoice_number?: string;
  patient_id?: string;
  patient_name?: string;
  encounter_id?: string;
  amount_paid?: number | string;
  service_type?: string;
  card_type?: string;
  date_issued?: string;
}

export interface Payment {
  id: string;
  patientId?: string;
  encounterId?: string;
  invoiceId?: string;
  amount: number | string;
  amountPaid?: number | string;
  totalBill?: number | string;
  balance?: number | string;
  status: string;
  datePaid?: string;
  paymentMethod?: string;
  collectedBy?: string;
  purpose?: string;
  department?: string;
  // Raw snake_case fallbacks (joined ledger rows)
  patient_id?: string;
  patient_name?: string;
  hospital_number?: string;
  encounter_id?: string;
  invoice_id?: string;
  invoice_desc?: string;
  amount_paid?: number | string;
  total_bill?: number | string;
  date_paid?: string;
  payment_method?: string;
  collected_by?: string;
  card_type?: string;
}

export interface OutstandingBalance {
  id: string;
  patientId?: string;
  patientName?: string;
  hospitalNumber?: string;
  encounterId?: string;
  invoiceId?: string;
  purpose?: string;
  department?: string;
  departmentOwed?: string;
  totalBill?: number | string;
  amountPaid?: number | string;
  balance?: number | string;
  status: string;
  paymentMethod?: string;
  clearedBy?: string;
  clearedAt?: string;
  lastPaymentDate?: string;
  phoneNumber?: string;
  // Raw snake_case fallbacks (SELECT * rows)
  patient_id?: string;
  patient_name?: string;
  hospital_number?: string;
  encounter_id?: string;
  invoice_id?: string;
  department_owed?: string;
  total_bill?: number | string;
  amount_paid?: number | string;
  payment_method?: string;
  cleared_by?: string;
  cleared_at?: string;
  last_payment_date?: string;
  phone_number?: string;
}

export interface DiscountRequest {
  id: string;
  patientId?: string;
  patientName?: string;
  hospitalNumber?: string;
  encounterId?: string;
  invoiceId?: string;
  originalAmount?: number | string;
  discountType?: 'Percentage' | 'Fixed' | string;
  discountValue?: number | string;
  calculatedDiscount?: number | string;
  finalAmount?: number | string;
  reason?: string;
  status?: string;
  requestedBy?: string;
  requestedAt?: string;
  approvedBy?: string;
  // Raw snake_case fallbacks (SELECT * rows)
  patient_id?: string;
  patient_name?: string;
  hospital_number?: string;
  encounter_id?: string;
  invoice_id?: string;
  original_amount?: number | string;
  discount_type?: string;
  discount_value?: number | string;
  calculated_discount?: number | string;
  final_amount?: number | string;
  requested_by?: string;
  requested_at?: string;
  approved_by?: string;
}

export interface LabPayment {
  id: string;
  patientId?: string;
  patientName?: string;
  hospitalNumber?: string;
  cardType?: string;
  encounterId?: string;
  invoiceId?: string;
  testsSummary?: string;
  amount?: number | string;
  totalBill?: number | string;
  amountPaid?: number | string;
  balance?: number | string;
  paymentMethod?: string;
  collectedBy?: string;
  datePaid?: string;
  status?: string;
  // Raw snake_case fallbacks (SELECT * rows)
  patient_id?: string;
  patient_name?: string;
  hospital_number?: string;
  card_type?: string;
  encounter_id?: string;
  invoice_id?: string;
  tests_summary?: string;
  total_bill?: number | string;
  amount_paid?: number | string;
  payment_method?: string;
  collected_by?: string;
  date_paid?: string;
}
