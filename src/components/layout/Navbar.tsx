// src/components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { PATHROUTES } from '@/constants/pathroutes';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(prev => !prev);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-6 h-16 flex justify-between items-center py-0">
        <Link href={PATHROUTES.home}>
          <Image
            src={isDarkMode ? '/logo-dark.png' : '/logo-light.png'}
            alt="My PYME App Logo"
            width={180}
            height={45}
            className="object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-foreground/80 font-medium">
            <Link href={PATHROUTES.home} className="hover:text-primary transition-colors">Inicio</Link>
            {/* --- LINK ACTUALIZADO --- */}
            <Link href={PATHROUTES.contacto} className="hover:text-primary transition-colors">Contacto</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Link href={PATHROUTES.login}><Button variant='outline'>Login</Button></Link>
              <Link href={PATHROUTES.register}><Button>Regístrate Gratis</Button></Link>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-card border border-border"
              aria-label="Cambiar tema"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};