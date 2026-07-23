/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Visualization Registry
   Singleton registry where every visualization plugin registers.
   The platform dynamically generates pages, search, and navigation
   from this central source of truth.
   ═══════════════════════════════════════════════════════════════ */

import type {
  VisualizationPlugin,
  VisualizationMetadata,
  PhysicsCategory,
  DifficultyLevel,
  VisualizationType,
} from '@/types';

class VisualizationRegistry {
  private static instance: VisualizationRegistry;
  private plugins: Map<string, VisualizationPlugin> = new Map();
  private listeners: Set<() => void> = new Set();
  private cachedSnapshot: VisualizationPlugin[] = [];

  private constructor() {}

  /** Get the singleton instance */
  static getInstance(): VisualizationRegistry {
    if (!VisualizationRegistry.instance) {
      VisualizationRegistry.instance = new VisualizationRegistry();
    }
    return VisualizationRegistry.instance;
  }

  /* ── Registration ── */

  /** Register a visualization plugin */
  register(plugin: VisualizationPlugin): void {
    if (this.plugins.has(plugin.metadata.id)) {
      console.warn(
        `[Physiverse Registry] Visualization "${plugin.metadata.id}" is already registered. Skipping duplicate.`
      );
      return;
    }

    this.plugins.set(plugin.metadata.id, plugin);
    this.cachedSnapshot = Array.from(this.plugins.values());
    this.notifyListeners();
  }

  /** Bulk-register multiple plugins */
  registerAll(plugins: VisualizationPlugin[]): void {
    for (const plugin of plugins) {
      this.register(plugin);
    }
  }

  /** Unregister a visualization (for hot-reload / testing) */
  unregister(id: string): boolean {
    const result = this.plugins.delete(id);
    if (result) {
      this.cachedSnapshot = Array.from(this.plugins.values());
      this.notifyListeners();
    }
    return result;
  }

  /* ── Retrieval ── */

  /** Get a single plugin by ID */
  get(id: string): VisualizationPlugin | undefined {
    return this.plugins.get(id);
  }

  /** Get metadata only (lighter weight for lists) */
  getMetadata(id: string): VisualizationMetadata | undefined {
    return this.plugins.get(id)?.metadata;
  }

  /** Get all registered plugins */
  getAll(): VisualizationPlugin[] {
    return this.cachedSnapshot;
  }

  /** Get all metadata (for listing pages) */
  getAllMetadata(): VisualizationMetadata[] {
    return this.getAll().map((p) => p.metadata);
  }

  /** Get total count */
  get count(): number {
    return this.plugins.size;
  }

  /* ── Filtering ── */

  /** Filter by physics category */
  getByCategory(category: PhysicsCategory): VisualizationPlugin[] {
    return this.getAll().filter((p) => p.metadata.category === category);
  }

  /** Filter by visualization type */
  getByType(type: VisualizationType): VisualizationPlugin[] {
    return this.getAll().filter((p) => p.metadata.type === type);
  }

  /** Filter by difficulty */
  getByDifficulty(difficulty: DifficultyLevel): VisualizationPlugin[] {
    return this.getAll().filter((p) => p.metadata.difficulty === difficulty);
  }

  /** Filter by tag */
  getByTag(tag: string): VisualizationPlugin[] {
    const normalizedTag = tag.toLowerCase();
    return this.getAll().filter((p) =>
      p.metadata.tags.some((t) => t.toLowerCase() === normalizedTag)
    );
  }

  /** Filter by multiple criteria */
  filter(criteria: {
    category?: PhysicsCategory;
    type?: VisualizationType;
    difficulty?: DifficultyLevel;
    tags?: string[];
  }): VisualizationPlugin[] {
    return this.getAll().filter((p) => {
      if (criteria.category && p.metadata.category !== criteria.category) return false;
      if (criteria.type && p.metadata.type !== criteria.type) return false;
      if (criteria.difficulty && p.metadata.difficulty !== criteria.difficulty) return false;
      if (criteria.tags && criteria.tags.length > 0) {
        const pluginTags = p.metadata.tags.map((t) => t.toLowerCase());
        const hasAllTags = criteria.tags.every((tag) =>
          pluginTags.includes(tag.toLowerCase())
        );
        if (!hasAllTags) return false;
      }
      return true;
    });
  }

