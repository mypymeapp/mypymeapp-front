'use client';

import React, { useId } from 'react';

interface NeonBorderProps {
  children: React.ReactNode;
  className?: string
  rx?: number;
}

export default function NeonBorder({ children, className = '', rx = 12 }: NeonBorderProps) {
  const id = useId();
  const filterId = `neon-border-${id}`;
  const colors = "var(--primary);#00ff85;#03a9f4;#ff005a;#38003c;var(--primary)";

  return (
    <div className={`relative ${className}`}>
      {children}
<svg
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 w-full h-full"
  viewBox="0 0 100 100"
  preserveAspectRatio="none"
>
  <defs>
    <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur" /> 
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  {/* SOLO el borde - sin relleno */}
  <rect
    x="0"
    y="0"
    width="100"
    height="100"
    rx={0}
    fill="none" // ← Esto es clave: sin relleno
    stroke="var(--primary)"
    strokeWidth="0.5" // Borde 
    filter={`url(#${filterId})`}
  >
    <animate attributeName="stroke" values={colors} dur="8s" repeatCount="indefinite" />
  </rect>
</svg>

    
    </div>
  );
}
