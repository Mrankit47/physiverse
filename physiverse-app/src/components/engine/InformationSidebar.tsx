'use client';

/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — InformationSidebar Component
   Collapsible sidebar with theory, formulas, quiz, and bookmarks.
   ═══════════════════════════════════════════════════════════════ */

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  Calculator,
  HelpCircle,
  Settings,
  Info,
} from 'lucide-react';
import { useVisualizationStore, type SidebarPanel } from '@/stores/visualizationStore';

interface InformationSidebarProps {
  children: React.ReactNode;
  title?: string;
  accentColor?: string;
}

const PANEL_ICONS: Record<NonNullable<SidebarPanel>, typeof Info> = {
  info: Info,
  theory: BookOpen,
  formulas: Calculator,
  quiz: HelpCircle,
  settings: Settings,
};

const PANEL_LABELS: Record<NonNullable<SidebarPanel>, string> = {
  info: 'Information',
  theory: 'Theory',
  formulas: 'Formulas',
  quiz: 'Quiz',
  settings: 'Settings',
};

export default function InformationSidebar({
  children,
  title,
  accentColor = 'var(--color-primary)',
}: InformationSidebarProps) {
  const { isSidebarOpen, sidebarPanel, setSidebarPanel } = useVisualizationStore();

  const currentLabel = sidebarPanel ? PANEL_LABELS[sidebarPanel] : 'Information';

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setSidebarPanel(null)}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[380px] max-w-[85vw] z-50 flex flex-col"
            style={{
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-default)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b shrink-0"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <div className="flex items-center gap-2">
                {sidebarPanel && (() => {
                  const Icon = PANEL_ICONS[sidebarPanel];
                  return <Icon className="w-4 h-4" style={{ color: accentColor }} />;
                })()}
                <h3
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text-heading)' }}
                >
                  {title || currentLabel}
                </h3>
              </div>
              <button
                onClick={() => setSidebarPanel(null)}
                className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)]"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            {/* Tab bar */}
            <div
              className="flex border-b shrink-0 px-2"
              style={{ borderColor: 'var(--border-default)' }}
            >
              {(Object.keys(PANEL_ICONS) as NonNullable<SidebarPanel>[]).map((panel) => {
                const Icon = PANEL_ICONS[panel];
                const isActive = sidebarPanel === panel;
                return (
                  <button
                    key={panel}
                    onClick={() => setSidebarPanel(panel)}
                    className="flex items-center gap-1 px-3 py-2.5 text-xs font-medium transition-colors relative"
                    style={{
                      color: isActive ? accentColor : 'var(--text-muted)',
                    }}
                    title={PANEL_LABELS[panel]}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{PANEL_LABELS[panel]}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-tab"
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ background: accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
