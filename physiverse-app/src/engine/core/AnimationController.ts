/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Animation Controller
   Unified animation system for all visualization types.
   Supports idle, hover, click, explode, timeline, and camera
   animations through a single declarative API.
   ═══════════════════════════════════════════════════════════════ */

import type { AnimationConfig, AnimationKeyframe, AnimationSystemConfig, AnimationType } from '@/types';

/** Default animation system configuration */
export const DEFAULT_ANIMATION_CONFIG: AnimationSystemConfig = {
  defaultSpeed: 1.0,
  enableScrub: true,
  respectReducedMotion: true,
};

/** Animation state for a single animation */
export interface AnimationState {
  id: string;
  config: AnimationConfig;
  /** Current progress (0-1) */
  progress: number;
  /** Is currently playing */
  isPlaying: boolean;
  /** Is paused (but not reset) */
  isPaused: boolean;
  /** Current playback speed multiplier */
  speed: number;
  /** Direction: 1 = forward, -1 = reverse */
  direction: 1 | -1;
  /** Number of completed loops */
  loopCount: number;
}

/** Create initial state for an animation */
export function createAnimationState(config: AnimationConfig): AnimationState {
  return {
    id: config.id,
    config,
    progress: 0,
    isPlaying: config.autoPlay ?? false,
    isPaused: false,
    speed: 1.0,
    direction: 1,
    loopCount: 0,
  };
}

/** Interpolate between keyframes at a given time */
export function interpolateKeyframes(
  keyframes: AnimationKeyframe[],
  time: number
): AnimationKeyframe {
  if (keyframes.length === 0) {
    return { time };
  }

  if (keyframes.length === 1) {
    return { ...keyframes[0] };
  }

  // Clamp time
  const t = Math.max(0, Math.min(1, time));

  // Find surrounding keyframes
  let prevFrame = keyframes[0];
  let nextFrame = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (t >= keyframes[i].time && t <= keyframes[i + 1].time) {
      prevFrame = keyframes[i];
      nextFrame = keyframes[i + 1];
      break;
    }
  }

  // Calculate local t between the two keyframes
  const range = nextFrame.time - prevFrame.time;
  const localT = range === 0 ? 0 : (t - prevFrame.time) / range;

  // Interpolate all properties
  const result: AnimationKeyframe = { time: t };

  if (prevFrame.position && nextFrame.position) {
    result.position = [
      lerp(prevFrame.position[0], nextFrame.position[0], localT),
      lerp(prevFrame.position[1], nextFrame.position[1], localT),
      lerp(prevFrame.position[2], nextFrame.position[2], localT),
    ];
  }

  if (prevFrame.rotation && nextFrame.rotation) {
    result.rotation = [
      lerp(prevFrame.rotation[0], nextFrame.rotation[0], localT),
      lerp(prevFrame.rotation[1], nextFrame.rotation[1], localT),
      lerp(prevFrame.rotation[2], nextFrame.rotation[2], localT),
    ];
  }

  if (prevFrame.scale && nextFrame.scale) {
    result.scale = [
      lerp(prevFrame.scale[0], nextFrame.scale[0], localT),
      lerp(prevFrame.scale[1], nextFrame.scale[1], localT),
      lerp(prevFrame.scale[2], nextFrame.scale[2], localT),
    ];
  }

  if (prevFrame.opacity !== undefined && nextFrame.opacity !== undefined) {
    result.opacity = lerp(prevFrame.opacity, nextFrame.opacity, localT);
  }

  return result;
}

/** Common easing functions */
export const EASING_FUNCTIONS: Record<string, (t: number) => number> = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  spring: (t: number) => 1 - Math.cos(t * Math.PI * 4) * Math.exp(-t * 6),
  bounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

/** Apply easing to a progress value */
export function applyEasing(progress: number, easingName: string): number {
  const fn = EASING_FUNCTIONS[easingName] || EASING_FUNCTIONS.easeInOut;
  return fn(Math.max(0, Math.min(1, progress)));
}

/** Get a display label for an animation type */
export function getAnimationTypeLabel(type: AnimationType): string {
  const labels: Record<AnimationType, string> = {
    idle: 'Idle',
    hover: 'Hover',
    click: 'Click',
    explode: 'Exploded View',
    reset: 'Reset',
    'auto-rotate': 'Auto Rotate',
    timeline: 'Timeline',
    scroll: 'Scroll',
    camera: 'Camera',
    custom: 'Custom',
  };
  return labels[type];
}

/** Pre-built animation configs for common patterns */
export const ANIMATION_TEMPLATES: Record<string, Partial<AnimationConfig>> = {
  idleFloat: {
    type: 'idle',
    duration: 3000,
    easing: 'easeInOut',
    loop: true,
    autoPlay: true,
    keyframes: [
      { time: 0, position: [0, 0, 0] },
      { time: 0.5, position: [0, 0.3, 0] },
      { time: 1, position: [0, 0, 0] },
    ],
  },
  idleRotate: {
    type: 'auto-rotate',
    duration: 10000,
    easing: 'linear',
    loop: true,
    autoPlay: true,
    keyframes: [
      { time: 0, rotation: [0, 0, 0] },
      { time: 1, rotation: [0, Math.PI * 2, 0] },
    ],
  },
  hoverScale: {
    type: 'hover',
    duration: 300,
    easing: 'easeOut',
    loop: false,
    keyframes: [
      { time: 0, scale: [1, 1, 1] },
      { time: 1, scale: [1.1, 1.1, 1.1] },
    ],
  },
  clickPulse: {
    type: 'click',
    duration: 400,
    easing: 'spring',
    loop: false,
    keyframes: [
      { time: 0, scale: [1, 1, 1] },
      { time: 0.3, scale: [1.2, 1.2, 1.2] },
      { time: 1, scale: [1, 1, 1] },
    ],
  },
  fadeIn: {
    type: 'custom',
    duration: 600,
    easing: 'easeOut',
    loop: false,
    autoPlay: true,
    keyframes: [
      { time: 0, opacity: 0 },
      { time: 1, opacity: 1 },
    ],
  },
};

/* ── Utility ── */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
