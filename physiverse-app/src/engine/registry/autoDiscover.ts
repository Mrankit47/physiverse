/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Auto-Discovery System
   Automatically imports all visualization register.ts files.
   Uses webpack's require.context (Next.js compatible) for
   build-time module discovery.
   ═══════════════════════════════════════════════════════════════ */

import { VisualizationRegistry } from './VisualizationRegistry';

/**
 * Auto-discovers and registers all visualization plugins.
 * 
 * Each visualization module must export a `register.ts` file that
 * calls `registry.register(plugin)`. This function imports all
 * such files automatically.
 * 
 * This is called once at app startup.
 */
export function discoverAndRegisterAll(): void {
  const registry = VisualizationRegistry.getInstance();

  // Use webpack's require.context for build-time module discovery.
  // This scans `src/modules/physics/visualizations/` for any `register.ts` files.
  try {
    const context = (require as NodeRequire & {
      context: (
        directory: string,
        useSubdirectories: boolean,
        regExp: RegExp
      ) => {
        keys: () => string[];
        (key: string): { registerVisualization?: (r: VisualizationRegistry) => void };
      };
    }).context(
      '../../modules/physics/visualizations',
      true,
      /register\.(ts|tsx|js|jsx)$/
    );

    const keys = context.keys();

    for (const key of keys) {
      try {
        const module = context(key);
        if (module.registerVisualization) {
          module.registerVisualization(registry);
        }
      } catch (err) {
        console.error(`[Physiverse] Failed to load visualization module: ${key}`, err);
      }
    }

    console.info(
      `[Physiverse] Auto-discovered ${registry.count} visualizations from ${keys.length} modules.`
    );
  } catch {
    // require.context is not available in all environments (e.g., tests).
    // Fall back to manual imports.
    console.info('[Physiverse] Auto-discovery not available. Using manual registration.');
  }
}

/**
 * Manual registration fallback.
 * Import this and call it to register visualizations explicitly.
 * Used when require.context is unavailable (SSR, tests, etc.)
 */
export function manualRegisterAll(): void {
  // Dynamically import all register modules
  // These imports are resolved at build time by Next.js/webpack
  const modules = [
    // Simulations
    () => import('@/modules/physics/visualizations/solar-system/register'),
    () => import('@/modules/physics/visualizations/gravity-orbits/register'),
    () => import('@/modules/physics/visualizations/projectile-motion/register'),
    () => import('@/modules/physics/visualizations/pendulum/register'),
    () => import('@/modules/physics/visualizations/wave-on-string/register'),
    () => import('@/modules/physics/visualizations/circuit-sandbox/register'),
    () => import('@/modules/physics/visualizations/optics-ray-tracer/register'),
    () => import('@/modules/physics/visualizations/double-slit/register'),
    () => import('@/modules/physics/visualizations/electromagnetism/register'),
    () => import('@/modules/physics/visualizations/black-hole/register'),
    // Explore (Exploded Views)
    () => import('@/modules/physics/visualizations/microscope/register'),
    () => import('@/modules/physics/visualizations/atom/register'),
    () => import('@/modules/physics/visualizations/gyroscope/register'),
    () => import('@/modules/physics/visualizations/newtons-cradle/register'),
    () => import('@/modules/physics/visualizations/foucault-pendulum/register'),
    () => import('@/modules/physics/visualizations/generator/register'),
    () => import('@/modules/physics/visualizations/particle-detector/register'),
    () => import('@/modules/physics/visualizations/telescope/register'),
    () => import('@/modules/physics/visualizations/optical-bench/register'),
    () => import('@/modules/physics/visualizations/bohr/register'),
    () => import('@/modules/physics/visualizations/supernova/register'),
  ];

  const registry = VisualizationRegistry.getInstance();

  for (const loadModule of modules) {
    loadModule()
      .then((mod) => {
        if (mod.registerVisualization) {
          mod.registerVisualization(registry);
        }
      })
      .catch((err) => {
        console.error('[Physiverse] Failed to register visualization:', err);
      });
  }
}
