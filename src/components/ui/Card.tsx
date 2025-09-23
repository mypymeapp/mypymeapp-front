'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isClickable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl p-6 border border-border bg-card transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_0_15px_var(--primary)] ${className}`}>
        {children}
    </div>
  );
};

