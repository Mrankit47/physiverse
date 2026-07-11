'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lightbulb,
  Cpu,
  BookOpen,
  Sparkles,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';
import { useExplodedViewStore } from '@/stores/explodedViewStore';
import type { ComponentData } from '@/data/explodedView/componentRegistry';

interface InfoPanelProps {
  components: ComponentData[];
  accentColor: string;
}

/**
 * Floating glassmorphism information panel that appears when a component
 * is clicked or hovered. Repositions intelligently based on viewport.
 */
export default function InfoPanel({ components, accentColor }: InfoPanelProps) {
  const activeComponent = useExplodedViewStore((s) => s.activeComponent);
  const isExploded = useExplodedViewStore((s) => s.isExploded);
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'right' | 'left'>('right');

  const data = useMemo(
    () => components.find((c) => c.id === activeComponent),
    [components, activeComponent]
  );

  // Smart positioning — check if panel overflows viewport
  useEffect(() => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    if (rect.right > window.innerWidth - 20) {
      setPosition('left');
    } else {
      setPosition('right');
    }
  }, [activeComponent]);

  if (!data || !isExploded) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        key={data.id}
        initial={{ opacity: 0, x: position === 'right' ? 30 : -30, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: position === 'right' ? 30 : -30, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="exploded-info-panel"
        style={{
          [position === 'right' ? 'right' : 'left']: '1.5rem',
        }}
        role="complementary"
        aria-label={`Information about ${data.name}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3
              className="text-base font-bold"
              style={{ color: 'var(--text-heading)' }}
            >
              {data.name}
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: accentColor, opacity: 0.8 }}
            >
              {data.scientificName}
            </p>
          </div>
          <button
            onClick={() => useExplodedViewStore.getState().setActiveComponent(null)}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-white/10"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close info panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Colored accent line */}
        <div
          className="h-0.5 rounded-full mb-4"
          style={{ background: accentColor, opacity: 0.5 }}
        />

        {/* Scrollable content */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 exploded-info-scroll">
          {/* Function */}
          <InfoSection
            icon={<FlaskConical className="w-3.5 h-3.5" />}
            label="Function"
            color={accentColor}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
              {data.function}
            </p>
          </InfoSection>

          {/* Working Principle */}
          <InfoSection
            icon={<Cpu className="w-3.5 h-3.5" />}
            label="Working Principle"
            color={accentColor}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
              {data.workingPrinciple}
            </p>
          </InfoSection>

          {/* Physics Concept */}
          <InfoSection
            icon={<Lightbulb className="w-3.5 h-3.5" />}
            label="Physics Concept"
            color={accentColor}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
              {data.physicsConcept}
            </p>
          </InfoSection>

          {/* Formula */}
          {data.formula && (
            <InfoSection
              icon={<BookOpen className="w-3.5 h-3.5" />}
              label="Formula"
              color={accentColor}
            >
              <div
                className="py-2 px-3 rounded-lg text-center font-mono text-sm"
                style={{
                  background: `${accentColor}10`,
                  border: `1px solid ${accentColor}30`,
                  color: 'var(--text-heading)',
                }}
              >
                {data.formula}
              </div>
            </InfoSection>
          )}

          {/* Real World Applications */}
          <InfoSection
            icon={<Cpu className="w-3.5 h-3.5" />}
            label="Real World Applications"
            color={accentColor}
          >
            <div className="flex flex-wrap gap-1.5">
              {data.realWorldApps.map((app) => (
                <span
                  key={app}
                  className="text-xs px-2 py-1 rounded-md"
                  style={{
                    background: `${accentColor}12`,
                    color: accentColor,
                    border: `1px solid ${accentColor}25`,
                  }}
                >
                  {app}
                </span>
              ))}
            </div>
          </InfoSection>

          {/* Interesting Facts */}
          <InfoSection
            icon={<Sparkles className="w-3.5 h-3.5" />}
            label="Interesting Facts"
            color={accentColor}
          >
            <ul className="space-y-2">
              {data.interestingFacts.map((fact, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed flex gap-2"
                  style={{ color: 'var(--text-body)' }}
                >
                  <span style={{ color: accentColor }}>•</span>
                  {fact}
                </li>
              ))}
            </ul>
          </InfoSection>
        </div>

        {/* Learn More */}
        <button
          className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
            color: 'white',
          }}
        >
          Learn More
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Reusable section wrapper ── */
function InfoSection({
  icon,
  label,
  color,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
