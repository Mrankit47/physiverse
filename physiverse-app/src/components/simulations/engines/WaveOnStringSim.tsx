'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import SimulationContainer from '../SimulationContainer';
import ParamSlider from '../ParamSlider';

export default function WaveOnStringSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [amplitude, setAmplitude] = useState(40);
  const [frequency, setFrequency] = useState(2);
  const [damping, setDamping] = useState(0.02);
  const [tension, setTension] = useState(5);
  const [waveType, setWaveType] = useState<'transverse' | 'standing'>('transverse');
  const [running, setRunning] = useState(true);
  const timeRef = useRef(0);
  const animRef = useRef<number>(0);

  const wavelength = tension * 0.6;
  const waveSpeed = frequency * wavelength;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#1E293B';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // Center line
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Wave
    const k = (2 * Math.PI) / (wavelength * 8);
    const omega = 2 * Math.PI * frequency;
    const t = timeRef.current;

    ctx.strokeStyle = '#FF5500';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#FF5500';
    ctx.shadowBlur = 10;
    ctx.beginPath();

    for (let x = 0; x < w; x++) {
      const dampFactor = Math.exp(-damping * x * 0.01);
      let y: number;

      if (waveType === 'transverse') {
        y = amplitude * dampFactor * Math.sin(k * x - omega * t);
      } else {
        // Standing wave: sin(kx)cos(ωt)
        y = amplitude * dampFactor * Math.sin(k * x * 3) * Math.cos(omega * t);
      }

      const py = cy - y;
      if (x === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Second wave (if standing, show component)
    if (waveType === 'standing') {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const dampFactor = Math.exp(-damping * x * 0.01);
        const y = amplitude * dampFactor * Math.sin(k * x * 3 - omega * t);
        const py = cy - y;
        if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const dampFactor = Math.exp(-damping * x * 0.01);
        const y = amplitude * dampFactor * Math.sin(k * x * 3 + omega * t);
        const py = cy - y;
        if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
      }
      ctx.stroke();
    }

    // Nodes for standing wave
    if (waveType === 'standing') {
      ctx.fillStyle = '#EF4444';
      const nodeSpacing = w / (3 * 2);
      for (let n = 0; n <= 6; n++) {
        const nx = n * nodeSpacing;
        ctx.beginPath();
        ctx.arc(nx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Info
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText(`λ = ${wavelength.toFixed(1)} units`, 15, 25);
    ctx.fillText(`v = ${waveSpeed.toFixed(1)} units/s`, 15, 42);
    ctx.fillText(`f = ${frequency.toFixed(1)} Hz`, 15, 59);
  }, [amplitude, frequency, damping, wavelength, waveSpeed, waveType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) { canvas.width = parent.clientWidth; canvas.height = parent.clientHeight; }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!running) return;
    const animate = () => {
      timeRef.current += 0.016;
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, draw]);

  return (
    <SimulationContainer
      title="Wave on a String"
      domain="Waves"
      color="#F59E0B"
      description="Transverse waves travel along a string with velocity determined by tension and linear density. Standing waves form when two waves of equal amplitude and frequency travel in opposite directions."
      formulas={['v = fλ', 'y = A·sin(kx - ωt)', 'v = √(T/μ)', 'Standing: y = 2A·sin(kx)·cos(ωt)']}
      canvas={
        <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      }
      controls={
        <div>
          <ParamSlider label="Amplitude" value={amplitude} min={5} max={80} step={1} unit="px" color="#FF5500" onChange={setAmplitude} />
          <ParamSlider label="Frequency" value={frequency} min={0.5} max={8} step={0.1} unit="Hz" color="#3B82F6" onChange={setFrequency} />
          <ParamSlider label="Damping" value={damping} min={0} max={0.1} step={0.005} unit="" color="#EF4444" onChange={setDamping} />
          <ParamSlider label="Tension" value={tension} min={1} max={10} step={0.1} unit="N" color="#10B981" onChange={setTension} />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setWaveType('transverse')}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: waveType === 'transverse' ? 'var(--gradient-primary)' : 'transparent',
                color: waveType === 'transverse' ? 'white' : 'var(--text-muted)',
                border: waveType === 'transverse' ? 'none' : '1px solid var(--border-default)',
              }}
            >
              Transverse
            </button>
            <button
              onClick={() => setWaveType('standing')}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: waveType === 'standing' ? 'var(--gradient-primary)' : 'transparent',
                color: waveType === 'standing' ? 'white' : 'var(--text-muted)',
                border: waveType === 'standing' ? 'none' : '1px solid var(--border-default)',
              }}
            >
              Standing
            </button>
          </div>
          <button
            onClick={() => setRunning(!running)}
            className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: running ? '#EF4444' : 'var(--gradient-primary)' }}
          >
            {running ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
      }
      observations={
        <div className="space-y-2">
          {[
            { label: 'Wavelength', value: `${wavelength.toFixed(1)} units`, color: '#F59E0B' },
            { label: 'Wave Speed', value: `${waveSpeed.toFixed(1)} u/s`, color: '#10B981' },
            { label: 'Period', value: `${(1 / frequency).toFixed(3)} s`, color: '#3B82F6' },
          ].map((obs) => (
            <div key={obs.label} className="flex justify-between text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{obs.label}</span>
              <span className="font-mono font-semibold" style={{ color: obs.color }}>{obs.value}</span>
            </div>
          ))}
        </div>
      }
    />
  );
}
