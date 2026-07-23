/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Scene Manager
   Manages Three.js scene lifecycle, environment, and backgrounds.
   Used as a React hook wrapping R3F scene configuration.
   ═══════════════════════════════════════════════════════════════ */

import type { SceneConfig } from '@/types';

/** Default scene configuration */
export const DEFAULT_SCENE_CONFIG: SceneConfig = {
  background: '#0B1120',
  environmentMap: undefined,
  environmentIntensity: 1.0,
  fog: undefined,
  ground: {
    enabled: false,
    color: '#1a1a2e',
    size: 100,
    receiveShadow: true,
  },
};

/** Merge user config with defaults */
export function resolveSceneConfig(
  overrides?: Partial<SceneConfig>
): SceneConfig {
  if (!overrides) return DEFAULT_SCENE_CONFIG;

  return {
    ...DEFAULT_SCENE_CONFIG,
    ...overrides,
    fog: overrides.fog ?? DEFAULT_SCENE_CONFIG.fog,
    ground: overrides.ground
      ? { ...DEFAULT_SCENE_CONFIG.ground!, ...overrides.ground }
      : DEFAULT_SCENE_CONFIG.ground,
  };
}

/** Scene preset configurations */
export const SCENE_PRESETS = {
  space: {
    background: '#050510',
    environmentIntensity: 0.3,
    fog: undefined,
    ground: { enabled: false, color: '#000', size: 100, receiveShadow: false },
  },
  laboratory: {
    background: '#f0f4f8',
    environmentIntensity: 1.2,
    fog: { color: '#f0f4f8', near: 50, far: 200 },
    ground: { enabled: true, color: '#e2e8f0', size: 50, receiveShadow: true },
  },
  studio: {
    background: '#1a1a2e',
    environmentIntensity: 0.8,
    fog: undefined,
    ground: { enabled: true, color: '#16162a', size: 30, receiveShadow: true },
  },
  outdoor: {
    background: '#87CEEB',
    environmentIntensity: 1.5,
    fog: { color: '#87CEEB', near: 100, far: 500 },
    ground: { enabled: true, color: '#4ade80', size: 200, receiveShadow: true },
  },
  dark: {
    background: '#000000',
    environmentIntensity: 0.2,
    fog: undefined,
    ground: { enabled: false, color: '#000', size: 100, receiveShadow: false },
  },
} as const satisfies Record<string, SceneConfig>;

export type ScenePreset = keyof typeof SCENE_PRESETS;
