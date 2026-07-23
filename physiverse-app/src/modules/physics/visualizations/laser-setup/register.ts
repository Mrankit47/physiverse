import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'laser-setup',
    title: 'Laser Setup',
    description: 'Disassemble a laser optics setup. Inspect the semiconductor diode, beam expander, filter, and photodiode detector.',
    category: 'optics',
    type: 'exploded-view',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    color: '#EC4899',
    icon: 'Zap',
    componentCount: 7,
    tags: ['Optics', 'Light', 'Modern Physics', 'Instruments'],
    searchKeywords: ['laser', 'semiconductor', 'diode', 'beam expander', 'photodiode', 'stimulated emission', 'coherent light'],
    relatedTopics: ['optical-bench', 'microscope', 'double-slit'],
    learningObjectives: [
      'Understand how lasers produce coherent light',
      'Identify laser setup components',
      'Learn about stimulated emission',
    ],
    gradeLevel: ['11', '12'],
    scientists: ['Albert Einstein', 'Theodore Maiman', 'Charles Townes'],
  },
  component: lazy(() => import('@/app/explore/[objectId]/page')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
