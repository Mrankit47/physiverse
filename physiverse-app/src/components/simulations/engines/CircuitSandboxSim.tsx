'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import SimulationContainer from '../SimulationContainer';
import ParamSlider from '../ParamSlider';

export default function CircuitSandboxSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(6);
  const [switchOn, setSwitchOn] = useState(true);
  const timeRef = useRef(0);
  const animRef = useRef<number>(0);

  const current = switchOn ? voltage / resistance : 0;
  const power = voltage * current;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#1E293B';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const rectW = w * 0.6;
    const rectH = h * 0.5;
    const x1 = cx - rectW / 2;
    const y1 = cy - rectH / 2;
    const x2 = cx + rectW / 2;
    const y2 = cy + rectH / 2;

    // Circuit wires
    ctx.strokeStyle = switchOn ? '#60A5FA' : '#4B5563';
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Top wire
    ctx.moveTo(x1, y1); ctx.lineTo(x2, y1);
    // Right wire
    ctx.lineTo(x2, y2);
    // Bottom wire
    ctx.lineTo(x1, y2);
    // Left wire (to battery)
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Battery (left side, middle)
    const batX = x1;
    const batY = cy;
    ctx.lineWidth = 2;
    // +
    ctx.strokeStyle = '#EF4444';
    ctx.beginPath(); ctx.moveTo(batX - 12, batY - 15); ctx.lineTo(batX - 12, batY + 15); ctx.stroke();
    // -
    ctx.strokeStyle = '#3B82F6';
    ctx.beginPath(); ctx.moveTo(batX + 8, batY - 8); ctx.lineTo(batX + 8, batY + 8); ctx.stroke();
    // Label
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`${voltage}V`, batX - 30, batY - 22);

    // Resistor (top side, middle)
    const resX = cx;
    const resY = y1;
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    const zigW = 6;
    const zigN = 6;
    const zigStart = resX - zigN * zigW;
    ctx.beginPath();
    ctx.moveTo(zigStart, resY);
    for (let i = 0; i < zigN * 2; i++) {
      const px = zigStart + (i + 1) * zigW;
      const py = resY + (i % 2 === 0 ? -10 : 10);
      ctx.lineTo(px, py);
    }
    ctx.lineTo(zigStart + zigN * 2 * zigW, resY);
    ctx.stroke();
    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px monospace';
    ctx.fillText(`${resistance}Ω`, resX - 12, resY - 18);

    // Bulb (right side, middle)
    const bulbX = x2;
    const bulbY = cy;
    const bulbR = 20;
    if (switchOn && current > 0) {
      ctx.shadowColor = '#FDB813';
      ctx.shadowBlur = 30 + current * 5;
    }
    ctx.beginPath();
    ctx.arc(bulbX, bulbY, bulbR, 0, Math.PI * 2);
    ctx.fillStyle = switchOn ? `rgba(253, 184, 19, ${Math.min(0.3 + current * 0.1, 1)})` : 'rgba(100,100,100,0.2)';
    ctx.fill();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;
    // Filament
    ctx.strokeStyle = switchOn ? '#FDB813' : '#4B5563';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bulbX - 8, bulbY + 8);
    ctx.lineTo(bulbX - 4, bulbY - 6);
    ctx.lineTo(bulbX + 4, bulbY + 6);
    ctx.lineTo(bulbX + 8, bulbY - 8);
    ctx.stroke();

    // Switch (bottom side)
    const swX = cx;
    const swY = y2;
    ctx.fillStyle = switchOn ? '#10B981' : '#EF4444';
    ctx.beginPath();
    ctx.arc(swX, swY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText(switchOn ? 'ON' : 'OFF', swX - 8, swY + 22);

    // Electron flow animation
    if (switchOn && current > 0) {
      const t = timeRef.current;
      const speed = current * 15;
      const numElectrons = Math.min(Math.floor(current * 3), 12);

      ctx.fillStyle = '#60A5FA';
      for (let i = 0; i < numElectrons; i++) {
        const phase = (t * speed + (i * 360) / numElectrons) % 360;
        const frac = phase / 360;
        let ex: number, ey: number;
        const perimeter = 2 * (rectW + rectH);
        const dist = frac * perimeter;

        if (dist < rectW) {
          ex = x1 + dist; ey = y1;
        } else if (dist < rectW + rectH) {
          ex = x2; ey = y1 + (dist - rectW);
        } else if (dist < 2 * rectW + rectH) {
          ex = x2 - (dist - rectW - rectH); ey = y2;
        } else {
          ex = x1; ey = y2 - (dist - 2 * rectW - rectH);
        }

        ctx.beginPath();
        ctx.arc(ex, ey, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Current reading
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText(`I = ${current.toFixed(2)} A`, 15, 25);
    ctx.fillText(`P = ${power.toFixed(1)} W`, 15, 42);
  }, [voltage, resistance, switchOn, current, power]);

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
      title="Circuit Sandbox"
      domain="Electromagnetism"
      color="#EF4444"
      description="Ohm's Law relates voltage, current, and resistance in a simple circuit. Electrons flow from the negative terminal through the circuit. The bulb glows proportionally to the power dissipated."
      formulas={['V = IR', 'P = VI = I²R', 'I = V/R']}
      canvas={
        <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      }
      controls={
        <div>
          <ParamSlider label="Voltage" value={voltage} min={1} max={24} step={0.5} unit="V" color="#F59E0B" onChange={setVoltage} />
          <ParamSlider label="Resistance" value={resistance} min={1} max={20} step={0.5} unit="Ω" color="#8B5CF6" onChange={setResistance} />
          <div className="flex items-center gap-3 mt-4 p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
            <button
              onClick={() => setSwitchOn(!switchOn)}
              className="relative w-12 h-6 rounded-full transition-all"
              style={{ background: switchOn ? '#10B981' : '#374151' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{ left: switchOn ? '26px' : '2px' }}
              />
            </button>
            <span className="text-sm" style={{ color: 'var(--text-body)' }}>
              Circuit {switchOn ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      }
      observations={
        <div className="space-y-2">
          {[
            { label: 'Current', value: `${current.toFixed(2)} A`, color: '#3B82F6' },
            { label: 'Power', value: `${power.toFixed(1)} W`, color: '#F59E0B' },
            { label: 'Voltage', value: `${voltage.toFixed(1)} V`, color: '#EF4444' },
            { label: 'Resistance', value: `${resistance.toFixed(1)} Ω`, color: '#8B5CF6' },
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
