'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ── Orbiting Particle ── */
function OrbitParticle({ radius, speed, size, color }: { radius: number; speed: number; size: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 0.5) * (radius * 0.3);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
    </mesh>
  );
}

/* ── Glowing Core ── */
function GlowCore() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
    ref.current.scale.set(scale, scale, scale);
  });
  return (
    <Float speed={2} rotationIntensity={0.5}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#FF7A00"
          emissive="#FF7A00"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Outer glow ring */}
      <mesh>
        <ringGeometry args={[0.9, 1.1, 64]} />
        <meshStandardMaterial
          color="#FF9E40"
          emissive="#FF9E40"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

/* ── Orbit Ring ── */
function OrbitRing({ radius, opacity = 0.15 }: { radius: number; opacity?: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.01, radius + 0.01, 128]} />
      <meshBasicMaterial color="#60A5FA" transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── Hero Scene ── */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={3} color="#FF7A00" distance={15} />
          <pointLight position={[5, 3, 5]} intensity={0.5} color="#60A5FA" />

          {/* Starfield */}
          <Stars
            radius={50}
            depth={80}
            count={3000}
            factor={4}
            saturation={0.5}
            fade
            speed={0.5}
          />

          {/* Central glowing core */}
          <GlowCore />

          {/* Orbit rings */}
          <OrbitRing radius={2} opacity={0.12} />
          <OrbitRing radius={3.2} opacity={0.08} />
          <OrbitRing radius={4.5} opacity={0.05} />

          {/* Orbiting particles */}
          <OrbitParticle radius={2} speed={0.8} size={0.12} color="#3B82F6" />
          <OrbitParticle radius={2} speed={-0.6} size={0.08} color="#60A5FA" />
          <OrbitParticle radius={3.2} speed={0.5} size={0.15} color="#10B981" />
          <OrbitParticle radius={3.2} speed={-0.4} size={0.1} color="#34D399" />
          <OrbitParticle radius={4.5} speed={0.3} size={0.18} color="#F59E0B" />
          <OrbitParticle radius={4.5} speed={-0.35} size={0.09} color="#FBBF24" />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
