import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'telescope',
    title: 'Optical Telescope',
    description: 'Explore a Cassegrain telescope design. Disassemble primary/secondary mirrors, eyepiece, and Schmidt lens.',
    category: 'optics',
    type: 'exploded-view',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    color: '#06B6D4',
    icon: 'Telescope',
    componentCount: 7,
    tags: ['Optics', 'Astrophysics', 'Instruments'],
    searchKeywords: ['telescope', 'Cassegrain', 'mirror', 'eyepiece', 'Schmidt', 'reflecting telescope', 'primary mirror'],
    relatedTopics: ['microscope', 'optical-bench', 'solar-system'],
    learningObjectives: [
      'Understand reflecting telescope optics',
      'Identify Cassegrain telescope components',
      'Learn about primary and secondary mirror systems',
    ],
    gradeLevel: ['10', '11', '12'],
    scientists: ['Galileo Galilei', 'Isaac Newton', 'Laurent Cassegrain'],
  },
  component: lazy(() => import('@/app/explore/[objectId]/page')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
