/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Content Type System
   Educational content types, fully separated from rendering.
   ═══════════════════════════════════════════════════════════════ */

/* ── Theory Content ── */
export interface TheoryContent {
  /** Main theory text (markdown supported) */
  summary: string;

  /** Detailed explanation sections */
  sections?: TheorySection[];

  /** Key definitions */
  definitions?: Definition[];

  /** Real-world applications */
  applications?: string[];

  /** Historical context */
  history?: string;

  /** Further reading / references */
  references?: Reference[];
}

export interface TheorySection {
  title: string;
  content: string; // Markdown
  image?: string;
}

export interface Definition {
  term: string;
  definition: string;
  symbol?: string; // LaTeX symbol
}

export interface Reference {
  title: string;
  url?: string;
  type: 'book' | 'paper' | 'video' | 'website';
  author?: string;
}

/* ── Quiz System ── */
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'numerical' | 'fill-blank';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  /** Related formula ID */
  formulaRef?: string;
}

export interface QuizResult {
  visualizationId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: QuizAnswer[];
  completedAt: string; // ISO date
  timeTaken: number; // seconds
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string | number;
  isCorrect: boolean;
  timeTaken: number; // seconds
}

/* ── Formula System ── */
export interface FormulaData {
  id: string;
  name: string;
  /** LaTeX string for rendering with KaTeX */
  latex: string;
  /** Plain-text version for search/accessibility */
  plainText: string;
  /** Explanation of what the formula represents */
  description: string;
  /** Variable definitions */
  variables: FormulaVariable[];
  /** SI unit of the result */
  unit?: string;
  /** Category for grouping */
  category?: string;
  /** Related formula IDs */
  relatedFormulas?: string[];
}

export interface FormulaVariable {
  symbol: string; // LaTeX symbol
  name: string;
  unit: string;
  description: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

/* ── Hotspot System ── */
export interface HotspotData {
  id: string;
  /** 3D position [x, y, z] */
  position: [number, number, number];
  /** Display label */
  label: string;
  /** Detailed description */
  description: string;
  /** Optional camera position to zoom to */
  cameraTarget?: [number, number, number];
  /** Associated component ID (for exploded views) */
  componentId?: string;
  /** Color override */
  color?: string;
  /** Icon identifier */
  icon?: string;
}

/* ── Timeline System ── */
export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  scientist?: string;
  image?: string;
  /** Animation keyframe time (0-1) to sync with 3D */
  animationTime?: number;
}

/* ── Scientist Profiles ── */
export interface ScientistProfile {
  name: string;
  born: string;
  died?: string;
  nationality: string;
  contributions: string[];
  image?: string;
  quote?: string;
  relatedFormulas?: string[];
}

/* ── Bookmark Types ── */
export type BookmarkType = 'visualization' | 'formula' | 'quiz' | 'scientist' | 'experiment';

export interface Bookmark {
  id: string;
  type: BookmarkType;
  targetId: string;
  title: string;
  createdAt: string; // ISO date
  notes?: string;
}

/* ── Learning Progress ── */
export interface LearningProgress {
  visualizationId: string;
  completedObjectives: number[];
  quizResults: QuizResult[];
  timeSpent: number; // total seconds
  lastVisited: string; // ISO date
  completionPercentage: number;
  bookmarked: boolean;
}
