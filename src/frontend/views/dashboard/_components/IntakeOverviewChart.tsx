/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx.
 *
 * CARD 1: Monthly patient intake overview bar chart (verbatim JSX). Owns
 * hovered-bar tooltip state locally.
 */

import { useState } from "react";
import type { OverviewPoint } from "../_utils/dashboardDefaults";

export interface IntakeOverviewChartProps {
	overviewData: OverviewPoint[];
}

export default function IntakeOverviewChart({
	overviewData,
}: IntakeOverviewChartProps) {
	const [hoveredBar, setHoveredBar] = useState<number | null>(null);

	return (
		<div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100/80 p-6 flex flex-col justify-between shadow-2xs">
			<div className="flex justify-between items-center mb-5">
				<div>
					<h3 className="font-extrabold text-slate-900 text-base tracking-tight">
						Patient Intake Overview
					</h3>
					<p className="text-xs text-slate-400 font-medium">
						Monthly patient intake & admissions comparison
					</p>
				</div>
				{/* Custom Legend */}
				<div className="flex items-center gap-4 text-xs font-bold">
					<div className="flex items-center gap-1.5">
						<span className="w-3 h-3 bg-[#2A758C] rounded-full"></span>
						<span className="text-slate-600">New Intakes</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="w-3 h-3 bg-[#38bdf8] rounded-full"></span>
						<span className="text-slate-600">Follow-ups</span>
					</div>
				</div>
			</div>

			{/* Precision SVG Bar Chart */}
			<div className="relative h-64 w-full flex items-end justify-between px-2 pt-4">
				{/* Y-Axis guide lines */}
				<div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
					{[100, 75, 50, 25, 0].map((val) => (
						<div
							key={val}
							className="w-full flex items-center gap-2"
						>
							<span className="text-[10px] font-mono text-slate-400 w-6 text-right">
								{val}
							</span>
							<div className="flex-grow border-t border-slate-100"></div>
						</div>
					))}
				</div>

				{/* Bars container */}
				<div className="relative z-10 flex-1 h-full flex items-end justify-around pl-8 pb-6">
					{overviewData.map((d, i) => (
						<div
							key={d.month}
							className="flex flex-col items-center justify-end h-full w-12 group cursor-pointer relative"
							onMouseEnter={() => setHoveredBar(i)}
							onMouseLeave={() => setHoveredBar(null)}
						>
							{/* Tooltip on hover */}
							{hoveredBar === i && (
								<div className="absolute -top-12 bg-slate-900 text-white text-[11px] font-mono p-2 rounded-lg shadow-xl z-30 pointer-events-none flex flex-col gap-0.5 min-w-[100px]">
									<div className="font-bold border-b border-slate-800 pb-0.5 mb-0.5 text-center">
										{d.month} Statistics
									</div>
									<div className="flex justify-between gap-3">
										<span className="text-slate-400">New:</span>
										<span className="text-[#A3D1E0] font-bold">
											{d.newV}
										</span>
									</div>
									<div className="flex justify-between gap-3">
										<span className="text-slate-400">
											Unique:
										</span>
										<span className="text-white font-bold">
											{d.unique}
										</span>
									</div>
								</div>
							)}

							{/* Combined bars bar-chart layout */}
							<div className="flex items-end gap-1 h-full w-full justify-center">
								{/* New Visitors Bar */}
								<div
									className="w-3.5 rounded-t-sm transition-all duration-300 group-hover:opacity-90"
									style={{
										height: `${(d.newV / 100) * 100}%`,
										backgroundColor: "#A3D1E0",
									}}
								></div>
								{/* Unique Visitors Bar */}
								<div
									className="w-3.5 rounded-t-sm transition-all duration-300 group-hover:opacity-90"
									style={{
										height: `${(d.unique / 100) * 100}%`,
										backgroundColor: "#3A3F47",
									}}
								></div>
							</div>

							{/* X-axis Label */}
							<span className="absolute -bottom-6 text-[11px] font-semibold text-slate-500 tracking-tight">
								{d.month}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
