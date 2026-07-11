'use client';

import { ReactNode, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Spinning Rotor ── */
function SpinningRotor() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 3;
  });

  return (
    <mesh ref={ref} castShadow>
      <cylinderGeometry args={[0.8, 0.8, 0.15, 48]} />
      <meshStandardMaterial
        color="#F59E0B"
        emissive="#FBBF24"
        emissiveIntensity={0.3}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

/**
 * Procedural Gyroscope geometry builder.
 * Returns a map of component ID → JSX Three.js geometry.
 */
export function buildGyroscopeGeometry(): Record<string, ReactNode> {
  return {
    /* ── 1. Outer Ring — largest gimbal ── */
    'outer-ring': (
      <group>
        <mesh castShadow>
          <torusGeometry args={[2, 0.08, 24, 80]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Support pivots */}
        {[0, Math.PI].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 2, 0, Math.sin(angle) * 2]}
            castShadow
          >
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>
    ),

    /* ── 2. Middle Ring — perpendicular gimbal ── */
    'middle-ring': (
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.5, 0.07, 24, 64]} />
        <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.15} />
      </mesh>
    ),

    /* ── 3. Inner Ring — smallest gimbal ── */
    'inner-ring': (
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.06, 24, 56]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.15} />
      </mesh>
    ),

    /* ── 4. Rotor — spinning disc at center ── */
    rotor: <SpinningRotor />,

    /* ── 5. Shaft — axle through rotor ── */
    shaft: (
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 16]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.08} />
      </mesh>
    ),

    /* ── 6. Bearings — small spheres at pivot points ── */
    bearings: (
      <group>
        {[
          [0, 1.05, 0],
          [0, -1.05, 0],
          [1.5, 0, 0],
          [-1.5, 0, 0],
          [0, 0, 2],
          [0, 0, -2],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.05} />
          </mesh>
        ))}
      </group>
    ),
  };
}
