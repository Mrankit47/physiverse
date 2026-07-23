import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'foucault-pendulum',
    title: 'Foucault Pendulum',
    description: "Explore the simple device that proves Earth's rotation. Disassemble the cable, pivot, bob, and azimuth ring base.",
    category: 'mechanics',
    type: 'exploded-view',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    color: '#8B5CF6',
    icon: 'Compass',
    componentCount: 5,
    tags: ['Mechanics', 'Rotational Motion'],
    searchKeywords: ['foucault', 'pendulum', 'earth rotation', 'coriolis', 'pivot', 'bob', 'azimuth'],
    relatedTopics: ['pendulum', 'gyroscope'],
    learningObjectives: [
      "Understand how the Foucault pendulum proves Earth's rotation",
      'Learn about the Coriolis effect',
      'Identify components of the pendulum apparatus',
    ],
    gradeLevel: ['10', '11', '12'],
    scientists: ['Léon Foucault'],
  },
  component: lazy(() => import('@/app/explore/[objectId]/page')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
