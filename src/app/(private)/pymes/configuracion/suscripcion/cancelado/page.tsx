import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';

export default function CanceladoPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card isClickable={false} className="max-w-md text-center">
        <XCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-foreground">Pago Cancelado</h1>
        <p className="text-foreground/70 mt-4">
          El proceso de pago fue cancelado. No se ha realizado ningún cargo. Puedes volver a intentarlo cuando quieras.
        </p>
        <Link href={PATHROUTES.pymes.suscripcion} className="mt-8 inline-block">
          <Button variant="outline">Volver a Intentar</Button>
        </Link>
      </Card>
    </div>
  );
}