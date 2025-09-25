'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Star, Users } from 'lucide-react';
import { PATHROUTES } from '@/constants/pathroutes';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: PATHROUTES.pymes.suscripcion, label: 'Suscripción', icon: Star, premium: false },
  { href: PATHROUTES.pymes.configuracion_perfil, label: 'Perfil y Empresa', icon: User, premium: false },
  { href: PATHROUTES.pymes.miembros, label: 'Miembros del Equipo', icon: Users, premium: true, requireOwner: true },
];

export default function ConfiguracionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isPremium, user } = useAuth();
  
  const availableLinks = navLinks.filter(link => {
    if (link.premium && !isPremium) return false;
    if ((link).requireOwner && user?.role !== 'OWNER') return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-foreground/60 mt-1">Gestiona los detalles de tu cuenta y la apariencia de la aplicación.</p>
      </div>

      <div className="flex border-b border-border mb-8 overflow-x-auto">
        {availableLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors flex-shrink-0 ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground/60 hover:text-foreground'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
      
      <div>{children}</div>
    </div>
  );
}