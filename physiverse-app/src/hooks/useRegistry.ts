'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — useRegistry Hook
   React hook for accessing the visualization registry.
   Handles initialization and provides reactive access.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { VisualizationRegistry } from '@/engine/registry';
import { getSearchEngine } from '@/engine/search/SearchEngine';
import { getTagSystem } from '@/engine/tags/TagSystem';
import type { VisualizationPlugin, PhysicsCategory, DifficultyLevel, VisualizationType } from '@/types';

let initialized = false;
const SERVER_SNAPSHOT: VisualizationPlugin[] = [];
const getServerSnapshot = () => SERVER_SNAPSHOT;

/** Initialize the registry with all visualizations */
async function initializeRegistry(): Promise<void> {
  if (initialized) return;

  const registry = VisualizationRegistry.getInstance();

  // Import all register modules
  const modules = await Promise.allSettled([
    import('@/modules/physics/visualizations/solar-system/register'),
    import('@/modules/physics/visualizations/gravity-orbits/register'),
    import('@/modules/physics/visualizations/projectile-motion/register'),
    import('@/modules/physics/visualizations/pendulum/register'),
    import('@/modules/physics/visualizations/wave-on-string/register'),
    import('@/modules/physics/visualizations/circuit-sandbox/register'),
    import('@/modules/physics/visualizations/optics-ray-tracer/register'),
    import('@/modules/physics/visualizations/double-slit/register'),
    import('@/modules/physics/visualizations/electromagnetism/register'),
    import('@/modules/physics/visualizations/black-hole/register'),
    import('@/modules/physics/visualizations/microscope/register'),
    import('@/modules/physics/visualizations/atom/register'),
    import('@/modules/physics/visualizations/gyroscope/register'),
    import('@/modules/physics/visualizations/newtons-cradle/register'),
    import('@/modules/physics/visualizations/foucault-pendulum/register'),
    import('@/modules/physics/visualizations/generator/register'),
    import('@/modules/physics/visualizations/particle-detector/register'),
    import('@/modules/physics/visualizations/telescope/register'),
    import('@/modules/physics/visualizations/optical-bench/register'),
    import('@/modules/physics/visualizations/laser-setup/register'),
    import('@/modules/physics/visualizations/bohr/register'),
    import('@/modules/physics/visualizations/supernova/register'),
  ]);

  for (const result of modules) {
    if (result.status === 'fulfilled' && result.value.registerVisualization) {
      result.value.registerVisualization(registry);
    }
  }

  // Build search index
  const searchEngine = getSearchEngine();
  searchEngine.buildIndex(registry.getAll());

  // Build tag system
  const tagSystem = getTagSystem();
  for (const plugin of registry.getAll()) {
    tagSystem.addTags(plugin.metadata.tags, plugin.metadata.category);
  }

  initialized = true;
  console.info(`[Physiverse] Registry initialized with ${registry.count} visualizations`);
}

/** React hook for accessing the registry */
export function useRegistry() {
  const [isReady, setIsReady] = useState(initialized);
  const registry = VisualizationRegistry.getInstance();

  useEffect(() => {
    if (!initialized) {
      initializeRegistry().then(() => setIsReady(true));
    }
  }, []);

  // Subscribe to registry changes for reactive updates
  const plugins = useSyncExternalStore(
    registry.subscribe,
    registry.getSnapshot,
    getServerSnapshot
  );

  return {
    isReady,
    registry,
    plugins,
    count: plugins.length,

    // Convenience methods
    get: useCallback((id: string) => registry.get(id), [registry]),
    getAll: useCallback(() => registry.getAll(), [registry]),
    getAllMetadata: useCallback(() => registry.getAllMetadata(), [registry]),
    getByCategory: useCallback((cat: PhysicsCategory) => registry.getByCategory(cat), [registry]),
    getByType: useCallback((type: VisualizationType) => registry.getByType(type), [registry]),
    getByDifficulty: useCallback((diff: DifficultyLevel) => registry.getByDifficulty(diff), [registry]),
    search: useCallback((query: string) => registry.search(query), [registry]),
    getCategories: useCallback(() => registry.getCategories(), [registry]),
    getTags: useCallback(() => registry.getTags(), [registry]),
    getRelated: useCallback((id: string) => registry.getRelated(id), [registry]),
  };
}

/** Hook for search functionality */
export function useVisualizationSearch() {
  const { isReady } = useRegistry();
  const searchEngine = getSearchEngine();

  const search = useCallback(
    (text: string, filters?: {
      categories?: PhysicsCategory[];
      difficulty?: DifficultyLevel[];
      types?: VisualizationType[];
      tags?: string[];
    }) => {
      if (!isReady) return [];
      return searchEngine.search({
        text,
        categories: filters?.categories,
        difficulty: filters?.difficulty,
        types: filters?.types,
        tags: filters?.tags,
      });
    },
    [isReady, searchEngine]
  );

  return { search, isReady };
}
