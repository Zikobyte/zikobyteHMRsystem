import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
	AlertCircle,
	CheckCircle2,
	Download,
	FileSpreadsheet,
	FolderOpen,
	Table2,
	Upload,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
import { User } from "@/types";

// Column layout mirrors the ZMC OPD patient information table exactly, in the order used across the system.
const ALL_COLUMNS = [
	"First Name",
	"Last Name",
	"Gender",
	"Marital Status",
	"Hospital Number",
	"Address",
	"Date of Birth",
	"Card Type",
	"Phone Number",
	"Document Type",
	"ID Document Number",
	"Next of Kin",
	"Next of Kin Phone",
	"Relationship Status",
	"Registration Date",
	"Registered By",
];
const REQUIRED_COLUMNS = [
	"First Name",
	"Last Name",
	"Gender",
	"Address",
	"Date of Birth",
	"Card Type",
	"Phone Number",
];
const OPTIONAL_COLUMNS = ALL_COLUMNS.filter(
	(column) => !REQUIRED_COLUMNS.includes(column),
);
// Aliases accept common real-world header wording (e.g. "Residential Address", "Surname")
// so a workbook exported from real OPD patient data matches without renaming columns.
const COLUMN_ALIASES: Record<string, string[]> = {
	"First Name": ["First Name", "Firstname", "Given Name"],
	"Last Name": ["Last Name", "Lastname", "Surname", "Family Name"],
	Gender: ["Gender", "Sex", "Gender / Sex"],
	"Marital Status": ["Marital Status"],
	"Hospital Number": [
		"Hospital Number",
		"Hospital ID",
		"Card Number",
		"ZMC Number",
	],
	Address: [
		"Address",
		"Residential Address",
		"Home Address",
		"Contact Address",
	],
	"Date of Birth": ["Date of Birth", "DOB", "Birth Date", "Date Of Birth"],
	"Card Type": [
		"Card Type",
		"Card Category",
		"Patient Category",
		"Card Category Type",
	],
	"Phone Number": [
		"Phone Number",
		"Phone",
		"Mobile Number",
		"Contact Number",
		"Telephone",
	],
	"Document Type": ["Document Type", "ID Type", "Government ID Type"],
	"ID Document Number": ["ID Document Number", "ID Number", "Document Number"],
	"Next of Kin": ["Next of Kin", "Next of Kin Name"],
	"Next of Kin Phone": [
		"Next of Kin Phone",
		"Next of Kin Contact",
		"Next of Kin Number",
	],
	"Relationship Status": [
		"Relationship Status",
		"Relationship",
		"Next of Kin Relationship",
	],
	"Registration Date": ["Registration Date", "Date Registered", "Reg Date"],
	"Registered By": ["Registered By", "Registrar", "Registered By Staff"],
};
type ImportRow = Record<string, string | number | undefined> & {
	_row: number;
	_error?: string;
};
interface ImportFailureSummary {
	_row: number;
	error: string;
}
interface ImportRecord {
	id: string;
	fileName: string;
	importedAt: string;
	importedBy: string;
	totalRows: number;
	importedRows: number;
	failedRows: number;
	// Row numbers + error strings only — never names/phones/addresses.
	failures: ImportFailureSummary[];
	// In-memory only for the just-completed import (enables selectedImport
	// review + ImportTable in-session). Never written to localStorage.
	rows?: ImportRow[];
}
// NDPR purpose/retention note: import history persists operational audit
// metadata only (counts + per-row failure summaries) for a 30-day retention
// window so IT can audit past directory imports without retaining patient
// PHI at rest in the browser.
const IMPORT_HISTORY_KEY = "zmc_patient_directory_imports";
const IMPORT_HISTORY_CAP = 20;
const IMPORT_HISTORY_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const BULK_IMPORT_CHUNK_SIZE = 200;

// Strip patient identifiers from persisted failure text. Backend duplicate
// errors embed quoted name + hospital number (e.g. Row 3: "Jane Doe"
// ...), which must never rest in localStorage. Full detail stays in the
// in-memory `rows` for the live session only.
function sanitizeFailureError(message: string): string {
	return message
		.replace(/"[^"]*"/g, '"[redacted]"')
		.replace(/\(Hospital Number:[^)]*\)/gi, "(Hospital Number: [redacted])")
		.replace(/\([^)]*Card:[^)]*\)/gi, "(duplicate record [redacted])")
		.replace(/\bZMC[-\s]*\d+(?:[-\s]*\d+)*/gi, "[redacted]")
		.replace(/\bEC[-\s]*\d+(?:[-\s]*\d+)*/gi, "[redacted]")
		.slice(0, 500);
}

