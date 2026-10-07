/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (verbatim move).
 *
 * IT users hook: owns the staff directory state (GET /users), directory
 * search, the create/password/delete modal flags + selected user, the
 * add-user and password-reset form fields, the newly-created credential
 * banner state, and all CRUD handlers (POST /users, PATCH /users/:id
 * status + password, DELETE /users/:id). Tab switching, audit refresh,
 * and banners are shell-provided via options. apiFetch paths, payloads,
 * and messaging preserved verbatim.
 */

import type * as React from 'react';
import { useState } from 'react';
import type { User, UserRole } from '@/types';
import { apiFetch } from '@/utils/api';
import { formatDate } from '../_utils/it-admin-format';
import type { ItNotify, NewlyCreatedCredential } from '../_utils/it-admin-types';

export interface UseItUsersOptions {
  notify: ItNotify;
  currentUser?: User | null;
  refreshAudit: () => Promise<void>;
  showUsersTab: () => void;
}

export interface UseItUsersResult {
  users: User[];
  fetchUsers: () => Promise<void>;
  search: string;
  setSearch: (value: string) => void;
  filteredUsers: User[];
  isLoading: boolean;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
  isPasswordModalOpen: boolean;
  setIsPasswordModalOpen: (value: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (value: boolean) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  fullName: string;
  setFullName: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  role: UserRole;
  setRole: (value: UserRole) => void;
  department: string;
  setDepartment: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmNewPassword: string;
  setConfirmNewPassword: (value: string) => void;
  showNewPassword: boolean;
  setShowNewPassword: (value: boolean) => void;
  newlyCreatedCredential: NewlyCreatedCredential | null;
  setNewlyCreatedCredential: (cred: NewlyCreatedCredential | null) => void;
  showCredentialPassword: boolean;
  setShowCredentialPassword: (value: boolean) => void;
  copiedCredential: boolean;
  setCopiedCredential: (value: boolean) => void;
  handleOpenCreateModal: () => void;
  handleCreateUser: (e: React.FormEvent) => Promise<void>;
  handleOpenPasswordModal: (user: User) => void;
  handleResetPassword: (e: React.FormEvent) => Promise<void>;
  handleToggleStatus: (user: User) => Promise<void>;
  handleOpenDeleteModal: (user: User) => void;
  handleConfirmDelete: () => Promise<void>;
  formatDate: (dateStr?: string | null) => string;
}

export function useItUsers({
  notify,
  currentUser,
  refreshAudit,
  showUsersTab
}: UseItUsersOptions): UseItUsersResult {
  const { setError, setSuccess } = notify;

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Add User Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('OPD Clerk');
  const [department, setDepartment] = useState('OPD');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password Reset Form Fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Newly Created User Credential (Top of table card)
  const [newlyCreatedCredential, setNewlyCreatedCredential] = useState<NewlyCreatedCredential | null>(null);
  const [showCredentialPassword, setShowCredentialPassword] = useState(false);
  const [copiedCredential, setCopiedCredential] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/users');
      if (response.success && Array.isArray(response.data)) {
        let fetchedList: User[] = response.data;
        // Keep newly created user pinned at index 0 if present in active session
        if (newlyCreatedCredential) {
          const matchIdx = fetchedList.findIndex(
            u => u.username?.toLowerCase() === newlyCreatedCredential.username.toLowerCase()
          );
          if (matchIdx > 0) {
            const [pinned] = fetchedList.splice(matchIdx, 1);
            fetchedList = [pinned, ...fetchedList];
          }
        }
        setUsers(fetchedList);
      }
    } catch (err: any) {
      console.error('Failed to fetch user directory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // User Management Actions
  const handleOpenCreateModal = () => {
    setFullName('');
    setUsername('');
    setRole('OPD Clerk');
    setDepartment('OPD');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setError('');
    setSuccess('');
    setIsCreateModalOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !username.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify and try again.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    try {
      const currentUserName = currentUser?.username || 'admin';
      const cleanUsername = username.trim().toLowerCase();
      const cleanName = fullName.trim();
      const rawPassword = password;
      const body = {
        name: cleanName,
        username: cleanUsername,
        password: rawPassword,
        role,
        department,
        status: 'Active',
        created_by: currentUserName
      };

      const response = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (response.success) {
        const createdUser: User = response.data || {
          id: `user-${Date.now()}`,
          name: cleanName,
          username: cleanUsername,
          role,
          department,
          status: 'Active',
          created_at: new Date().toISOString(),
          created_by: currentUserName
        };

        // Pin newly created user immediately to top of user list
        setUsers(prev => [createdUser, ...prev.filter(u => u.username?.toLowerCase() !== cleanUsername && u.id !== createdUser.id)]);

        // Record credential for top of table banner
        setNewlyCreatedCredential({
          name: cleanName,
          username: cleanUsername,
          role,
          department,
          password: rawPassword,
          createdAt: new Date().toISOString()
        });
        setShowCredentialPassword(true);
        setCopiedCredential(false);

        // Switch to users tab and clear search so the new record is visible
        showUsersTab();
        setSearch('');

        setSuccess(`User @${cleanUsername} registered successfully and placed at the top of the table.`);
        setIsCreateModalOpen(false);
        await fetchUsers();
        await refreshAudit();
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    }
  };

  const handleOpenPasswordModal = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmNewPassword('');
    setShowNewPassword(false);
    setError('');
    setSuccess('');
    setIsPasswordModalOpen(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setError('');
    setSuccess('');

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    try {
      const response = await apiFetch(`/users/${selectedUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.success) {
        setSuccess(`Password for @${selectedUser.username} has been updated successfully.`);
        setIsPasswordModalOpen(false);
        await fetchUsers();
        await refreshAudit();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    }
  };

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch(`/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.success) {
        setSuccess(`User @${user.username} is now ${nextStatus}.`);
        await fetchUsers();
        await refreshAudit();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
    }
  };

  const handleOpenDeleteModal = (user: User) => {
    if (currentUser && currentUser.username === user.username) {
      setError('You cannot delete your own active administrator account.');
      setTimeout(() => setError(''), 4000);
      return;
    }
    setSelectedUser(user);
    setError('');
    setSuccess('');
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setError('');
    setSuccess('');

    try {
      const response = await apiFetch(`/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setSuccess(`User @${selectedUser.username} was permanently removed.`);
        setIsDeleteModalOpen(false);
        await fetchUsers();
        await refreshAudit();
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      setIsDeleteModalOpen(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.department || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  return {
    users,
    fetchUsers,
    search,
    setSearch,
    filteredUsers,
    isLoading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,
    setSelectedUser,
    fullName,
    setFullName,
    username,
    setUsername,
    role,
    setRole,
    department,
    setDepartment,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    showNewPassword,
    setShowNewPassword,
    newlyCreatedCredential,
    setNewlyCreatedCredential,
    showCredentialPassword,
    setShowCredentialPassword,
    copiedCredential,
    setCopiedCredential,
    handleOpenCreateModal,
    handleCreateUser,
    handleOpenPasswordModal,
    handleResetPassword,
    handleToggleStatus,
    handleOpenDeleteModal,
    handleConfirmDelete,
    formatDate
  };
}
