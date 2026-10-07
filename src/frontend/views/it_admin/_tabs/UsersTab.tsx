/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (SUBTAB: USERS,
 * verbatim JSX).
 *
 * Staff directory desk: newly-created credential banner, directory
 * search + refresh + add actions, and the users table (status toggle,
 * password reset, delete). State and handlers arrive via the IT users
 * hook result.
 */

import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Key,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { UseItUsersResult } from '../_hooks/useItUsers';

export interface UsersTabProps {
  data: UseItUsersResult;
}

export default function UsersTab({ data }: UsersTabProps) {
  const {
    search,
    setSearch,
    filteredUsers,
    isLoading,
    fetchUsers,
    handleOpenCreateModal,
    handleOpenPasswordModal,
    handleToggleStatus,
    handleOpenDeleteModal,
    newlyCreatedCredential,
    setNewlyCreatedCredential,
    showCredentialPassword,
    setShowCredentialPassword,
    copiedCredential,
    setCopiedCredential,
    formatDate
  } = data;

  return (
    <div className="space-y-4">
      {/* Newly Created User Credentials Card (Top of Table) */}
      <AnimatePresence>
        {newlyCreatedCredential && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-sky-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-emerald-200/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      Newly Created User Credential
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-white/90 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Placed at Top of Table
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {newlyCreatedCredential.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const copyPayload = `ZMC Staff Account Credential:\nName: ${newlyCreatedCredential.name}\nUsername: ${newlyCreatedCredential.username}\nPassword: ${newlyCreatedCredential.password}\nRole: ${newlyCreatedCredential.role}\nDepartment: ${newlyCreatedCredential.department || 'Hospital General'}`;
                    navigator.clipboard.writeText(copyPayload);
                    setCopiedCredential(true);
                    setTimeout(() => setCopiedCredential(false), 3000);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {copiedCredential ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied All!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Credentials</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setNewlyCreatedCredential(null)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white/80 rounded-xl transition-all border border-slate-200/60 cursor-pointer"
                  title="Dismiss Credential Card"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3.5">
              <div className="bg-white/95 border border-emerald-200/80 rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Username</div>
                <div className="text-xs font-black text-slate-900 font-mono mt-0.5 select-all">
                  @{newlyCreatedCredential.username}
                </div>
              </div>

              <div className="bg-white/95 border border-emerald-200/80 rounded-xl p-3 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Password</div>
                  <div className="text-xs font-black text-emerald-800 font-mono mt-0.5 select-all">
                    {showCredentialPassword ? newlyCreatedCredential.password : '••••••••••••'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCredentialPassword(!showCredentialPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  title={showCredentialPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showCredentialPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="bg-white/95 border border-emerald-200/80 rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Role & Desk</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {newlyCreatedCredential.role}
                </div>
              </div>

              <div className="bg-white/95 border border-emerald-200/80 rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Department</div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {newlyCreatedCredential.department || 'Hospital General'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff directory by name, username, department, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2A758C] focus:ring-2 focus:ring-[#2A758C]/15 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className={`h-4 w-4 text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 bg-[#2A758C] hover:bg-[#236073] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Staff Member</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Last Login</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => {
                const isNewlyCreated = newlyCreatedCredential && u.username?.toLowerCase() === newlyCreatedCredential.username.toLowerCase();
                return (
                <tr
                  key={u.id}
                  className={`transition-colors ${
                    isNewlyCreated
                      ? 'bg-emerald-50/70 hover:bg-emerald-50/90'
                      : 'hover:bg-slate-50/60'
                  }`}
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isNewlyCreated
                          ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                          : 'bg-[#2A758C]/15 border border-[#2A758C]/30 text-[#2A758C]'
                      }`}>
                        {u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{u.name}</span>
                          {isNewlyCreated && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-600">
                    {u.department || 'Hospital General'}
                  </td>
                  <td className="py-3.5 px-5">
                    {u.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500">
                    {formatDate(u.last_login)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        title="Reset Password"
                        onClick={() => handleOpenPasswordModal(u)}
                        className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200 cursor-pointer"
                      >
                        <Key className="h-4 w-4" />
                      </button>

                      <button
                        title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                        onClick={() => handleToggleStatus(u)}
                        className={`p-1.5 rounded-lg transition-colors border border-transparent cursor-pointer ${
                          u.status === 'Active'
                            ? 'text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200'
                            : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200'
                        }`}
                      >
                        {u.status === 'Active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>

                      <button
                        title="Delete User"
                        onClick={() => handleOpenDeleteModal(u)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
