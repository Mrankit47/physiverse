'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers,
  Microscope,
  Atom,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Telescope,
  Compass,
  Cpu,
  Zap,
  Activity,
  Ruler,
  Target,
  Loader2,
  Flame,
} from 'lucide-react';
import { useRegistry } from '@/hooks/useRegistry';

const iconMap: Record<string, typeof Microscope> = {
  Microscope,
  Atom,
  RotateCcw,
  Target,
  Compass,
  Cpu,
  Activity,
  Telescope,
  Ruler,
  Zap,
  Layers,
  Flame,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const featured3DModels = [
  {
    id: 'atoms',
    title: 'Interactive 3D Atom',
    desc: '3D Nucleus, Protons, Neutrons, Electrons, orbital trails, and Quark cross-sections.',
    href: '/3d_models/atoms',
    color: '#3B82F6',
    icon: Atom,
    category: 'Quantum Physics',
  },
  {
    id: 'bohr_atom',
    title: 'Bohr Atom Model',
    desc: 'Quantized energy shells, electron excitation, photon emission, and element switching.',
    href: '/3d_models/bohr_atom',
    color: '#F59E0B',
    icon: Zap,
    category: 'Atomic Physics',
  },
  {
    id: 'superNova',
    title: 'Supernova Explosion',
    desc: '3,000 GPU particles, core collapse, shockwave ring, nebula, and spinning Pulsar remnant.',
    href: '/3d_models/superNova',
    color: '#FF4500',
    icon: Flame,
    category: 'Astrophysics',
  },
];

export default function ExplorePage() {
  const { isReady, getByType } = useRegistry();
  const explorePlugins = getByType('exploded-view');

  return (
    <div className="pt-36 pb-20">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(255, 85, 0, 0.1)',
              color: 'var(--color-primary)',
            }}
          >
            <Sparkles className="w-4 h-4" />
            3D Physics Models
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-heading)' }}
          >
            Interactive <span className="gradient-text">3D Visualizations</span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-base"
            style={{ color: 'var(--text-muted)' }}
          >
            Explore real-time 3D physics models and disassemble scientific instruments. Inspect every component and observe quantum & astrophysics phenomena.
          </p>
        </motion.div>

        {/* ════════════════════════════════════════════════════
            FEATURED PHASE 2 MODELS (Atoms, Bohr, Supernova)
           ════════════════════════════════════════════════════ */}
        <div className="mb-16">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <Sparkles className="w-5 h-5 text-amber-500" />
            Featured 3D Models
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured3DModels.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.id} variants={fadeUp} initial="hidden" animate="visible">
                  <Link
                    href={item.href}
                    className="group card-surface block overflow-hidden p-6 transition-all hover:scale-[1.02]"
                    style={{ border: `1px solid ${item.color}30` }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ background: `${item.color}20`, color: item.color }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${item.color}15`, color: item.color }}>
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold mt-2 mb-1" style={{ color: 'var(--text-heading)' }}>
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: item.color }}>
                      Launch 3D Model <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            EXPLODED VIEW INSTRUMENTS
           ════════════════════════════════════════════════════ */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
            <Layers className="w-5 h-5 text-cyan-500" />
            Exploded View Instruments
          </h2>
        </div>

        {!isReady && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--color-primary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading Instrument Registry...</p>
          </div>
        )}

        {/* Grid */}
        {isReady && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {explorePlugins.map((plugin) => {
              const obj = plugin.metadata;
              const Icon = (obj.icon && iconMap[obj.icon]) ? iconMap[obj.icon] : Layers;

              return (
                <motion.div key={obj.id} variants={fadeUp}>
                  <Link
                    href={`/explore/${obj.id}`}
                    id={`explore-card-${obj.id}`}
                    className="explore-inside-card group block"
                  >
                    {/* Visual preview */}
                    <div
                      className="relative h-52 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${obj.color}15, ${obj.color}05)`,
                      }}
                    >
                      <Icon
                        className="w-20 h-20 opacity-15 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"
                        style={{ color: obj.color }}
                      />
                      {/* Floating explode indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
                          style={{ background: obj.color }}
                        >
                          <Layers className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {/* Component count badge */}
                      {obj.componentCount && (
                        <div
                          className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: `${obj.color}15`,
                            color: obj.color,
                            border: `1px solid ${obj.color}30`,
                          }}
                        >
                          {obj.componentCount} parts
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div
                        className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 capitalize"
                        style={{
                          background: `${obj.color}15`,
                          color: obj.color,
                        }}
                      >
                        {obj.category}
                      </div>
                      <h3
                        className="text-lg font-semibold mb-1"
                        style={{ color: 'var(--text-heading)' }}
                      >
                        {obj.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed mb-3 line-clamp-2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {obj.description}
                      </p>
                      <div
                        className="flex items-center gap-1.5 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: obj.color }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Explore in 3D
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Dynamic Plugin Count Footer */}
        {isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-14"
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {explorePlugins.length + 3} 3D models & instruments registered in the system.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
