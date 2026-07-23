import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'generator',
    title: 'Electromagnetic Generator',
    description: 'Convert mechanical energy into electrical energy. Inspect rotor, stator core, copper coils, and magnets.',
    category: 'electromagnetism',
    type: 'exploded-view',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    color: '#EF4444',
    icon: 'Cpu',
    componentCount: 8,
    tags: ['Electromagnetism', 'Electricity', 'Instruments'],
    searchKeywords: ['generator', 'rotor', 'stator', 'coil', 'magnet', 'induction', 'electromagnetic', 'AC', 'DC'],
    relatedTopics: ['electromagnetism', 'circuit-sandbox'],
    learningObjectives: [
      'Understand electromagnetic induction',
      'Identify generator components',
      'Learn how mechanical energy converts to electrical energy',
    ],
    gradeLevel: ['10', '11', '12'],
    scientists: ['Michael Faraday', 'Nikola Tesla'],
  },
  component: lazy(() => import('@/app/explore/[objectId]/page')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