function toMetadataRecord(raw: unknown): ImportRecord | null {
	if (!raw || typeof raw !== "object") return null;
	const candidate = raw as Record<string, unknown>;
	if (typeof candidate.id !== "string") return null;
	const failures: ImportFailureSummary[] = Array.isArray(candidate.failures)
		? (candidate.failures as unknown[])
				.filter(
					(entry): entry is { _row: unknown; error: unknown } =>
						!!entry && typeof entry === "object",
				)
				.filter(
					(entry) =>
						Number.isFinite(Number((entry as any)._row)) &&
						typeof (entry as any).error === "string",
				)
			.map((entry: any) => ({
				_row: Number(entry._row),
				error: sanitizeFailureError(String(entry.error)),
			}))
		: Array.isArray(candidate.rows)
			? (candidate.rows as unknown[])
					.filter(
						(entry): entry is ImportRow =>
							!!entry &&
							typeof entry === "object" &&
							typeof (entry as ImportRow)._error === "string",
					)
				.map((entry) => ({
					_row: Number((entry as ImportRow)._row),
					error: sanitizeFailureError(String((entry as ImportRow)._error)),
				}))
			: [];
	return {
		id: candidate.id,
		fileName: typeof candidate.fileName === "string" ? candidate.fileName : "Workbook",
		importedAt:
			typeof candidate.importedAt === "string"
				? candidate.importedAt
				: new Date().toISOString(),
		importedBy:
			typeof candidate.importedBy === "string"
				? candidate.importedBy
				: "IT Administrator",
		totalRows: Number(candidate.totalRows) || 0,
		importedRows: Number(candidate.importedRows) || 0,
		failedRows: Number(candidate.failedRows) || failures.length,
		failures,
	};
}

function loadImportHistory(): ImportRecord[] {
	try {
		const raw = JSON.parse(
			localStorage.getItem(IMPORT_HISTORY_KEY) || "[]",
		);
		if (!Array.isArray(raw)) return [];
		const cutoff = Date.now() - IMPORT_HISTORY_RETENTION_MS;
		const pruned = raw
			.map(toMetadataRecord)
			.filter((record): record is ImportRecord => record !== null)
			.filter((record) => {
				const timestamp = new Date(record.importedAt).getTime();
				return !Number.isNaN(timestamp) && timestamp >= cutoff;
			})
			.slice(0, IMPORT_HISTORY_CAP);
		// Enforce metadata-only + TTL at rest (strips legacy full-row PHI entries).
		try {
			localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(pruned));
		} catch {
			// Storage quota/privacy mode — history stays in-memory only.
		}
		return pruned;
	} catch {
		return [];
	}
}

function toPatientPayload(row: ImportRow) {
	return {
		name: `${row["First Name"]} ${row["Last Name"]}`.trim(),
		dateOfBirth: row["Date of Birth"],
		gender: row.Gender,
		phoneNumber: row["Phone Number"],
		address: row.Address,
		cardType: row["Card Type"],
		maritalStatus: row["Marital Status"] || undefined,
		hospitalNumber: row["Hospital Number"] || undefined,
		idType: row["Document Type"] || undefined,
		idNumber: row["ID Document Number"] || undefined,
		nextOfKinName: row["Next of Kin"] || undefined,
		nextOfKinPhone: row["Next of Kin Phone"] || undefined,
		nextOfKinRelationship: row["Relationship Status"] || undefined,
		registrationDate: row["Registration Date"] || undefined,
		registeredBy: row["Registered By"] || undefined,
		cardFee: 0,
		status: "Completed",
	};
}
interface PatientDirectoryImportViewProps {
	currentUser?: User | null;
}
const normalizeHeader = (value: unknown) =>
	String(value || "")
		.trim()
		.toLowerCase()
		.replace(/[\s_/.-]+/g, "");
