'use client';

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const trailRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if device is mobile or touch-enabled
    const checkDevice = () => {
      const mobile = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Dynamic hover detection on interactive elements
    const addHoverListeners = () => {
      const clickables = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .cursor-pointer');
      clickables.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    addHoverListeners();

    // Create an observer to attach listeners to dynamically loaded elements
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Smooth trailing animation using requestAnimationFrame
    let animFrameId: number;
    const updateTrail = () => {
      const dx = mouseRef.current.x - trailRef.current.x;
      const dy = mouseRef.current.y - trailRef.current.y;
      
      // Interpolate position (0.15 is the easing factor)
      trailRef.current.x += dx * 0.15;
      trailRef.current.y += dy * 0.15;

      setTrail({ x: trailRef.current.x, y: trailRef.current.y });
      animFrameId = requestAnimationFrame(updateTrail);
    };

    animFrameId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
      cancelAnimationFrame(animFrameId);
    };
  }, [isMobile]);

  if (isMobile || isHidden) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? 0.4 : 1})`,
        }}
      />
      {/* Outer Ring */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[var(--color-primary)] pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
        style={{
          transform: `translate3d(${trail.x}px, ${trail.y}px, 0) scale(${isHovered ? 1.6 : 1})`,
          backgroundColor: isHovered ? 'rgba(255, 85, 0, 0.1)' : 'transparent',
          borderColor: isHovered ? 'var(--color-primary)' : 'rgba(255, 85, 0, 0.4)',
        }}
      />
    </>
  );
}
