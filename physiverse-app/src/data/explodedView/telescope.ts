import { ExplodableObjectData } from './componentRegistry';

const telescope: ExplodableObjectData = {
  id: 'telescope',
  name: 'Optical Telescope',
  description:
    'A reflecting telescope (Cassegrain layout) that gathers and focuses light to observe distant astronomical objects. Explore the mirrors, eyepiece, tube, and mount.',
  category: 'Optics',
  color: '#06B6D4',
  cameraPosition: [4, 2, 6],
  explodedCameraPosition: [6, 4, 10],
  lightIntensityBoost: 0.35,
  components: [
    /* ── 1. Tube ── */
    {
      id: 'tube',
      name: 'Optical Tube Assembly',
      scientificName: 'Telescope OTA / Barrel',
      assembledPosition: [0, 0, 0],
      explodedOffset: [2, 0, -1],
      assembledRotation: [0, 0, 0],
      color: '#334155',
      metalness: 0.7,
      roughness: 0.25,
      function: 'The structural tube that holds the mirrors and lenses in precise optical alignment and blocks stray ambient light.',
      workingPrinciple: 'Maintains a sealed, rigid environment. Its interior is painted matte black to absorb reflections that could degrade image contrast.',
      physicsConcept: 'Light shielding and alignment rigidity.',
      realWorldApps: ['Camera lens barrels', 'Spectrograph enclosures', 'Laser guides'],
      interestingFacts: [
        'High-end telescope tubes are often made of carbon fiber because it expands very little when temperatures drop at night.'
      ],
      connections: ['primary-mirror', 'secondary-mirror', 'mount']
    },
    /* ── 2. Primary Mirror ── */
    {
      id: 'primary-mirror',
      name: 'Primary Mirror',
      scientificName: 'Parabolic Primary Reflector',
      assembledPosition: [0, 0, -1.8],
      explodedOffset: [0, 0, -3.5],
      assembledRotation: [0, 0, 0],
      color: '#E2E8F0',
      metalness: 0.95,
      roughness: 0.05,
      function: 'The large curved mirror at the back of the telescope that collects light from distant stars and focuses it forward.',
      workingPrinciple: 'Reflects light rays to converge at a focal point. It has a parabolic shape to avoid spherical aberration.',
      physicsConcept: 'Reflection and focal properties of curved mirrors.',
      realWorldApps: ['Solar concentrators', 'Searchlight reflectors', 'Satellite dishes'],
      interestingFacts: [
        'Astronomical primary mirrors are coated with a micro-layer of aluminum or silver, polished to an accuracy of a fraction of a wavelength of light.'
      ],
      formula: 'f = \\frac{R}{2}',
      connections: ['tube']
    },
    /* ── 3. Secondary Mirror ── */
    {
      id: 'secondary-mirror',
      name: 'Secondary Mirror',
      scientificName: 'Hyperbolic Secondary Reflector',
      assembledPosition: [0, 0, 1.4],
      explodedOffset: [0, 0, 3.5],
      assembledRotation: [0, 0, 0],
      color: '#E2E8F0',
      metalness: 0.95,
      roughness: 0.05,
      function: 'A smaller curved mirror mounted near the front of the tube that reflects light back through a hole in the primary mirror.',
      workingPrinciple: 'Bends the converging light cone backward, lengthening the effective focal length of the telescope in a compact design.',
      physicsConcept: 'Focal length multiplication in Cassegrain systems.',
      realWorldApps: ['Telephoto camera lenses', 'LIDAR receivers'],
      interestingFacts: [
        'The secondary mirror is held in place by a three or four-armed support structure called the "spider," which causes the spike diffraction patterns seen on bright stars.'
      ],
      connections: ['tube']
    },
    /* ── 4. Eyepiece ── */
    {
      id: 'eyepiece',
      name: 'Eyepiece',
      scientificName: 'Ocular Assembly',
      assembledPosition: [0, -0.6, -1.2],
      explodedOffset: [0, -2.5, -2],
      assembledRotation: [Math.PI / 4, 0, 0],
      color: '#1E293B',
      metalness: 0.6,
      roughness: 0.3,
      function: 'The lens assembly at the focal point that magnifies the image formed by the primary optics for human viewing.',
      workingPrinciple: 'Maginfies the real intermediate image produced by the mirrors, transforming it into parallel light rays for the eye.',
      physicsConcept: 'Magnification formula: M = f_objective / f_eyepiece.',
      realWorldApps: ['Binoculars', 'Microscopes', 'Viewfinders'],
      interestingFacts: [
        'Changing the eyepiece changes the magnification of the telescope. A shorter focal length eyepiece yields higher magnification.'
      ],
      formula: 'M = \\frac{f_{\\text{objective}}}{f_{\\text{eyepiece}}}',
      connections: ['tube']
    },
    /* ── 5. Objective Lens ── */
    {
      id: 'objective-lens',
      name: 'Corrector Lens / Plate',
      scientificName: 'Schmidt Corrector Plate',
      assembledPosition: [0, 0, 1.6],
      explodedOffset: [0, 0, 4.5],
      assembledRotation: [0, 0, 0],
      color: '#93C5FD',
      metalness: 0.1,
      roughness: 0.05,
      function: 'A thin glass plate at the front of the tube that corrects spherical aberration caused by primary optics.',
      workingPrinciple: 'Refracts light rays slightly before they strike the mirror, ensuring all incoming parallel rays focus to a perfect point.',
      physicsConcept: 'Refractive aberration correction.',
      realWorldApps: ['Schmidt-Cassegrain telescopes', 'Wide-field astrophotography cameras'],
      interestingFacts: [
        'Invented by Bernhard Schmidt in 1930, this corrector lens allows for extremely wide fields of view without distortion.'
      ],
      connections: ['tube']
    },
    /* ── 6. Finder Scope ── */
    {
      id: 'finder-scope',
      name: 'Finder Scope',
      scientificName: 'Auxiliary Sight Telescope',
      assembledPosition: [0.6, 0.6, -1],
      explodedOffset: [2, 1.5, -1],
      assembledRotation: [0, 0, 0],
      color: '#475569',
      metalness: 0.8,
      roughness: 0.2,
      function: 'A small, low-power auxiliary telescope with a wide field of view used to point the main telescope at target objects.',
      workingPrinciple: 'Provides crosshairs and low magnification to easily locate an object, which then appears magnified inside the narrow field of the main eyepiece.',
      physicsConcept: 'Field of view vs magnification.',
      realWorldApps: ['Rifle scopes', 'Targeting lasers', 'Camera sights'],
      interestingFacts: [
        'Because telescopes have a tiny field of view, finding an object without a finder scope is like looking through a straw.'
      ],
      connections: ['tube']
    },
    /* ── 7. Mount ── */
    {
      id: 'mount',
      name: 'Telescope Mount',
      scientificName: 'Equatorial / Alt-Azimuth Mount',
      assembledPosition: [0, -1.8, 0],
      explodedOffset: [-3, -2, 0],
      assembledRotation: [0, 0, 0],
      color: '#1E293B',
      metalness: 0.85,
      roughness: 0.2,
      function: 'The supporting stand that allows rotation along two axes to orient the telescope and track astronomical objects.',
      workingPrinciple: 'Equatorial mounts align one axis with Earth\'s spin axis, allowing the telescope to track stars with a single motorized rotation.',
      physicsConcept: 'Earth\'s rotation compensation and sidereal tracking.',
      realWorldApps: ['Solar trackers', 'Radar pedestal mounts', 'Pan-tilt cameras'],
      interestingFacts: [
        'Computerized Alt-Azimuth mounts (GoTo mounts) calculate coordinate transformations in real-time to track targets using both axes.'
      ],
      connections: ['tube']
    }
  ]
};

export default telescope;
