'use client';

import { motion } from 'framer-motion';
import { FlaskConical, Beaker, Ruler, Gauge, Microscope, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

const labs = [
  {
    id: 'ohms-law',
    title: "Ohm's Law Experiment",
    desc: 'Verify V=IR by varying voltage and measuring current through a resistor.',
    domain: 'Electromagnetism',
    color: '#F59E0B',
    icon: Gauge,
    difficulty: 'Beginner',
    duration: '20 min',
    locked: false,
  },
  {
    id: 'pendulum-period',
    title: 'Pendulum Period Measurement',
    desc: 'Measure the period for different lengths and verify T = 2π√(l/g).',
    domain: 'Mechanics',
    color: '#3B82F6',
    icon: Ruler,
    difficulty: 'Beginner',
    duration: '25 min',
    locked: false,
  },
  {
    id: 'refraction',
    title: "Snell's Law Verification",
    desc: 'Trace light rays through glass blocks and measure refraction angles.',
    domain: 'Optics',
    color: '#EC4899',
    icon: Microscope,
    difficulty: 'Intermediate',
    duration: '30 min',
    locked: false,
  },
  {
    id: 'calorimetry',
    title: 'Calorimetry Lab',
    desc: 'Mix hot and cold water to find specific heat capacity.',
    domain: 'Thermodynamics',
    color: '#EF4444',
    icon: Beaker,
    difficulty: 'Intermediate',
    duration: '25 min',
    locked: true,
  },
  {
    id: 'youngs-modulus',
    title: "Young's Modulus",
    desc: 'Measure stress vs strain for a wire and calculate the elastic modulus.',
    domain: 'Mechanics',
    color: '#8B5CF6',
    icon: Ruler,
    difficulty: 'Advanced',
    duration: '35 min',
    locked: true,
  },
  {
    id: 'electromagnetic-induction',
    title: 'Electromagnetic Induction',
    desc: 'Move a magnet through a coil and observe induced EMF.',
    domain: 'Electromagnetism',
    color: '#F97316',
    icon: Gauge,
    difficulty: 'Advanced',
    duration: '30 min',
    locked: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function VirtualLabsPage() {
  return (
    <div className="pt-36 pb-20">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
            <FlaskConical className="w-4 h-4" />
            Hands-On Science
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
            Virtual <span className="gradient-text">Laboratories</span>
          </h1>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Conduct physics experiments with realistic equipment, data collection, and error analysis—all in your browser.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => {
            const Icon = lab.icon;
            return (
              <motion.div key={lab.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className={`card-surface overflow-hidden ${lab.locked ? 'opacity-60' : ''}`}>
                <div className="relative h-36 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${lab.color}15, ${lab.color}05)` }}>
                  <Icon className="w-14 h-14 opacity-25" style={{ color: lab.color }} />
                  {lab.locked && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      <Lock className="w-8 h-8 text-white/60" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2.5 mb-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-semibold px-2 py-0.5 rounded-full text-[10px]" style={{ backgroundColor: `${lab.color}25`, color: lab.color }}>
                      {lab.domain}
                    </span>
                    <span>•</span>
                    <span>{lab.difficulty}</span>
                    <span>•</span>
                    <span>{lab.duration}</span>
                  </div>
                  <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>{lab.title}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{lab.desc}</p>
                  {lab.locked ? (
                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                      <Lock className="w-3 h-3" /> Premium Required
                    </div>
                  ) : (
                    <Link href={`/virtual-labs/${lab.id}`}
                      className="flex items-center gap-1 text-sm font-medium" style={{ color: lab.color }}>
                      Start Experiment <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
