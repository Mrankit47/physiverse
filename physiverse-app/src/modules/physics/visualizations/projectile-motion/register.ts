import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'projectile-motion',
    title: 'Projectile Motion',
    description: 'Launch projectiles at any angle. Observe trajectories with and without air resistance.',
    category: 'mechanics',
    type: 'simulation',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    color: '#10B981',
    icon: 'Target',
    tags: ['Mechanics', 'Kinematics'],
    searchKeywords: ['projectile', 'motion', 'trajectory', 'angle', 'velocity', 'parabola', 'air resistance', 'range'],
    relatedTopics: ['gravity-orbits', 'pendulum'],
    learningObjectives: [
      'Understand projectile motion equations',
      'Observe the effect of launch angle on range',
      'Compare trajectories with and without air resistance',
    ],
    gradeLevel: ['9', '10', '11'],
    scientists: ['Galileo Galilei'],
  },
  component: lazy(() => import('@/components/simulations/engines/ProjectileMotionSim')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
