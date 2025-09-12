'use client';

import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, children, className, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        <div
          className="absolute -inset-0.5 bg-gradient-to-r from-primary to-foreground rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"
          aria-hidden="true"
        />
        <div className="relative h-[49px]">
          <select
            id={id}
            ref={ref}
            className={`block w-full h-full px-4 text-foreground bg-card border border-border rounded-lg focus:outline-none focus:ring-0 peer appearance-none ${className}`}
            {...props}
          >
            {children}
          </select>
          <label
            htmlFor={id}
            className="absolute text-sm text-foreground/70 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-card px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
          >
            {label}
          </label>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 fill-current text-foreground/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';