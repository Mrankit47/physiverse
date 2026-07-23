import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'gyroscope',
    title: 'Gyroscope',
    description: 'Disassemble the gimbal rings, rotor, and bearings that give this instrument its extraordinary stability.',
    category: 'mechanics',
    type: 'exploded-view',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    color: '#10B981',
    icon: 'RotateCcw',
    componentCount: 6,
    tags: ['Mechanics', 'Rotational Motion', 'Instruments'],
    searchKeywords: ['gyroscope', 'gimbal', 'rotor', 'angular momentum', 'precession', 'stability'],
    relatedTopics: ['foucault-pendulum', 'pendulum'],
    learningObjectives: [
      'Understand angular momentum conservation',
      'Learn how gimbal rings provide stability',
      'Observe precession in a gyroscope',
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
