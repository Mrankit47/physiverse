import { ExplodableObjectData } from './componentRegistry';

const generator: ExplodableObjectData = {
  id: 'generator',
  name: 'Electromagnetic Generator',
  description:
    'A device that converts mechanical energy into electrical energy using electromagnetic induction. Explore the rotor, stator, coils, magnets, housing, and bearings.',
  category: 'Electromagnetism',
  color: '#EF4444',
  cameraPosition: [3, 2, 5],
  explodedCameraPosition: [5, 4, 8],
  lightIntensityBoost: 0.4,
  components: [
    /* ── 1. Rotor ── */
    {
      id: 'rotor',
      name: 'Rotor Assembly',
      scientificName: 'Armature / Rotating Element',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, 0, 3],
      assembledRotation: [0, 0, 0],
      color: '#475569',
      metalness: 0.9,
      roughness: 0.15,
      function: 'The moving component of the generator. It rotates within the stator to create a changing magnetic field relative to the stator coils.',
      workingPrinciple: 'Spins relative to stator, carrying the permanent magnets or electromagnets to generate a moving magnetic field.',
      physicsConcept: 'Mechanical rotation and relative motion.',
      realWorldApps: ['Wind turbine hubs', 'Steam turbine spindles', 'Electric motor cores'],
      interestingFacts: [
        'The rotor must be dynamically balanced to high precision to prevent severe vibrations at high speeds.'
      ],
      connections: ['shaft', 'permanent-magnets']
    },
    /* ── 2. Stator ── */
    {
      id: 'stator',
      name: 'Stator Core',
      scientificName: 'Stationary Armature Core',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, 3, 0],
      assembledRotation: [0, 0, 0],
      color: '#1E293B',
      metalness: 0.8,
      roughness: 0.3,
      function: 'The stationary outer shell containing slots for the copper coils. It provides a path for magnetic flux.',
      workingPrinciple: 'Constructed from thin laminated steel sheets (silicon steel) to guide the magnetic field and reduce eddy current losses.',
      physicsConcept: 'Magnetic permeability and reduction of eddy currents.',
      realWorldApps: ['Electric generators', 'Industrial alternators', 'Transformers'],
      interestingFacts: [
        'Stator cores are laminated (made of thin sheets) rather than solid metal to prevent circulating currents that generate heat.'
      ],
      connections: ['copper-coils', 'housing']
    },
    /* ── 3. Copper Coils ── */
    {
      id: 'copper-coils',
      name: 'Copper Coils',
      scientificName: 'Stator Winding Assembly',
      assembledPosition: [0, 0.05, 0],
      explodedOffset: [0, 4, 1.5],
      assembledRotation: [0, 0, 0],
      color: '#B45309',
      metalness: 0.95,
      roughness: 0.1,
      function: 'Loops of insulated copper wire wound inside the stator core where electrical current is induced.',
      workingPrinciple: 'As the magnetic flux from the rotor sweeps across these coils, an electromotive force (EMF) is induced according to Faraday\'s Law.',
      physicsConcept: 'Faraday\'s Law of Induction & Lenz\'s Law.',
      realWorldApps: ['Power grid alternators', 'Dynamos', 'Wireless chargers'],
      interestingFacts: [
        'High-purity oxygen-free copper is used to minimize electrical resistance and maximize efficiency.',
        'Lenz\'s Law explains that the induced current creates a magnetic field that opposes the motion that created it.'
      ],
      formula: '\\mathcal{E} = -N \\frac{d\\Phi_B}{dt}',
      connections: ['stator']
    },
    /* ── 4. Permanent Magnets ── */
    {
      id: 'permanent-magnets',
      name: 'Permanent Magnets',
      scientificName: 'Rotor Field Magnets (Neodymium)',
      assembledPosition: [0, -0.05, 0],
      explodedOffset: [2.5, 0.5, 2.5],
      assembledRotation: [0, 0, 0],
      color: '#3B82F6',
      emissiveColor: '#60A5FA',
      metalness: 0.85,
      roughness: 0.2,
      function: 'High-strength magnets mounted on the rotor that produce the magnetic field.',
      workingPrinciple: 'Generates a strong, uniform magnetic field. As they rotate, they change the magnetic flux passing through the stator copper coils.',
      physicsConcept: 'Magnetic dipoles and field lines.',
      realWorldApps: ['Hard drive actuators', 'MRI scanners', 'Direct-drive wind generators'],
      interestingFacts: [
        'Modern wind turbines use Neodymium-Iron-Boron (NdFeB) magnets, which are the strongest commercial permanent magnets available.'
      ],
      formula: '\\mathbf{B} = \\nabla \\times \\mathbf{A}',
      connections: ['rotor']
    },
    /* ── 5. Shaft ── */
    {
      id: 'shaft',
      name: 'Central Shaft',
      scientificName: 'Generator Axle / Spindle',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, 0, -3],
      assembledRotation: [0, 0, 0],
      color: '#CBD5E1',
      metalness: 0.95,
      roughness: 0.08,
      function: 'The steel rod running through the center of the rotor that transmits rotational torque from an external source (turbine, engine).',
      workingPrinciple: 'Coupled to an external mechanical driver, it converts mechanical input into rotational motion of the rotor.',
      physicsConcept: 'Torque (τ = r × F) and rotational dynamics.',
      realWorldApps: ['Automotive drive axles', 'Jet engine turbine shafts', 'Pumps'],
      interestingFacts: [
        'The shaft is subjected to high torsional stress and must be engineered to resist fatigue over millions of revolutions.'
      ],
      formula: '\\tau = I\\alpha',
      connections: ['rotor', 'bearings']
    },
    /* ── 6. Bearings ── */
    {
      id: 'bearings',
      name: 'Rotor Bearings',
      scientificName: 'Ball / Journal Bearings',
      assembledPosition: [0, 0, 0],
      explodedOffset: [-3, -2, 0],
      assembledRotation: [0, 0, 0],
      color: '#94A3B8',
      metalness: 0.95,
      roughness: 0.05,
      function: 'Low-friction supports that hold the rotating shaft in place within the housing.',
      workingPrinciple: 'Uses balls or rollers to minimize rotational friction, ensuring maximum mechanical energy is converted to electricity.',
      physicsConcept: 'Frictional dissipation reduction.',
      realWorldApps: ['Electric motors', 'Vehicular wheel hubs', 'Industrial fans'],
      interestingFacts: [
        'Bearing failure is the most common cause of generator breakdowns, usually due to lack of lubrication or overheating.'
      ],
      connections: ['shaft', 'housing']
    },
    /* ── 7. Housing ── */
    {
      id: 'housing',
      name: 'Housing & Enclosure',
      scientificName: 'Generator Frame / Yoke',
      assembledPosition: [0, 0, 0],
      explodedOffset: [-4, 0, 0],
      assembledRotation: [0, 0, 0],
      color: '#334155',
      metalness: 0.8,
      roughness: 0.25,
      function: 'The external casing that protects internal components from dirt, moisture, and impact, and mounts the stator.',
      workingPrinciple: 'Provides structural support and redirects thermal energy away from the stator to the external cooling fins.',
      physicsConcept: 'Physical protection and mechanical containment.',
      realWorldApps: ['Engine blocks', 'Gearboxes', 'Motor frames'],
      interestingFacts: [
        'Often made of cast iron or aluminum alloys to provide strength while remaining relatively light and corrosion-resistant.'
      ],
      connections: ['stator', 'cooling-components']
    },
    /* ── 8. Cooling Components ── */
    {
      id: 'cooling-components',
      name: 'Cooling Fan & Fins',
      scientificName: 'Thermal Management System',
      assembledPosition: [0, 0, -1.2],
      explodedOffset: [0, -3, -2.5],
      assembledRotation: [0, 0, 0],
      color: '#60A5FA',
      metalness: 0.5,
      roughness: 0.4,
      function: 'Fins on the housing or a fan attached to the shaft that dissipates heat generated by electrical resistance (Joule heating).',
      workingPrinciple: 'Increases the surface area of the housing to accelerate thermal convection, drawing cold air over the stator.',
      physicsConcept: 'Joule heating (P = I²R) and Thermal Convection.',
      realWorldApps: ['CPU heatsinks', 'Car radiators', 'Air-cooled motorcycle engines'],
      interestingFacts: [
        'Large power plant generators use liquid hydrogen or water circulating inside hollow stator windings for cooling because of hydrogen\'s high thermal conductivity.'
      ],
      formula: 'P_{\\text{loss}} = I^2 R',
      connections: ['housing']
    }
  ]
};

export default generator;
