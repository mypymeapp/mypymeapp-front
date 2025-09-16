'use client';

import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogOut, Menu } from 'lucide-react';
import { ThemeToggleButton } from '../ui/ThemeToggleButton';
import { PATHROUTES } from '@/constants/pathroutes';
import { useAuth } from '@/context/AuthContext';

interface TopNavProps {
  onMenuToggle: () => void;
}

export const TopNav = ({ onMenuToggle }: TopNavProps) => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (!user) return null;

  return (
    <header className="bg-card border-b border-border p-4 flex justify-between lg:justify-end items-center sticky top-0 z-20">
      <button
        className="p-2 lg:hidden"
        onClick={onMenuToggle}
        aria-label="Abrir menú de navegación"
      >
        <Menu className="w-6 h-6 text-foreground" />
      </button>

      <div className="flex items-center gap-4">
        <ThemeToggleButton />
        <div className="h-8 w-px bg-border" />
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || 'Avatar'}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {getInitials(user.name || '')}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{user.name}</p>
            <p className="text-xs text-foreground/60">{user.email}</p>
          </div>
           <button onClick={() => signOut({ callbackUrl: PATHROUTES.home })}>
            <LogOut className="w-5 h-5 text-red-500/80 hover:text-red-500" />
           </button>
        </div>
      </div>
    </header>
  );
};