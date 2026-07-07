'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import SimulationContainer from '../SimulationContainer';
import ParamSlider from '../ParamSlider';

export default function ProjectileMotionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(30);
  const [gravity, setGravity] = useState(9.8);
  const [launched, setLaunched] = useState(false);
  const animRef = useRef<number>(0);
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  const angleRad = (angle * Math.PI) / 180;
  const vx0 = velocity * Math.cos(angleRad);
  const vy0 = velocity * Math.sin(angleRad);
  const tFlight = (2 * vy0) / gravity;
  const maxHeight = (vy0 * vy0) / (2 * gravity);
  const range = (velocity * velocity * Math.sin(2 * angleRad)) / gravity;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    const scale = Math.min(w / (range * 1.3 + 20), (h - 80) / (maxHeight * 1.3 + 20));
    const ox = 40;
    const oy = h - 40;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#1E293B';
    ctx.fillRect(0, 0, w, h);

    // Ground
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(w, oy);
    ctx.stroke();

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let i = 0; i < w; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let i = 0; i < h; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // Trajectory curve (theoretical, no air)
    ctx.strokeStyle = 'rgba(255, 122, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let t = 0; t <= tFlight; t += 0.02) {
      const x = ox + vx0 * t * scale;
      const y = oy - (vy0 * t - 0.5 * gravity * t * t) * scale;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Trail (actual)
    if (trailRef.current.length > 1) {
      ctx.strokeStyle = '#FF7A00';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#FF7A00';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      trailRef.current.forEach((p, i) => {
        const sx = ox + p.x * scale;
        const sy = oy - p.y * scale;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Current position dot
      const last = trailRef.current[trailRef.current.length - 1];
      const lx = ox + last.x * scale;
      const ly = oy - last.y * scale;
      ctx.fillStyle = '#FF7A00';
      ctx.beginPath();
      ctx.arc(lx, ly, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText(`Range: ${range.toFixed(1)} m`, ox + 10, 25);
    ctx.fillText(`Max H: ${maxHeight.toFixed(1)} m`, ox + 10, 42);
    ctx.fillText(`Time: ${tFlight.toFixed(2)} s`, ox + 10, 59);

    // Launch indicator
    if (!launched) {
      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 2;
      const arrowLen = 50;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + arrowLen * Math.cos(angleRad), oy - arrowLen * Math.sin(angleRad));
      ctx.stroke();
      ctx.fillStyle = '#60A5FA';
      ctx.fillText(`${angle}°`, ox + 15, oy - 10);
    }
  }, [angle, angleRad, gravity, range, maxHeight, tFlight, vx0, vy0, launched]);

  const launch = useCallback(() => {
    trailRef.current = [];
    setLaunched(true);
    let t = 0;
    const dt = 0.016;

    const animate = () => {
      t += dt;
      const x = vx0 * t;
      const y = vy0 * t - 0.5 * gravity * t * t;

      if (y < 0 && t > 0.1) {
        setLaunched(false);
        draw();
        return;
      }

      trailRef.current.push({ x, y: Math.max(0, y) });
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
  }, [vx0, vy0, gravity, draw]);

  const reset = () => {
    cancelAnimationFrame(animRef.current);
    trailRef.current = [];
    setLaunched(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
      draw();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  useEffect(() => { if (!launched) draw(); }, [angle, velocity, gravity, launched, draw]);

  return (
    <SimulationContainer
      title="Projectile Motion"
      domain="Mechanics"
      color="#10B981"
      description="A projectile launched at angle θ with velocity v₀ follows a parabolic trajectory under uniform gravity. The horizontal and vertical motions are independent."
      formulas={['x = v₀·cos(θ)·t', 'y = v₀·sin(θ)·t - ½gt²', 'R = v₀²·sin(2θ)/g', 'H = v₀²·sin²(θ)/(2g)']}
      canvas={
        <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      }
      controls={
        <div>
          <ParamSlider label="Launch Angle" value={angle} min={5} max={85} step={1} unit="°" color="#10B981" onChange={(v) => { reset(); setAngle(v); }} />
          <ParamSlider label="Initial Velocity" value={velocity} min={5} max={60} step={1} unit="m/s" color="#3B82F6" onChange={(v) => { reset(); setVelocity(v); }} />
          <ParamSlider label="Gravity" value={gravity} min={1} max={20} step={0.1} unit="m/s²" color="#F59E0B" onChange={(v) => { reset(); setGravity(v); }} />
          <div className="flex gap-2 mt-4">
            <button
              onClick={launch}
              disabled={launched}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'var(--gradient-primary)' }}
            >
              🚀 Launch
            </button>
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
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
            { label: 'Range', value: `${range.toFixed(1)} m`, color: '#10B981' },
            { label: 'Max Height', value: `${maxHeight.toFixed(1)} m`, color: '#3B82F6' },
            { label: 'Flight Time', value: `${tFlight.toFixed(2)} s`, color: '#F59E0B' },
            { label: 'v₀ₓ', value: `${vx0.toFixed(1)} m/s`, color: '#94A3B8' },
            { label: 'v₀ᵧ', value: `${vy0.toFixed(1)} m/s`, color: '#94A3B8' },
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
