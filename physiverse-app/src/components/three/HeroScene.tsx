'use client';

import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ── Spacetime Height Calculation ── */
function getSpacetimeHeight(
  x: number,
  z: number,
  time: number,
  mouse: THREE.Vector2,
  mass1Pos: THREE.Vector3,
  mass2Pos: THREE.Vector3
) {
  // 1. Center mass (singularity) - static at (0, 0)
  const distCenter = Math.sqrt(x * x + z * z);
  const warpCenter = -1.2 / (distCenter * 0.45 + 0.65);

  // 2. Mass 1 (inner blue orbiter)
  const distMass1 = Math.sqrt((x - mass1Pos.x) ** 2 + (z - mass1Pos.z) ** 2);
  const warpMass1 = -0.65 / (distMass1 * 0.7 + 0.45);

  // 3. Mass 2 (outer green orbiter)
  const distMass2 = Math.sqrt((x - mass2Pos.x) ** 2 + (z - mass2Pos.z) ** 2);
  const warpMass2 = -0.35 / (distMass2 * 0.75 + 0.5);

  // 4. Mouse gravity well (only active when hovered)
  let warpMouse = 0;
  if (mouse.x < 500) {
    const distMouse = Math.sqrt((x - mouse.x) ** 2 + (z - mouse.y) ** 2);
    const mouseInfluence = Math.max(0, 1 - distMouse / 5.5);
    warpMouse = -1.3 * mouseInfluence / (distMouse * 0.55 + 0.45);
  }

  // 5. Gravitational ripples from center
  const waveCenter = Math.sin(distCenter * 2.2 - time * 3.8) * 0.12 * Math.exp(-distCenter * 0.18);

  // 6. Ripples from orbiting Mass 1
  const waveMass1 = Math.sin(distMass1 * 2.8 - time * 4.6) * 0.06 * Math.exp(-distMass1 * 0.35);

  return warpCenter + warpMass1 + warpMass2 + warpMouse + waveCenter + waveMass1;
}

