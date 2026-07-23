/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Global Tag System
   Centralized tag registry with predefined physics branches,
   dynamic tag generation, and filtering logic.
   ═══════════════════════════════════════════════════════════════ */

import type { PhysicsCategory } from '@/types';
import type { TagInfo } from '@/types/search';

/** Predefined physics branch tags with display metadata */
export const PHYSICS_BRANCHES: {
  id: PhysicsCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}[] = [
  {
    id: 'mechanics',
    label: 'Mechanics',
    icon: 'Target',
    color: '#3B82F6',
    description: 'Motion, forces, energy, and momentum',
  },
  {
    id: 'optics',
    label: 'Optics',
    icon: 'Eye',
    color: '#EC4899',
    description: 'Light, lenses, mirrors, and color',
  },
  {
    id: 'quantum',
    label: 'Quantum',
    icon: 'Binary',
    color: '#A855F7',
    description: 'Wave-particle duality, uncertainty, tunneling',
  },
  {
    id: 'electricity',
    label: 'Electricity',
    icon: 'Zap',
    color: '#F59E0B',
    description: 'Charge, current, voltage, and circuits',
  },
  {
    id: 'magnetism',
    label: 'Magnetism',
    icon: 'Magnet',
    color: '#EF4444',
    description: 'Magnetic fields, induction, and motors',
  },
  {
    id: 'electromagnetism',
    label: 'Electromagnetism',
    icon: 'Cable',
    color: '#F97316',
    description: 'Maxwell equations, EM waves, and radiation',
  },
  {
    id: 'astrophysics',
    label: 'Astrophysics',
    icon: 'Telescope',
    color: '#06B6D4',
    description: 'Stars, galaxies, black holes, and cosmology',
  },
  {
    id: 'thermodynamics',
    label: 'Thermodynamics',
    icon: 'Flame',
    color: '#EF4444',
    description: 'Heat, entropy, and energy transfer',
  },
  {
    id: 'wave-physics',
    label: 'Wave Physics',
    icon: 'Waves',
    color: '#10B981',
    description: 'Sound, vibrations, interference, and resonance',
  },
  {
    id: 'nuclear-physics',
    label: 'Nuclear Physics',
    icon: 'Atom',
    color: '#8B5CF6',
    description: 'Radioactivity, fission, fusion, and decay',
  },
  {
    id: 'modern-physics',
    label: 'Modern Physics',
    icon: 'Cpu',
    color: '#6366F1',
    description: 'Relativity, quantum mechanics, and particle physics',
  },
];

/** Get branch metadata by ID */
export function getBranchById(id: PhysicsCategory) {
  return PHYSICS_BRANCHES.find((b) => b.id === id);
}

/** Get branch display label */
export function getBranchLabel(id: PhysicsCategory): string {
  return getBranchById(id)?.label ?? id;
}

/** Get branch color */
export function getBranchColor(id: PhysicsCategory): string {
  return getBranchById(id)?.color ?? '#6B7280';
}

/** Tag System class for dynamic tag management */
export class TagSystem {
  private tags: Map<string, TagInfo> = new Map();

  /** Add tags from a visualization's metadata */
  addTags(tags: string[], category?: PhysicsCategory): void {
    for (const tag of tags) {
      const normalized = tag.toLowerCase();
      const existing = this.tags.get(normalized);
      if (existing) {
        existing.count++;
      } else {
        this.tags.set(normalized, {
          name: tag,
          count: 1,
          category,
        });
      }
    }
  }

  /** Get all tags sorted by count (descending) */
  getAll(): TagInfo[] {
    return Array.from(this.tags.values()).sort((a, b) => b.count - a.count);
  }

  /** Get tags for a specific category */
  getByCategory(category: PhysicsCategory): TagInfo[] {
    return this.getAll().filter((t) => t.category === category);
  }

  /** Get top N most popular tags */
  getPopular(n: number = 10): TagInfo[] {
    return this.getAll().slice(0, n);
  }

  /** Search tags by prefix */
  search(prefix: string): TagInfo[] {
    const normalized = prefix.toLowerCase();
    return this.getAll().filter((t) => t.name.toLowerCase().startsWith(normalized));
  }

  /** Check if a tag exists */
  has(tag: string): boolean {
    return this.tags.has(tag.toLowerCase());
  }

  /** Get tag count */
  get size(): number {
    return this.tags.size;
  }

  /** Clear all tags */
  clear(): void {
    this.tags.clear();
  }
}

/** Singleton tag system */
let tagSystemInstance: TagSystem | null = null;

export function getTagSystem(): TagSystem {
  if (!tagSystemInstance) {
    tagSystemInstance = new TagSystem();
  }
  return tagSystemInstance;
}
