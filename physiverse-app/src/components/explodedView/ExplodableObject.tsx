'use client';

import { ReactNode } from 'react';
import ComponentMesh from './ComponentMesh';
import type { ComponentData, Vec3 } from '@/data/explodedView/componentRegistry';

interface ExplodableObjectProps {
  components: ComponentData[];
  /** Maps component ID → JSX geometry node */
  geometryMap: Record<string, ReactNode>;
}

/**
 * Generic container that renders all components of an explorable object.
 * Pairs each ComponentData entry with its geometry from the geometryMap
 * and wraps it in an interactive ComponentMesh.
 */
export default function ExplodableObject({
  components,
  geometryMap,
}: ExplodableObjectProps) {
  const totalComponents = components.length;

  return (
    <group>
      {components.map((comp, index) => {
        const geometry = geometryMap[comp.id];
        if (!geometry) return null;

        return (
          <ComponentMesh
            key={comp.id}
            data={comp}
            staggerIndex={index}
            totalComponents={totalComponents}
          >
            {geometry}
          </ComponentMesh>
        );
      })}
    </group>
  );
}

/* ── Export the position map builder for camera hook usage ── */
export function buildComponentPositionMap(
  components: ComponentData[]
): Map<string, Vec3> {
  const map = new Map<string, Vec3>();
  components.forEach((comp) => {
    const explodedPos: Vec3 = [
      comp.assembledPosition[0] + comp.explodedOffset[0],
      comp.assembledPosition[1] + comp.explodedOffset[1],
      comp.assembledPosition[2] + comp.explodedOffset[2],
    ];
    map.set(comp.id, explodedPos);
  });
  return map;
}
