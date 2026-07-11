import { ExplodableObjectData } from './componentRegistry';

const atom: ExplodableObjectData = {
  id: 'atom',
  name: 'Floating Atom',
  description:
    'Explore the subatomic world — from electron clouds and orbital shells to the dense nucleus of protons and neutrons.',
  category: 'Modern Physics',
  color: '#3B82F6',
  cameraPosition: [0, 2, 8],
  explodedCameraPosition: [0, 3, 14],
  lightIntensityBoost: 0.3,
  components: [
    /* ── 1. Nucleus ── */
    {
      id: 'nucleus',
      name: 'Nucleus',
      scientificName: 'Atomic Nucleus',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, 0, 0], // stays centered
      assembledRotation: [0, 0, 0],
      color: '#EF4444',
      emissiveColor: '#F87171',
      metalness: 0.2,
      roughness: 0.6,
      function: 'The dense central core of the atom containing protons and neutrons. Holds 99.97% of the atom\'s mass.',
      workingPrinciple: 'The strong nuclear force binds protons and neutrons together, overcoming the electrostatic repulsion between positively charged protons.',
      physicsConcept: 'Strong nuclear force — the strongest of the four fundamental forces, but operates only at femtometer scales (~10⁻¹⁵ m).',
      realWorldApps: ['Nuclear energy', 'PET scans', 'Radiocarbon dating'],
      interestingFacts: [
        'If an atom were the size of a football stadium, the nucleus would be a marble at the center.',
        'The nucleus was discovered by Rutherford in 1911 via his gold foil experiment.',
      ],
      formula: 'E = mc^2',
      connections: ['proton-cluster', 'neutron-cluster'],
    },

    /* ── 2. Proton Cluster ── */
    {
      id: 'proton-cluster',
      name: 'Proton Cluster',
      scientificName: 'Protons (Z = Atomic Number)',
      assembledPosition: [0.15, 0.1, 0.1],
      explodedOffset: [3, 2, 0],
      assembledRotation: [0, 0, 0],
      color: '#EF4444',
      emissiveColor: '#FCA5A5',
      metalness: 0.3,
      roughness: 0.5,
      function: 'Positively charged particles in the nucleus. The number of protons defines the element (atomic number Z).',
      workingPrinciple: 'Protons are composed of three quarks (two up, one down) bound by gluons via the strong force.',
      physicsConcept: 'Quark model — protons are not fundamental; they are composite particles made of quarks.',
      realWorldApps: ['Proton therapy (cancer treatment)', 'Particle accelerators (LHC)'],
      interestingFacts: [
        'A proton is about 1836 times heavier than an electron.',
        'The proton\'s lifetime is estimated to exceed 10³⁴ years.',
      ],
      formula: 'q_p = +1.602 \\times 10^{-19}\\,\\text{C}',
      connections: ['nucleus', 'neutron-cluster'],
    },

    /* ── 3. Neutron Cluster ── */
    {
      id: 'neutron-cluster',
      name: 'Neutron Cluster',
      scientificName: 'Neutrons (N = A − Z)',
      assembledPosition: [-0.15, -0.1, -0.1],
      explodedOffset: [-3, 2, 0],
      assembledRotation: [0, 0, 0],
      color: '#6B7280',
      metalness: 0.3,
      roughness: 0.5,
      function: 'Electrically neutral particles in the nucleus. Along with protons, they form the mass number (A = Z + N).',
      workingPrinciple: 'Neutrons consist of three quarks (one up, two down). They stabilize the nucleus by providing additional strong force without adding electrostatic repulsion.',
      physicsConcept: 'Nuclear stability — the neutron-to-proton ratio determines whether a nucleus is stable or radioactive.',
      realWorldApps: ['Nuclear reactors (neutron moderation)', 'Neutron scattering for material science'],
      interestingFacts: [
        'A free neutron decays into a proton, electron, and antineutrino with a half-life of about 10 minutes.',
        'Isotopes are atoms with the same number of protons but different numbers of neutrons.',
      ],
      formula: 'A = Z + N',
      connections: ['nucleus', 'proton-cluster'],
    },

    /* ── 4. Electron Shells ── */
    {
      id: 'electron-shells',
      name: 'Electron Shells',
      scientificName: 'Principal Energy Levels (n = 1, 2, 3...)',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, -3, 4],
      assembledRotation: [0, 0, 0],
      color: '#3B82F6',
      metalness: 0.1,
      roughness: 0.1,
      function: 'Concentric regions around the nucleus where electrons are most likely to be found. Each shell corresponds to a principal quantum number n.',
      workingPrinciple: 'Quantum mechanics restricts electrons to discrete energy levels. Shells are labeled K, L, M, N... (n = 1, 2, 3, 4...).',
      physicsConcept: 'Quantized energy levels — electrons can only exist in specific orbitals, not between them.',
      realWorldApps: ['LED technology', 'Laser emission', 'Spectroscopy'],
      interestingFacts: [
        'Each shell holds a maximum of 2n² electrons. The first shell holds 2, the second holds 8, etc.',
        'The Bohr model first introduced the concept of electron shells in 1913.',
      ],
      formula: 'E_n = -\\frac{13.6\\,\\text{eV}}{n^2}',
      connections: ['individual-electrons', 'energy-layers'],
    },

    /* ── 5. Individual Electrons ── */
    {
      id: 'individual-electrons',
      name: 'Individual Electrons',
      scientificName: 'Leptons (e⁻)',
      assembledPosition: [2, 0, 0],
      explodedOffset: [4, 0, 3],
      assembledRotation: [0, 0, 0],
      color: '#60A5FA',
      emissiveColor: '#93C5FD',
      metalness: 0.2,
      roughness: 0.3,
      function: 'Negatively charged fundamental particles orbiting the nucleus. They determine chemical bonding and electrical conductivity.',
      workingPrinciple: 'Electrons are held in orbit by the electromagnetic force between their negative charge and the positive nuclear charge.',
      physicsConcept: 'Coulomb\'s law — the attractive force between electron and nucleus: F = kq₁q₂/r².',
      realWorldApps: ['Electronics', 'Electric current', 'Chemical bonding'],
      interestingFacts: [
        'Electrons have wave-particle duality — they behave as both particles and waves.',
        'The electron was discovered by J.J. Thomson in 1897.',
      ],
      formula: 'F = k\\frac{q_1 q_2}{r^2}',
      connections: ['electron-shells', 'orbital-paths'],
    },

    /* ── 6. Orbital Paths ── */
    {
      id: 'orbital-paths',
      name: 'Orbital Paths',
      scientificName: 'Atomic Orbitals (s, p, d, f)',
      assembledPosition: [0, 0, 0],
      explodedOffset: [0, 3, -4],
      assembledRotation: [0, 0, 0],
      color: '#10B981',
      metalness: 0.05,
      roughness: 0.05,
      function: 'The mathematical regions in 3D space where there is a high probability of finding an electron.',
      workingPrinciple: 'Schrödinger\'s wave equation gives the probability density |ψ|² for each orbital shape (s = spherical, p = dumbbell, d = cloverleaf).',
      physicsConcept: 'Quantum mechanical orbitals — defined by quantum numbers n, l, mₗ, mₛ.',
      realWorldApps: ['Molecular orbital theory', 'Chemical bonding predictions', 'Material science'],
      interestingFacts: [
        'An s-orbital is spherical, a p-orbital is dumbbell-shaped, and d-orbitals have complex multi-lobed shapes.',
        'The Heisenberg uncertainty principle means we can never know both the position and momentum of an electron exactly.',
      ],
      formula: '\\hat{H}\\psi = E\\psi',
      connections: ['electron-shells', 'individual-electrons'],
    },

    /* ── 7. Energy Layers ── */
    {
      id: 'energy-layers',
      name: 'Energy Layers',
      scientificName: 'Energy Level Diagram',
      assembledPosition: [0, 0, 0],
      explodedOffset: [-4, -2, -3],
      assembledRotation: [0, 0, 0],
      color: '#F59E0B',
      emissiveColor: '#FBBF24',
      metalness: 0.1,
      roughness: 0.2,
      function: 'Visual representation of the discrete energy levels. Transitions between layers emit or absorb photons.',
      workingPrinciple: 'When an electron drops from a higher to a lower energy level, it emits a photon with energy equal to the difference: ΔE = hν.',
      physicsConcept: 'Photon emission / absorption — the basis of atomic spectroscopy and all light-matter interaction.',
      realWorldApps: ['Neon signs', 'Flame tests', 'Astronomical spectroscopy'],
      interestingFacts: [
        'The hydrogen emission spectrum has specific series: Lyman (UV), Balmer (visible), Paschen (IR).',
        'Each element has a unique spectral fingerprint, like a barcode.',
      ],
      formula: '\\Delta E = h\\nu = \\frac{hc}{\\lambda}',
      connections: ['electron-shells'],
    },
  ],
};

export default atom;
