'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Play,
  Orbit,
  Waves,
  Cable,
  Eye,
  Binary,
  Telescope,
  Target,
  Compass,
  Magnet,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

const categories = ['All', 'Mechanics', 'Waves', 'Electromagnetism', 'Optics', 'Quantum', 'Astrophysics'];

const simulations = [
  {
    id: 'solar-system',
    title: 'Solar System Simulator',
    desc: 'Explore planetary orbits, adjust masses, and observe Kepler\'s laws in real-time 3D.',
    category: 'Astrophysics',
    icon: Telescope,
    color: '#06B6D4',
    difficulty: 'Intermediate',
    duration: '15 min',
  },
  {
    id: 'gravity-orbits',
    title: 'Gravity & Orbits',
    desc: 'Visualize gravitational force vectors between two bodies. Adjust mass and distance.',
    category: 'Mechanics',
    icon: Orbit,
    color: '#3B82F6',
    difficulty: 'Beginner',
    duration: '10 min',
  },
  {
    id: 'projectile-motion',
    title: 'Projectile Motion',
    desc: 'Launch projectiles at any angle. Observe trajectories with and without air resistance.',
    category: 'Mechanics',
    icon: Target,
    color: '#10B981',
    difficulty: 'Beginner',
    duration: '10 min',
  },
  {
    id: 'pendulum',
    title: 'Pendulum Simulator',
    desc: 'Adjust length, gravity, and friction. Compare pendulums and track energy exchanges.',
    category: 'Mechanics',
    icon: Compass,
    color: '#8B5CF6',
    difficulty: 'Beginner',
    duration: '10 min',
  },
  {
    id: 'wave-on-string',
    title: 'Wave on a String',
    desc: 'Control amplitude, frequency, and tension. Watch superposition and standing waves form.',
    category: 'Waves',
    icon: Waves,
    color: '#F59E0B',
    difficulty: 'Intermediate',
    duration: '12 min',
  },
  {
    id: 'circuit-sandbox',
    title: 'Circuit Sandbox',
    desc: 'Build circuits with batteries, resistors, and bulbs. See electron flow and read virtual meters.',
    category: 'Electromagnetism',
    icon: Cable,
    color: '#EF4444',
    difficulty: 'Intermediate',
    duration: '15 min',
  },
  {
    id: 'optics-ray-tracer',
    title: 'Optics Ray Tracer',
    desc: 'Place lenses and mirrors. Trace principal rays and observe image formation.',
    category: 'Optics',
    icon: Eye,
    color: '#EC4899',
    difficulty: 'Intermediate',
    duration: '12 min',
  },
  {
    id: 'double-slit',
    title: 'Double-Slit Interference',
    desc: 'Adjust slit width, spacing, and wavelength. See quantum diffraction patterns emerge.',
    category: 'Quantum',
    icon: Binary,
    color: '#A855F7',
    difficulty: 'Advanced',
    duration: '15 min',
  },
  {
    id: 'electromagnetism',
    title: 'Electromagnetism Simulator',
    desc: 'Visualize magnetic field lines around wires and solenoids. Apply the right-hand rule.',
    category: 'Electromagnetism',
    icon: Magnet,
    color: '#F97316',
    difficulty: 'Intermediate',
    duration: '12 min',
  },
  {
    id: 'black-hole',
    title: 'Black Hole Accretion Disk',
    desc: 'Explore gravitational lensing, photon orbits, and the event horizon of a black hole.',
    category: 'Astrophysics',
    icon: Sparkles,
    color: '#6366F1',
    difficulty: 'Advanced',
    duration: '20 min',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function SimulationsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = simulations.filter((sim) => {
    const matchesSearch =
      sim.title.toLowerCase().includes(search.toLowerCase()) ||
      sim.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || sim.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-36 pb-20">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(255, 85, 0, 0.1)', color: 'var(--color-primary)' }}
          >
            <Zap className="w-4 h-4" />
            Interactive 3D
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
            Physics <span className="gradient-text">Simulations</span>
          </h1>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Drag parameters, observe real-time changes, and build deep intuition for physics concepts.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search simulations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="sim-search"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-body)',
                paddingLeft: '2.75rem',
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: activeCategory === cat ? 'var(--gradient-primary)' : 'var(--bg-elevated)',
                  color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                  border: activeCategory === cat ? 'none' : '1px solid var(--border-default)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((sim) => {
              const Icon = sim.icon;
              return (
                <motion.div
                  key={sim.id}
                  layout
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Link
                    href={`/simulations/${sim.id}`}
                    id={`sim-card-${sim.id}`}
                    className="group card-surface overflow-hidden block"
                  >
                    {/* Preview */}
                    <div
                      className="relative h-44 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${sim.color}15, ${sim.color}05)` }}
                    >
                      <Icon
                        className="w-16 h-16 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500"
                        style={{ color: sim.color }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl" style={{ background: sim.color }}>
                          <Play className="w-6 h-6 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span
                          className="font-semibold px-2 py-0.5 rounded-full text-[10px]"
                          style={{ backgroundColor: `${sim.color}25`, color: sim.color }}
                        >
                          {sim.category}
                        </span>
                        <span>•</span>
                        <span>{sim.difficulty}</span>
                        <span>•</span>
                        <span>{sim.duration}</span>
                      </div>
                      <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>
                        {sim.title}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {sim.desc}
                      </p>
                      <div className="flex items-center gap-1 mt-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: sim.color }}>
                        Launch Simulation <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>No simulations found</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
