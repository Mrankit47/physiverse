import { ExplodableObjectData } from './componentRegistry';

const laserSetup: ExplodableObjectData = {
  id: 'laser-setup',
  name: 'Laser Setup',
  description:
    'An advanced laser optics system designed for interferometry and beam profiling. Explore the diode, expander, mirrors, splitter, filter, lenses, and detector.',
  category: 'Optics',
  color: '#EC4899',
  cameraPosition: [4, 2, 5],
  explodedCameraPosition: [6, 4, 8],
  lightIntensityBoost: 0.3,
  components: [
    /* ── 1. Laser Diode ── */
    {
      id: 'laser-diode',
      name: 'Laser Diode',
      scientificName: 'Monochromatic Semiconductor Laser',
      assembledPosition: [-1.4, 0.2, 0],
      explodedOffset: [-3.5, 0.5, 0],
      assembledRotation: [0, Math.PI / 2, 0],
      color: '#EC4899',
      emissiveColor: '#F472B6',
      metalness: 0.7,
      roughness: 0.25,
      function: 'The primary light source that generates a concentrated, coherent beam of light via semiconductor technology.',
      workingPrinciple: 'A forward-biased p-n junction emits coherent light through stimulated emission in a resonant optical cavity.',
      physicsConcept: 'Semiconductor bandgap energy and stimulated emission.',
      realWorldApps: ['Laser pointers', 'Barcode scanners', 'CD/DVD drives'],
      interestingFacts: [
        'Semiconductor laser diodes are the most common type of laser due to their compact size and high efficiency.'
      ],
      formula: '\\lambda = \\frac{hc}{E_g}',
      connections: ['beam-expander']
    },
    /* ── 2. Beam Expander ── */
    {
      id: 'beam-expander',
      name: 'Beam Expander',
      scientificName: 'Keplerian Beam Expander',
      assembledPosition: [-0.8, 0.2, 0],
      explodedOffset: [-1.8, 2, -1],
      assembledRotation: [0, Math.PI / 2, 0],
      color: '#475569',
      metalness: 0.8,
      roughness: 0.2,
      function: 'A system of lenses that increases the diameter of the laser beam while keeping it parallel (collimated).',
      workingPrinciple: 'Consists of a short focal length lens followed by a long focal length lens separated by the sum of their focal lengths.',
      physicsConcept: 'Collimation and angular magnification.',
      realWorldApps: ['LIDAR systems', 'Laser cutting machines', 'Long-range telescopes'],
      interestingFacts: [
        'Expanding a laser beam decreases its power density (irradiance), protecting down-line optics, and reduces its divergence over long distances.'
      ],
      formula: 'MP = \\frac{f_2}{f_1}',
      connections: ['laser-diode', 'mirrors']
    },
    /* ── 3. Mirrors ── */
    {
      id: 'mirrors',
      name: 'Steering Mirrors',
      scientificName: 'Dielectric High-Reflectivity Mirrors',
      assembledPosition: [-0.2, 0.2, 0],
      explodedOffset: [0, 2.5, 1.5],
      assembledRotation: [0, Math.PI / 4, 0],
      color: '#94A3B8',
      metalness: 0.95,
      roughness: 0.05,
      function: 'Flat mirrors used to redirect the expanded laser beam into different parts of the system with minimal loss.',
      workingPrinciple: 'Thin layers of dielectric material reflect specific wavelengths of light up to 99.9% efficiency via constructive interference.',
      physicsConcept: 'Law of Reflection — Angle of incidence equals angle of reflection (θ_i = θ_r).',
      realWorldApps: ['Interferometers', 'Optical cavities', 'Laser printers'],
      interestingFacts: [
        'Unlike bathroom mirrors, laser mirrors reflect light from the front surface to prevent double-reflections (ghosting).'
      ],
      connections: ['beam-expander', 'beam-splitter']
    },
    /* ── 4. Beam Splitter ── */
    {
      id: 'beam-splitter',
      name: 'Beam Splitter',
      scientificName: 'Half-Silvered Mirror / Splitter Cube',
      assembledPosition: [0.3, 0.2, 0],
      explodedOffset: [0.5, 2, -1.5],
      assembledRotation: [0, 0, 0],
      color: '#60A5FA',
      metalness: 0.3,
      roughness: 0.1,
      function: 'An optical device that splits a single incoming laser beam into two separate beams (reflected and transmitted).',
      workingPrinciple: 'A cube made of two triangular glass prisms glued together. The diagonal interface is coated to reflect 50% of the light and transmit 50%.',
      physicsConcept: 'Amplitude division and partial reflection.',
      realWorldApps: ['Michelson interferometers', 'Laser rangefinders', 'Head-up displays'],
      interestingFacts: [
        'Beam splitters are crucial for holography, where one beam illuminates the object and the other acts as a reference.'
      ],
      connections: ['mirrors', 'optical-filter']
    },
    /* ── 5. Optical Filter ── */
    {
      id: 'optical-filter',
      name: 'Optical Filter',
      scientificName: 'Neutral Density / Bandpass Filter',
      assembledPosition: [0.7, 0.2, 0],
      explodedOffset: [1.2, 2, 1],
      assembledRotation: [0, Math.PI / 2, 0],
      color: '#1E293B',
      metalness: 0.4,
      roughness: 0.3,
      function: 'Filters light to selectively transmit certain wavelengths or reduce the overall beam intensity.',
      workingPrinciple: 'Absorbs or reflects specific portions of the spectrum using dyed glass or thin-film interference.',
      physicsConcept: 'Spectral absorption and thin-film interference.',
      realWorldApps: ['Spectroscopy', 'Fluorescence microscopy', 'Photography filters'],
      interestingFacts: [
        'Neutral density filters reduce all colors equally, acting like sunglasses for lasers.'
      ],
      formula: 'I = I_0 e^{-\\alpha x}',
      connections: ['beam-splitter', 'lens-assembly']
    },
    /* ── 6. Lens Assembly ── */
    {
      id: 'lens-assembly',
      name: 'Focusing Lens Assembly',
      scientificName: 'Doublet Lens System',
      assembledPosition: [1.1, 0.2, 0],
      explodedOffset: [2, 1.5, -1],
      assembledRotation: [0, Math.PI / 2, 0],
      color: '#93C5FD',
      metalness: 0.1,
      roughness: 0.05,
      function: 'Focuses the parallel laser beam down to a microscopic spot on the detector.',
      workingPrinciple: 'Refracts light rays towards a single point, maximizing power density at the focus.',
      physicsConcept: 'Refraction and focal point concentration.',
      realWorldApps: ['Laser engraving heads', 'CD reader pickups', 'Fiber couplers'],
      interestingFacts: [
        'An achromatic doublet lens uses two different glass types to focus red and blue light to the exact same point.'
      ],
      connections: ['optical-filter', 'detector']
    },
    /* ── 7. Detector ── */
    {
      id: 'detector',
      name: 'Photodiode Detector',
      scientificName: 'Silicon Photodetector / Power Meter',
      assembledPosition: [1.5, 0.2, 0],
      explodedOffset: [3.5, 0, 0],
      assembledRotation: [0, -Math.PI / 2, 0],
      color: '#10B981',
      metalness: 0.6,
      roughness: 0.3,
      function: 'Measures the power, intensity, or wavelength of the focused laser beam.',
      workingPrinciple: 'Converts incoming photons into electrical current via the photoelectric effect in a silicon p-n junction.',
      physicsConcept: 'Photoelectric effect and photon-to-electron conversion.',
      realWorldApps: ['Solar cells', 'Laser power meters', 'Optical receiver systems'],
      interestingFacts: [
        'The speed of photodiode response is extremely fast, capable of detecting changes in laser intensity in picoseconds.'
      ],
      formula: 'I = \\eta q \\Phi',
      connections: ['lens-assembly']
    }
  ]
};

export default laserSetup;
