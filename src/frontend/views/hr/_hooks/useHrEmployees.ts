/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx.
 *
 * Employees hook: owns the employee directory state (GET /hr/employees),
 * the add/edit form + editing state, the add-modal flag, the directory
 * search term, and the CRUD handlers (POST /hr/employees, PATCH
 * /hr/employees/:id, DELETE /hr/employees/:id). Category filtering JSX
 * lives in _tabs/EmployeesTab + _components/EmployeeCategoryTable.
 * apiFetch paths, payloads, and messaging preserved verbatim.
 */

import type * as React from 'react';
import { useState } from 'react';
import { apiFetch } from '../../../utils/api';
import type { Employee } from '../../../types';
import type { HrNotify } from '../_utils/hr-types';

export interface UseHrEmployeesOptions {
  notify: HrNotify;
  refreshStats?: () => Promise<void>;
}

export interface UseHrEmployeesResult {
  employees: Employee[];
  fetchEmployees: () => Promise<void>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showAddEmployeeModal: boolean;
  setShowAddEmployeeModal: (value: boolean) => void;
  editingEmployee: Employee | null;
  setEditingEmployee: (emp: Employee | null) => void;
  employeeForm: {
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    shift: string;
    status: string;
    salary: number;
    hire_date: string;
    date_joined: string;
    documents_count: number;
  };
  setEmployeeForm: (form: UseHrEmployeesResult['employeeForm']) => void;
  handleSaveEmployee: (e: React.FormEvent) => Promise<void>;
  handleDeleteEmployee: (id: string, name: string) => Promise<void>;
}

export function useHrEmployees({ notify, refreshStats }: UseHrEmployeesOptions): UseHrEmployeesResult {
  const { showNotification, setError } = notify;

  const [employees, setEmployees] = useState<Employee[]>([]);

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    role: 'Nurse',
    department: 'Nursing',
    email: '',
    phone: '',
    shift: 'Day',
    status: 'Active',
    salary: 350000,
    hire_date: new Date().toISOString().split('T')[0],
    date_joined: new Date().toISOString().split('T')[0],
    documents_count: 0
  });

  const fetchEmployees = async () => {
    try {
      const res = await apiFetch('/hr/employees');
      if (res.success && Array.isArray(res.data)) {
        setEmployees(res.data);
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  // Handlers for Employee
  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const res = await apiFetch(`/hr/employees/${editingEmployee.id}`, {
          method: 'PATCH',
          body: JSON.stringify(employeeForm)
        });
        if (res.success) {
          showNotification(`Updated employee ${employeeForm.name}`);
          setEditingEmployee(null);
          setShowAddEmployeeModal(false);
          await fetchEmployees();
          await refreshStats?.();
        }
      } else {
        const res = await apiFetch('/hr/employees', {
          method: 'POST',
          body: JSON.stringify(employeeForm)
        });
        if (res.success) {
          showNotification(`Successfully added ${employeeForm.name} to the ${employeeForm.role} table`);
          setShowAddEmployeeModal(false);
          setEmployeeForm({
            name: '',
            role: 'Nurse',
            department: 'Nursing',
            email: '',
            phone: '',
            shift: 'Day',
            status: 'Active',
            salary: 350000,
            hire_date: new Date().toISOString().split('T')[0],
            date_joined: new Date().toISOString().split('T')[0],
            documents_count: 0
          });
          await fetchEmployees();
          await refreshStats?.();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save employee');
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the database?`)) return;
    try {
      const res = await apiFetch(`/hr/employees/${id}`, { method: 'DELETE' });
      if (res.success) {
        showNotification(`Removed employee ${name}`);
        await fetchEmployees();
        await refreshStats?.();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete employee');
    }
  };

  return {
    employees,
    fetchEmployees,
    searchTerm,
    setSearchTerm,
    showAddEmployeeModal,
    setShowAddEmployeeModal,
    editingEmployee,
    setEditingEmployee,
    employeeForm,
    setEmployeeForm,
    handleSaveEmployee,
    handleDeleteEmployee
  };
}
