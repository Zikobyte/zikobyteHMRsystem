/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (MODAL C:
 * DELETE USER, verbatim JSX).
 *
 * Permanent-removal confirmation bound to the IT users hook result
 * (selected user, visibility flag, delete handler). Mounted by the
 * shell.
 */

import { Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { UseItUsersResult } from '../_hooks/useItUsers';

export interface DeleteUserModalProps {
  data: UseItUsersResult;
}

export default function DeleteUserModal({ data }: DeleteUserModalProps) {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,
    handleConfirmDelete
  } = data;

  return (
    <AnimatePresence>
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white border border-slate-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col text-slate-800"
          >
            <div className="bg-rose-50 px-6 py-4.5 border-b border-rose-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-xl text-rose-600 border border-rose-200">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-rose-900 font-black text-base">Delete User Account</h3>
                  <p className="text-[11px] text-rose-600 font-medium">Permanent removal</p>
                </div>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete user <strong className="text-slate-900 font-bold">@{selectedUser.username}</strong> ({selectedUser.name})? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
