'use client';

import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { PATHROUTES } from "@/constants/pathroutes";
import { Paintbrush, User, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ConfiguracionPage() {
    const { isPremium } = useAuth();

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Configuración</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <Link href={PATHROUTES.pymes.configuracion_perfil} className="flex">
                    <Card className="w-full">
                        <User className="w-8 h-8 text-primary mb-4" />
                        <h2 className="text-xl font-bold">Perfil y Logo</h2>
                        <p className="text-foreground/70 mt-2">Edita los datos de tu empresa y gestiona tu marca.</p>
                    </Card>
                </Link>

                <Link href={isPremium ? PATHROUTES.pymes.configuracion_personalizacion : '#'} className="flex">
                    <div className={`w-full relative ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Card className="h-full">
                            <Paintbrush className="w-8 h-8 text-primary mb-4" />
                            <h2 className="text-xl font-bold">Personalización de Colores</h2>
                            <p className="text-foreground/70 mt-2">Ajusta la paleta de colores de la app a tu identidad corporativa.</p>
                            {!isPremium && <span className="absolute top-4 right-4 text-xs font-bold bg-premium text-black px-2 py-1 rounded-full">PREMIUM</span>}
                        </Card>
                    </div>
                </Link>
                
                <div className={`relative flex ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}>
                     <Card className="w-full">
                        <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                        <h2 className="text-xl font-bold">Roles y Permisos</h2>
                        <p className="text-foreground/70 mt-2">Gestiona qué pueden ver y hacer los diferentes miembros de tu equipo.</p>
                        {!isPremium && <span className="absolute top-4 right-4 text-xs font-bold bg-premium text-black px-2 py-1 rounded-full">PREMIUM</span>}
                    </Card>
                </div>
            </div>
        </div>
    )
}