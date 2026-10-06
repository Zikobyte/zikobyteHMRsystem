/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3D extraction from OPDRegistrationView.tsx (registration vitals grids).
 * Verbatim JSX per variant, composed inside all three intake forms:
 * - `standard`: Temp-first adult order (T – P – R – BP – W) with the
 *   "Pulse Rate" / "Respiration (/min)" labels, exactly as the standard form.
 * - `intake`: BP-first clinical order with the "Heart Rate" / "Resp Rate"
 *   labels, shared verbatim by the maternity and emergency forms (their grids
 *   were identical in the original).
 */

import type { RegistrationVitalsState } from "./registrationProps";

export interface RegistrationVitalsFieldsProps
	extends RegistrationVitalsState {
	variant: "standard" | "intake";
}

export default function RegistrationVitalsFields({
	variant,
	regBP,
	setRegBP,
	regHR,
	setRegHR,
	regTemp,
	setRegTemp,
	regRR,
	setRegRR,
	regSpo2,
	setRegSpo2,
	regWeight,
	setRegWeight,
	regHeight,
	setRegHeight,
}: RegistrationVitalsFieldsProps) {
	if (variant === "intake") {
		return (
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div>
					<label className="block text-[10px] font-bold text-slate-500 mb-1">
						Blood Pressure (BP)
					</label>
					<input
						type="text"
						placeholder="120/80"
						value={regBP}
						onChange={(e) => setRegBP(e.target.value)}
						className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
					/>
				</div>
				<div>
					<label className="block text-[10px] font-bold text-slate-500 mb-1">
						Temperature (°C)
					</label>
					<input
						type="text"
						placeholder="36.5"
						value={regTemp}
						onChange={(e) => setRegTemp(e.target.value)}
						className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
					/>
				</div>
				<div>
					<label className="block text-[10px] font-bold text-slate-500 mb-1">
						Heart Rate (bpm)
					</label>
					<input
						type="text"
						placeholder="72"
						value={regHR}
						onChange={(e) => setRegHR(e.target.value)}
						className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
					/>
				</div>
				<div>
					<label className="block text-[10px] font-bold text-slate-500 mb-1">
						Resp Rate (bpm)
					</label>
					<input
						type="text"
						placeholder="16"
						value={regRR}
						onChange={(e) => setRegRR(e.target.value)}
						className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
					/>
				</div>
				<div>
					<label className="block text-[10px] font-bold text-slate-500 mb-1">
						SpO2 (%)
					</label>
					<input
						type="text"
						placeholder="98"
						value={regSpo2}
						onChange={(e) => setRegSpo2(e.target.value)}
						className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
					/>
				</div>
				<div>
					<label className="block text-[10px] font-bold text-slate-500 mb-1">
						Weight (kg)
					</label>
					<input
						type="text"
						placeholder="70"
						value={regWeight}
						onChange={(e) => setRegWeight(e.target.value)}
						className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
					/>
				</div>
				<div>
					<label className="block text-[10px] font-bold text-slate-500 mb-1">
						Height (cm)
					</label>
					<input
						type="text"
						placeholder="170"
						value={regHeight}
						onChange={(e) => setRegHeight(e.target.value)}
						className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			<div>
				<label className="block text-[10px] font-bold text-slate-500 mb-1">
					Temperature (°C)
				</label>
				<input
					type="text"
					placeholder="36.5"
					value={regTemp}
					onChange={(e) => setRegTemp(e.target.value)}
					className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
				/>
			</div>
			<div>
				<label className="block text-[10px] font-bold text-slate-500 mb-1">
					Pulse Rate (bpm)
				</label>
				<input
					type="text"
					placeholder="72"
					value={regHR}
					onChange={(e) => setRegHR(e.target.value)}
					className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
				/>
			</div>
			<div>
				<label className="block text-[10px] font-bold text-slate-500 mb-1">
					Respiration (/min)
				</label>
				<input
					type="text"
					placeholder="16"
					value={regRR}
					onChange={(e) => setRegRR(e.target.value)}
					className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
				/>
			</div>
			<div>
				<label className="block text-[10px] font-bold text-slate-500 mb-1">
					Blood Pressure (mmHg)
				</label>
				<input
					type="text"
					placeholder="120/80"
					value={regBP}
					onChange={(e) => setRegBP(e.target.value)}
					className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
				/>
			</div>
			<div>
				<label className="block text-[10px] font-bold text-slate-500 mb-1">
					Weight (kg)
				</label>
				<input
					type="text"
					placeholder="70"
					value={regWeight}
					onChange={(e) => setRegWeight(e.target.value)}
					className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
				/>
			</div>
			<div>
				<label className="block text-[10px] font-bold text-slate-500 mb-1">
					Height (cm)
				</label>
				<input
					type="text"
					placeholder="170"
					value={regHeight}
					onChange={(e) => setRegHeight(e.target.value)}
					className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
				/>
			</div>
			<div>
				<label className="block text-[10px] font-bold text-slate-500 mb-1">
					SpO2 (%)
				</label>
				<input
					type="text"
					placeholder="98"
					value={regSpo2}
					onChange={(e) => setRegSpo2(e.target.value)}
					className="w-full bg-white border border-slate-100 rounded-lg p-2 text-xs font-mono"
				/>
			</div>
		</div>
	);
}
