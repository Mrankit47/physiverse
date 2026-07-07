'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, SlidersHorizontal, BarChart3, HelpCircle } from 'lucide-react';

interface SimulationContainerProps {
  title: string;
  domain: string;
  color: string;
  description: string;
  formulas: string[];
  canvas: ReactNode;
  controls: ReactNode;
  observations?: ReactNode;
}

export default function SimulationContainer({
  title,
  domain,
  color,
  description,
  formulas,
  canvas,
  controls,
  observations,
}: SimulationContainerProps) {
  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/simulations"
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all hover:bg-[var(--bg-tertiary)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
              {domain}
            </span>
            <h1 className="text-xl md:text-2xl font-bold mt-1" style={{ color: 'var(--text-heading)' }}>
              {title}
            </h1>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid lg:grid-cols-[280px_1fr_320px] gap-5">
          {/* Left Panel: Theory & Formulas */}
          <div className="hidden lg:block space-y-4">
            <div className="card-surface p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4" style={{ color }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
                  Theory
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {description}
              </p>
            </div>
            <div className="card-surface p-5">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4" style={{ color }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
                  Key Formulas
                </h3>
              </div>
              <div className="space-y-2">
                {formulas.map((f) => (
                  <div
                    key={f}
                    className="px-3 py-2 rounded-lg text-sm font-mono text-center"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-heading)' }}
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Canvas */}
          <div className="card-surface overflow-hidden" style={{ minHeight: '500px' }}>
            {canvas}
          </div>

          {/* Right Panel: Controls & Observations */}
          <div className="space-y-4">
            <div className="card-surface p-5">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-4 h-4" style={{ color }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
                  Parameters
                </h3>
              </div>
              {controls}
            </div>
            {observations && (
              <div className="card-surface p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4" style={{ color }} />
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>
                    Observations
                  </h3>
                </div>
                {observations}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
