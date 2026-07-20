'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

export type PhysicsMode = 'gravity' | 'electromagnetism' | 'quantum' | 'waves' | 'nuclear';

interface HeroPhysicsUniverseProps {
  mode?: PhysicsMode;
  forceStrength?: number; // 0.5 to 2.0
  particleSpeed?: number; // 0.5 to 2.0
}

/* ──────────────────────────────────────────────────────────────────────────────
   MODE 1: SPACETIME & GRAVITY (General Relativity Warp Grid + Keplerian Orbits)
   ────────────────────────────────────────────────────────────────────────────── */
function GravitySpacetimeScene({
  forceStrength,
  particleSpeed,
}: {
  forceStrength: number;
  particleSpeed: number;
}) {
  const gridGeomRef = useRef<THREE.BufferGeometry>(null!);
  const planetsRef = useRef<THREE.InstancedMesh>(null!);
  const photonParticlesRef = useRef<THREE.Points>(null!);
  
  const mouseWorldPos = useRef(new THREE.Vector3(0, 0, 0));
  const isPointerActive = useRef(false);
  const raycastPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);

  // Grid setup: 55x55 segments for smooth spacetime curvature
  const gridWidth = 20;
  const gridHeight = 20;
  const segments = 55;
  const initialPositions = useRef<{ x: number; y: number }[]>([]);

  const gridColors = useMemo(() => {
    const count = (segments + 1) * (segments + 1);
    return new Float32Array(count * 3);
  }, [segments]);

  // Orbiting Celestial Bodies
  const planetCount = 10;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const planetState = useMemo(() => {
    const planets = [];
    for (let i = 0; i < planetCount; i++) {
      const radius = 2.5 + Math.random() * 6.5;
      const angle = (i / planetCount) * Math.PI * 2 + Math.random();
      const speed = (0.015 + Math.random() * 0.02) * (Math.random() > 0.5 ? 1 : -1);
      const size = 0.18 + Math.random() * 0.22;
      planets.push({
        pos: new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
        vel: new THREE.Vector3(-Math.sin(angle) * speed * 2, 0, Math.cos(angle) * speed * 2),
        size,
        color: new THREE.Color().setHSL(0.08 + Math.random() * 0.7, 0.9, 0.55),
        mass: size * 5,
      });
    }
    return planets;
  }, []);

  // Photons Bending Light
  const photonCount = 450;
  const photonPositions = useMemo(() => new Float32Array(photonCount * 3), []);
  const photonData = useMemo(() => {
    const data = [];
    for (let i = 0; i < photonCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.0 + Math.random() * 8.5;
      data.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        y: (Math.random() - 0.5) * 0.8,
        speed: 0.04 + Math.random() * 0.04,
        angle: angle,
      });
    }
    return data;
  }, []);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(255, 120, 0, 1)');
      g.addColorStop(0.3, 'rgba(255, 85, 0, 0.8)');
      g.addColorStop(1, 'rgba(255, 85, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    const { raycaster, pointer, camera } = state;

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.ray.intersectPlane(raycastPlane, intersectPoint);
    if (hit) {
      mouseWorldPos.current.lerp(intersectPoint, 0.2);
      isPointerActive.current = true;
    }

    const mouseWell = mouseWorldPos.current;
    const centerWell = new THREE.Vector3(0, -0.5, 0);

    if (gridGeomRef.current) {
      const posAttr = gridGeomRef.current.attributes.position;
      const colorAttr = gridGeomRef.current.attributes.color;

      if (initialPositions.current.length === 0) {
        for (let i = 0; i < posAttr.count; i++) {
          initialPositions.current.push({ x: posAttr.getX(i), y: posAttr.getY(i) });
        }
      }

      const coords = initialPositions.current;
      for (let i = 0; i < coords.length; i++) {
        const { x, y } = coords[i];

        const dCenter = Math.sqrt(x * x + y * y);
        const dipCenter = -1.8 * forceStrength / (dCenter * 0.7 + 0.6);

        let dipMouse = 0;
        if (isPointerActive.current) {
          const dMouse = Math.sqrt((x - mouseWell.x) ** 2 + (y - mouseWell.z) ** 2);
          dipMouse = -1.5 * forceStrength / (dMouse * 0.8 + 0.5);
        }

        let dipPlanets = 0;
        for (let p = 0; p < Math.min(4, planetCount); p++) {
          const pl = planetState[p];
          const dP = Math.sqrt((x - pl.pos.x) ** 2 + (y - pl.pos.z) ** 2);
          dipPlanets += -0.4 * forceStrength / (dP * 1.2 + 0.4);
        }

        const totalDepth = dipCenter + dipMouse + dipPlanets;
        posAttr.setZ(i, totalDepth);

        const depthMag = Math.min(Math.abs(totalDepth) / 2.5, 1.0);
        const r = THREE.MathUtils.lerp(0.2, 1.0, depthMag);
        const g = THREE.MathUtils.lerp(0.4, 0.35, depthMag);
        const b = THREE.MathUtils.lerp(0.65, 0.05, depthMag);
        colorAttr.setXYZ(i, r, g, b);
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
    }

    if (planetsRef.current) {
      for (let i = 0; i < planetCount; i++) {
        const p = planetState[i];

        const dCenter = p.pos.distanceTo(centerWell);
        const forceCenter = (0.25 * forceStrength * particleSpeed) / Math.max(dCenter * dCenter, 0.8);
        const dirCenter = centerWell.clone().sub(p.pos).normalize();
        p.vel.add(dirCenter.multiplyScalar(forceCenter));

        if (isPointerActive.current) {
          const dMouse = p.pos.distanceTo(mouseWell);
          if (dMouse < 7.0) {
            const forceMouse = (0.35 * forceStrength * particleSpeed) / Math.max(dMouse * dMouse, 0.9);
            const dirMouse = mouseWell.clone().sub(p.pos).normalize();
            p.vel.add(dirMouse.multiplyScalar(forceMouse));
          }
        }

        p.pos.add(p.vel);
        p.vel.multiplyScalar(0.992);

        const dC = Math.sqrt(p.pos.x ** 2 + p.pos.z ** 2);
        p.pos.y = -1.8 * forceStrength / (dC * 0.7 + 0.6) + p.size;

        dummy.position.copy(p.pos);
        dummy.scale.setScalar(p.size);
        dummy.updateMatrix();
        planetsRef.current.setMatrixAt(i, dummy.matrix);
      }
      planetsRef.current.instanceMatrix.needsUpdate = true;
    }

    if (photonParticlesRef.current) {
      const ptsAttr = photonParticlesRef.current.geometry.attributes.position;
      for (let i = 0; i < photonCount; i++) {
        const pt = photonData[i];
        pt.angle += pt.speed * 0.6 * particleSpeed;

        const radius = 1.2 + (i / photonCount) * 7.5;
        let px = Math.cos(pt.angle) * radius;
        let pz = Math.sin(pt.angle) * radius;

        if (isPointerActive.current) {
          const dx = mouseWell.x - px;
          const dz = mouseWell.z - pz;
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 4.5) {
            const bend = (1.0 - dist / 4.5) * 0.4 * forceStrength;
            px += dx * bend;
            pz += dz * bend;
          }
        }

        const dC = Math.sqrt(px * px + pz * pz);
        const py = -1.6 * forceStrength / (dC * 0.7 + 0.6) + 0.1;

        ptsAttr.setXYZ(i, px, py, pz);
      }
      ptsAttr.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} color="#FF7700" />
      <pointLight position={[0, 0, 0]} intensity={3.5} color="#FF4400" distance={10} />

      {/* Central Black Hole / Gravitational Mass */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#111827"
          roughness={0.1}
          metalness={0.9}
          emissive="#FF4400"
          emissiveIntensity={0.6}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.65, 1.4, 64]} />
          <meshBasicMaterial color="#FF5500" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </mesh>

      {/* Spacetime Deformable Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry ref={gridGeomRef} args={[gridWidth, gridHeight, segments, segments]}>
          <bufferAttribute attach="attributes-color" args={[gridColors, 3]} />
        </planeGeometry>
        <meshBasicMaterial vertexColors wireframe transparent opacity={0.45} />
      </mesh>

      {/* Orbiting Bodies */}
      <instancedMesh ref={planetsRef} args={[undefined, undefined, planetCount]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color="#FF7722" roughness={0.3} metalness={0.4} />
      </instancedMesh>

      {/* Photon Swarm */}
      <points ref={photonParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[photonPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          map={particleTexture}
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   MODE 2: ELECTROMAGNETISM (Maxwell Vector Field & Coulomb Deflection)
   ────────────────────────────────────────────────────────────────────────────── */
function ElectromagnetismScene({
  forceStrength,
  particleSpeed,
}: {
  forceStrength: number;
  particleSpeed: number;
}) {
  const chargePosRef = useRef<THREE.Vector3>(new THREE.Vector3(2.5, 0, 0));
  const negChargePosRef = useRef<THREE.Vector3>(new THREE.Vector3(-2.5, 0, 0));
  const mouseChargeRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  
  const particleStreamRef = useRef<THREE.Points>(null!);
  const raycastPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);

  const particleCount = 700;
  const positions = useMemo(() => new Float32Array(particleCount * 3), []);
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < particleCount; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 12
        ),
        vel: new THREE.Vector3(),
        charge: i % 2 === 0 ? 1 : -1,
        life: Math.random(),
      });
    }
    return arr;
  }, []);

  const fieldGridSize = 9;
  const fieldArrows = useMemo(() => {
    const arrows = [];
    const step = 1.4;
    const start = -((fieldGridSize - 1) * step) / 2;
    for (let x = 0; x < fieldGridSize; x++) {
      for (let z = 0; z < fieldGridSize; z++) {
        arrows.push(new THREE.Vector3(start + x * step, 0, start + z * step));
      }
    }
    return arrows;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { raycaster, pointer, camera } = state;

    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(raycastPlane, intersectPoint)) {
      mouseChargeRef.current.lerp(intersectPoint, 0.15);
    }

    chargePosRef.current.set(
      Math.cos(time * 0.4 * particleSpeed) * 3.2,
      Math.sin(time * 0.5) * 0.4,
      Math.sin(time * 0.4 * particleSpeed) * 3.2
    );
    negChargePosRef.current.set(
      -Math.cos(time * 0.4 * particleSpeed) * 3.2,
      -Math.sin(time * 0.5) * 0.4,
      -Math.sin(time * 0.4 * particleSpeed) * 3.2
    );

    if (particleStreamRef.current) {
      const posAttr = particleStreamRef.current.geometry.attributes.position;
      const posPole = chargePosRef.current;
      const negPole = negChargePosRef.current;
      const mousePole = mouseChargeRef.current;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        const force = new THREE.Vector3();

        const dPos = p.pos.distanceTo(posPole);
        if (dPos > 0.3) {
          const fPosMag = (0.12 * forceStrength * p.charge * 1) / (dPos * dPos + 0.2);
          const dirPos = p.pos.clone().sub(posPole).normalize().multiplyScalar(fPosMag);
          force.add(dirPos);
        }

        const dNeg = p.pos.distanceTo(negPole);
        if (dNeg > 0.3) {
          const fNegMag = (0.12 * forceStrength * p.charge * -1) / (dNeg * dNeg + 0.2);
          const dirNeg = p.pos.clone().sub(negPole).normalize().multiplyScalar(fNegMag);
          force.add(dirNeg);
        }

        const dMouse = p.pos.distanceTo(mousePole);
        if (dMouse < 6.0 && dMouse > 0.3) {
          const fMouseMag = (0.2 * forceStrength * p.charge * 1) / (dMouse * dMouse + 0.2);
          const dirMouse = p.pos.clone().sub(mousePole).normalize().multiplyScalar(fMouseMag);
          force.add(dirMouse);
        }

        p.vel.add(force);
        p.vel.multiplyScalar(0.96);
        p.pos.add(p.vel.clone().multiplyScalar(particleSpeed));

        if (p.pos.length() > 8.0) {
          p.pos.set(
            posPole.x + (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.5,
            posPole.z + (Math.random() - 0.5) * 0.8
          );
          p.vel.set(0, 0, 0);
        }

        posAttr.setXYZ(i, p.pos.x, p.pos.y, p.pos.z);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 5, 0]} intensity={2.0} color="#3B82F6" />

      {/* Positive Charge Pole */}
      <mesh position={chargePosRef.current}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
        <pointLight color="#EF4444" intensity={3.0} distance={6} />
      </mesh>

      {/* Negative Charge Pole */}
      <mesh position={negChargePosRef.current}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.8} />
        <pointLight color="#3B82F6" intensity={3.0} distance={6} />
      </mesh>

      {/* Cursor Charge Node */}
      <mesh position={mouseChargeRef.current}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.9} />
        <pointLight color="#10B981" intensity={2.5} distance={5} />
      </mesh>

      {/* Vector Field Indicators */}
      {fieldArrows.map((pt, idx) => (
        <group key={idx} position={pt}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
            <meshBasicMaterial color="#64748B" transparent opacity={0.35} />
          </mesh>
        </group>
      ))}

      {/* Charged Particles */}
      <points ref={particleStreamRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.12} color="#FF8800" transparent opacity={0.8} />
      </points>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   MODE 3: QUANTUM & ATOMIC PHYSICS (Multi-Orbit Atom & Probability Cloud)
   ────────────────────────────────────────────────────────────────────────────── */
