/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Engine Type System
   Configuration interfaces for the modular visualization engine.
   ═══════════════════════════════════════════════════════════════ */

/* ── Vec3 tuple ── */
export type Vec3 = [number, number, number];

/* ── Quality Tiers ── */
export type QualityTier = 'low' | 'medium' | 'high' | 'ultra';

/* ── Engine Configuration ──
   Master config object that every visualization can override. */
export interface EngineConfig {
  scene: SceneConfig;
  camera: CameraConfig;
  lighting: LightingConfig;
  animation: AnimationSystemConfig;
  interaction: InteractionConfig;
  performance: PerformanceConfig;
  renderer: RendererConfig;
}

/* ── Scene ── */
export interface SceneConfig {
  /** Background color or gradient */
  background?: string | [string, string];
  /** HDRI environment map path */
  environmentMap?: string;
  /** Environment map intensity */
  environmentIntensity?: number;
  /** Fog configuration */
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  /** Ground plane */
  ground?: {
    enabled: boolean;
    color: string;
    size: number;
    receiveShadow: boolean;
  };
}

/* ── Camera ── */
export type CameraMode = 'orbit' | 'fly' | 'first-person' | 'fixed';

export interface CameraConfig {
  /** Camera mode */
  mode: CameraMode;
  /** Initial position */
  position: Vec3;
  /** Look-at target */
  target: Vec3;
  /** Field of view (degrees) */
  fov: number;
  /** Near clipping plane */
  near: number;
  /** Far clipping plane */
  far: number;
  /** Enable damping (smooth controls) */
  enableDamping: boolean;
  /** Damping factor */
  dampingFactor: number;
  /** Min/max zoom distance */
  minDistance?: number;
  maxDistance?: number;
  /** Min/max polar angle (vertical rotation limits) */
  minPolarAngle?: number;
  maxPolarAngle?: number;
  /** Enable auto-rotate */
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  /** Enable pan */
  enablePan?: boolean;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Saved viewpoints */
  presets?: CameraPreset[];
}

export interface CameraPreset {
  name: string;
  position: Vec3;
  target: Vec3;
  fov?: number;
  /** Transition duration in ms */
  transitionDuration?: number;
}

/* ── Lighting ── */
export type LightingPreset = 'studio' | 'outdoor' | 'dramatic' | 'scientific' | 'dark' | 'custom';

export interface LightingConfig {
  /** Preset lighting rig */
  preset: LightingPreset;
  /** Ambient light intensity */
  ambientIntensity: number;
  /** Ambient light color */
  ambientColor: string;
  /** Custom directional lights */
  directionalLights?: DirectionalLightConfig[];
  /** Custom point lights */
  pointLights?: PointLightConfig[];
  /** Custom spot lights */
  spotLights?: SpotLightConfig[];
  /** Enable shadows globally */
  shadows: boolean;
  /** Shadow map resolution */
  shadowMapSize?: number;
}

export interface DirectionalLightConfig {
  position: Vec3;
  intensity: number;
  color: string;
  castShadow?: boolean;
}

export interface PointLightConfig {
  position: Vec3;
  intensity: number;
  color: string;
  distance?: number;
  decay?: number;
  castShadow?: boolean;
}

export interface SpotLightConfig {
  position: Vec3;
  target: Vec3;
  intensity: number;
  color: string;
  angle?: number;
  penumbra?: number;
  distance?: number;
  castShadow?: boolean;
}

/* ── Animation System ── */
export type AnimationType =
  | 'idle'
  | 'hover'
  | 'click'
  | 'explode'
  | 'reset'
  | 'auto-rotate'
  | 'timeline'
  | 'scroll'
  | 'camera'
  | 'custom';

export interface AnimationConfig {
  id: string;
  name: string;
  type: AnimationType;
  /** Duration in milliseconds */
  duration: number;
  /** Easing function name */
  easing: string;
  /** Whether animation loops */
  loop: boolean;
  /** Delay before start (ms) */
  delay?: number;
  /** Keyframes (0-1 normalized time → property values) */
  keyframes?: AnimationKeyframe[];
  /** Auto-play on load */
  autoPlay?: boolean;
}

export interface AnimationKeyframe {
  time: number; // 0-1
  position?: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
  opacity?: number;
  color?: string;
  /** Custom property values */
  custom?: Record<string, number | string>;
}

export interface AnimationSystemConfig {
  /** Default animation speed multiplier */
  defaultSpeed: number;
  /** Enable animation scrubbing */
  enableScrub: boolean;
  /** Respect prefers-reduced-motion */
  respectReducedMotion: boolean;
}

/* ── Interaction System ── */
export type InteractionType = 'click' | 'hover' | 'drag' | 'pinch' | 'scroll' | 'keyboard';

export interface InteractionConfig {
  /** Enable object clicking */
  enableClick: boolean;
  /** Enable hover effects */
  enableHover: boolean;
  /** Enable drag interactions */
  enableDrag: boolean;
  /** Enable touch pinch/zoom */
  enablePinch: boolean;
  /** Enable keyboard shortcuts */
  enableKeyboard: boolean;
  /** Show tooltips on hover */
  showTooltips: boolean;
  /** Highlight color for hovered/selected objects */
  highlightColor: string;
  /** Selection outline width */
  outlineWidth: number;
}

export interface InteractionEvent {
  type: InteractionType;
  targetId?: string;
  position?: Vec3;
  screenPosition?: { x: number; y: number };
  delta?: Vec3;
  /** Raw DOM event */
  nativeEvent?: Event;
}

/* ── Performance ── */
export interface PerformanceConfig {
  /** Target quality tier */
  qualityTier: QualityTier;
  /** Enable LOD (Level of Detail) */
  enableLOD: boolean;
  /** Enable frustum culling */
  enableFrustumCulling: boolean;
  /** Enable GPU instancing */
  enableInstancing: boolean;
  /** Max draw calls before quality reduction */
  maxDrawCalls: number;
  /** Target FPS */
  targetFPS: number;
  /** Enable adaptive quality (auto-reduce on low FPS) */
  adaptiveQuality: boolean;
  /** Pixel ratio (1 = native, 0.5 = half resolution) */
  pixelRatio?: number;
}

/* ── Renderer ── */
export interface RendererConfig {
  /** Enable bloom post-processing */
  bloom: boolean;
  bloomIntensity?: number;
  bloomThreshold?: number;
  bloomRadius?: number;
  /** Enable SSAO */
  ambientOcclusion: boolean;
  aoIntensity?: number;
  /** Enable depth of field */
  depthOfField: boolean;
  dofFocalLength?: number;
  dofBokehScale?: number;
  /** Tone mapping */
  toneMapping: 'aces' | 'reinhard' | 'linear' | 'cineon';
  /** Exposure */
  exposure: number;
  /** Enable soft shadows */
  softShadows: boolean;
  /** Enable anti-aliasing */
  antiAlias: boolean;
}
