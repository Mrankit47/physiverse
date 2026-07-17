'use client';

import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import HeroAtom from './HeroAtom';

/* ── Quantum Wave Function Height Calculation ── */
function getQuantumHeight(
  x: number,
  z: number,
  time: number,
  mouse: THREE.Vector2,
  node1: THREE.Vector3,
  node2: THREE.Vector3
) {
  // 1. Distance to Emitter Nodes
  const d1 = Math.sqrt((x - node1.x) ** 2 + (z - node1.z) ** 2);
  const d2 = Math.sqrt((x - node2.x) ** 2 + (z - node2.z) ** 2);

  // 2. Oscillating Spherical Waves (propagating probability waves)
  const w1 = Math.cos(d1 * 2.3 - time * 3.5) * Math.exp(-d1 * 0.16);
  const w2 = Math.cos(d2 * 2.3 - time * 3.5) * Math.exp(-d2 * 0.16);

  // 3. Superposition & Interference Fringes
  const waveInterference = 0.65 * (w1 + w2);

  // 4. Mouse Measurement Probe Well (collapses/bends grid locally)
  let probeWell = 0;
  if (mouse.x < 500) {
    const dm = Math.sqrt((x - mouse.x) ** 2 + (z - mouse.y) ** 2);
    const influence = Math.max(0, 1 - dm / 5.5);
    probeWell = -1.4 * influence / (dm * 0.55 + 0.45);
  }

  return waveInterference + probeWell;
}

