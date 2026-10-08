/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx.
 *
 * CARD 2: Clinic intensity sparkline (verbatim JSX + sparkline SVG).
 */

export interface ClinicIntensityCardProps {
	clinicIntensity: number;
	totalPatients: number;
	isLoading: boolean;
	isStatsLoading: boolean;
}

export default function ClinicIntensityCard({
	clinicIntensity,
	totalPatients,
	isLoading,
	isStatsLoading,
}: ClinicIntensityCardProps) {
	return (
		<div className="bg-gradient-to-br from-[#2A758C] to-[#1e586a] rounded-3xl p-6 text-white flex flex-col justify-between shadow-md shadow-[#2A758C]/20 relative overflow-hidden min-h-[320px]">
			{/* Subtle design pattern background */}
			<div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none"></div>

			<div className="relative z-10">
				<span className="text-xs font-black tracking-wider text-teal-200 uppercase font-mono block">
					CLINIC INTENSITY
				</span>
				<h3 className="text-5xl font-black tracking-tight mt-2 text-white font-mono">
					{isLoading || isStatsLoading
						? "..."
						: clinicIntensity || 140 + totalPatients}
				</h3>
				<p className="text-xs font-medium text-teal-100 mt-2 max-w-[200px]">
					Total active clinical sessions and registrations recorded
					in network database.
				</p>
			</div>

			{/* Smooth vector wave line chart matching the video precisely */}
			<div className="w-full h-32 relative z-10 -mb-2">
				<svg
					viewBox="0 0 100 30"
					className="w-full h-full overflow-visible"
					preserveAspectRatio="none"
				>
					<path
						d="M 0 25 C 15 28, 25 10, 40 18 C 55 26, 65 5, 80 12 C 90 15, 95 20, 100 10"
						fill="none"
						stroke="#ffffff"
						strokeWidth="3.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M 0 25 C 15 28, 25 10, 40 18 C 55 26, 65 5, 80 12 C 90 15, 95 20, 100 10 L 100 30 L 0 30 Z"
						fill="url(#sparkline-grad)"
						opacity="0.25"
					/>
					<defs>
						<linearGradient
							id="sparkline-grad"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop offset="0%" stopColor="#ffffff" />
							<stop
								offset="100%"
								stopColor="#ffffff"
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>
				</svg>
			</div>
		</div>
	);
}
