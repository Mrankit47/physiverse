'use client';

import { ReactNode } from 'react';
import * as THREE from 'three';

/**
 * Procedural Particle Detector geometry builder.
 * Returns a map of component ID → JSX Three.js geometry.
 */
export function buildParticleDetectorGeometry(): Record<string, ReactNode> {
  return {
    /* ── 1. Detector Layers — outer shield tube ── */
    'detector-layers': (
      <mesh castShadow>
        <cylinderGeometry args={[1.5, 1.5, 2.8, 16, 1, true]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.7}
          roughness={0.3}
          side={THREE.DoubleSide}
          transparent
          opacity={0.3}
        />
      </mesh>
    ),

    /* ── 2. Silicon Tracker — inner blue glowing layer ── */
    'silicon-tracker': (
      <group>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 2, 32, 1, true]} />
          <meshStandardMaterial
            color="#3B82F6"
            emissive="#60A5FA"
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Detail silicon modules lines */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.405, 0, Math.sin(angle) * 0.405]}
              rotation={[0, angle, 0]}
            >
              <boxGeometry args={[0.02, 1.8, 0.02]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
          );
        })}
      </group>
    ),

    /* ── 3. Calorimeter — intermediate pink glowing block segments ── */
    calorimeter: (
      <group>
        {/* Ring of calorimeter blocks nested outside tracker */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[0.7, 0, 0]} castShadow>
                <boxGeometry args={[0.2, 1.6, 0.35]} />
                <meshStandardMaterial
                  color="#EC4899"
                  metalness={0.5}
                  roughness={0.4}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    ),

    /* ── 4. Solenoid Magnet — yellow copper rings wrapper ── */
    'solenoid-magnet': (
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[1, 1, 2.2, 16, 1, true]} />
          <meshStandardMaterial
            color="#F59E0B"
            metalness={0.95}
            roughness={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Coil ribs */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.02, 0.03, 8, 32]} />
            <meshStandardMaterial color="#D97706" metalness={0.9} />
          </mesh>
        ))}
      </group>
    ),

    /* ── 5. Muon Chambers — outer green grids ── */
    'muon-chambers': (
      <group>
        {/* Green rectangular muon chamber panels surrounding the outside */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[1.35, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 2.4, 1.4]} />
              <meshStandardMaterial
                color="#10B981"
                metalness={0.6}
                roughness={0.3}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        ))}
      </group>
    ),

    /* ── 6. Support Structure — steel cradle base frames ── */
    'support-structure': (
      <group>
        {/* Cradle legs supporting the cylinder */}
        {[-1, 1].map((z, idx) => (
          <group key={idx} position={[0, -0.8, z]}>
            {/* Cradle arch */}
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[1.65, 0.08, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Left foot */}
            <mesh position={[-1.65, -0.6, 0]} castShadow>
              <boxGeometry args={[0.3, 0.4, 0.2]} />
              <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Right foot */}
            <mesh position={[1.65, -0.6, 0]} castShadow>
              <boxGeometry args={[0.3, 0.4, 0.2]} />
              <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {/* Base plate under the cradle feet */}
        <mesh position={[0, -1.5, 0]} receiveShadow>
          <boxGeometry args={[3.8, 0.15, 2.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.6} roughness={0.5} />
        </mesh>
      </group>
    ),
  };
}
