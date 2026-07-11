import { ExplodableObjectData } from './componentRegistry';

const particleDetector: ExplodableObjectData = {
  id: 'particle-detector',
  name: 'Particle Detector',
  description:
    'An instrument used to detect, track, and identify subatomic particles produced in high-energy collisions. Explore the tracker, calorimeter, magnet, and muon chambers.',
  category: 'Modern Physics',
  color: '#A855F7',
  cameraPosition: [4, 3, 5],
  explodedCameraPosition: [6, 5, 9],
  lightIntensityBoost: 0.3,
  components: [
    /* ── 1. Detector Layers ── */
    {
      id: 'detector-layers',
      name: 'Outer Detector Layers',
      scientificName: 'Concentric Detection Cylinders',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, 4, 0],
      assembledRotation: [0, 0, 0],
      color: '#475569',
      metalness: 0.7,
      roughness: 0.3,
      function: 'Concentric shells that contain the active sensing material. Particles travel radially outwards through these layers.',
      workingPrinciple: 'Arranges different detector technologies in nested cylinders to measure particle properties sequentially.',
      physicsConcept: 'Radial trajectory and collision geometry.',
      realWorldApps: ['CMS detector at CERN', 'ATLAS detector', 'Cosmic ray telescopes'],
      interestingFacts: [
        'Detector layers are arranged like onion skins around the collision point so that every particle passes through each layer.'
      ],
      connections: ['silicon-tracker', 'support-structure']
    },
    /* ── 2. Silicon Tracker ── */
    {
      id: 'silicon-tracker',
      name: 'Silicon Tracker',
      scientificName: 'Inner Silicon Pixel/Strip Detector',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, 0, 3],
      assembledRotation: [0, 0, 0],
      color: '#3B82F6',
      emissiveColor: '#60A5FA',
      metalness: 0.9,
      roughness: 0.1,
      function: 'The innermost tracking layer that records the exact 3D path of charged particles immediately after the collision.',
      workingPrinciple: 'Charged particles passing through silicon sensors create tiny electrical signals (electron-hole pairs) that locate their position to within micrometers.',
      physicsConcept: 'Semiconductor ionization and charge collection.',
      realWorldApps: ['Camera image sensors', 'Medical radiation imaging', 'Dosimeters'],
      interestingFacts: [
        'The silicon tracker in CMS contains 75 million individual pixel sensors to handle thousands of particle tracks simultaneously.'
      ],
      connections: ['detector-layers', 'calorimeter']
    },
    /* ── 3. Calorimeter ── */
    {
      id: 'calorimeter',
      name: 'Calorimeter (ECAL & HCAL)',
      scientificName: 'Electromagnetic & Hadronic Calorimeter',
      assembledPosition: [0, 0, 0],
      explodedOffset: [3, 2, 0],
      assembledRotation: [0, 0, 0],
      color: '#EC4899',
      metalness: 0.5,
      roughness: 0.4,
      function: 'Measures the energy of particles by absorbing them completely and converting their kinetic energy into light or charge.',
      workingPrinciple: 'Dense materials (like lead tungstate or brass) cause particles to shower, and scintillating materials measure the energy of these showers.',
      physicsConcept: 'Electromagnetic showers and ionization loss.',
      realWorldApps: ['Radiation therapy monitoring', 'Space radiation detectors', 'Airport scanners'],
      interestingFacts: [
        'ECAL measures electrons and photons, while HCAL measures hadrons (protons, neutrons, pions). Most particles stop here, except muons and neutrinos.'
      ],
      connections: ['silicon-tracker', 'solenoid-magnet']
    },
    /* ── 4. Solenoid Magnet ── */
    {
      id: 'solenoid-magnet',
      name: 'Solenoid Magnet',
      scientificName: 'Superconducting Solenoid Magnet',
      assembledPosition: [0, 0, 0],
      explodedOffset: [-3, 2, 0],
      assembledRotation: [0, 0, 0],
      color: '#F59E0B',
      metalness: 0.95,
      roughness: 0.15,
      function: 'A massive superconducting coil that generates a powerful magnetic field parallel to the beam line.',
      workingPrinciple: 'Circulates high electric current without resistance, bending the path of charged particles. The direction and curvature of the path reveal charge and momentum.',
      physicsConcept: 'Lorentz Force — charged particles curve in a magnetic field: F = q(v × B).',
      realWorldApps: ['MRI scanners', 'Maglev trains', 'Fusion reactor coils'],
      interestingFacts: [
        'The solenoid in the CMS detector at CERN generates a magnetic field of 3.8 Tesla, about 100,000 times stronger than Earth\'s magnetic field.'
      ],
      formula: '\\mathbf{F} = q(\\mathbf{v} \\times \\mathbf{B})',
      connections: ['calorimeter', 'muon-chambers']
    },
    /* ── 5. Muon Chambers ── */
    {
      id: 'muon-chambers',
      name: 'Muon Chambers',
      scientificName: 'Outer Muon Spectrometer',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, -4, 2.5],
      assembledRotation: [0, 0, 0],
      color: '#10B981',
      metalness: 0.6,
      roughness: 0.3,
      function: 'The outermost tracking chambers designed specifically to track muons, which pass through all previous layers easily.',
      workingPrinciple: 'Uses gas-filled drift tubes or cathode strip chambers. Muons ionize the gas, and the resulting electric discharge is recorded.',
      physicsConcept: 'Gas ionization and drift-time measurements.',
      realWorldApps: ['Cosmic ray muon tomography (scanning pyramids/volcanoes)', 'Homeland security scanners'],
      interestingFacts: [
        'Muons behave like heavy electrons. Because they do not interact via the strong nuclear force and are relatively heavy, they are highly penetrating.'
      ],
      connections: ['solenoid-magnet']
    },
    /* ── 6. Support Structure ── */
    {
      id: 'support-structure',
      name: 'Support Structure',
      scientificName: 'Mechanical Cradle & Girders',
      assembledPosition: [0, -1.5, 0],
      explodedOffset: [0, -4, 0],
      assembledRotation: [0, 0, 0],
      color: '#1E293B',
      metalness: 0.85,
      roughness: 0.2,
      function: 'The structural framework that holds all detector layers in precise alignment and supports their massive weight.',
      workingPrinciple: 'Provides rigid steel structures capable of supporting thousands of tons of instrumentation without bending.',
      physicsConcept: 'Structural engineering and statics.',
      realWorldApps: ['Industrial crane bases', 'Building frames', 'Aerospace brackets'],
      interestingFacts: [
        'The ATLAS detector at CERN weighs 7,000 tonnes — equivalent to the Eiffel Tower, but held to a positioning accuracy of fractions of a millimeter.'
      ],
      connections: ['detector-layers']
    }
  ]
};

export default particleDetector;
