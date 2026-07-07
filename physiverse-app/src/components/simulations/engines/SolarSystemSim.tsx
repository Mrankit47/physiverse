'use client';

import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import SimulationContainer from '../SimulationContainer';
import ParamSlider from '../ParamSlider';

/* ── Planet Data ── */
const planetData = [
  { name: 'Mercury', baseRadius: 1.5, size: 0.08, color: '#A0A0A0', speed: 4.15 },
  { name: 'Venus', baseRadius: 2.2, size: 0.12, color: '#E8CDA0', speed: 1.62 },
  { name: 'Earth', baseRadius: 3.0, size: 0.13, color: '#4A90D9', speed: 1.0 },
  { name: 'Mars', baseRadius: 3.8, size: 0.1, color: '#C1440E', speed: 0.53 },
  { name: 'Jupiter', baseRadius: 5.5, size: 0.35, color: '#C88B3A', speed: 0.084 },
  { name: 'Saturn', baseRadius: 7.0, size: 0.3, color: '#E8D5A0', speed: 0.034 },
];

function Sun() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.03;
    ref.current.scale.set(s, s, s);
  });
  return (
    <Float speed={1} rotationIntensity={0.2}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={5} color="#FDB813" distance={20} />
    </Float>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Planet({ name, radius, size, color, speed, timeScale, showLabels }: {
  name: string; radius: number; size: number; color: string; speed: number; timeScale: number; showLabels: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const trailRef = useRef<THREE.Points>(null!);
  const positions = useRef<number[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed * timeScale * 0.3;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    ref.current.position.set(x, 0, z);

    // Trail
    positions.current.push(x, 0, z);
    if (positions.current.length > 300) positions.current.splice(0, 3);
    if (trailRef.current) {
      const geom = trailRef.current.geometry;
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions.current, 3));
      geom.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.7} />
        {showLabels && (
          <Text position={[0, size + 0.15, 0]} fontSize={0.12} color="white" anchorX="center">
            {name}
          </Text>
        )}
      </mesh>
      <points ref={trailRef}>
        <bufferGeometry />
        <pointsMaterial color={color} size={0.02} transparent opacity={0.4} />
      </points>
    </>
  );
}

function SolarSystemScene({ timeScale, showLabels }: { timeScale: number; showLabels: boolean }) {
  return (
    <Canvas camera={{ position: [0, 8, 12], fov: 50 }} gl={{ antialias: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} />
        <Stars radius={40} depth={60} count={2000} factor={3} fade speed={0.3} />
        <Sun />
        {planetData.map((p) => (
          <React.Fragment key={p.name}>
            <OrbitRing radius={p.baseRadius} />
            <Planet
              name={p.name}
              radius={p.baseRadius}
              size={p.size}
              color={p.color}
              speed={p.speed}
              timeScale={timeScale}
              showLabels={showLabels}
            />
          </React.Fragment>
        ))}
        <OrbitControls enablePan minDistance={3} maxDistance={25} />
      </Suspense>
    </Canvas>
  );
}

import React from 'react';

export default function SolarSystemSim() {
  const [timeScale, setTimeScale] = useState(1.0);
  const [showLabels, setShowLabels] = useState(true);

  return (
    <SimulationContainer
      title="Solar System Simulator"
      domain="Astrophysics"
      color="#06B6D4"
      description="Explore our solar system with real proportional orbital speeds. Observe how inner planets orbit faster than outer planets — a direct consequence of Kepler's Third Law: T² ∝ a³."
      formulas={['T² = (4π²/GM) · a³', 'F = GMm/r²', 'v = √(GM/r)']}
      canvas={<SolarSystemScene timeScale={timeScale} showLabels={showLabels} />}
      controls={
        <div>
          <ParamSlider
            label="Time Scale"
            value={timeScale}
            min={0.1}
            max={5}
            step={0.1}
            unit="×"
            color="#06B6D4"
            onChange={setTimeScale}
          />
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="show-labels"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="show-labels" className="text-sm" style={{ color: 'var(--text-body)' }}>
              Show Planet Labels
            </label>
          </div>
        </div>
      }
      observations={
        <div className="space-y-2">
          {planetData.map((p) => (
            <div key={p.name} className="flex justify-between text-xs px-2 py-1.5 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                <span style={{ color: 'var(--text-body)' }}>{p.name}</span>
              </span>
              <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                {(1 / p.speed).toFixed(2)} yr
              </span>
            </div>
          ))}
        </div>
      }
    />
  );
}
