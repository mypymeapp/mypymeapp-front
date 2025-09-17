'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        <div
          className="absolute -inset-0.5 bg-gradient-to-r from-primary to-foreground rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"
          aria-hidden="true"
        />
        <div className="relative h-[49px]">
          <input
            id={id}
            ref={ref}
            className={`block w-full h-full px-4 text-foreground bg-card border border-border rounded-lg placeholder-foreground/50 focus:outline-none focus:ring-0 peer ${className}`}
            placeholder=" "
            {...props}
          />
          <label
            htmlFor={id}
            className="absolute text-sm text-foreground/70 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-card px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
          >
            {label}
          </label>
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';