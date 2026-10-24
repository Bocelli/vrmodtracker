import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TrackerContext } from './trackerContextInstance';
import seedData from '../data/seedData.json';
import {
  fetchRepoReleases,
  fetchRepoInfo,
  fetchLatestFlat2vrPorts,
  extractOwnerAndRepo
} from '../services/githubService';

const STORAGE_KEYS = {
  SEEN_RELEASES: 'vr_tracker_seen_releases_v1',
  CUSTOM_REPOS: 'vr_tracker_custom_repos_v1',
  FAVORITES: 'vr_tracker_favorites_v1',
  COLLAPSED_CATS: 'vr_tracker_collapsed_cats_v1',
  CACHED_RELEASES: 'vr_tracker_cached_releases_v1',
  LAST_SYNC: 'vr_tracker_last_sync_v1',
};

export function TrackerProvider({ children }) {
  // Load initial states from localStorage with safe fallbacks
  const [seenReleases, setSeenReleases] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEEN_RELEASES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [customRepos, setCustomRepos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_REPOS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [collapsedCats, setCollapsedCats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLLAPSED_CATS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cachedReleases, setCachedReleases] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CACHED_RELEASES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [lastSyncTime, setLastSyncTime] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || null;
  });

  // UI Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [onlyNewReleases, setOnlyNewReleases] = useState(false);
  const [sortMode, setSortMode] = useState('A-Z'); // 'A-Z', 'Z-A', 'RECENT', 'NEW_FIRST', 'STARS'
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeReleaseModal, setActiveReleaseModal] = useState(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEEN_RELEASES, JSON.stringify(seenReleases));
  }, [seenReleases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_REPOS, JSON.stringify(customRepos));
  }, [customRepos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLAPSED_CATS, JSON.stringify(collapsedCats));
  }, [collapsedCats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CACHED_RELEASES, JSON.stringify(cachedReleases));
  }, [cachedReleases]);

  useEffect(() => {
    if (lastSyncTime) {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, lastSyncTime);
    }
  }, [lastSyncTime]);

  // Merge seed data with custom repos and cached releases
  const allRepos = useMemo(() => {
    const map = new Map();

    seedData.forEach(item => {
      const key = item.repo.toLowerCase();
      map.set(key, { ...item });
    });

    customRepos.forEach(item => {
      const key = item.repo.toLowerCase();
      map.set(key, { ...item, isCustom: true });
    });

    // Apply cached releases if available
    const result = Array.from(map.values()).map(repo => {
      const cached = cachedReleases[repo.repo.toLowerCase()];
      const releases = cached && cached.releases ? cached.releases : repo.releases;

      const releasesWithSeen = (releases || []).map(r => {
        const releaseKey = `${repo.repo}:${r.tag}`;
        const isExplicitlySeen = seenReleases[releaseKey] === true;
        const isExplicitlyUnseen = seenReleases[releaseKey] === false;

        let isNew = false;
        if (isExplicitlySeen) {
          isNew = false;
        } else if (isExplicitlyUnseen) {
          isNew = true;
        } else {
          isNew = Boolean(r.isNew);
        }

        return {
          ...r,
          isNew,
          isSeen: !isNew,
        };
      });

      const hasAnyNewRelease = releasesWithSeen.some(r => r.isNew);

      return {
        ...repo,
        releases: releasesWithSeen,
        hasNewRelease: hasAnyNewRelease,
        isFavorite: favorites.includes(repo.repo),
      };
    });

    return result;
  }, [customRepos, cachedReleases, seenReleases, favorites]);

  // Toggle seen status for a specific release
  const toggleReleaseSeen = useCallback((repoKey, tag, currentIsNew) => {
    const releaseKey = `${repoKey}:${tag}`;
    setSeenReleases(prev => {
      let nextState;
      if (typeof currentIsNew === 'boolean') {
        nextState = currentIsNew ? true : false;
      } else {
        nextState = prev[releaseKey] === true ? false : true;
      }
      return {
        ...prev,
        [releaseKey]: nextState,
      };
    });
  }, []);

  // Mark all currently new releases as seen
  const markAllAsSeen = useCallback(() => {
    setSeenReleases(prev => {
      const newSeen = { ...prev };
      allRepos.forEach(repo => {
        repo.releases.forEach(r => {
          const releaseKey = `${repo.repo}:${r.tag}`;
          newSeen[releaseKey] = true;
        });
      });
      return newSeen;
    });
  }, [allRepos]);

  // Toggle favorite
  const toggleFavorite = useCallback((repoKey) => {
    setFavorites(prev => {
      if (prev.includes(repoKey)) {
        return prev.filter(r => r !== repoKey);
      } else {
        return [...prev, repoKey];
      }
    });
  }, []);

  // Toggle category collapse
  const toggleCategoryCollapse = useCallback((catName) => {
    setCollapsedCats(prev => {
      if (prev.includes(catName)) {
        return prev.filter(c => c !== catName);
      } else {
        return [...prev, catName];
      }
    });
  }, []);

  // Add custom repository by user
  const addCustomRepo = useCallback(async (repoFullNameOrUrl, category = 'Custom Added Repos') => {
    setIsSyncing(true);
    try {
      const info = await fetchRepoInfo(repoFullNameOrUrl);
      const newRepo = {
        name: info.name,
        game: info.name,
        repo: info.repo,
        author: info.author,
        category: category,
        platform: 'PCVR',
        status: 'Active',
        stars: info.stars,
        description: info.description,
        githubUrl: info.githubUrl,
        releases: (info.releases || []).map((r, idx) => ({
          ...r,
          isNew: idx === 0,
        })),
        isCustom: true,
      };

      setCustomRepos(prev => {
        const filtered = prev.filter(r => r.repo.toLowerCase() !== info.repo.toLowerCase());
        return [newRepo, ...filtered];
      });

      return { success: true, repo: newRepo };
    } catch (err) {
      console.error('Failed to add repo:', err);
      return { success: false, error: err.message };
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Remove a custom repo
  const removeCustomRepo = useCallback((repoKey) => {
    setCustomRepos(prev => prev.filter(r => r.repo.toLowerCase() !== repoKey.toLowerCase()));
  }, []);

  // Sync a single repository with GitHub
  const syncSingleRepo = useCallback(async (repoFullName) => {
    try {
      const releases = await fetchRepoReleases(repoFullName);
      if (releases && releases.length > 0) {
        setCachedReleases(prev => ({
          ...prev,
          [repoFullName.toLowerCase()]: {
            releases: releases.map((r, i) => ({
              ...r,
              isNew: i === 0 && !seenReleases[`${repoFullName}:${r.tag}`],
            })),
            cachedAt: new Date().toISOString(),
          },
        }));
        return true;
      }
    } catch (err) {
      console.warn('Sync single repo error:', err);
    }
    return false;
  }, [seenReleases]);

  // Full Sync: checks awesome-flat2vr for brand new ports
  const syncAll = useCallback(async () => {
    setIsSyncing(true);
    try {
      const latestPorts = await fetchLatestFlat2vrPorts();
      if (latestPorts && Array.isArray(latestPorts)) {
        const existingRepos = new Set(allRepos.map(r => r.repo.toLowerCase()));
        const newDiscovered = [];

        for (const port of latestPorts) {
          const url = port.source_url || port.download_url || '';
          const fullRepo = extractOwnerAndRepo(url);
          if (!fullRepo) continue;
          if (!existingRepos.has(fullRepo.toLowerCase())) {
            newDiscovered.push({
              name: port.name,
              game: port.games?.[0] || port.name,
              repo: fullRepo,
              author: port.authors?.[0]?.name || fullRepo.split('/')[0],
              category: 'Newly Discovered VR Mods',
              platform: port.platform ? port.platform.toUpperCase() : 'PCVR',
              status: port.status || 'Active',
              stars: 50,
              description: port.notes || `${port.name} VR Mod.`,
              releases: [
                {
                  tag: port.version || 'v1.0.0',
                  name: `${port.name} ${port.version || 'v1.0.0'}`,
                  date: port.version_date || new Date().toISOString().substring(0, 10),
                  isNew: true,
                  url: `https://github.com/${fullRepo}/releases`,
                }
              ],
              githubUrl: `https://github.com/${fullRepo}`,
              isCustom: true,
            });
          }
        }

        if (newDiscovered.length > 0) {
          setCustomRepos(prev => [...newDiscovered, ...prev]);
        }
      }

      const topRepos = allRepos.slice(0, 5);
      for (const item of topRepos) {
        await syncSingleRepo(item.repo);
      }

      const now = new Date().toLocaleString();
      setLastSyncTime(now);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [allRepos, syncSingleRepo]);

  // Export / Import
  const exportTrackerData = useCallback(() => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      seenReleases,
      customRepos,
      favorites,
      collapsedCats,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vr-mods-tracker-backup-${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [seenReleases, customRepos, favorites, collapsedCats]);

  const importTrackerData = useCallback((jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (parsed.seenReleases) setSeenReleases(parsed.seenReleases);
      if (parsed.customRepos) setCustomRepos(parsed.customRepos);
      if (parsed.favorites) setFavorites(parsed.favorites);
      if (parsed.collapsedCats) setCollapsedCats(parsed.collapsedCats);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setSeenReleases({});
    setCustomRepos([]);
    setFavorites([]);
    setCollapsedCats([]);
    setCachedReleases({});
    localStorage.clear();
  }, []);

  // Filtered and sorted list
  const filteredRepos = useMemo(() => {
    let list = [...allRepos];

    if (selectedCategory === 'FAVORITES') {
      list = list.filter(r => r.isFavorite);
    } else if (selectedCategory !== 'ALL') {
      list = list.filter(r => r.category === selectedCategory);
    }

    if (onlyNewReleases) {
      list = list.filter(r => r.hasNewRelease);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.game.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.repo.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortMode === 'A-Z') return a.name.localeCompare(b.name);
      if (sortMode === 'Z-A') return b.name.localeCompare(a.name);
      if (sortMode === 'STARS') return (b.stars || 0) - (a.stars || 0);
      if (sortMode === 'NEW_FIRST') {
        if (a.hasNewRelease && !b.hasNewRelease) return -1;
        if (!a.hasNewRelease && b.hasNewRelease) return 1;
        return a.name.localeCompare(b.name);
      }
      if (sortMode === 'RECENT') {
        const dateA = a.releases?.[0]?.date || '1970-01-01';
        const dateB = b.releases?.[0]?.date || '1970-01-01';
        return dateB.localeCompare(dateA);
      }
      return 0;
    });

    return list;
  }, [allRepos, selectedCategory, onlyNewReleases, searchQuery, sortMode]);

  // Group filtered repos by category
  const categoriesGrouped = useMemo(() => {
    const groups = {};
    filteredRepos.forEach(repo => {
      const cat = repo.category || 'Altro';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(repo);
    });
    return groups;
  }, [filteredRepos]);

  const stats = useMemo(() => {
    const totalRepos = allRepos.length;
    const newReleasesCount = allRepos.filter(r => r.hasNewRelease).length;
    const totalReleases = allRepos.reduce((acc, r) => acc + (r.releases?.length || 0), 0);
    return {
      totalRepos,
      newReleasesCount,
      totalReleases,
    };
  }, [allRepos]);

  const value = {
    repos: allRepos,
    filteredRepos,
    categoriesGrouped,
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
    collapsedCats,
    activeReleaseModal,
    setActiveReleaseModal,
    toggleReleaseSeen,
    markAllAsSeen,
    toggleFavorite,
    toggleCategoryCollapse,
    addCustomRepo,
    removeCustomRepo,
    syncSingleRepo,
    syncAll,
    exportTrackerData,
    importTrackerData,
    resetToDefaults,
  };

  return (
    <TrackerContext.Provider value={value}>
      {children}
    </TrackerContext.Provider>
  );
}
