'use client';

import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: number;
}

export default function LogoIcon({ className = '', size = 24 }: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`text-white overflow-visible ${className}`}
      style={{ minWidth: size, minHeight: size }}
    >
      {/* Central Nucleus */}
      <circle cx="12" cy="12" r="1.8" className="fill-current animate-nucleus-pulse" />

      {/* Orbit 1 (Horizontal/0deg oriented) */}
      <g transform="rotate(0 12 12)">
        <ellipse
          cx="12"
          cy="12"
          rx="3.5"
          ry="9.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="opacity-90 animate-draw-orbit-1"
        />
      </g>

      {/* Orbit 2 (60deg oriented) */}
      <g transform="rotate(60 12 12)">
        <ellipse
          cx="12"
          cy="12"
          rx="3.5"
          ry="9.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="opacity-90 animate-draw-orbit-2"
        />
      </g>

      {/* Orbit 3 (120deg oriented) */}
      <g transform="rotate(120 12 12)">
        <ellipse
          cx="12"
          cy="12"
          rx="3.5"
          ry="9.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="opacity-90 animate-draw-orbit-3"
        />
      </g>
    </svg>
  );
}
