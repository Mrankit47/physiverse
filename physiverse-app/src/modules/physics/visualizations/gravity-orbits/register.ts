import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'gravity-orbits',
    title: 'Gravity & Orbits',
    description: 'Visualize gravitational force vectors between two bodies. Adjust mass and distance.',
    category: 'mechanics',
    type: 'simulation',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    color: '#3B82F6',
    icon: 'Orbit',
    tags: ['Mechanics', 'Gravity'],
    searchKeywords: ['gravity', 'orbits', 'force', 'mass', 'distance', 'newton', 'gravitational'],
    relatedTopics: ['solar-system', 'projectile-motion'],
    learningObjectives: [
      'Understand Newton\'s law of universal gravitation',
      'Visualize how mass affects gravitational force',
      'Observe the relationship between distance and force',
    ],
    gradeLevel: ['9', '10', '11'],
    scientists: ['Isaac Newton', 'Henry Cavendish'],
  },
  component: lazy(() => import('@/components/simulations/engines/GravityOrbitsSim')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
