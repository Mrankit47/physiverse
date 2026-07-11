'use client';

import { useCallback, useRef, useState } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { useExplodedViewStore } from '@/stores/explodedViewStore';

/**
 * Manages hover/click interaction for a single component mesh.
 * Returns pointer event handlers + screen-space position for info panel.
 */
export function useComponentInteraction(componentId: string) {
  const setHovered = useExplodedViewStore((s) => s.setHoveredComponent);
  const setActive = useExplodedViewStore((s) => s.setActiveComponent);
  const isExploded = useExplodedViewStore((s) => s.isExploded);
  const activeComponent = useExplodedViewStore((s) => s.activeComponent);
  const learningMode = useExplodedViewStore((s) => s.learningMode);

  /* ── Screen-space position for info panel ── */
  const [screenPos, setScreenPos] = useState<{ x: number; y: number } | null>(null);
  const lastClickTime = useRef(0);

  /* ── Pointer handlers ── */
  const onPointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isExploded || learningMode) return;
      e.stopPropagation();
      setHovered(componentId);
      document.body.style.cursor = 'pointer';
    },
    [isExploded, learningMode, componentId, setHovered]
  );

  const onPointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(null);
      document.body.style.cursor = 'default';
    },
    [setHovered]
  );

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isExploded || learningMode) return;
      e.stopPropagation();

      // Toggle active component
      if (activeComponent === componentId) {
        setActive(null);
        setScreenPos(null);
      } else {
        setActive(componentId);
        // Compute screen position from the 3D intersection point
        const { clientX, clientY } = e.nativeEvent;
        setScreenPos({ x: clientX, y: clientY });
      }
    },
    [isExploded, learningMode, activeComponent, componentId, setActive]
  );

  /* ── Double-click to toggle explode (on the group, not components) ── */
  const onDoubleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      const now = Date.now();
      if (now - lastClickTime.current < 300) {
        e.stopPropagation();
        useExplodedViewStore.getState().toggleExplode();
      }
      lastClickTime.current = now;
    },
    []
  );

  return {
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onDoubleClick,
    screenPos,
    isActive: activeComponent === componentId,
  };
}
