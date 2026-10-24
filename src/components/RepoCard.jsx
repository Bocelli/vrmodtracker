import React, { useState } from 'react';
import {
  ExternalLink,
  Star,
  FileText,
  RefreshCw,
  Trash2,
  Eye,
  Sparkles
} from 'lucide-react';
import { useTracker } from '../context/useTracker';

// Helper to format ISO date to DD/MM/YYYY like the screenshot
function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return '--/--/----';
  // Check if already in DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export default function RepoCard({ repo }) {
  const {
    toggleReleaseSeen,
    toggleFavorite,
    removeCustomRepo,
    syncSingleRepo,
    setActiveReleaseModal,
  } = useTracker();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async (e) => {
    e.stopPropagation();
    setIsRefreshing(true);
    await syncSingleRepo(repo.repo);
    setIsRefreshing(false);
  };

  const hasNew = repo.hasNewRelease;
  const displayedReleases = (repo.releases || []).slice(0, 3);
  const totalReleasesCount = repo.releases ? repo.releases.length : 0;

  // Format short repo URL for display
  const shortUrl = repo.githubUrl 
    ? repo.githubUrl.replace(/^https?:\/\//, '')
    : `github.com/${repo.repo}`;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl p-4 transition-all duration-300 ${
        hasNew
          ? 'bg-[#1b1e24] border-2 border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.35)] card-new-glow ring-1 ring-emerald-500/50'
          : 'bg-[#181920] border border-[#2b2d38] hover:border-[#414557] hover:bg-[#1c1d26]'
      }`}
      style={{ minWidth: '290px', maxWidth: '350px', flex: '1 1 310px' }}
    >
      {/* Top Header Section */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          {/* Title and brackets */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white tracking-tight truncate leading-snug" title={repo.game || repo.name}>
              {repo.game || repo.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs">
              <span className="font-semibold text-sky-400">
                [{repo.platform || 'PCVR'}]
              </span>
              <span className="text-purple-300 font-medium truncate max-w-[130px]" title={repo.author}>
                [{repo.author}]
              </span>
            </div>
          </div>

          {/* Right badges & actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {hasNew ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-extrabold uppercase rounded-full bg-[#22c55e] text-black shadow-sm tracking-wide animate-pulse">
                📢 NEW!
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded bg-sky-600/30 text-sky-300 border border-sky-500/30">
                OK
              </span>
            )}

            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(repo.repo)}
              className={`p-1 rounded transition-colors ${
                repo.isFavorite ? 'text-amber-400 hover:text-amber-300' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title={repo.isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Direct GitHub Link */}
            <a
              href={repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
              title="Apri su GitHub"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Truncated Monospace GitHub URL */}
        <div className="mb-2">
          <a
            href={repo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-zinc-400 hover:text-sky-300 truncate block transition-colors"
            title={repo.githubUrl}
          >
            {shortUrl}
          </a>
        </div>

        {/* Subtitle Game Name & Releases counter */}
        <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 pb-2 mb-2.5">
          <span className="truncate pr-2 text-zinc-300 font-medium" title={repo.name}>
            {repo.name}
          </span>
          <span className="shrink-0 text-[11px] text-zinc-400 font-mono">
            {totalReleasesCount} {totalReleasesCount === 1 ? 'release' : 'releases'}
          </span>
        </div>

        {/* Releases List Table */}
        <div className="space-y-1.5">
          {displayedReleases.length === 0 ? (
            <div className="text-xs text-zinc-500 italic py-2 text-center">
              Nessuna release registrata
            </div>
          ) : (
            displayedReleases.map((rel, idx) => {
              const formattedDate = formatDateDDMMYYYY(rel.date);
              const isNew = rel.isNew;

              return (
                <div
                  key={`${repo.repo}-${rel.tag}-${idx}`}
                  className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                    isNew
                      ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                      : 'bg-zinc-900/50 hover:bg-zinc-800/60 text-zinc-300'
                  }`}
                >
                  {/* Version Tag */}
                  <div className="flex items-center gap-1.5 font-mono font-medium truncate max-w-[95px]">
                    <span
                      className={`truncate ${
                        isNew ? 'text-emerald-400 font-bold' : 'text-emerald-500/90'
                      }`}
                      title={rel.tag}
                    >
                      {rel.tag}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="text-[11px] text-zinc-400 font-mono px-1">
                    {formattedDate}
                  </div>

                  {/* Visto / NEW! Action Button */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleReleaseSeen(repo.repo, rel.tag, isNew)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                        isNew
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 hover:text-purple-200'
                      }`}
                      title={isNew ? 'Clicca per segnare come Visto' : 'Clicca per segnare come Non Visto'}
                    >
                      {isNew ? (
                        <>
                          <span>+</span>
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          <span>NEW!</span>
                        </>
                      ) : (
                        <>
                          <span>+</span>
                          <Eye className="w-2.5 h-2.5 text-purple-300" />
                          <span>Visto</span>
                        </>
                      )}
                    </button>

                    {/* Official Release Page Link */}
                    {rel.url && (
                      <a
                        href={rel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded text-zinc-400 hover:text-sky-300 hover:bg-zinc-800 transition-colors"
                        title="Apri release ufficiale su GitHub"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <button
          onClick={() => setActiveReleaseModal({ repo, release: repo.releases?.[0] })}
          className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
          title="Visualizza dettagli e note di rilascio"
        >
          <FileText className="w-3 h-3" />
          <span>Note & Info</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-1 rounded hover:text-sky-300 transition-colors ${
              isRefreshing ? 'animate-spin text-sky-400' : 'text-zinc-500'
            }`}
            title="Aggiorna release da GitHub"
          >
            <RefreshCw className="w-3 h-3" />
          </button>

          {repo.isCustom && (
            <button
              onClick={() => removeCustomRepo(repo.repo)}
              className="p-1 rounded text-zinc-500 hover:text-rose-400 transition-colors"
              title="Rimuovi questo repository dal tracker"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
