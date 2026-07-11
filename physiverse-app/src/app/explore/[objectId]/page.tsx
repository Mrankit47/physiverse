'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/* ── Data imports ── */
import microscope from '@/data/explodedView/microscope';
import atom from '@/data/explodedView/atom';
import gyroscope from '@/data/explodedView/gyroscope';
import newtonsCradle from '@/data/explodedView/newtonsCradle';
import foucaultPendulum from '@/data/explodedView/foucaultPendulum';
import generator from '@/data/explodedView/generator';
import particleDetector from '@/data/explodedView/particleDetector';
import telescope from '@/data/explodedView/telescope';
import opticalBench from '@/data/explodedView/opticalBench';
import laserSetup from '@/data/explodedView/laserSetup';
import type { ExplodableObjectData } from '@/data/explodedView/componentRegistry';

/* ── Geometry builders ── */
import { buildMicroscopeGeometry } from '@/components/explodedView/geometries/MicroscopeGeometry';
import { buildAtomGeometry } from '@/components/explodedView/geometries/AtomGeometry';
import { buildGyroscopeGeometry } from '@/components/explodedView/geometries/GyroscopeGeometry';
import { buildNewtonsCradleGeometry } from '@/components/explodedView/geometries/NewtonsCradleGeometry';
import { buildFoucaultPendulumGeometry } from '@/components/explodedView/geometries/FoucaultPendulumGeometry';
import { buildGeneratorGeometry } from '@/components/explodedView/geometries/GeneratorGeometry';
import { buildParticleDetectorGeometry } from '@/components/explodedView/geometries/ParticleDetectorGeometry';
import { buildTelescopeGeometry } from '@/components/explodedView/geometries/TelescopeGeometry';
import { buildOpticalBenchGeometry } from '@/components/explodedView/geometries/OpticalBenchGeometry';
import { buildLaserSetupGeometry } from '@/components/explodedView/geometries/LaserSetupGeometry';

/* ── Dynamic imports for heavy components (code splitting) ── */
const ExplodedViewScene = dynamic(
  () => import('@/components/explodedView/ExplodedViewScene'),
  { ssr: false }
);
const ExplodableObject = dynamic(
  () => import('@/components/explodedView/ExplodableObject'),
  { ssr: false }
);
const InfoPanel = dynamic(
  () => import('@/components/explodedView/InfoPanel'),
  { ssr: false }
);
const LearningMode = dynamic(
  () => import('@/components/explodedView/LearningMode'),
  { ssr: false }
);
const ExplodedViewControls = dynamic(
  () => import('@/components/explodedView/ExplodedViewControls'),
  { ssr: false }
);

/* ── Object Registry ── */
const objectRegistry: Record<
  string,
  {
    data: ExplodableObjectData;
    buildGeometry: () => Record<string, React.ReactNode>;
  }
> = {
  microscope: { data: microscope, buildGeometry: buildMicroscopeGeometry },
  atom: { data: atom, buildGeometry: buildAtomGeometry },
  gyroscope: { data: gyroscope, buildGeometry: buildGyroscopeGeometry },
  'newtons-cradle': { data: newtonsCradle, buildGeometry: buildNewtonsCradleGeometry },
  'foucault-pendulum': { data: foucaultPendulum, buildGeometry: buildFoucaultPendulumGeometry },
  generator: { data: generator, buildGeometry: buildGeneratorGeometry },
  'particle-detector': { data: particleDetector, buildGeometry: buildParticleDetectorGeometry },
  telescope: { data: telescope, buildGeometry: buildTelescopeGeometry },
  'optical-bench': { data: opticalBench, buildGeometry: buildOpticalBenchGeometry },
  'laser-setup': { data: laserSetup, buildGeometry: buildLaserSetupGeometry },
};

export default function ExploreObjectPage() {
  const params = useParams();
  const objectId = params.objectId as string;
  const entry = objectRegistry[objectId];

  /* ── Build geometry map (memoized) ── */
  const geometryMap = useMemo(() => {
    if (!entry) return {};
    return entry.buildGeometry();
  }, [entry]);

  /* ── Not found ── */
  if (!entry) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--text-heading)' }}
          >
            Object not found
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            The instrument you&apos;re looking for doesn&apos;t exist yet.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const { data } = entry;

  return (
    <div className="min-h-screen pt-16 pb-0 relative" style={{ background: 'var(--gradient-hero)' }}>
      {/* Top bar */}
      <div className="absolute top-20 left-0 right-0 z-30">
        <div className="section-container flex items-center justify-between">
          <Link
            href="/explore"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="text-center">
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: `${data.color}20`,
                color: data.color,
              }}
            >
              {data.category}
            </span>
            <h1
              className="text-lg md:text-xl font-bold mt-1 text-white"
            >
              {data.name}
            </h1>
          </div>

          {/* Spacer for centering */}
          <div className="w-16" />
        </div>
      </div>

      {/* Full-screen 3D Canvas */}
      <div className="w-full" style={{ height: 'calc(100vh - 4rem)' }}>
        <ExplodedViewScene objectData={data}>
          <ExplodableObject
            components={data.components}
            geometryMap={geometryMap}
          />
        </ExplodedViewScene>
      </div>

      {/* HTML Overlay: Controls */}
      <ExplodedViewControls
        accentColor={data.color}
        totalComponents={data.components.length}
      />

      {/* HTML Overlay: Info Panel */}
      <InfoPanel
        components={data.components}
        accentColor={data.color}
      />

      {/* HTML Overlay: Learning Mode */}
      <LearningMode
        components={data.components}
        accentColor={data.color}
      />
    </div>
  );
}
