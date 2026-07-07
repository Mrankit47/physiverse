'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight,
  Zap,
  Atom,
  Waves,
  Orbit,
  Lightbulb,
  FlaskConical,
  Calculator,
  Bot,
  Users,
  Star,
  Trophy,
  Target,
  ChevronDown,
  Play,
  Sparkles,
  GraduationCap,
  Globe,
  Cpu,
  Flame,
  Eye,
  Binary,
  Telescope,
  Cable,
  Check,
  Crown,
} from 'lucide-react';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 starfield" style={{ background: 'var(--gradient-hero)' }} />
  ),
});

/* ── Animation Helpers ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
      style={{ paddingTop: '6.5rem', paddingBottom: '6.5rem' }}
    >
      {children}
    </motion.section>
  );
}

/* ── Domain Data ── */
const domains = [
  { icon: Orbit, label: 'Mechanics', desc: 'Forces, motion, energy & momentum', color: '#3B82F6', count: 24 },
  { icon: Flame, label: 'Thermodynamics', desc: 'Heat, entropy & energy transfer', color: '#EF4444', count: 16 },
  { icon: Waves, label: 'Waves & Sound', desc: 'Oscillations, acoustics & resonance', color: '#10B981', count: 18 },
  { icon: Cable, label: 'Electromagnetism', desc: 'Charges, fields & circuits', color: '#F59E0B', count: 22 },
  { icon: Eye, label: 'Optics', desc: 'Light, lenses, mirrors & diffraction', color: '#8B5CF6', count: 14 },
  { icon: Binary, label: 'Modern Physics', desc: 'Quantum mechanics & relativity', color: '#EC4899', count: 20 },
  { icon: Telescope, label: 'Astrophysics', desc: 'Stars, galaxies & black holes', color: '#06B6D4', count: 12 },
];

/* ── Simulation Previews ── */
const simPreviews = [
  { title: 'Solar System Simulator', domain: 'Astrophysics', color: '#06B6D4', icon: Telescope },
  { title: 'Projectile Motion', domain: 'Mechanics', color: '#3B82F6', icon: Target },
  { title: 'Wave on a String', domain: 'Waves', color: '#10B981', icon: Waves },
  { title: 'Circuit Sandbox', domain: 'Electromagnetism', color: '#F59E0B', icon: Cable },
  { title: 'Double-Slit Experiment', domain: 'Quantum', color: '#EC4899', icon: Binary },
  { title: 'Black Hole Accretion', domain: 'Astrophysics', color: '#8B5CF6', icon: Orbit },
];

/* ── Stats ── */
const stats = [
  { value: '10+', label: '3D Simulations' },
  { value: '150+', label: 'Interactive Lessons' },
  { value: '7', label: 'Physics Domains' },
  { value: '∞', label: 'Curiosity Unlocked' },
];

