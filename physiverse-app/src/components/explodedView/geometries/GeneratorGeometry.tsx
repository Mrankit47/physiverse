'use client';

import { ReactNode } from 'react';
import * as THREE from 'three';

/**
 * Procedural Electromagnetic Generator geometry builder.
 * Returns a map of component ID → JSX Three.js geometry.
 */
export function buildGeneratorGeometry(): Record<string, ReactNode> {
  return {
    /* ── 1. Rotor — central cylinder inside stator ── */
    rotor: (
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.4, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.15} />
      </mesh>
    ),

    /* ── 2. Stator — heavy outer ring core ── */
    stator: (
      <mesh castShadow>
        {/* Ring tube representation */}
        <cylinderGeometry args={[0.8, 0.85, 1.2, 32, 1, true]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
    ),

    /* ── 3. Copper Coils — orange-brown rings inside stator core slots ── */
    'copper-coils': (
      <group>
        {/* Rings at various segments around the stator */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <group key={i} rotation={[0, angle, 0]} position={[0, 0, 0]}>
              <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <torusGeometry args={[0.2, 0.05, 8, 24]} />
                <meshStandardMaterial color="#B45309" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          );
        })}
      </group>
    ),

    /* ── 4. Permanent Magnets — alternating blue/red poles on rotor ── */
    'permanent-magnets': (
      <group>
        {/* 4 pole magnets mounted on rotor surface */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[0.58, 0, 0]} castShadow>
              <boxGeometry args={[0.1, 0.6, 0.35]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#3B82F6' : '#EF4444'}
                emissive={i % 2 === 0 ? '#60A5FA' : '#F87171'}
                emissiveIntensity={0.25}
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>
          </group>
        ))}
      </group>
    ),

    /* ── 5. Shaft — central steel spindle rod ── */
    shaft: (
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2.8, 16]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.08} />
      </mesh>
    ),

    /* ── 6. Bearings — rings with small ball representations on shaft ends ── */
    bearings: (
      <group>
        {[-0.8, 0.8].map((y, i) => (
          <group key={i} position={[0, y, 0]}>
            <mesh castShadow>
              <torusGeometry args={[0.15, 0.04, 8, 24]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.05} />
            </mesh>
          </group>
        ))}
      </group>
    ),

    /* ── 7. Housing — main cylindrical grid casing ── */
    housing: (
      <group>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.05, 1.05, 1.8, 16, 1, true]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} side={THREE.DoubleSide} transparent opacity={0.35} />
        </mesh>
        {/* Metal plates at the ends */}
        {[-0.92, 0.92].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <cylinderGeometry args={[1.08, 1.08, 0.06, 16]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    ),

    /* ── 8. Cooling Components — cooling fan blades on shaft end ── */
    'cooling-components': (
      <group>
        {/* Cooling fins wrapper */}
        <mesh position={[0, -1.02, 0]} castShadow>
          <cylinderGeometry args={[1.08, 1.08, 0.15, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Fan blades inside housing end */}
        <group position={[0, -1.2, 0]}>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} rotation={[0, angle, 0.15]} position={[0, 0, 0]} castShadow>
                <boxGeometry args={[0.04, 0.08, 0.45]} />
                <meshStandardMaterial color="#60A5FA" metalness={0.5} roughness={0.4} />
              </mesh>
            );
          })}
        </group>
      </group>
    ),
  };
}
