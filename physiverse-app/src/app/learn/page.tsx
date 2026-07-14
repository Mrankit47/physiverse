'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, ChevronRight, Lock, CheckCircle, Circle,
  Orbit, Flame, Waves, Cable, Eye, Binary, Telescope,
  ArrowRight, Search,
} from 'lucide-react';

const domains = [
  {
    id: 'mechanics',
    icon: Orbit,
    name: 'Classical Mechanics',
    color: '#3B82F6',
    progress: 45,
    chapters: [
      { name: 'Kinematics', lessons: 6, completed: 6, locked: false },
      { name: 'Newton\'s Laws', lessons: 5, completed: 4, locked: false },
      { name: 'Energy & Work', lessons: 8, completed: 3, locked: false },
      { name: 'Momentum & Collisions', lessons: 5, completed: 0, locked: false },
      { name: 'Rotational Motion', lessons: 7, completed: 0, locked: true },
    ],
  },
  {
    id: 'thermo',
    icon: Flame,
    name: 'Thermodynamics',
    color: '#EF4444',
    progress: 20,
    chapters: [
      { name: 'Temperature & Heat', lessons: 5, completed: 3, locked: false },
      { name: 'Laws of Thermodynamics', lessons: 6, completed: 0, locked: false },
      { name: 'Entropy & Engines', lessons: 5, completed: 0, locked: true },
    ],
  },
  {
    id: 'waves',
    icon: Waves,
    name: 'Waves & Sound',
    color: '#10B981',
    progress: 10,
    chapters: [
      { name: 'Wave Properties', lessons: 4, completed: 2, locked: false },
      { name: 'Sound Waves', lessons: 5, completed: 0, locked: false },
      { name: 'Resonance & Superposition', lessons: 4, completed: 0, locked: true },
    ],
  },
  {
    id: 'em',
    icon: Cable,
    name: 'Electromagnetism',
    color: '#F59E0B',
    progress: 0,
    chapters: [
      { name: 'Electric Charge & Fields', lessons: 6, completed: 0, locked: false },
      { name: 'DC Circuits', lessons: 5, completed: 0, locked: false },
      { name: 'Magnetism', lessons: 5, completed: 0, locked: true },
      { name: 'Electromagnetic Induction', lessons: 4, completed: 0, locked: true },
    ],
  },
  {
    id: 'optics',
    icon: Eye,
    name: 'Optics',
    color: '#EC4899',
    progress: 0,
    chapters: [
      { name: 'Reflection & Mirrors', lessons: 4, completed: 0, locked: false },
      { name: 'Refraction & Lenses', lessons: 5, completed: 0, locked: false },
      { name: 'Diffraction & Interference', lessons: 4, completed: 0, locked: true },
    ],
  },
  {
    id: 'modern',
    icon: Binary,
    name: 'Modern Physics',
    color: '#A855F7',
    progress: 0,
    chapters: [
      { name: 'Special Relativity', lessons: 5, completed: 0, locked: false },
      { name: 'Quantum Mechanics', lessons: 6, completed: 0, locked: true },
      { name: 'Nuclear Physics', lessons: 4, completed: 0, locked: true },
    ],
  },
  {
    id: 'astro',
    icon: Telescope,
    name: 'Astrophysics',
    color: '#06B6D4',
    progress: 0,
    chapters: [
      { name: 'Stellar Physics', lessons: 4, completed: 0, locked: false },
      { name: 'Galaxies & Cosmology', lessons: 5, completed: 0, locked: true },
      { name: 'Black Holes', lessons: 3, completed: 0, locked: true },
    ],
  },
];

export default function LearnPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>('mechanics');

  const filtered = domains.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.chapters.some((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-36 pb-20">
      <div className="section-container max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(255, 85, 0, 0.1)', color: 'var(--color-primary)' }}>
            <BookOpen className="w-4 h-4" />
            Structured Curriculum
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
            Learn <span className="gradient-text">Physics</span>
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            A structured journey from classical mechanics to the quantum frontier.
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search domains or chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-body)', paddingLeft: '2.75rem' }}
          />
        </div>

        {/* Domain Accordion */}
        <div className="space-y-4">
          {filtered.map((domain) => {
            const Icon = domain.icon;
            const isExpanded = expanded === domain.id;
            const totalLessons = domain.chapters.reduce((s, c) => s + c.lessons, 0);
            const completedLessons = domain.chapters.reduce((s, c) => s + c.completed, 0);

            return (
              <motion.div key={domain.id} layout className="card-surface overflow-hidden">
                {/* Domain header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : domain.id)}
                  className="w-full flex items-center gap-4 p-5 text-left"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${domain.color}15`, color: domain.color }}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold" style={{ color: 'var(--text-heading)' }}>
                      {domain.name}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 h-1.5 rounded-full max-w-[200px]" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full" style={{ width: `${domain.progress}%`, background: domain.color }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        {completedLessons}/{totalLessons}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className="w-5 h-5 transition-transform"
                    style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(90deg)' : '' }}
                  />
                </button>

                {/* Chapters */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5"
                  >
                    <div className="space-y-2 pl-6 border-l-2" style={{ borderColor: `${domain.color}30` }}>
                      {domain.chapters.map((ch) => {
                        const allDone = ch.completed === ch.lessons;
                        const started = ch.completed > 0;
                        return (
                          <Link
                            key={ch.name}
                            href={ch.locked ? '#' : `/learn/${domain.id}`}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all ${ch.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--bg-tertiary)]'}`}
                          >
                            {ch.locked ? (
                              <Lock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                            ) : allDone ? (
                              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }} />
                            ) : (
                              <Circle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: started ? domain.color : 'var(--text-muted)' }} />
                            )}
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                              <span className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                                {ch.name}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                • {ch.completed}/{ch.lessons} lessons
                              </span>
                            </div>
                            {!ch.locked && <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
