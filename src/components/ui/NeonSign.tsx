import React, { useId } from 'react';

interface NeonSignProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  textClassName?: string;
}

export const NeonSign = ({
  text,
  as: Component = 'h2',
  className = '',
  textClassName = '',
}: NeonSignProps) => {
  const uniqueId = useId();
  const filterId = `neon-glow-${uniqueId}`;

  const colors = "var(--primary);#00ff85;#03a9f4;#ff005a;#38003c;var(--primary)";

  return (
    <Component className={`relative ${className}`} aria-label={text}>
      <span className="sr-only">{text}</span>
      <svg
        viewBox="0 0 900 150"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="w-full"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
          strokeWidth="1.5"
          filter={`url(#${filterId})`}
          className={`
            font-extrabold font-sans
            fill-transparent
            ${textClassName}
          `}
        >
          <animate 
            attributeName="stroke" 
            values={colors}
            dur="8s" 
            repeatCount="indefinite"
          />
          {text}
        </text>
      </svg>
    </Component>
  );
};