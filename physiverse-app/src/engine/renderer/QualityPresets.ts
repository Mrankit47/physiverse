/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Quality Presets
   Combined engine configuration presets that set scene, camera,
   lighting, renderer, and performance settings in one call.
   ═══════════════════════════════════════════════════════════════ */

import type { EngineConfig } from '@/types';
import { DEFAULT_SCENE_CONFIG, SCENE_PRESETS } from '../core/SceneManager';
import { DEFAULT_CAMERA_CONFIG } from '../core/CameraSystem';
import { LIGHTING_PRESETS } from '../core/LightingSystem';
import { DEFAULT_ANIMATION_CONFIG } from '../core/AnimationController';
import { DEFAULT_INTERACTION_CONFIG } from '../core/InteractionManager';
import { QUALITY_PRESETS } from '../core/PerformanceOptimizer';
import { DEFAULT_RENDERER_CONFIG, RENDERER_PRESETS } from './RenderPipeline';

/** Complete default engine config */
export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  scene: DEFAULT_SCENE_CONFIG,
  camera: DEFAULT_CAMERA_CONFIG,
  lighting: LIGHTING_PRESETS.studio,
  animation: DEFAULT_ANIMATION_CONFIG,
  interaction: DEFAULT_INTERACTION_CONFIG,
  performance: QUALITY_PRESETS.high,
  renderer: DEFAULT_RENDERER_CONFIG,
};

/** Pre-built engine configs for different visualization scenarios */
export const ENGINE_PRESETS = {
  /** For simulations: interactive, good performance */
  simulation: {
    scene: SCENE_PRESETS.studio,
    camera: {
      ...DEFAULT_CAMERA_CONFIG,
      position: [0, 3, 10] as [number, number, number],
      fov: 50,
      enablePan: true,
    },
    lighting: LIGHTING_PRESETS.scientific,
    animation: { ...DEFAULT_ANIMATION_CONFIG, enableScrub: true },
    interaction: { ...DEFAULT_INTERACTION_CONFIG, enableDrag: true },
    performance: QUALITY_PRESETS.high,
    renderer: { ...DEFAULT_RENDERER_CONFIG, ...RENDERER_PRESETS.scientific },
  },
  /** For exploded views: detailed inspection */
  explodedView: {
    scene: SCENE_PRESETS.studio,
    camera: {
      ...DEFAULT_CAMERA_CONFIG,
      position: [0, 2, 5] as [number, number, number],
      fov: 45,
      minDistance: 2,
      maxDistance: 20,
    },
    lighting: LIGHTING_PRESETS.studio,
    animation: { ...DEFAULT_ANIMATION_CONFIG, enableScrub: true },
    interaction: {
      ...DEFAULT_INTERACTION_CONFIG,
      enableClick: true,
      enableHover: true,
      showTooltips: true,
    },
    performance: QUALITY_PRESETS.high,
    renderer: { ...DEFAULT_RENDERER_CONFIG, ambientOcclusion: true, aoIntensity: 0.3 },
  },
  /** For astrophysics: dramatic, bloom-heavy */
  astrophysics: {
    scene: SCENE_PRESETS.space,
    camera: {
      ...DEFAULT_CAMERA_CONFIG,
      position: [0, 5, 20] as [number, number, number],
      fov: 60,
      maxDistance: 200,
      autoRotate: true,
      autoRotateSpeed: 0.3,
    },
    lighting: LIGHTING_PRESETS.dark,
    animation: { ...DEFAULT_ANIMATION_CONFIG, defaultSpeed: 0.5 },
    interaction: DEFAULT_INTERACTION_CONFIG,
    performance: QUALITY_PRESETS.high,
    renderer: { ...DEFAULT_RENDERER_CONFIG, ...RENDERER_PRESETS.astrophysics },
  },
  /** For quantum: dramatic, focused */
  quantum: {
    scene: SCENE_PRESETS.dark,
    camera: {
      ...DEFAULT_CAMERA_CONFIG,
      position: [0, 0, 8] as [number, number, number],
      fov: 40,
    },
    lighting: LIGHTING_PRESETS.dramatic,
    animation: DEFAULT_ANIMATION_CONFIG,
    interaction: DEFAULT_INTERACTION_CONFIG,
    performance: QUALITY_PRESETS.high,
    renderer: { ...DEFAULT_RENDERER_CONFIG, ...RENDERER_PRESETS.cinematic },
  },
} as const satisfies Record<string, EngineConfig>;

export type EnginePreset = keyof typeof ENGINE_PRESETS;

/** Merge a partial engine config with the default */
export function resolveEngineConfig(
  overrides?: Partial<EngineConfig>
): EngineConfig {
  if (!overrides) return DEFAULT_ENGINE_CONFIG;

  return {
    scene: { ...DEFAULT_ENGINE_CONFIG.scene, ...overrides.scene },
    camera: { ...DEFAULT_ENGINE_CONFIG.camera, ...overrides.camera },
    lighting: { ...DEFAULT_ENGINE_CONFIG.lighting, ...overrides.lighting },
    animation: { ...DEFAULT_ENGINE_CONFIG.animation, ...overrides.animation },
    interaction: { ...DEFAULT_ENGINE_CONFIG.interaction, ...overrides.interaction },
    performance: { ...DEFAULT_ENGINE_CONFIG.performance, ...overrides.performance },
    renderer: { ...DEFAULT_ENGINE_CONFIG.renderer, ...overrides.renderer },
  };
}
