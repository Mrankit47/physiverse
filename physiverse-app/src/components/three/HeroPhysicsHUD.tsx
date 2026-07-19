'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PhysicsMode } from './HeroPhysicsUniverse';
import { Orbit, Zap, Atom, Waves, Sliders, MousePointerClick } from 'lucide-react';
import { useState } from 'react';

interface HeroPhysicsHUDProps {
  currentMode: PhysicsMode;
  onModeChange: (mode: PhysicsMode) => void;
  forceStrength: number;
  onForceChange: (val: number) => void;
  particleSpeed: number;
  onSpeedChange: (val: number) => void;
}

const MODES: {
  id: PhysicsMode;
  label: string;
  icon: typeof Orbit;
  formula: string;
  concept: string;
  color: string;
  hint: string;
}[] = [
  {
    id: 'gravity',
    label: 'Spacetime Gravity',
    icon: Orbit,
    formula: 'G_{μν} = \\frac{8πG}{c^4} T_{μν}',
    concept: "Einstein's General Relativity — Mass warps spacetime geometry",
    color: '#FF5500',
    hint: 'Move cursor to warp spacetime gravity well & bend light photon paths',
  },
  {
    id: 'electromagnetism',
    label: 'Electromagnetism',
    icon: Zap,
    formula: '\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})',
    concept: "Maxwell & Lorentz Electro-Dynamics — Coulomb charge deflection",
    color: '#3B82F6',
    hint: 'Move green charge node to deflect electric vector fields & particle streams',
  },
  {
    id: 'quantum',
    label: 'Quantum Atom',
    icon: Atom,
    formula: '\\hat{H}\\Psi = E\\Psi',
    concept: 'Schrödinger Quantum Wave Mechanics — Atomic orbital clouds',
    color: '#EC4899',
    hint: 'Observe multi-axis Bohr electron orbits and quantum probability clouds',
  },
  {
    id: 'waves',
    label: 'Wave Optics',
    icon: Waves,
    formula: '\\Psi(x,t) = A \\cos(kx - \\omega t)',
    concept: 'Huygens & Young Double-Slit Wave Interference ripples',
    color: '#06B6D4',
    hint: 'Move cursor over wave surface to generate real-time interference ripples',
  },
];

export default function HeroPhysicsHUD({
  currentMode,
  onModeChange,
  forceStrength,
  onForceChange,
  particleSpeed,
  onSpeedChange,
}: HeroPhysicsHUDProps) {
  const [showSettings, setShowSettings] = useState(false);
  const activeInfo = MODES.find((m) => m.id === currentMode) || MODES[0];

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Banner Badge: Active Physics Law & Hint */}
      <div className="flex justify-between items-start w-full">
        <motion.div
          key={currentMode}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl glass border border-[var(--border-default)] shadow-lg backdrop-blur-md max-w-lg"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs"
            style={{ background: activeInfo.color }}
          >
            <activeInfo.icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-heading)]">
                {activeInfo.label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-[var(--color-primary)] font-mono">
                {activeInfo.formula}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
              {activeInfo.hint}
            </p>
          </div>
        </motion.div>

        {/* Quick Settings Toggle Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="pointer-events-auto flex items-center gap-2 px-3.5 py-2.5 rounded-2xl glass hover:bg-[var(--bg-secondary)] border border-[var(--border-default)] text-xs font-semibold text-[var(--text-heading)] transition-all shadow-md"
        >
          <Sliders className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="hidden sm:inline">Physics Controls</span>
        </button>
      </div>

      {/* Settings Panel Modal Popup */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-20 right-4 sm:right-8 w-72 pointer-events-auto glass rounded-2xl p-4 border border-[var(--border-default)] shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-heading)]">
                <Sliders className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Simulation Variables
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-heading)]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1.5 text-[var(--text-muted)]">
                  <span>Field Force Strength</span>
                  <span className="font-mono text-[var(--text-heading)]">{forceStrength.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={forceStrength}
                  onChange={(e) => onForceChange(parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-primary)]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 text-[var(--text-muted)]">
                  <span>Particle Dynamics Speed</span>
                  <span className="font-mono text-[var(--text-heading)]">{particleSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={particleSpeed}
                  onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-primary)]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Mode Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl glass border border-[var(--border-default)] shadow-xl backdrop-blur-xl max-w-full overflow-x-auto">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{
                  background: isActive ? mode.color : 'transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cursor hint */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] glass px-3 py-1.5 rounded-full border border-[var(--border-default)]">
          <MousePointerClick className="w-3.5 h-3.5 text-[var(--color-primary)] animate-pulse" />
          <span>Interactive 3D Canvas</span>
        </div>
      </div>
    </div>
  );
}
