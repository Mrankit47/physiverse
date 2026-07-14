'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LogoIcon from './LogoIcon';

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Trigger loader reset on every route change (page switch)
  useEffect(() => {
    setLoading(true);
    setFadeOut(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading) return;

    // Prevent scrolling while loader is active
    document.body.style.overflow = 'hidden';

    // Trigger fade out after 800ms (gives the page ample time to mount/render elements)
    const fadeTimeout = setTimeout(() => {
      setFadeOut(true);
    }, 800);

    // Fully remove loader from DOM and restore overflow scroll after 1100ms
    const removeTimeout = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = '';
    }, 1100);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
      document.body.style.overflow = '';
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-opacity duration-300 bg-[var(--bg-primary)] ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Large Glowing Animated Atom Logo */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing Backglow */}
          <div className="absolute w-24 h-24 rounded-full bg-[var(--color-primary)] opacity-20 blur-2xl animate-pulse" />
          
          {/* Animated Atom LogoIcon */}
          <LogoIcon size={80} className="text-[var(--color-primary)] relative z-10" />
        </div>
      </div>
    </div>
  );
}
