'use client';

import { useRef, ReactNode } from 'react';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { useExplodeAnimation } from '@/hooks/useExplodeAnimation';
import { useComponentInteraction } from '@/hooks/useComponentInteraction';
import type { ComponentData } from '@/data/explodedView/componentRegistry';

interface ComponentMeshProps {
  data: ComponentData;
  staggerIndex: number;
  totalComponents: number;
  children: ReactNode; // the actual Three.js geometry
}

/**
 * An individually interactive component within an exploded-view assembly.
 * Handles hover highlighting, spring animation, and pointer events.
 */
export default function ComponentMesh({
  data,
  staggerIndex,
  totalComponents,
  children,
}: ComponentMeshProps) {
  const groupRef = useRef<THREE.Group>(null!);

  /* ── Animation ── */
  const {
    animatedPosition,
    animatedScale,
    animatedOpacity,
    isFocused,
    rotation,
  } = useExplodeAnimation({
    assembledPosition: data.assembledPosition,
    explodedOffset: data.explodedOffset,
    assembledRotation: data.assembledRotation,
    staggerIndex,
    totalComponents,
    componentId: data.id,
  });

  /* ── Interaction ── */
  const { onPointerOver, onPointerOut, onPointerDown } =
    useComponentInteraction(data.id);

  return (
    <animated.group
      ref={groupRef}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      position={animatedPosition as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scale={animatedScale as any}
      rotation={rotation as unknown as THREE.Euler}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
    >
      {/* The actual geometry is passed as children */}
      <group>
        {children}
      </group>

      {/* Hover glow ring */}
      {isFocused && (
        <mesh>
          <ringGeometry args={[1.2, 1.35, 64]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Component label (only when focused and exploded) */}
      {isFocused && (
        <sprite
          position={[0, 1.5, 0]}
          scale={[2, 0.5, 1]}
        >
          <spriteMaterial
            transparent
            opacity={animatedOpacity as unknown as number}
          />
        </sprite>
      )}
    </animated.group>
  );
}
