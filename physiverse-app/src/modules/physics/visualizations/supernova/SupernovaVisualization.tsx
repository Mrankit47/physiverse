'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, Stars, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  Zap,
  Maximize,
  Minimize,
  BookOpen,
  Info,
  ChevronRight,
  ChevronLeft,
  X,
  Activity,
  Compass,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   STAGE DEFINITIONS & METADATA
   ═══════════════════════════════════════════════════════════════ */

interface SupernovaStage {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  progressRange: [number, number]; // [min, max] 0 to 1
  color: string;
}

const SUPERNOVA_STAGES: SupernovaStage[] = [
  {
    id: 'idle',
    name: '1. Massive Red Supergiant',
    subtitle: 'Nuclear Fusion Phase',
    description: 'A massive star (>8 solar masses) burns hydrogen, helium, carbon, and silicon in concentric shells, generating tremendous outward radiation pressure balancing gravity.',
    progressRange: [0.0, 0.15],
    color: '#FF4500',
  },
  {
    id: 'instability',
    name: '2. Iron Core Instability',
    subtitle: 'Fusion Quenching',
    description: 'Silicon fusion forms an Iron (Fe) core. Iron fusion is endothermic (absorbs energy). Outward radiation pressure drops to zero, and gravity wins.',
    progressRange: [0.15, 0.3],
    color: '#F59E0B',
  },
  {
    id: 'collapse',
    name: '3. Core Collapse',
    subtitle: 'Relativistic Infall',
    description: 'The iron core collapses in less than a second. Electrons and protons fuse into neutrons, creating a proto-neutron star of unfathomable density.',
    progressRange: [0.3, 0.42],
    color: '#EC4899',
  },
  {
    id: 'explosion',
    name: '4. Supernova Explosion Flash',
    subtitle: 'Core Rebound Shockwave',
    description: 'Infalling outer gas bounces off the ultra-dense neutron core. A titanic shockwave and neutrino outburst blast the star apart in a blinding flash.',
    progressRange: [0.42, 0.6],
    color: '#FFFFFF',
  },
  {
    id: 'shockwave',
    name: '5. Expanding Shockwave Ring',
    subtitle: 'Supernova Nucleosynthesis',
    description: 'The shockwave blasts heavy metals (gold, platinum, uranium) into space at 30,000 km/s (10% light speed), forming an expanding ring.',
    progressRange: [0.6, 0.75],
    color: '#06B6D4',
  },
  {
    id: 'nebula',
    name: '6. Supernova Remnant Nebula',
    subtitle: 'Interstellar Cloud Formation',
    description: 'Ejected gas and dust cool into a glowing nebula spanning light-years, enriching future star systems and planets with heavy elements.',
    progressRange: [0.75, 0.9],
    color: '#8B5CF6',
  },
  {
    id: 'remnant',
    name: '7. Pulsar / Neutron Star',
    subtitle: 'Stellar Remnant',
    description: 'At the heart of the nebula remains a rapidly spinning Neutron Star (Pulsar), emitting intense magnetic particle beams from its poles.',
    progressRange: [0.9, 1.0],
    color: '#3B82F6',
  },
];

/* ═══════════════════════════════════════════════════════════════
   3D SUB-COMPONENTS (GPU PARTICLES & SHOCKWAVE)
   ═══════════════════════════════════════════════════════════════ */

