'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '' 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-primary text-black dark:text-black hover:bg-primary/90 focus:ring-ring',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-ring',
    outline: 'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-ring'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
    >
      {children}
    </motion.button>
  );
}

export default Button;
