'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — useTranslation Hook
   React hook for accessing translations.
   ═══════════════════════════════════════════════════════════════ */

import { useCallback, useEffect } from 'react';
import { t, loadTranslations, setLanguage } from './index';
import { useSettingsStore } from '@/stores/settingsStore';

// Import locale files
import en from './locales/en.json';
import hi from './locales/hi.json';

// Load translations on module init
loadTranslations('en', en as Record<string, string | Record<string, string>>);
loadTranslations('hi', hi as Record<string, string | Record<string, string>>);

/**
 * React hook for accessing translations.
 * Automatically syncs with the language setting from settingsStore.
 *
 * Usage:
 * ```tsx
 * const { t } = useTranslation();
 * return <h1>{t('hero.title')}</h1>;
 * ```
 */
export function useTranslation() {
  const language = useSettingsStore((s) => s.language);

  useEffect(() => {
    setLanguage(language);
  }, [language]);

  const translate = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      // Ensure language is set before translating
      setLanguage(language);
      return t(key, params);
    },
    [language]
  );

  return { t: translate, language };
}
