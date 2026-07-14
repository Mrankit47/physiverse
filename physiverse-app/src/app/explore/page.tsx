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
} from 'lucide-react';

const exploreObjects = [
  {
    id: 'microscope',
    title: 'Compound Microscope',
    desc: 'Explore 16 components — from the eyepiece to the illuminator. Discover how optics create magnified images.',
    icon: Microscope,
    color: '#8B5CF6',
    componentCount: 16,
    category: 'Optics',
  },
  {
    id: 'atom',
    title: 'Floating Atom',
    desc: 'Dive into the subatomic world — electron shells, protons, neutrons, and orbital paths.',
    icon: Atom,
    color: '#3B82F6',
    componentCount: 7,
    category: 'Modern Physics',
  },
  {
    id: 'gyroscope',
    title: 'Gyroscope',
    desc: 'Disassemble the gimbal rings, rotor, and bearings that give this instrument its extraordinary stability.',
    icon: RotateCcw,
    color: '#10B981',
    componentCount: 6,
    category: 'Mechanics',
  },
  {
    id: 'newtons-cradle',
    title: "Newton's Cradle",
    desc: 'Observe the conservation of momentum and energy. Separate the wires, frame, and elastic steel balls.',
    icon: Target,
    color: '#3B82F6',
    componentCount: 4,
    category: 'Mechanics',
  },
  {
    id: 'foucault-pendulum',
    title: 'Foucault Pendulum',
    desc: 'Explore the simple device that proves Earth\'s rotation. Disassemble the cable, pivot, bob, and azimuth ring base.',
    icon: Compass,
    color: '#8B5CF6',
    componentCount: 5,
    category: 'Mechanics',
  },
  {
    id: 'generator',
    title: 'Electromagnetic Generator',
    desc: 'Convert mechanical energy into electrical energy. Inspect rotor, stator core, copper coils, and magnets.',
    icon: Cpu,
    color: '#EF4444',
    componentCount: 8,
    category: 'Electromagnetism',
  },
  {
    id: 'particle-detector',
    title: 'Particle Detector',
    desc: 'Look inside a high-energy physics tracker. Disassemble silicon pixel sensors, calorimeters, and solenoids.',
    icon: Activity,
    color: '#A855F7',
    componentCount: 6,
    category: 'Modern Physics',
  },
  {
    id: 'telescope',
    title: 'Optical Telescope',
    desc: 'Explore a Cassegrain telescope design. Disassemble primary/secondary mirrors, eyepiece, and Schmidt lens.',
    icon: Telescope,
    color: '#06B6D4',
    componentCount: 7,
    category: 'Optics',
  },
  {
    id: 'optical-bench',
    title: 'Optical Bench',
    desc: 'Study image formation and focal length measurement. Separate the bench rail, lenses, prisms, and laser source.',
    icon: Ruler,
    color: '#8B5CF6',
    componentCount: 7,
    category: 'Optics',
  },
  {
    id: 'laser-setup',
    title: 'Laser Setup',
    desc: 'Disassemble a laser optics setup. Inspect the semiconductor diode, beam expander, filter, and photodiode detector.',
    icon: Zap,
    color: '#EC4899',
    componentCount: 7,
    category: 'Optics',
  },
];

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

export default function ExplorePage() {
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
            <Layers className="w-4 h-4" />
            Exploded View
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-heading)' }}
          >
            Explore <span className="gradient-text">Inside</span>
          </h1>
          <p
            className="max-w-2xl mx-auto text-base"
            style={{ color: 'var(--text-muted)' }}
          >
            Disassemble scientific instruments like an engineer. Inspect every
            component, learn the physics behind each mechanism, and reassemble
            them in 3D.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {exploreObjects.map((obj) => {
            const Icon = obj.icon;
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
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div
                      className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
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
                      className="text-sm leading-relaxed mb-3"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {obj.desc}
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

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-14"
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            More instruments coming soon — Newton&apos;s Cradle, Foucault
            Pendulum, EM Generator, Particle Detector, and more.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
