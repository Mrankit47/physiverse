/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Camera System
   Configurable camera presets, smooth transitions, and viewpoints.
   ═══════════════════════════════════════════════════════════════ */

import type { CameraConfig, CameraPreset, CameraMode, Vec3 } from '@/types';

/** Default camera configuration */
export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  mode: 'orbit',
  position: [0, 2, 8],
  target: [0, 0, 0],
  fov: 50,
  near: 0.1,
  far: 1000,
  enableDamping: true,
  dampingFactor: 0.05,
  minDistance: 1,
  maxDistance: 100,
  minPolarAngle: 0.1,
  maxPolarAngle: Math.PI - 0.1,
  autoRotate: false,
  autoRotateSpeed: 1.0,
  enablePan: true,
  enableZoom: true,
  presets: [],
};

/** Merge user config with defaults */
export function resolveCameraConfig(
  overrides?: Partial<CameraConfig>
): CameraConfig {
  if (!overrides) return DEFAULT_CAMERA_CONFIG;

  return {
    ...DEFAULT_CAMERA_CONFIG,
    ...overrides,
    presets: overrides.presets ?? DEFAULT_CAMERA_CONFIG.presets,
  };
}

/** Camera preset configurations for common scenarios */
export const CAMERA_PRESETS: Record<string, Partial<CameraConfig>> = {
  /** Close-up view for detailed inspection */
  closeUp: {
    position: [0, 1, 3],
    target: [0, 0, 0],
    fov: 35,
    minDistance: 1,
    maxDistance: 20,
  },
  /** Wide view for overview */
  overview: {
    position: [5, 5, 10],
    target: [0, 0, 0],
    fov: 60,
    minDistance: 5,
    maxDistance: 100,
  },
  /** Top-down orthographic-like view */
  topDown: {
    position: [0, 15, 0.01],
    target: [0, 0, 0],
    fov: 40,
  },
  /** Front view */
  front: {
    position: [0, 0, 10],
    target: [0, 0, 0],
    fov: 50,
  },
  /** Side view */
  side: {
    position: [10, 0, 0],
    target: [0, 0, 0],
    fov: 50,
  },
  /** Cinematic low angle */
  cinematic: {
    position: [3, 0.5, 6],
    target: [0, 1, 0],
    fov: 35,
    autoRotate: true,
    autoRotateSpeed: 0.5,
  },
};

/** Predefined viewpoint sets for different visualization types */
export const VIEWPOINT_SETS: Record<string, CameraPreset[]> = {
  simulation: [
    { name: 'Default', position: [0, 2, 8], target: [0, 0, 0], transitionDuration: 1000 },
    { name: 'Close-up', position: [0, 1, 3], target: [0, 0, 0], transitionDuration: 1200 },
    { name: 'Overview', position: [5, 5, 10], target: [0, 0, 0], transitionDuration: 1500 },
    { name: 'Top', position: [0, 10, 0.01], target: [0, 0, 0], transitionDuration: 1000 },
  ],
  explodedView: [
    { name: 'Assembled', position: [0, 2, 5], target: [0, 0, 0], transitionDuration: 1000 },
    { name: 'Exploded', position: [0, 4, 10], target: [0, 0, 0], transitionDuration: 1500 },
    { name: 'Detail', position: [2, 1, 3], target: [0, 0, 0], transitionDuration: 1200 },
  ],
};

/** Calculate smooth lerp between two Vec3 values */
export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

/** Ease-in-out cubic for smooth camera transitions */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Get camera mode display name */
export function getCameraModeLabel(mode: CameraMode): string {
  const labels: Record<CameraMode, string> = {
    orbit: 'Orbit',
    fly: 'Fly',
    'first-person': 'First Person',
    fixed: 'Fixed',
  };
  return labels[mode];
}
