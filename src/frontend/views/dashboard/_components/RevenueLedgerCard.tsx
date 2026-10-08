/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx.
 *
 * CARD 3: Revenue ledger dark card with spark bars + net/gross/levies
 * breakdown (verbatim JSX). Audit button opens the verification modal.
 */

import { ShieldCheck } from "lucide-react";
import ExportButton from "@/components/shared/ExportButton";

export interface RevenueLedgerCardProps {
	totalRevenue: number;
	isLoading: boolean;
	onOpenRevenueModal: () => void;
}

export default function RevenueLedgerCard({
	totalRevenue,
	isLoading,
	onOpenRevenueModal,
}: RevenueLedgerCardProps) {
	return (
		<div className="bg-[#181D27] rounded-3xl p-6 text-white flex flex-col justify-between shadow-md relative overflow-hidden min-h-[420px] border border-[#222836]">
			<div>
				<div className="flex justify-between items-center mb-4">
					<h4 className="font-extrabold text-xs tracking-wider uppercase text-slate-300">
						Revenue Ledger
					</h4>
					<div className="flex items-center gap-2">
						<button
							onClick={onOpenRevenueModal}
							className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-extrabold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
						>
							<ShieldCheck className="h-3 w-3" /> Audit & Verify
						</button>
						<ExportButton
							exportType="financials"
							label="Export"
							className="bg-slate-100 hover:bg-slate-200 text-black border border-slate-300 font-extrabold"
						/>
					</div>
				</div>

				{/* Spark bars block */}
				<div className="h-28 flex items-end justify-between gap-1.5 px-2 py-3 bg-slate-900/80 rounded-2xl mb-6 border border-[#222836]">
					{[60, 80, 45, 90, 70, 85, 50, 95, 65, 80, 55, 90].map(
						(v, i) => (
							<div
								key={i}
								className="bg-[#38bdf8] rounded-full w-full transition-all duration-300 hover:bg-white"
								style={{ height: `${v}%` }}
							></div>
						),
					)}
				</div>
			</div>

			{/* Mini Stats 4-column breakdown grid at bottom */}
			<div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-4 border-t border-slate-800 text-xs">
				<div>
					<p className="text-slate-400 font-semibold mb-0.5 text-[11px]">
						Profit Net
					</p>
					<h5 className="text-base font-black tracking-tight font-mono text-emerald-400">
						₦
						{isLoading
							? "..."
							: (totalRevenue * 0.45 || 150000).toLocaleString()}
					</h5>
				</div>
				<div>
					<p className="text-slate-400 font-semibold mb-0.5 text-[11px]">
						Gross Revenue
					</p>
					<h5 className="text-base font-black tracking-tight font-mono text-white">
						₦
						{isLoading
							? "..."
							: (totalRevenue || 15250000).toLocaleString()}
					</h5>
				</div>
				<div className="pt-2 border-t border-slate-800/60">
					<p className="text-slate-400 font-semibold mb-0.5 text-[11px]">
						Levies & Taxes
					</p>
					<h5 className="text-base font-black tracking-tight font-mono text-slate-300">
						₦
						{isLoading
							? "..."
							: (totalRevenue * 0.05 || 50000).toLocaleString()}
					</h5>
				</div>
				<div className="pt-2 border-t border-slate-800/60">
					<p className="text-slate-400 font-semibold mb-0.5 text-[11px]">
						Net Operating
					</p>
					<h5 className="text-base font-black tracking-tight font-mono text-sky-400">
						₦
						{isLoading
							? "..."
							: (totalRevenue * 0.95 || 4485000).toLocaleString()}
					</h5>
				</div>
			</div>
		</div>
	);
}
