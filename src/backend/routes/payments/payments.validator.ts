import { Request, Response, NextFunction } from 'express';

const PAYMENT_METHODS = ['Cash', 'POS', 'Transfer'];

function isPositiveNumber(v: any): boolean {
  const n = Number(v);
  return typeof n === 'number' && Number.isFinite(n) && n > 0;
}

function isNonNegativeNumber(v: any): boolean {
  const n = Number(v);
  return typeof n === 'number' && Number.isFinite(n) && n >= 0;
}

function validatePaymentMethod(method: any, res: Response): boolean {
  if (method === undefined || method === null || method === '') return true;
  if (!PAYMENT_METHODS.includes(method)) {
    res.status(400).json({ success: false, error: 'paymentMethod must be one of [Cash, POS, Transfer]' });
    return false;
  }
  return true;
}

export function validateRecordPayment(req: Request, res: Response, next: NextFunction): void {
  const { patientId, amount, paymentMethod } = req.body;
  if (!patientId || typeof patientId !== 'string' || patientId.trim() === '') {
    res.status(400).json({ success: false, error: 'patientId is required' });
    return;
  }
  if (amount === undefined || amount === null || amount === '' || !isPositiveNumber(amount)) {
    res.status(400).json({ success: false, error: 'amount is required and must be a number > 0' });
    return;
  }
  if (!validatePaymentMethod(paymentMethod, res)) return;
  next();
}

export function validatePartial(req: Request, res: Response, next: NextFunction): void {
  const { patientId, totalBill, amountPaid, paymentMethod } = req.body;
  if (!patientId || typeof patientId !== 'string' || patientId.trim() === '') {
    res.status(400).json({ success: false, error: 'patientId is required' });
    return;
  }
  if (totalBill === undefined || totalBill === null || totalBill === '' || !isPositiveNumber(totalBill)) {
    res.status(400).json({ success: false, error: 'totalBill is required and must be a number > 0' });
    return;
  }
  if (amountPaid === undefined || amountPaid === null || amountPaid === '' || !isPositiveNumber(amountPaid)) {
    res.status(400).json({ success: false, error: 'amountPaid is required and must be a number > 0' });
    return;
  }
  const total = Number(totalBill);
  const paid = Number(amountPaid);
  if (!Number.isFinite(total) || !Number.isFinite(paid)) {
    res.status(400).json({ success: false, error: 'totalBill and amountPaid must be valid numbers' });
    return;
  }
  if (paid > total) {
    res.status(400).json({ success: false, error: 'amountPaid must not exceed totalBill (overpay rejected)' });
    return;
  }
  if (!validatePaymentMethod(paymentMethod, res)) return;
  next();
}

export function validateSettle(req: Request, res: Response, next: NextFunction): void {
  const { id, patientId, paymentAmount, paymentMethod } = req.body;
  if (!id || typeof id !== 'string' || id.trim() === '') {
    res.status(400).json({ success: false, error: 'id is required' });
    return;
  }
  if (!patientId || typeof patientId !== 'string' || patientId.trim() === '') {
    res.status(400).json({ success: false, error: 'patientId is required' });
    return;
  }
  if (paymentAmount === undefined || paymentAmount === null || paymentAmount === '' || !isPositiveNumber(paymentAmount)) {
    res.status(400).json({ success: false, error: 'paymentAmount is required and must be a number > 0' });
    return;
  }
  if (!validatePaymentMethod(paymentMethod, res)) return;
  next();
}

export function validateDiscountRequest(req: Request, res: Response, next: NextFunction): void {
  const { patientId, originalAmount, discountType, discountValue } = req.body;
  if (!patientId || typeof patientId !== 'string' || patientId.trim() === '') {
    res.status(400).json({ success: false, error: 'patientId is required' });
    return;
  }
  if (originalAmount === undefined || originalAmount === null || originalAmount === '' || !isPositiveNumber(originalAmount)) {
    res.status(400).json({ success: false, error: 'originalAmount is required and must be a number > 0' });
    return;
  }
  if (!discountType || !['Percentage', 'Fixed'].includes(discountType)) {
    res.status(400).json({ success: false, error: 'discountType must be Percentage or Fixed' });
    return;
  }
  if (discountValue === undefined || discountValue === null || discountValue === '' || !isNonNegativeNumber(discountValue)) {
    res.status(400).json({ success: false, error: 'discountValue is required and must be a number >= 0' });
    return;
  }
  const orig = Number(originalAmount);
  const val = Number(discountValue);
  if (discountType === 'Percentage') {
    if (val < 0 || val > 100) {
      res.status(400).json({ success: false, error: 'Percentage discountValue must be between 0 and 100' });
      return;
    }
  } else {
    if (val < 0 || val > orig) {
      res.status(400).json({ success: false, error: 'Fixed discountValue must satisfy 0 <= value <= originalAmount' });
      return;
    }
  }
  next();
}

export function validateDiscountDecision(req: Request, res: Response, next: NextFunction): void {
  const { id } = req.params;
  if (!id || typeof id !== 'string' || id.trim() === '') {
    res.status(400).json({ success: false, error: 'Discount request id param is required' });
    return;
  }
  next();
}
