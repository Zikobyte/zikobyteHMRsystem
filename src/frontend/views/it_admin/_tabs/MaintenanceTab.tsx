/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Phase 7 extraction from it_admin/UserManagementView.tsx (SUBTAB:
 * MAINTENANCE, verbatim JSX).
 *
 * Systems maintenance desk: browser/client + storage + data-store info
 * cards, full-backup download card, data-stores directory table with
 * per-store clear actions, and the danger-zone full system reset box.
 * State and handlers arrive via the maintenance ops hook result.
 */

import {
  AlertTriangle,
  Database,
  Download,
  Globe,
  HardDrive,
  Layers,
  RefreshCw,
  RotateCcw,
  Server,
  Trash2
} from 'lucide-react';
import type { UseMaintenanceOpsResult } from '../_hooks/useMaintenanceOps';

export interface MaintenanceTabProps {
  data: UseMaintenanceOpsResult;
}

export default function MaintenanceTab({ data }: MaintenanceTabProps) {
  const {
    browserInfo,
    totalStorageBytes,
    formatBytes,
    dataStores,
    maintenanceLoading,
    fetchServerStats,
    handleDownloadFullBackup,
    setStoreToClear,
    setResetConfirmText,
    setIsResetModalOpen
  } = data;

  return (
    <div className="space-y-6">
      {/* 3 System Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Browser Info */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Browser & Client</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                <Globe className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 mt-2 tracking-tight">
              {browserInfo.browser}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
              <span>{browserInfo.os}</span>
              <span>•</span>
              <span className="font-mono text-slate-400">{browserInfo.engine}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Intranet TLS Enforced</span>
            <span className="text-emerald-600 font-bold font-mono">Secure HTTPS</span>
          </div>
        </div>

        {/* Card 2: Storage Used */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Storage Used</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
                <HardDrive className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 mt-2 font-mono tracking-tight">
              {formatBytes(totalStorageBytes)}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-2">
              <span>Calculated local state & records size</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Browser Storage Quota</span>
            <span className="text-slate-700 font-bold font-mono">~5.0 MB Allocated</span>
          </div>
        </div>

        {/* Card 3: Data Stores Count */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Data Stores</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 mt-2 font-mono tracking-tight">
              {dataStores.length} Stores Active
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Relational PostgreSQL + Local storage synchronizer
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Core Database Status</span>
            <span className="text-emerald-600 font-bold font-mono">100% Synced</span>
          </div>
        </div>
      </div>

      {/* Download Full Backup Card */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-emerald-400 border border-white/10">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="text-base font-black tracking-tight">Download Full Backup</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Export all localStorage data stores and relational database tables as a single, timestamped{' '}
            <span className="font-mono text-emerald-400 font-bold">ZMC_HMS_Backup_{new Date().toISOString().split('T')[0]}.json</span> backup archive.
          </p>
        </div>

        <button
          onClick={handleDownloadFullBackup}
          disabled={maintenanceLoading !== null}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-5 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer shrink-0 active:scale-98"
        >
          {maintenanceLoading === 'backup' ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>Download Full Backup</span>
        </button>
      </div>

      {/* Data Stores Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Server className="h-4 w-4 text-[#2A758C]" />
              <span>Data Stores Directory</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Inspect record count, byte volume, and clear individual operational stores
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchServerStats}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Recalculate Sizes</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-5">Data Store / Key</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Description</th>
                <th className="py-3.5 px-5 text-right font-mono">Record Count</th>
                <th className="py-3.5 px-5 text-right font-mono">Byte Size</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {dataStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-slate-900">{store.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{store.key}</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      store.category === 'Clinical' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                      store.category === 'Billing' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      store.category === 'Inventory' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      store.category === 'Queue' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {store.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 max-w-xs truncate">
                    {store.description}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-800">
                    {store.count}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-slate-600 font-medium">
                    {formatBytes(store.sizeBytes)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {store.isProtected ? (
                      <span className="text-[11px] font-mono text-slate-400 font-semibold italic">
                        Protected
                      </span>
                    ) : (
                      <button
                        onClick={() => setStoreToClear(store)}
                        disabled={maintenanceLoading !== null}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full System Reset Box */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-900 font-black text-sm">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <span>Full System Reset (Danger Zone)</span>
          </div>
          <p className="text-xs text-rose-700 max-w-2xl leading-relaxed">
            Purge all patient visits, vital sign readings, queue routing, billing invoices, and lab orders to factory state. Requires double-confirmation.
          </p>
        </div>

        <button
          onClick={() => {
            setResetConfirmText('');
            setIsResetModalOpen(true);
          }}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-black px-5 py-2.5 rounded-xl text-xs transition-all shadow-xs cursor-pointer shrink-0"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Full System Reset</span>
        </button>
      </div>
    </div>
  );
}
