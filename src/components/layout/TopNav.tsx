'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogOut, Menu } from 'lucide-react';
import { ThemeToggleButton } from '../ui/ThemeToggleButton';
import { PATHROUTES } from '@/constants/pathroutes';

interface TopNavProps {
  onMenuToggle: () => void;
}

export const TopNav = ({ onMenuToggle }: TopNavProps) => {
  const { data: session } = useSession();

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
          <Image
            src={session?.user?.image || '/default-avatar.png'}
            alt={session?.user?.name || 'Avatar'}
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <p className="text-sm font-bold text-foreground">{session?.user?.name}</p>
            <p className="text-xs text-foreground/60">{session?.user?.email}</p>
          </div>
           <button onClick={() => signOut({ callbackUrl: PATHROUTES.home })}>
            <LogOut className="w-5 h-5 text-red-500/80 hover:text-red-500" />
           </button>
        </div>
      </div>
    </header>
  );
};