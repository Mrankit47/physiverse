/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Search Type System
   Types for the intelligent search engine and filtering.
   ═══════════════════════════════════════════════════════════════ */

import type { PhysicsCategory, DifficultyLevel, VisualizationType } from './visualization';

/* ── Search Query ── */
export interface SearchQuery {
  /** Free-text search string */
  text: string;
  /** Filter by category */
  categories?: PhysicsCategory[];
  /** Filter by difficulty */
  difficulty?: DifficultyLevel[];
  /** Filter by type */
  types?: VisualizationType[];
  /** Filter by tags */
  tags?: string[];
  /** Filter by grade level */
  gradeLevel?: string[];
  /** Filter by scientist */
  scientists?: string[];
  /** Sort field */
  sortBy?: SearchSortField;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Results per page */
  limit?: number;
  /** Page offset */
  offset?: number;
}

export type SearchSortField = 'relevance' | 'title' | 'difficulty' | 'category' | 'popularity';

/* ── Search Result ── */
export interface SearchResult {
  /** Visualization ID */
  id: string;
  /** Relevance score (0-1) */
  score: number;
  /** Matched fields for highlighting */
  matches: SearchMatch[];
}

export interface SearchMatch {
  /** Field name that matched */
  field: string;
  /** Matched text snippet */
  snippet: string;
  /** Start index of match in original text */
  startIndex: number;
  /** Length of match */
  length: number;
}

/* ── Search Index Entry ── */
export interface SearchIndexEntry {
  id: string;
  /** Concatenated searchable text (title + desc + tags + keywords) */
  searchText: string;
  /** Normalized tokens for fuzzy matching */
  tokens: string[];
  /** Category for filtering */
  category: PhysicsCategory;
  /** Difficulty for filtering */
  difficulty: DifficultyLevel;
  /** Type for filtering */
  type: VisualizationType;
  /** Tags for filtering */
  tags: string[];
  /** Grade levels */
  gradeLevel: string[];
  /** Scientists */
  scientists: string[];
}

/* ── Filter State ── */
export interface FilterState {
  categories: PhysicsCategory[];
  difficulties: DifficultyLevel[];
  types: VisualizationType[];
  tags: string[];
  gradeLevel: string[];
  scientists: string[];
}

/* ── Search History ── */
export interface SearchHistoryEntry {
  query: string;
  timestamp: string; // ISO date
  resultCount: number;
}

/* ── Tag with count ── */
export interface TagInfo {
  name: string;
  count: number;
  category?: PhysicsCategory;
}
