'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { PremiumCard } from '@/components/ui/PremiumCard';
import { Button } from "@/components/ui/Button";
import { Map } from "@/components/ui/Map";
import { Phone, Mail, MapPin, Edit, Loader2 } from 'lucide-react';
import { Proveedor } from '@/mocks/types';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';

export default function ProveedorDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProveedor = async () => {
        if (!session?.accessToken) return;
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` },
            });
            if (!res.ok) throw new Error('Proveedor no encontrado o no tienes permiso para verlo.');
            const data = await res.json();
            setProveedor(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al cargar el proveedor.');
        } finally {
            setLoading(false);
        }
    };
    if (session) fetchProveedor();
  }, [id, session]);

  if (loading || !proveedor) {
    return (
        <div className="p-8 h-full flex justify-center items-center">
            <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{proveedor.name}</h1>
          <p className="text-foreground/70">{proveedor.cif || 'Sin CIF'}</p>
        </div>
        <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Editar</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card isClickable={false}>
            <h2 className="text-xl font-bold mb-4">Información de Contacto</h2>
            <div className="space-y-3 text-foreground/80">
              <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> {proveedor.phone || 'No especificado'}</p>
              <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> {proveedor.email || 'No especificado'}</p>
              <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> {proveedor.address || 'No especificada'}</p>
            </div>
          </Card>
          <Card isClickable={false} className="overflow-hidden">
            <h2 className="text-xl font-bold mb-4">Ubicación</h2>
            <div className="h-64 rounded-lg">
                {proveedor.address ? (
                    <Map address={proveedor.address} />
                ) : (
                    <div className="h-full w-full bg-border flex items-center justify-center rounded-lg">
                        <p className="text-foreground/50">No hay dirección para mostrar.</p>
                    </div>
                )}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
            <PremiumCard>
                <h2 className="text-xl font-bold mb-4">Métricas Financieras</h2>
                <p className="text-foreground/70">Próximamente: Deuda actual, total comprado y facturas asociadas.</p>
            </PremiumCard>
        </div>
      </div>
    </div>
  );
}