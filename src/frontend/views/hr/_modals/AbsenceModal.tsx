/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx (RECORD NEW ABSENCE
 * MODAL, verbatim JSX).
 *
 * Absence recorder: employee select (options from the directory list),
 * date, status, and reason, bound to the absences hook result. The
 * `employees` directory list arrives as a separate prop so this modal
 * stays decoupled from the employees hook. Mounted by the shell.
 */

import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Employee } from '../../../types';
import type { UseHrAbsencesResult } from '../_hooks/useHrAbsences';

export interface AbsenceModalProps {
  data: UseHrAbsencesResult;
  employees: Employee[];
}

export default function AbsenceModal({ data, employees }: AbsenceModalProps) {
  const {
    showAddAbsenceModal,
    setShowAddAbsenceModal,
    absenceForm,
    setAbsenceForm,
    handleSaveAbsence
  } = data;

  return (
    <AnimatePresence>
      {showAddAbsenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Record New Absence</h3>
                <p className="text-xs text-slate-500 mt-0.5">Record a staff member absence or leave event in the system</p>
              </div>
              <button onClick={() => setShowAddAbsenceModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAbsence} className="space-y-4 mt-4">
              {/* Employee Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Employee *</label>
                <select
                  required
                  value={absenceForm.employee_name}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const emp = employees.find(x => x.name === selectedName);
                    setAbsenceForm({
                      ...absenceForm,
                      employee_name: selectedName,
                      employee_id: emp ? emp.id : '',
                      department: emp ? emp.department : absenceForm.department
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium"
                >
                  <option value="">Select employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} ({emp.role} {emp.department ? `· ${emp.department}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={absenceForm.date}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status *</label>
                <select
                  required
                  value={absenceForm.status}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium"
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Unauthorized">Unauthorized</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Study Leave">Study Leave</option>
                </select>
              </div>

              {/* Reason Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={absenceForm.reason}
                  onChange={(e) => setAbsenceForm({ ...absenceForm, reason: e.target.value })}
                  placeholder="Reason for absence"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAbsenceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors cursor-pointer shadow-xs"
                >
                  Record Absence
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
