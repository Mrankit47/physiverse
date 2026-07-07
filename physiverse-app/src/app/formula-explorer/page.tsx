'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Search, Zap, Sparkles } from 'lucide-react';

const formulas = [
  {
    id: 'f-ma',
    name: "Newton's Second Law",
    expression: 'F = ma',
    domain: 'Mechanics',
    color: '#3B82F6',
    vars: [
      { symbol: 'm', label: 'Mass', unit: 'kg', min: 0.1, max: 100, step: 0.1, default: 5 },
      { symbol: 'a', label: 'Acceleration', unit: 'm/s²', min: 0.1, max: 50, step: 0.1, default: 9.8 },
    ],
    compute: (vals: Record<string, number>) => ({ result: vals.m * vals.a, unit: 'N', label: 'Force (F)' }),
    description: 'The net force on an object equals its mass times its acceleration.',
    realWorld: 'Explains why a truck needs more force than a bicycle to achieve the same acceleration.',
  },
  {
    id: 'e-mc2',
    name: 'Mass-Energy Equivalence',
    expression: 'E = mc²',
    domain: 'Modern Physics',
    color: '#EC4899',
    vars: [
      { symbol: 'm', label: 'Mass', unit: 'kg', min: 0.001, max: 10, step: 0.001, default: 1 },
    ],
    compute: (vals: Record<string, number>) => ({ result: vals.m * 9e16, unit: 'J', label: 'Energy (E)' }),
    description: 'Mass and energy are interchangeable. A tiny amount of mass contains enormous energy.',
    realWorld: 'The principle behind nuclear reactors and atomic bombs.',
  },
  {
    id: 'v-ir',
    name: "Ohm's Law",
    expression: 'V = IR',
    domain: 'Electromagnetism',
    color: '#F59E0B',
    vars: [
      { symbol: 'I', label: 'Current', unit: 'A', min: 0.1, max: 20, step: 0.1, default: 2 },
      { symbol: 'R', label: 'Resistance', unit: 'Ω', min: 0.1, max: 100, step: 0.1, default: 6 },
    ],
    compute: (vals: Record<string, number>) => ({ result: vals.I * vals.R, unit: 'V', label: 'Voltage (V)' }),
    description: 'Voltage across a conductor is proportional to the current flowing through it.',
    realWorld: 'Used to design every electronic circuit, from phone chargers to power grids.',
  },
  {
    id: 'pendulum',
    name: 'Pendulum Period',
    expression: 'T = 2π√(l/g)',
    domain: 'Mechanics',
    color: '#8B5CF6',
    vars: [
      { symbol: 'l', label: 'Length', unit: 'm', min: 0.1, max: 10, step: 0.1, default: 2 },
      { symbol: 'g', label: 'Gravity', unit: 'm/s²', min: 1, max: 25, step: 0.1, default: 9.8 },
    ],
    compute: (vals: Record<string, number>) => ({ result: 2 * Math.PI * Math.sqrt(vals.l / vals.g), unit: 's', label: 'Period (T)' }),
    description: 'Period of a simple pendulum depends only on its length and local gravity.',
    realWorld: 'Grandfather clocks use this principle to keep accurate time.',
  },
  {
    id: 'de-broglie',
    name: 'de Broglie Wavelength',
    expression: 'λ = h/p',
    domain: 'Quantum',
    color: '#A855F7',
    vars: [
      { symbol: 'p', label: 'Momentum', unit: 'kg·m/s', min: 1e-30, max: 1e-20, step: 1e-30, default: 1e-24 },
    ],
    compute: (vals: Record<string, number>) => ({ result: 6.626e-34 / vals.p, unit: 'm', label: 'Wavelength (λ)' }),
    description: 'Every particle has a wave nature. Its wavelength is inversely proportional to momentum.',
    realWorld: 'Electron microscopes exploit short de Broglie wavelengths for high resolution.',
  },
  {
    id: 'gravity',
    name: 'Universal Gravitation',
    expression: 'F = GMm/r²',
    domain: 'Mechanics',
    color: '#10B981',
    vars: [
      { symbol: 'M', label: 'Mass 1', unit: 'kg', min: 1, max: 1e6, step: 100, default: 1000 },
      { symbol: 'm', label: 'Mass 2', unit: 'kg', min: 1, max: 1e6, step: 100, default: 500 },
      { symbol: 'r', label: 'Distance', unit: 'm', min: 1, max: 1000, step: 1, default: 10 },
    ],
    compute: (vals: Record<string, number>) => ({ result: (6.674e-11 * vals.M * vals.m) / (vals.r ** 2), unit: 'N', label: 'Force (F)' }),
    description: 'Every mass attracts every other mass. Force is proportional to masses and inversely to distance squared.',
    realWorld: 'Keeps planets in orbit and causes the tides.',
  },
  {
    id: 'kinetic-energy',
    name: 'Kinetic Energy',
    expression: 'KE = ½mv²',
    domain: 'Mechanics',
    color: '#06B6D4',
    vars: [
      { symbol: 'm', label: 'Mass', unit: 'kg', min: 0.1, max: 1000, step: 0.1, default: 10 },
      { symbol: 'v', label: 'Velocity', unit: 'm/s', min: 0.1, max: 100, step: 0.1, default: 5 },
    ],
    compute: (vals: Record<string, number>) => ({ result: 0.5 * vals.m * vals.v ** 2, unit: 'J', label: 'Kinetic Energy' }),
    description: 'The energy an object possesses due to its motion. Doubles when speed doubles? No—it quadruples!',
    realWorld: 'Why car crash severity increases dramatically at higher speeds.',
  },
  {
    id: 'snells-law',
    name: "Snell's Law",
    expression: 'n₁·sin(θ₁) = n₂·sin(θ₂)',
    domain: 'Optics',
    color: '#EF4444',
    vars: [
      { symbol: 'n1', label: 'n₁ (medium 1)', unit: '', min: 1, max: 3, step: 0.01, default: 1 },
      { symbol: 'theta1', label: 'θ₁ (angle)', unit: '°', min: 0, max: 89, step: 1, default: 30 },
      { symbol: 'n2', label: 'n₂ (medium 2)', unit: '', min: 1, max: 3, step: 0.01, default: 1.5 },
    ],
    compute: (vals: Record<string, number>) => {
      const sinTheta2 = (vals.n1 * Math.sin((vals.theta1 * Math.PI) / 180)) / vals.n2;
      const theta2 = sinTheta2 <= 1 ? (Math.asin(sinTheta2) * 180) / Math.PI : NaN;
      return { result: theta2, unit: '°', label: 'θ₂ (refracted)' };
    },
    description: 'Describes how light bends when passing between materials with different refractive indices.',
    realWorld: 'Explains why pools look shallower than they are and how fiber optics work.',
  },
];



