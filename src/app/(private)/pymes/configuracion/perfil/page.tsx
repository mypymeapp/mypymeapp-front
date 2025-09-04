'use client';

import { useRef } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function PerfilPage() {
    const { user, updateUserLogo, isPremium } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const logoUrl = URL.createObjectURL(file);
            updateUserLogo(logoUrl);
            toast.success('¡Logo actualizado!');
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={PATHROUTES.pymes.configuracion}>
                    <Button variant="outline" className="px-3"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Perfil de la Empresa</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card isClickable={false}>
                        <h2 className="text-xl font-bold mb-6">Datos Fiscales</h2>
                        <form className="space-y-6">
                            <Input id="nombre" label="Nombre de la Empresa" defaultValue={user?.nombreEmpresa} />
                            <Input id="email" label="Email de Contacto" type="email" defaultValue={user?.email} />
                            <div className="flex justify-end">
                                <Button>Guardar Cambios</Button>
                            </div>
                        </form>
                    </Card>
                </div>

                <div>
                    <Card isClickable={false}>
                        <h2 className="text-xl font-bold mb-4">Logo de la Empresa</h2>
                        {isPremium ? (
                            <>
                                <div className="w-full h-32 bg-background border-2 border-dashed border-border rounded-lg flex items-center justify-center mb-4">
                                    {user?.logoUrl ? (
                                        <Image src={user.logoUrl} alt="Logo actual" width={150} height={60} className="object-contain" />
                                    ) : (
                                        <p className="text-foreground/50">Sube tu logo</p>
                                    )}
                                </div>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                <Button variant="outline" className="w-full" onClick={handleLogoClick}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Cambiar Logo
                                </Button>
                            </>
                        ) : (
                            <div className="text-center p-6 bg-background rounded-lg">
                                <p className="font-bold text-premium">Funcionalidad Premium</p>
                                <p className="text-foreground/70 text-sm mt-2">Sube tu logo para personalizar la aplicación.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}