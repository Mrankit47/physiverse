'use client';

import { useMemo } from 'react';
import { useSpring, type SpringConfig } from '@react-spring/three';
import { useExplodedViewStore } from '@/stores/explodedViewStore';
import type { Vec3 } from '@/data/explodedView/componentRegistry';

/* ── Spring config for a premium CAD-like feel ── */
const EXPLODE_SPRING: SpringConfig = {
  mass: 1.2,
  tension: 100,
  friction: 18,
  clamp: false,
};

const REDUCED_MOTION_SPRING: SpringConfig = {
  duration: 50, // near-instant
};

interface UseExplodeAnimationOptions {
  assembledPosition: Vec3;
  explodedOffset: Vec3;
  assembledRotation: Vec3;
  staggerIndex: number;
  totalComponents: number;
  componentId: string;
}

/**
 * Computes an animated { position, scale, opacity } spring
 * for a single explodable component.
 */
export function useExplodeAnimation({
  assembledPosition,
  explodedOffset,
  assembledRotation,
  staggerIndex,
  totalComponents,
  componentId,
}: UseExplodeAnimationOptions) {
  const isExploded = useExplodedViewStore((s) => s.isExploded);
  const hoveredComponent = useExplodedViewStore((s) => s.hoveredComponent);
  const activeComponent = useExplodedViewStore((s) => s.activeComponent);
  const reducedMotion = useExplodedViewStore((s) => s.reducedMotion);

  /* ── Target position ── */
  const explodedPosition: Vec3 = useMemo(
    () => [
      assembledPosition[0] + explodedOffset[0],
      assembledPosition[1] + explodedOffset[1],
      assembledPosition[2] + explodedOffset[2],
    ],
    [assembledPosition, explodedOffset]
  );

  /* ── Determine if this component is "dimmed" ── */
  const isFocused = componentId === hoveredComponent || componentId === activeComponent;
  const somethingFocused = hoveredComponent !== null || activeComponent !== null;
  const isDimmed = isExploded && somethingFocused && !isFocused;

  /* ── Stagger delay (0–600ms) ── */
  const delayMs = (staggerIndex / Math.max(totalComponents, 1)) * 600;

  /* ── Spring ── */
  const springConfig = reducedMotion ? REDUCED_MOTION_SPRING : EXPLODE_SPRING;

  const springs = useSpring({
    position: isExploded ? explodedPosition : assembledPosition,
    scale: isFocused ? [1.08, 1.08, 1.08] as Vec3 : [1, 1, 1] as Vec3,
    opacity: isDimmed ? 0.25 : 1,
    config: springConfig,
    delay: isExploded ? delayMs : (totalComponents - staggerIndex) / totalComponents * 400,
  });

  return {
    animatedPosition: springs.position,
    animatedScale: springs.scale,
    animatedOpacity: springs.opacity,
    isFocused,
    isDimmed,
    rotation: assembledRotation,
  };
}
