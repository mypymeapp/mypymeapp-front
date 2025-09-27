'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { PATHROUTES } from '@/constants/pathroutes';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);
  
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };
  
  return (
    <>
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
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 text-foreground/80 font-medium">
              <Link href={PATHROUTES.home} className="hover:text-primary transition-colors">Inicio</Link>
              <Link href={PATHROUTES.nosotros} className="hover:text-primary transition-colors">Nosotros</Link>
              <Link href={PATHROUTES.contacto} className="hover:text-primary transition-colors">Contacto</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href={PATHROUTES.login}><Button variant='outline'>Login</Button></Link>
              <Link href={PATHROUTES.register}><Button>Regístrate Gratis</Button></Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-card border border-border"
              aria-label="Cambiar tema"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-foreground" />}
            </button>
            <button
              className="p-2 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>
      
      <div className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button
          className="absolute top-4 right-5 p-2"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Cerrar menú"
        >
          <X className="w-8 h-8 text-foreground" />
        </button>
        <nav className="flex flex-col items-center justify-center h-full gap-8 text-2xl font-medium">
          <Link href={PATHROUTES.home} onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Inicio</Link>
          <Link href={PATHROUTES.nosotros} onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Nosotros</Link>
          <Link href={PATHROUTES.contacto} onClick={() => setIsMenuOpen(false)} className="hover:text-primary transition-colors">Contacto</Link>
          <div className="flex flex-col items-center gap-4 mt-8 w-full px-8">
            <Link href={PATHROUTES.login} className="w-full" onClick={() => setIsMenuOpen(false)}><Button variant='outline' className="w-full">Login</Button></Link>
            <Link href={PATHROUTES.register} className="w-full" onClick={() => setIsMenuOpen(false)}><Button className="w-full">Regístrate Gratis</Button></Link>
          </div>
        </nav>
      </div>
    </>
  );
};