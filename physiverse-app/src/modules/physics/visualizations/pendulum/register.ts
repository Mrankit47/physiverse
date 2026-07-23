import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'pendulum',
    title: 'Pendulum Simulator',
    description: 'Adjust length, gravity, and friction. Compare pendulums and track energy exchanges.',
    category: 'mechanics',
    type: 'simulation',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    color: '#8B5CF6',
    icon: 'Compass',
    tags: ['Mechanics', 'Oscillations'],
    searchKeywords: ['pendulum', 'oscillation', 'period', 'frequency', 'simple harmonic motion', 'SHM', 'gravity', 'energy'],
    relatedTopics: ['wave-on-string', 'projectile-motion'],
    learningObjectives: [
      'Understand simple harmonic motion',
      'Observe how length affects period',
      'Track kinetic and potential energy exchanges',
    ],
    gradeLevel: ['9', '10', '11'],
    scientists: ['Galileo Galilei', 'Christiaan Huygens'],
  },
  component: lazy(() => import('@/components/simulations/engines/PendulumSim')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
