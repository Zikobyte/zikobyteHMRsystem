/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx (ADD CANDIDATE MODAL,
 * verbatim JSX).
 *
 * Applicant recorder: candidate form bound to the recruitment hook
 * result. Mounted by the shell.
 */

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { UseHrRecruitmentResult } from '../_hooks/useHrRecruitment';

export interface CandidateModalProps {
  data: UseHrRecruitmentResult;
}

export default function CandidateModal({ data }: CandidateModalProps) {
  const {
    showAddCandidateModal,
    setShowAddCandidateModal,
    candidateForm,
    setCandidateForm,
    handleSaveCandidate
  } = data;

  return (
    <AnimatePresence>
      {showAddCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Add Applicant / Candidate</h3>
              <button onClick={() => setShowAddCandidateModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCandidate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  value={candidateForm.candidate_name}
                  onChange={(e) => setCandidateForm({ ...candidateForm, candidate_name: e.target.value })}
                  placeholder="e.g. Dr. Kelechi Nwosu"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role / Position Applied</label>
                  <input
                    type="text"
                    value={candidateForm.role_applied}
                    onChange={(e) => setCandidateForm({ ...candidateForm, role_applied: e.target.value })}
                    placeholder="Doctor, ICU Nurse, Pharmacist"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={candidateForm.experience_years}
                    onChange={(e) => setCandidateForm({ ...candidateForm, experience_years: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={candidateForm.phone}
                    onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                    placeholder="+234 803 000 0000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={candidateForm.email}
                    onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                    placeholder="candidate@email.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCandidateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700"
                >
                  Save Candidate Record
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
