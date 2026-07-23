'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Search Store
   State management for the search UI and filter state.
   ═══════════════════════════════════════════════════════════════ */

import { create } from 'zustand';
import type { PhysicsCategory, DifficultyLevel, VisualizationType } from '@/types';
import type { SearchHistoryEntry } from '@/types/search';

export interface SearchStoreState {
  /* ── Query ── */
  query: string;
  isSearching: boolean;
  resultIds: string[];
  totalResults: number;

  /* ── Filters ── */
  selectedCategories: PhysicsCategory[];
  selectedDifficulties: DifficultyLevel[];
  selectedTypes: VisualizationType[];
  selectedTags: string[];
  selectedGradeLevel: string[];
  selectedScientists: string[];

  /* ── History ── */
  searchHistory: SearchHistoryEntry[];

  /* ── UI ── */
  isFilterPanelOpen: boolean;

  /* ── Actions ── */
  setQuery: (query: string) => void;
  setSearching: (searching: boolean) => void;
  setResults: (ids: string[], total: number) => void;

  toggleCategory: (category: PhysicsCategory) => void;
  toggleDifficulty: (difficulty: DifficultyLevel) => void;
  toggleType: (type: VisualizationType) => void;
  toggleTag: (tag: string) => void;
  toggleGradeLevel: (grade: string) => void;
  toggleScientist: (scientist: string) => void;

  clearFilters: () => void;
  clearAll: () => void;

  addToHistory: (entry: SearchHistoryEntry) => void;
  clearHistory: () => void;

  toggleFilterPanel: () => void;
}

function toggleInArray<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

const MAX_HISTORY = 20;

export const useSearchStore = create<SearchStoreState>((set, get) => ({
  query: '',
  isSearching: false,
  resultIds: [],
  totalResults: 0,
  selectedCategories: [],
  selectedDifficulties: [],
  selectedTypes: [],
  selectedTags: [],
  selectedGradeLevel: [],
  selectedScientists: [],
  searchHistory: [],
  isFilterPanelOpen: false,

  setQuery: (query) => set({ query }),
  setSearching: (searching) => set({ isSearching: searching }),
  setResults: (ids, total) => set({ resultIds: ids, totalResults: total, isSearching: false }),

  toggleCategory: (category) =>
    set({ selectedCategories: toggleInArray(get().selectedCategories, category) }),
  toggleDifficulty: (difficulty) =>
    set({ selectedDifficulties: toggleInArray(get().selectedDifficulties, difficulty) }),
  toggleType: (type) =>
    set({ selectedTypes: toggleInArray(get().selectedTypes, type) }),
  toggleTag: (tag) =>
    set({ selectedTags: toggleInArray(get().selectedTags, tag) }),
  toggleGradeLevel: (grade) =>
    set({ selectedGradeLevel: toggleInArray(get().selectedGradeLevel, grade) }),
  toggleScientist: (scientist) =>
    set({ selectedScientists: toggleInArray(get().selectedScientists, scientist) }),

  clearFilters: () =>
    set({
      selectedCategories: [],
      selectedDifficulties: [],
      selectedTypes: [],
      selectedTags: [],
      selectedGradeLevel: [],
      selectedScientists: [],
    }),

  clearAll: () =>
    set({
      query: '',
      resultIds: [],
      totalResults: 0,
      selectedCategories: [],
      selectedDifficulties: [],
      selectedTypes: [],
      selectedTags: [],
      selectedGradeLevel: [],
      selectedScientists: [],
    }),

  addToHistory: (entry) => {
    const { searchHistory } = get();
    const updated = [entry, ...searchHistory.filter((h) => h.query !== entry.query)].slice(
      0,
      MAX_HISTORY
    );
    set({ searchHistory: updated });
  },

  clearHistory: () => set({ searchHistory: [] }),

  toggleFilterPanel: () => set({ isFilterPanelOpen: !get().isFilterPanelOpen }),
}));
