'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Settings Store
   User preferences: quality, language, accessibility, theme.
   Persisted to localStorage.
   ═══════════════════════════════════════════════════════════════ */

import { create } from 'zustand';
import type { QualityTier } from '@/types';

const STORAGE_KEY = 'physiverse-settings';

export type Language = 'en' | 'hi';

export interface SettingsStoreState {
  /* ── Rendering ── */
  qualityTier: QualityTier;
  showFPS: boolean;

  /* ── Language ── */
  language: Language;

  /* ── Accessibility ── */
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'x-large';
  screenReaderMode: boolean;

  /* ── Theme ── */
  theme: 'light' | 'dark' | 'system';

  /* ── UI Preferences ── */
  showTooltips: boolean;
  autoPlayAnimations: boolean;
  enableSoundEffects: boolean;

  /* ── Actions ── */
  setQualityTier: (tier: QualityTier) => void;
  setShowFPS: (show: boolean) => void;
  setLanguage: (lang: Language) => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setFontSize: (size: 'normal' | 'large' | 'x-large') => void;
  setScreenReaderMode: (enabled: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setShowTooltips: (show: boolean) => void;
  setAutoPlayAnimations: (autoPlay: boolean) => void;
  setEnableSoundEffects: (enabled: boolean) => void;
  hydrate: () => void;
  resetSettings: () => void;
}

const defaultSettings = {
  qualityTier: 'high' as QualityTier,
  showFPS: false,
  language: 'en' as Language,
  reducedMotion: false,
  highContrast: false,
  fontSize: 'normal' as 'normal' | 'large' | 'x-large',
  screenReaderMode: false,
  theme: 'dark' as 'light' | 'dark' | 'system',
  showTooltips: true,
  autoPlayAnimations: true,
  enableSoundEffects: false,
};

function loadSettings(): typeof defaultSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: Partial<typeof defaultSettings>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadSettings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...settings }));
  } catch {
    console.warn('[Physiverse] Failed to save settings');
  }
}

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  ...defaultSettings,

  setQualityTier: (tier) => { set({ qualityTier: tier }); saveSettings({ qualityTier: tier }); },
  setShowFPS: (show) => { set({ showFPS: show }); saveSettings({ showFPS: show }); },
  setLanguage: (lang) => { set({ language: lang }); saveSettings({ language: lang }); },
  setReducedMotion: (enabled) => { set({ reducedMotion: enabled }); saveSettings({ reducedMotion: enabled }); },
  setHighContrast: (enabled) => { set({ highContrast: enabled }); saveSettings({ highContrast: enabled }); },
  setFontSize: (size) => { set({ fontSize: size }); saveSettings({ fontSize: size }); },
  setScreenReaderMode: (enabled) => { set({ screenReaderMode: enabled }); saveSettings({ screenReaderMode: enabled }); },
  setTheme: (theme) => { set({ theme }); saveSettings({ theme }); },
  setShowTooltips: (show) => { set({ showTooltips: show }); saveSettings({ showTooltips: show }); },
  setAutoPlayAnimations: (autoPlay) => { set({ autoPlayAnimations: autoPlay }); saveSettings({ autoPlayAnimations: autoPlay }); },
  setEnableSoundEffects: (enabled) => { set({ enableSoundEffects: enabled }); saveSettings({ enableSoundEffects: enabled }); },
  hydrate: () => set(loadSettings()),
  resetSettings: () => { set(defaultSettings); saveSettings(defaultSettings); },
}));
