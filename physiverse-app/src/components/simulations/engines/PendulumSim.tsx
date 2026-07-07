'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import SimulationContainer from '../SimulationContainer';
import ParamSlider from '../ParamSlider';

export default function PendulumSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [length, setLength] = useState(2.0);
  const [gravity, setGravity] = useState(9.8);
  const [damping, setDamping] = useState(0.01);
  const [running, setRunning] = useState(true);
  const stateRef = useRef({ theta: Math.PI / 4, omega: 0 });
  const animRef = useRef<number>(0);

  const period = 2 * Math.PI * Math.sqrt(length / gravity);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    const { theta } = stateRef.current;

    ctx.clearRect(0, 0, w, h);

    // Background
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#1E293B';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Pivot
    const px = w / 2;
    const py = h * 0.15;
    const scale = Math.min(w, h) * 0.25;
    const bobX = px + Math.sin(theta) * length * scale;
    const bobY = py + Math.cos(theta) * length * scale;

    // String
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Pivot mount
    ctx.fillStyle = '#64748B';
    ctx.fillRect(px - 30, py - 4, 60, 8);
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#94A3B8';
    ctx.fill();

    // Bob
    const bobRadius = 18;
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, bobRadius);
    grad.addColorStop(0, '#FF9E40');
    grad.addColorStop(1, '#FF7A00');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.shadowColor = '#FF7A00';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Energy bar
    const KE = 0.5 * length * stateRef.current.omega * stateRef.current.omega;
    const PE = gravity * length * (1 - Math.cos(theta));
    const totalE = Math.max(KE + PE, 0.01);
    const keRatio = KE / totalE;
    const barW = 160;
    const barH = 14;
    const barX = w - barW - 20;
    const barY = 20;

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(barX, barY, barW * keRatio, barH);
    ctx.fillStyle = '#10B981';
    ctx.fillRect(barX + barW * keRatio, barY, barW * (1 - keRatio), barH);

    ctx.font = '10px monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('KE', barX, barY - 4);
    ctx.fillText('PE', barX + barW - 14, barY - 4);

    // Info
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText(`θ = ${((theta * 180) / Math.PI).toFixed(1)}°`, 15, 25);
    ctx.fillText(`T = ${period.toFixed(2)} s`, 15, 42);
    ctx.fillText(`ω = ${stateRef.current.omega.toFixed(2)} rad/s`, 15, 59);
  }, [length, gravity, period]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!running) return;
    const dt = 0.016;
    const animate = () => {
      const { theta, omega } = stateRef.current;
      const alpha = -(gravity / length) * Math.sin(theta) - damping * omega;
      stateRef.current.omega = omega + alpha * dt;
      stateRef.current.theta = theta + stateRef.current.omega * dt;
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, length, gravity, damping, draw]);

  return (
    <SimulationContainer
      title="Pendulum Simulator"
      domain="Mechanics"
      color="#8B5CF6"
      description="A simple pendulum undergoes simple harmonic motion for small angles. The period depends only on length and gravity, not mass. Damping gradually reduces amplitude."
      formulas={['T = 2π√(l/g)', 'α = -(g/l)·sin(θ)', 'KE = ½mv²', 'PE = mgh']}
      canvas={
        <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      }
      controls={
        <div>
          <ParamSlider label="Length" value={length} min={0.5} max={4} step={0.1} unit="m" color="#8B5CF6" onChange={setLength} />
          <ParamSlider label="Gravity" value={gravity} min={1} max={20} step={0.1} unit="m/s²" color="#F59E0B" onChange={setGravity} />
          <ParamSlider label="Damping" value={damping} min={0} max={0.5} step={0.01} unit="" color="#EF4444" onChange={setDamping} />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setRunning(!running)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: running ? '#EF4444' : 'var(--gradient-primary)' }}
            >
              {running ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              onClick={() => { stateRef.current = { theta: Math.PI / 4, omega: 0 }; }}
              className="px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ border: '1px solid var(--border-default)', color: 'var(--text-muted)' }}
            >
              Reset
            </button>
          </div>
        </div>
      }
      observations={
        <div className="space-y-2">
          {[
            { label: 'Period', value: `${period.toFixed(2)} s`, color: '#8B5CF6' },
            { label: 'Frequency', value: `${(1 / period).toFixed(3)} Hz`, color: '#3B82F6' },
            { label: 'Length', value: `${length.toFixed(1)} m`, color: '#10B981' },
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
