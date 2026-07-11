'use client';

import { ReactNode } from 'react';
import * as THREE from 'three';

/**
 * Procedural Foucault Pendulum geometry builder.
 * Returns a map of component ID → JSX Three.js geometry.
 */
export function buildFoucaultPendulumGeometry(): Record<string, ReactNode> {
  return {
    /* ── 1. Suspension Cable — single thin vertical wire ── */
    'suspension-cable': (
      <mesh castShadow>
        <cylinderGeometry args={[0.008, 0.008, 4.2, 8]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
      </mesh>
    ),

    /* ── 2. Pivot — Universal Cardan joint ── */
    pivot: (
      <group>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 32, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Support cross bar */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
          <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.15} />
        </mesh>
      </group>
    ),

    /* ── 3. Pendulum Bob — heavy polished sphere ── */
    'pendulum-bob': (
      <group>
        <mesh castShadow receiveShadow position={[0, -2.1, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#FBBF24"
            emissiveIntensity={0.25}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
        {/* Small top attachment screw */}
        <mesh position={[0, -1.65, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.15, 16]} />
          <meshStandardMaterial color="#D1D5DB" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    ),

    /* ── 4. Bearings — low-friction support rollers/plates ── */
    bearings: (
      <group>
        {/* Supporting ring base for gimbals */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.3, 0.05, 16, 48]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.05} />
        </mesh>
      </group>
    ),

    /* ── 5. Base Platform — circular plate with azimuthal ring markings ── */
    'base-platform': (
      <group>
        {/* Circular base */}
        <mesh position={[0, -2.5, 0]} receiveShadow>
          <cylinderGeometry args={[2.5, 2.5, 0.15, 64]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.35} />
        </mesh>
        {/* Graduated dial ring on top of base */}
        <mesh position={[0, -2.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 2.4, 64]} />
          <meshStandardMaterial color="#64748B" side={THREE.DoubleSide} />
        </mesh>
        {/* Small pins surrounding the edge to be knocked down */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const r = 2.3;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * r, -2.38, Math.sin(angle) * r]}
              castShadow
            >
              <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#EF4444' : '#F59E0B'} />
            </mesh>
          );
        })}
      </group>
    ),
  };
}