const findHeaderKey = (row: Record<string, unknown>, label: string) => {
	const aliases = COLUMN_ALIASES[label] || [label];
	const normalizedAliases = aliases.map(normalizeHeader);
	return Object.keys(row).find((candidate) =>
		normalizedAliases.includes(normalizeHeader(candidate)),
	);
};
const headerValue = (row: Record<string, unknown>, label: string) => {
	const key = findHeaderKey(row, label);
	return key ? String(row[key] ?? "").trim() : "";
};
function formatExcelDate(value: unknown): string {
	if (!String(value || "").trim()) return "";
	const parsed = new Date(String(value));
	return Number.isNaN(parsed.getTime())
		? String(value || "").trim()
		: parsed.toISOString().slice(0, 10);
}
function validateRow(row: ImportRow): string | undefined {
	const value = (column: string) => String(row[column] ?? "");
	const missing = REQUIRED_COLUMNS.filter((column) => !value(column));
	if (missing.length) return `Missing ${missing.join(", ")}`;
	if (!["Male", "Female", "Other"].includes(value("Gender")))
		return "Gender must be Male, Female, or Other";
	if (!["Standard", "Maternity", "Emergency"].includes(value("Card Type")))
		return "Card Type must be Standard, Maternity, or Emergency";
	if (!/^\d{7,15}$/.test(value("Phone Number").replace(/\D/g, "")))
		return "Phone Number must contain 7 to 15 digits";
	const date = new Date(value("Date of Birth"));
	if (
		Number.isNaN(date.getTime()) ||
		date > new Date() ||
		date.getFullYear() < 1900
	)
		return "Date of Birth must be a valid date from 1900 to today";
}

