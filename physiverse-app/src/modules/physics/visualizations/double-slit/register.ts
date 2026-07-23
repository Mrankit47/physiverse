import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'double-slit',
    title: 'Double-Slit Interference',
    description: 'Adjust slit width, spacing, and wavelength. See quantum diffraction patterns emerge.',
    category: 'quantum',
    type: 'simulation',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    color: '#A855F7',
    icon: 'Binary',
    tags: ['Quantum', 'Wave Physics', 'Optics'],
    searchKeywords: ['double slit', 'interference', 'diffraction', 'quantum', 'wavelength', 'fringe', 'wave-particle duality'],
    relatedTopics: ['wave-on-string', 'optics-ray-tracer'],
    learningObjectives: [
      'Understand wave-particle duality',
      'Observe interference patterns',
      'Calculate fringe spacing from slit parameters',
    ],
    gradeLevel: ['11', '12'],
    scientists: ['Thomas Young', 'Richard Feynman'],
  },
  component: lazy(() => import('@/components/simulations/engines/DoubleSlitSim')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
