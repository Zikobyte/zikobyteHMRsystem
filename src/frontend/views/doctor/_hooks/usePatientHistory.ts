/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4A extraction from DoctorView.tsx.
 *
 * Patient-history hook: history modal data (GET /patients/:id/history
 * with lab-results and past-history derivation). Fetch semantics
 * preserved verbatim from the original component.
 */

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { apiFetch } from "../../../utils/api";
import type { HistoryTabId, PatientHistoryData } from "../_utils/doctor-types";

export interface UsePatientHistoryResult {
	historyModalOpen: boolean;
	setHistoryModalOpen: Dispatch<SetStateAction<boolean>>;
	historyLoading: boolean;
	patientHistoryData: PatientHistoryData | null;
	activeHistoryTab: HistoryTabId;
	setActiveHistoryTab: Dispatch<SetStateAction<HistoryTabId>>;
	handleOpenPatientHistory: (patientId: string) => Promise<void>;
}

export function usePatientHistory(): UsePatientHistoryResult {
  // Medical History Modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [patientHistoryData, setPatientHistoryData] = useState<PatientHistoryData | null>(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState<HistoryTabId>('consultations');

  const handleOpenPatientHistory = async (patientId: string) => {
    if (!patientId) return;
    setPatientHistoryData(null);
    setHistoryModalOpen(true);
    setHistoryLoading(true);
    try {
      const res = await apiFetch(`/patients/${patientId}/history`);
      if (res.success && res.data) {
        setPatientHistoryData(res.data);
      } else {
        setPatientHistoryData(null);
      }
    } catch (e) {
      console.error("Error fetching patient history:", e);
      setPatientHistoryData(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  return {
    historyModalOpen,
    setHistoryModalOpen,
    historyLoading,
    patientHistoryData,
    activeHistoryTab,
    setActiveHistoryTab,
    handleOpenPatientHistory,
  };
}
