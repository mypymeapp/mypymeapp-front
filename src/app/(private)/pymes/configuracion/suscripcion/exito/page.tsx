'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useAuth } from '@/context/AuthContext';

export default function ExitoPage() {
  const { update, status } = useSession();
  const { isPremium, isAuthenticated } = useAuth();
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {

    if (status === 'authenticated' && !isPremium) {
      update();
    }
  }, [status, isPremium, update]);

 
  useEffect(() => {
    if (isAuthenticated && isPremium) {
      setIsUpdating(false);
    }
  }, [isAuthenticated, isPremium]);

  if (isUpdating) {
    return (
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]">
        <Loader2 className="w-20 h-20 text-primary animate-spin mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-foreground">Finalizando activación Premium...</h1>
        <p className="text-foreground/70 mt-2">
          Estamos actualizando tu cuenta. Esto puede tardar unos segundos.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-200px)]">
      <Card isClickable={false} className="max-w-md text-center">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground">¡Pago Exitoso!</h1>
        <p className="text-foreground/70 mt-4">
          ¡Bienvenido al plan Premium! Tu cuenta ha sido actualizada. Ya puedes disfrutar de todas las funcionalidades avanzadas.
        </p>
        <Link href={PATHROUTES.pymes.dashboard} className="mt-8 inline-block">
          <Button>Ir al Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}