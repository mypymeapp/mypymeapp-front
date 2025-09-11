'use client';

import React from 'react';

import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isClickable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl p-6 border border-border bg-card transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_0_15px_var(--primary)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};