/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dashboard slice extraction from views/DashboardOverview.tsx.
 *
 * DATABASE DIAGNOSTICS & SYNC CENTER (verbatim JSX + three telemetry
 * panels). Verify/seed actions are callbacks wired to useDashboardData.
 */

import { useState } from "react";
import { Check, Cpu, Database, RotateCw, Server } from "lucide-react";

export interface DiagnosticsHubProps {
	dbStatus: any;
	isCheckingDb: boolean;
	isSeeding: boolean;
	seedSuccessMessage: string | null;
	totalPatients: number;
	onVerifyLink: () => void;
	onSeed: () => void;
}

export default function DiagnosticsHub({
	dbStatus,
	isCheckingDb,
	isSeeding,
	seedSuccessMessage,
	totalPatients,
	onVerifyLink,
	onSeed,
}: DiagnosticsHubProps) {
	const [seedConfirmOpen, setSeedConfirmOpen] = useState(false);
	const [seedConfirmText, setSeedConfirmText] = useState("");
	const seedConfirmed = seedConfirmText === "SEED";
	const closeSeedConfirm = () => {
		setSeedConfirmOpen(false);
		setSeedConfirmText("");
	};
	return (
		<div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-5">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
				<div className="flex items-center gap-3">
					<div
						className={`p-2.5 rounded-xl ${dbStatus?.postgresActive ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
					>
						<Database className="h-6 w-6 animate-pulse" />
					</div>
					<div>
						<h3 className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
							Database & Storage Integration Hub
						</h3>
						<p className="text-xs text-slate-400">
							Check database status, credentials validity, active
							connection pool, and data persistence state.
						</p>
					</div>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<button
						onClick={onVerifyLink}
						disabled={isCheckingDb}
						className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
					>
						<RotateCw
							className={`h-3.5 w-3.5 ${isCheckingDb ? "animate-spin" : ""}`}
						/>
						Verify Link
					</button>
					{seedConfirmOpen ? (
						<div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
							<label
								htmlFor="diagnostics-seed-confirm"
								className="text-xs font-bold text-slate-700"
							>
								Type SEED to confirm re-seed
							</label>
							<input
								id="diagnostics-seed-confirm"
								type="text"
								value={seedConfirmText}
								onChange={(event) => setSeedConfirmText(event.target.value)}
								placeholder="SEED"
								autoComplete="off"
								disabled={isSeeding}
								className="w-24 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none disabled:opacity-50"
							/>
							<button
								onClick={() => {
									onSeed();
									closeSeedConfirm();
								}}
								disabled={isSeeding || !seedConfirmed}
								className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
							>
								<Cpu
									className={`h-3.5 w-3.5 ${isSeeding ? "animate-pulse" : ""}`}
								/>
								Confirm re-seed
							</button>
							<button
								onClick={closeSeedConfirm}
								disabled={isSeeding}
								className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
							>
								Cancel
							</button>
						</div>
					) : (
						<button
							onClick={() => setSeedConfirmOpen(true)}
							disabled={isSeeding}
							className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
						>
							<Cpu
								className={`h-3.5 w-3.5 ${isSeeding ? "animate-pulse" : ""}`}
							/>
							Re-seed Registry
						</button>
					)}
				</div>
			</div>

			{seedSuccessMessage && (
				<div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
					<Check className="h-4 w-4 text-emerald-600" />
					{seedSuccessMessage}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Section 1: Active Connection */}
				<div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between min-h-[180px]">
					<div>
						<div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
							Active Storage Engine
						</div>
						<div className="flex items-center gap-2 mb-3">
							<span
								className={`w-2.5 h-2.5 rounded-full ${dbStatus?.postgresActive ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`}
							></span>
							<span
								className={`w-2.5 h-2.5 rounded-full ${dbStatus?.postgresActive ? "bg-emerald-500" : "bg-amber-500"} absolute`}
							></span>
							<span className="font-bold text-sm text-slate-800 pl-4">
								{dbStatus?.postgresActive
									? "Google Cloud SQL (PostgreSQL)"
									: "PostgreSQL Database disconnected"}
							</span>
						</div>
						<p className="text-xs text-slate-500 leading-relaxed mb-4">
							{dbStatus?.postgresActive
								? "The system is actively connected to the PostgreSQL database. All operations (patient registries, audit logs, and inventory updates) are permanently stored inside secure relational tables."
								: "Critical: The system is disconnected from the PostgreSQL database. Please ensure your PostgreSQL environment variables are correctly configured in your settings panel."}
						</p>
					</div>
					<div className="text-[10px] font-semibold text-slate-400 bg-white px-2.5 py-1.5 rounded border border-slate-100 flex items-center gap-2">
						<Server className="h-3.5 w-3.5 text-slate-500" />
						<span>
							Type:{" "}
							{dbStatus?.postgresActive
								? "Production RDBMS"
								: "Offline/Disconnected"}
						</span>
					</div>
				</div>

				{/* Section 2: Credentials & Host Config */}
				<div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between min-h-[180px]">
					<div>
						<div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2.5">
							Connection Config Details
						</div>
						<div className="space-y-2 text-xs">
							<div className="flex justify-between py-1 border-b border-slate-200/50 font-mono">
								<span className="text-slate-500 font-semibold">
									DB Host:
								</span>
								<span
									className="text-slate-800 font-bold truncate max-w-[150px]"
									title={dbStatus?.connectionConfig?.host}
								>
									{dbStatus?.connectionConfig?.host ||
										"127.0.0.1 (Local)"}
								</span>
							</div>
							<div className="flex justify-between py-1 border-b border-slate-200/50 font-mono">
								<span className="text-slate-500 font-semibold">
									DB Name:
								</span>
								<span className="text-slate-800 font-bold truncate max-w-[150px]">
									{dbStatus?.connectionConfig?.database ||
										"zmc_backup_db"}
								</span>
							</div>
							<div className="flex justify-between py-1 border-b border-slate-200/50 font-mono">
								<span className="text-slate-500 font-semibold">
									Port:
								</span>
								<span className="text-slate-800 font-bold">
									{dbStatus?.connectionConfig?.port || "5432"}
								</span>
							</div>
							<div className="flex justify-between py-1 font-mono">
								<span className="text-slate-500 font-semibold">
									RDBMS Sync Status:
								</span>
								<span
									className={`font-bold ${dbStatus?.postgresActive ? "text-emerald-600" : "text-amber-600"}`}
								>
									{dbStatus?.postgresActive
										? "FULLY SYNCED"
										: "LOCAL CACHE ONLY"}
								</span>
							</div>
						</div>
					</div>
					<div className="text-[10px] font-semibold text-slate-400 bg-white px-2.5 py-1.5 rounded border border-slate-100 flex items-center justify-between">
						<div className="flex items-center gap-1.5">
							<Cpu className="h-3.5 w-3.5 text-slate-500" />
							<span>RDBMS Driver: node-postgres</span>
						</div>
					</div>
				</div>

				{/* Section 3: Diagnostic Telemetry */}
				<div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between min-h-[180px]">
					<div>
						<div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2.5">
							Live DB Health Metrics
						</div>
						<div className="space-y-2 text-xs">
							<div className="flex justify-between py-1 border-b border-slate-200/50 font-mono">
								<span className="text-slate-500 font-semibold">
									Write Speed (Latency):
								</span>
								<span className="text-emerald-600 font-bold">
									{dbStatus?.testQuery?.latencyMs
										? `${dbStatus.testQuery.latencyMs} ms`
										: "N/A (Using Cache)"}
								</span>
							</div>
							<div className="flex justify-between py-1 border-b border-slate-200/50 font-mono">
								<span className="text-slate-500 font-semibold">
									RDBMS Store Status:
								</span>
								<span className="text-slate-800 font-bold">
									{dbStatus?.postgresStoreKeys?.length
										? `${dbStatus.postgresStoreKeys.length} active tables`
										: "No custom schema"}
								</span>
							</div>
							<div className="flex justify-between py-1 border-b border-slate-200/50 font-mono">
								<span className="text-slate-500 font-semibold">
									Patients Records:
								</span>
								<span className="text-slate-800 font-bold">
									{dbStatus?.localBackupStats?.patientsCount ||
										totalPatients}
								</span>
							</div>
							<div className="flex justify-between py-1 font-mono">
								<span className="text-slate-500 font-semibold">
									Audit Logs:
								</span>
								<span className="text-slate-800 font-bold">
									{dbStatus?.localBackupStats?.auditLogsCount || 0}{" "}
									records
								</span>
							</div>
						</div>
					</div>
					<div className="text-[10px] font-semibold text-slate-400 bg-white px-2.5 py-1.5 rounded border border-slate-100 flex items-center gap-2">
						<span
							className={`w-1.5 h-1.5 rounded-full ${dbStatus?.postgresActive ? "bg-emerald-500" : "bg-slate-300"}`}
						></span>
						<span>
							PostgreSQL version:{" "}
							{dbStatus?.testQuery?.version
								? "v15+ Cloud Run"
								: "N/A"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
