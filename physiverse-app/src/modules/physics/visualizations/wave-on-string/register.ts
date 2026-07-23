import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'wave-on-string',
    title: 'Wave on a String',
    description: 'Control amplitude, frequency, and tension. Watch superposition and standing waves form.',
    category: 'wave-physics',
    type: 'simulation',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    color: '#F59E0B',
    icon: 'Waves',
    tags: ['Wave Physics', 'Oscillations'],
    searchKeywords: ['wave', 'string', 'amplitude', 'frequency', 'wavelength', 'standing wave', 'superposition', 'node', 'antinode'],
    relatedTopics: ['double-slit', 'pendulum'],
    learningObjectives: [
      'Understand transverse wave properties',
      'Observe standing wave formation',
      'Learn about superposition of waves',
    ],
    gradeLevel: ['10', '11', '12'],
    scientists: ['Pythagoras', 'Marin Mersenne'],
  },
  component: lazy(() => import('@/components/simulations/engines/WaveOnStringSim')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
