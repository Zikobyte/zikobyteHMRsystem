/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx (SUBTAB: RECRUITMENT &
 * CANDIDATES, verbatim JSX).
 *
 * Recruitment desk: job openings board with open/closed filter + vacancy
 * toggle, and the applicants pipeline table with stage advancement.
 * State and handlers arrive via the recruitment hook result; the posters
 * live in _modals/JobModal + _modals/CandidateModal.
 */

import { Lock, Plus, Trash2, Unlock } from 'lucide-react';
import type { UseHrRecruitmentResult } from '../_hooks/useHrRecruitment';

export interface RecruitmentTabProps {
  data: UseHrRecruitmentResult;
}

export default function RecruitmentTab({ data }: RecruitmentTabProps) {
  const {
    jobOpenings,
    candidates,
    jobStatusFilter,
    setJobStatusFilter,
    setShowAddJobModal,
    setShowAddCandidateModal,
    handleToggleJobStatus,
    handleDeleteJob,
    handleUpdateCandidateStage
  } = data;

  return (
    <div className="space-y-6">
      {/* Job Openings Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Job Openings & Vacancies ({jobOpenings.length})</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage clinical, nursing, technical and administrative vacancies</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Status Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 text-xs font-bold">
              {(['All', 'Open', 'Closed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setJobStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    jobStatusFilter === filter
                      ? 'bg-white text-sky-700 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {filter} {filter === 'Open' ? `(${jobOpenings.filter(j => j.status === 'Open').length})` : filter === 'Closed' ? `(${jobOpenings.filter(j => j.status === 'Closed').length})` : `(${jobOpenings.length})`}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddJobModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Post New Opening
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {jobOpenings
            .filter((job) => {
              if (jobStatusFilter === 'Open') return job.status === 'Open';
              if (jobStatusFilter === 'Closed') return job.status === 'Closed';
              return true;
            })
            .map((job) => {
              const isOpen = job.status === 'Open';
              return (
                <div
                  key={job.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isOpen
                      ? 'border-slate-200/80 bg-white shadow-xs hover:shadow-md'
                      : 'border-slate-200 bg-slate-50/70 opacity-90'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60">
                        {job.department}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isOpen
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {isOpen ? 'Open Vacancy' : 'Closed'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {job.openings_count} Slot{job.openings_count > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-black text-slate-900 text-sm mt-3.5 leading-snug">{job.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {job.description || 'General hospital clinical position and departmental staff opening.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                      <span>Exp: <strong className="text-slate-800">{job.experience_required || 'Not specified'}</strong></span>
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">{job.employment_type}</span>
                    </div>
                  </div>

                  {/* Action buttons including Open/Close Vacancy */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleJobStatus(job)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        isOpen
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                      }`}
                    >
                      {isOpen ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          Close Vacancy
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          Open Vacancy
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      title="Delete vacancy"
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {jobOpenings.length === 0 && (
          <div className="text-center py-12 text-slate-400 font-medium">
            No job openings recorded. Click "Post New Opening" to add a vacancy.
          </div>
        )}
      </div>

      {/* Candidates Pipeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Recruitment Applicants & Pipeline ({candidates.length})</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track candidate screening, interview rounds, and job offers</p>
          </div>
          <button
            onClick={() => setShowAddCandidateModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Applicant Record
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">Candidate Name</th>
                <th className="py-3.5 px-6">Role Applied</th>
                <th className="py-3.5 px-6">Contact Info</th>
                <th className="py-3.5 px-6">Experience</th>
                <th className="py-3.5 px-6">Stage</th>
                <th className="py-3.5 px-6 text-right">Advance Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {candidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{cand.candidate_name}</div>
                    <div className="text-[11px] text-slate-500">Applied: {cand.applied_date}</div>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-800">
                    {cand.job_title || cand.role_applied}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <div>{cand.phone}</div>
                    <div className="text-[11px] text-slate-400">{cand.email}</div>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-700">
                    {cand.experience_years} years
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      cand.stage === 'Offered' || cand.stage === 'Hired'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : cand.stage === 'Interview'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : cand.stage === 'Screening'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {cand.stage}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <select
                      value={cand.stage}
                      onChange={(e) => handleUpdateCandidateStage(cand.id, e.target.value, cand.candidate_name)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-700 font-bold focus:outline-none"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Screening">Screening</option>
                      <option value="Interview">Interview</option>
                      <option value="Offered">Offered</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
