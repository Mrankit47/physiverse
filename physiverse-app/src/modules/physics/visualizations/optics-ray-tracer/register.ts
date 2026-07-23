import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'optics-ray-tracer',
    title: 'Optics Ray Tracer',
    description: 'Place lenses and mirrors. Trace principal rays and observe image formation.',
    category: 'optics',
    type: 'simulation',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    color: '#EC4899',
    icon: 'Eye',
    tags: ['Optics', 'Light'],
    searchKeywords: ['optics', 'ray', 'lens', 'mirror', 'reflection', 'refraction', 'focal length', 'image', 'convex', 'concave'],
    relatedTopics: ['double-slit'],
    learningObjectives: [
      'Trace principal rays through lenses and mirrors',
      'Understand real vs virtual images',
      'Apply the lens/mirror equation',
    ],
    gradeLevel: ['10', '11', '12'],
    scientists: ['Willebrord Snell', 'Isaac Newton'],
  },
  component: lazy(() => import('@/components/simulations/engines/OpticsRayTracerSim')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
