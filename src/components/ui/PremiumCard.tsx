'use client';

import React from 'react';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ children, className }) => {
  return (
    <div
      className={`relative p-[2px] rounded-xl bg-400% animate-animated-gradient ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, var(--primary), var(--foreground), var(--primary))`
      }}
    >
      <div className="h-full w-full rounded-[10px] bg-card p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};