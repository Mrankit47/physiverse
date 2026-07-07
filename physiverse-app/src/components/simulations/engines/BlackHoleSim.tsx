'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import SimulationContainer from '../SimulationContainer';
import ParamSlider from '../ParamSlider';

export default function BlackHoleSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(10);
  const [spinParam, setSpinParam] = useState(0.5);
  const [accretionRate, setAccretionRate] = useState(0.7);
  const timeRef = useRef(0);
  const animRef = useRef<number>(0);

  const schwarzschildRadius = mass * 2.95; // km (scaled)
  const photonSphereR = schwarzschildRadius * 1.5;
  const iscoR = schwarzschildRadius * 3 * (1 - spinParam * 0.5);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const t = timeRef.current;

    ctx.clearRect(0, 0, w, h);

    // Deep space background
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);

    // Distant stars
    for (let i = 0; i < 200; i++) {
      const sx = ((i * 7919 + 31) % w);
      const sy = ((i * 6271 + 17) % h);
      const brightness = ((i * 3571) % 100) / 100;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.6})`;
      ctx.fillRect(sx, sy, 1, 1);
    }

    const scale = Math.min(w, h) / 15;
    const ehR = schwarzschildRadius * scale * 0.08;
    const psR = photonSphereR * scale * 0.08;

    // Gravitational lensing effect (background distortion rings)
    for (let i = 8; i > 0; i--) {
      const r = ehR + i * scale * 0.25;
      const alpha = 0.03 + (8 - i) * 0.005;
      ctx.strokeStyle = `rgba(100, 130, 255, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Accretion disk (rendered as ellipse with particles)
    const diskInnerR = iscoR * scale * 0.08;
    const diskOuterR = diskInnerR * 3.5;
    const diskTilt = 0.3;

    // Disk glow layers
    for (let layer = 0; layer < 30; layer++) {
      const r = diskInnerR + (layer / 30) * (diskOuterR - diskInnerR);
      const temp = 1 - (layer / 30) * 0.7; // Inner is hotter
      const red = Math.min(255, Math.round(255 * temp));
      const green = Math.min(255, Math.round(200 * temp * 0.6));
      const blue = Math.min(255, Math.round(100 * temp * 0.3));
      const alpha = accretionRate * (0.15 - layer * 0.003);

      ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * diskTilt, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Accretion particles
    const numParticles = Math.floor(accretionRate * 60);
    for (let i = 0; i < numParticles; i++) {
      const angle = (i * 2.399 + t * (1 + i * 0.01)) % (Math.PI * 2);
      const r = diskInnerR + ((i * 1.618) % 1) * (diskOuterR - diskInnerR);
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r * diskTilt;
      const temp = 1 - ((r - diskInnerR) / (diskOuterR - diskInnerR)) * 0.7;
      const particleR = 1 + temp * 2;

      ctx.fillStyle = `rgba(${Math.round(255 * temp)}, ${Math.round(150 * temp)}, ${Math.round(50 * temp)}, ${0.6 * accretionRate})`;
      ctx.beginPath();
      ctx.arc(px, py, particleR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Event horizon (pure black circle with sharp edge)
    const grad = ctx.createRadialGradient(cx, cy, ehR * 0.5, cx, cy, ehR * 1.2);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.8, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, ehR * 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Pure black core
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(cx, cy, ehR, 0, Math.PI * 2);
    ctx.fill();

    // Photon sphere ring
    ctx.strokeStyle = 'rgba(255, 200, 50, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, psR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Relativistic jets (top and bottom)
    if (accretionRate > 0.3) {
      const jetAlpha = (accretionRate - 0.3) * 0.5;
      const jetW = 8 + accretionRate * 10;

      // Top jet
      const jetGrad1 = ctx.createLinearGradient(cx, cy - ehR, cx, 0);
      jetGrad1.addColorStop(0, `rgba(100, 150, 255, ${jetAlpha})`);
      jetGrad1.addColorStop(1, 'rgba(100, 150, 255, 0)');
      ctx.fillStyle = jetGrad1;
      ctx.beginPath();
      ctx.moveTo(cx - jetW / 2, cy - ehR);
      ctx.lineTo(cx - jetW * 0.1, 0);
      ctx.lineTo(cx + jetW * 0.1, 0);
      ctx.lineTo(cx + jetW / 2, cy - ehR);
      ctx.closePath();
      ctx.fill();

      // Bottom jet
      const jetGrad2 = ctx.createLinearGradient(cx, cy + ehR, cx, h);
      jetGrad2.addColorStop(0, `rgba(100, 150, 255, ${jetAlpha})`);
      jetGrad2.addColorStop(1, 'rgba(100, 150, 255, 0)');
      ctx.fillStyle = jetGrad2;
      ctx.beginPath();
      ctx.moveTo(cx - jetW / 2, cy + ehR);
      ctx.lineTo(cx - jetW * 0.1, h);
      ctx.lineTo(cx + jetW * 0.1, h);
      ctx.lineTo(cx + jetW / 2, cy + ehR);
      ctx.closePath();
      ctx.fill();
    }

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText(`M = ${mass} M☉`, 15, 25);
    ctx.fillText(`Rs = ${schwarzschildRadius.toFixed(1)} km`, 15, 42);
    ctx.fillText(`a = ${spinParam.toFixed(2)}`, 15, 59);

    // Radius indicators
    ctx.fillStyle = 'rgba(255, 200, 50, 0.4)';
    ctx.font = '9px monospace';
    ctx.fillText('Photon Sphere', cx + psR + 5, cy - 5);
    ctx.fillStyle = 'rgba(255, 100, 100, 0.4)';
    ctx.fillText('Event Horizon', cx + ehR + 5, cy + 12);
  }, [mass, spinParam, accretionRate, schwarzschildRadius, photonSphereR, iscoR]);

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
    const animate = () => {
      timeRef.current += 0.016;
      draw();
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <SimulationContainer
      title="Black Hole Accretion Disk"
      domain="Astrophysics"
      color="#6366F1"
      description="Visualize a black hole with its accretion disk, photon sphere, and relativistic jets. The event horizon is the boundary beyond which nothing can escape. The accretion disk emits radiation as matter spirals inward."
      formulas={['Rs = 2GM/c²', 'Rph = 3GM/c²', 'RISCO = 6GM/c² (non-spinning)']}
      canvas={
        <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      }
      controls={
        <div>
          <ParamSlider label="Black Hole Mass" value={mass} min={3} max={50} step={1} unit="M☉" color="#6366F1" onChange={setMass} />
          <ParamSlider label="Spin Parameter" value={spinParam} min={0} max={0.998} step={0.01} unit="" color="#EC4899" onChange={setSpinParam} />
          <ParamSlider label="Accretion Rate" value={accretionRate} min={0} max={1} step={0.05} unit="" color="#F59E0B" onChange={setAccretionRate} />
        </div>
      }
      observations={
        <div className="space-y-2">
          {[
            { label: 'Schwarzschild R', value: `${schwarzschildRadius.toFixed(1)} km`, color: '#EF4444' },
            { label: 'Photon Sphere', value: `${photonSphereR.toFixed(1)} km`, color: '#F59E0B' },
            { label: 'ISCO Radius', value: `${iscoR.toFixed(1)} km`, color: '#10B981' },
            { label: 'Spin', value: `${(spinParam * 100).toFixed(0)}%`, color: '#EC4899' },
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
