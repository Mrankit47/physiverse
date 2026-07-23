'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Visualization Store
   Global state for the active visualization, mode, and UI.
   ═══════════════════════════════════════════════════════════════ */

import { create } from 'zustand';

export type VisualizationMode = 'explore' | 'learn' | 'quiz' | 'compare';
export type SidebarPanel = 'info' | 'theory' | 'formulas' | 'quiz' | 'settings' | null;

export interface VisualizationStoreState {
  /* ── Active Visualization ── */
  activeVisualizationId: string | null;
  mode: VisualizationMode;
  isLoading: boolean;
  isReady: boolean;

  /* ── UI State ── */
  sidebarPanel: SidebarPanel;
  isSidebarOpen: boolean;
  showHotspots: boolean;
  showGrid: boolean;
  showStats: boolean; // FPS counter
  isFullscreen: boolean;

  /* ── Learning Mode ── */
  learningStep: number;
  totalLearningSteps: number;
  completedObjectives: number[];

  /* ── Compare Mode ── */
  compareVisualizationId: string | null;

  /* ── Actions ── */
  setActiveVisualization: (id: string | null) => void;
  setMode: (mode: VisualizationMode) => void;
  setLoading: (loading: boolean) => void;
  setReady: (ready: boolean) => void;

  setSidebarPanel: (panel: SidebarPanel) => void;
  toggleSidebar: () => void;
  toggleHotspots: () => void;
  toggleGrid: () => void;
  toggleStats: () => void;
  toggleFullscreen: () => void;

  setLearningStep: (step: number) => void;
  setTotalLearningSteps: (total: number) => void;
  completeObjective: (index: number) => void;
  nextLearningStep: () => void;
  prevLearningStep: () => void;

  setCompareVisualization: (id: string | null) => void;

  reset: () => void;
}

const initialState = {
  activeVisualizationId: null,
  mode: 'explore' as VisualizationMode,
  isLoading: false,
  isReady: false,
  sidebarPanel: null as SidebarPanel,
  isSidebarOpen: false,
  showHotspots: true,
  showGrid: false,
  showStats: false,
  isFullscreen: false,
  learningStep: 0,
  totalLearningSteps: 0,
  completedObjectives: [] as number[],
  compareVisualizationId: null,
};

export const useVisualizationStore = create<VisualizationStoreState>((set, get) => ({
  ...initialState,

  setActiveVisualization: (id) =>
    set({
      activeVisualizationId: id,
      isLoading: true,
      isReady: false,
      learningStep: 0,
      completedObjectives: [],
    }),

  setMode: (mode) => set({ mode }),
  setLoading: (loading) => set({ isLoading: loading }),
  setReady: (ready) => set({ isReady: ready, isLoading: false }),

  setSidebarPanel: (panel) =>
    set({
      sidebarPanel: panel,
      isSidebarOpen: panel !== null,
    }),

  toggleSidebar: () => {
    const { isSidebarOpen, sidebarPanel } = get();
    if (isSidebarOpen) {
      set({ isSidebarOpen: false, sidebarPanel: null });
    } else {
      set({ isSidebarOpen: true, sidebarPanel: sidebarPanel ?? 'info' });
    }
  },

  toggleHotspots: () => set({ showHotspots: !get().showHotspots }),
  toggleGrid: () => set({ showGrid: !get().showGrid }),
  toggleStats: () => set({ showStats: !get().showStats }),
  toggleFullscreen: () => set({ isFullscreen: !get().isFullscreen }),

  setLearningStep: (step) => set({ learningStep: step }),
  setTotalLearningSteps: (total) => set({ totalLearningSteps: total }),

  completeObjective: (index) => {
    const { completedObjectives } = get();
    if (!completedObjectives.includes(index)) {
      set({ completedObjectives: [...completedObjectives, index] });
    }
  },

  nextLearningStep: () => {
    const { learningStep, totalLearningSteps } = get();
    if (learningStep < totalLearningSteps - 1) {
      set({ learningStep: learningStep + 1 });
    }
  },

  prevLearningStep: () => {
    const { learningStep } = get();
    if (learningStep > 0) {
      set({ learningStep: learningStep - 1 });
    }
  },

  setCompareVisualization: (id) => set({ compareVisualizationId: id }),

  reset: () => set(initialState),
}));
