import React from 'react';
import {
  Glasses,
  RefreshCw,
  Plus,
  Compass,
  Settings,
  Search,
  Sparkles,
  CheckCheck,
  X
} from 'lucide-react';
import { useTracker } from '../context/useTracker';

export default function Header({ onOpenAddModal, onOpenExplorerModal, onOpenSettingsModal }) {
  const {
    stats,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    onlyNewReleases,
    setOnlyNewReleases,
    sortMode,
    setSortMode,
    isSyncing,
    lastSyncTime,
    syncAll,
    markAllAsSeen,
  } = useTracker();

  const categories = [
    { id: 'ALL', label: 'Tutti' },
    { id: 'Universal Frameworks & Injectors', label: 'Frameworks (UEVR / RE)' },
    { id: 'AAA & Action / RPG VR Mods', label: 'AAA & RPG' },
    { id: 'Source & Classic Engine Ports', label: 'Source & Classici' },
    { id: 'Indie & Adventure VR Mods', label: 'Indie & Avventura' },
    { id: 'Standalone (Meta Quest / Android) Ports', label: 'Meta Quest Standalone' },
    { id: 'UEVR Profiles & Game Fixes', label: 'Profili UEVR' },
    { id: 'FAVORITES', label: 'Preferiti ⭐' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0c0d12]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Branding & Main Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo and App Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-emerald-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#101117] rounded-[10px] flex items-center justify-center">
                <Glasses className="w-4.5 h-4.5 text-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                  VR MODS <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">TRACKER</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-violet-950/70 text-violet-300 border border-violet-800/40">
                  Flat2VR Live
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Monitoraggio continuo e directory aperta per tutte le mod VR
              </p>
            </div>
          </div>

          {/* Top Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sync Button */}
            <button
              onClick={syncAll}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-xs font-medium text-zinc-200 hover:text-white transition-all border border-zinc-750 disabled:opacity-50"
              title={lastSyncTime ? `Ultimo sync: ${lastSyncTime}` : 'Controlla aggiornamenti e nuovi port'}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isSyncing ? 'Aggiornamento...' : 'Aggiorna'}</span>
            </button>

            {/* Mark All As Seen */}
            <button
              onClick={markAllAsSeen}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-xs font-medium text-zinc-200 hover:text-white transition-all border border-zinc-750"
              title="Segna tutte le nuove release come viste"
            >
              <CheckCheck className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden md:inline">Segna tutti visti</span>
            </button>

            {/* Add Custom Repo */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/15 hover:bg-violet-600/25 text-violet-300 border border-violet-500/30 text-xs font-medium transition-all"
              title="Aggiungi qualsiasi repository GitHub al tracker"
            >
              <Plus className="w-3.5 h-3.5 text-violet-300" />
              <span>Aggiungi Repo</span>
            </button>

            {/* GitHub Explorer Modal */}
            <button
              onClick={onOpenExplorerModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all"
              title="Cerca e scopri nuove mod VR su GitHub in tempo reale"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scopri Nuovi</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettingsModal}
              className="p-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-750"
              title="Impostazioni"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Second Row: Search bar & Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca gioco, mod, autore (es. Resident Evil, Praydog, Half-Life)..."
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-[#14151e] border border-zinc-750 focus:border-violet-500 focus:outline-none text-xs text-white placeholder-zinc-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="bg-zinc-850 px-2.5 py-1 rounded-md text-zinc-300 border border-zinc-750">
              <strong className="text-white font-mono">{stats.totalRepos}</strong> repo tracciati
            </span>

            {/* New Releases Filter Toggle */}
            <button
              onClick={() => setOnlyNewReleases(prev => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
                onlyNewReleases
                  ? 'bg-emerald-500 text-black font-semibold shadow-sm'
                  : stats.newReleasesCount > 0
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-zinc-850 text-zinc-400 border border-zinc-750'
              }`}
              title="Filtra solo le mod con nuove release non viste"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{stats.newReleasesCount} Nuove Release</span>
            </button>

            {/* Global Sort Selector */}
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              className="bg-[#14151e] border border-zinc-750 text-xs text-zinc-300 rounded-md px-2 py-1 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="A-Z">A-Z (Alfabetico)</option>
              <option value="Z-A">Z-A</option>
              <option value="NEW_FIRST">Nuovi prima (NEW!)</option>
              <option value="RECENT">Data Release (Più recenti)</option>
              <option value="STARS">Stelle GitHub (⭐)</option>
            </select>
          </div>
        </div>

        {/* Third Row: Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-sm font-semibold'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
