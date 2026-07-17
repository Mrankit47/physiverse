'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Electron Trail (creates motion blur tail behind each electron) ── */
function ElectronTrail({
  orbitRadius,
  tiltX,
  tiltZ,
  speed,
  color,
  trailCount = 18,
}: {
  orbitRadius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  color: string;
  trailCount?: number;
}) {
  const trailRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const trailColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    if (!trailRef.current) return;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < trailCount; i++) {
      // Each trail dot is slightly behind the electron in time
      const trailOffset = (i / trailCount) * 0.35;
      const angle = time * speed - trailOffset;
      
      // Calculate position on tilted orbit
      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle) * orbitRadius;
      
      // Apply tilt rotation
      const rotatedX = x;
      const rotatedY = y * Math.cos(tiltX) - 0 * Math.sin(tiltX);
      const rotatedZ = y * Math.sin(tiltX) + 0 * Math.cos(tiltX);
      
      // Apply second tilt
      const finalX = rotatedX * Math.cos(tiltZ) - rotatedZ * Math.sin(tiltZ);
      const finalY = rotatedY;
      const finalZ = rotatedX * Math.sin(tiltZ) + rotatedZ * Math.cos(tiltZ);

      // Scale decreases along trail (fades out)
      const scale = 0.025 * (1 - i / trailCount);
      
      dummy.position.set(finalX, finalY, finalZ);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      trailRef.current.setMatrixAt(i, dummy.matrix);
    }
    trailRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={trailRef} args={[undefined, undefined, trailCount]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={trailColor} transparent opacity={0.4} />
    </instancedMesh>
  );
}

/* ── Single Orbiting Electron ── */
function Electron({
  orbitRadius,
  tiltX,
  tiltZ,
  speed,
  color,
  glowColor,
}: {
  orbitRadius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  color: string;
  glowColor: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const angle = time * speed;

    // Position on tilted orbit
    const x = Math.cos(angle) * orbitRadius;
    const y = Math.sin(angle) * orbitRadius;
    
    // Apply tilt rotations
    const rotatedX = x;
    const rotatedY = y * Math.cos(tiltX);
    const rotatedZ = y * Math.sin(tiltX);
    
    const finalX = rotatedX * Math.cos(tiltZ) - rotatedZ * Math.sin(tiltZ);
    const finalY = rotatedY;
    const finalZ = rotatedX * Math.sin(tiltZ) + rotatedZ * Math.cos(tiltZ);

    meshRef.current.position.set(finalX, finalY, finalZ);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshBasicMaterial color={color} />
      <pointLight color={glowColor} intensity={0.6} distance={1.5} decay={2} />
    </mesh>
  );
}

/* ── Orbit Ring (the visible orbital path) ── */
function OrbitRing({
  radius,
  tiltX,
  tiltZ,
  color,
}: {
  radius: number;
  tiltX: number;
  tiltZ: number;
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.LineBasicMaterial | null>(null);

  const lineObj = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const rotatedX = x;
      const rotatedY = y * Math.cos(tiltX);
      const rotatedZ = y * Math.sin(tiltX);

      const finalX = rotatedX * Math.cos(tiltZ) - rotatedZ * Math.sin(tiltZ);
      const finalY = rotatedY;
      const finalZ = rotatedX * Math.sin(tiltZ) + rotatedZ * Math.cos(tiltZ);

      points.push(new THREE.Vector3(finalX, finalY, finalZ));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.2 });
    matRef.current = mat;
    return new THREE.Line(geo, mat);
  }, [radius, tiltX, tiltZ, color]);

  // Pulse the ring opacity subtly
  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.opacity = 0.15 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <primitive object={lineObj} />
    </group>
  );
}

/* ── Nucleus with Protons & Neutrons ── */
function Nucleus() {
  const groupRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  // Generate clustered nucleon positions (protons + neutrons)
  const nucleonPositions = useMemo(() => {
    const positions: { pos: THREE.Vector3; isProton: boolean }[] = [];
    // 6 protons (orange) + 6 neutrons (blue-white) arranged in tight cluster
    const nucleonCount = 12;
    for (let i = 0; i < nucleonCount; i++) {
      const phi = Math.acos(2 * (i / nucleonCount) - 1);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i; // Golden angle
      const r = 0.09 + Math.random() * 0.03;
      positions.push({
        pos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ),
        isProton: i % 2 === 0,
      });
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Gentle nucleus rotation
    groupRef.current.rotation.y = time * 0.3;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.15;

    // Pulsating glow
    if (glowRef.current) {
      const scale = 1 + Math.sin(time * 2.5) * 0.15;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial
          color="#FF6B00"
          transparent
          opacity={0.18}
        />
      </mesh>
      
      {/* Core bright sphere */}
      <mesh>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial color="#FF7722" />
        <pointLight color="#FF5500" intensity={2.5} distance={4} decay={1.5} />
      </mesh>

      {/* Nucleon cluster */}
      {nucleonPositions.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial
            color={n.isProton ? '#FF5500' : '#88AACC'}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Energy Shell (translucent spherical shells) ── */
function EnergyShell({ radius, color, pulseSpeed }: { radius: number; color: string; pulseSpeed: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.03 + Math.sin(time * pulseSpeed) * 0.02;
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.z = time * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.04}
        wireframe
      />
    </mesh>
  );
}

/* ── Main Hero Atom Component ── */
export default function HeroAtom({ position = [3.5, 1.2, -1] as [number, number, number] }) {
  const atomGroupRef = useRef<THREE.Group>(null!);

  // Gentle floating + slow rotation of entire atom
  useFrame((state) => {
    if (!atomGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Float up and down
    atomGroupRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.2;
    
    // Slow overall rotation
    atomGroupRef.current.rotation.y = time * 0.12;
  });

  // Electron orbit configurations (3 electrons on different tilted orbits)
  const electrons = [
    { orbitRadius: 0.7, tiltX: 0.3, tiltZ: 0, speed: 2.8, color: '#00CCFF', glowColor: '#00AAFF' },
    { orbitRadius: 0.85, tiltX: 1.2, tiltZ: 0.8, speed: 2.2, color: '#FF5500', glowColor: '#FF4400' },
    { orbitRadius: 1.0, tiltX: -0.5, tiltZ: 2.1, speed: 1.7, color: '#AA44FF', glowColor: '#9933EE' },
  ];

  return (
    <group ref={atomGroupRef} position={position}>
      {/* Nucleus */}
      <Nucleus />

      {/* Orbit rings + Electrons + Trails */}
      {electrons.map((e, i) => (
        <group key={i}>
          <OrbitRing
            radius={e.orbitRadius}
            tiltX={e.tiltX}
            tiltZ={e.tiltZ}
            color={e.color}
          />
          <Electron
            orbitRadius={e.orbitRadius}
            tiltX={e.tiltX}
            tiltZ={e.tiltZ}
            speed={e.speed}
            color={e.color}
            glowColor={e.glowColor}
          />
          <ElectronTrail
            orbitRadius={e.orbitRadius}
            tiltX={e.tiltX}
            tiltZ={e.tiltZ}
            speed={e.speed}
            color={e.color}
          />
        </group>
      ))}

      {/* Energy Shells */}
      <EnergyShell radius={0.7} color="#00CCFF" pulseSpeed={1.8} />
      <EnergyShell radius={0.85} color="#FF5500" pulseSpeed={1.4} />
      <EnergyShell radius={1.0} color="#AA44FF" pulseSpeed={1.0} />
    </group>
  );
}
