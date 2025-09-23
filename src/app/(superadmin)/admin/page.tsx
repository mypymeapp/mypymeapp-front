'use client';

import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PATHROUTES } from '@/constants/pathroutes';

export default function SuperAdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirección del lado del cliente por si el middleware falla
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'SUPERADMIN') {
      router.replace(PATHROUTES.pymes.dashboard);
    }
  }, [user, isAuthenticated, router]);

  // Muestra un loader mientras se verifica la sesión
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Muestra un mensaje de error si, por alguna razón, un no-admin llega aquí
  if (user?.role !== 'SUPERADMIN') {
    return (
      <div className="text-center text-red-500">
        <ShieldOff className="mx-auto h-12 w-12 mb-4" />
        <h2 className="text-2xl font-bold">Acceso Denegado</h2>
        <p>No tienes los permisos necesarios para ver esta página.</p>
      </div>
    );
  }

  // Contenido de la página para el SuperAdmin
  return (
    <div>
      <p className="text-foreground">
        Bienvenido, SuperAdmin. Aquí se construirá la vista para gestionar todos los usuarios y empresas.
      </p>
      {/* PEDRO VOS EMPEZAS A TRABAJAR DESDE ACÁ */}
    </div>
  );
}