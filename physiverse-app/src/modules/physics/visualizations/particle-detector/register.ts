import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'particle-detector',
    title: 'Particle Detector',
    description: 'Look inside a high-energy physics tracker. Disassemble silicon pixel sensors, calorimeters, and solenoids.',
    category: 'modern-physics',
    type: 'exploded-view',
    difficulty: 'advanced',
    estimatedTime: '15 min',
    color: '#A855F7',
    icon: 'Activity',
    componentCount: 6,
    tags: ['Modern Physics', 'Nuclear Physics', 'Instruments'],
    searchKeywords: ['particle detector', 'CERN', 'LHC', 'calorimeter', 'solenoid', 'pixel sensor', 'tracker'],
    relatedTopics: ['atom', 'double-slit'],
    learningObjectives: [
      'Understand how particle detectors work',
      'Identify key detector components',
      'Learn about particle physics experiments',
    ],
    gradeLevel: ['11', '12'],
    scientists: ['Peter Higgs', 'Ernest Lawrence'],
  },
  component: lazy(() => import('@/app/explore/[objectId]/page')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
