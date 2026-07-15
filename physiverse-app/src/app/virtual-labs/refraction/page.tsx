'use client';

import React, { useState } from 'react';
import { LabLayout } from '@/components/virtual-labs/LabLayout';

export default function RefractionLab() {
  const [incidentAngle, setIncidentAngle] = useState<number>(45); // degrees
  const [refractiveIndex, setRefractiveIndex] = useState<number>(1.5); // Glass

  const n1 = 1.0; // Air
  const n2 = refractiveIndex;

  // Convert to radians
  const iRad = (incidentAngle * Math.PI) / 180;
  
  // Snell's Law: sin(r) = (n1 / n2) * sin(i)
  const sinR = (n1 / n2) * Math.sin(iRad);
  const rRad = Math.asin(sinR);
  const refractedAngle = (rRad * 180) / Math.PI;

  const controls = (
    <div className="space-y-6">
      <div>
        <label className="flex justify-between text-xs font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
          <span>Incident Angle (i)</span>
          <span className="text-[var(--color-primary)]">{incidentAngle}°</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="80" 
          step="1" 
          value={incidentAngle} 
          onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
          className="w-full accent-[var(--color-primary)]"
        />
      </div>

      <div>
        <label className="flex justify-between text-xs font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
          <span>Medium Material (n₂)</span>
          <span className="text-[var(--color-primary)]">n = {refractiveIndex.toFixed(2)}</span>
        </label>
        <select 
          value={refractiveIndex} 
          onChange={(e) => setRefractiveIndex(parseFloat(e.target.value))}
          className="w-full p-2 text-sm rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)]"
          style={{ color: 'var(--text-body)' }}
        >
          <option value="1.33">Water (n=1.33)</option>
          <option value="1.50">Crown Glass (n=1.50)</option>
          <option value="1.66">Flint Glass (n=1.66)</option>
          <option value="2.42">Diamond (n=2.42)</option>
        </select>
      </div>

      <div className="p-4 rounded-xl mt-4 border border-[var(--color-primary)]" style={{ background: 'rgba(255,85,0,0.05)' }}>
        <div className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1">Refracted Angle (r)</div>
        <div className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>{refractedAngle.toFixed(1)}°</div>
      </div>
    </div>
  );

  // SVG dimensions
  const cx = 200;
  const cy = 200;
  const rayLength = 150;

  // Calculate coordinates for incident ray (comes from top)
  // Normal is vertical (Y axis). Angle i is from Y axis.
  const ix = cx - rayLength * Math.sin(iRad);
  const iy = cy - rayLength * Math.cos(iRad);

  // Calculate coordinates for refracted ray (goes into bottom)
  const rx = cx + rayLength * Math.sin(rRad);
  const ry = cy + rayLength * Math.cos(rRad);

  const visualization = (
    <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-md rounded-xl overflow-hidden">
        {/* Background Air */}
        <rect x="0" y="0" width="400" height="200" fill="var(--bg-secondary)" />
        {/* Background Medium */}
        <rect x="0" y="200" width="400" height="200" fill="#3B82F6" opacity="0.15" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="#3B82F6" strokeWidth="2" opacity="0.5" />
        
        {/* Normal Line */}
        <line x1="200" y1="50" x2="200" y2="350" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="5 5" />
        
        {/* Incident Ray */}
        <line x1={ix} y1={iy} x2={cx} y2={cy} stroke="#EF4444" strokeWidth="4" />
        {/* Refracted Ray */}
        <line x1={cx} y1={cy} x2={rx} y2={ry} stroke="#EF4444" strokeWidth="4" />

        {/* Labels */}
        <text x="210" y="100" fill="var(--text-muted)" fontSize="14">Air (n₁ = 1.0)</text>
        <text x="210" y="300" fill="#3B82F6" fontSize="14">Medium (n₂ = {refractiveIndex.toFixed(2)})</text>
        
        {/* Angle Arcs (simplified) */}
        <path d={`M 200 ${cy - 40} A 40 40 0 0 0 ${cx - 40 * Math.sin(iRad)} ${cy - 40 * Math.cos(iRad)}`} fill="none" stroke="var(--text-heading)" strokeWidth="2" />
        <path d={`M 200 ${cy + 40} A 40 40 0 0 1 ${cx + 40 * Math.sin(rRad)} ${cy + 40 * Math.cos(rRad)}`} fill="none" stroke="var(--text-heading)" strokeWidth="2" />

        <text x={cx - 20} y={cy - 50} fill="var(--text-heading)" fontSize="14" fontWeight="bold">i</text>
        <text x={cx + 15} y={cy + 60} fill="var(--text-heading)" fontSize="14" fontWeight="bold">r</text>
      </svg>
    </div>
  );

  const dataPanel = (
    <div className="w-full h-full flex flex-col justify-center px-6">
      <h3 className="text-sm font-bold mb-4 text-[var(--text-muted)]">Data Collection (Snell&apos;s Law)</h3>
      <div className="overflow-x-auto border border-[var(--border-default)] rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-[var(--bg-secondary)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3">Medium</th>
              <th className="px-4 py-3">Angle (i)</th>
              <th className="px-4 py-3">Angle (r)</th>
              <th className="px-4 py-3">sin(i) / sin(r)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border-default)]">
              <td className="px-4 py-3 font-medium text-[var(--text-heading)]">Current Data</td>
              <td className="px-4 py-3">{incidentAngle}°</td>
              <td className="px-4 py-3">{refractedAngle.toFixed(1)}°</td>
              <td className="px-4 py-3 font-bold text-[var(--color-primary)]">{(Math.sin(iRad) / Math.sin(rRad)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-4">
        Notice how the ratio <strong style={{ color: 'var(--text-heading)' }}>sin(i) / sin(r)</strong> constantly equals the refractive index <strong style={{ color: 'var(--text-heading)' }}>n₂ = {refractiveIndex.toFixed(2)}</strong>.
      </p>
    </div>
  );

  return (
    <LabLayout
      title="Snell's Law Verification"
      domain="Optics"
      controls={controls}
      visualization={visualization}
      dataPanel={dataPanel}
    />
  );
}
