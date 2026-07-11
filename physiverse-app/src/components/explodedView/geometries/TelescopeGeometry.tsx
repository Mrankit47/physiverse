'use client';

import { ReactNode } from 'react';
import * as THREE from 'three';

/**
 * Procedural Optical Telescope geometry builder.
 * Returns a map of component ID → JSX Three.js geometry.
 */
export function buildTelescopeGeometry(): Record<string, ReactNode> {
  return {
    /* ── 1. Tube — main barrel ── */
    tube: (
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.72, 3, 32, 1, true]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.7}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    ),

    /* ── 2. Primary Mirror — curved plate at back ── */
    'primary-mirror': (
      <group>
        {/* Parabolic disc representation */}
        <mesh position={[0, 0, -1.45]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.08, 32]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.05} />
        </mesh>
        {/* Center hole for light to exit */}
        <mesh position={[0, 0, -1.45]}>
          <ringGeometry args={[0.15, 0.65, 32]} />
          <meshStandardMaterial color="#64748B" side={THREE.DoubleSide} />
        </mesh>
      </group>
    ),

    /* ── 3. Secondary Mirror — small mirror at front ── */
    'secondary-mirror': (
      <group>
        {/* Mirror mount spider arms */}
        {[-0.5, 0.5].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.8, 8]} />
            <meshStandardMaterial color="#94A3B8" />
          </mesh>
        ))}
        {/* Secondary mirror disc */}
        <mesh position={[0, 0, 1.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.05} />
        </mesh>
      </group>
    ),

    /* ── 4. Eyepiece — 90 degree eyepiece holder + lens ── */
    eyepiece: (
      <group>
        {/* Diagonal mirror housing */}
        <mesh position={[0, -0.6, -1.6]} castShadow>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Ocular tube extending at 45/90 degrees */}
        <mesh position={[0, -0.85, -1.85]} rotation={[Math.PI / 4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    ),

    /* ── 5. Objective corrector lens at front ── */
    'objective-lens': (
      <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.04, 32]} />
        <meshStandardMaterial
          color="#93C5FD"
          metalness={0.1}
          roughness={0.05}
          transparent
          opacity={0.4}
        />
      </mesh>
    ),

    /* ── 6. Finder Scope — small tube on top ── */
    'finder-scope': (
      <group>
        {/* Scope barrel */}
        <mesh position={[0.72, 0.72, -0.4]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.08, 0.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Mount bracket */}
        <mesh position={[0.62, 0.62, -0.4]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <boxGeometry args={[0.04, 0.2, 0.1]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
      </group>
    ),

    /* ── 7. Mount — Equatorial fork stand ── */
    mount: (
      <group>
        {/* Fork arm holding the tube */}
        <mesh position={[0, -1, 0]} castShadow>
          <boxGeometry args={[1.5, 0.15, 0.8]} />
          <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Rotating pivot */}
        <mesh position={[0, -1.35, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.6, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Tripod base assembly */}
        <mesh position={[0, -2.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.4, 1.2, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    ),
  };
}
