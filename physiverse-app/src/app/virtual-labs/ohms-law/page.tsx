'use client';

import React, { useState, useMemo } from 'react';
import { LabLayout } from '@/components/virtual-labs/LabLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

export default function OhmsLawLab() {
  const [voltage, setVoltage] = useState<number>(5);
  const [resistance, setResistance] = useState<number>(100);

  const current = (voltage / resistance).toFixed(3); // A
  const currentMA = (voltage / resistance * 1000).toFixed(1); // mA

  // Generate graph data (V vs I for the selected resistor)
  const chartData = useMemo(() => {
    const data = [];
    for (let v = 0; v <= 12; v += 1) {
      data.push({
        voltage: v,
        current: (v / resistance * 1000).toFixed(1), // mA
      });
    }
    return data;
  }, [resistance]);

  const controls = (
    <div className="space-y-6">
      <div>
        <label className="flex justify-between text-xs font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
          <span>Voltage (V)</span>
          <span className="text-[var(--color-primary)]">{voltage} V</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="12" 
          step="0.5" 
          value={voltage} 
          onChange={(e) => setVoltage(parseFloat(e.target.value))}
          className="w-full accent-[var(--color-primary)]"
        />
      </div>

      <div>
        <label className="flex justify-between text-xs font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
          <span>Resistance (R)</span>
          <span className="text-[var(--color-primary)]">{resistance} Ω</span>
        </label>
        <select 
          value={resistance} 
          onChange={(e) => setResistance(parseInt(e.target.value))}
          className="w-full p-2 text-sm rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)]"
          style={{ color: 'var(--text-body)' }}
        >
          <option value="10">10 Ω</option>
          <option value="50">50 Ω</option>
          <option value="100">100 Ω</option>
          <option value="500">500 Ω</option>
          <option value="1000">1000 Ω</option>
        </select>
      </div>

      <div className="p-4 rounded-xl mt-4 border border-[var(--color-primary)]" style={{ background: 'rgba(255,85,0,0.05)' }}>
        <div className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1">Live Reading (Ammeter)</div>
        <div className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>{currentMA} <span className="text-sm text-[var(--text-muted)]">mA</span></div>
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{current} A</div>
      </div>
    </div>
  );

  const visualization = (
    <div className="w-full max-w-md aspect-video relative flex items-center justify-center">
      {/* SVG Circuit Diagram */}
      <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md">
        {/* Wires */}
        <path d="M 100 200 L 100 100 L 200 100" fill="none" stroke="currentColor" strokeWidth="4" className="text-[var(--text-muted)] opacity-50" />
        <path d="M 280 100 L 300 100 L 300 200 L 230 200" fill="none" stroke="currentColor" strokeWidth="4" className="text-[var(--text-muted)] opacity-50" />
        <path d="M 170 200 L 100 200" fill="none" stroke="currentColor" strokeWidth="4" className="text-[var(--text-muted)] opacity-50" />
        
        {/* Resistor (ZigZag) */}
        <path d="M 200 100 L 210 85 L 220 115 L 230 85 L 240 115 L 250 85 L 260 115 L 270 85 L 280 100" fill="none" stroke="#FF5500" strokeWidth="4" />
        <text x="240" y="70" textAnchor="middle" fill="#FF5500" fontSize="16" fontWeight="bold">{resistance} Ω</text>

        {/* Battery */}
        <g transform="translate(100, 200)">
          <line x1="70" y1="-20" x2="70" y2="20" stroke="var(--text-heading)" strokeWidth="4" />
          <line x1="85" y1="-10" x2="85" y2="10" stroke="var(--text-heading)" strokeWidth="6" />
          <line x1="100" y1="-20" x2="100" y2="20" stroke="var(--text-heading)" strokeWidth="4" />
          <line x1="115" y1="-10" x2="115" y2="10" stroke="var(--text-heading)" strokeWidth="6" />
          <text x="92" y="45" textAnchor="middle" fill="var(--text-heading)" fontSize="16" fontWeight="bold">{voltage} V</text>
        </g>

        {/* Ammeter */}
        <g transform="translate(300, 150)">
          <circle cx="0" cy="0" r="25" fill="var(--bg-tertiary)" stroke="var(--color-primary)" strokeWidth="4" />
          <text x="0" y="6" textAnchor="middle" fill="var(--color-primary)" fontSize="20" fontWeight="bold">A</text>
          <rect x="25" y="-30" width="60" height="25" rx="4" fill="var(--color-primary)" />
          <text x="55" y="-12" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{currentMA} mA</text>
        </g>
        
        {/* Current Flow Arrows (Animated based on current) */}
        {voltage > 0 && (
           <g stroke="var(--color-primary)" strokeWidth="2" fill="none">
             <path d="M 100 150 L 100 130" markerEnd="url(#arrow)" />
             <path d="M 300 150 L 300 170" markerEnd="url(#arrow)" />
           </g>
        )}
        
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-primary)" />
          </marker>
        </defs>
      </svg>
    </div>
  );

  const dataPanel = (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold mb-2 text-[var(--text-muted)]">Voltage vs Current (V-I Characteristics)</h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
            <XAxis dataKey="voltage" stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `${val}V`} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `${val}mA`} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--color-primary)' }}
            />
            <Line type="monotone" dataKey="current" stroke="var(--color-primary)" strokeWidth={3} dot={false} isAnimationActive={false} />
            <ReferenceDot x={voltage} y={parseFloat(currentMA)} r={6} fill="var(--color-primary)" stroke="white" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <LabLayout
      title="Ohm's Law Experiment"
      domain="Electromagnetism"
      controls={controls}
      visualization={visualization}
      dataPanel={dataPanel}
    />
  );
}
