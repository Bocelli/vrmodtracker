import React from 'react';
import {
  X,
  ExternalLink,
  Calendar,
  Tag,
  Eye,
  Sparkles
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import { useTracker } from '../context/useTracker';

function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return '--/--/----';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
}

export default function ReleaseDetailsModal() {
  const { activeReleaseModal, setActiveReleaseModal, toggleReleaseSeen } = useTracker();

  if (!activeReleaseModal) return null;

  const { repo, release } = activeReleaseModal;
  const isNew = release?.isNew;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#171822] border border-zinc-700/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Close button */}
        <button
          onClick={() => setActiveReleaseModal(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-4 shrink-0 pr-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800/40">
                {repo.platform || 'PCVR'}
              </span>
              <span className="text-xs text-zinc-400">per {repo.game || repo.name}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1 leading-snug">
              {repo.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
              <span>Autore: <strong className="text-purple-300">{repo.author}</strong></span>
              <span>•</span>
              <a
                href={repo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
              >
                <span>{repo.repo}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Release Metadata Card */}
        {release && (
          <div className="p-3.5 rounded-xl bg-[#12131a] border border-zinc-800 mb-4 shrink-0 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/50">
                <Tag className="w-3.5 h-3.5" />
                <span>{release.tag}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{formatDateDDMMYYYY(release.date)}</span>
              </div>
            </div>

            {/* Visto Toggle inside Modal */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleReleaseSeen(repo.repo, release.tag, isNew)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  isNew
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-purple-900/30 text-purple-300 border border-purple-800/30 hover:bg-purple-900/50'
                }`}
              >
                {isNew ? (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Segna come Visto</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 text-purple-300" />
                    <span>Segna come Non Visto</span>
                  </>
                )}
              </button>

              {release.url && (
                <a
                  href={release.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-3 h-3" />
                  <span>Release GitHub</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Release Notes / Description Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
          {/* Notes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Descrizione & Dettagli del Port
            </h4>
            <div className="p-3.5 rounded-xl bg-[#12131a] border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
              {repo.description || 'Nessuna informazione aggiuntiva fornita.'}
            </div>
          </div>

          {/* Release Changelog Body if exists */}
          {release?.body && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Changelog Release ({release.tag})
              </h4>
              <div className="p-3.5 rounded-xl bg-[#12131a] border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap max-h-56 overflow-y-auto scrollbar-thin">
                {release.body}
              </div>
            </div>
          )}

          {/* All other releases list for this repo */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Tutte le Release Registrate ({repo.releases?.length || 0})
            </h4>
            <div className="space-y-1.5">
              {(repo.releases || []).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#12131a] border border-zinc-800 text-xs"
                >
                  <span className="font-mono text-emerald-400 font-semibold">{r.tag}</span>
                  <span className="text-zinc-500 font-mono text-[11px]">{formatDateDDMMYYYY(r.date)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleReleaseSeen(repo.repo, r.tag)}
                      className="text-[11px] text-purple-300 hover:underline"
                    >
                      {r.isNew ? 'Segna visto' : 'Visto'}
                    </button>
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-white transition-colors"
                        title="Apri pagina release ufficiale"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <span className="font-mono text-[11px]">ID: {repo.repo}</span>
          <button
            onClick={() => setActiveReleaseModal(null)}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
