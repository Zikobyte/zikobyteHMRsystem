/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx (PAGE 2: WALK-IN LAB PATIENT).
 *
 * Walk-in registration form with categorized test picker, plus the
 * pending-payment vs paid-ready two-card grid. Verbatim JSX; state and
 * handlers come from useLabWalkIn. The paid walk-in processing modal
 * lives in _modals/ and is mounted by the shell.
 */

import {
  CheckCircle2,
  CheckSquare,
  Clock,
  Loader2,
  Send,
  Square,
  UserPlus
} from 'lucide-react';
import type { UseLabWalkInResult } from '../_hooks/useLabWalkIn';
import { WALK_IN_LAB_CATALOG } from '../_utils/lab-catalog';

export interface WalkInTabProps {
  walkIn: UseLabWalkInResult;
  filteredWalkInPending: any[];
  filteredWalkInPaid: any[];
  searchQuery: string;
}

export default function WalkInTab({
  walkIn,
  filteredWalkInPending,
  filteredWalkInPaid,
  searchQuery,
}: WalkInTabProps) {
  const {
    walkInPendingPayment,
    walkInPaidReady,
    patientName,
    setPatientName,
    dob,
    setDob,
    gender,
    setGender,
    maritalStatus,
    setMaritalStatus,
    phoneNumber,
    setPhoneNumber,
    address,
    setAddress,
    referringDoctor,
    setReferringDoctor,
    selectedTests,
    isRegisteringWalkIn,
    totalWalkInPrice,
    handleMarkSentToCashier,
    handleToggleTest,
    handleRegisterWalkIn,
    setSelectedPaidWalkIn,
  } = walkIn;

  return (
    <div className="space-y-8">
      {/* Top Registration Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#2A758C]" />
            Register Walk-in Patient
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fill this form for direct walk-in patients requesting laboratory tests without prior internal doctor consultation.
          </p>
        </div>

        <form onSubmit={handleRegisterWalkIn} className="space-y-6">
          {/* Personal Details Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Patient Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Patient Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Full name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                max={new Date().toISOString().split('T')[0]}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C] text-slate-900 font-medium cursor-pointer"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C] cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Marital Status */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Marital Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C] cursor-pointer"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="08012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]"
              />
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Address</label>
              <input
                type="text"
                placeholder="Street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]"
              />
            </div>

            {/* Referring Doctor (Optional) */}
            <div className="space-y-1 sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-bold text-slate-700">Referring Doctor (Optional)</label>
              <input
                type="text"
                placeholder="Dr. External Name"
                value={referringDoctor}
                onChange={(e) => setReferringDoctor(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]"
              />
            </div>
          </div>

          {/* Select Lab Tests Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs font-black text-slate-700 uppercase font-mono">
                Total Payable Fee:
              </span>
              <span className="text-base font-black text-[#2A758C] font-mono">
                ₦{totalWalkInPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
                Select Lab Tests <span className="text-rose-500">*</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
              {WALK_IN_LAB_CATALOG.map((catGroup) => (
                <div key={catGroup.category} className="bg-white p-4 rounded-xl border border-slate-100 space-y-2 shadow-2xs">
                  <h4 className="text-xs font-black text-[#2A758C] uppercase tracking-wider font-mono border-b border-slate-100 pb-1.5">
                    {catGroup.category}
                  </h4>
                  <div className="space-y-1.5 pt-1">
                    {catGroup.tests.map((test) => {
                      const isChecked = selectedTests.some(t => t.id === test.id);

                      return (
                        <button
                          type="button"
                          key={test.id}
                          onClick={() => handleToggleTest(test, catGroup.category)}
                          className={`w-full flex items-center justify-between text-left p-2 rounded-lg transition-all text-xs cursor-pointer ${
                            isChecked
                              ? 'bg-[#2A758C]/10 border border-[#2A758C]/30 text-slate-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 pr-2">
                            {isChecked ? (
                              <CheckSquare className="h-4 w-4 text-[#2A758C] shrink-0" />
                            ) : (
                              <Square className="h-4 w-4 text-slate-300 shrink-0" />
                            )}
                            <span>{test.name}</span>
                          </div>
                          <span className="font-mono text-slate-800 font-bold shrink-0">
                            ₦{test.price.toLocaleString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Form Button */}
          <button
            type="submit"
            disabled={isRegisteringWalkIn || selectedTests.length === 0 || !patientName.trim() || !dob.trim() || !phoneNumber.trim()}
            className="w-full py-3.5 rounded-2xl bg-[#2A758C] hover:bg-[#1f5869] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegisteringWalkIn ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Registering & Sending to Cashier...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>
                  {selectedTests.length > 0
                    ? `Register & Send to Cashier (₦${totalWalkInPrice.toLocaleString()})`
                    : 'Register & Send to Cashier'
                  }
                </span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Lower Grid: Pending Payment vs Paid - Ready for Testing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Pending Payment (X) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Pending Payment ({filteredWalkInPending.length})
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Awaiting Cashier
            </span>
          </div>

          {walkInPendingPayment.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-100 rounded-2xl">
              No walk-in patients pending payment.
            </div>
          ) : filteredWalkInPending.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-100 rounded-2xl">
              No pending payment matches "{searchQuery}".
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredWalkInPending.map((patient, idx) => (
                <div
                  key={patient.encounterId || idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{patient.patientName}</h4>
                        <span className="text-[10px] font-mono text-[#2A758C] font-bold">
                          {patient.hospitalNumber || 'NEW'}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">
                        📞 {patient.phoneNumber} • {patient.gender} ({patient.dob || '—'})
                      </p>
                      {patient.referringDoctor && (
                        <p className="text-[11px] text-indigo-700 font-semibold mt-0.5">
                          Ref: {patient.referringDoctor}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-[#2A758C] font-mono block">
                        ₦{(patient.totalAmount || 0).toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {patient.testCount || 1} test(s)
                      </span>
                    </div>
                  </div>

                  {/* Selected Tests Tags */}
                  {patient.testsList && patient.testsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {patient.testsList.map((testName: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] font-extrabold text-slate-700 rounded-lg"
                        >
                          {testName}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] gap-2">
                    <span className="text-amber-800 font-bold italic flex items-center gap-1.5 shrink-0">
                      <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                      {patient.isSentToCashier ? 'Sent to Cashier — Awaiting Payment' : 'Pending Payment'}
                    </span>

                    {patient.isSentToCashier ? (
                      <span className="px-3 py-1 text-[10px] font-black rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Sent to Cashier
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleMarkSentToCashier(patient.encounterId, patient.patientName)}
                        className="px-3 py-1.5 text-[10px] font-black rounded-xl bg-[#2A758C] hover:bg-[#1f5869] text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0"
                      >
                        <Send className="h-3 w-3" />
                        <span>Mark as "Sent to Cashier"</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Card: Paid - Ready for Testing (Y) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Paid - Ready for Testing ({filteredWalkInPaid.length})
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Ready to Process
            </span>
          </div>

          {walkInPaidReady.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-100 rounded-2xl">
              No paid walk-in patients ready for testing.
            </div>
          ) : filteredWalkInPaid.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-100 rounded-2xl">
              No ready walk-in matches "{searchQuery}".
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredWalkInPaid.map((patient, idx) => (
                <button
                  key={patient.encounterId || idx}
                  onClick={() => setSelectedPaidWalkIn(patient)}
                  className="w-full text-left p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-[#2A758C] transition-colors">
                        {patient.patientName}
                      </h4>
                      <p className="text-xs font-mono text-slate-500">{patient.phoneNumber}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                      {patient.testCount || 1} test(s) - Click to process
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
