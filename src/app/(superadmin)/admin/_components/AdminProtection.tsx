'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

interface AdminProtectionProps {
  children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si está cargando, no hacer nada
    if (status === 'loading') return;

    // Si no hay sesión, redirigir al login
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin');
      return;
    }

    // Si hay sesión pero no es admin, redirigir al dashboard principal
    if (session && !session.user.isAdmin) {
      router.push('/pymes');
      toast.error('No tienes permisos para acceder al panel de administración.');
      return;
    }
  }, [session, status, router]);

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground/60">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión, mostrar loading (mientras redirige)
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground/60">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Si no es admin, mostrar mensaje de acceso denegado (mientras redirige)
  if (!session.user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">
            No tienes permisos para acceder al panel de administración.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirigiendo al dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Si es admin, mostrar el contenido
  return <>{children}</>;
}
