


"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NuevoClientePage() {
    const { data: session } = useSession();
    const router = useRouter();

    const formik = useFormik({
        // 🔹 Cambiamos los nombres de los campos para que coincidan con la API (Customer)
        initialValues: {
            name: '',
            email: '',
            phone: '',
            notes: '',
        },
        // 🔹 Validamos los campos de la nueva API
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre es requerido'),
            email: Yup.string().email('Ingresa un email válido').required('El email es requerido'),
            phone: Yup.string(),
            notes: Yup.string(),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            if (!session?.user?.companyId) {
                toast.error("No se encontró el ID de la compañía en la sesión.");
                setSubmitting(false);
                return;
            }
            setSubmitting(true);
            try {
          
                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.accessToken}`,
                    },
                    body: JSON.stringify({
                        name: values.name,
                        email: values.email,
                        phone: values.phone,
                        notes: values.notes,
                        memberSince: new Date().toISOString(), // Fecha de alta
                        companyId: session.user.companyId, // ID de la compañía del usuario
                    }),
                });
                if (!res.ok) throw new Error('Error al crear el cliente');
                toast.success('¡Cliente creado con éxito!');
                router.push(PATHROUTES.pymes.clientes);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Error desconocido');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={PATHROUTES.pymes.clientes}><Button variant="outline" className="px-3"><ArrowLeft className="h-5 w-5" /></Button></Link>
                <h1 className="text-3xl font-bold text-foreground">Crear Nuevo Cliente</h1>
            </div>
            <Card isClickable={false}>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 🔹 Inputs con los nuevos IDs y nombres */}
                        <div>
                            <Input id="name" label="Nombre del Cliente" {...formik.getFieldProps('name')} />
                            {formik.touched.name && formik.errors.name ? <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div> : null}
                        </div>
                        <div>
                            <Input id="email" label="Email" type="email" {...formik.getFieldProps('email')} />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
                        </div>
                        <div>
                            <Input id="phone" label="Teléfono" {...formik.getFieldProps('phone')} />
                        </div>
                        <div>
                            <Input id="notes" label="Observaciones" {...formik.getFieldProps('notes')} />
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Guardando...' : 'Guardar Cliente'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
