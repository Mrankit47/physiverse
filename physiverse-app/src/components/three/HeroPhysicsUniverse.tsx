'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

export type PhysicsMode = 'gravity' | 'electromagnetism' | 'quantum' | 'waves';

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
   MAIN HERO CANVAS WRAPPER
   ────────────────────────────────────────────────────────────────────────────── */
export default function HeroPhysicsUniverse({
  mode = 'gravity',
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
      </Canvas>
    </div>
  );
}
