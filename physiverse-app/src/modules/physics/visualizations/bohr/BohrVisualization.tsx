'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Sliders,
  ChevronRight,
  ChevronLeft,
  X,
  Atom as AtomIcon,
  Sparkles,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   TYPES & ELEMENT DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */

interface ElementData {
  name: string;
  symbol: string;
  z: number;
  shells: number[]; // e.g. [2, 8, 4]
  color: string;
}

const ELEMENTS: Record<string, ElementData> = {
  Hydrogen: { name: 'Hydrogen', symbol: 'H', z: 1, shells: [1], color: '#3B82F6' },
  Helium: { name: 'Helium', symbol: 'He', z: 2, shells: [2], color: '#10B981' },
  Lithium: { name: 'Lithium', symbol: 'Li', z: 3, shells: [2, 1], color: '#F59E0B' },
  Carbon: { name: 'Carbon', symbol: 'C', z: 6, shells: [2, 4], color: '#EC4899' },
  Neon: { name: 'Neon', symbol: 'Ne', z: 10, shells: [2, 8], color: '#8B5CF6' },
};

// Bohr shell radii: r_n = n^2 * a_0 (scaled for 3D view)
const SHELL_RADII: Record<number, number> = {
  1: 2.2,
  2: 4.2,
  3: 6.5,
  4: 9.0,
  5: 11.8,
};

// Energy in eV: E_n = -13.6 * Z^2 / n^2
function getEnergy(n: number, z: number): number {
  return -13.6 * (z * z) / (n * n);
}

// Map photon wavelength to RGB color
function wavelengthToColor(wavelengthNm: number): string {
  if (wavelengthNm < 380) return '#A855F7'; // UV / Violet
  if (wavelengthNm < 450) return '#4F46E5'; // Violet/Indigo
  if (wavelengthNm < 495) return '#06B6D4'; // Blue/Cyan
  if (wavelengthNm < 570) return '#10B981'; // Green
  if (wavelengthNm < 590) return '#F59E0B'; // Yellow
  if (wavelengthNm < 620) return '#F97316'; // Orange
  if (wavelengthNm < 750) return '#EF4444'; // Red
  return '#991B1B'; // Infrared
}

/* ═══════════════════════════════════════════════════════════════
   3D COMPONENT: EMITTED/ABSORBED PHOTON WAVE PACKET
   ═══════════════════════════════════════════════════════════════ */

