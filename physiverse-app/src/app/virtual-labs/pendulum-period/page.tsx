'use client';

import React, { useState, useMemo } from 'react';
import { LabLayout } from '@/components/virtual-labs/LabLayout';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

export default function PendulumLab() {
  const [length, setLength] = useState<number>(1.0); // meters
  const g = 9.81; // m/s^2

  // T = 2 * PI * sqrt(L/g)
  const period = 2 * Math.PI * Math.sqrt(length / g);
  const periodSquared = Math.pow(period, 2);

  // Generate graph data (Length vs Period Squared)
  const chartData = useMemo(() => {
    const data = [];
    for (let l = 0.1; l <= 2.0; l += 0.1) {
      const p = 2 * Math.PI * Math.sqrt(l / g);
      data.push({
        length: parseFloat(l.toFixed(1)),
        tSquared: parseFloat(Math.pow(p, 2).toFixed(2)),
      });
    }
    return data;
  }, []);

  const controls = (
    <div className="space-y-6">
      <div>
        <label className="flex justify-between text-xs font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
          <span>String Length (L)</span>
          <span className="text-[var(--color-primary)]">{length.toFixed(2)} m</span>
        </label>
        <input 
          type="range" 
          min="0.1" 
          max="2.0" 
          step="0.1" 
          value={length} 
          onChange={(e) => setLength(parseFloat(e.target.value))}
          className="w-full accent-[var(--color-primary)]"
        />
      </div>

      <div className="p-4 rounded-xl mt-4 border border-[var(--color-primary)]" style={{ background: 'rgba(255,85,0,0.05)' }}>
        <div className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1">Calculated Period (T)</div>
        <div className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>{period.toFixed(2)} <span className="text-sm text-[var(--text-muted)]">s</span></div>
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>T² = {periodSquared.toFixed(2)} s²</div>
      </div>
      
      <div className="text-xs text-[var(--text-muted)] p-3 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)]">
        <strong>Formula:</strong> T = 2π√(L/g)<br/>
        Assuming g = 9.81 m/s²
      </div>
    </div>
  );

  const visualization = (
    <div className="w-full h-full flex flex-col items-center justify-start pt-4 relative">
      {/* Ceiling mounting point */}
      <div className="w-24 h-2 bg-[var(--text-heading)] rounded mb-0 relative z-10"></div>
      
      {/* The animated pendulum */}
      <motion.div
        className="flex flex-col items-center relative"
        style={{ transformOrigin: 'top center' }}
        animate={{ rotate: [20, -20] }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: period / 2, // Half-period for one swing direction
          ease: 'easeInOut'
        }}
      >
        {/* String */}
        {/* We map the physical length 0.1m - 2.0m to visual pixels. Let's say 2.0m = 250px. => px = length * 125 */}
        <div 
          className="w-0.5 bg-[var(--text-muted)] opacity-70"
          style={{ height: `${Math.max(40, length * 125)}px` }}
        />
        {/* Bob */}
        <div 
          className="w-10 h-10 rounded-full shadow-lg relative -mt-1"
          style={{ 
            background: 'radial-gradient(circle at 30% 30%, #FF8844, #FF5500)'
          }}
        />
      </motion.div>
    </div>
  );

  const dataPanel = (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold mb-2 text-[var(--text-muted)]">Length vs Period Squared (L vs T²)</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
            <XAxis dataKey="length" stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `${val}m`} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `${val}s²`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--color-primary)' }}
            />
            <Line type="monotone" dataKey="tSquared" stroke="var(--color-primary)" strokeWidth={3} dot={false} isAnimationActive={false} />
            <ReferenceDot x={length} y={parseFloat(periodSquared.toFixed(2))} r={6} fill="var(--color-primary)" stroke="white" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <LabLayout
      title="Pendulum Period Measurement"
      domain="Mechanics"
      controls={controls}
      visualization={visualization}
      dataPanel={dataPanel}
    />
  );
}
