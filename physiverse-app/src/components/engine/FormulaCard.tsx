'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — FormulaCard Component
   KaTeX-powered formula display with variable explanations.
   ═══════════════════════════════════════════════════════════════ */

import { useMemo } from 'react';
import katex from 'katex';
import type { FormulaData } from '@/types/content';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarkStore } from '@/stores/bookmarkStore';

interface FormulaCardProps {
  formula: FormulaData;
  /** Compact mode for sidebar display */
  compact?: boolean;
  /** Show bookmark button */
  showBookmark?: boolean;
}

export default function FormulaCard({
  formula,
  compact = false,
  showBookmark = true,
}: FormulaCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarkStore();
  const bookmarked = isBookmarked(formula.id);

  const renderedLatex = useMemo(() => {
    try {
      return katex.renderToString(formula.latex, {
        displayMode: !compact,
        throwOnError: false,
        trust: true,
      });
    } catch {
      return `<span style="color: var(--color-error)">${formula.plainText}</span>`;
    }
  }, [formula.latex, formula.plainText, compact]);

  if (compact) {
    return (
      <div
        className="px-3 py-2 rounded-lg"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <div
          className="text-center"
          dangerouslySetInnerHTML={{ __html: renderedLatex }}
        />
        <p
          className="text-xs mt-1 text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          {formula.name}
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
      }}
    >
      {/* Formula display */}
      <div
        className="p-5 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(255,85,0,0.05), rgba(59,130,246,0.05))',
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: renderedLatex }} />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4
              className="text-sm font-semibold"
              style={{ color: 'var(--text-heading)' }}
            >
              {formula.name}
            </h4>
            {formula.category && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,85,0,0.1)',
                  color: 'var(--color-primary)',
                }}
              >
                {formula.category}
              </span>
            )}
          </div>
          {showBookmark && (
            <button
              onClick={() => toggleBookmark('formula', formula.id, formula.name)}
              className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              ) : (
                <Bookmark className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              )}
            </button>
          )}
        </div>

        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          {formula.description}
        </p>

        {/* Variables */}
        {formula.variables.length > 0 && (
          <div className="space-y-1.5">
            <h5
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Variables
            </h5>
            {formula.variables.map((v) => (
              <div
                key={v.symbol}
                className="flex items-center gap-2 text-xs"
              >
                <span
                  className="font-mono font-bold min-w-[1.5rem] text-center"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {v.symbol}
                </span>
                <span style={{ color: 'var(--text-body)' }}>
                  {v.name}
                </span>
                {v.unit && (
                  <span
                    className="font-mono text-[10px] ml-auto"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    [{v.unit}]
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
