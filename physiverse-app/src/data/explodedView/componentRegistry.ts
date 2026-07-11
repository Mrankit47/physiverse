/* ═══════════════════════════════════════════════════════════════
   Component Registry — Type definitions & helpers for
   the Exploded View system.
   ═══════════════════════════════════════════════════════════════ */

export type Vec3 = [number, number, number];

/** Full educational & spatial data for a single explodable component. */
export interface ComponentData {
  id: string;
  name: string;
  scientificName: string;

  /* ── Spatial ── */
  assembledPosition: Vec3;
  explodedOffset: Vec3;        // direction + distance parts travel
  assembledRotation: Vec3;     // euler angles (radians)
  scale?: Vec3;

  /* ── Visual ── */
  color: string;
  emissiveColor?: string;
  metalness?: number;
  roughness?: number;

  /* ── Educational ── */
  function: string;
  workingPrinciple: string;
  physicsConcept: string;
  realWorldApps: string[];
  interestingFacts: string[];
  formula?: string;            // LaTeX string for KaTeX rendering
  connections?: string[];      // IDs of physically connected components
}

/** Full definition of an explorable 3D object. */
export interface ExplodableObjectData {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;                // theme color for UI accents
  components: ComponentData[];
  cameraPosition: Vec3;         // default assembled camera
  explodedCameraPosition: Vec3; // zoomed-out camera for exploded view
  lightIntensityBoost: number;  // how much to brighten in exploded view
}

/** Registry of all explorable objects keyed by ID. */
export type ObjectRegistry = Record<string, ExplodableObjectData>;

/* ── Helper: compute stagger delay for ordered separation ── */
export function getStaggerDelay(index: number, total: number): number {
  return (index / total) * 0.6; // 0–600ms spread
}

/* ── Helper: get component by ID from data array ── */
export function findComponent(
  components: ComponentData[],
  id: string
): ComponentData | undefined {
  return components.find((c) => c.id === id);
}
