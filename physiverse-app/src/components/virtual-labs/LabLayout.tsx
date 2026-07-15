import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Beaker } from 'lucide-react';

interface LabLayoutProps {
  title: string;
  domain: string;
  controls: ReactNode;
  visualization: ReactNode;
  dataPanel?: ReactNode;
}

export function LabLayout({ title, domain, controls, visualization, dataPanel }: LabLayoutProps) {
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col bg-[var(--bg-tertiary)]">
      <div className="section-container flex-1 flex flex-col max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/virtual-labs" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--color-primary)] mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Labs
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--text-heading)' }}>
              <Beaker className="w-6 h-6 text-[var(--color-primary)]" />
              {title}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full mt-2 inline-block" style={{ background: 'rgba(255,85,0,0.1)', color: 'var(--color-primary)' }}>
              {domain}
            </span>
          </div>
        </div>

        {/* Lab Workspace */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          {/* Sidebar - Controls */}
          <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
            <div className="card-surface p-5 rounded-2xl border border-[var(--border-default)]">
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-[var(--text-muted)]">Experiment Controls</h3>
              {controls}
            </div>
          </div>

          {/* Main Stage & Graphs */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <div className="card-surface p-6 rounded-2xl border border-[var(--border-default)] flex items-center justify-center min-h-[400px] relative overflow-hidden bg-[var(--bg-secondary)]">
              {visualization}
            </div>
            
            {dataPanel && (
              <div className="card-surface p-5 rounded-2xl border border-[var(--border-default)] h-72">
                {dataPanel}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
