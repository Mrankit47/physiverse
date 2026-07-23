import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'microscope',
    title: 'Compound Microscope',
    description: 'Explore 16 components — from the eyepiece to the illuminator. Discover how optics create magnified images.',
    category: 'optics',
    type: 'exploded-view',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    color: '#8B5CF6',
    icon: 'Microscope',
    componentCount: 16,
    tags: ['Optics', 'Light', 'Instruments'],
    searchKeywords: ['microscope', 'eyepiece', 'objective', 'magnification', 'lens', 'illuminator', 'stage'],
    relatedTopics: ['telescope', 'optical-bench', 'optics-ray-tracer'],
    learningObjectives: [
      'Identify the 16 components of a compound microscope',
      'Understand how objective and eyepiece lenses create magnification',
      'Learn the role of the condenser and illuminator',
    ],
    gradeLevel: ['9', '10', '11'],
    scientists: ['Antonie van Leeuwenhoek', 'Robert Hooke'],
  },
  component: lazy(() => import('@/app/explore/[objectId]/page')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