// 1. GPU Particle System for Supernova Debris
function SupernovaParticles({ timelineProgress }: { timelineProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3000;

  // Generate random velocity vectors and colors for 3000 debris particles
  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#FF4500'),
      new THREE.Color('#FFD700'),
      new THREE.Color('#00E5FF'),
      new THREE.Color('#A855F7'),
      new THREE.Color('#FF007F'),
    ];

    for (let i = 0; i < count; i++) {
      // Start inside star core
      pos[i * 3] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // Random spherical expansion direction
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 8.0 + Math.random() * 12.0;

      vel[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      vel[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      vel[i * 3 + 2] = speed * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, vel, col];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;

    // Expand particles based on timelineProgress (0 to 1)
    // Explosion starts around timelineProgress = 0.42
    const explosionFactor = Math.max(0, (timelineProgress - 0.4) / 0.6);

    for (let i = 0; i < count; i++) {
      const vx = velocities[i * 3];
      const vy = velocities[i * 3 + 1];
      const vz = velocities[i * 3 + 2];

      const currentDist = explosionFactor * 1.5;

      posAttr.setXYZ(
        i,
        vx * currentDist + Math.sin(i + explosionFactor * 5) * 0.2,
        vy * currentDist + Math.cos(i + explosionFactor * 5) * 0.2,
        vz * currentDist
      );
    }
    posAttr.needsUpdate = true;
  });

  if (timelineProgress < 0.4) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        vertexColors
        transparent
        opacity={Math.min(1, Math.max(0, (1 - timelineProgress) * 1.5))}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 2. Shockwave Expanding Ring & Pulsar Beams
function ShockwaveAndPulsar({ timelineProgress }: { timelineProgress: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const pulsarBeamRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
    if (pulsarBeamRef.current) {
      pulsarBeamRef.current.rotation.z = clock.getElapsedTime() * 12; // Fast pulsar spin
    }
  });

  // Shockwave expansion radius
  const shockwaveRadius = Math.max(0.1, (timelineProgress - 0.42) * 18);
  const isPulsarStage = timelineProgress >= 0.88;

  return (
    <group>
      {/* Expanding Shockwave Ring */}
      {timelineProgress >= 0.42 && (
        <mesh ref={ringRef} scale={[shockwaveRadius, shockwaveRadius, shockwaveRadius]}>
          <ringGeometry args={[0.9, 1.0, 64]} />
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={Math.max(0, 1 - (timelineProgress - 0.42) * 2)}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Pulsar / Neutron Star Remnant at Center */}
      {isPulsarStage && (
        <group>
          <Sphere args={[0.35, 32, 32]}>
            <meshStandardMaterial color="#FFFFFF" emissive="#00FFFF" emissiveIntensity={3} />
          </Sphere>
          {/* Polar Magnetic Jet Beams */}
          <group ref={pulsarBeamRef}>
            <mesh position={[0, 4, 0]}>
              <cylinderGeometry args={[0.08, 0.4, 8, 16]} />
              <meshBasicMaterial color="#00FFFF" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh position={[0, -4, 0]}>
              <cylinderGeometry args={[0.4, 0.08, 8, 16]} />
              <meshBasicMaterial color="#00FFFF" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}

// 3. Central Star Body & Gas Nebula Core
function StarCore({ timelineProgress }: { timelineProgress: number }) {
  const starRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (starRef.current) {
      starRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  // Scale & Color as a function of timeline stage
  // Stage 1 (0-0.3): Red Supergiant (Radius ~ 3)
  // Stage 2 (0.3-0.42): Collapsing Core (Radius 3 -> 0.4)
  // Stage 3 (0.42-0.5): Flash (White/Gold glow)
  // Stage 4+ (>0.5): Expanding Nebula Cloud
  let radius = 2.8;
  let starColor = '#FF4500';
  let emissiveIntensity = 1.0;

  if (timelineProgress < 0.3) {
    radius = 2.8 + Math.sin(timelineProgress * 20) * 0.1; // Pulsing surface
  } else if (timelineProgress < 0.42) {
    // Gravitational Collapse
    const collapseT = (timelineProgress - 0.3) / 0.12;
    radius = THREE.MathUtils.lerp(2.8, 0.3, collapseT);
    starColor = '#3B82F6'; // Blue collapse
    emissiveIntensity = 2.0;
  } else if (timelineProgress < 0.6) {
    // Explosion Flash
    const flashT = (timelineProgress - 0.42) / 0.18;
    radius = THREE.MathUtils.lerp(0.3, 6.0, flashT);
    starColor = '#FFFFFF';
    emissiveIntensity = 3.0;
  } else {
    // Expanding Nebula Cloud
    radius = 6.0 + (timelineProgress - 0.6) * 12.0;
    starColor = '#8B5CF6';
    emissiveIntensity = 0.5;
  }

  return (
    <group>
      <mesh ref={starRef}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={starColor}
          emissive={starColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          wireframe={timelineProgress > 0.6} // Wireframe mesh for expanding gas cloud
        />
      </mesh>

      {/* Plasma Corona Glow */}
      {timelineProgress < 0.6 && (
        <Sphere args={[radius * 1.3, 32, 32]}>
          <meshBasicMaterial
            color={starColor}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      )}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SUPERNOVA PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function SupernovaVisualization() {
  const [progress, setProgress] = useState<number>(0.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [learningStep, setLearningStep] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-advance timeline if playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1.0) return 0.0; // Loop back
        return prev + 0.003;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Current active stage
  const currentStage = useMemo(() => {
    return SUPERNOVA_STAGES.find(
      (s) => progress >= s.progressRange[0] && progress <= s.progressRange[1]
    ) || SUPERNOVA_STAGES[0];
  }, [progress]);

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ background: '#02040A' }}
    >
      {/* 3D R3F Canvas */}
      <Canvas camera={{ position: [0, 8, 20], fov: 50 }}>
        <color attach="background" args={['#02040A']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={2.0} color={currentStage.color} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <StarCore timelineProgress={progress} />
        <SupernovaParticles timelineProgress={progress} />
        <ShockwaveAndPulsar timelineProgress={progress} />

        <OrbitControls enableDamping dampingFactor={0.05} autoRotate={autoRotate} autoRotateSpeed={0.4} />
      </Canvas>

      {/* TOP TOOLBAR */}
      <div className="absolute top-20 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/80 backdrop-blur-md border border-white/10 text-white">
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <div>
              <h1 className="text-sm font-bold">Procedural Astrophysics Supernova</h1>
              <p className="text-[10px] text-gray-400">Type II Core-Collapse & Supernova Remnant</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pointer-events-auto bg-gray-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 fill-current text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              setProgress(0);
              setIsPlaying(true);
            }}
            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            title="Restart Explosion"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setLearningStep(learningStep !== null ? null : 0)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${learningStep !== null ? 'bg-orange-500 text-white' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'}`}
          >
            <BookOpen className="w-4 h-4" />
            Learning Mode
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* STAGE INFO OVERLAY PANEL */}
      <div className="absolute left-6 top-36 z-20 w-80 bg-gray-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-white shadow-2xl">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: currentStage.color }}>
          <Activity className="w-4 h-4" />
          {currentStage.subtitle}
        </div>
        <h2 className="text-base font-bold text-white mb-2">{currentStage.name}</h2>
        <p className="text-xs text-gray-300 leading-relaxed mb-4">{currentStage.description}</p>

        {/* Stage quick jumps */}
        <div className="space-y-1.5 border-t border-white/10 pt-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Jump to Stage:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {SUPERNOVA_STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setProgress(s.progressRange[0] + 0.02);
                  setIsPlaying(false);
                }}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold text-left truncate transition-all ${s.id === currentStage.id ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SCRUBBABLE ANIMATION TIMELINE */}
      <div className="absolute bottom-8 left-6 right-6 z-20 max-w-4xl mx-auto bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Supernova Timeline</span>
            <span className="text-xs font-mono text-gray-400">({Math.round(progress * 100)}%)</span>
          </div>
          <span className="text-xs font-semibold" style={{ color: currentStage.color }}>
            {currentStage.name}
          </span>
        </div>

        {/* Timeline Slider */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(e) => {
            setProgress(parseFloat(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />

        {/* Stage Markers on Timeline */}
        <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono">
          <span>1. Supergiant</span>
          <span>2. Iron Core</span>
          <span>3. Collapse</span>
          <span>4. Flash</span>
          <span>5. Ring</span>
          <span>6. Nebula</span>
          <span>7. Pulsar</span>
        </div>
      </div>

      {/* LEARNING MODE OVERLAY */}
      <AnimatePresence>
        {learningStep !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl bg-gray-900/95 backdrop-blur-2xl border border-orange-500/40 rounded-2xl p-5 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                {SUPERNOVA_STAGES[learningStep].name}
              </span>
              <button onClick={() => setLearningStep(null)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed mb-4">{SUPERNOVA_STAGES[learningStep].description}</p>
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <button
                disabled={learningStep === 0}
                onClick={() => {
                  const prev = learningStep - 1;
                  setLearningStep(prev);
                  setProgress(SUPERNOVA_STAGES[prev].progressRange[0] + 0.02);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-gray-300 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                disabled={learningStep === SUPERNOVA_STAGES.length - 1}
                onClick={() => {
                  const next = learningStep + 1;
                  setLearningStep(next);
                  setProgress(SUPERNOVA_STAGES[next].progressRange[0] + 0.02);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-orange-400 disabled:opacity-30"
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
