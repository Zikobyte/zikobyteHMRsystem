/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 8 extraction from LaboratoryView.tsx.
 *
 * Light shared types for the lab slice: page-tab routing, the global
 * action-confirmation modal state, cross-hook notify/modal contracts,
 * and walk-in test selection shapes. No behavior change.
 */

export type LabPageTab = 'regular' | 'walkin';

export interface LaboratoryViewProps {
  activeTab?: string;
}

export interface LabActionModalState {
  isOpen: boolean;
  title: string;
  message: string;
  patientName?: string;
  hospitalNumber?: string;
  badgeText?: string;
  details?: { label: string; value: string }[];
}

/** Shared success/error messaging contract passed from the shell into hooks. */
export interface LabNotify {
  setError: (msg: string) => void;
  setSuccess: (msg: string) => void;
}

/** Shared action-modal contract passed from the shell into hooks. */
export interface LabModalApi {
  setActionModal: (modal: LabActionModalState | null) => void;
}

export interface WalkInCatalogTest {
  id: string;
  name: string;
  price: number;
}

export interface WalkInSelectedTest {
  id: string;
  name: string;
  price: number;
  category: string;
}
