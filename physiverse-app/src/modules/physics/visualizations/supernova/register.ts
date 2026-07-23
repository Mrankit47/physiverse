import { lazy } from 'react';
import type { VisualizationRegistry } from '@/engine/registry';
import type { VisualizationPlugin } from '@/types';

const plugin: VisualizationPlugin = {
  metadata: {
    id: 'supernova',
    title: 'Supernova Core Collapse & Remnant',
    description: 'Procedural astrophysics simulation of a Type II Supernova: core collapse, shockwave, GPU particle explosion, and spinning Pulsar remnant.',
    category: 'astrophysics',
    type: 'simulation',
    difficulty: 'advanced',
    estimatedTime: '20 min',
    color: '#FF4500',
    icon: 'Sparkles',
    tags: ['Astrophysics', 'Stars', 'Supernova', 'Pulsar', 'Nebula', 'Nuclear Physics'],
    searchKeywords: ['supernova', 'star explosion', 'core collapse', 'shockwave', 'pulsar', 'neutron star', 'nebula', 'astrophysics'],
    relatedTopics: ['black-hole', 'solar-system'],
    learningObjectives: [
      'Understand the evolutionary stages of a massive star supernova',
      'Observe core collapse, shockwave expansion, and nucleosynthesis',
      'Identify stellar remnants like Neutron Stars and Pulsars',
    ],
    gradeLevel: ['11', '12'],
    scientists: ['Subrahmanyan Chandrasekhar', 'Fritz Zwicky', 'Walter Baade'],
  },
  component: lazy(() => import('./SupernovaVisualization')),
};

export function registerVisualization(registry: VisualizationRegistry): void {
  registry.register(plugin);
}

export default plugin;
