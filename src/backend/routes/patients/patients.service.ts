import { PatientsRepository, QueryExecutor } from './patients.repository';
import { CARD_FEES, EMERGENCY_FEE_SCHEDULE, PATIENT_MESSAGES } from './patients.constants';
import { validateCreatePatientPayload } from './patients.validator';
import { getPostgresPool, getPostgresStatus, query } from '../../database/db.repo';

export interface BulkRowFailure {
  index: number;
  error: string;
}

export interface BulkRegisterResult {
  created: any[];
  failed: BulkRowFailure[];
}

export class PatientsService {
  private repo = new PatientsRepository();

  public async getAllPatients(): Promise<any[]> {
    return this.repo.findAll();
  }

  public async getPatientById(id: string): Promise<any> {
    const patient = await this.repo.findById(id);
    if (!patient) {
      throw new Error(PATIENT_MESSAGES.NOT_FOUND);
    }
    return patient;
  }

  public async registerPatient(
    patientData: any,
    registrarUsername: string,
    executor: QueryExecutor = query,
    opts?: { silent?: boolean }
  ): Promise<any> {
    // 1. Check duplicate patient to prevent double registration
    if (patientData.name && patientData.name.trim() !== 'Unidentified Emergency Patient') {
      const duplicates = await this.repo.checkDuplicates(patientData.name, patientData.phoneNumber || '', executor);
      if (duplicates && duplicates.length > 0) {
        const existing = duplicates[0];
        throw new Error(`Registration Blocked: Patient record already exists for "${existing.name}" (Hospital Number: ${existing.hospital_number}). Duplicate registration is not permitted. Please use their existing file.`);
      }
    }

    let cardFee = 0;

    // Calculate card fee based on card type and details
    if (patientData.cardType === 'Standard') {
      cardFee = CARD_FEES.STANDARD;
    } else if (patientData.cardType === 'Maternity') {
      cardFee = CARD_FEES.MATERNITY;
    } else if (patientData.cardType === 'Emergency') {
      // Base fee
      cardFee = CARD_FEES.EMERGENCY;
      
      // Add extra emergency charges if checked
      if (patientData.emergencyDetails) {
        const details = patientData.emergencyDetails;
        if (details.isSickEmergency) cardFee += EMERGENCY_FEE_SCHEDULE.SICK_EMERGENCY;
        if (details.isUnbookedLabour) cardFee += EMERGENCY_FEE_SCHEDULE.UNBOOKED_LABOUR;
        if (details.isAccident) cardFee += EMERGENCY_FEE_SCHEDULE.ACCIDENT;
        if (details.isDoctorOnCall || details.isAfterHours) cardFee += EMERGENCY_FEE_SCHEDULE.DOCTOR_ON_CALL;
      }
    }

    const patientToSave = {
      ...patientData,
      // Server-authoritative fee — client cardFee NEVER trusted.
      cardFee,
      registeredBy: patientData.registeredBy || registrarUsername,
    };

    return this.repo.create(patientToSave, executor, opts);
  }

