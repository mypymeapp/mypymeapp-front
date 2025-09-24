'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Button } from './Button';
import { Card } from './Card';
import { Loader2, Star } from 'lucide-react';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';

export const UpgradeToPremium = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    console.log("--- INICIANDO DIAGNÓSTICO DE PAGO ---");
    console.log("Token de acceso que se enviará:", session?.accessToken);
    console.log("-------------------------------------");

    if (!session?.accessToken) {
      toast.error('Sesión no válida o expirada. Por favor, recarga la página e intenta de nuevo.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('El servidor rechazó la autorización. Verifica que tu sesión sea correcta.');
      }
      
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card isClickable={false} className="max-w-md text-center">
        <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Esta es una función Premium</h1>
        <p className="text-foreground/70 mt-2">
          Actualiza tu plan para acceder a reportes inteligentes y análisis avanzados.
        </p>
        <Button onClick={handleUpgrade} disabled={isLoading} className="mt-8">
          {isLoading ? ( <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Redirigiendo...</> ) : ( 'Hacerme Premium' )}
        </Button>
        <Link href={PATHROUTES.pymes.configuracion} className="mt-4 inline-block text-sm text-foreground/60 hover:underline">
          Volver a Configuración
        </Link>
      </Card>
    </div>
  );
};