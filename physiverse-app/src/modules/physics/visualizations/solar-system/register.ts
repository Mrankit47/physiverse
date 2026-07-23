import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'solar-system',
    title: 'Solar System Simulator',
    description: 'Explore planetary orbits, adjust masses, and observe Kepler\'s laws in real-time 3D.',
    category: 'astrophysics',
    type: 'simulation',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    color: '#06B6D4',
    icon: 'Telescope',
    tags: ['Astrophysics', 'Mechanics', 'Gravity'],
    searchKeywords: ['solar system', 'planets', 'orbits', 'kepler', 'gravity', 'sun', 'earth', 'mars', 'jupiter'],
    relatedTopics: ['gravity-orbits', 'black-hole'],
    learningObjectives: [
      'Understand Kepler\'s three laws of planetary motion',
      'Visualize the effect of mass on orbital periods',
      'Observe elliptical orbits and eccentricity',
    ],
    gradeLevel: ['9', '10', '11'],
    scientists: ['Johannes Kepler', 'Isaac Newton'],
  },
  component: lazy(() => import('@/components/simulations/engines/SolarSystemSim')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
