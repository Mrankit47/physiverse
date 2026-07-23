'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — AnimationControls Component
   Play/pause/reset/speed controls for any animation.
   ═══════════════════════════════════════════════════════════════ */

import { Play, Pause, RotateCcw, SkipBack, SkipForward, Gauge } from 'lucide-react';

interface AnimationControlsProps {
  isPlaying: boolean;
  progress: number;
  speed: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onSeek: (progress: number) => void;
  onSpeedChange: (speed: number) => void;
  accentColor?: string;
  compact?: boolean;
}

const SPEED_OPTIONS = [0.25, 0.5, 1, 1.5, 2, 3];

export default function AnimationControls({
  isPlaying,
  progress,
  speed,
  onTogglePlay,
  onReset,
  onSeek,
  onSpeedChange,
  accentColor = 'var(--color-primary)',
  compact = false,
}: AnimationControlsProps) {
  return (
    <div
      className={`flex items-center gap-2 ${compact ? 'p-2' : 'p-3'} rounded-xl`}
      style={{
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--surface-glass-border)',
      }}
    >
      {/* Reset */}
      <button
        onClick={onReset}
        className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.08)]"
        aria-label="Reset animation"
        title="Reset"
      >
        <RotateCcw className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      </button>

      {/* Step back */}
      {!compact && (
        <button
          onClick={() => onSeek(Math.max(0, progress - 0.05))}
          className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.08)]"
          aria-label="Step back"
        >
          <SkipBack className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        </button>
      )}

      {/* Play/Pause */}
      <button
        onClick={onTogglePlay}
        className="p-2 rounded-xl transition-all"
        style={{
          background: accentColor,
          color: '#fff',
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Step forward */}
      {!compact && (
        <button
          onClick={() => onSeek(Math.min(1, progress + 0.05))}
          className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.08)]"
          aria-label="Step forward"
        >
          <SkipForward className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        </button>
      )}

      {/* Progress bar */}
      <div className="flex-1 mx-2">
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full"
          aria-label={`Animation progress: ${Math.round(progress * 100)}%`}
        />
      </div>

      {/* Progress label */}
      <span
        className="text-xs font-mono min-w-[3rem] text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        {Math.round(progress * 100)}%
      </span>

      {/* Speed control */}
      {!compact && (
        <div className="flex items-center gap-1">
          <Gauge className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <select
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="text-xs rounded-lg px-1.5 py-1 outline-none"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-body)',
              border: '1px solid var(--border-default)',
            }}
            aria-label="Playback speed"
          >
            {SPEED_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
