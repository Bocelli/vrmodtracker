/**
 * GitHub API and Awesome-Flat2VR Synchronization Service
 */

const AWESOME_FLAT2VR_URL = 'https://raw.githubusercontent.com/jrejaud/awesome-flat2vr/main/data/ports.json';
const GITHUB_API_BASE = 'https://api.github.com';

function getHeaders() {
  return {
    'Accept': 'application/vnd.github.v3+json',
  };
}

/**
 * Fetch releases for a specific repository
 */
export async function fetchRepoReleases(repoFullName) {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/repos/${repoFullName}/releases?per_page=5`, {
      headers: getHeaders(),
    });

    if (res.status === 404) {
      // Fallback to tags if releases endpoint returns 404
      return await fetchRepoTags(repoFullName);
    }

    if (!res.ok) {
      throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return await fetchRepoTags(repoFullName);
    }

    return data.map(r => ({
      tag: r.tag_name || r.name,
      name: r.name || r.tag_name,
      date: (r.published_at || r.created_at || '').substring(0, 10),
      url: r.html_url,
      body: r.body || '',
    }));
  } catch (err) {
    console.warn(`Error fetching releases for ${repoFullName}:`, err);
    return null;
  }
}

/**
 * Fallback to tags if repository has no formal releases
 */
async function fetchRepoTags(repoFullName) {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/repos/${repoFullName}/tags?per_page=5`, {
      headers: getHeaders(),
    });
    if (!res.ok) return [];
    const tags = await res.json();
    return tags.map(t => ({
      tag: t.name,
      name: t.name,
      date: new Date().toISOString().substring(0, 10),
      url: `https://github.com/${repoFullName}/releases/tag/${t.name}`,
      body: 'Tag release.',
    }));
  } catch {
    return [];
  }
}

/**
 * Search GitHub for new VR mod repositories
 */
export async function searchGitHubVrRepos(query = 'topic:vr-mod OR topic:uevr OR topic:flat-to-vr') {
  try {
    const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=15`;
    const res = await fetch(url, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.warn('Error searching GitHub:', err);
    return [];
  }
}

/**
 * Clean and parse repository string into owner/repo format
 */
export function extractOwnerAndRepo(input) {
  if (!input) return null;
  const cleaned = input.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/i, '');
  const match = cleaned.match(/^([^/]+)\/([^/#?]+)/);
  if (!match) return null;
  return `${match[1]}/${match[2]}`;
}

/**
 * Fetch raw repository details (for adding custom repo)
 */
export async function fetchRepoInfo(repoInput) {
  const cleanRepo = extractOwnerAndRepo(repoInput);
  if (!cleanRepo) {
    throw new Error("Formato repository non valido. Inserisci un link GitHub valido o 'autore/progetto'.");
  }

  const res = await fetch(`${GITHUB_API_BASE}/repos/${cleanRepo}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Repository '${cleanRepo}' non trovato su GitHub (${res.status})`);
  }
  const repoData = await res.json();
  const releases = await fetchRepoReleases(cleanRepo);

  return {
    repo: repoData.full_name,
    name: repoData.name,
    description: repoData.description || 'Nessuna descrizione disponibile.',
    stars: repoData.stargazers_count,
    githubUrl: repoData.html_url,
    author: repoData.owner.login,
    releases: releases || [],
    updatedAt: repoData.updated_at,
  };
}

/**
 * Fetch latest awesome-flat2vr dataset to catch newly added ports
 */
export async function fetchLatestFlat2vrPorts() {
  try {
    const res = await fetch(AWESOME_FLAT2VR_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Could not fetch awesome-flat2vr ports:', err);
    return null;
  }
}