/* ── Pricing ── */
const plans = [
  {
    name: 'Explorer',
    price: 'Free',
    period: '',
    desc: 'Start your physics journey',
    features: ['5 Simulations', '3 Domains', 'Basic Formula Explorer', 'Community Access', 'Daily Quiz'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pioneer',
    price: '$9',
    period: '/month',
    desc: 'Unlock the full universe',
    features: ['All 10+ Simulations', 'All Domains', 'Full Formula Explorer', 'AI Tutor (Unlimited)', 'Virtual Labs', 'Progress Analytics', 'Certificates'],
    cta: 'Go Pioneer',
    popular: true,
  },
  {
    name: 'Institution',
    price: '$49',
    period: '/month',
    desc: 'For schools & universities',
    features: ['Everything in Pioneer', 'Up to 500 Students', 'Teacher Dashboard', 'Custom Assignments', 'Analytics Suite', 'Priority Support', 'API Access'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function HomePage() {
  return (
    <>
      {/* ════════════════════════════════════════════════════
          SECTION 1: Hero Universe
         ════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <HeroScene />

        {/* Content overlay */}
        <div className="relative z-10 section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(255, 122, 0, 0.15)', color: '#FF9E40', border: '1px solid rgba(255, 122, 0, 0.3)' }}>
              <Sparkles className="w-4 h-4" />
              The Future of Physics Education
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
          >
            Explore the
            <br />
            <span className="gradient-text">Physiverse</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-center"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Immersive 3D simulations, interactive formula explorers, and AI-powered tutoring.
            Physics has never been this tangible.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/simulations"
              id="hero-explore-cta"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:shadow-xl"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Play className="w-5 h-5" />
              Explore Simulations
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/learn"
              id="hero-learn-cta"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all"
              style={{ color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}
            >
              <GraduationCap className="w-5 h-5" />
              Start Learning
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-14"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.4)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2: Physics in Real Life
         ════════════════════════════════════════════════════ */}
      <Section id="real-life">
        <div className="section-container">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              Why Physics Matters
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: 'var(--text-heading)' }}>
              Physics is <span className="gradient-text">Everywhere</span>
            </h2>
            <p className="max-w-xl mx-auto leading-relaxed text-sm md:text-base text-center" style={{ color: 'var(--text-muted)' }}>
              From the screen you&apos;re reading to the stars above—every phenomenon follows the laws of physics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'Satellite Navigation', desc: 'GPS relies on Einstein\'s relativity to keep time corrections accurate to nanoseconds.', color: '#3B82F6' },
              { icon: Cpu, title: 'Quantum Computing', desc: 'Superposition and entanglement power the next generation of processors.', color: '#EC4899' },
              { icon: Lightbulb, title: 'Renewable Energy', desc: 'Photovoltaic cells convert sunlight to electricity using the photoelectric effect.', color: '#F59E0B' },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="premium-real-life-card group cursor-pointer"
                style={{
                  '--card-hover-border': `${item.color}60`,
                  '--card-hover-shadow': 'rgba(0, 0, 0, 0.5)',
                  '--card-hover-glow': `${item.color}20`,
                } as React.CSSProperties}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-5 transition-opacity duration-500 group-hover:opacity-20" style={{ background: item.color }} />
                
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30` }}
                >
                  <item.icon className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-bold mb-3 transition-colors duration-300 group-hover:text-white" style={{ color: 'var(--text-heading)' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
          SECTION 3: Explore Domains
         ════════════════════════════════════════════════════ */}
      <Section id="domains" className="relative overflow-hidden">
        <div className="section-container">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              Curriculum
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: 'var(--text-heading)' }}>
              Seven Domains of <span className="gradient-text">Discovery</span>
            </h2>
            <p className="max-w-2xl mx-auto text-center" style={{ color: 'var(--text-muted)' }}>
              A structured journey through every corner of physics—from classical mechanics to the quantum frontier.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {domains.map((domain) => {
              const Icon = domain.icon;
              return (
                <motion.div
                  key={domain.label}
                  variants={fadeUp}
                  className="card-surface p-6 group cursor-pointer relative overflow-hidden"
                >
                  {/* Colored accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: domain.color }} />
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ background: `${domain.color}15`, color: domain.color }}
                  >
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>
                    {domain.label}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                    {domain.desc}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: domain.color }}>
                    {domain.count} lessons
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
          SECTION 4: Featured Simulations
         ════════════════════════════════════════════════════ */}
      <Section id="simulations">
        <div className="section-container">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              Interactive 3D
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: 'var(--text-heading)' }}>
              Simulations That <span className="gradient-text">Come Alive</span>
            </h2>
            <p className="max-w-2xl mx-auto text-center" style={{ color: 'var(--text-muted)' }}>
              Drag, adjust, observe. Every parameter is in your hands.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {simPreviews.map((sim) => {
              const Icon = sim.icon;
              return (
                <motion.div
                  key={sim.title}
                  variants={fadeUp}
                  className="group card-surface overflow-hidden cursor-pointer"
                >
                  {/* Visual preview area */}
                  <div
                    className="relative h-44 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${sim.color}20, ${sim.color}05)` }}
                  >
                    <Icon
                      className="w-16 h-16 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500"
                      style={{ color: sim.color }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
                        style={{ background: sim.color }}
                      >
                        <Play className="w-6 h-6 text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div
                      className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2"
                      style={{ background: `${sim.color}15`, color: sim.color }}
                    >
                      {sim.domain}
                    </div>
                    <h3 className="text-base font-semibold" style={{ color: 'var(--text-heading)' }}>
                      {sim.title}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-10">
            <Link
              href="/simulations"
              id="view-all-sims"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{ color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
            >
              View All Simulations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
          SECTION 5: Virtual Labs Preview
         ════════════════════════════════════════════════════ */}
      <Section id="virtual-labs">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp}>
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                Hands-On Learning
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-5" style={{ color: 'var(--text-heading)' }}>
                Virtual <span className="gradient-text">Laboratories</span>
              </h2>
              <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Step into immersive lab environments where you can assemble circuits, calibrate instruments,
                and run experiments—all with real-time feedback and measurement data.
              </p>
              <div className="space-y-4">
                {[
                  'Guided experiment procedures with safety protocols',
                  'Real-time data collection and graph generation',
                  'Error analysis and measurement uncertainty tools',
                  'Lab report template with auto-filled observations',
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: 'var(--color-success)', color: 'white' }}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-body)' }}>{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/virtual-labs"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <FlaskConical className="w-4 h-4" />
                Enter the Lab
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="relative">
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="mt-6 space-y-4">
                  <div className="text-xs font-mono" style={{ color: 'var(--color-primary)' }}>
                    ▶ Ohm&apos;s Law Experiment
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Voltage: 12V', 'Current: 2A', 'Resistance: 6Ω'].map((val) => (
                      <div key={val} className="p-3 rounded-xl text-center text-xs font-mono" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-heading)' }}>
                        {val}
                      </div>
                    ))}
                  </div>
                  <div className="h-32 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
                    <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                      📊 V-I Graph: Linear relationship confirmed
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-success)' }}>
                    <Check className="w-4 h-4" />
                    Experiment verified — V = IR holds within ±2% error
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
          SECTION 6: Formula Explorer Showcase
         ════════════════════════════════════════════════════ */}
      <Section id="formula-explorer">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp} className="order-2 lg:order-1">
              <div className="glass-card p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold font-mono mb-2" style={{ color: 'var(--text-heading)' }}>
                    F = ma
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Newton&apos;s Second Law of Motion</p>
                </div>
                <div className="space-y-5">
                  {[
                    { label: 'Mass (m)', value: '5.0 kg', min: '0.1', max: '100', color: '#3B82F6' },
                    { label: 'Acceleration (a)', value: '9.8 m/s²', min: '0', max: '50', color: '#10B981' },
                  ].map((param) => (
                    <div key={param.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span style={{ color: 'var(--text-body)' }}>{param.label}</span>
                        <span className="font-mono font-semibold" style={{ color: param.color }}>{param.value}</span>
                      </div>
                      <input type="range" className="w-full" defaultValue="50" />
                    </div>
                  ))}
                  <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255, 122, 0, 0.1)', border: '1px solid rgba(255, 122, 0, 0.2)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Result: Force =</span>
                    <span className="text-2xl font-bold font-mono ml-2 gradient-text">49.0 N</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="order-1 lg:order-2">
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                Interactive Equations
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-5" style={{ color: 'var(--text-heading)' }}>
                Formula <span className="gradient-text">Explorer</span>
              </h2>
              <p className="text-base mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Don&apos;t just memorize formulas—understand them. Drag sliders to see how changing one variable
                affects others in real-time. Watch the graphs respond instantly.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-6 mb-8">
                {['F = ma', 'E = mc²', 'V = IR', 'T = 2π\\/(l/g)', 'λ = h/p'].map((formula) => (
                  <div key={formula} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-default)', color: 'var(--text-heading)' }}>
                    <Calculator className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                    {formula}
                  </div>
                ))}
              </div>
              <Link
                href="/formula-explorer"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Calculator className="w-4 h-4" />
                Open Formula Explorer
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
          SECTION 7: AI Tutor & Community
         ════════════════════════════════════════════════════ */}
      <Section id="ai-community">
        <div className="section-container">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              Smart Learning
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: 'var(--text-heading)' }}>
              AI Tutor & <span className="gradient-text">Community</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* AI Tutor card */}
            <motion.div variants={fadeUp} className="card-surface p-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' }}>
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>
                AI Physics Tutor
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Powered by Google Gemini. Ask any physics question—get step-by-step solutions,
                concept explanations, generated quizzes, and personalized study recommendations.
              </p>
              {/* Chat preview */}
              <div className="space-y-3 p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--gradient-accent)' }}>U</div>
                  <div className="px-3 py-2 rounded-xl text-sm" style={{ background: 'var(--bg-elevated)', color: 'var(--text-body)' }}>
                    Why does time slow down near a black hole?
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                    <Bot className="w-3.5 h-3.5" style={{ color: '#8B5CF6' }} />
                  </div>
                  <div className="px-3 py-2 rounded-xl text-sm" style={{ background: 'var(--bg-elevated)', color: 'var(--text-body)' }}>
                    Great question! This is due to <strong>gravitational time dilation</strong>, predicted by Einstein&apos;s General Relativity...
                  </div>
                </div>
              </div>
              <Link href="/ai-tutor" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold" style={{ color: '#8B5CF6' }}>
                Try AI Tutor <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Community card */}
            <motion.div variants={fadeUp} className="card-surface p-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-heading)' }}>
                Learning Community
              </h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Join thousands of physics enthusiasts. Discuss concepts, share notes,
                compete on leaderboards, and form study groups.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Users, label: 'Study Groups', val: '240+ active groups' },
                  { icon: Trophy, label: 'Leaderboards', val: 'Weekly XP rankings' },
                  { icon: Star, label: 'Badges', val: '50+ achievements' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                    <item.icon className="w-4.5 h-4.5" style={{ color: '#06B6D4' }} />
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>{item.label}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/community" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold" style={{ color: '#06B6D4' }}>
                Join Community <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
          SECTION 8: Pricing
         ════════════════════════════════════════════════════ */}
      <Section id="pricing">
        <div className="section-container">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              Pricing
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: 'var(--text-heading)' }}>
              Choose Your <span className="gradient-text">Orbit</span>
            </h2>
            <p className="max-w-xl mx-auto text-center" style={{ color: 'var(--text-muted)' }}>
              Start free, upgrade when you&apos;re ready to unlock the full universe.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                className={`relative card-surface p-8 ${plan.popular ? 'ring-2' : ''}`}
                style={plan.popular ? { borderColor: 'var(--color-primary)', boxShadow: 'var(--shadow-glow)' } : {}}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1" style={{ background: 'var(--gradient-primary)' }}>
                    <Crown className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>
                  {plan.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold" style={{ color: 'var(--text-heading)' }}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-left" style={{ color: 'var(--text-body)' }}>
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                  style={
                    plan.popular
                      ? { background: 'var(--gradient-primary)', color: 'white' }
                      : { border: '1px solid var(--border-default)', color: 'var(--text-heading)' }
                  }
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
          FINAL CTA
         ════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 starfield opacity-40" />
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Atom className="w-12 h-12 mx-auto mb-6" style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
              Ready to Explore the <span className="gradient-text">Physiverse</span>?
            </h2>
            <p className="text-base max-w-xl mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Join thousands of students transforming the way they learn physics.
            </p>
            <Link
              href="/auth?mode=signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:shadow-xl"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Zap className="w-5 h-5" />
              Get Started for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
