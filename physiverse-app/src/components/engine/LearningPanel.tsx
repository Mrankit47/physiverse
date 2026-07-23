'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — LearningPanel Component
   Reusable theory/content sidebar that displays educational
   content loaded from the visualization plugin.
   ═══════════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  FlaskConical,
  Calculator,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import type { TheoryContent, FormulaData, QuizQuestion } from '@/types/content';
import FormulaCard from './FormulaCard';

interface LearningPanelProps {
  theory?: TheoryContent;
  formulas?: FormulaData[];
  quiz?: QuizQuestion[];
  accentColor?: string;
  onStartQuiz?: () => void;
}

type TabId = 'theory' | 'formulas' | 'applications' | 'references';

export default function LearningPanel({
  theory,
  formulas,
  accentColor = 'var(--color-primary)',
  onStartQuiz,
}: LearningPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('theory');
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const tabs: { id: TabId; label: string; icon: typeof BookOpen }[] = [
    { id: 'theory', label: 'Theory', icon: BookOpen },
    { id: 'formulas', label: 'Formulas', icon: Calculator },
    { id: 'applications', label: 'Applications', icon: FlaskConical },
    { id: 'references', label: 'References', icon: ExternalLink },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
      }}
    >
      {/* Tab bar */}
      <div
        className="flex border-b overflow-x-auto"
        style={{ borderColor: 'var(--border-default)' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors relative"
              style={{
                color: isActive ? accentColor : 'var(--text-muted)',
                background: isActive ? `${accentColor}08` : 'transparent',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="learning-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'theory' && theory && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: 'var(--text-body)' }}
              >
                {theory.summary}
              </p>

              {/* Sections */}
              {theory.sections?.map((section, i) => (
                <div key={i} className="mb-2">
                  <button
                    onClick={() => toggleSection(i)}
                    className="w-full flex items-center justify-between py-2 text-sm font-semibold"
                    style={{ color: 'var(--text-heading)' }}
                  >
                    {section.title}
                    {expandedSections.has(i) ? (
                      <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    ) : (
                      <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.has(i) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p
                          className="text-sm leading-relaxed pb-3"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {section.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Definitions */}
              {theory.definitions && theory.definitions.length > 0 && (
                <div className="mt-4">
                  <h4
                    className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Key Definitions
                  </h4>
                  <div className="space-y-2">
                    {theory.definitions.map((def, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg"
                        style={{ background: 'var(--bg-tertiary)' }}
                      >
                        <span
                          className="text-sm font-semibold"
                          style={{ color: accentColor }}
                        >
                          {def.term}
                        </span>
                        <p
                          className="text-xs mt-1"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {def.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz CTA */}
              {onStartQuiz && (
                <button
                  onClick={onStartQuiz}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: `${accentColor}15`,
                    color: accentColor,
                    border: `1px solid ${accentColor}30`,
                  }}
                >
                  <HelpCircle className="w-4 h-4" />
                  Take the Quiz
                </button>
              )}
            </motion.div>
          )}

          {activeTab === 'formulas' && (
            <motion.div
              key="formulas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {formulas && formulas.length > 0 ? (
                formulas.map((f) => <FormulaCard key={f.id} formula={f} />)
              ) : (
                <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
                  No formulas available for this topic.
                </p>
              )}
            </motion.div>
          )}

          {activeTab === 'applications' && theory?.applications && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ul className="space-y-2">
                {theory.applications.map((app, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm"
                    style={{ color: 'var(--text-body)' }}
                  >
                    <span style={{ color: accentColor }}>•</span>
                    {app}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {activeTab === 'references' && theory?.references && (
            <motion.div
              key="references"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {theory.references.map((ref, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg flex items-start gap-2"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <ExternalLink
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                      {ref.title}
                    </p>
                    {ref.author && (
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {ref.author}
                      </p>
                    )}
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded mt-1 inline-block"
                      style={{
                        background: 'var(--bg-primary)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {ref.type}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
