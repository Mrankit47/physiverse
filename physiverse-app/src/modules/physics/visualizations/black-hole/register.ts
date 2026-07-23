import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'black-hole',
    title: 'Black Hole Accretion Disk',
    description: 'Explore gravitational lensing, photon orbits, and the event horizon of a black hole.',
    category: 'astrophysics',
    type: 'simulation',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    color: '#6366F1',
    icon: 'Sparkles',
    tags: ['Astrophysics', 'Modern Physics', 'Gravity'],
    searchKeywords: ['black hole', 'accretion disk', 'gravitational lensing', 'event horizon', 'photon sphere', 'singularity', 'spacetime'],
    relatedTopics: ['solar-system', 'gravity-orbits'],
    learningObjectives: [
      'Understand the structure of a black hole',
      'Observe gravitational lensing effects',
      'Learn about the event horizon and photon sphere',
    ],
    gradeLevel: ['11', '12'],
    scientists: ['Karl Schwarzschild', 'Stephen Hawking', 'Albert Einstein'],
  },
  component: lazy(() => import('@/components/simulations/engines/BlackHoleSim')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
