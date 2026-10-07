/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from PharmacyView.tsx (PAGE 1: DISPENSING, verbatim
 * JSX).
 *
 * Outpatient dispensing desk: pending-prescriptions summary bar, pending
 * queue list, and the selected-patient prescription panel (paid detail
 * table + dispense/download actions, unpaid restricted notice). State
 * and handlers arrive via props from usePharmacyDispensing; the role
 * gate arrives as canActElsewhere.
 */

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Download,
  Search,
  ShoppingBag,
  User as UserIcon
} from 'lucide-react';
import type { PatientQueueItem } from '../_utils/pharmacy-procurement';

export interface DispensingTabProps {
  pendingQueue: PatientQueueItem[];
  filteredQueue: PatientQueueItem[];
  selectedPatient: PatientQueueItem | undefined;
  selectedPatientId: string;
  setSelectedPatientId: (value: string) => void;
  dispensingSearch: string;
  setDispensingSearch: (value: string) => void;
  dispenseSuccess: string;
  setDispenseSuccess: (value: string) => void;
  dispenseError: string;
  setDispenseError: (value: string) => void;
  canActElsewhere: boolean;
  handleDispenseMeds: (patientId: string) => void;
  handleSimulatePayment: (patientId: string) => void;
  handleDownloadHMS: (patient: PatientQueueItem) => void;
}

export default function DispensingTab({
  pendingQueue,
  filteredQueue,
  selectedPatient,
  setSelectedPatientId,
  dispensingSearch,
  setDispensingSearch,
  dispenseSuccess,
  setDispenseSuccess,
  dispenseError,
  setDispenseError,
  canActElsewhere,
  handleDispenseMeds,
  handleSimulatePayment,
  handleDownloadHMS
}: DispensingTabProps) {
  return (
        <div className="space-y-6">

          {/* Header Summary Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Total Pending Prescriptions:
              </span>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl font-mono font-black text-sm border border-amber-200">
                {pendingQueue.length}
              </span>
            </div>
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient name, PAT-ID..."
                value={dispensingSearch}
                onChange={e => setDispensingSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {dispenseSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 font-medium flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{dispenseSuccess}</span>
              </div>
              <button onClick={() => setDispenseSuccess('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">Dismiss</button>
            </div>
          )}

          {dispenseError && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs text-rose-800 font-medium flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{dispenseError}</span>
              </div>
              <button onClick={() => setDispenseError('')} className="text-rose-700 hover:text-rose-900 text-xs font-bold">Dismiss</button>
            </div>
          )}

          {/* Grid Layout: Left Queue vs Right Patient Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column: Pending Prescriptions Queue */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>Pending Queue ({filteredQueue.length})</span>
                <span className="text-[10px] text-slate-400 font-normal">Select to view prescription</span>
              </h3>

              {filteredQueue.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <ShoppingBag className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No Pending Prescriptions</p>
                  <p className="text-[10px] text-slate-400 mt-1">All pharmacy orders have been completed.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {filteredQueue.map(item => {
                    const isSelected = selectedPatient?.id === item.id;
                    const isPaid = item.paymentStatus === 'PAID';

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedPatientId(item.id);
                          setDispenseError('');
                        }}
                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div>
                          <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {item.patientName}
                          </p>
                          <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                            ID: {item.hospitalNumber} | Phone: {item.phoneNumber}
                          </p>
                          <p className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-amber-100' : 'text-slate-600'}`}>
                            {item.prescribedMeds.length} Prescribed Item(s) • Total: ₦{item.totalBill.toLocaleString()}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold block ${
                            isPaid
                              ? (isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800')
                              : (isSelected ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800')
                          }`}>
                            {item.paymentStatus}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Selected Patient Information Details (Exact Format Requested) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              {selectedPatient ? (
                selectedPatient.paymentStatus === 'PAID' ? (
                  /* ONLY Patients That Have Paid Display Information On This Page */
                  <div className="space-y-6">

                    {/* Patient Header Box */}
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-lg font-black text-slate-900">{selectedPatient.patientName}</h2>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        ID: <strong className="text-slate-800">{selectedPatient.hospitalNumber}</strong> | Phone: <strong className="text-slate-800">{selectedPatient.phoneNumber}</strong>
                      </p>
                    </div>

                    {/* Prescribed Medications Section */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide font-mono">
                        Prescribed Medications
                      </h3>

                      <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                              <th className="py-2.5 px-4">Medication</th>
                              <th className="py-2.5 px-4 text-center">Quantity</th>
                              <th className="py-2.5 px-4 text-right">Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {selectedPatient.prescribedMeds.map((med, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-3 px-4 font-bold text-slate-800">{med.name}</td>
                                <td className="py-3 px-4 text-center text-slate-600">{med.quantity}</td>
                                <td className="py-3 px-4 text-right font-bold text-slate-900">
                                  ₦{med.price.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Total Amount Row */}
                      <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-mono">
                        <span className="text-xs font-bold text-slate-700">Total:</span>
                        <span className="text-base font-black text-amber-900">
                          ₦{selectedPatient.totalBill.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Payment Status Row */}
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-500">Payment Status:</p>
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-lg border border-emerald-200">
                        PAID
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => handleDispenseMeds(selectedPatient.id)}
                        disabled={!canActElsewhere}
                        title={!canActElsewhere ? 'Pharmacist only' : undefined}
                        className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Dispense Medications
                      </button>

                      <button
                        onClick={() => handleDownloadHMS(selectedPatient)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="h-4 w-4 text-slate-600" />
                        Download HMS
                      </button>
                    </div>

                  </div>
                ) : (
                  /* IF PATIENT IS NOT PAID: Restricted Access Notice */
                  <div className="py-16 text-center space-y-4">
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{selectedPatient.patientName}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        ID: {selectedPatient.hospitalNumber} | Phone: {selectedPatient.phoneNumber}
                      </p>
                    </div>
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-800 max-w-md mx-auto">
                      <p className="font-bold">Payment Status: UNPAID</p>
                      <p className="mt-1 text-[11px] text-rose-700">
                        Only patients that have paid can have their prescription details & dispensing enabled on this page.
                      </p>
                    </div>
                    <button
                      onClick={() => handleSimulatePayment(selectedPatient.id)}
                      disabled={!canActElsewhere}
                      title={!canActElsewhere ? 'Pharmacist only' : undefined}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Simulate Payment Clearance (Mark Paid)
                    </button>
                  </div>
                )
              ) : (
                <div className="py-24 text-center text-xs text-slate-400">
                  <UserIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-500">No Patient Selected</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Select a patient from the queue on the left to view prescription details.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
  );
}
