'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Undo2,
  BookOpen,
  Accessibility,
  Contrast,
  Keyboard,
} from 'lucide-react';
import { useExplodedViewStore } from '@/stores/explodedViewStore';

interface ExplodedViewControlsProps {
  accentColor: string;
  totalComponents: number;
}

/**
 * Floating control bar for the Exploded View Mode.
 * Provides toggle buttons for explosion, learning mode, and accessibility.
 */
export default function ExplodedViewControls({
  accentColor,
  totalComponents,
}: ExplodedViewControlsProps) {
  const isExploded = useExplodedViewStore((s) => s.isExploded);
  const learningMode = useExplodedViewStore((s) => s.learningMode);
  const reducedMotion = useExplodedViewStore((s) => s.reducedMotion);
  const highContrast = useExplodedViewStore((s) => s.highContrast);
  const toggleExplode = useExplodedViewStore((s) => s.toggleExplode);
  const enterLearningMode = useExplodedViewStore((s) => s.enterLearningMode);
  const setReducedMotion = useExplodedViewStore((s) => s.setReducedMotion);
  const setHighContrast = useExplodedViewStore((s) => s.setHighContrast);

  if (learningMode) return null; // controls hidden during learning mode

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="exploded-controls-bar"
    >
      {/* Primary: Explode / Assemble */}
      <button
        onClick={toggleExplode}
        className="exploded-control-btn exploded-control-btn-primary"
        style={{
          background: isExploded
            ? 'linear-gradient(135deg, #10B981, #34D399)'
            : `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
        }}
        aria-label={isExploded ? 'Reassemble' : 'Exploded View'}
      >
        {isExploded ? (
          <Undo2 className="w-4 h-4" />
        ) : (
          <Layers className="w-4 h-4" />
        )}
        <span className="text-sm font-semibold">
          {isExploded ? 'Assemble' : 'Explore Inside'}
        </span>
      </button>

      {/* Learning Mode */}
      <AnimatePresence>
        {isExploded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => enterLearningMode(totalComponents)}
            className="exploded-control-btn"
            style={{
              border: `1px solid ${accentColor}40`,
              color: accentColor,
            }}
            aria-label="Enter Learning Mode"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Learning Mode</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div
        className="w-px h-6 mx-1"
        style={{ background: 'rgba(255,255,255,0.1)' }}
      />

      {/* Accessibility: Reduced Motion */}
      <button
        onClick={() => setReducedMotion(!reducedMotion)}
        className={`exploded-control-btn-icon ${reducedMotion ? 'active' : ''}`}
        style={{
          color: reducedMotion ? accentColor : 'var(--text-muted)',
          background: reducedMotion ? `${accentColor}15` : 'transparent',
        }}
        aria-label={`Reduced motion: ${reducedMotion ? 'on' : 'off'}`}
        title="Reduced Motion"
      >
        <Accessibility className="w-4 h-4" />
      </button>

      {/* Accessibility: High Contrast */}
      <button
        onClick={() => setHighContrast(!highContrast)}
        className={`exploded-control-btn-icon ${highContrast ? 'active' : ''}`}
        style={{
          color: highContrast ? accentColor : 'var(--text-muted)',
          background: highContrast ? `${accentColor}15` : 'transparent',
        }}
        aria-label={`High contrast: ${highContrast ? 'on' : 'off'}`}
        title="High Contrast"
      >
        <Contrast className="w-4 h-4" />
      </button>

      {/* Keyboard hints */}
      <div className="hidden lg:flex items-center gap-1.5 ml-2">
        <Keyboard className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <span className="text-[10px]" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
          Space to toggle
        </span>
      </div>
    </motion.div>
  );
}
