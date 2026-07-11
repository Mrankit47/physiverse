'use client';

import { ReactNode } from 'react';
import * as THREE from 'three';

/**
 * Procedural Newton's Cradle geometry builder.
 * Returns a map of component ID → JSX Three.js geometry.
 */
export function buildNewtonsCradleGeometry(): Record<string, ReactNode> {
  return {
    /* ── 1. Support Frame — U-shaped metal bars ── */
    'support-frame': (
      <group>
        {/* Left arch */}
        <mesh position={[-1.2, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Right arch */}
        <mesh position={[1.2, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Top bar */}
        <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.4, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Supporting crosspieces */}
        {[-0.6, 0.6].map((z, i) => (
          <mesh key={i} position={[0, 1.5, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>
    ),

    /* ── 2. Suspension Wires — thin V-shape wires for 5 balls ── */
    'suspension-wires': (
      <group>
        {[-0.4, -0.2, 0, 0.2, 0.4].map((x, idx) => (
          <group key={idx} position={[x, 0.7, 0]}>
            {/* Front wire */}
            <mesh rotation={[0, 0, 0.25]} castShadow>
              <cylinderGeometry args={[0.006, 0.006, 1.5, 8]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Back wire */}
            <mesh rotation={[0, 0, -0.25]} castShadow>
              <cylinderGeometry args={[0.006, 0.006, 1.5, 8]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    ),

    /* ── 3. Steel Balls — 5 touching metal spheres ── */
    'steel-balls': (
      <group>
        {[-0.4, -0.2, 0, 0.2, 0.4].map((x, idx) => (
          <group key={idx} position={[x, 0, 0]}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.098, 32, 32]} />
              <meshStandardMaterial
                color="#F59E0B"
                emissive="#FBBF24"
                emissiveIntensity={0.2}
                metalness={0.95}
                roughness={0.05}
              />
            </mesh>
          </group>
        ))}
      </group>
    ),

    /* ── 4. Base — heavy rectangular plate ── */
    base: (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.2, 1.6]} />
        <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} />
      </mesh>
    ),
  };
}
