'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExplodedViewStore } from '@/stores/explodedViewStore';
import type { Vec3 } from '@/data/explodedView/componentRegistry';

const LERP_SPEED = 2.5; // smooth interpolation factor

/**
 * Smoothly animates the camera position based on the current
 * exploded-view state (assembled, exploded, focused component, learning mode).
 */
export function useCameraAnimation(
  assembledCamPos: Vec3,
  explodedCamPos: Vec3,
  componentPositions?: Map<string, Vec3>
) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(...assembledCamPos));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const isExploded = useExplodedViewStore((s) => s.isExploded);
  const activeComponent = useExplodedViewStore((s) => s.activeComponent);
  const learningMode = useExplodedViewStore((s) => s.learningMode);
  const learningStep = useExplodedViewStore((s) => s.learningStep);
  const reducedMotion = useExplodedViewStore((s) => s.reducedMotion);

  useFrame((_, delta) => {
    let desiredPos: THREE.Vector3;
    let desiredLookAt = new THREE.Vector3(0, 0, 0);

    if (learningMode && componentPositions) {
      // In learning mode: focus camera on the current step's component
      const entries = Array.from(componentPositions.entries());
      if (entries[learningStep]) {
        const [, pos] = entries[learningStep];
        desiredLookAt = new THREE.Vector3(...pos);
        // Position camera offset from the component
        desiredPos = new THREE.Vector3(
          pos[0] + 3,
          pos[1] + 2,
          pos[2] + 4
        );
      } else {
        desiredPos = new THREE.Vector3(...explodedCamPos);
      }
    } else if (activeComponent && componentPositions) {
      // Focused on a specific component — orbit toward it
      const compPos = componentPositions.get(activeComponent);
      if (compPos) {
        desiredLookAt = new THREE.Vector3(...compPos);
        desiredPos = new THREE.Vector3(
          compPos[0] + 3,
          compPos[1] + 1.5,
          compPos[2] + 4
        );
      } else {
        desiredPos = new THREE.Vector3(...explodedCamPos);
      }
    } else if (isExploded) {
      desiredPos = new THREE.Vector3(...explodedCamPos);
    } else {
      desiredPos = new THREE.Vector3(...assembledCamPos);
    }

    // Smooth interpolation
    const lerpFactor = reducedMotion ? 1 : 1 - Math.exp(-LERP_SPEED * delta);

    targetPos.current.lerp(desiredPos, lerpFactor);
    targetLookAt.current.lerp(desiredLookAt, lerpFactor);

    camera.position.copy(targetPos.current);
    camera.lookAt(targetLookAt.current);
  });
}
