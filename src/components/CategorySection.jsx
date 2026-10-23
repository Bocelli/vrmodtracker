import React, { useState } from 'react';
import {
  ChevronDown,
  ArrowUpDown,
  Sparkles,
  LayoutGrid,
  Columns
} from 'lucide-react';
import RepoCard from './RepoCard';
import { useTracker } from '../context/useTracker';

export default function CategorySection({ categoryName, repos }) {
  const { collapsedCats, toggleCategoryCollapse, sortMode, setSortMode } = useTracker();
  const [viewMode, setViewMode] = useState('row'); // 'row' (horizontal scroll like screenshot) or 'grid'

  const isCollapsed = collapsedCats.includes(categoryName);

  // Count new unread releases in this specific category
  const newReleasesCount = repos.filter(r => r.hasNewRelease).length;
  const totalReposCount = repos.length;

  const cycleSort = (e) => {
    e.stopPropagation();
    if (sortMode === 'A-Z') setSortMode('RECENT');
    else if (sortMode === 'RECENT') setSortMode('NEW_FIRST');
    else if (sortMode === 'NEW_FIRST') setSortMode('STARS');
    else setSortMode('A-Z');
  };

  return (
    <section className="mb-6 rounded-xl bg-[#13141a]/60 border border-zinc-800/60 p-3 sm:p-4">
      {/* Category Section Header - matching the screenshot */}
      <div
        onClick={() => toggleCategoryCollapse(categoryName)}
        className="flex items-center justify-between cursor-pointer select-none group py-1 px-1 rounded hover:bg-zinc-800/30 transition-colors"
      >
        {/* Left Header: Collapse Chevron + Bullet + Title + NEW Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Chevron */}
          <ChevronDown
            className={`w-4 h-4 text-purple-400 transition-transform duration-200 shrink-0 ${
              isCollapsed ? '-rotate-90' : 'rotate-0'
            }`}
          />

          <span className="text-zinc-500 font-bold text-sm">·</span>

          {/* Title in soft purple/lavender like the screenshot */}
          <h2 className="text-base sm:text-lg font-bold text-[#c084fc] group-hover:text-purple-300 transition-colors truncate">
            {categoryName}
          </h2>

          {/* Green "NEW" pill badge if there are any unread releases */}
          {newReleasesCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10b981] text-black shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse shrink-0">
              <Sparkles className="w-3 h-3 text-black fill-current" />
              <span>NEW {newReleasesCount}</span>
            </span>
          )}
        </div>

        {/* Right Header: Repo count + Layout toggle + Sort indicator */}
        <div className="flex items-center gap-3 shrink-0 text-xs text-zinc-400 font-mono">
          <span className="bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-300">
            {totalReposCount} repo{totalReposCount === 1 ? '' : 's'}
          </span>

          {/* Toggle between row scroll and wrap grid */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewMode(prev => prev === 'row' ? 'grid' : 'row');
            }}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors hidden sm:block"
            title={viewMode === 'row' ? 'Passa a griglia avvolgente' : 'Passa a riga a scorrimento'}
          >
            {viewMode === 'row' ? <LayoutGrid className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
          </button>

          {/* Sort Pill like the screenshot "A-Z" */}
          <button
            onClick={cycleSort}
            className="inline-flex items-center gap-1 bg-zinc-800/80 hover:bg-zinc-700/80 px-2 py-0.5 rounded text-zinc-200 hover:text-white transition-colors"
            title={`Ordinamento attuale: ${sortMode}. Clicca per cambiare`}
          >
            <ArrowUpDown className="w-3 h-3 text-purple-400" />
            <span className="font-semibold">{sortMode}</span>
          </button>
        </div>
      </div>

      {/* Expandable/Collapsible Card Content */}
      {!isCollapsed && (
        <div className="mt-3.5 pt-1">
          {viewMode === 'row' ? (
            /* Horizontal scrolling row like screenshot */
            <div className="flex gap-4 overflow-x-auto pb-3 pt-1 px-0.5 scrollbar-thin">
              {repos.map(repo => (
                <RepoCard key={repo.repo} repo={repo} />
              ))}
            </div>
          ) : (
            /* Wrapped responsive grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 pt-1">
              {repos.map(repo => (
                <RepoCard key={repo.repo} repo={repo} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
