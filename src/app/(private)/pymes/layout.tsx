'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useAuth } from '@/context/AuthContext';
import { TopNav } from '@/components/layout/TopNav';
import { Home, DollarSign, ShoppingCart, FileText, Package, Users, Truck, Settings, LifeBuoy, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: PATHROUTES.pymes.dashboard, icon: Home },
  { label: 'Ventas', href: PATHROUTES.pymes.ventas, icon: DollarSign },
  { label: 'Compras', href: PATHROUTES.pymes.compras, icon: ShoppingCart },
  { label: 'Facturación', href: PATHROUTES.pymes.facturacion, icon: FileText },
  { label: 'Inventario', href: PATHROUTES.pymes.inventario, icon: Package },
  { label: 'Reportes', href: PATHROUTES.pymes.reportes, icon: BarChart3 },
  { label: 'Clientes', href: PATHROUTES.pymes.clientes, icon: Users },
  { label: 'Proveedores', href: PATHROUTES.pymes.proveedores, icon: Truck },
];

const bottomNavItems = [
    { label: 'Soporte', href: PATHROUTES.pymes.soporte, icon: LifeBuoy },
    { label: 'Configuración', href: PATHROUTES.pymes.configuracion, icon: Settings },
]

export default function PymesLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const { status } = useSession({
      required: true,
      onUnauthenticated() {
        router.push(PATHROUTES.login);
      },
  });
  const { user, isPremium } = useAuth();

  const linkClasses = "flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/80 transition-all duration-200 ease-in-out hover:bg-primary/10 hover:text-primary hover:translate-x-1";

  if (status === 'loading') {
      return (
          <div className="flex items-center justify-center min-h-screen bg-background">
              <Loader2 className="animate-spin h-12 w-12 text-primary" />
          </div>
      );
  }

  return (
      <div className="min-h-screen bg-background text-foreground lg:flex">
        <div
          className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <aside
          className={`fixed top-0 left-0 h-screen w-64 bg-card border-r border-border flex flex-col z-40 transition-transform duration-300 lg:sticky lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 h-[81px] border-b border-border flex items-center justify-center">
            {isPremium && user?.logoUrl ? (
              <div className="relative w-full h-full">
                  <Image src={user.logoUrl} alt="Logo de la Empresa" layout="fill" className="object-contain" />
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-primary text-center truncate">{user?.companyName || 'My PYME App'}</h1>
            )}
          </div>
          <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={linkClasses} onClick={() => setIsSidebarOpen(false)}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border space-y-2">
            {bottomNavItems.map((item) => (
              <Link key={item.label} href={item.href} className={linkClasses} onClick={() => setIsSidebarOpen(false)}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </aside>

        <div className="flex-1 flex flex-col w-full lg:w-auto">
          <TopNav onMenuToggle={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
  );
}

