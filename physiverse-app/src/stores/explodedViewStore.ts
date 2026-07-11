'use client';

import { create } from 'zustand';

export interface ExplodedViewState {
  /* ── Core State ── */
  isExploded: boolean;
  activeComponent: string | null;
  hoveredComponent: string | null;

  /* ── Learning Mode ── */
  learningMode: boolean;
  learningStep: number;
  totalSteps: number;

  /* ── Animation ── */
  animationProgress: number; // 0 = assembled, 1 = fully exploded

  /* ── Accessibility ── */
  reducedMotion: boolean;
  highContrast: boolean;

  /* ── Actions ── */
  toggleExplode: () => void;
  setExploded: (exploded: boolean) => void;
  setActiveComponent: (id: string | null) => void;
  setHoveredComponent: (id: string | null) => void;
  enterLearningMode: (totalSteps: number) => void;
  exitLearningMode: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setAnimationProgress: (progress: number) => void;
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  reset: () => void;
}

export const useExplodedViewStore = create<ExplodedViewState>((set, get) => ({
  /* ── Defaults ── */
  isExploded: false,
  activeComponent: null,
  hoveredComponent: null,
  learningMode: false,
  learningStep: 0,
  totalSteps: 0,
  animationProgress: 0,
  reducedMotion: false,
  highContrast: false,

  /* ── Actions ── */
  toggleExplode: () => {
    const { isExploded, learningMode } = get();
    if (learningMode) return; // can't toggle during learning mode
    set({
      isExploded: !isExploded,
      activeComponent: null,
      hoveredComponent: null,
    });
  },

  setExploded: (exploded) =>
    set({
      isExploded: exploded,
      activeComponent: null,
      hoveredComponent: null,
    }),

  setActiveComponent: (id) => set({ activeComponent: id }),
  setHoveredComponent: (id) => set({ hoveredComponent: id }),

  enterLearningMode: (totalSteps) =>
    set({
      learningMode: true,
      learningStep: 0,
      totalSteps,
      isExploded: true,
      activeComponent: null,
    }),

  exitLearningMode: () =>
    set({
      learningMode: false,
      learningStep: 0,
      activeComponent: null,
    }),

  nextStep: () => {
    const { learningStep, totalSteps } = get();
    if (learningStep < totalSteps - 1) {
      set({ learningStep: learningStep + 1 });
    }
  },

  prevStep: () => {
    const { learningStep } = get();
    if (learningStep > 0) {
      set({ learningStep: learningStep - 1 });
    }
  },

  setAnimationProgress: (progress) => set({ animationProgress: progress }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setHighContrast: (value) => set({ highContrast: value }),

  reset: () =>
    set({
      isExploded: false,
      activeComponent: null,
      hoveredComponent: null,
      learningMode: false,
      learningStep: 0,
      animationProgress: 0,
    }),
}));
