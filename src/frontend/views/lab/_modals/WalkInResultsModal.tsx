/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx (PAGE 2 paid walk-in
 * processing modal). Verbatim JSX. Mounted by the shell; state and
 * submit handler come from useLabWalkIn.
 */

import type { FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

export interface WalkInResultsModalProps {
  patient: any;
  resultsInput: string;
  onResultsInputChange: (value: string) => void;
  isSubmitting: boolean;
  canSubmitLabResults: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

export default function WalkInResultsModal({
  patient: selectedPaidWalkIn,
  resultsInput: walkInResultsInput,
  onResultsInputChange: setWalkInResultsInput,
  isSubmitting: isSubmittingWalkInResults,
  canSubmitLabResults,
  onClose,
  onSubmit: handleProcessPaidWalkIn,
}: WalkInResultsModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Process Lab Test: {selectedPaidWalkIn.patientName}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Phone: {selectedPaidWalkIn.phoneNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            ✕
          </button>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1 text-xs">
          <span className="font-bold text-slate-700">Requested Tests:</span>
          <p className="text-slate-600 font-mono">{selectedPaidWalkIn.testsSummary || 'Laboratory Panel'}</p>
        </div>

        <form onSubmit={handleProcessPaidWalkIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-800">
              Enter Laboratory Test Results <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              value={walkInResultsInput}
              onChange={(e) => setWalkInResultsInput(e.target.value)}
              placeholder="Enter findings and values (e.g. MP: Negative, Widal: 1:80, FBC: Normal)..."
              className="w-full p-3.5 text-xs font-mono bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2A758C]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingWalkInResults || !canSubmitLabResults}
              title={!canSubmitLabResults ? 'Laboratory staff only' : undefined}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#2A758C] hover:bg-[#1f5869] rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingWalkInResults ? (
                <>
                  <Loader2 className="animate-spin h-3.5 w-3.5" />
                  <span>Saving Results...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Complete & Finalize Test</span>
                </>
              )}
            </button>
          </div>
          {!canSubmitLabResults && (
            <p className="text-[11px] text-slate-500 font-medium text-right">Laboratory staff only — results are read-only for your role.</p>
          )}
        </form>
      </div>
    </div>
  );
}
