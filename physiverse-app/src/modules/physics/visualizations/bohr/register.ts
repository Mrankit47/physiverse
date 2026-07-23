import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'bohr-atom',
    title: 'Bohr Model & Quantum Jumps',
    description: 'Scientifically accurate Bohr atom with energy level transitions, photon absorption, emission spectrum, and element selector.',
    category: 'quantum',
    type: 'simulation',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    color: '#F59E0B',
    icon: 'Atom',
    tags: ['Quantum', 'Atomic Structure', 'Photons', 'Energy Levels', 'Spectroscopy'],
    searchKeywords: ['bohr', 'quantum jump', 'photon', 'energy level', 'excitation', 'emission', 'rydberg', 'hydrogen'],
    relatedTopics: ['atom', 'double-slit'],
    learningObjectives: [
      'Understand Bohr postulates of quantized energy levels',
      'Observe photon absorption and electron excitation',
      'Calculate photon energy and spectral wavelength',
    ],
    gradeLevel: ['10', '11', '12'],
    scientists: ['Niels Bohr', 'Johannes Rydberg', 'Max Planck'],
  },
  component: lazy(() => import('./BohrVisualization')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
