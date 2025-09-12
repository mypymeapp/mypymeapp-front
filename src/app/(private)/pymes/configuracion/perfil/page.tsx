'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Upload, Building, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRef, useEffect } from 'react';

const paises = [
    { value: 'AR', label: 'Argentina' },
    { value: 'UY', label: 'Uruguay' },
    { value: 'CL', label: 'Chile' },
    { value: 'ES', label: 'España' },
    { value: 'MX', label: 'México' },
];

export default function PerfilPage() {
    const { data: session, update } = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formik = useFormik({
        initialValues: {
            name: '',
            pais: 'AR',
            razonSocial: '',
            rut_Cuit: '',
            rubroPrincipal: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre de la empresa es requerido'),
            pais: Yup.string().required('El país es requerido'),
            razonSocial: Yup.string().required('La Razón Social es requerida'),
            rut_Cuit: Yup.string().required('La identificación fiscal es requerida'),
            rubroPrincipal: Yup.string().required('El rubro es requerido'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            if (!session?.user?.email || !session.accessToken) {
                toast.error('Sesión no válida.');
                setSubmitting(false);
                return;
            }
            setSubmitting(true);
            try {
                const companyData = {
                    ...values,
                    mail: session.user.email,
                    password: "password_provisional_123"
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.accessToken}`
                    },
                    body: JSON.stringify(companyData)
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Error al guardar la empresa.');
                }
                
                const newCompany = await res.json();

                await update({
                    user: {
                        ...session.user,
                        companyId: newCompany.id,
                        companyName: newCompany.name,
                    }
                });

                toast.success('¡Datos de la empresa guardados con éxito!');
            } catch (error) {
                toast.error(error.message);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const isCompanyConfigured = !!session?.user?.companyName;

    const getIdentificacionLabel = (pais: string) => {
        switch (pais) {
          case 'AR': return 'CUIT (Sin guiones)';
          case 'UY': case 'CL': return 'RUT (Sin puntos ni guiones)';
          case 'ES': return 'NIF';
          case 'MX': return 'RFC';
          default: return 'Identificación Fiscal';
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

            {isCompanyConfigured ? (
                <Card isClickable={false}>
                    <div className="flex items-center gap-4 text-green-400">
                        <CheckCircle className="w-8 h-8" />
                        <div>
                             <h2 className="text-xl font-bold">¡Todo listo!</h2>
                             <p className="text-foreground/70 mt-1">
                                Tu empresa <span className="font-bold text-primary">{session.user.companyName}</span> está configurada.
                            </p>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card isClickable={false}>
                    <div className="flex items-center gap-4 mb-6 text-yellow-400">
                        <Building className="w-8 h-8" />
                        <div>
                            <h2 className="text-xl font-bold">¡Completa tu perfil!</h2>
                            <p className="text-foreground/70">Registra los datos de tu empresa para desbloquear todo el potencial de la aplicación.</p>
                        </div>
                    </div>
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Input id="name" label="Nombre de tu PYME" {...formik.getFieldProps('name')} />
                                {formik.touched.name && formik.errors.name ? <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div> : null}
                            </div>
                            <div>
                                <label htmlFor="pais" className="block text-sm font-medium text-foreground/80 mb-2">País</label>
                                <select id="pais" {...formik.getFieldProps('pais')} className="w-full px-4 py-3 text-foreground bg-background border border-border rounded-lg">
                                    {paises.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
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
                        </div>
                        <div>
                            <Input id="rubroPrincipal" label="Rubro Principal" {...formik.getFieldProps('rubroPrincipal')} />
                            {formik.touched.rubroPrincipal && formik.errors.rubroPrincipal ? <div className="text-red-500 text-xs mt-1">{formik.errors.rubroPrincipal}</div> : null}
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? 'Guardando...' : 'Guardar Datos de la Empresa'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
}