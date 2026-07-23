/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Render Pipeline
   Post-processing and visual quality configuration for R3F.
   Provides a composable <RenderPipeline> wrapper component.
   ═══════════════════════════════════════════════════════════════ */

import type { RendererConfig } from '@/types';

/** Default renderer configuration */
export const DEFAULT_RENDERER_CONFIG: RendererConfig = {
  bloom: false,
  bloomIntensity: 0.5,
  bloomThreshold: 0.8,
  bloomRadius: 0.4,
  ambientOcclusion: false,
  aoIntensity: 0.5,
  depthOfField: false,
  dofFocalLength: 0.02,
  dofBokehScale: 2,
  toneMapping: 'aces',
  exposure: 1.0,
  softShadows: true,
  antiAlias: true,
};

/** Resolve renderer config with defaults */
export function resolveRendererConfig(
  overrides?: Partial<RendererConfig>
): RendererConfig {
  if (!overrides) return DEFAULT_RENDERER_CONFIG;
  return { ...DEFAULT_RENDERER_CONFIG, ...overrides };
}

/** Renderer presets for different visualization styles */
export const RENDERER_PRESETS = {
  /** Clean scientific look — no bloom, good shadows */
  scientific: {
    bloom: false,
    ambientOcclusion: true,
    aoIntensity: 0.3,
    depthOfField: false,
    toneMapping: 'linear' as const,
    exposure: 1.0,
    softShadows: true,
    antiAlias: true,
  },
  /** Dramatic sci-fi look — bloom, deep shadows */
  cinematic: {
    bloom: true,
    bloomIntensity: 0.8,
    bloomThreshold: 0.6,
    bloomRadius: 0.5,
    ambientOcclusion: true,
    aoIntensity: 0.6,
    depthOfField: true,
    dofFocalLength: 0.02,
    dofBokehScale: 3,
    toneMapping: 'aces' as const,
    exposure: 1.2,
    softShadows: true,
    antiAlias: true,
  },
  /** Space / astrophysics — high bloom, dark */
  astrophysics: {
    bloom: true,
    bloomIntensity: 1.2,
    bloomThreshold: 0.4,
    bloomRadius: 0.8,
    ambientOcclusion: false,
    depthOfField: false,
    toneMapping: 'aces' as const,
    exposure: 0.8,
    softShadows: false,
    antiAlias: true,
  },
  /** Performance — minimal effects */
  performance: {
    bloom: false,
    ambientOcclusion: false,
    depthOfField: false,
    toneMapping: 'linear' as const,
    exposure: 1.0,
    softShadows: false,
    antiAlias: false,
  },
} as const satisfies Record<string, Partial<RendererConfig>>;

export type RendererPreset = keyof typeof RENDERER_PRESETS;

/** Get tone mapping constant name for Three.js */
export function getToneMappingValue(name: RendererConfig['toneMapping']): number {
  // Three.js tone mapping constants
  // These values correspond to THREE.LinearToneMapping, etc.
  const mappings: Record<string, number> = {
    linear: 1, // THREE.LinearToneMapping
    reinhard: 2, // THREE.ReinhardToneMapping
    cineon: 3, // THREE.CineonToneMapping
    aces: 4, // THREE.ACESFilmicToneMapping
  };
  return mappings[name] ?? 4;
}