/* ── Spacetime Grid Component ── */
function SpacetimeGrid({
  mouseWorldPos,
  mass1Pos,
  mass2Pos,
}: {
  mouseWorldPos: React.MutableRefObject<THREE.Vector2>;
  mass1Pos: THREE.Vector3;
  mass2Pos: THREE.Vector3;
}) {
  const geometryRef = useRef<THREE.BufferGeometry>(null!);
  
  // Grid properties
  const width = 16;
  const height = 16;
  const segments = 45; // 46 x 46 = 2116 vertices
  
  const initialCoords = useRef<{ x: number; y: number }[]>([]);

  // Pre-initialize colors array to feed WebGL buffer attribute
  const colors = useMemo(() => {
    const count = (segments + 1) * (segments + 1);
    return new Float32Array(count * 3);
  }, [segments]);

  useFrame((state) => {
    if (!geometryRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = geometryRef.current.attributes.position;
    const colorAttr = geometryRef.current.attributes.color;

    // Cache local flat coordinate positions on first run
    if (initialCoords.current.length === 0) {
      for (let i = 0; i < posAttr.count; i++) {
        initialCoords.current.push({ x: posAttr.getX(i), y: posAttr.getY(i) });
      }
    }

    const coords = initialCoords.current;
    for (let i = 0; i < coords.length; i++) {
      const { x, y } = coords[i];
      
      // Local plane geometry coordinates are X and Y, representing world space X and Z
      const zVal = getSpacetimeHeight(x, y, time, mouseWorldPos.current, mass1Pos, mass2Pos);
      posAttr.setZ(i, zVal);

      // Gradient color mapping based on local deformation (depth)
      const depth = -zVal;
      let r = 0.05, g = 0.1, b = 0.35; // Deep indigo baseline

      if (depth < 0.8) {
        const t = depth / 0.8;
        r = 0.05 + t * 0.45; // Transitions towards purple
        g = 0.1 - t * 0.05;
        b = 0.35 + t * 0.35;
      } else {
        const t = Math.min((depth - 0.8) / 1.5, 1.0);
        r = 0.5 + t * 0.5;   // Transitions towards bright orange/red energy glow
        g = 0.05 + t * 0.43;
        b = 0.7 - t * 0.7;
      }
      colorAttr.setXYZ(i, r, g, b);
    }
    
    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry ref={geometryRef} args={[width, height, segments, segments]}>
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </planeGeometry>
      <meshBasicMaterial vertexColors wireframe transparent opacity={0.6} />
    </mesh>
  );
}

/* ── Scene Components & Loop Handler ── */
function SceneContent() {
  const accretionDiskRef = useRef<THREE.Mesh>(null!);
  const singularityRef = useRef<THREE.Group>(null!);
  const orbiter1Ref = useRef<THREE.Group>(null!);
  const orbiter2Ref = useRef<THREE.Group>(null!);

  const mass1Pos = useMemo(() => new THREE.Vector3(), []);
  const mass2Pos = useMemo(() => new THREE.Vector3(), []);
  const mouseWorldPos = useRef(new THREE.Vector2(999, 999));

  // Virtual plane at Y = -0.5 used to project pointer coordinates into 3D space
  const raycastPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.5), []);
  const intersectionPoint = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Translate screen pointer into world coordinates on the grid plane
    const { raycaster, pointer, camera } = state;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.ray.intersectPlane(raycastPlane, intersectionPoint);
    
    if (intersects) {
      // Lerp mouse positions to create a smooth, viscous trailing well
      if (mouseWorldPos.current.x > 500) {
        mouseWorldPos.current.set(intersectionPoint.x, intersectionPoint.z);
      } else {
        mouseWorldPos.current.x += (intersectionPoint.x - mouseWorldPos.current.x) * 0.15;
        mouseWorldPos.current.y += (intersectionPoint.z - mouseWorldPos.current.y) * 0.15;
      }
    } else {
      // Send well far away if cursor leaves canvas plane
      mouseWorldPos.current.set(999, 999);
    }

    // 2. Animate Inner Orbiter (Blue Singularity)
    const radius1 = 2.4;
    const speed1 = 0.65;
    const angle1 = time * speed1;
    mass1Pos.x = Math.cos(angle1) * radius1;
    mass1Pos.z = Math.sin(angle1) * radius1;
    // Align orbiter Y coordinate perfectly with the warped grid depth
    mass1Pos.y = getSpacetimeHeight(mass1Pos.x, mass1Pos.z, time, mouseWorldPos.current, mass1Pos, mass2Pos) - 0.5;
    
    if (orbiter1Ref.current) {
      orbiter1Ref.current.position.copy(mass1Pos);
    }

    // 3. Animate Outer Orbiter (Green Singularity)
    const radius2 = 3.8;
    const speed2 = -0.4;
    const angle2 = time * speed2;
    mass2Pos.x = Math.cos(angle2) * radius2;
    mass2Pos.z = Math.sin(angle2) * radius2;
    // Align orbiter Y coordinate perfectly with the warped grid depth
    mass2Pos.y = getSpacetimeHeight(mass2Pos.x, mass2Pos.z, time, mouseWorldPos.current, mass1Pos, mass2Pos) - 0.5;

    if (orbiter2Ref.current) {
      orbiter2Ref.current.position.copy(mass2Pos);
    }

    // 4. Update Central Singularity position (height drops slightly as orbital gravity oscillates)
    const centerY = getSpacetimeHeight(0, 0, time, mouseWorldPos.current, mass1Pos, mass2Pos) - 0.5;
    if (singularityRef.current) {
      singularityRef.current.position.set(0, centerY, 0);
    }

    // Rotate the black hole accretion disk
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.z = time * 0.35;
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      
      {/* Central Gravitational Singularity (Black Hole) */}
      <group ref={singularityRef}>
        {/* Core Event Horizon */}
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        
        {/* Glowing Lensing/Energy Envelope */}
        <mesh>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshStandardMaterial
            color="#FF7A00"
            emissive="#FF4500"
            emissiveIntensity={2.5}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* Accretion Disk */}
        <mesh ref={accretionDiskRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.75, 1.8, 64]} />
          <meshStandardMaterial
            color="#FF3C00"
            emissive="#FF6000"
            emissiveIntensity={1.8}
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        <pointLight intensity={3.5} color="#FF7A00" distance={10} decay={1.5} />
      </group>

      {/* Blue Orbiting Mass */}
      <group ref={orbiter1Ref}>
        <mesh>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={2.0} />
        </mesh>
        <pointLight color="#3B82F6" intensity={2.0} distance={4.5} decay={2.0} />
      </group>

      {/* Green Orbiting Mass */}
      <group ref={orbiter2Ref}>
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={1.8} />
        </mesh>
        <pointLight color="#10B981" intensity={1.5} distance={3.5} decay={2.0} />
      </group>

      {/* Ambient Cosmos Stars */}
      <Stars
        radius={45}
        depth={60}
        count={2500}
        factor={3.5}
        saturation={0.6}
        fade
        speed={0.4}
      />

      {/* The Dynamic Spacetime Fabric */}
      <SpacetimeGrid mouseWorldPos={mouseWorldPos} mass1Pos={mass1Pos} mass2Pos={mass2Pos} />
    </>
  );
}

/* ── Hero Scene Canvas Wrapper ── */
export default function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 6, 8], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.2}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 3.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
