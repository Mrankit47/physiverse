'use client';

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import SimulationContainer from '../SimulationContainer';
import ParamSlider from '../ParamSlider';

function Body({ position, size, color, emissive }: { position: [number, number, number]; size: number; color: string; emissive?: boolean }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} emissive={emissive ? color : undefined} emissiveIntensity={emissive ? 1 : 0} />
    </mesh>
  );
}

function ForceArrow({ from, to, color }: { from: THREE.Vector3; to: THREE.Vector3; color: string }) {
  const dir = new THREE.Vector3().subVectors(to, from).normalize();
  const len = from.distanceTo(to) * 0.3;
  const end = new THREE.Vector3().addVectors(from, dir.multiplyScalar(len));
  return (
    <Line
      points={[from.toArray() as [number, number, number], end.toArray() as [number, number, number]]}
      color={color}
      lineWidth={3}
    />
  );
}

function GravityScene({ mass1, mass2, distance }: { mass1: number; mass2: number; distance: number }) {
  const G = 6.674;
  const force = (G * mass1 * mass2) / (distance * distance);
  const pos1: [number, number, number] = [-distance / 2, 0, 0];
  const pos2: [number, number, number] = [distance / 2, 0, 0];
  const v1 = new THREE.Vector3(...pos1);
  const v2 = new THREE.Vector3(...pos2);

  return (
    <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 5, 5]} intensity={1} />

        <Body position={pos1} size={Math.cbrt(mass1) * 0.15} color="#3B82F6" />
        <Body position={pos2} size={Math.cbrt(mass2) * 0.15} color="#EF4444" />

        {/* Force vectors */}
        <ForceArrow from={v1} to={v2} color="#FF7A00" />
        <ForceArrow from={v2} to={v1} color="#FF7A00" />

        {/* Distance line */}
        <Line points={[pos1, pos2]} color="#ffffff" lineWidth={1} dashed dashSize={0.1} gapSize={0.1} />

        <Text position={[0, -1.5, 0]} fontSize={0.25} color="#FF7A00" anchorX="center">
          {`F = ${force.toFixed(1)} N`}
        </Text>

        <OrbitControls enablePan={false} />
        <gridHelper args={[20, 20, '#1E293B', '#1E293B']} position={[0, -2, 0]} />
      </Suspense>
    </Canvas>
  );
}

export default function GravityOrbitsSim() {
  const [mass1, setMass1] = useState(50);
  const [mass2, setMass2] = useState(30);
  const [distance, setDistance] = useState(4);

  const G = 6.674;
  const force = (G * mass1 * mass2) / (distance * distance);

  return (
    <SimulationContainer
      title="Gravity & Orbits"
      domain="Mechanics"
      color="#3B82F6"
      description="Newton's Law of Universal Gravitation states that every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between them."
      formulas={['F = G·M·m / r²', 'G = 6.674 × 10⁻¹¹ N·m²/kg²']}
      canvas={<GravityScene mass1={mass1} mass2={mass2} distance={distance} />}
      controls={
        <div>
          <ParamSlider label="Mass 1" value={mass1} min={1} max={100} step={1} unit="kg" color="#3B82F6" onChange={setMass1} />
          <ParamSlider label="Mass 2" value={mass2} min={1} max={100} step={1} unit="kg" color="#EF4444" onChange={setMass2} />
          <ParamSlider label="Distance" value={distance} min={1} max={10} step={0.1} unit="m" color="#10B981" onChange={setDistance} />
        </div>
      }
      observations={
        <div className="space-y-3">
          <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255, 122, 0, 0.1)' }}>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Gravitational Force</div>
            <div className="text-xl font-bold font-mono gradient-text">{force.toFixed(2)} N</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg text-center" style={{ background: 'var(--bg-tertiary)' }}>
              <div style={{ color: 'var(--text-muted)' }}>M₁</div>
              <div className="font-mono font-semibold" style={{ color: '#3B82F6' }}>{mass1} kg</div>
            </div>
            <div className="p-2 rounded-lg text-center" style={{ background: 'var(--bg-tertiary)' }}>
              <div style={{ color: 'var(--text-muted)' }}>M₂</div>
              <div className="font-mono font-semibold" style={{ color: '#EF4444' }}>{mass2} kg</div>
            </div>
          </div>
        </div>
      }
    />
  );
}
