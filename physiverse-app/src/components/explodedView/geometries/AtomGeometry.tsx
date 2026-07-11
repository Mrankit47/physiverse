'use client';

import { ReactNode, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Animated electron that orbits the nucleus ── */
function OrbitingElectron({
  radius,
  speed,
  tilt,
}: {
  radius: number;
  speed: number;
  tilt: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 0.5) * (radius * 0.2);
  });

  return (
    <group rotation={tilt}>
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#60A5FA"
          emissive="#93C5FD"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

/**
 * Procedural Atom geometry builder.
 * Returns a map of component ID → JSX Three.js geometry.
 */
export function buildAtomGeometry(): Record<string, ReactNode> {
  return {
    /* ── 1. Nucleus — central cluster ── */
    nucleus: (
      <group>
        {/* Core sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#F87171"
            emissiveIntensity={0.8}
            roughness={0.6}
          />
        </mesh>
        {/* Subtle glow */}
        <mesh>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshStandardMaterial
            color="#EF4444"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    ),

    /* ── 2. Proton Cluster — red spheres ── */
    'proton-cluster': (
      <group>
        {[
          [0, 0, 0],
          [0.18, 0.1, 0.05],
          [-0.1, 0.15, 0.12],
          [0.05, -0.12, 0.15],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#FCA5A5"
              emissiveIntensity={0.5}
              roughness={0.5}
            />
          </mesh>
        ))}
        {/* "+" label sphere */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
        </mesh>
      </group>
    ),

    /* ── 3. Neutron Cluster — gray spheres ── */
    'neutron-cluster': (
      <group>
        {[
          [0, 0, 0],
          [-0.15, -0.1, 0.1],
          [0.12, -0.15, -0.08],
          [-0.05, 0.12, -0.14],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#6B7280" roughness={0.5} metalness={0.3} />
          </mesh>
        ))}
      </group>
    ),

    /* ── 4. Electron Shells — concentric torus rings ── */
    'electron-shells': (
      <group>
        {[1.5, 2.5, 3.5].map((radius, i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
            <torusGeometry args={[radius, 0.02, 16, 100]} />
            <meshStandardMaterial
              color="#3B82F6"
              transparent
              opacity={0.3 - i * 0.05}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    ),

    /* ── 5. Individual Electrons — animated orbiting particles ── */
    'individual-electrons': (
      <group>
        <OrbitingElectron radius={1.5} speed={1.2} tilt={[0, 0, 0]} />
        <OrbitingElectron radius={1.5} speed={-0.9} tilt={[0.3, 0.5, 0]} />
        <OrbitingElectron radius={2.5} speed={0.7} tilt={[0.8, 0, 0.2]} />
        <OrbitingElectron radius={2.5} speed={-0.6} tilt={[-0.3, 0.8, 0]} />
        <OrbitingElectron radius={3.5} speed={0.4} tilt={[0.5, 0.3, 0.5]} />
        <OrbitingElectron radius={3.5} speed={-0.5} tilt={[-0.5, -0.3, 0.2]} />
      </group>
    ),

    /* ── 6. Orbital Paths — dumbbell-shaped p-orbital ── */
    'orbital-paths': (
      <group>
        {/* p-orbital lobes (dumbbell) */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshStandardMaterial
            color="#10B981"
            transparent
            opacity={0.15}
          />
        </mesh>
        <mesh position={[0, -1.2, 0]}>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshStandardMaterial
            color="#10B981"
            transparent
            opacity={0.15}
          />
        </mesh>
        {/* s-orbital (spherical cloud) */}
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color="#10B981"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    ),

    /* ── 7. Energy Layers — concentric transparent spheres ── */
    'energy-layers': (
      <group>
        {[1.8, 2.8, 3.8].map((radius, i) => (
          <mesh key={i}>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial
              color={['#F59E0B', '#FBBF24', '#FDE68A'][i]}
              transparent
              opacity={0.06}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    ),
  };
}
