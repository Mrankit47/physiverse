import { ExplodableObjectData } from './componentRegistry';

const newtonsCradle: ExplodableObjectData = {
  id: 'newtons-cradle',
  name: "Newton's Cradle",
  description:
    'A classic physics demonstration showing the conservation of momentum and energy through a series of swinging spheres. Explore the frame, wires, and steel balls.',
  category: 'Mechanics',
  color: '#3B82F6',
  cameraPosition: [4, 2, 5],
  explodedCameraPosition: [6, 4, 8],
  lightIntensityBoost: 0.3,
  components: [
    /* ── 1. Support Frame ── */
    {
      id: 'support-frame',
      name: 'Support Frame',
      scientificName: 'Frame Structure',
      assembledPosition: [0, 1.2, 0],
      explodedOffset: [0, 2, 0],
      assembledRotation: [0, 0, 0],
      color: '#475569',
      metalness: 0.9,
      roughness: 0.1,
      function: 'The rigid structure, typically made of metal bars, that supports the suspended balls and keeps them aligned.',
      workingPrinciple: 'Provides a stable anchor point for the suspension wires, preventing external movements from disturbing the linear oscillation plane.',
      physicsConcept: 'Structural rigidity and tension support.',
      realWorldApps: ['Bridges', 'Building trusses', 'Lab apparatus mounts'],
      interestingFacts: [
        'The frame must be extremely heavy or fixed to prevent energy loss through base movement during collisions.'
      ],
      connections: ['base', 'suspension-wires']
    },
    /* ── 2. Suspension Wires ── */
    {
      id: 'suspension-wires',
      name: 'Suspension Wires',
      scientificName: 'Bifilar Suspension Wires',
      assembledPosition: [0, 0.8, 0],
      explodedOffset: [-2, 1.5, 0],
      assembledRotation: [0, 0, 0],
      color: '#94A3B8',
      metalness: 0.8,
      roughness: 0.2,
      function: 'Two thin wires suspending each ball. The V-shape configuration restricts the motion of the balls to a single vertical plane.',
      workingPrinciple: 'Restores the ball along a perfect circular arc under gravity. The bifilar (two-wire) suspension prevents swinging sideways.',
      physicsConcept: 'Bifilar pendulum mechanics — restricts motion to 1 degree of freedom.',
      realWorldApps: ['Torsion balances', 'Seismographs', 'Suspension bridges'],
      interestingFacts: [
        'A single wire would cause the ball to wobble and spin. Two wires form a V-shape, forcing a clean back-and-forth swing.'
      ],
      formula: 'T_s = 2\\pi\\sqrt{\\frac{L}{g}}',
      connections: ['support-frame', 'steel-balls']
    },
    /* ── 3. Steel Balls ── */
    {
      id: 'steel-balls',
      name: 'Steel Balls',
      scientificName: 'Identical Elastic Spheres',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, -1.5, 2.5],
      assembledRotation: [0, 0, 0],
      color: '#F59E0B',
      emissiveColor: '#FBBF24',
      metalness: 0.95,
      roughness: 0.05,
      function: 'A series of identical, high-density metal spheres aligned in contact with each other.',
      workingPrinciple: 'Elastic collisions transfer kinetic energy and momentum through the line of balls. The last ball receives the impact and swings upward.',
      physicsConcept: 'Conservation of Momentum (p = mv) and Conservation of Kinetic Energy in elastic collisions.',
      realWorldApps: ['Billiards', 'Pile drivers', 'Shock absorbers'],
      interestingFacts: [
        'The spheres are usually made of high-carbon steel to minimize internal energy loss (heat and sound) during collisions.',
        'Newton did not invent the cradle; it was popularized by French physicist Edme Mariotte in the 17th century.'
      ],
      formula: 'm_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}',
      connections: ['suspension-wires']
    },
    /* ── 4. Base ── */
    {
      id: 'base',
      name: 'Base Platform',
      scientificName: 'Cradle Base Plate',
      assembledPosition: [0, -1.2, 0],
      explodedOffset: [0, -2, 0],
      assembledRotation: [0, 0, 0],
      color: '#1E293B',
      metalness: 0.6,
      roughness: 0.4,
      function: 'The heavy base that supports the entire frame and absorbs excess vibrational energy.',
      workingPrinciple: 'Acts as an inertial anchor. Its large mass relative to the balls minimizes kinetic energy transfer into the table surface.',
      physicsConcept: 'Inertia — resistance to changes in state of motion.',
      realWorldApps: ['Heavy machinery beds', 'Speaker isolation pads', 'Optical table bases'],
      interestingFacts: [
        'A wooden or heavy metal base is preferred to ensure that energy is kept within the swinging spheres.'
      ],
      connections: ['support-frame']
    }
  ]
};

export default newtonsCradle;
