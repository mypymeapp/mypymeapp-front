'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button"; // 🟢 Corregido: Se usa 'from' en lugar de 'as'
import { Map } from "@/components/ui/Map";
import { Phone, Mail, MapPin, Loader2, ArrowLeft, Truck, ListOrdered } from 'lucide-react'; 
import { Proveedor } from '@/mocks/types';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { use } from "react";
import Link from "next/link";
import { PATHROUTES } from '@/constants/pathroutes';

export default function ProveedorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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
         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Botón de Atrás y Título Principal */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={PATHROUTES.pymes.proveedores}>
          <Button variant="outline" className="px-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Detalle del Proveedor</h1>
      </div>

      {/* 🛑 SE ELIMINA el div que contenía el título y CIF separados */}

      {/* Layout con 3 columnas (1/3 para info, 2/3 para mapa) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información de contacto (Ocupa 1/3 en desktop) - AHORA INCLUYE NOMBRE Y CIF */}
        <Card isClickable={false} className="lg:col-span-1">
          {/* Nombre del proveedor y CIF dentro de la tarjeta con icono */}
          <div className="flex items-center gap-3 mb-1"> {/* Contenedor para el icono y el nombre */}
             <div className="bg-primary/10 p-2 rounded-full flex items-center justify-center w-10 h-10 shrink-0">
                <Truck className="w-6 h-6 text-primary" /> {/* Icono de Proveedor */}
             </div>
             <h2 className="text-2xl font-semibold text-foreground truncate">{proveedor.name}</h2>
          </div>
          <p className="text-foreground/70 text-sm mb-6 ml-12">{proveedor.cif || 'Sin CIF'}</p> {/* Se ajusta el margen para alinearse con el nombre */}
          
          <h3 className="text-xl font-bold mb-4">Información de Contacto</h3>
          <div className="space-y-3 text-foreground/80">
            <p className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary" /> {proveedor.phone || 'No especificado'}
            </p>
            <p className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary" /> {proveedor.email || 'No especificado'}
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-primary" /> {proveedor.address || 'No especificada'}
            </p>
          </div>
        </Card>

        {/* Mapa (Ocupa 2/3 en desktop) */}
        <Card isClickable={false} className="overflow-hidden lg:col-span-2">
          <h3 className="text-xl font-bold mb-4">Ubicación</h3>
          <div className="h-96 rounded-lg">
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
    </div>
  );
}