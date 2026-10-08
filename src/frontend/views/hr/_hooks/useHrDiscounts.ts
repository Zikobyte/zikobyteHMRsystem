/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 6 extraction from hr/HRDashboardView.tsx.
 *
 * Discounts hook: owns the welfare discount policies (GET /hr/discounts),
 * the policy form + add-modal flag, and the activation flow (POST
 * /hr/discounts). Policy grid JSX lives in _tabs/DiscountsTab, the
 * definer in _modals/DiscountModal. apiFetch path and payload preserved
 * verbatim.
 */

import type * as React from 'react';
import { useState } from 'react';
import { apiFetch } from '../../../utils/api';
import type { DiscountPolicy } from '../../../types';
import type { HrNotify } from '../_utils/hr-types';

export interface UseHrDiscountsOptions {
  notify: HrNotify;
}

export interface UseHrDiscountsResult {
  discounts: DiscountPolicy[];
  fetchDiscounts: () => Promise<void>;
  discountForm: {
    title: string;
    discount_code: string;
    category: string;
    percentage: number;
    fixed_amount: number;
    applicable_service: string;
    authorized_by: string;
    status: string;
    description: string;
  };
  setDiscountForm: (form: UseHrDiscountsResult['discountForm']) => void;
  showAddDiscountModal: boolean;
  setShowAddDiscountModal: (value: boolean) => void;
  handleSaveDiscount: (e: React.FormEvent) => Promise<void>;
}

export function useHrDiscounts({ notify }: UseHrDiscountsOptions): UseHrDiscountsResult {
  const { showNotification, setError } = notify;

  const [discounts, setDiscounts] = useState<DiscountPolicy[]>([]);

  const [discountForm, setDiscountForm] = useState({
    title: '',
    discount_code: '',
    category: 'Staff Benefit',
    percentage: 50,
    fixed_amount: 0,
    applicable_service: 'All Consultations & In-House Pharmacy',
    authorized_by: 'HR & Management',
    status: 'Active',
    description: ''
  });

  // Modals
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);

  const fetchDiscounts = async () => {
    try {
      const res = await apiFetch('/hr/discounts');
      if (res.success && Array.isArray(res.data)) {
        setDiscounts(res.data);
      }
    } catch (err) {
      console.error('Failed to load discounts:', err);
    }
  };

  // Handlers for Discounts
  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/hr/discounts', {
        method: 'POST',
        body: JSON.stringify(discountForm)
      });
      if (res.success) {
        showNotification(`Discount policy "${discountForm.title}" activated`);
        setShowAddDiscountModal(false);
        setDiscountForm({
          title: '',
          discount_code: '',
          category: 'Staff Benefit',
          percentage: 50,
          fixed_amount: 0,
          applicable_service: 'All Consultations & In-House Pharmacy',
          authorized_by: 'HR & Management',
          status: 'Active',
          description: ''
        });
        await fetchDiscounts();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save discount policy');
    }
  };

  return {
    discounts,
    fetchDiscounts,
    discountForm,
    setDiscountForm,
    showAddDiscountModal,
    setShowAddDiscountModal,
    handleSaveDiscount
  };
}
