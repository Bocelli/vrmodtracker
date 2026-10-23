import React, { useState } from 'react';
import { X, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import GithubIcon from './GithubIcon';
import { useTracker } from '../context/useTracker';

export default function AddRepoModal({ isOpen, onClose }) {
  const { addCustomRepo } = useTracker();
  const [repoInput, setRepoInput] = useState('');
  const [category, setCategory] = useState('Universal Frameworks & Injectors');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Universal Frameworks & Injectors',
    'AAA & Action / RPG VR Mods',
    'Source & Classic Engine Ports',
    'Indie & Adventure VR Mods',
    'Standalone (Meta Quest / Android) Ports',
    'UEVR Profiles & Game Fixes',
    'Simulators, Guida & Sport',
    'Custom Added Repos',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repoInput.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    const res = await addCustomRepo(repoInput.trim(), category);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setRepoInput('');
        setSuccess(false);
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Impossibile trovare o aggiungere il repository.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#181922] border border-zinc-700/80 rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <GithubIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Aggiungi Repository VR Mod</h2>
            <p className="text-xs text-zinc-400">
              Inserisci l'URL o il percorso <code className="text-sky-300">autore/repo</code> di GitHub
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Repo Input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Repository GitHub (URL o owner/repo)
            </label>
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="es. praydog/UEVR o https://github.com/SourceVR/hl2vr"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12131a] border border-zinc-700 focus:border-purple-500 focus:outline-none text-sm text-white placeholder-zinc-500"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Categoria di appartenenza
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12131a] border border-zinc-700 focus:border-purple-500 focus:outline-none text-sm text-white cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Error & Success States */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Repository aggiunto e sincronizzato con successo!</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading || !repoInput.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-purple-900/40 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifica GitHub...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Aggiungi al Tracker</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
