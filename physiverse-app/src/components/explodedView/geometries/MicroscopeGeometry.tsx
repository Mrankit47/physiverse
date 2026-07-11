'use client';

import { ReactNode } from 'react';
import * as THREE from 'three';

/**
 * Procedural Microscope geometry builder.
 * Returns a map of component ID → JSX Three.js geometry.
 */
export function buildMicroscopeGeometry(): Record<string, ReactNode> {
  return {
    /* ── 1. Eyepiece — cylinder on top ── */
    eyepiece: (
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.8, 32]} />
        <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
      </mesh>
    ),

    /* ── 2. Eye Lens — thin glass disc ── */
    'eye-lens': (
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 32]} />
        <meshStandardMaterial
          color="#93C5FD"
          metalness={0.1}
          roughness={0.05}
          transparent
          opacity={0.6}
        />
      </mesh>
    ),

    /* ── 3. Body Tube — tall cylinder ── */
    'body-tube': (
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 2.4, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
    ),

    /* ── 4. Revolving Nosepiece — flat disc with holes ── */
    nosepiece: (
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.15, 6]} />
          <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Pivot detent */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    ),

    /* ── 5. Objective Lenses — 3 cylinders hanging down ── */
    'objective-lenses': (
      <group>
        {[
          { x: -0.2, len: 0.5, r: 0.08, color: '#FBBF24' },
          { x: 0, len: 0.8, r: 0.07, color: '#3B82F6' },
          { x: 0.2, len: 1.1, r: 0.06, color: '#F87171' },
        ].map((obj, i) => (
          <mesh key={i} position={[obj.x, -obj.len / 2, 0]} castShadow>
            <cylinderGeometry args={[obj.r, obj.r * 1.2, obj.len, 24]} />
            <meshStandardMaterial color={obj.color} metalness={0.6} roughness={0.25} />
          </mesh>
        ))}
      </group>
    ),

    /* ── 6. Stage — flat rectangular platform ── */
    stage: (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.12, 1.8]} />
        <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
      </mesh>
    ),

    /* ── 7. Mechanical Stage — smaller platform with knobs ── */
    'mechanical-stage': (
      <group>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.08, 1.2]} />
          <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* X knob */}
        <mesh position={[0.8, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Y knob */}
        <mesh position={[0, 0, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.15, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    ),

    /* ── 8. Stage Clips — two spring clips ── */
    'stage-clips': (
      <group>
        {[-0.5, 0.5].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.15, 0.04, 0.4]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0.05, -0.18]}>
              <boxGeometry args={[0.15, 0.06, 0.08]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.15} />
            </mesh>
          </group>
        ))}
      </group>
    ),

    /* ── 9. Condenser — small lens assembly ── */
    condenser: (
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.35, 0.5, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Lens inside */}
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#3B82F6"
            metalness={0.1}
            roughness={0.05}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
    ),

    /* ── 10. Iris Diaphragm — thin disc with aperture ── */
    'iris-diaphragm': (
      <mesh>
        <ringGeometry args={[0.08, 0.35, 32]} />
        <meshStandardMaterial
          color="#475569"
          metalness={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    ),

    /* ── 11. Coarse Focus Knob — large wheel ── */
    'coarse-focus': (
      <mesh castShadow>
        <torusGeometry args={[0.25, 0.08, 16, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.25} />
      </mesh>
    ),

    /* ── 12. Fine Focus Knob — smaller wheel ── */
    'fine-focus': (
      <mesh castShadow>
        <torusGeometry args={[0.18, 0.06, 16, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.25} />
      </mesh>
    ),

    /* ── 13. Illuminator — glowing bulb ── */
    illuminator: (
      <group>
        <mesh>
          <cylinderGeometry args={[0.2, 0.25, 0.3, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#FBBF24"
            emissive="#FCD34D"
            emissiveIntensity={2}
          />
        </mesh>
      </group>
    ),

    /* ── 14. Base — wide flat base ── */
    base: (
      <group>
        {/* Main base body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.3, 2]} />
          <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* Arm column */}
        <mesh position={[0, 1.8, -0.7]} castShadow>
          <boxGeometry args={[0.4, 3.6, 0.35]} />
          <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    ),

    /* ── 15. Internal Optical Components — prism + mirrors ── */
    'internal-optics': (
      <group>
        {/* Prism */}
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#60A5FA"
            metalness={0.3}
            roughness={0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
        {/* Small mirror */}
        <mesh position={[0.3, 0, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[0.25, 0.2, 0.02]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.05} />
        </mesh>
      </group>
    ),

    /* ── 16. Mounting Screws — group of small cylinders ── */
    'mounting-screws': (
      <group>
        {[
          [0, 0, 0],
          [0.4, 0, 0],
          [0, 0, 0.4],
          [0.4, 0, 0.4],
        ].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            {/* Screw head */}
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 6]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Screw body */}
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.12, 12]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>
    ),
  };
}