/* ── Scene Components & Unified Physics Loop ── */
function SceneContent() {
  // References
  const gridGeometryRef = useRef<THREE.BufferGeometry>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  
  const node1MeshRef = useRef<THREE.Mesh>(null!);
  const node2MeshRef = useRef<THREE.Mesh>(null!);
  const mouseMeshRef = useRef<THREE.Mesh>(null!);

  // Physics States
  const node1Pos = useMemo(() => new THREE.Vector3(), []);
  const node2Pos = useMemo(() => new THREE.Vector3(), []);
  const mouseWorldPos = useRef(new THREE.Vector2(999, 999));

  // Mouse Raycasting Plane
  const raycastPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.5), []);
  const intersectionPoint = useMemo(() => new THREE.Vector3(), []);

  // Grid Dimensions & Resolution
  const gridWidth = 16;
  const gridHeight = 16;
  const segments = 45; // 46 x 46 = 2116 vertices
  
  // Cache initial flat X/Y coordinates
  const initialCoords = useRef<{ x: number; y: number }[]>([]);

  // Pre-initialize grid colors buffer
  const gridColors = useMemo(() => {
    const count = (segments + 1) * (segments + 1);
    return new Float32Array(count * 3);
  }, [segments]);

  // Particle Swarm Setup (1000 quantum dust particles)
  const particleCount = 1000;
  const particlePositions = useMemo(() => new Float32Array(particleCount * 3), []);
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 6.5;
      data.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        y: 0,
        speed: 0.02 + Math.random() * 0.025,
        angle: angle,
        emitterId: Math.random() > 0.5 ? 1 : 2,
        life: Math.random(),
      });
    }
    return data;
  }, []);

  // Circular texture suited for light background (indigo/slate translucent orbs)
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(30, 41, 59, 1)');      // Dark slate core
      gradient.addColorStop(0.4, 'rgba(79, 70, 229, 0.75)'); // Indigo glow
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Unified Frame update loop running at 60fps
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Raycast cursor coordinates onto virtual flat floor plane (Y = -0.5)
    const { raycaster, pointer, camera } = state;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.ray.intersectPlane(raycastPlane, intersectionPoint);
    
    if (intersects) {
      if (mouseWorldPos.current.x > 500) {
        mouseWorldPos.current.set(intersectionPoint.x, intersectionPoint.z);
      } else {
        // Smooth lerp to trailing mouse well
        mouseWorldPos.current.x += (intersectionPoint.x - mouseWorldPos.current.x) * 0.16;
        mouseWorldPos.current.y += (intersectionPoint.z - mouseWorldPos.current.y) * 0.16;
      }
    } else {
      mouseWorldPos.current.set(999, 999);
    }

    // 2. Update Spinning Emitter Nodes positions
    const orbRadius = 1.8;
    const orbSpeed = 0.35;
    const orbAngle = time * orbSpeed;
    
    node1Pos.set(
      -orbRadius * Math.cos(orbAngle),
      getQuantumHeight(-orbRadius * Math.cos(orbAngle), -orbRadius * Math.sin(orbAngle), time, mouseWorldPos.current, node1Pos, node2Pos) - 0.5,
      -orbRadius * Math.sin(orbAngle)
    );
    
    node2Pos.set(
      orbRadius * Math.cos(orbAngle),
      getQuantumHeight(orbRadius * Math.cos(orbAngle), orbRadius * Math.sin(orbAngle), time, mouseWorldPos.current, node1Pos, node2Pos) - 0.5,
      orbRadius * Math.sin(orbAngle)
    );

    if (node1MeshRef.current) node1MeshRef.current.position.copy(node1Pos);
    if (node2MeshRef.current) node2MeshRef.current.position.copy(node2Pos);

    // 3. Position Mouse measurement probe (collapses to Y grid height or hides)
    if (mouseMeshRef.current) {
      if (mouseWorldPos.current.x < 500) {
        const mouseHeight = getQuantumHeight(mouseWorldPos.current.x, mouseWorldPos.current.y, time, mouseWorldPos.current, node1Pos, node2Pos) - 0.5;
        mouseMeshRef.current.position.set(mouseWorldPos.current.x, mouseHeight, mouseWorldPos.current.y);
        mouseMeshRef.current.scale.set(1, 1, 1);
      } else {
        mouseMeshRef.current.scale.set(0, 0, 0); // Hide
      }
    }

    // 4. Update Spacetime Grid Vertices & Vertex Colors
    if (gridGeometryRef.current) {
      const posAttr = gridGeometryRef.current.attributes.position;
      const colorAttr = gridGeometryRef.current.attributes.color;

      // Cache coordinate references on first frame
      if (initialCoords.current.length === 0) {
        for (let i = 0; i < posAttr.count; i++) {
          initialCoords.current.push({ x: posAttr.getX(i), y: posAttr.getY(i) });
        }
      }

      const coords = initialCoords.current;
      for (let i = 0; i < coords.length; i++) {
        const { x, y } = coords[i]; // Local X/Y represent world space X/Z
        const zVal = getQuantumHeight(x, y, time, mouseWorldPos.current, node1Pos, node2Pos);
        posAttr.setZ(i, zVal);

        // Color mapping suited for white background (Default: light slate-blue lines)
        let r = 0.65, g = 0.72, b = 0.8; // subtle slate blue/grey

        if (zVal < -0.8) {
          // Intense measurement collapse well (Mouse well) - deep orange/red
          const t = Math.min((-zVal - 0.8) / 1.2, 1.0);
          r = 0.65 + t * (0.9 - 0.65);
          g = 0.72 - t * (0.72 - 0.35);
          b = 0.8 - t * (0.8 - 0.0);
        } else if (zVal > 0) {
          // Constructive interference peaks (cyan left, magenta right - darkened to show on white)
          const t = Math.min(zVal / 0.7, 1.0);
          const mixFactor = Math.sin(x * 0.25) * 0.5 + 0.5; // X-based spatial blend
          const peakR = mixFactor * 0.75 + (1 - mixFactor) * 0.0;
          const peakG = mixFactor * 0.1 + (1 - mixFactor) * 0.55;
          const peakB = mixFactor * 0.5 + (1 - mixFactor) * 0.7;
          r = 0.65 + t * (peakR - 0.65);
          g = 0.72 + t * (peakG - 0.72);
          b = 0.8 + t * (peakB - 0.8);
        } else {
          // Destructive interference troughs (medium royal violet/blue)
          const t = Math.min(-zVal / 0.8, 1.0);
          r = 0.65 - t * 0.25;
          g = 0.72 - t * 0.35;
          b = 0.8 - t * 0.15;
        }

        colorAttr.setXYZ(i, r, g, b);
      }
      posAttr.needsUpdate = true;
      colorAttr.needsUpdate = true;
    }

    // 5. Update Quantum Swarm (Particles guided by Emitters and Mouse)
    if (pointsRef.current) {
      const pointsGeom = pointsRef.current.geometry;
      const ptsAttr = pointsGeom.attributes.position;

      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        const emitter = p.emitterId === 1 ? node1Pos : node2Pos;

        // Advance orbit angle
        p.angle += p.speed * 0.45;

        // Flow outwards from emitters in spiral orbits
        const radius = 1.0 + p.life * 6.0;
        const targetX = emitter.x + Math.cos(p.angle) * radius;
        const targetZ = emitter.z + Math.sin(p.angle) * radius;

        // Move towards target spiral path
        p.x += (targetX - p.x) * 0.04;
        p.z += (targetZ - p.z) * 0.04;

        // Cursor attraction & swirling cyclone effect
        if (mouseWorldPos.current.x < 500) {
          const dx = mouseWorldPos.current.x - p.x;
          const dz = mouseWorldPos.current.y - p.z;
          const distToMouse = Math.sqrt(dx * dx + dz * dz);
          
          if (distToMouse < 4.0) {
            const pull = (1.0 - distToMouse / 4.0) * 0.12;
            p.x += dx * pull;
            p.z += dz * pull;
            // Cyclonic orbit around cursor
            p.x -= dz * pull * 0.6;
            p.z += dx * pull * 0.6;
          }
        }

        // Advance particle life cycle
        p.life += p.speed * 0.15;
        if (p.life > 1.0) {
          p.life = 0;
          p.angle = Math.random() * Math.PI * 2;
          p.x = emitter.x + Math.cos(p.angle) * 0.15;
          p.z = emitter.z + Math.sin(p.angle) * 0.15;
        }

        // Align particles precisely to ride the waves (with minor float elevation offset)
        p.y = getQuantumHeight(p.x, p.z, time, mouseWorldPos.current, node1Pos, node2Pos) - 0.5 + 0.04;

        ptsAttr.setXYZ(i, p.x, p.y, p.z);
      }
      ptsAttr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Higher ambient light for light background clarity */}
      <ambientLight intensity={0.55} />

      {/* Node 1: Glowing Cyan Quantum Emitter */}
      <mesh ref={node1MeshRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#0284C7" />
        <pointLight color="#0284C7" intensity={2.0} distance={5} decay={1.8} />
      </mesh>

      {/* Node 2: Glowing Magenta/Rose Quantum Emitter */}
      <mesh ref={node2MeshRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#DB2777" />
        <pointLight color="#DB2777" intensity={2.0} distance={5} decay={1.8} />
      </mesh>

      {/* Mouse Probe: Glowing Slate Particle Detector */}
      <mesh ref={mouseMeshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#1E293B" />
        <pointLight color="#4F46E5" intensity={1.8} distance={4} decay={1.8} />
      </mesh>

      {/* Quantum Dust Particle Swarm */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          map={particleTexture}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Undulating Quantum Field Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry ref={gridGeometryRef} args={[gridWidth, gridHeight, segments, segments]}>
          <bufferAttribute
            attach="attributes-color"
            args={[gridColors, 3]}
          />
        </planeGeometry>
        <meshBasicMaterial vertexColors wireframe transparent opacity={0.45} />
      </mesh>

      {/* 3D Atom - Floating physics object */}
      <HeroAtom position={[3.5, 1.2, -1]} />
    </>
  );
}

/* ── Hero Scene Canvas Wrapper ── */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 5.5, 7.5], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.15}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 3.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
