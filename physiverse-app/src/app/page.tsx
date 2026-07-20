'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight,
  BookOpen,
  Orbit,
  FlaskConical,
  Calculator,
  Bot,
  Users,
  Play,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

import { useState } from 'react';
import HeroPhysicsHUD from '@/components/three/HeroPhysicsHUD';
import type { PhysicsMode } from '@/components/three/HeroPhysicsUniverse';

const HeroPhysicsUniverse = dynamic(() => import('@/components/three/HeroPhysicsUniverse'), {
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
const navLinks = [
  { href: '/learn', label: 'Learn', icon: BookOpen, desc: 'Dive into interactive lessons, visual explanations, and structured curricula.' },
  { href: '/simulations', label: 'Simulations', icon: Orbit, desc: 'Interact with physical variables in real-time with stunning 3D mechanics.' },
  { href: '/virtual-labs', label: 'Virtual Labs', icon: FlaskConical, desc: 'Perform scientific experiments virtually with data plotting and measurement tools.' },
  { href: '/formula-explorer', label: 'Formula Explorer', icon: Calculator, desc: 'Play with math directly—adjust parameters to see equations in action.' },
  { href: '/ai-tutor', label: 'AI Tutor', icon: Bot, desc: 'Get instant help, step-by-step guides, and custom quizzes from our AI tutor.' },
  { href: '/community', label: 'Community', icon: Users, desc: 'Share notes, discuss concepts, and climb the leaderboard with peers.' },
];

export default function HomePage() {
  const [physicsMode, setPhysicsMode] = useState<PhysicsMode>('nuclear');
  const [forceStrength, setForceStrength] = useState<number>(1.0);
  const [particleSpeed, setParticleSpeed] = useState<number>(1.0);

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
        <HeroPhysicsUniverse
          mode={physicsMode}
          forceStrength={forceStrength}
          particleSpeed={particleSpeed}
        />

        <HeroPhysicsHUD
          currentMode={physicsMode}
          onModeChange={setPhysicsMode}
          forceStrength={forceStrength}
          onForceChange={setForceStrength}
          particleSpeed={particleSpeed}
          onSpeedChange={setParticleSpeed}
        />

        {/* Content overlay */}
        <div className="relative z-10 section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(255, 85, 0, 0.12)', color: 'var(--color-primary-dark)', border: '1px solid rgba(255, 85, 0, 0.25)' }}>
              <Sparkles className="w-4 h-4" />
              The Future of Physics Education
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-black mb-6 leading-none tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-heading)' }}
          >
            <span className="gradient-text">Physiverse</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-center"
            style={{ color: 'var(--text-body)' }}
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
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold !text-white transition-all hover:shadow-xl"
              style={{ background: 'var(--gradient-primary)', color: '#FFFFFF' }}
            >
              <Play className="w-5 h-5 !text-white" style={{ color: '#FFFFFF' }} />
              <span className="!text-white" style={{ color: '#FFFFFF' }}>Explore Simulations</span>
              <ArrowRight className="w-4 h-4 !text-white group-hover:translate-x-1 transition-transform" style={{ color: '#FFFFFF' }} />
            </Link>
            <Link
              href="/learn"
              id="hero-learn-cta"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:bg-[var(--bg-tertiary)] hover:shadow-md"
              style={{ color: 'var(--text-heading)', border: '1px solid var(--border-default)', background: 'var(--bg-secondary)' }}
            >
              <GraduationCap className="w-5 h-5" />
              Start Learning
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2: Quick Navigation (Navbar Links)
         ════════════════════════════════════════════════════ */}
      <Section id="quick-links" className="relative overflow-hidden">
        <div className="section-container">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              Quick Navigation
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4" style={{ color: 'var(--text-heading)' }}>
              Explore <span className="gradient-text">Physiverse</span>
            </h2>
            <p className="max-w-xl mx-auto leading-relaxed text-sm md:text-base text-center" style={{ color: 'var(--text-muted)' }}>
              Jump straight into our interactive tools, modules, and community spaces.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.label}
                  variants={fadeUp}
                  className="premium-real-life-card group cursor-pointer"
                  style={{
                    '--card-hover-border': 'var(--color-primary-light)',
                    '--card-hover-shadow': 'rgba(0, 0, 0, 0.4)',
                    '--card-hover-glow': 'rgba(255, 85, 0, 0.1)',
                  } as React.CSSProperties}
                >
                  <Link href={link.href} className="block">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ background: 'rgba(255, 85, 0, 0.1)', color: 'var(--color-primary)', border: '1px solid rgba(255, 85, 0, 0.2)' }}
                    >
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 transition-colors duration-300 group-hover:text-[var(--color-primary-light)]" style={{ color: 'var(--text-heading)' }}>
                      {link.label}
                    </h3>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                      {link.desc}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                      Explore Now
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════
          SECTION 3: Infinite Branding Marquee
         ════════════════════════════════════════════════════ */}
      <div 
        className="relative w-full overflow-hidden whitespace-nowrap py-5 select-none"
        style={{ 
          background: 'var(--color-primary)', 
          color: '#FFFFFF',
          borderTop: '1px solid var(--color-primary-dark)',
          borderBottom: '1px solid var(--color-primary-dark)'
        }}
      >
        <div className="inline-flex animate-marquee whitespace-nowrap">
          <span className="text-sm md:text-base font-bold uppercase tracking-wider mx-4">
            PHYSIVERSE • IMMERSIVE 3D SIMULATIONS • INTERACTIVE FORMULA EXPLORERS • AI-POWERED PHYSICS TUTOR • VIRTUAL LABORATORIES • GAMIFIED PHYSICS LEARNING • DISCOVER THE LAWS OF NATURE IN 3D • JOIN THOUSANDS OF CURIOUS MINDS •
          </span>
          <span className="text-sm md:text-base font-bold uppercase tracking-wider mx-4" aria-hidden="true">
            PHYSIVERSE • IMMERSIVE 3D SIMULATIONS • INTERACTIVE FORMULA EXPLORERS • AI-POWERED PHYSICS TUTOR • VIRTUAL LABORATORIES • GAMIFIED PHYSICS LEARNING • DISCOVER THE LAWS OF NATURE IN 3D • JOIN THOUSANDS OF CURIOUS MINDS •
          </span>
        </div>
      </div>
    </>
  );
}
