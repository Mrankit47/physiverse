/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — i18n System
   Lightweight internationalization with namespace support.
   No external dependencies required.
   ═══════════════════════════════════════════════════════════════ */

import type { Language } from '@/stores/settingsStore';

type TranslationDict = Record<string, string | Record<string, string>>;

const translations: Record<Language, TranslationDict> = {
  en: {},
  hi: {},
};

let currentLanguage: Language = 'en';

/** Load translations for a language */
export function loadTranslations(lang: Language, dict: TranslationDict): void {
  translations[lang] = { ...translations[lang], ...dict };
}

/** Set the active language */
export function setLanguage(lang: Language): void {
  currentLanguage = lang;
}

/** Get the active language */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * Translate a key. Supports dot notation for namespaces.
 * Example: t('nav.home') looks up translations[lang].nav.home
 * Falls back to the key itself if not found.
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const dict = translations[currentLanguage];
  let result = resolveKey(dict, key);

  // Fallback to English
  if (result === key && currentLanguage !== 'en') {
    result = resolveKey(translations.en, key);
  }

  // Parameter interpolation: {{param}}
  if (params && result !== key) {
    for (const [param, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{\\{${param}\\}\\}`, 'g'), String(value));
    }
  }

  return result;
}

function resolveKey(dict: TranslationDict, key: string): string {
  const parts = key.split('.');

  if (parts.length === 1) {
    const val = dict[key];
    return typeof val === 'string' ? val : key;
  }

  // Namespace lookup
  const namespace = parts[0];
  const subKey = parts.slice(1).join('.');
  const nsDict = dict[namespace];

  if (typeof nsDict === 'object' && nsDict !== null) {
    const val = nsDict[subKey];
    return typeof val === 'string' ? val : key;
  }

  return key;
}

/** Get all available languages */
export function getAvailableLanguages(): { code: Language; label: string }[] {
  return [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
  ];
}
