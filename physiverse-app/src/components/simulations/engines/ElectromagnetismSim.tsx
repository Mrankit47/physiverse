'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import SimulationContainer from '../SimulationContainer';
import ParamSlider from '../ParamSlider';

export default function ElectromagnetismSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [current, setCurrent] = useState(5);
  const [wireType, setWireType] = useState<'straight' | 'solenoid'>('straight');
  const [fieldLines, setFieldLines] = useState(8);
  const timeRef = useRef(0);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#1E293B';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const t = timeRef.current;

    if (wireType === 'straight') {
      // Wire (coming out of screen — dot in circle)
      ctx.fillStyle = '#60A5FA';
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Magnetic field lines (concentric circles with arrows)
      const numRings = fieldLines;
      for (let i = 1; i <= numRings; i++) {
        const r = 30 + i * 30;
        const alpha = Math.max(0.1, 1 - i * 0.08);

        ctx.strokeStyle = `rgba(255, 122, 0, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Direction arrows on each ring
        const numArrows = 4;
        for (let j = 0; j < numArrows; j++) {
          const angle = (j * Math.PI * 2) / numArrows + t * 0.5;
          const ax = cx + Math.cos(angle) * r;
          const ay = cy + Math.sin(angle) * r;

          // Arrow direction (counterclockwise for current out of screen)
          const dir = current > 0 ? 1 : -1;
          const tangentAngle = angle + (Math.PI / 2) * dir;

          ctx.fillStyle = `rgba(255, 122, 0, ${alpha})`;
          ctx.save();
          ctx.translate(ax, ay);
          ctx.rotate(tangentAngle);
          ctx.beginPath();
          ctx.moveTo(8, 0);
          ctx.lineTo(-4, -5);
          ctx.lineTo(-4, 5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Field strength indicator
        const B = (2e-7 * Math.abs(current)) / (r * 0.001);
        if (i === 1) {
          ctx.fillStyle = '#94A3B8';
          ctx.font = '10px monospace';
          ctx.fillText(`B = ${B.toFixed(4)} T`, r + cx + 10, cy - 5);
        }
      }

      // Right-hand rule indicator
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px monospace';
      ctx.fillText('⊙ Current (out of screen)', 15, 25);
      ctx.fillText(`I = ${current.toFixed(1)} A`, 15, 42);
      ctx.fillText('B = μ₀I/(2πr)', 15, 59);
    } else {
      // Solenoid
      const coilW = w * 0.5;
      const coilH = h * 0.4;
      const coilX = cx - coilW / 2;
      const coilY = cy - coilH / 2;
      const nTurns = 8;

      // Solenoid coils
      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < nTurns; i++) {
        const x = coilX + (i / (nTurns - 1)) * coilW;
        ctx.beginPath();
        ctx.ellipse(x, cy, 8, coilH / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Internal field lines (horizontal, uniform)
      const numLines = 5;
      for (let i = 0; i < numLines; i++) {
        const y = coilY + (i + 1) * (coilH / (numLines + 1));
        ctx.strokeStyle = `rgba(255, 122, 0, ${0.6 - i * 0.05})`;
        ctx.lineWidth = 1.5;

        // Inside: straight lines
        ctx.beginPath();
        ctx.moveTo(coilX - 20, y);
        ctx.lineTo(coilX + coilW + 20, y);
        ctx.stroke();

        // Arrows
        const dir = current > 0 ? 1 : -1;
        const arrowX = coilX + coilW / 2 + ((t * 30 * dir) % 40) - 20;
        ctx.fillStyle = `rgba(255, 122, 0, 0.7)`;
        ctx.save();
        ctx.translate(arrowX, y);
        ctx.rotate(dir > 0 ? 0 : Math.PI);
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-4, -4);
        ctx.lineTo(-4, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // External field lines (curved, from N to S)
      ctx.strokeStyle = 'rgba(255, 122, 0, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const spread = 40 + i * 30;
        ctx.beginPath();
        ctx.moveTo(coilX + coilW + 20, cy - spread * 0.3);
        ctx.quadraticCurveTo(coilX + coilW + 80 + i * 20, cy - spread, cx, cy - spread - 20);
        ctx.quadraticCurveTo(coilX - 80 - i * 20, cy - spread, coilX - 20, cy - spread * 0.3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(coilX + coilW + 20, cy + spread * 0.3);
        ctx.quadraticCurveTo(coilX + coilW + 80 + i * 20, cy + spread, cx, cy + spread + 20);
        ctx.quadraticCurveTo(coilX - 80 - i * 20, cy + spread, coilX - 20, cy + spread * 0.3);
        ctx.stroke();
      }

      // N/S poles
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#EF4444';
      ctx.fillText('N', coilX + coilW + 25, cy + 6);
      ctx.fillStyle = '#3B82F6';
      ctx.fillText('S', coilX - 30, cy + 6);

      // Info
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px monospace';
      ctx.fillText(`I = ${current.toFixed(1)} A`, 15, 25);
      ctx.fillText('B = μ₀nI', 15, 42);
      ctx.fillText(`n = ${nTurns} turns`, 15, 59);
    }
  }, [current, wireType, fieldLines]);

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
      title="Electromagnetism Simulator"
      domain="Electromagnetism"
      color="#F97316"
      description="A current-carrying wire generates a magnetic field. For a straight wire, the field lines form concentric circles (right-hand rule). Inside a solenoid, the field is approximately uniform."
      formulas={['B = μ₀I/(2πr)', 'B = μ₀nI (solenoid)', 'μ₀ = 4π × 10⁻⁷ T·m/A']}
      canvas={
        <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      }
      controls={
        <div>
          <ParamSlider label="Current" value={current} min={-10} max={10} step={0.5} unit="A" color="#F97316" onChange={setCurrent} />
          {wireType === 'straight' && (
            <ParamSlider label="Field Lines" value={fieldLines} min={3} max={12} step={1} unit="" color="#3B82F6" onChange={setFieldLines} />
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setWireType('straight')}
              className="flex-1 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: wireType === 'straight' ? 'var(--gradient-primary)' : 'transparent',
                color: wireType === 'straight' ? 'white' : 'var(--text-muted)',
                border: wireType === 'straight' ? 'none' : '1px solid var(--border-default)',
              }}
            >
              Straight Wire
            </button>
            <button
              onClick={() => setWireType('solenoid')}
              className="flex-1 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: wireType === 'solenoid' ? 'var(--gradient-primary)' : 'transparent',
                color: wireType === 'solenoid' ? 'white' : 'var(--text-muted)',
                border: wireType === 'solenoid' ? 'none' : '1px solid var(--border-default)',
              }}
            >
              Solenoid
            </button>
          </div>
        </div>
      }
    />
  );
}
