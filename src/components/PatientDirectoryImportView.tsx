import { ChangeEvent, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, FolderOpen, Table2, Upload } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { User } from '../types';

const REQUIRED_COLUMNS = ['Full Name', 'Date of Birth', 'Gender', 'Phone Number', 'Address', 'Card Type'];
const OPTIONAL_COLUMNS = ['Email', 'Marital Status', 'Next of Kin Name', 'Next of Kin Phone', 'Next of Kin Relationship'];
type ImportRow = Record<string, string | number | undefined> & { _row: number; _error?: string };
interface ImportRecord { id: string; fileName: string; importedAt: string; importedBy: string; totalRows: number; importedRows: number; failedRows: number; rows: ImportRow[]; }
interface PatientDirectoryImportViewProps { currentUser?: User | null; }

const normalizeHeader = (value: unknown) => String(value || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
const headerValue = (row: Record<string, unknown>, label: string) => {
  const key = Object.keys(row).find((candidate) => normalizeHeader(candidate) === normalizeHeader(label));
  return key ? String(row[key] ?? '').trim() : '';
};
function formatExcelDate(value: unknown): string {
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? String(value || '').trim() : parsed.toISOString().slice(0, 10);
}
function validateRow(row: ImportRow): string | undefined {
  const value = (column: string) => String(row[column] ?? '');
  const missing = REQUIRED_COLUMNS.filter((column) => !value(column));
  if (missing.length) return `Missing ${missing.join(', ')}`;
  if (!['Male', 'Female', 'Other'].includes(value('Gender'))) return 'Gender must be Male, Female, or Other';
  if (!['Standard', 'Maternity', 'Emergency'].includes(value('Card Type'))) return 'Card Type must be Standard, Maternity, or Emergency';
  if (!/^\d{7,15}$/.test(value('Phone Number').replace(/\D/g, ''))) return 'Phone Number must contain 7 to 15 digits';
  const date = new Date(value('Date of Birth'));
  if (Number.isNaN(date.getTime()) || date > new Date() || date.getFullYear() < 1900) return 'Date of Birth must be a valid date from 1900 to today';
}

export default function PatientDirectoryImportView({ currentUser }: PatientDirectoryImportViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [message, setMessage] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [history, setHistory] = useState<ImportRecord[]>(() => { try { return JSON.parse(localStorage.getItem('zmc_patient_directory_imports') || '[]'); } catch { return []; } });
  const [selectedImport, setSelectedImport] = useState<ImportRecord | null>(null);
  const validRows = useMemo(() => rows.filter((row) => !row._error), [rows]);
  const invalidRows = useMemo(() => rows.filter((row) => row._error), [rows]);
  const saveHistory = (next: ImportRecord[]) => { setHistory(next); localStorage.setItem('zmc_patient_directory_imports', JSON.stringify(next)); };

  const downloadTemplate = () => {
    const sample = [{ 'Full Name': 'Jane Doe', 'Date of Birth': '1990-05-14', Gender: 'Female', 'Phone Number': '08012345678', Address: '12 Hospital Road', 'Card Type': 'Standard', Email: 'jane@example.com', 'Marital Status': 'Single', 'Next of Kin Name': 'John Doe', 'Next of Kin Phone': '08087654321', 'Next of Kin Relationship': 'Spouse' }];
    const sheet = XLSX.utils.json_to_sheet(sample, { header: [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS] });
    const book = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(book, sheet, 'Patient Directory'); XLSX.writeFile(book, 'ZMC_Patient_Directory_Import_Template.xlsx');
  };
  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (!/\.(xlsx|xls|xlsm|xlsb)$/i.test(file.name)) { setMessage('Select an Excel workbook in .xlsx, .xls, .xlsm, or .xlsb format.'); return; }
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[workbook.SheetNames[0]], { defval: '', raw: false });
      if (!rawRows.length) throw new Error('The first worksheet has no patient rows.');
      const missingColumns = REQUIRED_COLUMNS.filter((column) => !Object.keys(rawRows[0]).some((header) => normalizeHeader(header) === normalizeHeader(column)));
      if (missingColumns.length) throw new Error(`Missing required columns: ${missingColumns.join(', ')}.`);
      const parsed = rawRows.map((source, index) => {
        const row: ImportRow = { _row: index + 2 };
        [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS].forEach((column) => { row[column] = column === 'Date of Birth' ? formatExcelDate(headerValue(source, column)) : headerValue(source, column); });
        row._error = validateRow(row); return row;
      });
      setFileName(file.name); setRows(parsed); setMessage(parsed.some((row) => row._error) ? 'Review rows marked with errors before importing.' : 'Workbook is valid and ready to import.');
    } catch (error: any) { setRows([]); setFileName(''); setMessage(error.message || 'Unable to read this Excel workbook.'); }
    finally { event.target.value = ''; }
  };
  const importPatients = async () => {
    if (!validRows.length || isImporting) return; setIsImporting(true); setMessage(`Importing ${validRows.length} patient records...`);
    let importedRows = 0; const completed = [...rows];
    for (const row of validRows) {
      try { await apiFetch('/patients', { method: 'POST', body: JSON.stringify({ name: row['Full Name'], dateOfBirth: row['Date of Birth'], gender: row.Gender, phoneNumber: row['Phone Number'], address: row.Address, cardType: row['Card Type'], email: row.Email || undefined, maritalStatus: row['Marital Status'] || undefined, nextOfKinName: row['Next of Kin Name'] || undefined, nextOfKinPhone: row['Next of Kin Phone'] || undefined, nextOfKinRelationship: row['Next of Kin Relationship'] || undefined }) }); importedRows += 1; }
      catch (error: any) { const target = completed.find((item) => item._row === row._row); if (target) target._error = error.message || 'Registration failed'; }
    }
    const record: ImportRecord = { id: crypto.randomUUID(), fileName, importedAt: new Date().toISOString(), importedBy: currentUser?.name || currentUser?.username || 'IT Administrator', totalRows: rows.length, importedRows, failedRows: completed.filter((row) => row._error).length, rows: completed };
    saveHistory([record, ...history].slice(0, 20)); setRows(completed); setSelectedImport(record); setMessage(`${importedRows} patient record${importedRows === 1 ? '' : 's'} imported. ${record.failedRows} row${record.failedRows === 1 ? '' : 's'} need attention.`); setIsImporting(false);
  };
  const displayedRows = selectedImport?.rows || rows;
  return <div className="space-y-5">
    <section className="border border-teal-200 bg-teal-50 p-5 shadow-sm"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2 text-teal-900"><FileSpreadsheet size={23} /><h2 className="text-lg font-bold">Patient Directory Import</h2></div><p className="mt-1 max-w-2xl text-sm text-teal-800">Import historical patient demographics from a hospital Excel directory into the ZMC patient registry.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={downloadTemplate} className="inline-flex items-center gap-2 border border-teal-700 bg-white px-3 py-2 text-sm font-semibold text-teal-900"><Download size={16} /> Download template</button><button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 bg-teal-800 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-teal-900"><FolderOpen size={17} /> Select Excel file</button><input ref={inputRef} type="file" accept=".xlsx,.xls,.xlsm,.xlsb,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel.sheet.binary.macroEnabled.12" onChange={handleFile} className="hidden" /></div></div><div className="mt-4 grid gap-2 text-xs text-teal-900 sm:grid-cols-2 xl:grid-cols-3">{REQUIRED_COLUMNS.map((column) => <span key={column} className="border border-teal-200 bg-white px-2 py-1.5 font-medium">Required: {column}</span>)}</div></section>
    {message && <div className={`flex items-center gap-2 border px-4 py-3 text-sm ${invalidRows.length ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-emerald-300 bg-emerald-50 text-emerald-900'}`}>{invalidRows.length ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}{message}</div>}
    {rows.length > 0 && <section className="border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-bold text-slate-900">Workbook preview: {fileName}</h3><p className="text-sm text-slate-500">{validRows.length} ready to import, {invalidRows.length} requiring correction.</p></div><button type="button" disabled={!validRows.length || isImporting} onClick={importPatients} className="inline-flex items-center justify-center gap-2 bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-400"><Upload size={17} />{isImporting ? 'Importing...' : `Import ${validRows.length} patient records`}</button></div><ImportTable rows={rows} /></section>}
    <section className="border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-2 border-b border-slate-200 p-4"><Table2 size={19} className="text-teal-700" /><div><h3 className="font-bold text-slate-900">Imported Excel Sheets</h3><p className="text-sm text-slate-500">Import history available on this IT department workstation.</p></div></div>{!history.length ? <div className="p-8 text-center text-sm text-slate-500">No patient directory workbooks have been imported yet.</div> : <div className="divide-y divide-slate-100">{history.map((record) => <button type="button" onClick={() => setSelectedImport(record)} key={record.id} className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-slate-50"><div><p className="font-semibold text-slate-800">{record.fileName}</p><p className="mt-1 text-xs text-slate-500">Imported by {record.importedBy} on {new Date(record.importedAt).toLocaleString()}</p></div><div className="text-right text-sm"><p className="font-bold text-emerald-700">{record.importedRows} imported</p><p className="text-slate-500">{record.failedRows} not imported</p></div></button>)}</div>}</section>
    {selectedImport && <section className="border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-4"><h3 className="font-bold text-slate-900">{selectedImport.fileName}</h3><p className="text-sm text-slate-500">Imported patient information</p></div><ImportTable rows={displayedRows} /></section>}
  </div>;
}
function ImportTable({ rows }: { rows: ImportRow[] }) { return <div className="max-h-[420px] overflow-auto"><table className="min-w-full text-left text-xs"><thead className="sticky top-0 bg-slate-100 text-slate-700"><tr><th className="px-3 py-3">Row</th>{REQUIRED_COLUMNS.map((column) => <th key={column} className="whitespace-nowrap px-3 py-3">{column}</th>)}<th className="px-3 py-3">Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row._row} className="border-t border-slate-100"><td className="px-3 py-2 text-slate-500">{row._row}</td>{REQUIRED_COLUMNS.map((column) => <td key={column} className="whitespace-nowrap px-3 py-2 text-slate-700">{row[column]}</td>)}<td className={`px-3 py-2 ${row._error ? 'text-rose-700' : 'text-emerald-700'}`}>{row._error || 'Ready'}</td></tr>)}</tbody></table></div>; }