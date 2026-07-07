'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import SimulationContainer from '../SimulationContainer';
import ParamSlider from '../ParamSlider';

export default function DoubleSlitSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wavelength, setWavelength] = useState(500);
  const [slitSpacing, setSlitSpacing] = useState(0.1);
  const [slitWidth, setSlitWidth] = useState(0.02);
  const [screenDist, setScreenDist] = useState(2);

  const nmToColor = (nm: number): string => {
    if (nm < 380) return '#6C0099';
    if (nm < 440) return `rgb(${Math.round(((440 - nm) / 60) * 180)}, 0, ${Math.round(((nm - 380) / 60) * 255)})`;
    if (nm < 490) return `rgb(0, ${Math.round(((nm - 440) / 50) * 255)}, 255)`;
    if (nm < 510) return `rgb(0, 255, ${Math.round(((510 - nm) / 20) * 255)})`;
    if (nm < 580) return `rgb(${Math.round(((nm - 510) / 70) * 255)}, 255, 0)`;
    if (nm < 645) return `rgb(255, ${Math.round(((645 - nm) / 65) * 255)}, 0)`;
    if (nm <= 780) return `rgb(${Math.round(255 - ((nm - 645) / 135) * 100)}, 0, 0)`;
    return '#990000';
  };

  const waveColor = nmToColor(wavelength);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    const barrierX = w * 0.3;
    const screenX = w * 0.85;

    // Barrier
    ctx.fillStyle = '#374151';
    ctx.fillRect(barrierX - 3, 0, 6, h);

    // Slits
    const slitY1 = h / 2 - slitSpacing * 500;
    const slitY2 = h / 2 + slitSpacing * 500;
    const slitH = slitWidth * 800;
    ctx.clearRect(barrierX - 3, slitY1 - slitH / 2, 6, slitH);
    ctx.clearRect(barrierX - 3, slitY2 - slitH / 2, 6, slitH);
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(barrierX - 3, slitY1 - slitH / 2, 6, slitH);
    ctx.fillRect(barrierX - 3, slitY2 - slitH / 2, 6, slitH);

    // Slit glow
    ctx.shadowColor = waveColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = waveColor;
    ctx.fillRect(barrierX - 1, slitY1 - slitH / 2, 2, slitH);
    ctx.fillRect(barrierX - 1, slitY2 - slitH / 2, 2, slitH);
    ctx.shadowBlur = 0;

    // Incoming wave fronts (left of barrier)
    ctx.strokeStyle = `${waveColor}40`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 15; i++) {
      const x = barrierX - i * 20 - ((Date.now() * 0.02) % 20);
      if (x > 0) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    }

    // Interference pattern on screen
    const lambda = wavelength * 1e-9;
    const d = slitSpacing * 1e-3;
    const a = slitWidth * 1e-3;
    const L = screenDist;

    // Draw diffraction pattern column
    const patternW = 30;
    for (let py = 0; py < h; py++) {
      const y = (py - h / 2) / (h / 2) * 0.05; // position on screen in meters
      const theta = Math.atan2(y, L);

      // Double slit intensity: I = cos²(πd·sinθ/λ) · sinc²(πa·sinθ/λ)
      const beta = (Math.PI * d * Math.sin(theta)) / lambda;
      const alpha = (Math.PI * a * Math.sin(theta)) / lambda;
      const sinc = alpha === 0 ? 1 : Math.sin(alpha) / alpha;
      const intensity = Math.cos(beta) ** 2 * sinc ** 2;

      ctx.fillStyle = waveColor;
      ctx.globalAlpha = intensity;
      ctx.fillRect(screenX - patternW / 2, py, patternW, 1);
    }
    ctx.globalAlpha = 1;

    // Probability density graph (right side)
    const graphX = screenX + patternW;
    const graphW = w - graphX - 10;
    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let py = 0; py < h; py++) {
      const y = (py - h / 2) / (h / 2) * 0.05;
      const theta = Math.atan2(y, L);
      const beta = (Math.PI * d * Math.sin(theta)) / lambda;
      const alpha = (Math.PI * a * Math.sin(theta)) / lambda;
      const sinc = alpha === 0 ? 1 : Math.sin(alpha) / alpha;
      const intensity = Math.cos(beta) ** 2 * sinc ** 2;
      const gx = graphX + intensity * graphW;
      if (py === 0) ctx.moveTo(gx, py); else ctx.lineTo(gx, py);
    }
    ctx.stroke();

    // Wave propagation from slits
    ctx.globalAlpha = 0.15;
    const numArcs = 8;
    for (let i = 1; i <= numArcs; i++) {
      const r = i * 35;
      ctx.strokeStyle = waveColor;
      ctx.lineWidth = 1;
      // From slit 1
      ctx.beginPath();
      ctx.arc(barrierX, slitY1, r, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      // From slit 2
      ctx.beginPath();
      ctx.arc(barrierX, slitY2, r, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText(`λ = ${wavelength} nm`, 15, 25);
    ctx.fillText(`d = ${slitSpacing.toFixed(3)} mm`, 15, 42);
    ctx.fillText(`a = ${slitWidth.toFixed(3)} mm`, 15, 59);

    // Screen label
    ctx.fillStyle = '#64748B';
    ctx.font = '10px monospace';
    ctx.save();
    ctx.translate(screenX - patternW / 2 - 12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('DETECTION SCREEN', -40, 0);
    ctx.restore();
  }, [wavelength, slitSpacing, slitWidth, screenDist, waveColor]);

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
    let animId: number;
    const animate = () => {
      draw();
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  const fringeSpacing = screenDist > 0 ? ((wavelength * 1e-9 * screenDist) / (slitSpacing * 1e-3)) * 1000 : 0;

  return (
    <SimulationContainer
      title="Double-Slit Interference"
      domain="Quantum"
      color="#A855F7"
      description="When coherent light passes through two narrow slits, an interference pattern appears on the screen. The pattern combines double-slit interference fringes modulated by single-slit diffraction."
      formulas={['d·sin(θ) = nλ', 'I = I₀·cos²(πd·sinθ/λ)·sinc²(πa·sinθ/λ)', 'Δy = λL/d']}
      canvas={
        <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      }
      controls={
        <div>
          <ParamSlider label="Wavelength" value={wavelength} min={380} max={780} step={5} unit="nm" color={waveColor} onChange={setWavelength} />
          <div className="w-full h-3 rounded-full mb-4" style={{ background: 'linear-gradient(90deg, violet, blue, cyan, green, yellow, orange, red)' }} />
          <ParamSlider label="Slit Spacing (d)" value={slitSpacing} min={0.02} max={0.3} step={0.005} unit="mm" color="#3B82F6" onChange={setSlitSpacing} />
          <ParamSlider label="Slit Width (a)" value={slitWidth} min={0.005} max={0.1} step={0.001} unit="mm" color="#10B981" onChange={setSlitWidth} />
          <ParamSlider label="Screen Distance" value={screenDist} min={0.5} max={5} step={0.1} unit="m" color="#F59E0B" onChange={setScreenDist} />
        </div>
      }
      observations={
        <div className="space-y-2">
          <div className="p-3 rounded-xl text-center" style={{ background: `${waveColor}15` }}>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Wave Color</div>
            <div className="w-full h-4 rounded-full mt-1" style={{ background: waveColor }} />
          </div>
          {[
            { label: 'Fringe Spacing', value: `${fringeSpacing.toFixed(2)} mm`, color: '#A855F7' },
            { label: 'd/λ ratio', value: `${((slitSpacing * 1e-3) / (wavelength * 1e-9)).toFixed(0)}`, color: '#3B82F6' },
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
