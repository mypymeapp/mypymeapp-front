'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PATHROUTES } from '@/constants/pathroutes';

interface ExtendedUser {
  isAdmin?: boolean;
  companyName?: string | null;
}

export function LoginRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si hay sesión activa
    if (status === 'authenticated' && session?.user) {
      const user = session.user as ExtendedUser;
      
      // Verificar si es admin
      if (user.isAdmin) {
        router.push('/admin');
      } else if (user.companyName) {
        // Si tiene empresa, ir al dashboard
        router.push(PATHROUTES.pymes.dashboard);
      } else {
        // Si no tiene empresa, ir al onboarding
        router.push(PATHROUTES.onboarding.create_company);
      }
    }
  }, [session, status, router]);

  return null; // Este componente no renderiza nada
}
