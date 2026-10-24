import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Compass,
  Search,
  Star,
  Plus,
  Check,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { searchGitHubVrRepos } from '../services/githubService';
import { useTracker } from '../context/useTracker';

export default function GitHubExplorerModal({ isOpen, onClose }) {
  const { repos, addCustomRepo } = useTracker();
  const [query, setQuery] = useState('topic:vr-mod OR topic:uevr OR topic:flat-to-vr');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingRepo, setAddingRepo] = useState(null);

  const presets = [
    { label: '🔥 Topic: vr-mod', q: 'topic:vr-mod' },
    { label: '🎮 Topic: uevr', q: 'topic:uevr OR uevr profile' },
    { label: '🕶️ Flat to VR', q: 'flat2vr OR "flat to vr"' },
    { label: '⚡ Recenti VR Mod', q: 'uevr OR flat2vr OR vr-mod' },
    { label: '🕹️ BepInEx VR', q: 'bepinex vr mod' },
  ];

  // Perform search
  const handleSearch = useCallback(async (searchQuery) => {
    setLoading(true);
    const targetQuery = searchQuery || query;
    const items = await searchGitHubVrRepos(targetQuery);
    setResults(items);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && results.length === 0) {
      searchGitHubVrRepos('topic:vr-mod OR topic:uevr OR topic:flat-to-vr')
        .then(items => {
          if (isMounted) {
            setResults(items);
            setLoading(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, results.length]);

  if (!isOpen) return null;

  // Set of already tracked repos for quick badge check
  const trackedRepos = new Set(repos.map(r => r.repo.toLowerCase()));

  const handleAdd = async (item) => {
    setAddingRepo(item.full_name);
    await addCustomRepo(item.full_name, 'Newly Discovered VR Mods');
    setAddingRepo(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-[#171821] border border-zinc-700/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">GitHub VR Explorer</h2>
            <p className="text-xs text-zinc-400">
              Scopri in tempo reale repository e mod VR appena nati o aggiornati su GitHub
            </p>
          </div>
        </div>

        {/* Search Input & Preset Pills */}
        <div className="space-y-2.5 mb-4 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca su GitHub (es. topic:vr-mod, 'game name vr')..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111218] border border-zinc-700 focus:border-emerald-500 focus:outline-none text-xs sm:text-sm text-white placeholder-zinc-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-black shadow-md transition-all shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Cerca'}
            </button>
          </form>

          {/* Preset query buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {presets.map((p) => (
              <button
                key={p.q}
                onClick={() => {
                  setQuery(p.q);
                  handleSearch(p.q);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  query === p.q
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-semibold'
                    : 'bg-zinc-800/60 border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400 text-xs gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-400" />
              <span>Ricerca repository su GitHub in corso...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              Nessun repository trovato per questa ricerca.
            </div>
          ) : (
            results.map((item) => {
              const isAlreadyTracked = trackedRepos.has(item.full_name.toLowerCase());
              const isAdding = addingRepo === item.full_name;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#121319] border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate" title={item.full_name}>
                        {item.full_name}
                      </h4>
                      <a
                        href={item.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
                        title="Apri su GitHub"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description || 'Nessuna descrizione specificata.'}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-500 font-mono">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        {item.stargazers_count}
                      </span>
                      <span>Aggiornato: {new Date(item.updated_at).toLocaleDateString()}</span>
                      {item.language && <span className="text-purple-400">{item.language}</span>}
                    </div>
                  </div>

                  {/* Add / Already Added button */}
                  <div className="shrink-0 self-end sm:self-center">
                    {isAlreadyTracked ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 text-emerald-400 text-xs font-semibold border border-zinc-700">
                        <Check className="w-3.5 h-3.5" />
                        <span>Già tracciato</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAdd(item)}
                        disabled={isAdding}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-black transition-all shadow-md shadow-emerald-950"
                      >
                        {isAdding ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                        <span>Aggiungi al Tracker</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
