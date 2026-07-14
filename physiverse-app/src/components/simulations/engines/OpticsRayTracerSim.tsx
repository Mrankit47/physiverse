'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import SimulationContainer from '../SimulationContainer';
import ParamSlider from '../ParamSlider';

export default function OpticsRayTracerSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [focalLength, setFocalLength] = useState(120);
  const [objectDist, setObjectDist] = useState(250);
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');

  const f = lensType === 'convex' ? focalLength : -focalLength;
  const imageDist = (objectDist * f) / (objectDist - f);
  const magnification = -imageDist / objectDist;
  const imageReal = imageDist > 0;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    const cy = h / 2;
    const lensX = w / 2;

    ctx.clearRect(0, 0, w, h);
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-tertiary').trim() || '#1E293B';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Principal axis
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Lens
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 3;
    const lensH = h * 0.7;
    if (lensType === 'convex') {
      ctx.beginPath();
      ctx.ellipse(lensX, cy, 8, lensH / 2, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(lensX, cy - lensH / 2);
      ctx.quadraticCurveTo(lensX + 15, cy, lensX, cy + lensH / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lensX, cy - lensH / 2);
      ctx.quadraticCurveTo(lensX - 15, cy, lensX, cy + lensH / 2);
      ctx.stroke();
    }

    // Focal points
    ctx.fillStyle = '#FF5500';
    ctx.beginPath(); ctx.arc(lensX + f, cy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(lensX - f, cy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px monospace';
    ctx.fillText('F', lensX + f - 3, cy + 18);
    ctx.fillText('F', lensX - f - 3, cy + 18);

    // Object arrow
    const objX = lensX - objectDist;
    const objH = 60;
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, cy);
    ctx.lineTo(objX, cy - objH);
    ctx.stroke();
    // Arrowhead
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.moveTo(objX - 6, cy - objH + 8);
    ctx.lineTo(objX, cy - objH);
    ctx.lineTo(objX + 6, cy - objH + 8);
    ctx.closePath();
    ctx.fill();

    // Image arrow
    const imgX = lensX + imageDist;
    const imgH = objH * magnification;
    if (isFinite(imageDist) && Math.abs(imageDist) < w) {
      ctx.strokeStyle = imageReal ? '#EF4444' : '#EF444480';
      ctx.lineWidth = 3;
      if (!imageReal) ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(imgX, cy);
      ctx.lineTo(imgX, cy - imgH);
      ctx.stroke();
      ctx.setLineDash([]);
      // Arrowhead
      ctx.fillStyle = imageReal ? '#EF4444' : '#EF444480';
      const dir = imgH > 0 ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(imgX - 6, cy - imgH + dir * 8);
      ctx.lineTo(imgX, cy - imgH);
      ctx.lineTo(imgX + 6, cy - imgH + dir * 8);
      ctx.closePath();
      ctx.fill();
    }

    // Principal rays
    const objTop = cy - objH;

    // Ray 1: Parallel to axis → through F'
    ctx.strokeStyle = 'rgba(255, 85, 0, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(objX, objTop);
    ctx.lineTo(lensX, objTop);
    if (lensType === 'convex') {
      ctx.lineTo(lensX + f * 3, cy + ((objTop - cy) / f) * f * -2);
    } else {
      ctx.lineTo(lensX + f * 3, objTop + ((objTop - cy + (objTop - cy) * lensX / Math.abs(f)) / lensX) * f * 3);
    }
    ctx.stroke();

    // Ray 2: Through center (undeviated)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.beginPath();
    ctx.moveTo(objX, objTop);
    const slope = (objTop - cy) / (objX - lensX);
    ctx.lineTo(w, cy + slope * (w - lensX));
    ctx.stroke();

    // Ray 3: Through F → parallel after lens
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.beginPath();
    ctx.moveTo(objX, objTop);
    ctx.lineTo(lensX, cy + (objTop - cy) * (lensX - objX) / (-f - (objX - lensX)));
    ctx.lineTo(w, cy + (objTop - cy) * (lensX - objX) / (-f - (objX - lensX)));
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText(`f = ${Math.abs(f).toFixed(0)} px`, 15, 25);
    ctx.fillText(`u = ${objectDist.toFixed(0)} px`, 15, 42);
    ctx.fillText(`v = ${imageDist.toFixed(0)} px`, 15, 59);
    ctx.fillText(`M = ${magnification.toFixed(2)}`, 15, 76);
  }, [objectDist, lensType, f, imageDist, magnification, imageReal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) { canvas.width = parent.clientWidth; canvas.height = parent.clientHeight; }
      draw();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <SimulationContainer
      title="Optics Ray Tracer"
      domain="Optics"
      color="#EC4899"
      description="Principal ray tracing for thin lenses. Three principal rays determine the image position and size: parallel ray, central ray, and focal ray."
      formulas={['1/f = 1/v - 1/u', 'M = -v/u = hᵢ/hₒ', 'P = 1/f (diopters)']}
      canvas={
        <div className="w-full h-full relative" style={{ minHeight: '500px' }}>
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      }
      controls={
        <div>
          <ParamSlider label="Focal Length" value={focalLength} min={40} max={250} step={5} unit="px" color="#EC4899" onChange={setFocalLength} />
          <ParamSlider label="Object Distance" value={objectDist} min={50} max={400} step={5} unit="px" color="#10B981" onChange={setObjectDist} />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setLensType('convex')}
              className="flex-1 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: lensType === 'convex' ? 'var(--gradient-primary)' : 'transparent',
                color: lensType === 'convex' ? 'white' : 'var(--text-muted)',
                border: lensType === 'convex' ? 'none' : '1px solid var(--border-default)',
              }}
            >
              Convex
            </button>
            <button
              onClick={() => setLensType('concave')}
              className="flex-1 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: lensType === 'concave' ? 'var(--gradient-primary)' : 'transparent',
                color: lensType === 'concave' ? 'white' : 'var(--text-muted)',
                border: lensType === 'concave' ? 'none' : '1px solid var(--border-default)',
              }}
            >
              Concave
            </button>
          </div>
        </div>
      }
      observations={
        <div className="space-y-2">
          {[
            { label: 'Image Distance', value: `${imageDist.toFixed(1)} px`, color: '#EC4899' },
            { label: 'Magnification', value: `${magnification.toFixed(2)}×`, color: '#F59E0B' },
            { label: 'Image Type', value: imageReal ? 'Real, Inverted' : 'Virtual, Upright', color: imageReal ? '#10B981' : '#EF4444' },
            { label: 'Power', value: `${(1000 / Math.abs(f)).toFixed(1)} D`, color: '#3B82F6' },
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
