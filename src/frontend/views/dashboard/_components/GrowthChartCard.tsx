/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx.
 *
 * CARD 4: Total registration growth multi-line chart (verbatim JSX + SVG).
 * Owns hovered growth-point tooltip state locally.
 */

import { useState } from "react";
import { Maximize2, Printer, RotateCw } from "lucide-react";
import type { GrowthPoint } from "../_utils/dashboardDefaults";

export interface GrowthChartCardProps {
	growthData: GrowthPoint[];
}

export default function GrowthChartCard({ growthData }: GrowthChartCardProps) {
	const [hoveredGrowthIndex, setHoveredGrowthIndex] = useState<number | null>(
		null,
	);

	return (
		<div className="bg-white rounded-3xl border border-slate-100/80 p-6 flex flex-col justify-between shadow-2xs min-h-[420px]">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
						Total Registration Growth
					</h3>
					<p className="text-[11px] text-slate-400 font-medium">
						Clinic intake trends across months
					</p>
				</div>
				{/* Tiny icons panel from video screen */}
				<div className="flex items-center gap-1.5 text-slate-400">
					<button
						className="hover:text-[#2A758C] hover:bg-slate-100 p-1.5 rounded-xl transition-colors cursor-pointer"
						title="Zoom In"
					>
						<Maximize2 className="h-3.5 w-3.5" />
					</button>
					<button
						className="hover:text-[#2A758C] hover:bg-slate-100 p-1.5 rounded-xl transition-colors cursor-pointer"
						title="Print Report"
					>
						<Printer className="h-3.5 w-3.5" />
					</button>
					<button
						className="hover:text-[#2A758C] hover:bg-slate-100 p-1.5 rounded-xl transition-colors cursor-pointer"
						title="Reset Axis"
					>
						<RotateCw className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>

			{/* Multi line graph representation via custom SVG */}
			<div className="relative h-48 w-full flex items-end">
				{/* Guide grid lines */}
				<div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
					{[40, 20, 0].map((val) => (
						<div
							key={val}
							className="w-full flex items-center gap-2"
						>
							<span className="text-[9px] font-mono text-slate-400 w-4 text-right">
								{val}
							</span>
							<div className="flex-grow border-t border-slate-100"></div>
						</div>
					))}
				</div>

				{/* SVG Lines */}
				<div className="relative z-10 w-full h-full pb-6 pl-6">
					<svg
						viewBox="0 0 100 40"
						className="w-full h-full overflow-visible"
						preserveAspectRatio="none"
					>
						{/* Line 1: Blue */}
						<path
							d="M 0 28 L 20 18 L 40 32 L 60 25 L 80 35 L 100 20"
							fill="none"
							stroke="#A3D1E0"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						{/* Line 2: Dark Blue */}
						<path
							d="M 0 34 L 20 28 L 40 22 L 60 29 L 80 18 L 100 26"
							fill="none"
							stroke="#3A3F47"
							strokeWidth="2"
							strokeDasharray="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>

						{/* Circles for interactive indicator */}
						{growthData.map((d, index) => {
							const x = (index / (growthData.length - 1)) * 100;
							// Map values (0-40) to visual heights (0-40, inverted coordinates)
							const y1 = 40 - d.value1;
							const y2 = 40 - d.value2;

							return (
								<g key={index} className="cursor-pointer group">
									<circle
										cx={x}
										cy={y1}
										r="2.5"
										fill="#A3D1E0"
										stroke="#ffffff"
										strokeWidth="1"
										className="transition-all group-hover:r-3.5"
										onMouseEnter={() =>
											setHoveredGrowthIndex(index)
										}
										onMouseLeave={() =>
											setHoveredGrowthIndex(null)
										}
									/>
									<circle
										cx={x}
										cy={y2}
										r="2"
										fill="#3A3F47"
										stroke="#ffffff"
										strokeWidth="1"
									/>
								</g>
							);
						})}
					</svg>

					{/* Tooltip on Line circles */}
					{hoveredGrowthIndex !== null && (
						<div className="absolute -top-12 left-[35%] bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg z-20 font-mono">
							<strong>
								{growthData[hoveredGrowthIndex].month}:
							</strong>
							<div>
								Intake Rate:{" "}
								{growthData[hoveredGrowthIndex].value1}%
							</div>
						</div>
					)}
				</div>
			</div>

			{/* X-Axis labels for line graph */}
			<div className="flex justify-between pl-6 text-[10px] font-bold text-slate-400">
				{growthData.map((d) => (
					<span key={d.month}>{d.month}</span>
				))}
			</div>
		</div>
	);
}