export default function FormulaExplorerPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('f-ma');
  const [values, setValues] = useState<Record<string, number>>({});

  const filtered = formulas.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.expression.toLowerCase().includes(search.toLowerCase()) ||
      f.domain.toLowerCase().includes(search.toLowerCase())
  );

  const selected = formulas.find((f) => f.id === selectedId) || formulas[0];

  const currentValues = Object.fromEntries(
    selected.vars.map((v) => [v.symbol, values[`${selected.id}-${v.symbol}`] ?? v.default])
  );

  const result = selected.compute(currentValues);

  return (
    <div className="pt-36 pb-20">
      <div className="section-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: 'rgba(255, 122, 0, 0.1)', color: 'var(--color-primary)' }}>
            <Calculator className="w-4 h-4" />
            Interactive Equations
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
            Formula <span className="gradient-text">Explorer</span>
          </h1>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t just memorize—understand. Change variables and see results update in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Left: Formula List */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search formulas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-body)', paddingLeft: '2.5rem' }}
              />
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filtered.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedId(f.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${selectedId === f.id ? 'ring-2' : ''}`}
                  style={{
                    background: selectedId === f.id ? `${f.color}10` : 'var(--bg-elevated)',
                    border: `1px solid ${selectedId === f.id ? f.color : 'var(--border-default)'}`,
                    borderColor: selectedId === f.id ? f.color : undefined,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${f.color}15`, color: f.color }}>
                      {f.domain}
                    </span>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>{f.name}</div>
                  <div className="text-lg font-mono font-bold mt-1" style={{ color: f.color }}>
                    {f.expression}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Interactive Explorer */}
          <div className="space-y-6">
            {/* Formula display */}
            <motion.div key={selected.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card-surface p-8 text-center">
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${selected.color}15`, color: selected.color }}>
                {selected.domain}
              </span>
              <h2 className="text-xl font-semibold mt-3 mb-2" style={{ color: 'var(--text-heading)' }}>
                {selected.name}
              </h2>
              <div className="text-5xl md:text-6xl font-bold font-mono my-6" style={{ color: selected.color }}>
                {selected.expression}
              </div>
              <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
                {selected.description}
              </p>
            </motion.div>

            {/* Sliders */}
            <div className="card-surface p-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                <Zap className="w-4 h-4" style={{ color: selected.color }} />
                Adjust Variables
              </h3>
              <div className="space-y-5">
                {selected.vars.map((v) => {
                  const key = `${selected.id}-${v.symbol}`;
                  const val = values[key] ?? v.default;
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm" style={{ color: 'var(--text-body)' }}>
                          {v.label} ({v.symbol})
                        </span>
                        <span className="text-sm font-mono font-semibold" style={{ color: selected.color }}>
                          {val < 0.001 ? val.toExponential(2) : val.toFixed(v.step < 0.01 ? 3 : v.step < 1 ? 1 : 0)} {v.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={v.min}
                        max={v.max}
                        step={v.step}
                        value={val}
                        onChange={(e) => setValues({ ...values, [key]: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Result */}
              <div className="mt-6 p-5 rounded-xl text-center" style={{ background: `${selected.color}10`, border: `1px solid ${selected.color}30` }}>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{result.label}</div>
                <div className="text-3xl font-bold font-mono" style={{ color: selected.color }}>
                  {!isNaN(result.result)
                    ? result.result < 0.001 || result.result > 1e6
                      ? result.result.toExponential(3)
                      : result.result.toFixed(2)
                    : 'Total Internal Reflection!'
                  }{' '}
                  <span className="text-lg font-normal" style={{ color: 'var(--text-muted)' }}>
                    {!isNaN(result.result) && result.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Real-world application */}
            <div className="card-surface p-6">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                <Sparkles className="w-4 h-4" style={{ color: '#F59E0B' }} />
                Real-World Application
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {selected.realWorld}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


