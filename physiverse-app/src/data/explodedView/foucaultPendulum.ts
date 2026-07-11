import { ExplodableObjectData } from './componentRegistry';

const foucaultPendulum: ExplodableObjectData = {
  id: 'foucault-pendulum',
  name: 'Foucault Pendulum',
  description:
    'A simple device conceived as an experiment to demonstrate the rotation of the Earth. Explore the pivot, cable, bob, bearings, and base platform.',
  category: 'Mechanics',
  color: '#8B5CF6',
  cameraPosition: [3, 4, 6],
  explodedCameraPosition: [5, 6, 10],
  lightIntensityBoost: 0.35,
  components: [
    /* ── 1. Suspension Cable ── */
    {
      id: 'suspension-cable',
      name: 'Suspension Cable',
      scientificName: 'Long Steel Pendulum Wire',
      assembledPosition: [0, 1.5, 0],
      explodedOffset: [2, 1, 0],
      assembledRotation: [0, 0, 0],
      color: '#94A3B8',
      metalness: 0.8,
      roughness: 0.2,
      function: 'A very long, thin wire that supports the heavy bob, allowing it to oscillate with minimal air resistance and torsion.',
      workingPrinciple: 'Maintains tension force to keep the bob in circular swing path. Its extreme length reduces damping and angular velocity.',
      physicsConcept: 'Simple Harmonic Motion — period depends only on length and gravity.',
      realWorldApps: ['Elevator cables', 'Suspension bridges', 'Lab pendulums'],
      interestingFacts: [
        'Jean Foucault\'s original 1851 pendulum in the Panthéon used a 67-meter-long steel wire.'
      ],
      formula: 'T = 2\\pi\\sqrt{\\frac{L}{g}}',
      connections: ['pivot', 'pendulum-bob']
    },
    /* ── 2. Pivot ── */
    {
      id: 'pivot',
      name: 'Universally Jointed Pivot',
      scientificName: 'Low-Friction Cardan Suspension',
      assembledPosition: [0, 3.5, 0],
      explodedOffset: [0, 2.5, 0],
      assembledRotation: [0, 0, 0],
      color: '#475569',
      metalness: 0.9,
      roughness: 0.1,
      function: 'The mounting point at the top of the cable that allows the pendulum to swing in any 3D direction without twisting.',
      workingPrinciple: 'Uses low-friction knife-edges or ball joint gimbals to decoupling the pendulum’s plane of swing from the rotating building.',
      physicsConcept: 'Decoupling frames of reference — Earth rotates underneath, while the pendulum maintains its plane of oscillation in inertial space.',
      realWorldApps: ['Gimbal joints', 'Universal joints in drive shafts', 'Compass mounts'],
      interestingFacts: [
        'A standard hook-and-eye mount would introduce torque and alter the swing direction. Foucault pendulums require a special knife-edge or ball joint.'
      ],
      connections: ['suspension-cable', 'bearings']
    },
    /* ── 3. Pendulum Bob ── */
    {
      id: 'pendulum-bob',
      name: 'Pendulum Bob',
      scientificName: 'High-Density Symmetric Bob',
      assembledPosition: [0, -0.8, 0],
      explodedOffset: [0, -2, 2],
      assembledRotation: [0, 0, 0],
      color: '#F59E0B',
      emissiveColor: '#FBBF24',
      metalness: 0.9,
      roughness: 0.15,
      function: 'A heavy, aerodynamically symmetric sphere suspended at the bottom of the cable.',
      workingPrinciple: 'High density minimizes air resistance (drag) relative to mass, letting it swing for hours without needing external energy.',
      physicsConcept: 'Inertia and conservation of energy — potential energy converts to kinetic energy and back.',
      realWorldApps: ['Clock weights', 'Wrecking balls', 'Seismographic sensors'],
      interestingFacts: [
        'The Panthéon bob was a 28 kg brass-coated lead sphere. Modern versions are often stainless steel or chrome-plated brass.'
      ],
      connections: ['suspension-cable']
    },
    /* ── 4. Bearings ── */
    {
      id: 'bearings',
      name: 'Low Friction Bearings',
      scientificName: 'Knife-Edge / Magnetic Bearings',
      assembledPosition: [0, 3.7, 0],
      explodedOffset: [-2, 2.5, -1],
      assembledRotation: [0, 0, 0],
      color: '#CBD5E1',
      metalness: 0.95,
      roughness: 0.05,
      function: 'Pivotal bearings that minimize frictional losses at the suspension point.',
      workingPrinciple: 'Reduces mechanical resistance (friction) to ensure that the change in swing plane is purely due to Earth\'s rotation, not pivot drag.',
      physicsConcept: 'Frictional damping and electrostatic/magnetic levitation to minimize mechanical contacts.',
      realWorldApps: ['Turbines', 'High-speed flywheels', 'Analytical balances'],
      interestingFacts: [
        'Even minor friction at the pivot can cause the pendulum to swing in an ellipse instead of a straight line.'
      ],
      connections: ['pivot']
    },
    /* ── 5. Base Platform ── */
    {
      id: 'base-platform',
      name: 'Graduated Dial Base',
      scientificName: 'Base Platform with Azimuthal Ring',
      assembledPosition: [0, -1.8, 0],
      explodedOffset: [0, -3.5, 0],
      assembledRotation: [0, 0, 0],
      color: '#1E293B',
      metalness: 0.7,
      roughness: 0.35,
      function: 'The circular base plate marked with degrees (azimuthal ring) and pins that are knocked over as the pendulum’s plane appears to rotate.',
      workingPrinciple: 'Shows the progression of the pendulum\'s plane of swing over time relative to the floor.',
      physicsConcept: 'Coriolis effect / Earth\'s rotation — angular speed of rotation depends on latitude: ω = Ω sin(λ).',
      realWorldApps: ['Compasses', 'Sun dials', 'Astronomical coordinate plates'],
      interestingFacts: [
        'At the North or South Pole, the pendulum completes a full circle in 24 hours. At the Equator, the plane doesn\'t rotate at all.',
        'At Paris latitude, it rotates at about 11.3 degrees per hour, completing a rotation in ~31.8 hours.'
      ],
      formula: '\\omega = 15^\\circ/\\text{hour} \\times \\sin(\\lambda)',
      connections: ['suspension-cable']
    }
  ]
};

export default foucaultPendulum;
