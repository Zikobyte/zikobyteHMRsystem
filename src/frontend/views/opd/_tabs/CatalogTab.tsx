/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 3C extraction from OPDRegistrationView.tsx (SUBTAB 3: CATALOG).
 * Verbatim JSX: AccessPointsGuide static cards + Clinical Pricing Catalog
 * grid + refresh/edit. Single file (228 source lines, under ~400).
 * No behavior change — catalog data and handlers arrive as props.
 */

import {
	Activity,
	AlertTriangle,
	Calendar,
	RefreshCw,
	Shield,
} from "lucide-react";
import type { OpdPriceItem } from "../_hooks/useOpdCatalog";

export interface CatalogTabProps {
	prices: OpdPriceItem[];
	userRole?: string | null;
	onRefreshPrices: () => void;
	onOpenPriceEdit: (item: OpdPriceItem) => void;
}

export default function CatalogTab({
	prices,
	userRole,
	onRefreshPrices,
	onOpenPriceEdit,
}: CatalogTabProps) {
	return (
		<div className="space-y-6">
			{/* ZMC Access Points Guide */}
			<div className="bg-gradient-to-br from-slate-900 via-[#1E4D5B] to-[#14353F] rounded-3xl p-6 text-white border border-slate-800 shadow-lg space-y-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<span className="text-[10px] bg-[#A3D1E0]/20 text-[#A3D1E0] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
							Official Intake Protocol
						</span>
						<h2 className="text-xl font-bold text-white mt-1.5">
							ZMC Hospital Access Points
						</h2>
						<p className="text-xs text-slate-300 font-medium max-w-2xl font-sans">
							Authorized regulatory pathways, billing schedules,
							and access codes for clinical intake at Zenith
							Medical Center.
						</p>
					</div>
					<div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/5 self-start md:self-auto">
						<Shield className="h-4 w-4 text-[#A3D1E0]" />
						<span className="text-[11px] font-bold text-[#A3D1E0] font-mono">
							SECURE INTEGRATION
						</span>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Emergency */}
					<div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:bg-white/10 transition-all">
						<div className="flex items-center gap-3">
							<div className="p-2.5 bg-rose-500/20 text-rose-300 rounded-xl">
								<AlertTriangle className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-sm font-bold text-white">
									a. Emergency (Unbooked)
								</h3>
								<p className="text-[10px] text-slate-300">
									24/7 Priority Emergency Intake
								</p>
							</div>
						</div>
						<div className="text-[11px] text-slate-200 space-y-2 leading-relaxed font-medium">
							<p>
								Immediate, unbooked admissions for trauma,
								complications, or acute illness. After-hours
								doctors are on-call{" "}
								<strong>(6:00 PM – 8:00 AM)</strong>.
							</p>
							<div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 space-y-1.5 font-mono text-rose-200">
								<div className="flex justify-between">
									<span>Sick Emergency:</span>
									<span className="font-bold">₦25,000</span>
								</div>
								<div className="flex justify-between">
									<span>Unbooked Labour:</span>
									<span className="font-bold">₦50,000</span>
								</div>
								<div className="flex justify-between">
									<span>Accidents / Trauma:</span>
									<span className="font-bold">₦50,000</span>
								</div>
								<div className="border-t border-rose-500/20 pt-1 flex justify-between text-xs font-bold text-rose-300">
									<span>On-Call Doctor Surcharge:</span>
									<span>₦5,000</span>
								</div>
							</div>
						</div>
					</div>

					{/* Antenatal */}
					<div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:bg-white/10 transition-all">
						<div className="flex items-center gap-3">
							<div className="p-2.5 bg-[#A3D1E0]/20 text-[#A3D1E0] rounded-xl">
								<Calendar className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-sm font-bold text-white">
									b. Antenatal Visits
								</h3>
								<p className="text-[10px] text-slate-300">
									Weekly Scheduled Obstetric Care
								</p>
							</div>
						</div>
						<div className="text-[11px] text-slate-200 space-y-2 leading-relaxed font-medium font-sans">
							<p>
								Booked pregnant women are expected weekly on{" "}
								<strong>Tuesdays or Thursdays</strong>. Card
								expires automatically upon childbirth.
							</p>
							<div className="bg-[#2A758C]/20 border border-[#2A758C]/30 rounded-xl p-3 space-y-1.5 font-mono text-[#A3D1E0]">
								<div className="flex justify-between">
									<span>Card Bundle (One-time):</span>
									<span className="font-bold">₦5,000</span>
								</div>
								<div className="flex justify-between">
									<span>Per-Visit Fee:</span>
									<span className="font-bold">₦1,000</span>
								</div>
								<div className="flex justify-between text-white border-t border-[#2A758C]/30 pt-1.5">
									<span>First Visit Lab Package:</span>
									<span className="font-bold">₦8,500</span>
								</div>
							</div>
							<div className="bg-black/20 rounded-lg p-2 text-[10px] text-slate-300 border border-white/5">
								<strong className="text-white">
									Included Lab Tests:
								</strong>{" "}
								VDRL (Syphilis), HP (H. Pylori), MP (Malaria), RVS
								(Retroviral), UA (Urinalysis).
							</div>
						</div>
					</div>

					{/* Regular Sick */}
					<div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 hover:bg-white/10 transition-all">
						<div className="flex items-center gap-3">
							<div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl">
								<Activity className="h-5 w-5" />
							</div>
							<div>
								<h3 className="text-sm font-bold text-white">
									c. Regular Sick Patients
								</h3>
								<p className="text-[10px] text-slate-300">
									Outpatient Consultation Paths
								</p>
							</div>
						</div>
						<div className="text-[11px] text-slate-200 space-y-2 leading-relaxed font-medium font-sans">
							<p>
								Standard clinical registration path for new
								symptoms, general consultations, or revisits.
							</p>
							<div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 space-y-1.5 font-mono text-emerald-200">
								<div className="flex justify-between">
									<span>New Patient Card:</span>
									<span className="font-bold">₦3,000</span>
								</div>
								<div className="flex justify-between">
									<span>Revisiting Patient:</span>
									<span className="font-bold">
										₦0 (Active Card)
									</span>
								</div>
							</div>
							<p className="text-[10px] text-slate-300 italic">
								Revisiting patients bypass card creation fees and
								go straight to clinical queuing upon showing an
								active registration card.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Pricing Catalog */}
			<div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-base font-bold text-slate-900 font-sans">
							Clinical Pricing Catalog
						</h2>
						<p className="text-xs text-slate-500 font-medium font-sans">
							Dynamic, verified prices synced with live PostgreSQL
							database records
						</p>
					</div>
					<button
						onClick={onRefreshPrices}
						className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 text-slate-500 transition-all cursor-pointer"
						title="Sync from Database"
					>
						<RefreshCw className="h-4 w-4" />
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{prices.length === 0 ? (
						<div className="col-span-full text-center py-12 text-slate-400 font-medium text-xs">
							No prices returned. Syncing with the backend...
						</div>
					) : (
						prices.map((item) => (
							<div
								key={item.id}
								className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition-all shadow-3xs"
							>
								<div>
									<div className="flex justify-between items-start">
										<span className="text-[9px] font-bold text-[#2A758C] bg-[#A3D1E0]/20 px-2 py-0.5 rounded-md uppercase font-mono">
											{item.category}
										</span>
										<span className="text-[9px] text-slate-400 font-mono font-medium">
											{item.item_code}
										</span>
									</div>
									<h4 className="text-xs font-bold text-slate-800 mt-2 line-clamp-2">
										{item.item_name}
									</h4>
									<p className="text-[9px] text-slate-500 mt-0.5">
										ZMC Official Price Schedule
									</p>
								</div>

								<div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
									<span className="text-xs font-mono font-black text-slate-950">
										₦{parseFloat(item.price).toLocaleString()}
									</span>

									{["Administrator", "Management"].includes(
										userRole ?? "",
									) && (
										<button
											onClick={() => onOpenPriceEdit(item)}
											className="px-2 py-1 bg-slate-200/60 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[9px] transition-colors cursor-pointer"
										>
											Modify
										</button>
									)}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
