'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Upload, User, Building, Loader2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
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

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !session?.user?.id || !session.accessToken) return;

      const formData = new FormData();
      formData.append('file', file);

      toast.loading('Subiendo avatar...');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}/avatar`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${session.accessToken}` },
          body: formData,
        });

        if (!res.ok) throw new Error('Error al subir el avatar.');
        
        const { avatarUrl } = await res.json();
        setUserData(prev => ({ ...prev, avatarUrl }));
        await update({ user: { ...session.user, image: avatarUrl } });
        toast.dismiss();
        toast.success('¡Avatar actualizado!');
      } catch (error) {
        toast.dismiss();
        toast.error(error instanceof Error ? error.message : 'Error desconocido.');
      }
    };

    const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !session?.user?.companyId || !session.accessToken) return;

      const formData = new FormData();
      formData.append('file', file);

      toast.loading('Subiendo logo...');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/logo`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${session.accessToken}` },
          body: formData,
        });

        if (!res.ok) throw new Error('Error al subir el logo.');
        
        const { logoUrl } = await res.json();
        setCompanyData(prev => ({ ...prev, logoUrl }));
        toast.dismiss();
        toast.success('¡Logo actualizado!');
      } catch (error) {
        toast.dismiss();
        toast.error(error instanceof Error ? error.message : 'Error desconocido.');
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