'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const simulationEngines: Record<string, ReturnType<typeof dynamic>> = {
  'solar-system': dynamic(() => import('@/components/simulations/engines/SolarSystemSim'), { ssr: false }),
  'gravity-orbits': dynamic(() => import('@/components/simulations/engines/GravityOrbitsSim'), { ssr: false }),
  'projectile-motion': dynamic(() => import('@/components/simulations/engines/ProjectileMotionSim'), { ssr: false }),
  'pendulum': dynamic(() => import('@/components/simulations/engines/PendulumSim'), { ssr: false }),
  'wave-on-string': dynamic(() => import('@/components/simulations/engines/WaveOnStringSim'), { ssr: false }),
  'circuit-sandbox': dynamic(() => import('@/components/simulations/engines/CircuitSandboxSim'), { ssr: false }),
  'optics-ray-tracer': dynamic(() => import('@/components/simulations/engines/OpticsRayTracerSim'), { ssr: false }),
  'double-slit': dynamic(() => import('@/components/simulations/engines/DoubleSlitSim'), { ssr: false }),
  'electromagnetism': dynamic(() => import('@/components/simulations/engines/ElectromagnetismSim'), { ssr: false }),
  'black-hole': dynamic(() => import('@/components/simulations/engines/BlackHoleSim'), { ssr: false }),
};

export default function SimulationDetailPage() {
  const params = useParams();
  const simId = params.simId as string;
  const SimEngine = simulationEngines[simId];

  if (!SimEngine) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
            Simulation not found
          </h1>
          <Link
            href="/simulations"
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Simulations
          </Link>
        </div>
      </div>
    );
  }

  return <SimEngine />;
}
