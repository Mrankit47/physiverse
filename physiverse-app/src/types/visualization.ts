/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Visualization Type System
   The contract every visualization plugin must fulfill.
   ═══════════════════════════════════════════════════════════════ */

import type { ComponentType, LazyExoticComponent } from 'react';
import type { FormulaData, QuizQuestion, TheoryContent, HotspotData, TimelineEvent, ScientistProfile } from './content';
import type { AnimationConfig, EngineConfig } from './engine';

/* ── Physics Categories ── */
export type PhysicsCategory =
  | 'mechanics'
  | 'optics'
  | 'quantum'
  | 'electricity'
  | 'magnetism'
  | 'astrophysics'
  | 'thermodynamics'
  | 'wave-physics'
  | 'nuclear-physics'
  | 'modern-physics'
  | 'electromagnetism';

/* ── Difficulty Levels ── */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/* ── Visualization Types ── */
export type VisualizationType = 'simulation' | 'exploded-view' | 'experiment' | 'demonstration';

/* ── Visualization Metadata ──
   Declarative description of a visualization. This is the minimum
   data required for the registry, search, and dynamic routing. */
export interface VisualizationMetadata {
  /** Unique string identifier, e.g. 'solar-system' */
  id: string;

  /** Human-readable title */
  title: string;

  /** Short description (1–2 sentences) */
  description: string;

  /** Primary physics category */
  category: PhysicsCategory;

  /** Optional sub-category, e.g. 'Kinematics' under Mechanics */
  subcategory?: string;

  /** Type of visualization */
  type: VisualizationType;

  /** Difficulty level */
  difficulty: DifficultyLevel;

  /** Estimated completion time, e.g. '15 min' */
  estimatedTime: string;

  /** Path to thumbnail image (relative to public/) */
  thumbnail?: string;

  /** Path to 3D model file (relative to public/models/) */
  modelPath?: string;

  /** Accent color for UI theming, e.g. '#3B82F6' */
  color: string;

  /** Icon name from lucide-react */
  icon?: string;

  /** Component count (for exploded views) */
  componentCount?: number;

  /** Tags for the global tag system */
  tags: string[];

  /** Additional keywords for search (not displayed) */
  searchKeywords: string[];

  /** IDs of related visualizations */
  relatedTopics: string[];

  /** What the user will learn */
  learningObjectives: string[];

  /** Target school grades, e.g. ['9', '10', '11', '12'] */
  gradeLevel?: string[];

  /** Associated scientists */
  scientists?: string[];
}

/* ── Visualization Plugin ──
   The complete package a visualization registers with the platform. */
export interface VisualizationPlugin {
  /** Metadata for registry, search, and UI generation */
  metadata: VisualizationMetadata;

  /** Lazy-loaded React component that renders the visualization */
  component: LazyExoticComponent<ComponentType<VisualizationComponentProps>>;

  /** Educational theory content */
  theory?: TheoryContent;

  /** Quiz questions */
  quiz?: QuizQuestion[];

  /** Mathematical formulas */
  formulas?: FormulaData[];

  /** Animation configurations */
  animations?: AnimationConfig[];

  /** Interactive hotspots in 3D space */
  hotspots?: HotspotData[];

  /** Historical timeline events */
  timeline?: TimelineEvent[];

  /** Scientists associated with this topic */
  scientistProfiles?: ScientistProfile[];

  /** Engine configuration overrides */
  engineConfig?: Partial<EngineConfig>;
}

/* ── Props passed to every visualization component ── */
export interface VisualizationComponentProps {
  /** The plugin's own metadata */
  metadata: VisualizationMetadata;

  /** Current interaction mode */
  mode?: 'explore' | 'learn' | 'quiz' | 'compare';

  /** Callback when visualization finishes loading */
  onReady?: () => void;

  /** Callback when user completes a learning objective */
  onObjectiveComplete?: (objectiveIndex: number) => void;
}

/* ── Registration Function Signature ── */
export type RegisterVisualization = (plugin: VisualizationPlugin) => void;
