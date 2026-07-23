import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'circuit-sandbox',
    title: 'Circuit Sandbox',
    description: 'Build circuits with batteries, resistors, and bulbs. See electron flow and read virtual meters.',
    category: 'electromagnetism',
    type: 'simulation',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    color: '#EF4444',
    icon: 'Cable',
    tags: ['Electromagnetism', 'Electricity'],
    searchKeywords: ['circuit', 'battery', 'resistor', 'current', 'voltage', 'ohm', 'series', 'parallel', 'electron'],
    relatedTopics: ['electromagnetism'],
    learningObjectives: [
      'Build and analyze simple circuits',
      'Understand Ohm\'s law (V=IR)',
      'Compare series and parallel circuits',
    ],
    gradeLevel: ['9', '10', '11', '12'],
    scientists: ['Georg Ohm', 'Michael Faraday', 'Alessandro Volta'],
  },
  component: lazy(() => import('@/components/simulations/engines/CircuitSandboxSim')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
