'use client';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Upload, User, Building, Loader2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRef, useState, useEffect, useMemo } from 'react';

export default function PerfilPage() {
    const { data: session, status, update } = useSession({ required: true });
    
    const [userName, setUserName] = useState('');
    const [companyName, setCompanyName] = useState('');
    
    const userAvatarRef = useRef<HTMLInputElement>(null);
    const companyLogoRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (status === 'authenticated' && session.user) {
        setUserName(session.user.name || '');
        setCompanyName(session.user.companyName || '');
      }
    }, [session, status]);
    
    const haveTextChanged = useMemo(() => {
        if (!session?.user) return false;
        const nameChanged = userName !== (session.user.name || '');
        const companyNameChanged = companyName !== (session.user.companyName || '');
        return nameChanged || companyNameChanged;
    }, [userName, companyName, session]);

    const handleFileUpload = async (file: File, endpoint: string, key: 'avatar' | 'logo') => {
        if (!session?.accessToken) throw new Error('Sesión no válida.');
        const formData = new FormData();
        formData.append(key, file);
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${session.accessToken}` },
            body: formData,
        });
        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
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
            const data = await handleFileUpload(file, apiUrl, 'avatar');
            
            await update({ ...session, user: { ...session.user, image: data.avatarUrl } });
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
            const data = await handleFileUpload(file, apiUrl, 'logo');
            
            await update({ ...session, user: { ...session.user, logoUrl: data.logoUrl } });
            toast.success('¡Logo actualizado!', { id: toastId });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al subir el logo.', { id: toastId });
        }
    };
    
    const handleSaveChanges = async () => {
        if (!session?.user) return;
        const toastId = toast.loading('Guardando cambios...');
        try {
            await update({ ...session, user: { ...session.user, name: userName, companyName: companyName } });
            toast.success('¡Cambios guardados!', { id: toastId });
        } catch (error) {
            toast.error('No se pudieron guardar los cambios.', { id: toastId });
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };
    
    if (status === 'loading' || !session?.user) {
        return <div className="flex justify-center items-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card isClickable={false} className="lg:col-span-1 flex flex-col">
                <div className="flex-grow">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><User /> Tu Perfil</h2>
                    <div className="flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 mb-4 group">
                            {session.user.image ? (
                                <Image
                                    src={session.user.image}
                                    alt="Avatar de usuario"
                                    fill
                                    className="rounded-full object-cover bg-border"
                                    key={session.user.image}
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold">
                                    {getInitials(session.user.name || '')}
                                </div>
                            )}
                            <button
                                onClick={() => userAvatarRef.current?.click()}
                                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Upload className="w-6 h-6" />
                            </button>
                            <input type="file" ref={userAvatarRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        </div>
                        <Input id="userName" label="Nombre Completo" value={userName} onChange={(e) => setUserName(e.target.value)} className="text-center" />
                        <p className="text-sm text-foreground/60 mt-2">{session.user.email}</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={!haveTextChanged}>
                        <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                    </Button>
                </div>
            </Card>

            <Card isClickable={false} className="lg:col-span-2 flex flex-col">
                <div className="flex-grow">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><Building /> Datos de la Empresa</h2>
                    <div className="flex flex-col items-center text-center">
                        <div className="relative w-48 h-24 mb-4 group">
                            {session.user.logoUrl ? (
                                <Image
                                    src={session.user.logoUrl}
                                    alt="Logo de la empresa"
                                    layout="fill"
                                    className="object-contain"
                                    key={session.user.logoUrl}
                                />
                            ) : (
                                <div className="w-full h-full rounded-lg bg-border flex items-center justify-center text-foreground/50">
                                    <p>Sin logo</p>
                                </div>
                            )}
                            <button
                                onClick={() => companyLogoRef.current?.click()}
                                className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Upload className="w-6 h-6" />
                            </button>
                            <input type="file" ref={companyLogoRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                        </div>
                        <Input id="companyName" label="Nombre de la Empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="text-center" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={!haveTextChanged}>
                        <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                    </Button>
                </div>
            </Card>
        </div>
    );
}