'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  Info,
  BookOpen,
  Sliders,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  Camera,
  Atom as AtomIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════════════ */

interface ParticleInfo {
  id: string;
  type: 'proton' | 'neutron' | 'electron';
  name: string;
  charge: string;
  mass: string;
  quarks?: string;
  shellIndex?: number;
  quantumNumbers?: string;
}

interface ShellConfig {
  n: number;
  radius: number;
  capacity: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  speed: number;
}

const SHELL_PRESETS: ShellConfig[] = [
  { n: 1, radius: 2.8, capacity: 2, tiltX: 0.3, tiltY: 0.2, tiltZ: 0.1, speed: 1.8 },
  { n: 2, radius: 4.8, capacity: 8, tiltX: -0.6, tiltY: 0.8, tiltZ: 0.4, speed: 1.2 },
  { n: 3, radius: 6.8, capacity: 8, tiltX: 0.8, tiltY: -0.5, tiltZ: -0.3, speed: 0.8 },
  { n: 4, radius: 8.8, capacity: 18, tiltX: -0.4, tiltY: 1.2, tiltZ: 0.7, speed: 0.5 },
];

/* ═══════════════════════════════════════════════════════════════
   3D SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

// 1. Nucleus component with densely packed Protons and Neutrons
function Nucleus({
  protons,
  neutrons,
  isExpanded,
  onSelectNucleus,
  onSelectParticle,
}: {
  protons: number;
  neutrons: number;
  isExpanded: boolean;
  onSelectNucleus: () => void;
  onSelectParticle: (info: ParticleInfo) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate tightly packed sphere positions using Fibonacci spiral on concentric spheres
  const particles = useMemo(() => {
    const total = protons + neutrons;
    const items: Array<{
      id: string;
      type: 'proton' | 'neutron';
      basePos: THREE.Vector3;
      color: string;
    }> = [];

    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < total; i++) {
      const isProton = i < protons;
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / total);

      // Layered radius for dense packing
      const layer = Math.floor(i / 12);
      const r = 0.45 + layer * 0.4 + (Math.random() * 0.08 - 0.04);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      items.push({
        id: `${isProton ? 'proton' : 'neutron'}-${i}`,
        type: isProton ? 'proton' : 'neutron',
        basePos: new THREE.Vector3(x, y, z),
        color: isProton ? '#FF4500' : '#3B82F6',
      });
    }
    return items;
  }, [protons, neutrons]);

  useFrame(({ clock }) => {
    if (groupRef.current && !isExpanded) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelectNucleus();
      }}
    >
      {/* Central Strong Force Glow */}
      <Sphere args={[1.4, 32, 32]}>
        <meshBasicMaterial
          color="#FF6B00"
          transparent
          opacity={isExpanded ? 0.08 : 0.25}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {particles.map((p, idx) => {
        const spreadFactor = isExpanded ? 2.8 : 1.0;
        const targetPos = p.basePos.clone().multiplyScalar(spreadFactor);

        return (
          <group key={p.id} position={[targetPos.x, targetPos.y, targetPos.z]}>
            <Sphere
              args={[0.26, 24, 24]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectParticle({
                  id: p.id,
                  type: p.type,
                  name: p.type === 'proton' ? `Proton #${idx + 1}` : `Neutron #${idx + 1 - protons}`,
                  charge: p.type === 'proton' ? '+1 e (+1.602×10⁻¹⁹ C)' : '0 e (Neutral)',
                  mass: p.type === 'proton' ? '1.007276 u (1.6726×10⁻²⁷ kg)' : '1.008665 u (1.6749×10⁻²⁷ kg)',
                  quarks: p.type === 'proton' ? '2 Up (+2/3) + 1 Down (-1/3)' : '1 Up (+2/3) + 2 Down (-1/3)',
                });
              }}
            >
              <meshStandardMaterial
                color={p.color}
                roughness={0.2}
                metalness={0.6}
                emissive={p.color}
                emissiveIntensity={0.3}
              />
            </Sphere>
            {isExpanded && (
              <Html distanceFactor={12}>
                <div className="px-2 py-0.5 rounded text-[10px] font-bold shadow-lg whitespace-nowrap"
                  style={{
                    background: p.type === 'proton' ? 'rgba(255, 69, 0, 0.85)' : 'rgba(59, 130, 246, 0.85)',
                    color: '#FFF',
                  }}>
                  {p.type === 'proton' ? 'p⁺ (uud)' : 'n⁰ (udd)'}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

// 2. Electron Orbits and Orbiting Electrons
function OrbitingElectron({
  shell,
  index,
  totalInShell,
  speedMultiplier,
  isPaused,
  hoveredId,
  setHoveredId,
  onSelectParticle,
}: {
  shell: ShellConfig;
  index: number;
  totalInShell: number;
  speedMultiplier: number;
  isPaused: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onSelectParticle: (info: ParticleInfo) => void;
}) {
  const electronRef = useRef<THREE.Mesh>(null);
  const id = `electron-shell${shell.n}-idx${index}`;
  const isHovered = hoveredId === id;

  // Phase offset evenly distributed in the shell + random offset
  const phaseOffset = (index / totalInShell) * Math.PI * 2;

  useFrame(({ clock }) => {
    if (isPaused) return;
    const t = clock.getElapsedTime() * shell.speed * speedMultiplier + phaseOffset;

    const x = Math.cos(t) * shell.radius;
    const y = Math.sin(t) * (shell.radius * 0.85); // Slightly elliptical
    const z = Math.sin(t * 2) * 0.3;

    if (electronRef.current) {
      electronRef.current.position.set(x, y, z);
    }
  });

  // Calculate 3D points for Orbit Line ring
  const ringPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * shell.radius;
      const y = Math.sin(theta) * (shell.radius * 0.85);
      const z = Math.sin(theta * 2) * 0.3;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [shell.radius]);

  const lValue = shell.n - 1;
  const mlValue = index % (2 * lValue + 1) - lValue;

  return (
    <group rotation={[shell.tiltX, shell.tiltY, shell.tiltZ]}>
      {/* Orbital Ring Line */}
      <Line
        points={ringPoints}
        color={isHovered ? '#00FFFF' : '#00E5FF'}
        opacity={isHovered ? 0.9 : 0.25}
        transparent
        lineWidth={isHovered ? 2.5 : 1}
      />

      {/* Electron Mesh */}
      <mesh
        ref={electronRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredId(id);
        }}
        onPointerOut={() => setHoveredId(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelectParticle({
            id,
            type: 'electron',
            name: `Electron (Shell n=${shell.n})`,
            charge: '-1 e (-1.602×10⁻¹⁹ C)',
            mass: '0.00054858 u (9.1093×10⁻³¹ kg)',
            shellIndex: shell.n,
            quantumNumbers: `n=${shell.n}, l=${lValue}, mₗ=${mlValue}, s=±1/2`,
          });
        }}
      >
        <sphereGeometry args={[isHovered ? 0.22 : 0.16, 24, 24]} />
        <meshStandardMaterial
          color={isHovered ? '#00FFFF' : '#00E5FF'}
          emissive={isHovered ? '#00FFFF' : '#00E5FF'}
          emissiveIntensity={isHovered ? 1.5 : 0.8}
          roughness={0.1}
        />

        {/* Glow halo */}
        <Sphere args={[isHovered ? 0.45 : 0.3, 16, 16]}>
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={isHovered ? 0.5 : 0.2}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>

        {isHovered && (
          <Html distanceFactor={10}>
            <div className="px-2.5 py-1 rounded-lg backdrop-blur-md shadow-xl text-xs font-semibold whitespace-nowrap"
              style={{
                background: 'rgba(0, 229, 255, 0.9)',
                color: '#000',
                border: '1px solid #FFF',
              }}>
              e⁻ Shell {shell.n} | n={shell.n}, l={lValue}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

// Camera Controller for smooth Zoom/Position Animations
function CameraRig({
  isNucleusZoomed,
}: {
  isNucleusZoomed: boolean;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const targetPos = isNucleusZoomed ? new THREE.Vector3(0, 0.5, 4.5) : new THREE.Vector3(0, 4, 16);
    camera.position.lerp(targetPos, 0.05);
  });

  return null;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ATOM VISUALIZATION PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function AtomVisualization() {
  // State
  const [electronCount, setElectronCount] = useState<number>(6); // Default Carbon (Z=6)
  const [orbitSpeed, setOrbitSpeed] = useState<number>(1.0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedParticle, setSelectedParticle] = useState<ParticleInfo | null>(null);
  const [isNucleusZoomed, setIsNucleusZoomed] = useState<boolean>(false);
  const [learningStep, setLearningStep] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Derive Protons, Neutrons, and Shell Distribution
  const protons = electronCount;
  const neutrons = Math.round(electronCount * 1.1);

  // Distribute electrons into shells
  const shellDistributions = useMemo(() => {
    let remaining = electronCount;
    const result: Array<{ shell: ShellConfig; count: number }> = [];

    for (const shell of SHELL_PRESETS) {
      if (remaining <= 0) break;
      const count = Math.min(remaining, shell.capacity);
      result.push({ shell, count });
      remaining -= count;
    }
    return result;
  }, [electronCount]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Learning Mode Steps
  const learningSteps = [
    {
      title: '1. The Atomic Nucleus',
      text: 'At the center of the atom lies the tiny, dense nucleus containing positively charged protons and neutral neutrons bound together by the strong nuclear force.',
      action: () => setIsNucleusZoomed(true),
    },
    {
      title: '2. Electron Shells & Orbits',
      text: 'Electrons orbit the nucleus in specific 3D energy levels (shells n=1, 2, 3...). Inner shells fill first before outer valence shells.',
      action: () => {
        setIsNucleusZoomed(false);
        setElectronCount(6);
      },
    },
    {
      title: '3. Subatomic Quarks',
      text: 'Protons and neutrons are composite particles made of elementary quarks: Protons contain 2 Up (+2/3) and 1 Down (-1/3) quark; Neutrons contain 1 Up and 2 Down quarks.',
      action: () => setIsNucleusZoomed(true),
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)' }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 4, 16], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#030712']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00E5FF" />

        <CameraRig isNucleusZoomed={isNucleusZoomed} />

        {/* Nucleus */}
        <Nucleus
          protons={protons}
          neutrons={neutrons}
          isExpanded={isNucleusZoomed}
          onSelectNucleus={() => {
            setIsNucleusZoomed(!isNucleusZoomed);
            setSelectedParticle({
              id: 'nucleus',
              type: 'proton',
              name: `Atomic Nucleus (Z=${protons})`,
              charge: `+${protons} e`,
              mass: `~${protons + neutrons} u`,
              quarks: `Total Quarks: ${protons * 3 + neutrons * 3}`,
            });
          }}
          onSelectParticle={setSelectedParticle}
        />

        {/* Electron Shells */}
        {!isNucleusZoomed &&
          shellDistributions.map(({ shell, count }) => (
            <React.Fragment key={`shell-${shell.n}`}>
              {Array.from({ length: count }).map((_, idx) => (
                <OrbitingElectron
                  key={`e-${shell.n}-${idx}`}
                  shell={shell}
                  index={idx}
                  totalInShell={count}
                  speedMultiplier={orbitSpeed}
                  isPaused={isPaused}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onSelectParticle={setSelectedParticle}
                />
              ))}
            </React.Fragment>
          ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          autoRotate={autoRotate && !isPaused}
          autoRotateSpeed={0.5}
          maxDistance={30}
          minDistance={2}
        />
      </Canvas>

      {/* ════════════════════════════════════════════════════
          TOP TOOLBAR
         ════════════════════════════════════════════════════ */}
      <div className="absolute top-20 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10"
            style={{ background: 'rgba(17, 24, 39, 0.8)', color: '#F9FAFB' }}>
            <AtomIcon className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <div>
              <h1 className="text-sm font-bold leading-none">Interactive 3D Atom</h1>
              <p className="text-[10px] text-gray-400 mt-0.5">Z = {protons} | Protons: {protons} | Neutrons: {neutrons}</p>
            </div>
          </div>
        </div>

        {/* Quick Toolbar Controls */}
        <div className="flex items-center gap-2 pointer-events-auto bg-gray-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            title={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-xl transition-all ${autoRotate ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'hover:bg-white/10 text-gray-300'}`}
            title="Auto Rotate"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsNucleusZoomed(false);
              setOrbitSpeed(1.0);
              setSelectedParticle(null);
            }}
            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            title="Reset View"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={() => setLearningStep(learningStep !== null ? null : 0)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${learningStep !== null ? 'bg-orange-500 text-white' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30'}`}
          >
            <BookOpen className="w-4 h-4" />
            Learning Mode
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          LEFT CONTROLS PANEL
         ════════════════════════════════════════════════════ */}
      <div className="absolute left-6 top-36 z-20 w-72 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white shadow-2xl">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Sliders className="w-4 h-4" />
          Atomic Parameters
        </div>

        {/* Electron Count Slider */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-300">Electrons (Z)</span>
            <span className="text-cyan-400 font-mono">{electronCount}</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={electronCount}
            onChange={(e) => setElectronCount(parseInt(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>H (1)</span>
            <span>C (6)</span>
            <span>Ne (10)</span>
            <span>Ca (20)</span>
          </div>
        </div>

        {/* Orbit Speed Slider */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-gray-300">Orbit Speed</span>
            <span className="text-cyan-400 font-mono">{orbitSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={orbitSpeed}
            onChange={(e) => setOrbitSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Nucleus Zoom Toggle */}
        <button
          onClick={() => setIsNucleusZoomed(!isNucleusZoomed)}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${isNucleusZoomed ? 'bg-orange-500 text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200'}`}
        >
          <Layers className="w-4 h-4" />
          {isNucleusZoomed ? 'Assemble Atom' : 'Inspect Nucleus & Quarks'}
        </button>
      </div>

      {/* ════════════════════════════════════════════════════
          RIGHT INFO SIDEBAR
         ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedParticle && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute right-6 top-36 z-20 w-80 bg-gray-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-cyan-300">{selectedParticle.name}</h3>
              </div>
              <button
                onClick={() => setSelectedParticle(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-white/5">
                <span className="text-gray-400">Electric Charge:</span>
                <span className="font-mono text-cyan-300 font-semibold">{selectedParticle.charge}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-white/5">
                <span className="text-gray-400">Rest Mass:</span>
                <span className="font-mono text-gray-200">{selectedParticle.mass}</span>
              </div>
              {selectedParticle.quarks && (
                <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <span className="text-orange-400 font-bold block mb-1">Quark Composition:</span>
                  <span className="text-gray-300 leading-relaxed">{selectedParticle.quarks}</span>
                </div>
              )}
              {selectedParticle.quantumNumbers && (
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <span className="text-cyan-400 font-bold block mb-1">Quantum State:</span>
                  <span className="font-mono text-cyan-200">{selectedParticle.quantumNumbers}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════
          LEARNING MODE NARRATION CARD
         ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {learningStep !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-2xl border border-orange-500/40 rounded-2xl p-5 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                {learningSteps[learningStep].title}
              </span>
              <button
                onClick={() => setLearningStep(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed mb-4">
              {learningSteps[learningStep].text}
            </p>

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <button
                disabled={learningStep === 0}
                onClick={() => {
                  const prev = learningStep - 1;
                  setLearningStep(prev);
                  learningSteps[prev].action();
                }}
                className="flex items-center gap-1 text-xs font-semibold text-gray-300 disabled:opacity-30 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex gap-1.5">
                {learningSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === learningStep ? 'bg-orange-400' : 'bg-gray-700'}`}
                  />
                ))}
              </div>

              <button
                disabled={learningStep === learningSteps.length - 1}
                onClick={() => {
                  const next = learningStep + 1;
                  setLearningStep(next);
                  learningSteps[next].action();
                }}
                className="flex items-center gap-1 text-xs font-semibold text-orange-400 disabled:opacity-30 hover:text-orange-300"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
