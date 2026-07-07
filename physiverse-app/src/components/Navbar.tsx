'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Atom,
  BookOpen,
  FlaskConical,
  Calculator,
  Bot,
  Users,
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  Orbit,
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

const navLinks = [
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/simulations', label: 'Simulations', icon: Orbit },
  { href: '/virtual-labs', label: 'Virtual Labs', icon: FlaskConical },
  { href: '/formula-explorer', label: 'Formula Explorer', icon: Calculator },
  { href: '/ai-tutor', label: 'AI Tutor', icon: Bot },
  { href: '/community', label: 'Community', icon: Users },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass shadow-lg'
            : 'bg-transparent'
        }`}
        style={{ borderBottom: scrolled ? '1px solid var(--border-default)' : 'none' }}
      >
        <div className="section-container">
          <nav className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" id="nav-logo">
              <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light shadow-md group-hover:shadow-lg transition-shadow">
                <Atom className="w-5 h-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-primary-light opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              </div>
              <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-heading)' }}>
                Physi<span className="gradient-text">verse</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-primary'
                        : 'hover:bg-[var(--bg-tertiary)]'
                    }`}
                    style={{ color: isActive ? 'var(--color-primary)' : 'var(--text-muted)' }}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                        style={{ background: 'var(--gradient-primary)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                id="theme-toggle"
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)]"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Sign In */}
              <Link
                href="/auth"
                id="nav-sign-in"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-default)',
                }}
              >
                Sign In
              </Link>

              {/* Get Started */}
              <Link
                href="/auth?mode=signup"
                id="nav-get-started"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Zap className="w-4 h-4" />
                Get Started
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                id="mobile-menu-toggle"
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
                style={{ color: 'var(--text-heading)' }}
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[calc(100vw-3rem)] p-6 pt-20"
              style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-default)' }}
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive ? 'glow-orange' : ''
                      }`}
                      style={{
                        color: isActive ? 'var(--color-primary)' : 'var(--text-body)',
                        background: isActive ? 'rgba(255, 122, 0, 0.1)' : 'transparent',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}

                <hr className="my-4" style={{ borderColor: 'var(--border-default)' }} />

                <Link
                  href="/auth"
                  className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-semibold transition-all"
                  style={{
                    color: 'var(--text-heading)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-white transition-all"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <Zap className="w-5 h-5" />
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
