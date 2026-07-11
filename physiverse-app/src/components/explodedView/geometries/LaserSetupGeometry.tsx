'use client';

import { ReactNode } from 'react';
import * as THREE from 'three';

/**
 * Procedural Laser Setup geometry builder.
 * Returns a map of component ID → JSX Three.js geometry.
 */
export function buildLaserSetupGeometry(): Record<string, ReactNode> {
  return {
    /* ── 1. Laser Diode — laser casing cylindrical body ── */
    'laser-diode': (
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.4, 24]} />
          <meshStandardMaterial color="#EC4899" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Heat sink rings on diode */}
        {[-0.1, 0, 0.1].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]}>
            <torusGeometry args={[0.13, 0.02, 8, 16]} />
            <meshStandardMaterial color="#EC4899" metalness={0.7} />
          </mesh>
        ))}
      </group>
    ),

    /* ── 2. Beam Expander — telescope-style cone ── */
    'beam-expander': (
      <group>
        {/* Conical connector */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.18, 0.5, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Entrance tube */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>
    ),

    /* ── 3. Steering Mirrors — round mirror in tilt frame ── */
    mirrors: (
      <group>
        {/* Circular mirror holder */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Glass reflection layer */}
        <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.005, 24]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.05} />
        </mesh>
      </group>
    ),

    /* ── 4. Beam Splitter — glass cube with diagonal band ── */
    'beam-splitter': (
      <group>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#60A5FA"
            metalness={0.3}
            roughness={0.1}
            transparent
            opacity={0.5}
          />
        </mesh>
        {/* Diagonal semi-reflective mirror layer */}
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.01, 0.28, 0.4]} />
          <meshBasicMaterial color="#E2E8F0" transparent opacity={0.3} />
        </mesh>
      </group>
    ),

    /* ── 5. Optical Filter — thin slide holder + colored glass slide ── */
    'optical-filter': (
      <group>
        {/* Slide mount */}
        <mesh castShadow>
          <boxGeometry args={[0.05, 0.3, 0.3]} />
          <meshStandardMaterial color="#1E293B" metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Filter glass pane */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.25, 0.25]} />
          <meshStandardMaterial
            color="#EF4444"
            transparent
            opacity={0.4}
            metalness={0.1}
            roughness={0.05}
          />
        </mesh>
      </group>
    ),

    /* ── 6. Lens Assembly — compound focusing tube ── */
    'lens-assembly': (
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.35, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Lens elements inside */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 16]} />
          <meshStandardMaterial color="#93C5FD" transparent opacity={0.4} />
        </mesh>
      </group>
    ),

    /* ── 7. Detector — photodiode case with cable lead ── */
    detector: (
      <group>
        {/* Detector body */}
        <mesh castShadow>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Sensor window */}
        <mesh position={[-0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.01, 16]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.5} />
        </mesh>
      </group>
    ),
  };
}