  /* ── Aggregation ── */

  /** Get all unique categories that have registered visualizations */
  getCategories(): PhysicsCategory[] {
    const categories = new Set<PhysicsCategory>();
    for (const plugin of this.plugins.values()) {
      categories.add(plugin.metadata.category);
    }
    return Array.from(categories).sort();
  }

  /** Get all unique tags across all registered visualizations */
  getTags(): string[] {
    const tags = new Set<string>();
    for (const plugin of this.plugins.values()) {
      for (const tag of plugin.metadata.tags) {
        tags.add(tag);
      }
    }
    return Array.from(tags).sort();
  }

  /** Get tag counts */
  getTagCounts(): Map<string, number> {
    const counts = new Map<string, number>();
    for (const plugin of this.plugins.values()) {
      for (const tag of plugin.metadata.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return counts;
  }

  /** Get all unique scientists */
  getScientists(): string[] {
    const scientists = new Set<string>();
    for (const plugin of this.plugins.values()) {
      if (plugin.metadata.scientists) {
        for (const s of plugin.metadata.scientists) {
          scientists.add(s);
        }
      }
    }
    return Array.from(scientists).sort();
  }

  /** Get category counts */
  getCategoryCounts(): Map<PhysicsCategory, number> {
    const counts = new Map<PhysicsCategory, number>();
    for (const plugin of this.plugins.values()) {
      const cat = plugin.metadata.category;
      counts.set(cat, (counts.get(cat) || 0) + 1);
    }
    return counts;
  }

  /* ── Search ── */

  /** Simple text search across metadata */
  search(query: string): VisualizationPlugin[] {
    if (!query.trim()) return this.getAll();

    const terms = query.toLowerCase().split(/\s+/);

    return this.getAll()
      .map((plugin) => {
        const searchableText = [
          plugin.metadata.title,
          plugin.metadata.description,
          plugin.metadata.category,
          plugin.metadata.subcategory || '',
          ...plugin.metadata.tags,
          ...plugin.metadata.searchKeywords,
          ...plugin.metadata.learningObjectives,
          ...(plugin.metadata.scientists || []),
          ...(plugin.metadata.gradeLevel || []),
        ]
          .join(' ')
          .toLowerCase();

        // Calculate relevance score
        let score = 0;
        for (const term of terms) {
          if (plugin.metadata.title.toLowerCase().includes(term)) score += 10;
          if (plugin.metadata.description.toLowerCase().includes(term)) score += 5;
          if (plugin.metadata.tags.some((t) => t.toLowerCase().includes(term))) score += 8;
          if (searchableText.includes(term)) score += 1;
        }

        return { plugin, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ plugin }) => plugin);
  }

  /* ── Related ── */

  /** Get related visualizations based on shared tags/category */
  getRelated(id: string, maxResults: number = 5): VisualizationPlugin[] {
    const plugin = this.get(id);
    if (!plugin) return [];

    const scored = this.getAll()
      .filter((p) => p.metadata.id !== id)
      .map((p) => {
        let score = 0;
        // Same category = high relevance
        if (p.metadata.category === plugin.metadata.category) score += 5;
        // Shared tags
        const sharedTags = p.metadata.tags.filter((t) =>
          plugin.metadata.tags.includes(t)
        );
        score += sharedTags.length * 2;
        // Explicit related topics
        if (plugin.metadata.relatedTopics.includes(p.metadata.id)) score += 10;
        return { plugin: p, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, maxResults).map(({ plugin: p }) => p);
  }

  /* ── Listener Pattern (for React re-renders) ── */

  subscribe = (listener: () => void): () => void => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /** Get a cached snapshot array reference for React useSyncExternalStore */
  getSnapshot = (): VisualizationPlugin[] => {
    return this.cachedSnapshot;
  };
}

export { VisualizationRegistry };
export default VisualizationRegistry;
