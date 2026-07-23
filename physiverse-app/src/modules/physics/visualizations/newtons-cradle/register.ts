import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'newtons-cradle',
    title: "Newton's Cradle",
    description: 'Observe the conservation of momentum and energy. Separate the wires, frame, and elastic steel balls.',
    category: 'mechanics',
    type: 'exploded-view',
    difficulty: 'beginner',
    estimatedTime: '8 min',
    color: '#3B82F6',
    icon: 'Target',
    componentCount: 4,
    tags: ['Mechanics', 'Momentum', 'Energy'],
    searchKeywords: ['newton cradle', 'momentum', 'conservation', 'elastic collision', 'energy transfer'],
    relatedTopics: ['pendulum', 'gravity-orbits'],
    learningObjectives: [
      'Understand conservation of momentum',
      'Observe elastic collision principles',
      'Learn about energy transfer in systems',
    ],
    gradeLevel: ['9', '10', '11'],
    scientists: ['Isaac Newton'],
  },
  component: lazy(() => import('@/app/explore/[objectId]/page')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
