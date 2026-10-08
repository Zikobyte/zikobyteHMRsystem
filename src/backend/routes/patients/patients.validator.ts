import { Request, Response, NextFunction } from 'express';

// Cap for POST /patients/bulk — keeps a single transaction bounded (IT-admin
// patient-directory import flow splits larger files client-side).
export const BULK_IMPORT_MAX_ROWS = 200;

// Pure per-row validator shared by POST / (via validateCreatePatient below)
// and POST /bulk (via PatientsService.bulkRegisterPatients). Mutates `body`
// only for the unidentified-emergency defaults, exactly as the single-patient
// path does. Returns an error message string, or null when the payload is valid.
export function validateCreatePatientPayload(body: any): string | null {
  const { cardType, patientCanProvideDetails } = body || {};

  // For unconscious or unidentified emergency intake
  if (cardType === 'Emergency' && patientCanProvideDetails === false) {
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      body.name = 'Unidentified Emergency Patient';
    }
    if (!body.dateOfBirth || isNaN(Date.parse(body.dateOfBirth))) {
      body.dateOfBirth = new Date().toISOString().split('T')[0];
    }
    if (!body.gender || !['Male', 'Female', 'Other'].includes(body.gender)) {
      body.gender = 'Male';
    }
    if (!body.phoneNumber || typeof body.phoneNumber !== 'string' || body.phoneNumber.trim() === '') {
      body.phoneNumber = '08000000000';
    }
    if (!body.address || typeof body.address !== 'string' || body.address.trim() === '') {
      body.address = 'Emergency Trauma Scene';
    }
  }

  const { name, dateOfBirth, gender, phoneNumber, address } = body || {};

  // Validate Full Name: must not be empty, must be at least 2 characters, and cannot be purely whitespace
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return 'Patient full name is required and must be at least 2 characters.';
  }

  // Validate Date of Birth: must be a valid date and CANNOT be in the future
  if (!dateOfBirth || isNaN(Date.parse(dateOfBirth))) {
    return 'Valid Date of Birth is required';
  }

  const dobDate = new Date(dateOfBirth);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (dobDate > today) {
    return 'Date of Birth cannot be in the future. Please enter a valid birth date.';
  }

  if (dobDate < new Date('1900-01-01')) {
    return 'Date of Birth cannot be earlier than year 1900.';
  }

  if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
    return 'Gender must be Male, Female, or Other';
  }

  // Validate Phone Number: must contain at least 7 digits and at most 15 digits
  const phoneDigits = typeof phoneNumber === 'string' ? phoneNumber.replace(/\D/g, '') : '';
  if (!phoneNumber || typeof phoneNumber !== 'string' || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return 'A valid and complete phone number (at least 7 digits) is required.';
  }

  if (!address || typeof address !== 'string' || address.trim() === '') {
    return 'Address is required';
  }

  if (!cardType || !['Standard', 'Maternity', 'Emergency'].includes(cardType)) {
    return 'Card type must be Standard, Maternity, or Emergency';
  }

  return null;
}

export function validateCreatePatient(req: Request, res: Response, next: NextFunction): void {
  const error = validateCreatePatientPayload(req.body);
  if (error) {
    res.status(400).json({ success: false, error });
    return;
  }

  next();
}

export function validateRecordVitals(req: Request, res: Response, next: NextFunction): void {
  const { bloodPressure, temperature, pulseRate, respiratoryRate, spo2, weight, height } = req.body;

  if (!bloodPressure || typeof bloodPressure !== 'string') {
    res.status(400).json({ error: 'Blood Pressure is required (e.g. 120/80)' });
    return;
  }

  if (temperature === undefined || isNaN(Number(temperature))) {
    res.status(400).json({ error: 'Temperature is required and must be a number' });
    return;
  }

  if (pulseRate === undefined || isNaN(Number(pulseRate))) {
    res.status(400).json({ error: 'Pulse Rate is required and must be a number' });
    return;
  }

  if (weight === undefined || isNaN(Number(weight))) {
    res.status(400).json({ error: 'Weight is required and must be a number' });
    return;
  }

  next();
}
