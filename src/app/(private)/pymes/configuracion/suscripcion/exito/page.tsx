'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function ExitoPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const { update, data: session, status } = useSession();
  const { isPremium,  } = useAuth();
  
  const [isUpdating, setIsUpdating] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 12;
  const hasStartedPolling = useRef(false);
  const hasReloaded = useRef(false); 

  useEffect(() => {
    // CASO 1: Ya es premium (procesamiento completado o llegó después de recargar)
    if (isPremium) {
      setIsUpdating(false);
      return;
    }

    // CASO 2: No está autenticado, esperar
    if (status !== 'authenticated' || !session?.accessToken || !session?.user?.id) {
      return;
    }

    if (hasStartedPolling.current) {
      return;
    }
    hasStartedPolling.current = true;

    // Función para obtener datos frescos del backend
    const fetchUserData = async () => {
      try {
        const userId = session.user.id;
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Error al obtener datos del usuario');
        }

        const data = await res.json();
        return data;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    };

    // Función para verificar y actualizar el estado
    const checkAndUpdatePremiumStatus = async () => {
      
      try {
        //  Obtener datos frescos del backend
        const freshUserData = await fetchUserData();
        
        if (!freshUserData) {
          setAttempts(prev => prev + 1);
          return false;
        }

        // Verificar si ya es Premium
        const isPremiumInBackend = freshUserData.companies?.[0]?.company?.subscriptionStatus === 'PREMIUM';

        if (isPremiumInBackend) {
          
          // Prevenir múltiples recargas
          if (hasReloaded.current) {
            return true;
          }
          hasReloaded.current = true;
          
          // Actualizar la sesión de NextAuth con los datos frescos
          const company = freshUserData.companies[0].company;
          await update({
            subscriptionStatus: company.subscriptionStatus,
            companyId: company.id,
            companyName: company.name,
            logoUrl: company.logoFileId,
          });

          //  Mostrar éxito sin recargar la página
          toast.success('¡Cuenta Premium activada!');
          setIsUpdating(false);
          return true;
        } else {
          setAttempts(prev => prev + 1);
          return false;
        }
      } catch (error) {
        console.error('❌ Error en checkAndUpdatePremiumStatus:', error);
        setAttempts(prev => prev + 1);
        return false;
      }
    };

    // Iniciar el proceso de polling
    let pollingInterval: NodeJS.Timeout;

    const startPolling = async () => {
      // Primer intento después de 2 segundos (dar tiempo al webhook)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const firstAttempt = await checkAndUpdatePremiumStatus();
      if (firstAttempt) return;

      pollingInterval = setInterval(async () => {
        const success = await checkAndUpdatePremiumStatus();
        if (success && pollingInterval) {
          clearInterval(pollingInterval);
        }
      }, 3000);
    };

    startPolling();

    // Cleanup
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isPremium, status, session, update, attempts]);

  // Timeout: Si se alcanza el máximo de intentos
  useEffect(() => {
    if (attempts >= maxAttempts && isUpdating) {
      setIsUpdating(false);
      toast(
        'Tu pago fue procesado. Si no ves tu plan Premium, recarga la página manualmente.',
        {
          icon: '⏳',
          duration: 6000
        }
      );
    }
  }, [attempts, isUpdating]);

  // PANTALLA DE CARGA

  if (isUpdating) {
    return (
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]">
        <Loader2 className="w-20 h-20 text-primary animate-spin mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-foreground">Finalizando activación Premium...</h1>
        <p className="text-foreground/70 mt-2 text-center max-w-md">
          Estamos verificando tu pago. Esto puede tardar unos segundos.
        </p>
        {attempts > 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-sm text-foreground/50">
              Si no ves tu cuenta Premium en unos segundos, intenta recargar la página manualmente.
            </p>
            <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(attempts / maxAttempts) * 100}%` }}
              />
            </div>
          </div>
        )}
        {!sessionId && (
          <p className="text-black mt-4 text-sm">
            Procesando pago...
          </p>
        )}
        {sessionId && (
          <p className="text-xs text-foreground/30 mt-4 font-mono">
            Session ID: {sessionId.substring(0, 20)}...
          </p>
        )}
      </div>
    );
  }
  // PANTALLA DE ÉXITO
  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-200px)]">
      <Card isClickable={false} className="max-w-md text-center">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground">¡Pago Exitoso!</h1>
        <p className="text-foreground/70 mt-4">
          {isPremium 
            ? '¡Bienvenido al plan Premium! Tu cuenta ha sido actualizada. Ya puedes disfrutar de todas las funcionalidades avanzadas.'
            : 'Tu pago fue procesado correctamente. Si no ves tu cuenta Premium, intenta recargar la página.'
          }
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href={PATHROUTES.pymes.dashboard} className="inline-block">
            <Button>Ir al Dashboard</Button>
          </Link>
          {!isPremium && (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Recargar Página
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}