import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'electromagnetism',
    title: 'Electromagnetism Simulator',
    description: 'Visualize magnetic field lines around wires and solenoids. Apply the right-hand rule.',
    category: 'electromagnetism',
    type: 'simulation',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    color: '#F97316',
    icon: 'Magnet',
    tags: ['Electromagnetism', 'Magnetism'],
    searchKeywords: ['electromagnetism', 'magnetic field', 'solenoid', 'wire', 'current', 'right-hand rule', 'faraday', 'induction'],
    relatedTopics: ['circuit-sandbox'],
    learningObjectives: [
      'Visualize magnetic field lines',
      'Apply the right-hand rule',
      'Understand electromagnetic induction',
    ],
    gradeLevel: ['10', '11', '12'],
    scientists: ['Michael Faraday', 'James Clerk Maxwell', 'André-Marie Ampère'],
  },
  component: lazy(() => import('@/components/simulations/engines/ElectromagnetismSim')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
