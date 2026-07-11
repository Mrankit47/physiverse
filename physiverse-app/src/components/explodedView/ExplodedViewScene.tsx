'use client';

import { Suspense, useEffect, useCallback, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls, Html } from '@react-three/drei';
import { useExplodedViewStore } from '@/stores/explodedViewStore';
import { useCameraAnimation } from '@/hooks/useCameraAnimation';
import type { Vec3, ExplodableObjectData } from '@/data/explodedView/componentRegistry';
import { buildComponentPositionMap } from './ExplodableObject';

/* ── Internal: Camera Controller ── */
function CameraController({
  objectData,
}: {
  objectData: ExplodableObjectData;
}) {
  const componentPositions = buildComponentPositionMap(objectData.components);

  useCameraAnimation(
    objectData.cameraPosition,
    objectData.explodedCameraPosition,
    componentPositions
  );

  return null;
}

/* ── Internal: Dynamic Lighting ── */
function ExplodedLighting({ boost }: { boost: number }) {
  const isExploded = useExplodedViewStore((s) => s.isExploded);
  const intensity = isExploded ? 0.5 + boost : 0.4;

  return (
    <>
      <ambientLight intensity={intensity} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={isExploded ? 1.2 : 0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
        color="#60A5FA"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={isExploded ? 1.5 : 0.5}
        color="#FF7A00"
        distance={20}
      />
    </>
  );
}

/* ── Internal: Keyboard & gesture handler ── */
function InputHandler() {
  const toggleExplode = useExplodedViewStore((s) => s.toggleExplode);
  const learningMode = useExplodedViewStore((s) => s.learningMode);
  const nextStep = useExplodedViewStore((s) => s.nextStep);
  const prevStep = useExplodedViewStore((s) => s.prevStep);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        toggleExplode();
      }
      if (learningMode) {
        if (e.code === 'ArrowRight') nextStep();
        if (e.code === 'ArrowLeft') prevStep();
      }
    },
    [toggleExplode, learningMode, nextStep, prevStep]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return null;
}

/* ── Loading spinner inside Canvas ── */
function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
        />
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Loading model…
        </span>
      </div>
    </Html>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN: ExplodedViewScene
   ═══════════════════════════════════════════════════════════════ */

interface ExplodedViewSceneProps {
  objectData: ExplodableObjectData;
  children: ReactNode; // the <ExplodableObject> with geometry
}

export default function ExplodedViewScene({
  objectData,
  children,
}: ExplodedViewSceneProps) {
  /* ── Detect reduced motion preference ── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      useExplodedViewStore.getState().setReducedMotion(true);
    }
    const handler = (e: MediaQueryListEvent) => {
      useExplodedViewStore.getState().setReducedMotion(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ── Reset store on mount ── */
  useEffect(() => {
    useExplodedViewStore.getState().reset();
  }, [objectData.id]);

  return (
    <div
      className="w-full h-full relative"
      style={{ minHeight: '100%' }}
    >
      <Canvas
        camera={{
          position: objectData.cameraPosition,
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        shadows
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
        onDoubleClick={() => {
          useExplodedViewStore.getState().toggleExplode();
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          {/* Lighting */}
          <ExplodedLighting boost={objectData.lightIntensityBoost} />

          {/* Starfield background */}
          <Stars
            radius={40}
            depth={60}
            count={2000}
            factor={3}
            saturation={0.3}
            fade
            speed={0.3}
          />

          {/* Camera Animation Controller */}
          <CameraController objectData={objectData} />

          {/* Keyboard / Gesture Handler */}
          <InputHandler />

          {/* The explodable 3D object */}
          {children}

          {/* Orbit controls — auto-rotate when assembled */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={!useExplodedViewStore.getState().isExploded}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={Math.PI * 0.15}
            minDistance={3}
            maxDistance={25}
            dampingFactor={0.05}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
