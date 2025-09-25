'use client';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Upload, User, Building, Loader2, Save, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const paises = [
  { value: 'AR', label: 'Argentina' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'CL', label: 'Chile' },
  { value: 'ES', label: 'España' },
  { value: 'MX', label: 'México' },
];

export default function PerfilPage() {
    const { data: session, status, update } = useSession({ required: true });
    
    const [userName, setUserName] = useState('');
    const [isSavingUser, setIsSavingUser] = useState(false);
    const [isLoadingCompany, setIsLoadingCompany] = useState(true);
    const userAvatarRef = useRef<HTMLInputElement>(null);
    
    const isOwner = session?.user?.role === 'OWNER';
    const canEditCompany = isOwner;

    useEffect(() => {
      if (status === 'authenticated' && session.user) {
        setUserName(session.user.name || '');
      }
    }, [session, status]);

    const userHaveTextChanged = useMemo(() => {
        if (!session?.user) return false;
        return userName !== (session.user.name || '');
    }, [userName, session]);

    const formik = useFormik({
        initialValues: {
            name: '', pais: 'AR', razonSocial: '', rut_Cuit: '', rubroPrincipal: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre de la empresa es requerido'),
            pais: Yup.string().required('El país es requerido'),
            razonSocial: Yup.string().required('La Razón Social es requerida'),
            rut_Cuit: Yup.string().required('La identificación fiscal es requerida'),
            rubroPrincipal: Yup.string().required('El rubro es requerido'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            if (!session?.user?.companyId || !session?.accessToken) {
                toast.error('Sesión no válida.');
                setSubmitting(false);
                return;
            }
            if (!canEditCompany) {
                toast.error('Solo el propietario puede editar los datos de la empresa.');
                setSubmitting(false);
                return;
            }
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.accessToken}`
                    },
                    body: JSON.stringify(values)
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Error al actualizar la empresa.');
                }
                
                await update({ companyName: values.name });
                toast.success('¡Datos de la empresa actualizados!');

            } catch (error) {
                 toast.error(error instanceof Error ? error.message : 'Ocurrió un error.');
            } finally {
                 setSubmitting(false);
            }
        },
        enableReinitialize: true,
    });

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (session?.user?.companyId && session?.accessToken && canEditCompany) {
                setIsLoadingCompany(true);
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}`, {
                        headers: { 'Authorization': `Bearer ${session.accessToken}` }
                    });
                    if (!res.ok) throw new Error('No se pudieron cargar los datos de la empresa.');
                    const companyData = await res.json();
                    formik.setValues({
                        name: companyData.name || '',
                        pais: companyData.pais || 'AR',
                        razonSocial: companyData.razonSocial || '',
                        rut_Cuit: companyData.rut_Cuit || '',
                        rubroPrincipal: companyData.rubroPrincipal || '',
                    });
                } catch (error) {
                    toast.error(error instanceof Error ? error.message : 'Error al cargar datos.');
                } finally {
                    setIsLoadingCompany(false);
                }
            }
        };

        if (status === 'authenticated') {
            if (canEditCompany) {
                fetchCompanyData();
            } else {
                setIsLoadingCompany(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, status]);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !session?.user?.id || !session?.accessToken) return;

        const toastId = toast.loading('Subiendo avatar...');
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/uploadAvatar/${session.user.id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.accessToken}` },
                body: formData,
            });
            if (!res.ok) throw new Error('Error al subir el avatar.');
            const data = await res.json();
            
            await update({ image: data.avatarUrl });
            toast.success('¡Avatar actualizado!', { id: toastId });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al subir el avatar.', { id: toastId });
        }
    };
    
    const handleUserSaveChanges = async () => {
        if (!session?.user || !userHaveTextChanged || !session?.accessToken) return;
        setIsSavingUser(true);
        const toastId = toast.loading('Guardando cambios...');
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.accessToken}` },
                body: JSON.stringify({ name: userName }),
            });
            await update({ name: userName });
            toast.success('¡Nombre actualizado!', { id: toastId });
        } catch (error) {
            toast.error('No se pudo guardar el nombre.', { id: toastId });
        } finally {
            setIsSavingUser(false);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const getIdentificacionLabel = (pais: string) => {
        switch (pais) {
          case 'AR': return 'CUIT (Sin guiones)';
          case 'UY': case 'CL': return 'RUT (Sin puntos ni guiones)';
          case 'ES': return 'NIF';
          case 'MX': return 'RFC';
          default: return 'Identificación Fiscal';
        }
    };
    
    if (status === 'loading') {
        return <div className="flex justify-center items-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card isClickable={false} className="lg:col-span-1 flex flex-col">
                <div className="flex-grow">
                    <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><User /> Tu Perfil</h2>
                    <div className="flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 mb-4 group">
                            {session?.user?.image ? (
                                <Image
                                    src={session.user.image} alt="Avatar de usuario" fill
                                    className="rounded-full object-cover bg-border" sizes="(max-width: 768px) 100vw, 33vw" key={session.user.image}
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold">
                                    {getInitials(session?.user?.name || '')}
                                </div>
                            )}
                            <button onClick={() => userAvatarRef.current?.click()} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="w-6 h-6" />
                            </button>
                            <input type="file" ref={userAvatarRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                        </div>
                        <Input id="userName" label="Nombre Completo" value={userName} onChange={(e) => setUserName(e.target.value)} className="text-center" />
                        <p className="text-sm text-foreground/60 mt-2">{session?.user?.email}</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleUserSaveChanges} disabled={!userHaveTextChanged || isSavingUser}>
                        {isSavingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isSavingUser ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </Card>

            <Card isClickable={false} className="lg:col-span-2 flex flex-col">
                {canEditCompany ? (
                    <form onSubmit={formik.handleSubmit} className="flex flex-col flex-grow">
                        <div className="flex-grow">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><Building /> Datos de la Empresa</h2>
                            {isLoadingCompany ? (
                                <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Input id="name" label="Nombre de tu PYME" {...formik.getFieldProps('name')} />
                                        {formik.touched.name && formik.errors.name ? <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div> : null}
                                    </div>
                                    <div>
                                        <label htmlFor="pais" className="block mb-2 text-sm font-medium text-foreground/80">País de la empresa</label>
                                        <select id="pais" {...formik.getFieldProps('pais')} className="w-full px-4 py-3 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                            {paises.map(pais => <option key={pais.value} value={pais.value}>{pais.label}</option>)}
                                        </select>
                                        {formik.touched.pais && formik.errors.pais ? <div className="text-red-500 text-xs mt-1">{formik.errors.pais}</div> : null}
                                    </div>
                                     <div>
                                        <Input id="razonSocial" label="Razón Social" {...formik.getFieldProps('razonSocial')} />
                                        {formik.touched.razonSocial && formik.errors.razonSocial ? <div className="text-red-500 text-xs mt-1">{formik.errors.razonSocial}</div> : null}
                                    </div>
                                    <div>
                                        <Input id="rut_Cuit" label={getIdentificacionLabel(formik.values.pais)} {...formik.getFieldProps('rut_Cuit')} />
                                        {formik.touched.rut_Cuit && formik.errors.rut_Cuit ? <div className="text-red-500 text-xs mt-1">{formik.errors.rut_Cuit}</div> : null}
                                    </div>
                                    <div>
                                        <Input id="rubroPrincipal" label="Rubro Principal" {...formik.getFieldProps('rubroPrincipal')} />
                                        {formik.touched.rubroPrincipal && formik.errors.rubroPrincipal ? <div className="text-red-500 text-xs mt-1">{formik.errors.rubroPrincipal}</div> : null}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button type="submit" disabled={!formik.dirty || formik.isSubmitting || isLoadingCompany}>
                                {formik.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {formik.isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <Lock className="w-16 h-16 text-foreground/30 mb-4" />
                        <h2 className="text-xl font-bold text-foreground mb-2">Acceso Restringido</h2>
                        <p className="text-foreground/70 mb-4">
                            Solo el propietario de la empresa puede editar estos datos.
                        </p>
                        <p className="text-sm text-foreground/50">
                            Contacta al propietario si necesitas actualizar información de la empresa.
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}