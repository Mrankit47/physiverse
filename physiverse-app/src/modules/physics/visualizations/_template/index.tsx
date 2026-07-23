'use client';

/* ═══════════════════════════════════════════════════════════════
   VISUALIZATION TEMPLATE — Main Component
   
   This is the entry point React component for the visualization.
   It receives VisualizationComponentProps from the engine.
   ═══════════════════════════════════════════════════════════════ */

import type { VisualizationComponentProps } from '@/types';

export default function TemplateVisualization({ metadata, onReady }: VisualizationComponentProps) {
  // Call onReady when the visualization is fully loaded
  // useEffect(() => { onReady?.(); }, [onReady]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{metadata.title}</h2>
      <p>{metadata.description}</p>
      <p style={{ color: 'var(--text-muted)' }}>
        Replace this with your 3D scene component.
      </p>
    </div>
  );
}
