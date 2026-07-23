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
  Loader2,
} from 'lucide-react';
import { useRegistry } from '@/hooks/useRegistry';

const categories = ['All', 'Mechanics', 'Waves', 'Electromagnetism', 'Optics', 'Quantum', 'Astrophysics'];

const iconMap: Record<string, typeof Orbit> = {
  Telescope,
  Orbit,
  Target,
  Compass,
  Waves,
  Cable,
  Eye,
  Binary,
  Magnet,
  Sparkles,
  Zap,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function SimulationsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { isReady, getByType } = useRegistry();

  // Filter visualizations registered as 'simulation'
  const simulationPlugins = getByType('simulation');

  const filtered = simulationPlugins.filter((plugin) => {
    const sim = plugin.metadata;
    const matchesSearch =
      sim.title.toLowerCase().includes(search.toLowerCase()) ||
      sim.description.toLowerCase().includes(search.toLowerCase()) ||
      sim.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    const catFormatted = sim.category.charAt(0).toUpperCase() + sim.category.slice(1);
    const matchesCategory =
      activeCategory === 'All' ||
      catFormatted.toLowerCase() === activeCategory.toLowerCase() ||
      sim.tags.some(t => t.toLowerCase() === activeCategory.toLowerCase());

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
            Interactive 3D Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
            Physics <span className="gradient-text">Simulations</span>
          </h1>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Drag parameters, observe real-time changes, and build deep intuition for physics concepts using our extensible visualization engine.
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
              placeholder="Search simulations by keyword, tag, or formula..."
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

        {/* Loading state */}
        {!isReady && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--color-primary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading Visualization Registry...</p>
          </div>
        )}

        {/* Grid */}
        {isReady && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((plugin) => {
                const sim = plugin.metadata;
                const Icon = (sim.icon && iconMap[sim.icon]) ? iconMap[sim.icon] : Orbit;

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
                            className="font-semibold px-2 py-0.5 rounded-full text-[10px] capitalize"
                            style={{ backgroundColor: `${sim.color}25`, color: sim.color }}
                          >
                            {sim.category}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{sim.difficulty}</span>
                          <span>•</span>
                          <span>{sim.estimatedTime}</span>
                        </div>
                        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>
                          {sim.title}
                        </h3>
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                          {sim.description}
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
        )}

        {isReady && filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>No simulations found</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different search term or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
