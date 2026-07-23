/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Search Engine
   Client-side full-text search with fuzzy matching across all
   registered visualization metadata.
   ═══════════════════════════════════════════════════════════════ */

import type { SearchQuery, SearchResult, SearchMatch, SearchIndexEntry } from '@/types';
import type { VisualizationPlugin } from '@/types';

/** Normalize text for search: lowercase, remove diacritics, collapse whitespace */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokenize text into searchable tokens */
function tokenize(text: string): string[] {
  return normalize(text).split(' ').filter(Boolean);
}

/** Simple fuzzy match score (0-1) between two strings */
function fuzzyScore(query: string, target: string): number {
  const q = normalize(query);
  const t = normalize(target);

  // Exact match
  if (t === q) return 1;
  if (t.includes(q)) return 0.9;
  if (t.startsWith(q)) return 0.95;

  // Token-level matching
  const queryTokens = tokenize(q);
  const targetTokens = tokenize(t);

  if (queryTokens.length === 0) return 0;

  let matched = 0;
  for (const qt of queryTokens) {
    for (const tt of targetTokens) {
      if (tt.includes(qt) || qt.includes(tt)) {
        matched++;
        break;
      }
      // Levenshtein distance for fuzzy matching (only for short tokens)
      if (qt.length >= 3 && tt.length >= 3) {
        const dist = levenshteinDistance(qt, tt);
        if (dist <= Math.floor(qt.length / 3)) {
          matched += 0.5;
          break;
        }
      }
    }
  }

  return matched / queryTokens.length;
}

/** Levenshtein distance between two strings */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

export class SearchEngine {
  private index: SearchIndexEntry[] = [];

  /** Build the search index from visualization plugins */
  buildIndex(plugins: VisualizationPlugin[]): void {
    this.index = plugins.map((plugin) => {
      const m = plugin.metadata;
      const searchableFields = [
        m.title,
        m.description,
        m.category,
        m.subcategory || '',
        ...m.tags,
        ...m.searchKeywords,
        ...m.learningObjectives,
        ...(m.scientists || []),
        ...(m.gradeLevel || []),
      ];

      // Include formula names if available
      if (plugin.formulas) {
        for (const f of plugin.formulas) {
          searchableFields.push(f.name, f.plainText, f.description);
        }
      }

      const searchText = searchableFields.join(' ');

      return {
        id: m.id,
        searchText,
        tokens: tokenize(searchText),
        category: m.category,
        difficulty: m.difficulty,
        type: m.type,
        tags: m.tags.map((t) => t.toLowerCase()),
        gradeLevel: m.gradeLevel || [],
        scientists: (m.scientists || []).map((s) => s.toLowerCase()),
      };
    });
  }

  /** Search with a query object */
  search(query: SearchQuery): SearchResult[] {
    let results: { entry: SearchIndexEntry; score: number; matches: SearchMatch[] }[] = [];

    for (const entry of this.index) {
      // Apply filters first
      if (query.categories && query.categories.length > 0) {
        if (!query.categories.includes(entry.category)) continue;
      }
      if (query.difficulty && query.difficulty.length > 0) {
        if (!query.difficulty.includes(entry.difficulty)) continue;
      }
      if (query.types && query.types.length > 0) {
        if (!query.types.includes(entry.type)) continue;
      }
      if (query.tags && query.tags.length > 0) {
        const entryTags = entry.tags;
        if (!query.tags.some((t) => entryTags.includes(t.toLowerCase()))) continue;
      }
      if (query.gradeLevel && query.gradeLevel.length > 0) {
        if (!query.gradeLevel.some((g) => entry.gradeLevel.includes(g))) continue;
      }
      if (query.scientists && query.scientists.length > 0) {
        if (!query.scientists.some((s) => entry.scientists.includes(s.toLowerCase()))) continue;
      }

      // Text search
      if (query.text && query.text.trim()) {
        const score = fuzzyScore(query.text, entry.searchText);
        if (score > 0.1) {
          const matches: SearchMatch[] = [];
          const normalizedQuery = normalize(query.text);

          // Find matching snippets
          const lowerText = entry.searchText.toLowerCase();
          const idx = lowerText.indexOf(normalizedQuery);
          if (idx >= 0) {
            matches.push({
              field: 'searchText',
              snippet: entry.searchText.substring(
                Math.max(0, idx - 20),
                Math.min(entry.searchText.length, idx + normalizedQuery.length + 20)
              ),
              startIndex: idx,
              length: normalizedQuery.length,
            });
          }

          results.push({ entry, score, matches });
        }
      } else {
        // No text query, all filtered entries pass with score 1
        results.push({ entry, score: 1, matches: [] });
      }
    }

    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score);

    // Apply pagination
    const offset = query.offset ?? 0;
    const limit = query.limit ?? 50;
    results = results.slice(offset, offset + limit);

    return results.map(({ entry, score, matches }) => ({
      id: entry.id,
      score,
      matches,
    }));
  }

  /** Quick search by text only (convenience method) */
  quickSearch(text: string): SearchResult[] {
    return this.search({ text });
  }

  /** Get index size */
  get size(): number {
    return this.index.length;
  }
}

/** Singleton search engine instance */
let searchEngineInstance: SearchEngine | null = null;

export function getSearchEngine(): SearchEngine {
  if (!searchEngineInstance) {
    searchEngineInstance = new SearchEngine();
  }
  return searchEngineInstance;
}
