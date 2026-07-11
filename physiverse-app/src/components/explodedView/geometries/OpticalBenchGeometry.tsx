'use client';

import { ReactNode } from 'react';
import * as THREE from 'three';

/**
 * Procedural Optical Bench geometry builder.
 * Returns a map of component ID → JSX Three.js geometry.
 */
export function buildOpticalBenchGeometry(): Record<string, ReactNode> {
  return {
    /* ── 1. Optical Rail — long track along x-axis ── */
    'optical-rail': (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.1, 0.25]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
      </mesh>
    ),

    /* ── 2. Measuring Scale — thin ruler on the side of the rail ── */
    'measuring-scale': (
      <group>
        {/* Metal ruler band */}
        <mesh castShadow>
          <boxGeometry args={[3.15, 0.04, 0.02]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Tick mark ticks */}
        {Array.from({ length: 30 }).map((_, i) => {
          const x = -1.45 + (i / 29) * 2.9;
          return (
            <mesh key={i} position={[x, 0.03, 0.015]}>
              <boxGeometry args={[0.005, 0.012, 0.002]} />
              <meshBasicMaterial color="#475569" />
            </mesh>
          );
        })}
      </group>
    ),

    /* ── 3. Convex Lens — double convex magnifying lens ── */
    'convex-lens': (
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 32]} />
        <meshStandardMaterial
          color="#93C5FD"
          metalness={0.1}
          roughness={0.05}
          transparent
          opacity={0.5}
        />
      </mesh>
    ),

    /* ── 4. Concave Lens — double concave thin-edge lens ── */
    'concave-lens': (
      <mesh castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.06, 32]} />
        <meshStandardMaterial
          color="#93C5FD"
          metalness={0.1}
          roughness={0.05}
          transparent
          opacity={0.5}
        />
      </mesh>
    ),

    /* ── 5. Prism — triangular glass block ── */
    prism: (
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.35, 3]} />
        <meshStandardMaterial
          color="#60A5FA"
          metalness={0.2}
          roughness={0.05}
          transparent
          opacity={0.6}
        />
      </mesh>
    ),

    /* ── 6. Laser Source — rectangular laser emitter box ── */
    'laser-source': (
      <group>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.25, 0.25]} />
          <meshStandardMaterial color="#EF4444" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Laser aperture tip */}
        <mesh position={[0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
      </group>
    ),

    /* ── 7. Mirror Mounts — adjustable base sliders ── */
    'mirror-mounts': (
      <group>
        {/* Support block slider */}
        <mesh castShadow>
          <boxGeometry args={[0.25, 0.15, 0.28]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Vertical alignment rod */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    ),
  };
}
