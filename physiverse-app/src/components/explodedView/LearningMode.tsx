'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { useExplodedViewStore } from '@/stores/explodedViewStore';
import type { ComponentData } from '@/data/explodedView/componentRegistry';

interface LearningModeProps {
  components: ComponentData[];
  accentColor: string;
}

/**
 * Guided Learning Mode overlay.
 * Shows a bottom navigation bar with Previous/Next and a narration card.
 */
export default function LearningMode({ components, accentColor }: LearningModeProps) {
  const learningMode = useExplodedViewStore((s) => s.learningMode);
  const learningStep = useExplodedViewStore((s) => s.learningStep);
  const nextStep = useExplodedViewStore((s) => s.nextStep);
  const prevStep = useExplodedViewStore((s) => s.prevStep);
  const exitLearningMode = useExplodedViewStore((s) => s.exitLearningMode);
  const setActive = useExplodedViewStore((s) => s.setActiveComponent);

  const currentComponent = useMemo(
    () => components[learningStep] || null,
    [components, learningStep]
  );

  // Sync active component with learning step
  useEffect(() => {
    if (learningMode && currentComponent) {
      setActive(currentComponent.id);
    }
  }, [learningMode, learningStep, currentComponent, setActive]);

  if (!learningMode) return null;

  const progress = ((learningStep + 1) / components.length) * 100;
  const isFirst = learningStep === 0;
  const isLast = learningStep === components.length - 1;

  return (
    <AnimatePresence>
      {/* ── Top-left narration card ── */}
      <motion.div
        key={`narration-${learningStep}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="learning-narration-card"
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: `${accentColor}20`, color: accentColor }}
          >
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Learning Mode
          </span>
        </div>

        {currentComponent && (
          <>
            <h4
              className="text-base font-bold mb-1"
              style={{ color: 'var(--text-heading)' }}
            >
              {currentComponent.name}
            </h4>
            <p
              className="text-xs mb-2"
              style={{ color: accentColor, opacity: 0.7 }}
            >
              {currentComponent.scientificName}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-body)' }}
            >
              {currentComponent.function}
            </p>

            {/* Physics concept highlight */}
            <div
              className="mt-3 p-2.5 rounded-lg text-xs leading-relaxed"
              style={{
                background: `${accentColor}08`,
                border: `1px solid ${accentColor}20`,
                color: 'var(--text-body)',
              }}
            >
              <span className="font-semibold" style={{ color: accentColor }}>
                Physics:{' '}
              </span>
              {currentComponent.physicsConcept}
            </div>
          </>
        )}
      </motion.div>

      {/* ── Bottom navigation bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="learning-mode-bar"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5">
          <motion.div
            className="h-full rounded-full"
            style={{ background: accentColor }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: counter */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accentColor}15`, color: accentColor }}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Exploring
              </span>
              <div className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>
                {learningStep + 1}{' '}
                <span className="font-normal" style={{ color: 'var(--text-muted)' }}>
                  / {components.length}
                </span>
              </div>
            </div>
          </div>

          {/* Center: progress dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {components.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === learningStep ? accentColor : 'rgba(255,255,255,0.15)',
                  transform: i === learningStep ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          {/* Right: navigation buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevStep}
              disabled={isFirst}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-heading)',
              }}
              aria-label="Previous component"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={isLast ? exitLearningMode : nextStep}
              className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all"
              style={{
                background: isLast
                  ? 'linear-gradient(135deg, #10B981, #34D399)'
                  : `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
                color: 'white',
              }}
            >
              {isLast ? 'Finish' : 'Next'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={exitLearningMode}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Exit learning mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
