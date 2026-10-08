/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx.
 *
 * CARD 5: Sessions device doughnut (card-type breakdown, verbatim JSX +
 * SVG). Owns doughnut hover state locally.
 */

import { useState } from "react";

export interface SessionsDeviceCardProps {
	standardCount: number;
	maternityCount: number;
	emergencyCount: number;
	totalPatients: number;
	onNavigateToStandardCards?: () => void;
	onNavigateToSpecializedCare?: () => void;
}

export default function SessionsDeviceCard({
	standardCount,
	maternityCount,
	emergencyCount,
	totalPatients,
	onNavigateToStandardCards,
	onNavigateToSpecializedCare,
}: SessionsDeviceCardProps) {
	const [deviceHover, setDeviceHover] = useState<string | null>(null);

	return (
		<div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between shadow-xs min-h-[420px]">
			<div>
				<h3 className="font-bold text-slate-900 text-sm mb-1">
					Sessions Device
				</h3>
				<p className="text-[10px] text-slate-400">
					Outpatient card types breakdown
				</p>
			</div>

			{/* Pie Doughnut SVG matching the exact circular shape in video */}
			<div className="flex items-center justify-center py-4 relative">
				<svg
					width="160"
					height="160"
					className="transform -rotate-90"
				>
					{/* Outer stroke doughnut layers */}
					{/* Standard Cards circle */}
					<circle
						cx="80"
						cy="80"
						r="60"
						fill="transparent"
						stroke="#A3D1E0"
						strokeWidth="20"
						strokeDasharray="376.8"
						strokeDashoffset={
							376.8 -
							(376.8 * (standardCount || 1)) / (totalPatients || 1)
						}
						className="transition-all duration-500 cursor-pointer"
						onMouseEnter={() => setDeviceHover("Standard")}
						onMouseLeave={() => setDeviceHover(null)}
					/>
					{/* Maternity Cards circle */}
					<circle
						cx="80"
						cy="80"
						r="60"
						fill="transparent"
						stroke="#E94B61"
						strokeWidth="20"
						strokeDasharray="376.8"
						strokeDashoffset={
							376.8 -
							(376.8 * (maternityCount || 1)) /
								(totalPatients || 1)
						}
						className="transition-all duration-500 cursor-pointer"
						style={{
							transform: `rotate(${(standardCount / (totalPatients || 1)) * 360}deg)`,
							transformOrigin: "80px 80px",
						}}
						onMouseEnter={() => setDeviceHover("Maternity")}
						onMouseLeave={() => setDeviceHover(null)}
					/>
					{/* Emergency Cards circle */}
					<circle
						cx="80"
						cy="80"
						r="60"
						fill="transparent"
						stroke="#3A3F47"
						strokeWidth="20"
						strokeDasharray="376.8"
						strokeDashoffset={
							376.8 -
							(376.8 * (emergencyCount || 1)) /
								(totalPatients || 1)
						}
						className="transition-all duration-500 cursor-pointer"
						style={{
							transform: `rotate(${((standardCount + maternityCount) / (totalPatients || 1)) * 360}deg)`,
							transformOrigin: "80px 80px",
						}}
						onMouseEnter={() => setDeviceHover("Emergency")}
						onMouseLeave={() => setDeviceHover(null)}
					/>
				</svg>

				{/* Centered Stats text inside doughnut */}
				<div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
					<span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
						{deviceHover || "Total"}
					</span>
					<span className="text-2xl font-black text-slate-900 font-mono">
						{deviceHover === "Standard"
							? standardCount
							: deviceHover === "Maternity"
								? maternityCount
								: deviceHover === "Emergency"
									? emergencyCount
									: totalPatients}
					</span>
				</div>
			</div>

			{/* Breakdown table with exact counts and mini colors */}
			<div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
				<div
					onClick={onNavigateToStandardCards}
					className="flex justify-between items-center p-1.5 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer group"
				>
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 bg-[#A3D1E0] rounded-sm group-hover:scale-110 transition-transform"></span>
						<span className="text-slate-600 font-semibold group-hover:text-sky-800">
							Standard Outpatients
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="font-mono font-bold text-slate-900">
							{standardCount}
						</span>
						<span className="text-[10px] text-sky-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
							View →
						</span>
					</div>
				</div>
				<div
					onClick={onNavigateToSpecializedCare}
					className="flex justify-between items-center p-1.5 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer group"
				>
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 bg-[#E94B61] rounded-sm group-hover:scale-110 transition-transform"></span>
						<span className="text-slate-600 font-semibold group-hover:text-pink-800">
							Maternity / Antenatal
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="font-mono font-bold text-slate-900">
							{maternityCount}
						</span>
						<span className="text-[10px] text-pink-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
							View →
						</span>
					</div>
				</div>
				<div
					onClick={onNavigateToSpecializedCare}
					className="flex justify-between items-center p-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer group"
				>
					<div className="flex items-center gap-2">
						<span className="w-2.5 h-2.5 bg-[#3A3F47] rounded-sm group-hover:scale-110 transition-transform"></span>
						<span className="text-slate-600 font-semibold group-hover:text-rose-800">
							Emergency Triage
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="font-mono font-bold text-slate-900">
							{emergencyCount}
						</span>
						<span className="text-[10px] text-rose-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
							View →
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