export default function PatientDirectoryImportView({
	currentUser,
}: PatientDirectoryImportViewProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [fileName, setFileName] = useState("");
	const [rows, setRows] = useState<ImportRow[]>([]);
	const [message, setMessage] = useState("");
	const [isImporting, setIsImporting] = useState(false);
	const [importProgress, setImportProgress] = useState<{
		done: number;
		total: number;
	} | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const [history, setHistory] = useState<ImportRecord[]>(() =>
		loadImportHistory(),
	);
	const [selectedImport, setSelectedImport] = useState<ImportRecord | null>(
		null,
	);

	useEffect(() => {
		const clearSelection = () => {
			abortRef.current?.abort();
			setSelectedImport(null);
			// Drop in-memory PHI preview on logout (persisted history is metadata-only).
			setRows([]);
			setFileName("");
			setMessage("");
		}
		window.addEventListener("zmc-logout", clearSelection);
		return () => window.removeEventListener("zmc-logout", clearSelection);
	}, []);
	const validRows = useMemo(() => rows.filter((row) => !row._error), [rows]);
	const invalidRows = useMemo(() => rows.filter((row) => row._error), [rows]);
	const saveHistory = (next: ImportRecord[]) => {
		const capped = next.slice(0, IMPORT_HISTORY_CAP);
		setHistory(capped);
		// Persist metadata only — strip in-memory `rows` (full PHI) before write.
		const metadataOnly = capped.map((record) => {
			const { rows: _strippedRows, ...meta } = record;
			void _strippedRows;
			return meta;
		});
		try {
			localStorage.setItem(IMPORT_HISTORY_KEY, JSON.stringify(metadataOnly));
		} catch {
			// Storage quota/privacy mode — history stays in-memory only.
		}
	};
	const cancelImport = () => {
		abortRef.current?.abort();
	};

	const downloadTemplate = () => {
		const sample = [
			{
				"First Name": "Jane",
				"Last Name": "Doe",
				Gender: "Female",
				"Marital Status": "Single",
				"Hospital Number": "ZMC-2026-1001",
				Address: "12 Hospital Road",
				"Date of Birth": "1990-05-14",
				"Card Type": "Standard",
				"Phone Number": "08012345678",
				"Document Type": "NIN",
				"ID Document Number": "12345678901",
				"Next of Kin": "John Doe",
				"Next of Kin Phone": "08087654321",
				"Relationship Status": "Spouse",
				"Registration Date": "2024-01-10",
				"Registered By": "Records Officer",
			},
		];
		const sheet = XLSX.utils.json_to_sheet(sample, { header: ALL_COLUMNS });
		const book = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(book, sheet, "Patient Directory");
		XLSX.writeFile(book, "ZMC_Patient_Directory_Import_Template.xlsx");
	};
	const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		if (!/\.(xlsx|xls|xlsm|xlsb)$/i.test(file.name)) {
			setMessage(
				"Select an Excel workbook in .xlsx, .xls, .xlsm, or .xlsb format.",
			);
			return;
		}
		try {
			const workbook = XLSX.read(await file.arrayBuffer(), {
				type: "array",
			});
			const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
				workbook.Sheets[workbook.SheetNames[0]],
				{ defval: "", raw: false },
			);
			if (!rawRows.length)
				throw new Error("The first worksheet has no patient rows.");
			const missingColumns = REQUIRED_COLUMNS.filter(
				(column) => !findHeaderKey(rawRows[0], column),
			);
			if (missingColumns.length)
				throw new Error(
					`Missing required columns: ${missingColumns.join(", ")}. Accepted header names: ${missingColumns.map((column) => (COLUMN_ALIASES[column] || [column]).join(" / ")).join("; ")}.`,
				);
			const parsed = rawRows.map((source, index) => {
				const row: ImportRow = { _row: index + 2 };
				ALL_COLUMNS.forEach((column) => {
					row[column] =
						column === "Date of Birth" || column === "Registration Date"
							? formatExcelDate(headerValue(source, column))
							: headerValue(source, column);
				});
				row._error = validateRow(row);
				return row;
			});
			setFileName(file.name);
			setRows(parsed);
			setMessage(
				parsed.some((row) => row._error)
					? "Review rows marked with errors before importing."
					: "Workbook is valid and ready to import.",
			);
		} catch (error: any) {
			setRows([]);
			setFileName("");
			setMessage(error.message || "Unable to read this Excel workbook.");
		} finally {
			event.target.value = "";
		}
	};
	const importPatients = async () => {
		if (!validRows.length || isImporting) return;
		const controller = new AbortController();
		abortRef.current = controller;
		setIsImporting(true);
		setImportProgress({ done: 0, total: validRows.length });
		setMessage(`Importing ${validRows.length} patient records...`);
		const requestedBy =
			currentUser?.name || currentUser?.username || "IT Administrator";
		let importedRows = 0;
		let cancelled = false;
		const completed = rows.map((row) => ({ ...row }));
		for (
			let start = 0;
			start < validRows.length;
			start += BULK_IMPORT_CHUNK_SIZE
		) {
			if (controller.signal.aborted) {
				cancelled = true;
				break;
			}
			const chunk = validRows.slice(start, start + BULK_IMPORT_CHUNK_SIZE);
			const payloadRows = chunk.map(toPatientPayload);
			setMessage(
				`Importing ${validRows.length} patient records... Imported ${importedRows} of ${validRows.length}.`,
			);
			try {
				const response = await apiFetch("/patients/bulk", {
					method: "POST",
					body: JSON.stringify({ rows: payloadRows, requestedBy }),
					signal: controller.signal,
				});
				const failed: Array<{ index: number; error: string }> = Array.isArray(
					response?.data?.failed,
				)
					? response.data.failed
					: [];
				const createdCount =
					typeof response?.data?.created === "number"
						? response.data.created
						: payloadRows.length - failed.length;
				failed.forEach((failure) => {
					const source = chunk[failure?.index];
					if (!source) return;
					const target = completed.find((item) => item._row === source._row);
					if (target) target._error = failure.error || "Registration failed";
				});
				importedRows += createdCount;
			} catch (error: any) {
				if (
					controller.signal.aborted ||
					error?.name === "AbortError"
				) {
					cancelled = true;
					break;
				}
				// Bulk 400 (cap/invalid) or total-chunk failure: surface the backend
				// message per-row and continue honestly with remaining chunks.
				const bulkError = error?.message || "Bulk registration failed";
				chunk.forEach((source) => {
					const target = completed.find((item) => item._row === source._row);
					if (target && !target._error) target._error = bulkError;
				});
			}
			const done = Math.min(start + chunk.length, validRows.length);
			setImportProgress({ done, total: validRows.length });
			setMessage(
				`Importing ${validRows.length} patient records... Imported ${importedRows} of ${validRows.length}.`,
			);
		}
		if (controller.signal.aborted) cancelled = true;
		const failedCount = completed.filter((row) => row._error).length;
		// Sanitize persisted failure text: backend duplicate errors embed the
		// patient name + hospital number, which must not rest in localStorage.
		// Full detail stays in-memory (`rows`) for this session only.
		const failures: ImportFailureSummary[] = completed
			.filter((row) => row._error)
			.map((row) => ({ _row: row._row, error: sanitizeFailureError(String(row._error)) }));
		const record: ImportRecord = {
			id: crypto.randomUUID(),
			fileName,
			importedAt: new Date().toISOString(),
			importedBy: requestedBy,
			totalRows: rows.length,
			importedRows,
			failedRows: failedCount,
			failures,
			rows: completed,
		};
		saveHistory([record, ...history].slice(0, IMPORT_HISTORY_CAP));
		setRows(completed);
		setSelectedImport(record);
		setMessage(
			cancelled
				? `Import cancelled. ${importedRows} patient record${importedRows === 1 ? "" : "s"} imported. ${record.failedRows} row${record.failedRows === 1 ? "" : "s"} need attention.`
				: `${importedRows} patient record${importedRows === 1 ? "" : "s"} imported. ${record.failedRows} row${record.failedRows === 1 ? "" : "s"} need attention.`,
		);
		setImportProgress(null);
		setIsImporting(false);
		abortRef.current = null;
	};
	const selectedRows = selectedImport?.rows;
	return (
		<div className="space-y-5">
			<section className="border border-teal-200 bg-teal-50 p-5 shadow-sm">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<div className="flex items-center gap-2 text-teal-900">
							<FileSpreadsheet size={23} />
							<h2 className="text-lg font-bold">
								Patient Directory Import
							</h2>
						</div>
						<p className="mt-1 max-w-2xl text-sm text-teal-800">
							Import historical patient demographics from a hospital
							Excel directory into the ZMC patient registry.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={downloadTemplate}
							className="inline-flex items-center gap-2 border border-teal-700 bg-white px-3 py-2 text-sm font-semibold text-teal-900"
						>
							<Download size={16} /> Download template
						</button>
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							className="inline-flex items-center gap-2 bg-teal-800 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-teal-900"
						>
							<FolderOpen size={17} /> Select Excel file
						</button>
						<input
							ref={inputRef}
							type="file"
							accept=".xlsx,.xls,.xlsm,.xlsb,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel.sheet.binary.macroEnabled.12"
							onChange={handleFile}
							className="hidden"
						/>
					</div>
				</div>
				<div className="mt-4 grid gap-2 text-xs text-teal-900 sm:grid-cols-2 xl:grid-cols-3">
					{ALL_COLUMNS.map((column) => (
						<span
							key={column}
							className="border border-teal-200 bg-white px-2 py-1.5 font-medium"
							title={(COLUMN_ALIASES[column] || [column]).join(" / ")}
						>
							{REQUIRED_COLUMNS.includes(column)
								? "Required"
								: "Optional"}
							: {column}
						</span>
					))}
				</div>
			</section>
			{message && (
				<div
					className={`border px-4 py-3 text-sm ${invalidRows.length ? "border-amber-300 bg-amber-50 text-amber-900" : "border-emerald-300 bg-emerald-50 text-emerald-900"}`}
				>
					<div className="flex items-center gap-2">
						{invalidRows.length ? (
							<AlertCircle size={18} />
						) : (
							<CheckCircle2 size={18} />
						)}
						<span>{message}</span>
					</div>
					{isImporting && importProgress && (
						<div className="mt-2">
							<div
								role="progressbar"
								aria-label="Bulk import progress"
								aria-valuemin={0}
								aria-valuemax={importProgress.total}
								aria-valuenow={importProgress.done}
								className="h-2 w-full overflow-hidden rounded bg-white/70 ring-1 ring-current"
							>
								<div
									className="h-full bg-current transition-all"
									style={{
										width: `${importProgress.total ? Math.round((importProgress.done / importProgress.total) * 100) : 0}%`,
									}}
								/>
							</div>
						</div>
					)}
				</div>
			)}
			{rows.length > 0 && (
				<section className="border border-slate-200 bg-white shadow-sm">
					<div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h3 className="font-bold text-slate-900">
								Workbook preview: {fileName}
							</h3>
							<p className="text-sm text-slate-500">
								{validRows.length} ready to import, {invalidRows.length}{" "}
								requiring correction.
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<button
								type="button"
								disabled={!validRows.length || isImporting}
								onClick={importPatients}
								className="inline-flex items-center justify-center gap-2 bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
							>
								<Upload size={17} />
								{isImporting
									? `Importing... ${importProgress ? `${importProgress.done} of ${importProgress.total}` : ""}`
									: `Import ${validRows.length} patient records`}
							</button>
							{isImporting && (
								<button
									type="button"
									onClick={cancelImport}
									aria-label="Cancel bulk import"
									className="inline-flex items-center justify-center gap-2 border border-rose-300 bg-white px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50"
								>
									Cancel import
								</button>
							)}
						</div>
					</div>
					<ImportTable rows={rows} />
				</section>
			)}
			<section className="border border-slate-200 bg-white shadow-sm">
				<div className="flex items-center gap-2 border-b border-slate-200 p-4">
					<Table2 size={19} className="text-teal-700" />
					<div>
						<h3 className="font-bold text-slate-900">
							Imported Excel Sheets
						</h3>
						<p className="text-sm text-slate-500">
							Import history available on this IT department workstation.
						</p>
					</div>
				</div>
				{!history.length ? (
					<div className="p-8 text-center text-sm text-slate-500">
						No patient directory workbooks have been imported yet.
					</div>
				) : (
					<div className="divide-y divide-slate-100">
						{history.map((record) => (
							<button
								type="button"
								onClick={() => setSelectedImport(record)}
								key={record.id}
								className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-slate-50"
							>
								<div>
									<p className="font-semibold text-slate-800">
										{record.fileName}
									</p>
									<p className="mt-1 text-xs text-slate-500">
										Imported by {record.importedBy} on{" "}
										{new Date(record.importedAt).toLocaleString()}
									</p>
								</div>
								<div className="text-right text-sm">
									<p className="font-bold text-emerald-700">
										{record.importedRows} imported
									</p>
									<p className="text-slate-500">
										{record.failedRows} not imported
									</p>
								</div>
							</button>
						))}
					</div>
				)}
			</section>
			{selectedImport && (
				<section className="border border-slate-200 bg-white shadow-sm">
					<div className="border-b border-slate-200 p-4">
						<h3 className="font-bold text-slate-900">
							{selectedImport.fileName}
						</h3>
						<p className="text-sm text-slate-500">
							Imported patient information
						</p>
					</div>
					{selectedRows && selectedRows.length ? (
						<ImportTable rows={selectedRows} />
					) : (
						<div className="p-4">
							<p className="text-sm text-slate-600">
								Row-level details are not retained on this workstation
								after reload — history keeps counts plus a failure
								summary only (30-day audit retention).{" "}
								{selectedImport.importedRows} imported,{" "}
								{selectedImport.failedRows} not imported.
							</p>
							{selectedImport.failures.length ? (
								<ul className="mt-3 max-h-56 space-y-1 overflow-auto text-xs">
									{selectedImport.failures.map((failure) => (
										<li
											key={failure._row}
											className="flex gap-2 border border-slate-100 bg-slate-50 px-2 py-1.5"
										>
											<span className="font-mono font-bold text-slate-500">
												Row {failure._row}:
											</span>
											<span className="text-rose-700">{failure.error}</span>
										</li>
									))}
								</ul>
							) : (
								<p className="mt-2 text-xs text-emerald-700">
									All rows imported successfully.
								</p>
							)}
						</div>
					)}
				</section>
			)}
		</div>
	);
}

function ImportTable({ rows }: { rows: ImportRow[] }) {
	return (
		<div className="max-h-[420px] overflow-auto">
			<table className="min-w-full text-left text-xs">
				<thead className="sticky top-0 bg-slate-100 text-slate-700">
					<tr>
						<th className="px-3 py-3">Row</th>
						{ALL_COLUMNS.map((column) => (
							<th key={column} className="whitespace-nowrap px-3 py-3">
								{column}
							</th>
						))}
						<th className="px-3 py-3">Status</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row._row} className="border-t border-slate-100">
							<td className="px-3 py-2 text-slate-500">{row._row}</td>
							{ALL_COLUMNS.map((column) => (
								<td
									key={column}
									className="whitespace-nowrap px-3 py-2 text-slate-700"
								>
									{row[column]}
								</td>
							))}
							<td
								className={`px-3 py-2 ${row._error ? "text-rose-700" : "text-emerald-700"}`}
							>
								{row._error || "Ready"}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