  // Transactional bulk import for the IT-admin patient-directory import flow.
  // Reuses the EXISTING single-patient path per row: the same pure validator
  // (validateCreatePatientPayload) and the same registerPatient() creation
  // (server-authoritative cardFee — a client-supplied cardFee is overwritten
  // there and never trusted).
  //
  // Consistency choice (documented): PARTIAL COMMIT. Valid rows are committed
  // and invalid rows are reported in `failed` so the frontend can show per-row
  // errors and the operator can fix-and-retry only those rows. A single bad
  // row must not discard hundreds of good registrations. Only TOTAL failure
  // (zero rows creatable) rolls everything back and throws.
  //
  // Implementation: one pg client + BEGIN/COMMIT/ROLLBACK around the batch
  // (same convention as payments withBillingTransaction). Each row runs under
  // its own SAVEPOINT because a failed statement would otherwise poison the
  // whole Postgres transaction; a row error does ROLLBACK TO SAVEPOINT and is
  // recorded in `failed` while the batch continues. No WS broadcasts happen
  // inside the transaction (silent mode) — the controller emits one summary
  // broadcast after commit so a ROLLBACK never emits phantom notifications.
  public async bulkRegisterPatients(rows: any[], registrarUsername: string): Promise<BulkRegisterResult> {
    const failed: BulkRowFailure[] = [];
    const valid: Array<{ index: number; row: any }> = [];

    rows.forEach((row, index) => {
      if (!row || typeof row !== 'object') {
        failed.push({ index, error: 'Row must be a create-patient object.' });
        return;
      }
      const validationError = validateCreatePatientPayload(row);
      if (validationError) {
        failed.push({ index, error: validationError });
      } else {
        valid.push({ index, row });
      }
    });

    if (valid.length === 0) {
      throw new Error(
        `Bulk import failed: all ${rows.length} row(s) rejected. ` +
        failed.slice(0, 5).map((f) => `Row ${f.index}: ${f.error}`).join(' ')
      );
    }

    const created: any[] = [];
    const pool = getPostgresPool();
    const { isPostgresActive } = getPostgresStatus();

    if (!pool || !isPostgresActive) {
      // No live pg pool (query() would throw) — sequential best-effort path.
      for (const { index, row } of valid) {
        try {
          created.push(await this.registerPatient(row, registrarUsername));
        } catch (err: any) {
          failed.push({ index, error: err?.message || 'Row creation failed.' });
        }
      }
      failed.sort((a, b) => a.index - b.index);
      if (created.length === 0) {
        throw new Error(
          `Bulk import failed: all ${rows.length} row(s) rejected. ` +
          failed.slice(0, 5).map((f) => `Row ${f.index}: ${f.error}`).join(' ')
        );
      }
      return { created, failed };
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const txQuery: QueryExecutor = (text, params) => client.query(text, params);

      let savepointSeq = 0;
      for (const { index, row } of valid) {
        const savepoint = `bulk_row_sp_${savepointSeq++}`;
        await client.query(`SAVEPOINT ${savepoint}`);
        try {
          const patient = await this.registerPatient(row, registrarUsername, txQuery, { silent: true });
          created.push(patient);
          await client.query(`RELEASE SAVEPOINT ${savepoint}`);
        } catch (err: any) {
          await client.query(`ROLLBACK TO SAVEPOINT ${savepoint}`);
          failed.push({ index, error: err?.message || 'Row creation failed.' });
        }
      }

      failed.sort((a, b) => a.index - b.index);

      if (created.length === 0) {
        await client.query('ROLLBACK');
        throw new Error(
          `Bulk import failed: all ${rows.length} row(s) rejected. ` +
          failed.slice(0, 5).map((f) => `Row ${f.index}: ${f.error}`).join(' ')
        );
      }

      await client.query('COMMIT');
      return { created, failed };
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // Ignore rollback errors — the original error takes precedence.
      }
      throw err;
    } finally {
      client.release();
    }
  }

  public async updatePatient(id: string, updates: any): Promise<any> {
    const patient = await this.repo.findById(id);
    if (!patient) {
      throw new Error(PATIENT_MESSAGES.NOT_FOUND);
    }

    return this.repo.update(id, updates);
  }

  public async recordVitals(id: string, vitals: any): Promise<any> {
    const patient = await this.repo.findById(id);
    if (!patient) {
      throw new Error(PATIENT_MESSAGES.NOT_FOUND);
    }

    const updates = {
      vitals,
      status: 'Waiting for Doctor',
    };

    return this.repo.update(id, updates);
  }

  // ==========================================
  // Advanced OPD Workflow Service Functions
  // ==========================================

  public async getPrices(): Promise<any[]> {
    return this.repo.getPrices();
  }

  public async updatePrice(itemCode: string, price: number): Promise<void> {
    return this.repo.updatePrice(itemCode, price);
  }

  public async getCompanies(): Promise<any[]> {
    return this.repo.getCompanies();
  }

  public async getFamilies(): Promise<any[]> {
    return this.repo.getFamilies();
  }

  public async addFamilyDeposit(familyId: string, amount: number, createdBy: string, description: string): Promise<any> {
    return this.repo.addFamilyDeposit(familyId, amount, createdBy, description);
  }

  public async createEncounter(patientId: string, visitType: string, destinationClinic: string, priority: string, priorityReason: string, createdBy: string): Promise<any> {
    return this.repo.createEncounter(patientId, visitType, destinationClinic, priority, priorityReason, createdBy);
  }

  public async getEncounters(): Promise<any[]> {
    return this.repo.getEncounters();
  }

  public async getQueue(): Promise<any[]> {
    return this.repo.getQueue();
  }

  public async recordOPDVitals(patientId: string, encounterId: string, vitals: any, recordedBy: string): Promise<void> {
    return this.repo.recordOPDVitals(patientId, encounterId, vitals, recordedBy);
  }

  public async updateEncounterPriority(encounterId: string, priority: string, reason: string, updatedBy: string): Promise<void> {
    return this.repo.updateEncounterPriority(encounterId, priority, reason, updatedBy);
  }

  public async requestCardReplacement(patientId: string, oldCardNumber: string, newCardNumber: string, approvedBy: string, lastOfficeSeen: string, reason: string): Promise<void> {
    return this.repo.requestCardReplacement(patientId, oldCardNumber, newCardNumber, approvedBy, lastOfficeSeen, reason);
  }

  public async getCardReplacements(): Promise<any[]> {
    return this.repo.getCardReplacements();
  }

  public async checkDuplicates(name: string, phoneNumber: string): Promise<any[]> {
    return this.repo.checkDuplicates(name, phoneNumber);
  }

  public async getDashboardStats(): Promise<any> {
    return this.repo.getDashboardStats();
  }

  public async saveDoctorNotes(patientId: string, encounterId: string | null | undefined, notes: string, doctorName: string): Promise<any> {
    return this.repo.saveDoctorNotes(patientId, encounterId, notes, doctorName);
  }

  public async completeConsultation(
    patientId: string,
    encounterId: string,
    notes: string,
    orderedTests: any[],
    prescribedMedications: any[],
    routeTo: 'lab' | 'pharmacy',
    completedBy: string
  ): Promise<void> {
    return this.repo.completeConsultation(patientId, encounterId, notes, orderedTests, prescribedMedications, routeTo, completedBy);
  }

  public async getLabOrders(encounterId: string): Promise<any[]> {
    return this.repo.getLabOrders(encounterId);
  }

  public async getLabResults(encounterId?: string, patientId?: string): Promise<any[]> {
    return this.repo.getLabResults(encounterId, patientId);
  }

  public async getPharmacyOrders(encounterId: string): Promise<any[]> {
    return this.repo.getPharmacyOrders(encounterId);
  }

  public async completeLaboratoryTest(
    patientId: string,
    encounterId: string,
    testResults: any[],
    completedBy: string
  ): Promise<void> {
    return this.repo.completeLaboratoryTest(patientId, encounterId, testResults, completedBy);
  }

  public async completePharmacyDispense(
    patientId: string,
    encounterId: string,
    completedBy: string
  ): Promise<void> {
    return this.repo.completePharmacyDispense(patientId, encounterId, completedBy);
  }

  public async getInvoices(): Promise<any[]> {
    return this.repo.getInvoices();
  }
}
