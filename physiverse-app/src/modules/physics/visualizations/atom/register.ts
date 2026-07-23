import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'atom',
    title: 'Interactive 3D Atom',
    description: 'Explore an interactive atom with nucleus packing, electron orbital trails, quark components, and quantum state readouts.',
    category: 'modern-physics',
    type: 'simulation',
    difficulty: 'beginner',
    estimatedTime: '10 min',
    color: '#3B82F6',
    icon: 'Atom',
    componentCount: 7,
    tags: ['Modern Physics', 'Quantum', 'Atomic Structure', 'Proton', 'Electron', 'Quarks'],
    searchKeywords: ['atom', 'electron', 'proton', 'neutron', 'nucleus', 'orbital', 'shell', 'quarks'],
    relatedTopics: ['bohr-atom', 'particle-detector'],
    learningObjectives: [
      'Identify subatomic particles (protons, neutrons, electrons)',
      'Understand 3D electron shell distributions',
      'Discover quark compositions of nucleons',
    ],
    gradeLevel: ['9', '10', '11', '12'],
    scientists: ['Niels Bohr', 'Ernest Rutherford', 'J.J. Thomson'],
  },
  component: lazy(() => import('./AtomVisualization')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
