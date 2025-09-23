'use client';

import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';

const NonPremiumView = () => (
  <div className="flex items-center justify-center p-4">
    <Card isClickable={false} className="max-w-md text-center">
      <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-foreground">Esta es una función Premium</h1>
      <p className="text-foreground/70 mt-2">
        Actualiza tu plan para acceder a reportes inteligentes y análisis avanzados.
      </p>
      <Link href={PATHROUTES.pymes.suscripcion}>
        <Button className="mt-8">Ir a la página de Suscripción</Button>
      </Link>
    </Card>
  </div>
);

export default function ReportesPage() {
  const { isPremium, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  if (!isPremium) {
    return <NonPremiumView />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Reportes Avanzados</h1>
      <p className="text-foreground/70 mt-2">
        Bienvenido al panel de reportes.
      </p>
    </div>
  );
}