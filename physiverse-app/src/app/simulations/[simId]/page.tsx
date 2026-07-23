'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRegistry } from '@/hooks/useRegistry';

export default function SimulationDetailPage() {
  const params = useParams();
  const simId = params.simId as string;
  const { isReady, get } = useRegistry();

  if (!isReady) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading simulation plugin...
          </p>
        </div>
      </div>
    );
  }

  const plugin = get(simId);

  if (!plugin) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
            Simulation not found
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            No visualization plugin registered with ID &quot;{simId}&quot;.
          </p>
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

  const SimComponent = plugin.component;

  return <SimComponent metadata={plugin.metadata} />;
}
