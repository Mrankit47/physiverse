/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Lighting System
   Configurable lighting rigs for different visualization contexts.
   ═══════════════════════════════════════════════════════════════ */

import type {
  LightingConfig,
  LightingPreset,
  DirectionalLightConfig,
  PointLightConfig,
  SpotLightConfig,
} from '@/types';

/** Default lighting configuration */
export const DEFAULT_LIGHTING_CONFIG: LightingConfig = {
  preset: 'studio',
  ambientIntensity: 0.4,
  ambientColor: '#ffffff',
  shadows: true,
  shadowMapSize: 2048,
  directionalLights: [
    {
      position: [5, 8, 5],
      intensity: 1.2,
      color: '#ffffff',
      castShadow: true,
    },
  ],
  pointLights: [],
  spotLights: [],
};

/** Preset lighting rigs */
export const LIGHTING_PRESETS: Record<LightingPreset, LightingConfig> = {
  studio: {
    preset: 'studio',
    ambientIntensity: 0.4,
    ambientColor: '#ffffff',
    shadows: true,
    shadowMapSize: 2048,
    directionalLights: [
      { position: [5, 8, 5], intensity: 1.2, color: '#ffffff', castShadow: true },
      { position: [-3, 4, -2], intensity: 0.6, color: '#b4c6e7', castShadow: false },
    ],
    pointLights: [
      { position: [0, 3, 0], intensity: 0.3, color: '#ffeedd', distance: 20, decay: 2 },
    ],
    spotLights: [],
  },
  outdoor: {
    preset: 'outdoor',
    ambientIntensity: 0.6,
    ambientColor: '#87CEEB',
    shadows: true,
    shadowMapSize: 4096,
    directionalLights: [
      { position: [10, 20, 10], intensity: 2.0, color: '#FFF5E1', castShadow: true },
    ],
    pointLights: [],
    spotLights: [],
  },
  dramatic: {
    preset: 'dramatic',
    ambientIntensity: 0.1,
    ambientColor: '#1a1a3e',
    shadows: true,
    shadowMapSize: 2048,
    directionalLights: [
      { position: [3, 6, 2], intensity: 2.0, color: '#FF5500', castShadow: true },
    ],
    pointLights: [
      { position: [-5, 3, -3], intensity: 1.0, color: '#3B82F6', distance: 15, decay: 2 },
      { position: [5, 1, 5], intensity: 0.5, color: '#A855F7', distance: 10, decay: 2 },
    ],
    spotLights: [],
  },
  scientific: {
    preset: 'scientific',
    ambientIntensity: 0.7,
    ambientColor: '#f0f0ff',
    shadows: false,
    shadowMapSize: 1024,
    directionalLights: [
      { position: [0, 10, 5], intensity: 1.5, color: '#ffffff', castShadow: false },
      { position: [5, 5, -5], intensity: 0.8, color: '#ffffff', castShadow: false },
      { position: [-5, 5, -5], intensity: 0.8, color: '#ffffff', castShadow: false },
    ],
    pointLights: [],
    spotLights: [],
  },
  dark: {
    preset: 'dark',
    ambientIntensity: 0.05,
    ambientColor: '#0a0a1a',
    shadows: true,
    shadowMapSize: 2048,
    directionalLights: [],
    pointLights: [
      { position: [0, 5, 0], intensity: 0.8, color: '#FF5500', distance: 20, decay: 2, castShadow: true },
    ],
    spotLights: [],
  },
  custom: {
    preset: 'custom',
    ambientIntensity: 0.5,
    ambientColor: '#ffffff',
    shadows: true,
    shadowMapSize: 2048,
    directionalLights: [],
    pointLights: [],
    spotLights: [],
  },
};

/** Merge user config with preset defaults */
export function resolveLightingConfig(
  overrides?: Partial<LightingConfig>
): LightingConfig {
  if (!overrides) return LIGHTING_PRESETS.studio;

  const preset = overrides.preset ?? 'studio';
  const base = LIGHTING_PRESETS[preset];

  return {
    ...base,
    ...overrides,
    directionalLights: overrides.directionalLights ?? base.directionalLights,
    pointLights: overrides.pointLights ?? base.pointLights,
    spotLights: overrides.spotLights ?? base.spotLights,
  };
}

/** Helper: Create a three-point lighting setup */
export function createThreePointLighting(
  keyIntensity: number = 1.5,
  keyColor: string = '#ffffff'
): { directional: DirectionalLightConfig[]; point: PointLightConfig[]; spot: SpotLightConfig[] } {
  return {
    directional: [
      // Key light
      { position: [5, 8, 5], intensity: keyIntensity, color: keyColor, castShadow: true },
      // Fill light
      { position: [-4, 4, -2], intensity: keyIntensity * 0.4, color: '#b4c6e7', castShadow: false },
      // Rim/back light
      { position: [-2, 6, -6], intensity: keyIntensity * 0.6, color: '#ffeedd', castShadow: false },
    ],
    point: [],
    spot: [],
  };
}
