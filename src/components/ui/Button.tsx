'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 font-bold rounded-lg transition-all duration-200 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary text-base";

  const variantClasses = {
    primary: 'bg-primary text-button-text hover:brightness-110',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-button-text',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};