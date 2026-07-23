import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'optical-bench',
    title: 'Optical Bench',
    description: 'Study image formation and focal length measurement. Separate the bench rail, lenses, prisms, and laser source.',
    category: 'optics',
    type: 'exploded-view',
    difficulty: 'intermediate',
    estimatedTime: '12 min',
    color: '#8B5CF6',
    icon: 'Ruler',
    componentCount: 7,
    tags: ['Optics', 'Light', 'Instruments'],
    searchKeywords: ['optical bench', 'lens', 'prism', 'focal length', 'image formation', 'laser', 'rail'],
    relatedTopics: ['microscope', 'telescope', 'laser-setup'],
    learningObjectives: [
      'Understand optical bench experiments',
      'Learn about focal length measurement',
      'Study image formation with lenses',
    ],
    gradeLevel: ['10', '11', '12'],
    scientists: ['Willebrord Snell', 'Augustin-Jean Fresnel'],
  },
  component: lazy(() => import('@/app/explore/[objectId]/page')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
