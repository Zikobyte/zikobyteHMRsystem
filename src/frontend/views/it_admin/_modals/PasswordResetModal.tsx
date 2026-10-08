/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (MODAL B:
 * PASSWORD RESET, verbatim JSX).
 *
 * Password reset dialog bound to the IT users hook result (selected
 * user, new-password fields, visibility flag, reset handler). Mounted
 * by the shell.
 */

import { Eye, EyeOff, Key, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { UseItUsersResult } from '../_hooks/useItUsers';

export interface PasswordResetModalProps {
  data: UseItUsersResult;
}

export default function PasswordResetModal({ data }: PasswordResetModalProps) {
  const {
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    selectedUser,
    handleResetPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    showNewPassword,
    setShowNewPassword
  } = data;

  return (
    <AnimatePresence>
      {isPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-slate-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-800"
          >
            <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-black text-base">Reset Password</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Update password for @{selectedUser.username}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pr-9 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:ring-2 focus:ring-[#2A758C]/15 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:ring-2 focus:ring-[#2A758C]/15 transition-all font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
