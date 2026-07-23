'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — ModelViewer Component
   Universal 3D model viewer with loading states, error boundary,
   and built-in camera controls. Wraps R3F Canvas.
   ═══════════════════════════════════════════════════════════════ */

import { Suspense, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import type { CameraConfig } from '@/types';
import { DEFAULT_CAMERA_CONFIG } from '@/engine/core/CameraSystem';
import { getOptimalPixelRatio, detectDeviceCapabilities } from '@/engine/core/PerformanceOptimizer';

interface ModelViewerProps {
  children: React.ReactNode;
  camera?: Partial<CameraConfig>;
  className?: string;
  style?: React.CSSProperties;
  /** Show orbit controls */
  controls?: boolean;
  /** Show environment lighting */
  environment?: boolean;
  /** Show contact shadows */
  shadows?: boolean;
  /** Background color */
  background?: string;
  /** Callback when scene is ready */
  onReady?: () => void;
}

function LoadingFallback() {
  return (
    <Html center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <Loader2
          className="animate-spin"
          style={{ width: 32, height: 32, color: 'var(--color-primary)' }}
        />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Loading 3D Scene...</span>
      </div>
    </Html>
  );
}

export default function ModelViewer({
  children,
  camera: cameraOverrides,
  className = '',
  style,
  controls = true,
  environment = true,
  shadows = true,
  background,
  onReady,
}: ModelViewerProps) {
  const [isReady, setIsReady] = useState(false);

  const cam = { ...DEFAULT_CAMERA_CONFIG, ...cameraOverrides };
  const tier = detectDeviceCapabilities();
  const dpr = getOptimalPixelRatio(tier);

  const handleCreated = useCallback(() => {
    setIsReady(true);
    onReady?.();
  }, [onReady]);

  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{ minHeight: 400, ...style }}
      role="img"
      aria-label="3D visualization viewer"
    >
      {!isReady && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ background: background || 'var(--bg-elevated)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
            <Loader2
              className="animate-spin"
              style={{ width: 24, height: 24, color: 'var(--color-primary)' }}
            />
            <span style={{ fontSize: '0.875rem' }}>Initializing...</span>
          </div>
        </div>
      )}

      <Canvas
        dpr={[1, dpr]}
        camera={{
          position: cam.position,
          fov: cam.fov,
          near: cam.near,
          far: cam.far,
        }}
        onCreated={handleCreated}
        style={{ background: background || 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />

          {/* Environment */}
          {environment && <Environment preset="studio" />}

          {/* Contact Shadows */}
          {shadows && (
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
              far={4}
            />
          )}

          {/* User content */}
          {children}

          {/* Controls */}
          {controls && (
            <OrbitControls
              enableDamping={cam.enableDamping}
              dampingFactor={cam.dampingFactor}
              minDistance={cam.minDistance}
              maxDistance={cam.maxDistance}
              minPolarAngle={cam.minPolarAngle}
              maxPolarAngle={cam.maxPolarAngle}
              autoRotate={cam.autoRotate}
              autoRotateSpeed={cam.autoRotateSpeed}
              enablePan={cam.enablePan}
              enableZoom={cam.enableZoom}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