function QuantumAtomicScene({
  forceStrength,
  particleSpeed,
}: {
  forceStrength: number;
  particleSpeed: number;
}) {
  const nucleusGroupRef = useRef<THREE.Group>(null!);
  const electronsGroupRef = useRef<THREE.Group>(null!);
  const waveCloudRef = useRef<THREE.Points>(null!);

  const cloudCount = 1000;
  const { cloudPositions, cloudColors } = useMemo(() => {
    const pos = new Float32Array(cloudCount * 3);
    const col = new Float32Array(cloudCount * 3);
    for (let i = 0; i < cloudCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.PI * 2 * Math.random();
      const r = 0.6 + Math.pow(Math.random(), 2) * 2.8;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      col[i * 3] = 0.1 + (r / 3.5) * 0.8;
      col[i * 3 + 1] = 0.6;
      col[i * 3 + 2] = 1.0 - (r / 3.5) * 0.6;
    }
    return { cloudPositions: pos, cloudColors: col };
  }, [cloudCount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (nucleusGroupRef.current) {
      nucleusGroupRef.current.rotation.y = time * 0.4 * particleSpeed;
      nucleusGroupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    }

    if (electronsGroupRef.current) {
      electronsGroupRef.current.rotation.y = time * 0.2 * particleSpeed;
      electronsGroupRef.current.scale.setScalar(1 + (forceStrength - 1) * 0.3);
    }

    if (waveCloudRef.current) {
      waveCloudRef.current.rotation.y = time * 0.15 * particleSpeed;
      waveCloudRef.current.rotation.z = Math.cos(time * 0.1) * 0.1;
      waveCloudRef.current.scale.setScalar(1 + (forceStrength - 1) * 0.2);
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[0, 0, 0]} intensity={4.5} color="#FF5500" distance={8} />

      {/* Central Nucleus */}
      <group ref={nucleusGroupRef}>
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#FF5500" emissive="#FF3300" emissiveIntensity={0.9} />
        </mesh>
        <Float speed={3} rotationIntensity={1.5} floatIntensity={0.5}>
          <mesh position={[0.2, 0.15, 0.1]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#3B82F6" />
          </mesh>
          <mesh position={[-0.18, -0.12, -0.15]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#FF7700" />
          </mesh>
        </Float>
      </group>

      {/* Electron Orbits */}
      <group ref={electronsGroupRef}>
        {[
          { radius: 1.4, tiltX: 0.4, tiltZ: 0, speed: 2.5, color: '#00F0FF' },
          { radius: 2.2, tiltX: 1.3, tiltZ: 0.7, speed: 1.8, color: '#FF00A0' },
          { radius: 3.0, tiltX: -0.6, tiltZ: 2.1, speed: 1.3, color: '#FFB800' },
        ].map((orbit, idx) => (
          <group key={idx} rotation={[orbit.tiltX, 0, orbit.tiltZ]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[orbit.radius, 0.012, 16, 100]} />
              <meshBasicMaterial color={orbit.color} transparent opacity={0.35} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Quantum Wave Function Cloud */}
      <points ref={waveCloudRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cloudPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[cloudColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.07} vertexColors transparent opacity={0.55} />
      </points>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   MODE 4: WAVE OPTICS & INTERFERENCE (Double Slit Ripples)
   ────────────────────────────────────────────────────────────────────────────── */
function WaveOpticsScene({
  forceStrength,
  particleSpeed,
}: {
  forceStrength: number;
  particleSpeed: number;
}) {
  const gridGeomRef = useRef<THREE.BufferGeometry>(null!);
  
  const mouseRipple = useRef(new THREE.Vector2(999, 999));
  const raycastPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);

  const gridWidth = 18;
  const gridHeight = 18;
  const segments = 55;
  const initialPositions = useRef<{ x: number; y: number }[]>([]);

  const colors = useMemo(() => {
    const count = (segments + 1) * (segments + 1);
    return new Float32Array(count * 3);
  }, [segments]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * particleSpeed;
    const { raycaster, pointer, camera } = state;

    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(raycastPlane, intersectPoint)) {
      mouseRipple.current.set(intersectPoint.x, intersectPoint.z);
    }

    if (gridGeomRef.current) {
      const posAttr = gridGeomRef.current.attributes.position;
      const colorAttr = gridGeomRef.current.attributes.color;

      if (initialPositions.current.length === 0) {
        for (let i = 0; i < posAttr.count; i++) {
          initialPositions.current.push({ x: posAttr.getX(i), y: posAttr.getY(i) });
        }
      }

      const coords = initialPositions.current;
      const s1 = new THREE.Vector2(-2.2, 0);
      const s2 = new THREE.Vector2(2.2, 0);

      for (let i = 0; i < coords.length; i++) {
        const { x, y } = coords[i];

        const d1 = Math.sqrt((x - s1.x) ** 2 + (y - s1.y) ** 2);
        const d2 = Math.sqrt((x - s2.x) ** 2 + (y - s2.y) ** 2);

        const w1 = Math.cos(d1 * 2.5 - time * 4.0) * Math.exp(-d1 * 0.15);
        const w2 = Math.cos(d2 * 2.5 - time * 4.0) * Math.exp(-d2 * 0.15);

        let height = 0.6 * forceStrength * (w1 + w2);

        if (mouseRipple.current.x < 500) {
          const dM = Math.sqrt((x - mouseRipple.current.x) ** 2 + (y - mouseRipple.current.y) ** 2);
          height += Math.cos(dM * 3.5 - time * 6.0) * Math.exp(-dM * 0.4) * 0.8 * forceStrength;
        }

        posAttr.setZ(i, height);

        const normH = Math.max(-1, Math.min(1, height / 1.2));
        let r = 0.1, g = 0.5, b = 0.9;
        if (normH > 0) {
          r = THREE.MathUtils.lerp(0.1, 1.0, normH);
          g = THREE.MathUtils.lerp(0.5, 0.45, normH);
          b = THREE.MathUtils.lerp(0.9, 0.0, normH);
        } else {
          r = THREE.MathUtils.lerp(0.1, 0.05, -normH);
          g = THREE.MathUtils.lerp(0.5, 0.2, -normH);
          b = THREE.MathUtils.lerp(0.9, 0.6, -normH);
        }
        colorAttr.setXYZ(i, r, g, b);
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry ref={gridGeomRef} args={[gridWidth, gridHeight, segments, segments]}>
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </planeGeometry>
        <meshBasicMaterial vertexColors wireframe transparent opacity={0.55} />
      </mesh>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   MODE 5: NUCLEAR CHAIN REACTION (Uranium-235 Fission, Daughter Nuclei & Cascade)
   ────────────────────────────────────────────────────────────────────────────── */
function NuclearChainReactionScene({
  forceStrength,
  particleSpeed,
}: {
  forceStrength: number;
  particleSpeed: number;
}) {
  const gridGeomRef = useRef<THREE.BufferGeometry>(null!);
  const centralCoreRef = useRef<THREE.Group>(null!);
  const bariumRef = useRef<THREE.Group>(null!);
  const kryptonRef = useRef<THREE.Group>(null!);
  const flashLightRef = useRef<THREE.PointLight>(null!);
  const radiationParticlesRef = useRef<THREE.Points>(null!);

  // Raycasting for interactive neutron trigger
  const raycastPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);
  const userTrigger = useRef<{ active: boolean; pos: THREE.Vector3 }>({
    active: false,
    pos: new THREE.Vector3(),
  });

  // Fabric Grid parameters
  const gridWidth = 20;
  const gridHeight = 20;
  const segments = 55;
  const initialPositions = useRef<{ x: number; y: number }[]>([]);

  const gridColors = useMemo(() => {
    const count = (segments + 1) * (segments + 1);
    return new Float32Array(count * 3);
  }, [segments]);

  // Nucleon cluster generator for U-235 core (protons & neutrons)
  const u235Nucleons = useMemo(() => {
    const arr = [];
    const count = 38; // Representing U-235 dense core cluster
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * (i / count) - 1);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.22 + (Math.random() - 0.5) * 0.05;
      arr.push({
        basePos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ),
        isProton: i % 2 === 0, // Protons (orange-red) vs Neutrons (blue-white)
        size: 0.085 + Math.random() * 0.02,
      });
    }
    return arr;
  }, []);

  // Secondary Heavy U-235 Nuclei arranged in a ring surrounding center fabric
  const secondaryNuclei = useMemo(() => {
    const list = [];
    const count = 6;
    const radius = 4.2;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + 0.3;
      list.push({
        pos: new THREE.Vector3(Math.cos(angle) * radius, -0.4, Math.sin(angle) * radius),
        fissioned: false,
        fissionTime: -999,
        scale: 0.7,
      });
    }
    return list;
  }, []);

  // Free Neutrons ejected during fission (n0)
  const freeNeutrons = useRef<
    { pos: THREE.Vector3; vel: THREE.Vector3; active: boolean; life: number; color: string }[]
  >([
    { pos: new THREE.Vector3(-7, 0, 0), vel: new THREE.Vector3(0.08, 0, 0), active: true, life: 0, color: '#00FFFF' },
    { pos: new THREE.Vector3(0, 0, 0), vel: new THREE.Vector3(0, 0, 0), active: false, life: 0, color: '#FFFFFF' },
    { pos: new THREE.Vector3(0, 0, 0), vel: new THREE.Vector3(0, 0, 0), active: false, life: 0, color: '#FFFFFF' },
    { pos: new THREE.Vector3(0, 0, 0), vel: new THREE.Vector3(0, 0, 0), active: false, life: 0, color: '#FFFFFF' },
    { pos: new THREE.Vector3(0, 0, 0), vel: new THREE.Vector3(0, 0, 0), active: false, life: 0, color: '#FFFFFF' },
    { pos: new THREE.Vector3(0, 0, 0), vel: new THREE.Vector3(0, 0, 0), active: false, life: 0, color: '#FFFFFF' },
    { pos: new THREE.Vector3(0, 0, 0), vel: new THREE.Vector3(0, 0, 0), active: false, life: 0, color: '#FFFFFF' },
    { pos: new THREE.Vector3(0, 0, 0), vel: new THREE.Vector3(0, 0, 0), active: false, life: 0, color: '#FFFFFF' },
  ]);

  // Radiation Photons / Swarm
  const radCount = 500;
  const radPositions = useMemo(() => new Float32Array(radCount * 3), []);
  const radData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < radCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 7.5;
      arr.push({
        angle,
        radius: r,
        speed: 0.03 + Math.random() * 0.04,
        y: (Math.random() - 0.5) * 1.5,
      });
    }
    return arr;
  }, [radCount]);

  // Fission Cycle State
  const fissionCycle = useRef({
    stage: 0, // 0: INTACT, 1: ABSORBING, 2: SPLITTING, 3: EXPELLED, 4: CASCADE
    stageStartTime: 0,
    primaryFissionTime: -999,
    shockwaves: [] as { x: number; z: number; time: number; energy: number }[],
  });

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(255, 200, 50, 1)');
      g.addColorStop(0.4, 'rgba(255, 80, 0, 0.8)');
      g.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cycle = fissionCycle.current;
    const { raycaster, pointer, camera } = state;

    // Handle user pointer click raycasting to launch neutrons
    raycaster.setFromCamera(pointer, camera);
    if (state.pointer.x !== 0 || state.pointer.y !== 0) {
      const hit = raycaster.ray.intersectPlane(raycastPlane, intersectPoint);
      if (hit && userTrigger.current.active) {
        // Trigger incident neutron towards hit point
        freeNeutrons.current[0].pos.copy(intersectPoint).add(new THREE.Vector3(-4, 0, -2));
        freeNeutrons.current[0].vel
          .copy(intersectPoint)
          .sub(freeNeutrons.current[0].pos)
          .normalize()
          .multiplyScalar(0.12 * particleSpeed);
        freeNeutrons.current[0].active = true;
        userTrigger.current.active = false;
      }
    }

    // ── FISSION CYCLE LOGIC ──
    const cycleAge = time - cycle.stageStartTime;

    // Incident neutron movement & collision with U-235 Core
    const incNeutron = freeNeutrons.current[0];
    if (incNeutron.active) {
      incNeutron.pos.add(incNeutron.vel.clone().multiplyScalar(particleSpeed));
      const distToCenter = incNeutron.pos.distanceTo(new THREE.Vector3(0, 0, 0));

      if (distToCenter < 0.45 && cycle.stage === 0) {
        // HIT! Initiate U-235 Absorption & Liquid Drop Elongation
        cycle.stage = 1; // ABSORBING
        cycle.stageStartTime = time;
        incNeutron.active = false;
      }

      if (incNeutron.pos.length() > 10) {
        // Reset incident neutron if it missed
        incNeutron.pos.set(-7, 0, 0);
        incNeutron.vel.set(0.08 * particleSpeed, 0, 0);
      }
    }

    if (cycle.stage === 0 && cycleAge > 8.0) {
      // Auto-retrigger incident neutron every 8s if idle
      incNeutron.pos.set(-7, 0, 0);
      incNeutron.vel.set(0.08 * particleSpeed, 0, 0);
      incNeutron.active = true;
      cycle.stageStartTime = time;
    }

    // Stage 1: U-236 Absorption & Oscillation (0.4s)
    if (cycle.stage === 1 && cycleAge > 0.4) {
      // Stage 2: VIOLENT FISSION SPLIT
      cycle.stage = 2; // SPLITTING
      cycle.stageStartTime = time;
      cycle.primaryFissionTime = time;

      // Add energy shockwave at center
      cycle.shockwaves.push({ x: 0, z: 0, time, energy: 2.2 * forceStrength });

      // Eject 3 High-Energy Free Neutrons in 120-degree vectors
      const angles = [0.2, 2.3, 4.3];
      for (let i = 1; i <= 3; i++) {
        const n = freeNeutrons.current[i];
        n.pos.set(0, 0, 0);
        const speed = (0.09 + Math.random() * 0.04) * particleSpeed;
        n.vel.set(Math.cos(angles[i - 1]) * speed, (Math.random() - 0.5) * 0.02, Math.sin(angles[i - 1]) * speed);
        n.active = true;
        n.life = 0;
      }
    }

    // Stage 2: Recoil Daughter Fragments (Barium-141 & Krypton-92)
    if (cycle.stage === 2) {
      const splitTime = time - cycle.primaryFissionTime;
      const dist = Math.min(splitTime * 1.8 * particleSpeed, 2.2);

      if (bariumRef.current) {
        bariumRef.current.position.set(-dist * 1.1, Math.sin(splitTime * 3) * 0.1, -dist * 0.6);
        bariumRef.current.rotation.y = time * 2;
      }
      if (kryptonRef.current) {
        kryptonRef.current.position.set(dist * 1.1, -Math.sin(splitTime * 3) * 0.1, dist * 0.6);
        kryptonRef.current.rotation.y = -time * 2.5;
      }

      if (flashLightRef.current) {
        flashLightRef.current.intensity = Math.max(0, (1.0 - splitTime * 1.5) * 12 * forceStrength);
      }

      if (splitTime > 1.2) {
        cycle.stage = 3; // CASCADE STAGE
      }
    }

    // Stage 3 & 4: Free Neutrons travel and strike Secondary Nuclei
    for (let i = 1; i < freeNeutrons.current.length; i++) {
      const n = freeNeutrons.current[i];
      if (n.active) {
        n.pos.add(n.vel.clone().multiplyScalar(particleSpeed));
        n.life += 0.016;

        // Check collision with secondary U-235 nuclei
        secondaryNuclei.forEach((sec) => {
          if (!sec.fissioned && n.pos.distanceTo(sec.pos) < 0.6) {
            sec.fissioned = true;
            sec.fissionTime = time;

            // Secondary Fission Shockwave!
            cycle.shockwaves.push({ x: sec.pos.x, z: sec.pos.z, time, energy: 1.6 * forceStrength });

            // Eject secondary neutrons (neutrons index 4, 5, 6, 7)
            for (let k = 4; k < freeNeutrons.current.length; k++) {
              const secN = freeNeutrons.current[k];
              if (!secN.active) {
                secN.pos.copy(sec.pos);
                const a = Math.random() * Math.PI * 2;
                const spd = (0.08 + Math.random() * 0.04) * particleSpeed;
                secN.vel.set(Math.cos(a) * spd, (Math.random() - 0.5) * 0.03, Math.sin(a) * spd);
                secN.active = true;
                secN.life = 0;
                break;
              }
            }
          }
        });

        if (n.pos.length() > 9 || n.life > 4.0) {
          n.active = false;
        }
      }
    }

    // Reset cycle after full cascade completes (6.5s)
    if (cycle.stage >= 2 && time - cycle.primaryFissionTime > 6.5 * (1 / particleSpeed)) {
      cycle.stage = 0; // Reset to INTACT
      cycle.stageStartTime = time;

      // Reset central core & daughter fragments
      if (bariumRef.current) bariumRef.current.position.set(0, 0, 0);
      if (kryptonRef.current) kryptonRef.current.position.set(0, 0, 0);
      secondaryNuclei.forEach((sec) => {
        sec.fissioned = false;
      });
      for (let i = 1; i < freeNeutrons.current.length; i++) {
        freeNeutrons.current[i].active = false;
      }
      // Re-trigger incident neutron
      incNeutron.pos.set(-7, 0, 0);
      incNeutron.vel.set(0.08 * particleSpeed, 0, 0);
      incNeutron.active = true;
    }

    // ── DEFORM SPACETIME FABRIC GRID & CALCULATE SHOCKWAVES ──
    if (gridGeomRef.current) {
      const posAttr = gridGeomRef.current.attributes.position;
      const colorAttr = gridGeomRef.current.attributes.color;

      if (initialPositions.current.length === 0) {
        for (let i = 0; i < posAttr.count; i++) {
          initialPositions.current.push({ x: posAttr.getX(i), y: posAttr.getY(i) });
        }
      }

      const coords = initialPositions.current;
      // Prune old shockwaves (> 3s old)
      cycle.shockwaves = cycle.shockwaves.filter((sw) => time - sw.time < 3.2);

      for (let i = 0; i < coords.length; i++) {
        const { x, y } = coords[i];

        // 1. Central Core Gravitational / Potential Well
        const dCenter = Math.sqrt(x * x + y * y);
        let depth = -1.6 * forceStrength / (dCenter * 0.75 + 0.5);

        // 2. Secondary Nuclei Wells
        secondaryNuclei.forEach((sec) => {
          const dSec = Math.sqrt((x - sec.pos.x) ** 2 + (y - sec.pos.z) ** 2);
          depth += -0.35 * forceStrength / (dSec * 1.1 + 0.4);
        });

        // 3. Fission Energy Shockwave Ripples
        let shockHeight = 0;
        cycle.shockwaves.forEach((sw) => {
          const dSW = Math.sqrt((x - sw.x) ** 2 + (y - sw.z) ** 2);
          const age = time - sw.time;
          const waveFront = age * 5.0 * particleSpeed;
          const distFromFront = Math.abs(dSW - waveFront);
          if (distFromFront < 1.4) {
            const damp = Math.exp(-age * 1.2) * Math.exp(-dSW * 0.18);
            shockHeight += Math.sin((dSW - waveFront) * 4.0) * damp * sw.energy * 0.8;
          }
        });

        const totalZ = depth + shockHeight;
        posAttr.setZ(i, totalZ);

        // 4. Heat / Radiation Vertex Coloring
        const absZ = Math.abs(totalZ);
        const shockMag = Math.min(Math.abs(shockHeight) * 1.2, 1.0);

        let r = THREE.MathUtils.lerp(0.1, 0.95, Math.min(absZ / 2.0, 1.0));
        let g = THREE.MathUtils.lerp(0.4, 0.3, shockMag);
        let b = THREE.MathUtils.lerp(0.8, 0.05, Math.min(absZ / 1.5, 1.0));

        if (shockMag > 0.15) {
          // Blaze into atomic orange/red during fission shockwave
          r = THREE.MathUtils.lerp(r, 1.0, shockMag);
          g = THREE.MathUtils.lerp(g, 0.5, shockMag);
          b = THREE.MathUtils.lerp(b, 0.1, shockMag);
        }

        colorAttr.setXYZ(i, r, g, b);
      }

      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
    }

    // ── SWARM OF CHERENKOV / GAMMA RADIATION PARTICLES ──
    if (radiationParticlesRef.current) {
      const ptsAttr = radiationParticlesRef.current.geometry.attributes.position;
      for (let i = 0; i < radCount; i++) {
        const pt = radData[i];
        pt.angle += pt.speed * particleSpeed;
        const px = Math.cos(pt.angle) * pt.radius;
        const pz = Math.sin(pt.angle) * pt.radius;
        const dC = Math.sqrt(px * px + pz * pz);
        const py = -1.4 * forceStrength / (dC * 0.75 + 0.5) + pt.y;

        ptsAttr.setXYZ(i, px, py, pz);
      }
      ptsAttr.needsUpdate = true;
    }

    // Central Core rotation & vibration
    if (centralCoreRef.current && cycle.stage === 0) {
      centralCoreRef.current.rotation.y = time * 0.5;
      centralCoreRef.current.rotation.z = Math.sin(time * 2) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 10]} intensity={1.8} color="#FF6600" />
      <pointLight ref={flashLightRef} position={[0, 0, 0]} intensity={4} color="#FFAA00" distance={12} />

      {/* ── CENTRAL U-235 UNBROKEN NUCLEUS (Stage 0, 1) ── */}
      {fissionCycle.current.stage <= 1 && (
        <group ref={centralCoreRef} position={[0, -0.6, 0]}>
          {/* Outer glowing plasma envelope */}
          <mesh>
            <sphereGeometry args={[0.48, 32, 32]} />
            <meshStandardMaterial
              color="#EF4444"
              roughness={0.2}
              metalness={0.6}
              emissive="#FF3300"
              emissiveIntensity={0.8}
            />
          </mesh>
          {/* U-235 Nucleons Cluster */}
          {u235Nucleons.map((n, idx) => (
            <mesh key={idx} position={n.basePos}>
              <sphereGeometry args={[n.size, 16, 16]} />
              <meshStandardMaterial
                color={n.isProton ? '#FF4400' : '#00E5FF'}
                emissive={n.isProton ? '#FF2200' : '#0099FF'}
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* ── DAUGHTER NUCLEI (Stage 2, 3, 4: BARIUM-141 & KRYPTON-92) ── */}
      {fissionCycle.current.stage >= 2 && (
        <group position={[0, -0.6, 0]}>
          {/* Barium-141 Fragment */}
          <group ref={bariumRef}>
            <mesh>
              <sphereGeometry args={[0.34, 24, 24]} />
              <meshStandardMaterial color="#8B5CF6" emissive="#7C3AED" emissiveIntensity={0.9} />
              <pointLight color="#8B5CF6" intensity={2} distance={4} />
            </mesh>
          </group>

          {/* Krypton-92 Fragment */}
          <group ref={kryptonRef}>
            <mesh>
              <sphereGeometry args={[0.26, 24, 24]} />
              <meshStandardMaterial color="#10B981" emissive="#059669" emissiveIntensity={0.9} />
              <pointLight color="#10B981" intensity={2} distance={4} />
            </mesh>
          </group>
        </group>
      )}

      {/* ── SECONDARY U-235 NUCLEI RING ON FABRIC ── */}
      {secondaryNuclei.map((sec, idx) => (
        <group key={idx} position={sec.pos}>
          <mesh scale={sec.fissioned ? [1.4, 0.2, 1.4] : [0.35, 0.35, 0.35]}>
            <sphereGeometry args={[1, 20, 20]} />
            <meshStandardMaterial
              color={sec.fissioned ? '#FF0000' : '#F97316'}
              emissive={sec.fissioned ? '#FF5500' : '#EA580C'}
              emissiveIntensity={sec.fissioned ? 1.5 : 0.6}
            />
          </mesh>
          {sec.fissioned && (
            <pointLight color="#FF4400" intensity={3} distance={5} />
          )}
        </group>
      ))}

      {/* ── FREE EJECTED NEUTRONS (n0 Particles) ── */}
      {freeNeutrons.current.map(
        (n, idx) =>
          n.active && (
            <mesh key={idx} position={n.pos}>
              <sphereGeometry args={[0.11, 16, 16]} />
              <meshBasicMaterial color={n.color} />
              <pointLight color={n.color} intensity={2.5} distance={3} />
            </mesh>
          )
      )}

      {/* ── CHERENKOV & GAMMA RADIATION SWARM ── */}
      <points ref={radiationParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[radPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          map={particleTexture}
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ── SPACETIME & ENERGY DEFORMABLE FABRIC GRID ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry ref={gridGeomRef} args={[gridWidth, gridHeight, segments, segments]}>
          <bufferAttribute attach="attributes-color" args={[gridColors, 3]} />
        </planeGeometry>
        <meshBasicMaterial vertexColors wireframe transparent opacity={0.5} />
      </mesh>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   MAIN HERO CANVAS WRAPPER
   ────────────────────────────────────────────────────────────────────────────── */
export default function HeroPhysicsUniverse({
  mode = 'nuclear',
  forceStrength = 1.0,
  particleSpeed = 1.0,
}: HeroPhysicsUniverseProps) {
  return (
    <div className="absolute inset-0 w-full h-full select-none">
      <Canvas
        camera={{ position: [0, 6.0, 8.0], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.2}
          maxPolarAngle={Math.PI / 2.15}
          minPolarAngle={Math.PI / 3.4}
        />

        {mode === 'gravity' && (
          <GravitySpacetimeScene forceStrength={forceStrength} particleSpeed={particleSpeed} />
        )}
        {mode === 'electromagnetism' && (
          <ElectromagnetismScene forceStrength={forceStrength} particleSpeed={particleSpeed} />
        )}
        {mode === 'quantum' && (
          <QuantumAtomicScene forceStrength={forceStrength} particleSpeed={particleSpeed} />
        )}
        {mode === 'waves' && (
          <WaveOpticsScene forceStrength={forceStrength} particleSpeed={particleSpeed} />
        )}
        {mode === 'nuclear' && (
          <NuclearChainReactionScene forceStrength={forceStrength} particleSpeed={particleSpeed} />
        )}
      </Canvas>
    </div>
  );
}

