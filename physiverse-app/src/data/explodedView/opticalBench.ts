import { ExplodableObjectData } from './componentRegistry';

const opticalBench: ExplodableObjectData = {
  id: 'optical-bench',
  name: 'Optical Bench',
  description:
    'An apparatus used for measuring focal lengths and studying interference and diffraction. Explore the rail, scale, lenses, prisms, mounts, and laser source.',
  category: 'Optics',
  color: '#8B5CF6',
  cameraPosition: [4, 2, 5],
  explodedCameraPosition: [6, 4, 8],
  lightIntensityBoost: 0.3,
  components: [
    /* ── 1. Optical Rail ── */
    {
      id: 'optical-rail',
      name: 'Optical Rail',
      scientificName: 'Rigid Optical Track / Bed',
      assembledPosition: [0, -0.4, 0],
      explodedOffset: [0, -2, 0],
      assembledRotation: [0, 0, 0],
      color: '#334155',
      metalness: 0.9,
      roughness: 0.15,
      function: 'A straight, heavy metal track upon which optical components are mounted and moved.',
      workingPrinciple: 'Ensures that all components (lenses, mirrors, lasers) remain perfectly aligned along a single linear optical axis.',
      physicsConcept: 'Collinearity and linear alignment.',
      realWorldApps: ['Industrial laser rails', 'Lathe beds', 'Camera sliders'],
      interestingFacts: [
        'To prevent thermal expansion from distorting alignment, high-precision rails are made of Invar, a nickel-iron alloy.'
      ],
      connections: ['measuring-scale', 'mirror-mounts']
    },
    /* ── 2. Measuring Scale ── */
    {
      id: 'measuring-scale',
      name: 'Measuring Scale',
      scientificName: 'Linear Metric Ruler Plate',
      assembledPosition: [0, -0.3, 0.45],
      explodedOffset: [0, -2, 1.5],
      assembledRotation: [0, 0, 0],
      color: '#CBD5E1',
      metalness: 0.7,
      roughness: 0.3,
      function: 'A graduated scale running along the rail used to measure the precise distances between optical components.',
      workingPrinciple: 'Provides a reference measurement in millimeters or centimeters to calculate focal points and image distances.',
      physicsConcept: 'Spatial measurements and metric standards.',
      realWorldApps: ['Calipers', 'Precision drafting boards', 'CNC linear encoders'],
      interestingFacts: [
        'Accurate measurements of u (object distance) and v (image distance) are required to determine a lens\'s focal length.'
      ],
      connections: ['optical-rail']
    },
    /* ── 3. Convex Lens ── */
    {
      id: 'convex-lens',
      name: 'Convex Lens',
      scientificName: 'Double Convex Converging Lens',
      assembledPosition: [-0.6, 0.2, 0],
      explodedOffset: [-1.5, 2, -1],
      assembledRotation: [0, Math.PI / 2, 0],
      color: '#93C5FD',
      metalness: 0.1,
      roughness: 0.05,
      function: 'A lens that curves outward, gathering divergent light rays and converging them to a real focal point.',
      workingPrinciple: 'Refracts light towards the center axis. Used to produce real magnified images on a screen.',
      physicsConcept: 'Light convergence and thin lens equation.',
      realWorldApps: ['Magnifying glasses', 'Eye glasses for farsightedness', 'Projectors'],
      interestingFacts: [
        'A convex lens acts like a magnifying glass for close objects, but creates an upside-down real image for distant objects.'
      ],
      formula: '\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}',
      connections: ['mirror-mounts']
    },
    /* ── 4. Concave Lens ── */
    {
      id: 'concave-lens',
      name: 'Concave Lens',
      scientificName: 'Double Concave Diverging Lens',
      assembledPosition: [-0.1, 0.2, 0],
      explodedOffset: [-0.5, 2, 1],
      assembledRotation: [0, Math.PI / 2, 0],
      color: '#93C5FD',
      metalness: 0.1,
      roughness: 0.05,
      function: 'A lens that curves inward, causing incoming parallel light rays to spread out (diverge).',
      workingPrinciple: 'Refracts light away from the central axis. Its focal point is virtual, located on the incoming light side.',
      physicsConcept: 'Light divergence and virtual image formation.',
      realWorldApps: ['Glasses for nearsightedness', 'Laser beam expanders', 'Peepholes'],
      interestingFacts: [
        'Concave lenses always form virtual, upright, and diminished images, regardless of the object\'s position.'
      ],
      connections: ['mirror-mounts']
    },
    /* ── 5. Prism ── */
    {
      id: 'prism',
      name: 'Equilateral Prism',
      scientificName: 'Dispersive Glass Prism',
      assembledPosition: [0.4, 0.2, 0],
      explodedOffset: [0.5, 2, -1],
      assembledRotation: [0, 0, 0],
      color: '#60A5FA',
      metalness: 0.2,
      roughness: 0.05,
      function: 'A triangular glass component used to refract and disperse light into its constituent spectral colors.',
      workingPrinciple: 'Refractive index depends on wavelength (dispersion). Shorter wavelengths (violet) bend more than longer wavelengths (red).',
      physicsConcept: 'Dispersion, Refraction, and Snell\'s Law.',
      realWorldApps: ['Spectrometers', 'Spectrophotometers', 'Prism binoculars'],
      interestingFacts: [
        'Sir Isaac Newton used a prism in 1666 to prove that white light is composed of a spectrum of colors.'
      ],
      formula: 'n(\\lambda) = A + \\frac{B}{\\lambda^2}',
      connections: ['mirror-mounts']
    },
    /* ── 6. Laser Source ── */
    {
      id: 'laser-source',
      name: 'Laser Source',
      scientificName: 'Helium-Neon / Diode Laser',
      assembledPosition: [1.2, 0.2, 0],
      explodedOffset: [2, 1.5, 0],
      assembledRotation: [0, -Math.PI / 2, 0],
      color: '#EF4444',
      emissiveColor: '#F87171',
      metalness: 0.7,
      roughness: 0.2,
      function: 'Provides a highly coherent, monochromatic, and collimated light beam for experiments.',
      workingPrinciple: 'Light Amplification by Stimulated Emission of Radiation creates a single wavelength beam with minimal divergence.',
      physicsConcept: 'Coherence, population inversion, and stimulated emission.',
      realWorldApps: ['Bar code scanners', 'Laser levels', 'Fiber optic communications'],
      interestingFacts: [
        'Lasers are monochromatic (one color) and coherent (all waves line up in phase), unlike normal light sources like light bulbs.'
      ],
      formula: 'E = hf',
      connections: ['optical-rail']
    },
    /* ── 7. Mirror Mounts ── */
    {
      id: 'mirror-mounts',
      name: 'Component Mounts / Holders',
      scientificName: 'Adjustable Post Holders',
      assembledPosition: [-0.6, -0.15, 0],
      explodedOffset: [-2, -0.5, -2],
      assembledRotation: [0, 0, 0],
      color: '#475569',
      metalness: 0.85,
      roughness: 0.2,
      function: 'Clamps with adjustable vertical posts that slide along the rail and hold the optical components in place.',
      workingPrinciple: 'Uses thumb-screws and spring-loaded adjustments to secure and align lenses at the correct optical height.',
      physicsConcept: 'Mechanical degree of freedom constraints.',
      realWorldApps: ['Laboratory setups', 'Photography tripods', 'Micro-positioners'],
      interestingFacts: [
        'Modern mounts have micrometer adjusters that can tilt a lens by fractions of a degree.'
      ],
      connections: ['optical-rail', 'convex-lens', 'concave-lens', 'prism']
    }
  ]
};

export default opticalBench;
