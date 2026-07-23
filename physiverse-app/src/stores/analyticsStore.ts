'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Analytics Store
   Tracks user engagement metrics. Persisted to localStorage.
   ═══════════════════════════════════════════════════════════════ */

import { create } from 'zustand';
import type { QuizResult, LearningProgress } from '@/types/content';

const STORAGE_KEY = 'physiverse-analytics';

interface AnalyticsData {
  /** View counts per visualization */
  viewCounts: Record<string, number>;
  /** Total time spent per visualization (seconds) */
  timeSpent: Record<string, number>;
  /** Quiz results per visualization */
  quizResults: Record<string, QuizResult[]>;
  /** Learning progress per visualization */
  progress: Record<string, LearningProgress>;
  /** Global stats */
  totalViews: number;
  totalTimeSpent: number;
  /** Timestamps */
  firstVisit: string;
  lastVisit: string;
}

function loadAnalytics(): AnalyticsData {
  if (typeof window === 'undefined') return createEmptyAnalytics();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : createEmptyAnalytics();
  } catch {
    return createEmptyAnalytics();
  }
}

function createEmptyAnalytics(): AnalyticsData {
  return {
    viewCounts: {},
    timeSpent: {},
    quizResults: {},
    progress: {},
    totalViews: 0,
    totalTimeSpent: 0,
    firstVisit: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
  };
}

function saveAnalytics(data: AnalyticsData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('[Physiverse] Failed to save analytics');
  }
}

export interface AnalyticsStoreState extends AnalyticsData {
  /* ── Actions ── */
  trackView: (visualizationId: string) => void;
  trackTime: (visualizationId: string, seconds: number) => void;
  trackQuizResult: (result: QuizResult) => void;
  updateProgress: (visualizationId: string, progress: Partial<LearningProgress>) => void;
  getMostViewed: (limit?: number) => { id: string; count: number }[];
  getCompletionRate: (visualizationId: string) => number;
  hydrate: () => void;
  resetAnalytics: () => void;
}

export const useAnalyticsStore = create<AnalyticsStoreState>((set, get) => ({
  ...createEmptyAnalytics(),

  trackView: (visualizationId) => {
    const state = get();
    const viewCounts = {
      ...state.viewCounts,
      [visualizationId]: (state.viewCounts[visualizationId] || 0) + 1,
    };
    const updated = {
      viewCounts,
      totalViews: state.totalViews + 1,
      lastVisit: new Date().toISOString(),
    };
    set(updated);
    saveAnalytics({ ...state, ...updated });
  },

  trackTime: (visualizationId, seconds) => {
    const state = get();
    const timeSpent = {
      ...state.timeSpent,
      [visualizationId]: (state.timeSpent[visualizationId] || 0) + seconds,
    };
    const updated = {
      timeSpent,
      totalTimeSpent: state.totalTimeSpent + seconds,
    };
    set(updated);
    saveAnalytics({ ...state, ...updated });
  },

  trackQuizResult: (result) => {
    const state = get();
    const existing = state.quizResults[result.visualizationId] || [];
    const quizResults = {
      ...state.quizResults,
      [result.visualizationId]: [...existing, result],
    };
    set({ quizResults });
    saveAnalytics({ ...state, quizResults });
  },

  updateProgress: (visualizationId, progress) => {
    const state = get();
    const existing = state.progress[visualizationId] || {
      visualizationId,
      completedObjectives: [],
      quizResults: [],
      timeSpent: 0,
      lastVisited: new Date().toISOString(),
      completionPercentage: 0,
      bookmarked: false,
    };
    const updated = {
      ...state.progress,
      [visualizationId]: { ...existing, ...progress, lastVisited: new Date().toISOString() },
    };
    set({ progress: updated });
    saveAnalytics({ ...state, progress: updated });
  },

  getMostViewed: (limit = 10) => {
    const { viewCounts } = get();
    return Object.entries(viewCounts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  getCompletionRate: (visualizationId) => {
    const progress = get().progress[visualizationId];
    return progress?.completionPercentage ?? 0;
  },

  hydrate: () => {
    set(loadAnalytics());
  },

  resetAnalytics: () => {
    const empty = createEmptyAnalytics();
    set(empty);
    saveAnalytics(empty);
  },
}));
