import React, { useState } from 'react';
import { TrackerProvider } from './context/TrackerContext';
import { useTracker } from './context/useTracker';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import AddRepoModal from './components/AddRepoModal';
import GitHubExplorerModal from './components/GitHubExplorerModal';
import SettingsModal from './components/SettingsModal';
import ReleaseDetailsModal from './components/ReleaseDetailsModal';
import {
  Glasses,
  Sparkles,
  SearchX,
  ExternalLink
} from 'lucide-react';

function TrackerContent() {
  const {
    filteredRepos,
    categoriesGrouped,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    onlyNewReleases,
    setOnlyNewReleases,
    stats,
  } = useTracker();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExplorerModalOpen, setIsExplorerModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const categoryKeys = Object.keys(categoriesGrouped);
  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'ALL' || onlyNewReleases;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setOnlyNewReleases(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-zinc-200 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Sticky Header with Navigation and Filters */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenExplorerModal={() => setIsExplorerModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {/* Active Filter Notification Banner */}
        {hasActiveFilters && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs">
            <div className="flex items-center gap-2 text-purple-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>
                Filtro attivo: visualizzazione di <strong>{filteredRepos.length}</strong> su {stats.totalRepos} mod
                {onlyNewReleases && ' (solo nuove release non viste)'}
                {selectedCategory !== 'ALL' && ` [${selectedCategory}]`}
                {searchQuery && ` contenenti "${searchQuery}"`}
              </span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-purple-300 hover:text-white underline underline-offset-2"
            >
              Reimposta tutti i filtri
            </button>
          </div>
        )}

        {/* Empty State */}
        {categoryKeys.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Nessuna mod VR trovata</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Nessun repository corrisponde ai criteri di ricerca attuali o alle nuove release non lette.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors"
              >
                Mostra tutti i repository
              </button>
              <button
                onClick={() => setIsExplorerModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
              >
                Cerca su GitHub Explorer
              </button>
            </div>
          </div>
        ) : (
          /* Render Each Category Section */
          <div className="space-y-2">
            {categoryKeys.map((catName) => (
              <CategorySection
                key={catName}
                categoryName={catName}
                repos={categoriesGrouped[catName]}
              />
            ))}
          </div>
        )}
      </main>

      {/* Global Modals */}
      <AddRepoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <GitHubExplorerModal
        isOpen={isExplorerModalOpen}
        onClose={() => setIsExplorerModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <ReleaseDetailsModal />

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-[#0a0b0e] py-6 px-4 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Glasses className="w-4 h-4 text-purple-400" />
            <span className="text-zinc-400 font-semibold">VR Mods Tracker</span>
            <span>—</span>
            <span>Ispirato alla community Flat2VR & GitHub</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <a
              href="https://github.com/jrejaud/awesome-flat2vr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>awesome-flat2vr</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://discord.gg/flat2vr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Flat2VR Discord</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://uevr-profiles.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>UEVR Profiles</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TrackerProvider>
      <TrackerContent />
    </TrackerProvider>
  );
}
