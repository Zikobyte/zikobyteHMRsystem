/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 4B extraction from cashier/CashierView.tsx (maternity-supplies).
 * Thin wrapper around existing MaternitySuppliesCashierView.
 */

import { Suspense, lazy } from "react";
import type { MaternityHandoverRecord } from "../MaternitySuppliesCashierView";

const MaternitySuppliesCashierView = lazy(
  () => import("../MaternitySuppliesCashierView"),
);

export interface MaternitySuppliesTabProps {
  records: MaternityHandoverRecord[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onBalanceSuccess: () => void;
}

export default function MaternitySuppliesTab({
  records,
  isLoading,
  onRefresh,
  onBalanceSuccess,
}: MaternitySuppliesTabProps) {
  return (
				<Suspense
					fallback={
						<div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center text-sm font-medium text-slate-500">
							Loading maternity supplies…
						</div>
					}
				>
					<MaternitySuppliesCashierView
						records={records}
						isLoading={isLoading}
						onRefresh={onRefresh}
						onBalanceSuccess={() => {
							onBalanceSuccess();
						}}
					/>
				</Suspense>
  );
}
