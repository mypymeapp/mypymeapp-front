// src/components/layout/Footer.tsx
'use client'; 

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import { PATHROUTES } from '@/constants/pathroutes';

export const Footer = () => {
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
   
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  
    return () => observer.disconnect();
  }, []);
  

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          
          <Image
            src={isDarkMode ? '/logo-dark.png' : '/logo-light.png'}
            alt="My PYME App Logo"
            width={180}
            height={45}
            className="object-contain mb-4"
          />
          <p className="text-foreground/60 text-sm">
            © {new Date().getFullYear()} My PYME App. Todos los derechos reservados.
          </p>
        </div>
        
       
        <div>
          <h3 className="font-bold text-foreground mb-4">Navegación</h3>
          <ul className="space-y-2 text-foreground/80">
            <li><Link href={PATHROUTES.home} className="hover:text-primary transition-colors">Inicio</Link></li>
            <li><Link href={PATHROUTES.login} className="hover:text-primary transition-colors">Login</Link></li>
            <li><Link href={PATHROUTES.register} className="hover:text-primary transition-colors">Registro</Link></li>
          </ul>
        </div>
        <div>
           <h3 className="font-bold text-foreground mb-4">Legal</h3>
          <ul className="space-y-2 text-foreground/80">
            <li><Link href="#" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Contacto</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};