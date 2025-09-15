'use client';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Upload, User, Building, Loader2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

export default function PerfilPage() {
    const { data: session, update } = useSession();
    const [userData, setUserData] = useState({ name: '', avatarUrl: '' });
    const [companyData, setCompanyData] = useState({ name: '', logoUrl: '' });
    const [loading, setLoading] = useState(true);
    
    const userAvatarRef = useRef<HTMLInputElement>(null);
    const companyLogoRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (session?.user) {
        setUserData({ name: session.user.name || '', avatarUrl: session.user.image || '' });
        setCompanyData({ name: session.user.companyName || '', logoUrl: '' });
        setLoading(false);
      }
    }, [session]);

    const handleFileUpload = async (file: File, endpoint: string, key: 'avatar' | 'logo') => {
        if (!session?.accessToken) throw new Error('Sesión no válida.');

        const formData = new FormData();
        formData.append(key, file);

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${session.accessToken}`);

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({ message: 'Error desconocido en el servidor.' }));
            throw new Error(errorBody.message || 'Error al subir el archivo.');
        }

        return res.json();
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !session?.user?.id) return;

        const toastId = toast.loading('Subiendo avatar...');
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}/avatar`;
            const { avatarUrl } = await handleFileUpload(file, apiUrl, 'avatar');
            
            setUserData(prev => ({ ...prev, avatarUrl }));
            await update({ user: { ...session.user, image: avatarUrl } });
            toast.success('¡Avatar actualizado!', { id: toastId });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al subir el avatar.', { id: toastId });
        }
    };

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !session?.user?.companyId) return;

        const toastId = toast.loading('Subiendo logo...');
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/logo`;
            const { logoUrl } = await handleFileUpload(file, apiUrl, 'logo');

            setCompanyData(prev => ({ ...prev, logoUrl }));
            toast.success('¡Logo actualizado!', { id: toastId });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al subir el logo.', { id: toastId });
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card isClickable={false} className="lg:col-span-1">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><User /> Tu Perfil</h2>
                <div className="flex flex-col items-center text-center">
                    <div className="relative w-32 h-32 mb-4 group">
                        <Image
                            src={userData.avatarUrl || '/default-avatar.png'}
                            alt="Avatar de usuario"
                            width={128}
                            height={128}
                            className="rounded-full object-cover"
                        />
                        <button
                            onClick={() => userAvatarRef.current?.click()}
                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Upload className="w-6 h-6" />
                        </button>
                        <input type="file" ref={userAvatarRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                    </div>
                    <Input id="userName" label="Nombre Completo" defaultValue={userData.name} className="text-center" />
                    <p className="text-sm text-foreground/60 mt-2">{session?.user?.email}</p>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button><Save className="mr-2 h-4 w-4" /> Guardar Cambios</Button>
                </div>
            </Card>

            <Card isClickable={false} className="lg:col-span-2">
                 <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><Building /> Datos de la Empresa</h2>
                 <div className="flex flex-col items-center text-center">
                     <div className="relative w-48 h-24 mb-4 group">
                        <Image
                            src={companyData.logoUrl || '/default-logo-placeholder.png'}
                            alt="Logo de la empresa"
                            layout="fill"
                            className="object-contain"
                        />
                        <button
                            onClick={() => companyLogoRef.current?.click()}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Upload className="w-6 h-6" />
                        </button>
                        <input type="file" ref={companyLogoRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                    </div>
                     <Input id="companyName" label="Nombre de la Empresa" defaultValue={companyData.name} className="text-center" />
                </div>
                <div className="mt-6 flex justify-end">
                    <Button><Save className="mr-2 h-4 w-4" /> Guardar Cambios</Button>
                </div>
            </Card>
        </div>
    );
}