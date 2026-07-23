/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Interaction Manager
   Unified interaction system for click, hover, drag, pinch,
   and keyboard interactions across all visualizations.
   ═══════════════════════════════════════════════════════════════ */

import type { InteractionConfig, InteractionEvent, InteractionType } from '@/types';

/** Default interaction configuration */
export const DEFAULT_INTERACTION_CONFIG: InteractionConfig = {
  enableClick: true,
  enableHover: true,
  enableDrag: false,
  enablePinch: true,
  enableKeyboard: true,
  showTooltips: true,
  highlightColor: '#FF5500',
  outlineWidth: 2,
};

/** Merge user config with defaults */
export function resolveInteractionConfig(
  overrides?: Partial<InteractionConfig>
): InteractionConfig {
  if (!overrides) return DEFAULT_INTERACTION_CONFIG;
  return { ...DEFAULT_INTERACTION_CONFIG, ...overrides };
}

/** Interaction event handler type */
export type InteractionHandler = (event: InteractionEvent) => void;

/** Keyboard shortcut definition */
export interface KeyboardShortcut {
  /** Key or key combination, e.g. 'Space', 'Ctrl+R' */
  key: string;
  /** Description for UI display */
  label: string;
  /** Action identifier */
  action: string;
  /** Handler function */
  handler: () => void;
  /** Category for grouping in help panel */
  category?: string;
}

/** Default keyboard shortcuts for all visualizations */
export const DEFAULT_KEYBOARD_SHORTCUTS: Omit<KeyboardShortcut, 'handler'>[] = [
  { key: 'Space', label: 'Play / Pause', action: 'togglePlay', category: 'Animation' },
  { key: 'r', label: 'Reset View', action: 'resetCamera', category: 'Camera' },
  { key: 'f', label: 'Focus Object', action: 'focusObject', category: 'Camera' },
  { key: 'e', label: 'Toggle Explode', action: 'toggleExplode', category: 'View' },
  { key: 'l', label: 'Learning Mode', action: 'toggleLearn', category: 'Mode' },
  { key: 'q', label: 'Quiz Mode', action: 'toggleQuiz', category: 'Mode' },
  { key: 'i', label: 'Toggle Info Panel', action: 'toggleInfo', category: 'UI' },
  { key: 'h', label: 'Toggle Hotspots', action: 'toggleHotspots', category: 'UI' },
  { key: 'g', label: 'Toggle Grid', action: 'toggleGrid', category: 'View' },
  { key: 'Escape', label: 'Close Panel', action: 'closePanel', category: 'UI' },
  { key: 'ArrowLeft', label: 'Previous Step', action: 'prevStep', category: 'Navigation' },
  { key: 'ArrowRight', label: 'Next Step', action: 'nextStep', category: 'Navigation' },
  { key: '+', label: 'Speed Up', action: 'speedUp', category: 'Animation' },
  { key: '-', label: 'Slow Down', action: 'slowDown', category: 'Animation' },
  { key: '?', label: 'Show Shortcuts', action: 'showHelp', category: 'Help' },
];

/** Parse a keyboard shortcut string */
export function parseShortcutKey(key: string): {
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
} {
  const parts = key.split('+').map((p) => p.trim());
  return {
    key: parts[parts.length - 1],
    ctrl: parts.includes('Ctrl'),
    shift: parts.includes('Shift'),
    alt: parts.includes('Alt'),
    meta: parts.includes('Meta'),
  };
}

/** Check if a keyboard event matches a shortcut */
export function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const parsed = parseShortcutKey(shortcut);
  return (
    event.key === parsed.key &&
    event.ctrlKey === parsed.ctrl &&
    event.shiftKey === parsed.shift &&
    event.altKey === parsed.alt &&
    event.metaKey === parsed.meta
  );
}

/** Create an InteractionEvent from a DOM event */
export function createInteractionEvent(
  type: InteractionType,
  nativeEvent: Event,
  targetId?: string
): InteractionEvent {
  const event: InteractionEvent = {
    type,
    targetId,
    nativeEvent,
  };

  if (nativeEvent instanceof MouseEvent) {
    event.screenPosition = { x: nativeEvent.clientX, y: nativeEvent.clientY };
  }

  if (nativeEvent instanceof TouchEvent && nativeEvent.touches.length > 0) {
    event.screenPosition = {
      x: nativeEvent.touches[0].clientX,
      y: nativeEvent.touches[0].clientY,
    };
  }

  return event;
}