function PhotonWave({
  startPos,
  endPos,
  color,
  onComplete,
}: {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  color: string;
  onComplete: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    progressRef.current += delta * 1.5;
    if (progressRef.current >= 1) {
      onComplete();
      return;
    }

    if (meshRef.current) {
      meshRef.current.position.lerpVectors(startPos, endPos, progressRef.current);
    }
  });

  return (
    <group ref={meshRef} position={[startPos.x, startPos.y, startPos.z]}>
      <Sphere args={[0.22, 16, 16]}>
        <meshBasicMaterial color={color} />
      </Sphere>
      <Sphere args={[0.45, 16, 16]}>
        <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </Sphere>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3D COMPONENT: BOHR ATOM SCENE
   ═══════════════════════════════════════════════════════════════ */

function BohrScene({
  elementKey,
  excitedState,
  photonEvent,
  onPhotonComplete,
  isPaused,
}: {
  elementKey: string;
  excitedState: { shell: number; index: number; targetShell: number } | null;
  photonEvent: { type: 'absorb' | 'emit'; fromShell: number; toShell: number; color: string } | null;
  onPhotonComplete: () => void;
  isPaused: boolean;
}) {
  const element = ELEMENTS[elementKey];

  // Concentric shell ring points
  const shellRings = useMemo(() => {
    return [1, 2, 3, 4, 5].map((n) => {
      const radius = SHELL_RADII[n];
      const points: THREE.Vector3[] = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      return { n, radius, points };
    });
  }, []);

  // Compute electron positions in 2D/3D orbital planes
  const electronData = useMemo(() => {
    const list: Array<{
      id: string;
      shellN: number;
      index: number;
      totalInShell: number;
      baseRadius: number;
    }> = [];

    let eIdx = 0;
    element.shells.forEach((count, sIdx) => {
      const n = sIdx + 1;
      const radius = SHELL_RADII[n];
      for (let i = 0; i < count; i++) {
        list.push({
          id: `e-${eIdx++}`,
          shellN: n,
          index: i,
          totalInShell: count,
          baseRadius: radius,
        });
      }
    });
    return list;
  }, [element]);

  return (
    <group>
      {/* 1. Nucleus */}
      <group>
        <Sphere args={[0.9, 32, 32]}>
          <meshStandardMaterial
            color={element.color}
            emissive={element.color}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        <Sphere args={[1.5, 32, 32]}>
          <meshBasicMaterial color={element.color} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </Sphere>
        <Html center distanceFactor={12}>
          <div className="px-2 py-0.5 rounded text-[11px] font-black bg-black/80 text-white border border-white/20 whitespace-nowrap">
            {element.symbol} (Z={element.z})
          </div>
        </Html>
      </group>

      {/* 2. Concentric Energy Shell Rings (n=1 to 5) */}
      {shellRings.map(({ n, radius, points }) => {
        const hasElectrons = element.shells[n - 1] > 0;
        const isExcitedTarget = excitedState?.targetShell === n;

        return (
          <group key={`shell-ring-${n}`}>
            <Line
              points={points}
              color={isExcitedTarget ? '#F59E0B' : hasElectrons ? '#00E5FF' : '#4B5563'}
              opacity={isExcitedTarget ? 0.9 : hasElectrons ? 0.4 : 0.15}
              transparent
              lineWidth={isExcitedTarget ? 2.5 : 1}
            />
            {/* Shell Label */}
            <Html position={[radius + 0.3, 0, 0]} distanceFactor={12}>
              <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isExcitedTarget ? 'bg-amber-500 text-black' : 'bg-gray-900/80 text-gray-300 border border-white/10'}`}>
                n={n} ({getEnergy(n, element.z).toFixed(1)} eV)
              </div>
            </Html>
          </group>
        );
      })}

      {/* 3. Electrons orbiting */}
      {electronData.map((eData) => {
        const isExcited = excitedState?.shell === eData.shellN && excitedState?.index === eData.index;
        const currentN = isExcited ? excitedState.targetShell : eData.shellN;
        const currentRadius = SHELL_RADII[currentN];

        return (
          <BohrElectron
            key={eData.id}
            radius={currentRadius}
            index={eData.index}
            totalInShell={eData.totalInShell}
            isExcited={isExcited}
            isPaused={isPaused}
          />
        );
      })}

      {/* 4. Photons (Absorbed or Emitted) */}
      {photonEvent && (
        <PhotonWave
          startPos={
            photonEvent.type === 'absorb'
              ? new THREE.Vector3(15, 0, 0)
              : new THREE.Vector3(SHELL_RADII[photonEvent.fromShell], 0, 0)
          }
          endPos={
            photonEvent.type === 'absorb'
              ? new THREE.Vector3(SHELL_RADII[photonEvent.toShell], 0, 0)
              : new THREE.Vector3(15, 0, 0)
          }
          color={photonEvent.color}
          onComplete={onPhotonComplete}
        />
      )}
    </group>
  );
}

// Single Orbiting Bohr Electron Component
function BohrElectron({
  radius,
  index,
  totalInShell,
  isExcited,
  isPaused,
}: {
  radius: number;
  index: number;
  totalInShell: number;
  isExcited: boolean;
  isPaused: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const phase = (index / totalInShell) * Math.PI * 2;

  useFrame(({ clock }) => {
    if (isPaused) return;
    const speed = 3.0 / Math.sqrt(radius);
    const t = clock.getElapsedTime() * speed + phase;

    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(t) * radius;
      meshRef.current.position.z = Math.sin(t) * radius;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[isExcited ? 0.28 : 0.18, 24, 24]} />
      <meshStandardMaterial
        color={isExcited ? '#F59E0B' : '#00E5FF'}
        emissive={isExcited ? '#F59E0B' : '#00E5FF'}
        emissiveIntensity={isExcited ? 1.8 : 0.8}
        roughness={0.1}
      />
      <Sphere args={[isExcited ? 0.5 : 0.3, 16, 16]}>
        <meshBasicMaterial
          color={isExcited ? '#F59E0B' : '#00E5FF'}
          transparent
          opacity={isExcited ? 0.6 : 0.2}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN BOHR MODEL PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function BohrVisualization() {
  const [selectedElement, setSelectedElement] = useState<string>('Hydrogen');
  const [excitedState, setExcitedState] = useState<{ shell: number; index: number; targetShell: number } | null>(null);
  const [photonEvent, setPhotonEvent] = useState<{ type: 'absorb' | 'emit'; fromShell: number; toShell: number; color: string } | null>(null);
  const isPaused = false;
  const [learningStep, setLearningStep] = useState<number | null>(null);

  const element = ELEMENTS[selectedElement];

  // Excite Electron Action (n_1 -> n_2)
  const exciteElectron = () => {
    if (excitedState) return;
    const fromShell = 1;
    const toShell = 2;
    const eInitial = getEnergy(fromShell, element.z);
    const eFinal = getEnergy(toShell, element.z);
    const deltaE = eFinal - eInitial; // eV

    // Convert eV to wavelength nm: lambda = 1240 / deltaE
    const wavelengthNm = 1240 / deltaE;
    const photonColor = wavelengthToColor(wavelengthNm);

    // Trigger incoming photon animation
    setPhotonEvent({ type: 'absorb', fromShell, toShell, color: photonColor });

    setTimeout(() => {
      setExcitedState({ shell: fromShell, index: 0, targetShell: toShell });
    }, 600);
  };

  // Release Energy / Spontaneous Emission Action (n_2 -> n_1)
  const releaseEnergy = () => {
    if (!excitedState) return;
    const fromShell = excitedState.targetShell;
    const toShell = excitedState.shell;
    const eInitial = getEnergy(fromShell, element.z);
    const eFinal = getEnergy(toShell, element.z);
    const deltaE = Math.abs(eFinal - eInitial); // eV

    const wavelengthNm = 1240 / deltaE;
    const photonColor = wavelengthToColor(wavelengthNm);

    setExcitedState(null);
    setPhotonEvent({ type: 'emit', fromShell, toShell, color: photonColor });
  };

  // Learning steps
  const learningSteps = [
    {
      title: '1. Quantized Energy Shells',
      text: 'Niels Bohr postulated that electrons move in circular orbits around the nucleus at fixed, quantized energy levels (n=1, 2, 3...). Electrons cannot exist between shells.',
    },
    {
      title: '2. Photon Absorption (Excitation)',
      text: 'When an atom absorbs a photon with energy matching the energy gap (ΔE = E₂ - E₁), an electron jumps to a higher shell into an excited state.',
    },
    {
      title: '3. Photon Emission (De-excitation)',
      text: 'An excited electron spontaneously drops back down to a lower shell, emitting a photon of precise frequency ν = ΔE / h and visible color spectrum.',
    },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden select-none" style={{ background: '#05070F' }}>
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 12, 14], fov: 45 }}>
        <color attach="background" args={['#05070F']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 15, 10]} intensity={1.2} />

        <BohrScene
          elementKey={selectedElement}
          excitedState={excitedState}
          photonEvent={photonEvent}
          onPhotonComplete={() => setPhotonEvent(null)}
          isPaused={isPaused}
        />

        <OrbitControls enableDamping dampingFactor={0.05} maxDistance={30} minDistance={3} />
      </Canvas>

      {/* TOP TOOLBAR */}
      <div className="absolute top-20 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/80 backdrop-blur-md border border-white/10 text-white">
            <AtomIcon className="w-5 h-5 text-amber-400" />
            <div>
              <h1 className="text-sm font-bold">Scientifically Accurate Bohr Model</h1>
              <p className="text-[10px] text-gray-400">Quantized Atomic Energy Levels & Quantum Jumps</p>
            </div>
          </div>
        </div>

        {/* Element Selection Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-gray-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
          {Object.keys(ELEMENTS).map((elKey) => {
            const el = ELEMENTS[elKey];
            const isSelected = selectedElement === elKey;
            return (
              <button
                key={elKey}
                onClick={() => {
                  setSelectedElement(elKey);
                  setExcitedState(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isSelected ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-300 hover:bg-white/10'}`}
              >
                {el.name} ({el.symbol})
              </button>
            );
          })}
        </div>
      </div>

      {/* LEFT CONTROLS: EXCITATION & TRANSITIONS */}
      <div className="absolute left-6 top-36 z-20 w-80 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-white shadow-2xl">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-amber-400">
          <Zap className="w-4 h-4" />
          Quantum Transitions & Photons
        </div>

        <div className="space-y-3 mb-5">
          <button
            onClick={exciteElectron}
            disabled={!!excitedState}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg disabled:opacity-40 transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            Excite Electron (Absorb Energy)
          </button>

          <button
            onClick={releaseEnergy}
            disabled={!excitedState}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black shadow-lg disabled:opacity-40 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            Release Energy (Emit Photon)
          </button>
        </div>

        {/* Status Readout */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Electron State:</span>
            <span className={`font-bold ${excitedState ? 'text-amber-400' : 'text-emerald-400'}`}>
              {excitedState ? 'Excited (n=2)' : 'Ground State (n=1)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Ground Energy E₁:</span>
            <span className="font-mono text-cyan-300">{getEnergy(1, element.z).toFixed(1)} eV</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Shell n=2 Energy E₂:</span>
            <span className="font-mono text-cyan-300">{getEnergy(2, element.z).toFixed(1)} eV</span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-2">
            <span className="text-gray-400">Transition ΔE:</span>
            <span className="font-mono text-amber-400 font-bold">
              {Math.abs(getEnergy(2, element.z) - getEnergy(1, element.z)).toFixed(2)} eV
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: BOHR ENERGY LEVEL DIAGRAM */}
      <div className="absolute right-6 top-36 z-20 w-80 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-white shadow-2xl">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Sliders className="w-4 h-4" />
          Quantized Energy Levels (eV)
        </div>

        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((n) => {
            const energy = getEnergy(n, element.z);
            const isExcitedLevel = excitedState?.targetShell === n;
            const isGroundLevel = !excitedState && n === 1;

            return (
              <div
                key={`lvl-${n}`}
                className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition-all ${isExcitedLevel ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300' : isGroundLevel ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' : 'bg-white/5 text-gray-400'}`}
              >
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                    n={n}
                  </span>
                  <span>{n === 1 ? 'Ground State' : `Excited Shell ${n}`}</span>
                </div>
                <span className="font-mono font-bold">{energy.toFixed(1)} eV</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEARNING MODE OVERLAY */}
      <AnimatePresence>
        {learningStep !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl bg-gray-900/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-5 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {learningSteps[learningStep].title}
              </span>
              <button onClick={() => setLearningStep(null)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed mb-4">{learningSteps[learningStep].text}</p>
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <button
                disabled={learningStep === 0}
                onClick={() => setLearningStep(learningStep - 1)}
                className="flex items-center gap-1 text-xs font-semibold text-gray-300 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                disabled={learningStep === learningSteps.length - 1}
                onClick={() => setLearningStep(learningStep + 1)}
                className="flex items-center gap-1 text-xs font-semibold text-amber-400 disabled:opacity-30"
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
