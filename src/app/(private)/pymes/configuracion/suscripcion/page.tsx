'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Star, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SuscripcionPage() {
  const { isPremium } = useAuth();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (status !== 'authenticated' || !session?.accessToken) {
      toast.error('La sesión no está lista o el token es inválido. Por favor, recarga la página.');
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
        
        const errorBody = await res.json().catch(() => ({ message: 'No se pudo leer el cuerpo del error.' }));
        console.error("ERROR RECIBIDO DEL BACKEND:", errorBody);
        throw new Error(errorBody.message || 'Error interno del servidor. Revisa la consola para más detalles.');
      }
      
      
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ocurrió un error.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Gestionar Suscripción</h1>
      <Card isClickable={false} className="max-w-2xl mx-auto">
        <div className="text-center">
          {isPremium ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground">¡Tu compañía es Premium!</h2>
              <p className="text-foreground/70 mt-2">
                Tienes acceso a todas las funcionalidades avanzadas.
              </p>
            </>
          ) : (
            <>
              <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground">Desbloquea todo el Potencial</h2>
              <p className="text-foreground/70 mt-2 max-w-md mx-auto">
                Actualiza al plan Premium para acceder a reportes inteligentes, asistente IA, y gestión de miembros.
              </p>
              <Button 
                onClick={handleUpgrade} 
                disabled={isLoading || status !== 'authenticated'}
                className="mt-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Redirigiendo...
                  </>
                ) : (
                  'Actualizar a Premium'
                )}
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}