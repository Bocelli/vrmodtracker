import React, { useState } from 'react';
import {
  X,
  Settings,
  Download,
  Upload,
  AlertTriangle,
  Database,
  RefreshCw
} from 'lucide-react';
import { useTracker } from '../context/useTracker';

export default function SettingsModal({ isOpen, onClose }) {
  const {
    stats,
    lastSyncTime,
    syncAll,
    isSyncing,
    exportTrackerData,
    importTrackerData,
    resetToDefaults,
  } = useTracker();

  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const res = importTrackerData(content);
        if (res.success) {
          setImportStatus('Dati ripristinati con successo!');
        } else {
          setImportStatus('Errore: formato file non valido.');
        }
      } catch {
        setImportStatus('Errore durante la lettura del file JSON.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Sei sicuro di voler ripristinare tutti i dati e azzerare la cronologia dei visti?')) {
      resetToDefaults();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#171821] border border-zinc-700/80 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Impostazioni Tracker</h2>
            <p className="text-xs text-zinc-400">Gestione archivio locale, backup e sincronizzazione</p>
          </div>
        </div>

        {/* Info & Sync Status Section */}
        <div className="p-4 rounded-xl bg-[#121319] border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Stato Database Locale</h3>
            </div>
            <button
              onClick={syncAll}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizzazione...' : 'Aggiorna Ora'}</span>
            </button>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            I dati delle mod provengono dall'indice open source <a href="https://github.com/jrejaud/awesome-flat2vr" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">awesome-flat2vr</a> e sono consultabili liberamente senza richiedere account o credenziali personali.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-center">
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <div className="text-[10px] text-zinc-400 uppercase">Mod Tracciate</div>
              <div className="text-sm font-bold text-white">{stats.totalRepos}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <div className="text-[10px] text-zinc-400 uppercase">Nuove Release</div>
              <div className="text-sm font-bold text-emerald-400">{stats.newReleasesCount}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-zinc-400 uppercase">Ultimo Sync</div>
              <div className="text-xs font-bold text-purple-300 truncate">{lastSyncTime || 'Iniziale'}</div>
            </div>
          </div>
        </div>

        {/* Backup & Restore Section */}
        <div className="p-4 rounded-xl bg-[#121319] border border-zinc-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-sky-400" />
            <span>Backup & Ripristino</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Esporta il tuo stato del tracker (cronologia visti, preferiti, repository personalizzati) per sincronizzarlo su un altro dispositivo o conservarlo al sicuro in locale.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportTrackerData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors border border-zinc-700"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Esporta Backup (JSON)</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors border border-zinc-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Importa Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <div className="text-xs text-emerald-400 font-semibold mt-1">
              {importStatus}
            </div>
          )}
        </div>

        {/* Danger Zone: Reset */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 flex items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Azzera Dati Locali</span>
            </h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Ripristina il tracker allo stato predefinito cancellando la cronologia locale dei "Visti".
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 text-rose-200 text-xs font-bold transition-colors shrink-0"
          >
            Ripristina
          </button>
        </div>
      </div>
    </div>
  );
}
