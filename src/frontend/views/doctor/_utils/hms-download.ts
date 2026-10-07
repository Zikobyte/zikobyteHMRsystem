/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx.
 *
 * Comprehensive HMS document generation + download. Pure function of
 * (patient, notify) — no component state. Body preserved verbatim
 * (showToast call sites now use the injected notify callback).
 */

import type { AdmittedPatient, DoctorNotify } from "./doctor-types";

// Generate & Download Comprehensive HMS Document
export function handleDownloadHMS(patient: AdmittedPatient, notify: DoctorNotify): void {
  try {
    const hmsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hospital Management System Record - ${patient.name} (${patient.hospitalNumber || patient.id})</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; background: #fff; margin: 0; padding: 24px; }
    .header { border-bottom: 3px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .badge { background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; font-family: monospace; }
    .section { margin-bottom: 24px; page-break-inside: avoid; }
    .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #0369a1; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 12px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 12px; }
    .label { color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }
    .val { font-weight: 600; color: #0f172a; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 12px; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 8px; }
    th { background: #f1f5f9; text-align: left; padding: 8px; font-weight: 700; color: #475569; border-bottom: 1px solid #cbd5e1; font-size: 10px; text-transform: uppercase; }
    td { padding: 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .status-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; font-family: monospace; }
    .status-Administered { background: #dcfce7; color: #166534; }
    .status-Pending { background: #fef3c7; color: #92400e; }
    .status-Dispensed { background: #e0f2fe; color: #075985; }
    .status-Cancelled { background: #ffe4e6; color: #9f1239; }
    .footer { font-size: 10px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-family: monospace; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">ZIKORA MEDICAL CENTRE</h1>
      <div class="subtitle">Hospital Management System (HMS) Summary</div>
      <div style="font-size: 11px; color: #0284c7; font-weight: 700; margin-top: 6px;">Hospital No: ${patient.hospitalNumber || patient.id}</div>
    </div>
    <div style="text-align: right;">
      <span class="badge">${patient.ward || 'INPATIENT'} • Bed ${patient.bed || '—'}</span>
      <div class="subtitle" style="margin-top: 6px;">Generated: ${new Date().toLocaleString()}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">1. Patient Demographics & Admission Overview</div>
    <div class="grid-4 box">
      <div><div class="label">Patient Full Name</div><div class="val">${patient.name}</div></div>
      <div><div class="label">Gender / DOB</div><div class="val">${patient.gender} | ${patient.dateOfBirth || '—'}</div></div>
      <div><div class="label">Ward & Bed</div><div class="val">${patient.ward || '—'} / ${patient.bed || '—'}</div></div>
      <div><div class="label">Admitted Since</div><div class="val">${patient.admittedDate || patient.since || '—'}</div></div>
      <div><div class="label">Department</div><div class="val">${patient.department || 'General'}</div></div>
      <div><div class="label">Religion</div><div class="val">${patient.religion || '—'}</div></div>
      <div><div class="label">Obstetric Details</div><div class="val">EDD: ${patient.edd || '—'} | ${patient.gravidaPara || '—'}</div></div>
      <div><div class="label">Account Status</div><div class="val">Total: ₦${Number(patient.totalCharged || 0).toLocaleString()} | Paid: ₦${Number(patient.paymentsMade || 0).toLocaleString()}</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">2. Current Clinical Notes & Diagnosis</div>
    <div class="box" style="white-space: pre-wrap; font-family: monospace;">${patient.notes || 'No primary notes recorded.'}</div>
  </div>

  <div class="section">
    <div class="section-title">3. Doctor's Orders & Directives</div>
    <div class="box" style="white-space: pre-wrap; font-family: monospace;">${patient.doctorOrders || 'No current directives specified.'}</div>
  </div>

  <div class="section">
    <div class="section-title">4. Vital Signs History</div>
    ${patient.vitalsRecords && patient.vitalsRecords.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Date / Time</th>
          <th>BP (mmHg)</th>
          <th>HR (Pulse)</th>
          <th>Temp (°C)</th>
          <th>RR (/min)</th>
          <th>SpO₂ (%)</th>
          <th>Recorded By</th>
        </tr>
      </thead>
      <tbody>
        ${patient.vitalsRecords.map((v) => `
        <tr>
          <td>${v.timestamp || '—'}</td>
          <td><b>${v.bp || '—'}</b></td>
          <td>${v.hr || '—'}</td>
          <td>${v.temp || '—'}</td>
          <td>${v.rr || '—'}</td>
          <td>${v.spo2 || '—'}</td>
          <td>${v.recordedBy || 'Nurse'}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    ` : '<div class="box">No vital signs logs available.</div>'}
  </div>

  <div class="section">
    <div class="section-title">5. Inpatient Medications & Injection Logs</div>
    ${patient.medicationsRecords && patient.medicationsRecords.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Medication / Item</th>
          <th>Dose & Qty</th>
          <th>Frequency</th>
          <th>Status</th>
          <th>Ordered By</th>
          <th>Administration Log</th>
          <th>Clinical Notes</th>
        </tr>
      </thead>
      <tbody>
        ${patient.medicationsRecords.map((m) => `
        <tr>
          <td><b>${m.name}</b></td>
          <td>${m.dose || '—'} (${m.quantity || '1'})</td>
          <td>${m.frequency || '—'}</td>
          <td><span class="status-badge status-${m.status || 'Pending'}">${m.status || 'Pending'}</span></td>
          <td>${m.orderedBy || 'Dr. Emeka Eze'}</td>
          <td>${m.administeredAt ? `${m.administeredAt} by ${m.administeredBy || 'Nurse'}` : 'Awaiting admin'}</td>
          <td style="font-style: italic;">${m.note || '—'}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    ` : '<div class="box">No medication records available.</div>'}
  </div>

  <div class="section">
    <div class="section-title">6. Clinical Observations History</div>
    ${patient.observationsRecords && patient.observationsRecords.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Date / Time</th>
          <th>Category</th>
          <th>Observation Details</th>
          <th>Clinician / Nurse</th>
        </tr>
      </thead>
      <tbody>
        ${patient.observationsRecords.map((obs) => `
        <tr>
          <td>${obs.timestamp || '—'}</td>
          <td><b style="color: #0369a1;">${obs.category || 'General'}</b></td>
          <td style="font-family: monospace;">${obs.note || '—'}</td>
          <td>${obs.recordedBy || 'Clinician'}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    ` : '<div class="box">No observation logs recorded.</div>'}
  </div>

  <div class="section">
    <div class="section-title">7. Placed Inpatient Orders</div>
    ${patient.newOrdersList && patient.newOrdersList.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Target Dept</th>
          <th>Order Description & Tests</th>
          <th>Status</th>
          <th>Order Date</th>
        </tr>
      </thead>
      <tbody>
        ${patient.newOrdersList.map((ord) => `
        <tr>
          <td><b>${ord.id}</b></td>
          <td>${ord.target || ord.type}</td>
          <td style="font-family: monospace;">${ord.description}</td>
          <td><span class="status-badge status-${ord.status}">${ord.status}</span></td>
          <td>${ord.timestamp}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    ` : '<div class="box">No additional orders placed.</div>'}
  </div>

  <div class="section">
    <div class="section-title">8. Inpatient Financial & Charges Breakdown</div>
    <div class="grid-4 box">
      <div><div class="label">Total Incurred</div><div class="val">₦${Number(patient.totalCharged || 0).toLocaleString()}</div></div>
      <div><div class="label">Payments Made</div><div class="val" style="color: #166534;">₦${Number(patient.paymentsMade || 0).toLocaleString()}</div></div>
      <div><div class="label">Outstanding Balance</div><div class="val" style="color: #dc2626;">₦${Math.max(0, Number(patient.totalCharged || 0) - Number(patient.paymentsMade || 0)).toLocaleString()}</div></div>
      <div><div class="label">Discharge Bill</div><div class="val">₦${Number(patient.dischargeBill || patient.totalCharged || 0).toLocaleString()}</div></div>
    </div>
    ${patient.chargesList && patient.chargesList.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Item / Service Description</th>
          <th>Date Incurred</th>
          <th style="text-align: right;">Amount (₦)</th>
        </tr>
      </thead>
      <tbody>
        ${patient.chargesList.map((c) => `
        <tr>
          <td>${c.item}</td>
          <td>${c.timestamp || '—'}</td>
          <td style="text-align: right; font-weight: 700;">₦${Number(c.amount || 0).toLocaleString()}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}
  </div>

  <div class="footer">
    Zikora Medical Centre • Confidential Hospital Management System Record • Validated by Attending Medical Officer
  </div>
</body>
</html>`;

    const blob = new Blob([hmsHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `HMS_${patient.hospitalNumber || patient.id}_${patient.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);

    notify(`HMS clinical file downloaded for ${patient.name}`);
  } catch (e: unknown) {
    console.error('Error downloading HMS:', e);
    notify('Failed to download HMS record. Please try again.', 'error');
  }
}
