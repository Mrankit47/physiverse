/* ═══════════════════════════════════════════════════════════════
   VISUALIZATION TEMPLATE — register.ts
   
   Copy this entire _template/ folder to create a new visualization.
   Rename the folder to your visualization's ID (kebab-case).
   Update the metadata below and the component import.
   
   The visualization will automatically appear in the library.
   No routing changes needed.
   ═══════════════════════════════════════════════════════════════ */

import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const metadata: VisualizationPlugin['metadata'] = {
  id: 'template',
  title: 'Template Visualization',
  description: 'A template for creating new visualizations.',
  category: 'mechanics',
  type: 'simulation',
  difficulty: 'beginner',
  estimatedTime: '10 min',
  color: '#3B82F6',
  tags: ['template'],
  searchKeywords: ['template', 'example'],
  relatedTopics: [],
  learningObjectives: [
    'Understand the basic structure of a visualization plugin',
  ],
};

const plugin: VisualizationPlugin = {
  metadata,
  component: lazy(() => import('./index')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  // Uncomment the line below when using this template for a real visualization
  // registry.register(plugin);
}

export default plugin;
