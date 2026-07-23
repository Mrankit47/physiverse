/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Performance Optimizer
   Adaptive quality, LOD management, and performance monitoring.
   ═══════════════════════════════════════════════════════════════ */

import type { PerformanceConfig, QualityTier } from '@/types';

/** Default performance configuration */
export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  qualityTier: 'high',
  enableLOD: true,
  enableFrustumCulling: true,
  enableInstancing: true,
  maxDrawCalls: 500,
  targetFPS: 60,
  adaptiveQuality: true,
  pixelRatio: undefined, // auto-detect
};

/** Quality tier presets */
export const QUALITY_PRESETS: Record<QualityTier, PerformanceConfig> = {
  low: {
    qualityTier: 'low',
    enableLOD: true,
    enableFrustumCulling: true,
    enableInstancing: false,
    maxDrawCalls: 100,
    targetFPS: 30,
    adaptiveQuality: false,
    pixelRatio: 0.75,
  },
  medium: {
    qualityTier: 'medium',
    enableLOD: true,
    enableFrustumCulling: true,
    enableInstancing: true,
    maxDrawCalls: 300,
    targetFPS: 45,
    adaptiveQuality: true,
    pixelRatio: 1.0,
  },
  high: {
    qualityTier: 'high',
    enableLOD: true,
    enableFrustumCulling: true,
    enableInstancing: true,
    maxDrawCalls: 500,
    targetFPS: 60,
    adaptiveQuality: true,
    pixelRatio: undefined,
  },
  ultra: {
    qualityTier: 'ultra',
    enableLOD: false,
    enableFrustumCulling: true,
    enableInstancing: true,
    maxDrawCalls: 1000,
    targetFPS: 60,
    adaptiveQuality: false,
    pixelRatio: undefined,
  },
};

/** Resolve performance config with fallbacks */
export function resolvePerformanceConfig(
  overrides?: Partial<PerformanceConfig>
): PerformanceConfig {
  if (!overrides) return DEFAULT_PERFORMANCE_CONFIG;

  const tier = overrides.qualityTier ?? 'high';
  return { ...QUALITY_PRESETS[tier], ...overrides };
}

/** FPS monitor for adaptive quality */
export class FPSMonitor {
  private frameTimes: number[] = [];
  private maxSamples: number;
  private lastTime: number = 0;

  constructor(maxSamples: number = 60) {
    this.maxSamples = maxSamples;
  }

  /** Call once per frame with the current timestamp */
  tick(timestamp: number): void {
    if (this.lastTime > 0) {
      const delta = timestamp - this.lastTime;
      this.frameTimes.push(delta);
      if (this.frameTimes.length > this.maxSamples) {
        this.frameTimes.shift();
      }
    }
    this.lastTime = timestamp;
  }

  /** Get average FPS over the sample window */
  get averageFPS(): number {
    if (this.frameTimes.length === 0) return 60;
    const avgDelta =
      this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    return 1000 / avgDelta;
  }

  /** Get the lowest FPS in the sample window (worst frame) */
  get minFPS(): number {
    if (this.frameTimes.length === 0) return 60;
    const maxDelta = Math.max(...this.frameTimes);
    return 1000 / maxDelta;
  }

  /** Reset the monitor */
  reset(): void {
    this.frameTimes = [];
    this.lastTime = 0;
  }
}

/** Suggest a quality tier based on current FPS */
export function suggestQualityTier(currentFPS: number, targetFPS: number): QualityTier {
  const ratio = currentFPS / targetFPS;

  if (ratio >= 0.95) return 'ultra';
  if (ratio >= 0.75) return 'high';
  if (ratio >= 0.5) return 'medium';
  return 'low';
}

/** Detect device capabilities for initial quality selection */
export function detectDeviceCapabilities(): QualityTier {
  if (typeof window === 'undefined') return 'high';

  // Check for mobile
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) return 'medium';

  // Check for WebGL2
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) return 'low';

  // Check max texture size as a proxy for GPU power
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if (maxTextureSize >= 16384) return 'ultra';
  if (maxTextureSize >= 8192) return 'high';
  if (maxTextureSize >= 4096) return 'medium';

  return 'low';
}

/** Calculate optimal pixel ratio */
export function getOptimalPixelRatio(tier: QualityTier): number {
  if (typeof window === 'undefined') return 1;

  const dpr = window.devicePixelRatio || 1;
  const maxDPR: Record<QualityTier, number> = {
    low: 1,
    medium: 1.5,
    high: 2,
    ultra: dpr,
  };

  return Math.min(dpr, maxDPR[tier]);
}
