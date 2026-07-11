import { ExplodableObjectData } from './componentRegistry';

const gyroscope: ExplodableObjectData = {
  id: 'gyroscope',
  name: 'Gyroscope',
  description:
    'A precision instrument demonstrating angular momentum conservation. Explore the gimbal rings, rotor, and bearings that enable its extraordinary stability.',
  category: 'Mechanics',
  color: '#10B981',
  cameraPosition: [3, 2, 5],
  explodedCameraPosition: [5, 4, 9],
  lightIntensityBoost: 0.35,
  components: [
    /* ── 1. Outer Ring ── */
    {
      id: 'outer-ring',
      name: 'Outer Ring',
      scientificName: 'Outer Gimbal',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, 4, 0],
      assembledRotation: [0, 0, 0],
      color: '#475569',
      metalness: 0.85,
      roughness: 0.15,
      function: 'The outermost ring of the gimbal system. It connects to the support frame and allows the gyroscope to rotate freely about one axis.',
      workingPrinciple: 'The outer gimbal provides one degree of rotational freedom. Combined with the middle gimbal, it allows the rotor axis to point in any direction.',
      physicsConcept: 'Degrees of freedom — each gimbal ring adds one rotational degree of freedom.',
      realWorldApps: ['Smartphone screen rotation', 'Ship stabilizers', 'Camera gimbals'],
      interestingFacts: [
        'The word "gimbal" comes from the Latin "gemellus," meaning twin.',
        'Three-axis gimbals can suffer from gimbal lock when two axes align.',
      ],
      connections: ['middle-ring', 'bearings'],
    },

    /* ── 2. Middle Ring ── */
    {
      id: 'middle-ring',
      name: 'Middle Ring',
      scientificName: 'Middle Gimbal',
      assembledPosition: [0, 0, 0],
      explodedOffset: [3, 2, 0],
      assembledRotation: [0, 0, Math.PI / 2],
      color: '#64748B',
      metalness: 0.85,
      roughness: 0.15,
      function: 'The second gimbal ring, nested inside the outer ring. It provides the second degree of rotational freedom.',
      workingPrinciple: 'Mounted perpendicular to the outer ring\'s rotation axis. Together they decouple the inner rotor from the frame\'s orientation.',
      physicsConcept: 'Gimbal lock — when the middle and outer ring axes align, one degree of freedom is lost.',
      realWorldApps: ['Inertial navigation systems', 'Telescope mounts', '3D animation rigs'],
      interestingFacts: [
        'Apollo 13 nearly experienced gimbal lock. Astronauts had to manually realign the navigation platform.',
      ],
      connections: ['outer-ring', 'inner-ring'],
    },

    /* ── 3. Inner Ring ── */
    {
      id: 'inner-ring',
      name: 'Inner Ring',
      scientificName: 'Inner Gimbal / Rotor Housing',
      assembledPosition: [0, 0, 0],
      explodedOffset: [-3, 0, 2],
      assembledRotation: [Math.PI / 2, 0, 0],
      color: '#94A3B8',
      metalness: 0.85,
      roughness: 0.15,
      function: 'The innermost ring that directly holds the rotor shaft. It provides the third degree of freedom.',
      workingPrinciple: 'The inner ring\'s axis is aligned with the rotor\'s spin axis. Angular momentum keeps the rotor axis stable regardless of outer ring orientation.',
      physicsConcept: 'Conservation of angular momentum — L = Iω remains constant when no external torque acts.',
      realWorldApps: ['Attitude control in spacecraft', 'Gyrocompasses on submarines'],
      interestingFacts: [
        'A three-gimbal gyroscope can maintain its orientation in any direction — it acts as an artificial horizon.',
      ],
      formula: 'L = I\\omega',
      connections: ['middle-ring', 'rotor', 'shaft'],
    },

    /* ── 4. Rotor ── */
    {
      id: 'rotor',
      name: 'Rotor',
      scientificName: 'Flywheel / Spinning Mass',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, -3, -3],
      assembledRotation: [0, 0, 0],
      color: '#F59E0B',
      emissiveColor: '#FBBF24',
      metalness: 0.9,
      roughness: 0.1,
      function: 'The heavy, rapidly spinning disc at the center. Its angular momentum is what gives the gyroscope its remarkable stability.',
      workingPrinciple: 'A massive disc spun at high speed (10,000+ RPM) stores a large angular momentum vector L = Iω. Precession occurs when an external torque is applied.',
      physicsConcept: 'Gyroscopic precession — applying a torque perpendicular to the spin axis causes the axis to rotate (precess) rather than tilt.',
      realWorldApps: ['Reaction wheels in satellites', 'Flywheel energy storage', 'Motorcycle stability'],
      interestingFacts: [
        'A bicycle stays upright partly due to the gyroscopic effect of its spinning wheels.',
        'The faster the rotor spins, the stronger the gyroscopic resistance to tilting.',
      ],
      formula: '\\Omega_{\\text{prec}} = \\frac{\\tau}{L} = \\frac{mgr}{I\\omega}',
      connections: ['shaft', 'inner-ring'],
    },

    /* ── 5. Shaft ── */
    {
      id: 'shaft',
      name: 'Shaft',
      scientificName: 'Axle / Spin Axis',
      assembledPosition: [0, 0, 0],
      explodedOffset: [4, -1, 0],
      assembledRotation: [0, 0, 0],
      color: '#CBD5E1',
      metalness: 0.95,
      roughness: 0.08,
      function: 'The central axle around which the rotor spins. It transmits the angular momentum vector direction.',
      workingPrinciple: 'A precision-ground steel rod supported by bearings. The shaft defines the spin axis — the direction of the angular momentum vector.',
      physicsConcept: 'Rotational axis — the shaft\'s direction is the direction of the angular momentum vector L.',
      realWorldApps: ['Motor shafts', 'Turbine axles', 'Drill bits'],
      interestingFacts: [
        'Precision gyroscope shafts are ground to tolerances of 0.001 mm to minimize wobble.',
      ],
      connections: ['rotor', 'bearings'],
    },

    /* ── 6. Bearings ── */
    {
      id: 'bearings',
      name: 'Bearings',
      scientificName: 'Precision Ball Bearings',
      assembledPosition: [0, 0, 0],
      explodedOffset: [-4, -2, -1],
      assembledRotation: [0, 0, 0],
      color: '#E2E8F0',
      metalness: 0.95,
      roughness: 0.05,
      function: 'Low-friction support elements at each pivot point. They allow the gimbal rings and rotor shaft to rotate freely.',
      workingPrinciple: 'Steel balls roll between inner and outer races, converting sliding friction into much lower rolling friction.',
      physicsConcept: 'Rolling friction — μ_rolling ≪ μ_sliding. Bearings reduce energy loss to enable free rotation.',
      realWorldApps: ['Skateboard wheels', 'Hard drives', 'Wind turbines', 'Jet engines'],
      interestingFacts: [
        'The best gyroscope bearings use ceramic (silicon nitride) balls that weigh 60% less than steel and can spin at 500,000 RPM.',
        'Leonardo da Vinci sketched bearing designs in the 15th century.',
      ],
      formula: 'F_{\\text{friction}} = \\mu_r \\cdot N',
      connections: ['shaft', 'outer-ring'],
    },
  ],
};

export default gyroscope;
